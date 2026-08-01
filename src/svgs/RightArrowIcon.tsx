export default function RightArrowIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12H18M18 12L13 7M18 12L13 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
