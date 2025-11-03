import 'server-only' // Prevents this module from being imported on the client
import { cache } from 'react'
import { getCookieHeader, hasAuthCookies } from './cookie-utils'

export async function verifySession(): Promise<any | null> {
  try {
    // Check if auth cookies exist before making request
    const hasAuth = await hasAuthCookies()
    if (!hasAuth) return null

    // Get formatted cookie header
    const cookieHeader = await getCookieHeader()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    if (!res.ok) return null
    const json = await res.json().catch(() => null)
    return json?.data ?? null
  } catch {
    // Handle prerendering or cookie access errors gracefully
    return null
  }
}

export const getUser = cache(async () => {
  return verifySession()
})


