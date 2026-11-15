"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "@/components/LocaleLink/LocaleLink";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getReviewEligibility,
  submitReview,
  type ReviewEligibility,
  type ReviewFormState,
} from "@/_lib/backend/reviews/action";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { StarIcon } from "./Stars";
import {
  MAX_REVIEW_PHOTOS,
  MAX_REVIEW_PHOTO_BYTES,
} from "@/_lib/utils/reviews";
import { cn } from "@/_lib/utils/cn";

const initialState: ReviewFormState = { status: "idle", message: "" };

export default function ReviewForm({ productId }: { productId: number }) {
  const t = useT();
  const { isAuthenticated, isLoading } = useAuth();
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(
    null,
  );
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [state, formAction, isPending] = useActionState(
    submitReview,
    initialState,
  );

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setEligibility("login");
      return;
    }
    let cancelled = false;
    getReviewEligibility(productId)
      .then((result) => !cancelled && setEligibility(result))
      .catch(() => !cancelled && setEligibility(null));
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, productId]);

  if (state.status === "success") {
    return (
      <p role="status" className={cn("text-sm text-vintage-green")}>
        {t("reviews.thanks")}
      </p>
    );
  }

  if (eligibility === "login") {
    return (
      <Link
        href="/login"
        className={cn(
          "text-sm underline underline-offset-4 hover:text-vintage-brown",
        )}
      >
        {t("reviews.loginToReview")}
      </Link>
    );
  }

  if (eligibility === "not-purchased") {
    return (
      <p className={cn("text-sm text-gray-500")}>{t("reviews.notPurchased")}</p>
    );
  }

  if (eligibility === "already-reviewed") {
    return (
      <p className={cn("text-sm text-gray-500")}>
        {t("reviews.alreadyReviewed")}
      </p>
    );
  }

  if (eligibility !== "eligible") return null;

  const shown = hovered || rating;

  return (
    <form action={formAction} className={cn("space-y-4 max-w-xl")}>
      <h3 className={cn("text-base font-medium")}>
        {t("reviews.writeReview")}
      </h3>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating || ""} />

      <fieldset>
        <legend className={cn("text-sm mb-1")}>{t("reviews.rating")}</legend>
        <div className={cn("flex gap-1")} onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={t("reviews.stars", { rating: n })}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              className={cn(
                "w-7 h-7 cursor-pointer",
                n <= shown ? "text-vintage-green" : "text-gray-300",
              )}
            >
              <StarIcon />
            </button>
          ))}
        </div>
      </fieldset>

      <label className={cn("block text-sm")}>
        {t("reviews.reviewTitle")}
        <input
          name="title"
          maxLength={120}
          className={cn("mt-1 w-full border border-gray-300 p-2 text-sm")}
        />
      </label>

      <label className={cn("block text-sm")}>
        {t("reviews.body")}
        <textarea
          name="body"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder={t("reviews.bodyPlaceholder")}
          className={cn("mt-1 w-full border border-gray-300 p-2 text-sm")}
        />
      </label>

      <label className={cn("block text-sm")}>
        {t("reviews.photos")}
        <input
          type="file"
          name="photos"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            // Checked again on the server; this just gives instant feedback.
            const files = Array.from(e.target.files ?? []);
            const tooMany = files.length > MAX_REVIEW_PHOTOS;
            const tooBig = files.some((f) => f.size > MAX_REVIEW_PHOTO_BYTES);
            e.target.setCustomValidity(
              tooMany
                ? t("reviews.errors.photoCount")
                : tooBig
                  ? t("reviews.errors.photoSize")
                  : "",
            );
            e.target.reportValidity();
          }}
          className={cn(
            "mt-1 block w-full text-xs file:mr-3 file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-xs",
          )}
        />
        <span className={cn("block text-xs text-gray-500 mt-1")}>
          {t("reviews.photosHint")}
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className={cn("text-xs text-red-600")}>
          {t(state.message as MessageKey)}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "bg-vintage-green text-white px-8 py-3 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-60 cursor-pointer",
        )}
      >
        {isPending ? t("reviews.submitting") : t("reviews.submit")}
      </button>
    </form>
  );
}
