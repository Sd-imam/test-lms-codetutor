/**
 * Cookie Utility Functions
 * Shared utilities for handling cookies in server-side code
 */

import 'server-only'
import { cookies } from 'next/headers'

/**
 * Get formatted cookie header string for API requests
 * Handles prerendering gracefully by returning empty string
 * 
 * @returns Cookie header string (e.g., "token1=value1; token2=value2")
 */
export async function getCookieHeader(): Promise<string> {
  try {
    const cookieStore = await cookies()
    return cookieStore
      .getAll()
      .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
      .join('; ')
  } catch {
    // During prerendering, cookies() may not be available
    // Return empty string to allow requests without auth
    return ''
  }
}

/**
 * Get a specific cookie value
 * 
 * @param name - Cookie name
 * @returns Cookie value or undefined
 */
export async function getCookie(name: string): Promise<string | undefined> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(name)?.value
  } catch {
    return undefined
  }
}

/**
 * Check if authentication cookies exist
 * 
 * @returns True if access or refresh token exists
 */
export async function hasAuthCookies(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const access = cookieStore.get('accessToken')?.value
    const refresh = cookieStore.get('refreshToken')?.value
    return Boolean(access || refresh)
  } catch {
    return false
  }
}

