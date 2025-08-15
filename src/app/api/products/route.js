import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const JWT_SECRET = process.env.JWT_SECRET;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    // Διαβάζουμε το JWT token από τα cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.log("ewre", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Επαλήθευση ότι ο χρήστης υπάρχει
    const { data: userExists, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", decoded.userId)
      .single();

    if (userError || !userExists) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 400 }
      );
    }

    // Παίρνουμε τα δεδομένα του προϊόντος
    const body = await request.json();
    const { name, description, price, category, image_url, slug } = body;
    if (!image_url) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const { data, error } = await supabase.from("products").insert([
      {
        name,
        description,
        price,
        category_id: category,
        image_url,
        slug,
        user_id: decoded.userId,
      },
    ]);
    // .select()
    // .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
