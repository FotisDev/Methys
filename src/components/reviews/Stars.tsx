// Read-only star display; the label carries the rating for screen readers.
export default function Stars({
  rating,
  label,
  className = "w-4 h-4",
}: {
  rating: number;
  label: string;
  className?: string;
}) {
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.min(Math.max(rating - (n - 1), 0), 1);
        return (
          <span key={n} className={`relative inline-block ${className}`}>
            <StarIcon className="absolute inset-0 text-gray-300" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon className="text-vintage-green" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`w-full h-full ${className}`}
      style={{ minWidth: "100%" }}
    >
      <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" />
    </svg>
  );
}
