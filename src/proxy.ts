import { type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  // 1. Run next-intl middleware to handle locales
  const response = intlMiddleware(request)

  // 2. Pass the response to Supabase to update the session (cookies)
  // To do this properly, we need to adapt updateSession to accept a pre-existing response,
  // or we can just update the Supabase middleware to handle it.
  // Wait, updateSession creates its own response right now. Let's modify updateSession next.
  
  return await updateSession(request, response)
}

export const config = {
  matcher: [
    '/',
    '/(fr)/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
}

