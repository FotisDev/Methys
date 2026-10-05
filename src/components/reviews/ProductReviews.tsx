import type { Locale } from "@/i18n.config";
import type { Translator } from "@/i18n/translate";
import { translateCount } from "@/i18n/translate";
import { summarizeReviews, type ProductReview } from "@/_lib/utils/reviews";
import Stars from "./Stars";
import ReviewForm from "./ReviewForm";

export default function ProductReviews({
  productId,
  reviews,
  locale,
  t,
}: {
  productId: number;
  reviews: ProductReview[];
  locale: Locale;
  t: Translator;
}) {
  const { count, average } = summarizeReviews(reviews);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="mx-auto px-4 sm:px-6 py-12 border-t mt-12"
    >
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <h2 id="reviews-heading" className="text-xl font-light tracking-wide">
          {t("reviews.title")}
        </h2>
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars
              rating={average}
              label={t("reviews.stars", { rating: average })}
            />
            <span>{average.toFixed(1)}</span>
            <span className="text-gray-500">
              ({translateCount(t, "reviews.count", count)})
            </span>
          </div>
        )}
      </div>

      {count === 0 ? (
        <p className="text-sm text-gray-600 mb-8">{t("reviews.noReviews")}</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 mb-10">
          {reviews.map((review) => (
            <li key={review.id} className="border border-gray-200 p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Stars
                  rating={review.rating}
                  label={t("reviews.stars", { rating: review.rating })}
                />
                <time
                  dateTime={review.created_at}
                  className="text-xs text-gray-500"
                >
                  {dateFormat.format(new Date(review.created_at))}
                </time>
              </div>
              {review.title && (
                <p className="font-medium text-sm mb-1">{review.title}</p>
              )}
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {review.body}
              </p>
              <p className="mt-3 text-xs text-gray-500">
                {review.author_name} · {t("reviews.verifiedBuyer")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ReviewForm productId={productId} />
    </section>
  );
}
