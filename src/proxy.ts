import { NextResponse, type NextRequest } from 'next/server'

/**
 * English pages have no prefix (/safaris) and Norwegian ones live under /no (/no/safaris).
 * Both are served by app/(frontend)/[lang], so English paths are rewritten to /en internally.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/no' || pathname.startsWith('/no/')) return NextResponse.next()
  // One address per page: /en/safaris redirects to /safaris.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.redirect(new URL((pathname.slice(3) || '/') + search, request.url), 308)
  }
  return NextResponse.rewrite(new URL(`/en${pathname === '/' ? '' : pathname}${search}`, request.url))
}

export const config = {
  // Everything except the admin, APIs, Next.js internals and files such as /favicon.png.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
