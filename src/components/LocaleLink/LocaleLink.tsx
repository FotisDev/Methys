"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { type ComponentProps, forwardRef } from "react";
import { localizePath } from "@/_lib/localizePath";

type LinkProps = ComponentProps<typeof NextLink>;

// Drop-in replacement for next/link that keeps the current locale in internal hrefs,
// so links don't bounce through the middleware's locale redirect.
const LocaleLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocaleLink(
  { href, ...props },
  ref,
) {
  const { lang } = useParams<{ lang?: string }>();

  const localizedHref =
    typeof href === "string"
      ? localizePath(href, lang)
      : href.pathname
        ? { ...href, pathname: localizePath(href.pathname, lang) }
        : href;

  return <NextLink ref={ref} href={localizedHref} {...props} />;
});

export default LocaleLink;

export function useLocalizedPath() {
  const { lang } = useParams<{ lang?: string }>();
  return (path: string) => localizePath(path, lang);
}
