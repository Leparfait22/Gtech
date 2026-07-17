import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { updateSession } from './utils/supabase/middleware'

// 1. Create the next-intl middleware for internationalization
const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  // 2. Generate the i18n response first
  const intlResponse = intlMiddleware(request)

  // 3. Pass the request and the i18n response to Supabase
  // This allows Supabase to refresh the auth token and set cookies on the existing response
  return await updateSession(request, intlResponse)
}

// 4. Configure the matcher to run on necessary routes
export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    '/(fr|en)/:path*',

    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}
