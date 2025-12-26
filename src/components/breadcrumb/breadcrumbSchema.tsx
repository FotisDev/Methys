import Link from "next/link";
import { Fragment } from "react";
import SchemaMarkUp from "../schemas/SchemaMarkUp";

type breadcrumbObject = {
  "@type": string;
  position: number;
  name: string;
  item: string;
}[];

export type itemWithClassName = {
  items: {
    name: string;
    slug: string;
  }[];
};
export const Breadcrumbs = ({ items}: itemWithClassName) => {
  const breadcrumbs: breadcrumbObject = [];

  if (items && items.length > 0) {
    items.forEach((item, i) => {
      breadcrumbs.push({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.slug}`,
      });
    });
  }

  const markup = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };

  return (
    <section id={"breadcrumbs"} className={` mb-2 sm:mb-4 `}>
      <SchemaMarkUp markup={markup} />
      <div className={`flex gap-2 items-center flex-wrap text-base sm:text-xl`}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <Fragment key={index}>
              <Link
                className={`relative block ${
                  isLastItem ? "opacity-100" : "opacity-80"
                }`}
                href={`${item.slug}`}
              >
                {item.name}
              </Link>
              {!isLastItem && <span className="">/</span>}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
};
