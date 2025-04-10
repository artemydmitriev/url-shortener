import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/:slug*'],
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/file.svg') ||
    pathname.startsWith('/window.svg') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/urls')
  ) {
    return NextResponse.next()
  }

  const url = new URL(process.env.SERVER_INTERNAL!)
  url.pathname = pathname
  url.search = search

  return NextResponse.rewrite(url)
}
