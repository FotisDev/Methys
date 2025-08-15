import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstname, lastname, telephone, birthday } = body;

    // Debug: Log what we received
    console.log("Received data:", { email, password, firstname, lastname, telephone, birthday });

    // Validate required fields
    if (!email || !password || !firstname) {
      console.log("Validation failed:", { 
        email: !!email, 
        password: !!password, 
        firstname: !!firstname 
      });
      return NextResponse.json(
        { error: "Email, password, and firstname are required" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: signUpData, error: signUpError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const userId = signUpData.user.id;

    // Insert into your custom users table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        firstname,
        lastname: lastname || '', // Provide default if empty
        email,
        telephone: telephone || '', // Provide default if empty
        birthday: birthday || null, // Provide null if empty
        role: "user",
      },
    ]);

    if (insertError) {
      console.error("User table insert error:", insertError);
      
      // IMPORTANT: Clean up the auth user if custom user creation fails
      try {
        await supabase.auth.admin.deleteUser(userId);
        console.log("Cleaned up auth user after failed insert");
      } catch (cleanupError) {
        console.error("Failed to cleanup auth user:", cleanupError);
      }
      
      return NextResponse.json(
        { error: `Failed to create user profile: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}