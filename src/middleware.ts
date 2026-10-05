import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n.config";
import { LOCALE_HEADER } from "@/i18n/constants";

// Μόνο αυτά τα paths χρειάζονται auth check
const protectedPaths = ["/offers", "/product-entry"];
const authPaths = ["/login", "/createAccount"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Locale redirect — γρήγορο, χωρίς Supabase
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    // 308 so search engines consolidate signals on the locale-prefixed URL.
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}${pathname}${request.nextUrl.search}`,
        request.url,
      ),
      308,
    );
  }

  const pathnameWithoutLocale = `/${pathname.split("/").slice(2).join("/")}`;
  const locale = pathname.split("/")[1];

  // Lets server components read the locale without receiving the [lang] param.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  // 2. Αν δεν είναι protected/auth path, skip το Supabase εντελώς
  const needsAuthCheck =
    protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p)) ||
    authPaths.some((p) => pathnameWithoutLocale === p);

  if (!needsAuthCheck) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 3. Supabase μόνο για protected paths
  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          requestHeaders.set("cookie", request.headers.get("cookie") ?? "");
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p))
  ) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (user && authPaths.some((p) => pathnameWithoutLocale === p)) {
    return NextResponse.redirect(new URL(`/${locale}/offers`, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|(?:[^/]+/)?llms\\.txt|(?:[^/]+/)?sitemaps/.*|(?:[^/]+/)?sitemap.*\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3|webm|ogg)$).*)",
  ],
};
