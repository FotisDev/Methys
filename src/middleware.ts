import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const locales = ['en', 'el', 'da'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
  console.log('middleware hit:', request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    console.log('redirecting to:', `/${defaultLocale}${pathname}`);
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  const pathnameWithoutLocale = `/${pathname.split('/').slice(2).join('/')}`;
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const locale = pathname.split('/')[1];

  if (!user && pathnameWithoutLocale.startsWith("/offers")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (!user && pathnameWithoutLocale.startsWith("/product-entry")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (user && (pathnameWithoutLocale === "/login" || pathnameWithoutLocale === "/createAccount")) {
    return NextResponse.redirect(new URL(`/${locale}/offers`, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3|webm|ogg)$).*)",
  ],
};