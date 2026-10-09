"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { hasPurchasedProduct, reviewAuthorName } from "@/_lib/utils/reviews";
import { REVIEWS_TAG } from "./queries";

export type ReviewEligibility =
  "login" | "not-purchased" | "already-reviewed" | "eligible";

async function checkEligibility(productId: number) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { eligibility: "login" as const, user: null };

  const [{ data: orders }, { data: existing }] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("items")
      .eq("user_id", user.id)
      .eq("status", "paid"),
    supabaseAdmin
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (existing) return { eligibility: "already-reviewed" as const, user };
  if (!hasPurchasedProduct(orders ?? [], productId)) {
    return { eligibility: "not-purchased" as const, user };
  }
  return { eligibility: "eligible" as const, user };
}

export async function getReviewEligibility(
  productId: number,
): Promise<ReviewEligibility> {
  return (await checkEligibility(productId)).eligibility;
}

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const reviewSchema = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce
    .number({ invalid_type_error: "reviews.errors.rating" })
    .int()
    .min(1, "reviews.errors.rating")
    .max(5, "reviews.errors.rating"),
  title: z.string().trim().max(120).optional(),
  body: z
    .string()
    .trim()
    .min(10, "reviews.errors.body")
    .max(2000, "reviews.errors.body"),
});

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating") ?? undefined,
    title: formData.get("title") ?? undefined,
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "reviews.errors.failed",
    };
  }
  const { productId, rating, title, body } = parsed.data;

  try {
    // Re-checked here: the client-side eligibility check is only for the UI.
    const { eligibility, user } = await checkEligibility(productId);
    if (eligibility !== "eligible" || !user) {
      const messages = {
        login: "reviews.loginToReview",
        "not-purchased": "reviews.notPurchased",
        "already-reviewed": "reviews.alreadyReviewed",
      } as const;
      return { status: "error", message: messages[eligibility] };
    }

    const { error } = await supabaseAdmin.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      author_name: reviewAuthorName(
        user.user_metadata?.first_name,
        user.user_metadata?.last_name,
        "Customer",
      ),
      rating,
      title: title || null,
      body,
    });

    if (error) {
      if (error.code === "23505") {
        return { status: "error", message: "reviews.alreadyReviewed" };
      }
      console.error("Review insert failed:", error.message);
      return { status: "error", message: "reviews.errors.failed" };
    }

    updateTag(REVIEWS_TAG);
    return { status: "success", message: "reviews.thanks" };
  } catch (err) {
    console.error("Review submit failed:", err);
    return { status: "error", message: "reviews.errors.failed" };
  }
}
