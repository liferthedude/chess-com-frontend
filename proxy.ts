import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((request) => {
  const isLoggedIn = !!request.auth
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
  const isErrorPage = request.nextUrl.pathname.startsWith('/auth-error')

  const isSentryTest = request.nextUrl.pathname === '/api/stats/solved-by-tag'

  if (isAuthRoute || isErrorPage || isSentryTest) return NextResponse.next()

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
