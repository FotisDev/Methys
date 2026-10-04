import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided =
    request.headers.get('x-revalidate-secret') ??
    request.nextUrl.searchParams.get('secret');

  // Without this check anyone could repeatedly purge the cache and push all
  // traffic onto Supabase.
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get('tag');
  if (!tag) {
    return NextResponse.json({ error: 'Missing tag param' }, { status: 400 });
  }
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
