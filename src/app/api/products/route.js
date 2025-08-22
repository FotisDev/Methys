import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("categories") // make sure table name is correct
      .select("*");

    if (error) {
      console.error("Supabase error fetching categories:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json({ error: "No categories found" }, { status: 404 });
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
