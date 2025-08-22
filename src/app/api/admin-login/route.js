import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


export async function POST(request) {

   const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Check admin role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Get user from Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user exists in your custom users table
    let { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    // If user doesn't exist in users table, create it
    if (userError && userError.code === 'PGRST116') { // No rows returned
      console.log("User not found in users table, creating...");
      
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          firstname:'',
          lastname:'',
          role: 'admin' // or 'user' - set default role
        }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json(
          { success: false, message: "Failed to create user profile" },
          { status: 500 }
        );
      }
      
      user = newUser;
    } else if (userError) {
      // Some other error occurred
      console.error("Database error:", userError);
      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: authData.user.id,
        email: authData.user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      role: user.role || "user",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: user.role || "user",
      },
    });

    // Set JWT token in cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}