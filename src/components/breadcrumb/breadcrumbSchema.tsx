import Link from "@/components/LocaleLink/LocaleLink";
import { Fragment } from "react";
import SchemaMarkUp from "../schemas/SchemaMarkUp";
import BreadcrumbArrow from "@/svgs/breadcrumbArrow";
import { absoluteUrl } from "@/components/SEO/urls";
import type { Locale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

type breadcrumbObject = {
  "@type": string;
  position: number;
  name: string;
  item: string;
}[];

export type itemWithClassName = {
  locale: Locale;
  items: {
    name: string;
    slug: string;
  }[];
};
export const Breadcrumbs = ({ items, locale }: itemWithClassName) => {
  const breadcrumbs: breadcrumbObject = [];

  if (items && items.length > 0) {
    items.forEach((item, i) => {
      breadcrumbs.push({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.slug, locale),
      });
    });
  }

  const markup = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };

  return (
    <section id={"breadcrumbs"} className={cn("mb-2 sm:mb-4")}>
      <SchemaMarkUp markup={markup} />
      <div className={cn("flex gap-2 items-center flex-wrap text-sm")}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <Fragment key={index}>
              <Link
                className={cn(
                  "relative block",
                  isLastItem ? "opacity-50" : "opacity-100",
                )}
                href={`${item.slug}`}
              >
                {item.name}
              </Link>
              {!isLastItem && (
                <span className={cn("")}>
                  <BreadcrumbArrow />
                </span>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
};
