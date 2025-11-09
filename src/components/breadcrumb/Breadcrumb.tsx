"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  LinkclassName: string;
};

export default function Breadcrumb(LinkclassName: Props) {
  const pathname = usePathname();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0);

  const paths = pathSegments.map(
    (_, index) => `/${pathSegments.slice(0, index + 1).join("/")}`
  );

  return (
    <nav
      className={`flex items-center gap-1 text-sm text-vintage-green font-roboto mb-6 ${LinkclassName}`}
      aria-label="Breadcrumb"
    >
      <Link
        href={"/"}
        className={`hover:text-vintage-brown transition-colors `}
      >
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const href = paths[index];

        return (
          <div key={href} className="flex items-center gap-1">
            <span className="text-gray-400">/</span>
            {isLast ? (
              <span className="text-vintage-green capitalize">
                {decodeURIComponent(segment.replace(/-/g, " "))}
              </span>
            ) : (
              <Link
                href={href}
                className={`hover:text-vintage-brown  transition-colors capitalize `}
              >
                {decodeURIComponent(segment.replace(/-/g, " "))}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
