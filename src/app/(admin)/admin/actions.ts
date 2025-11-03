'use server'

/**
 * Server Actions for Admin Operations
 * These handle mutations and can be called from Client Components
 */

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ActionResult {
  success: boolean
  error?: string
}

async function serverAction<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cookie': cookieHeader,
    ...(options.headers as Record<string, string>),
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// ============================================================================
// User Actions
// ============================================================================

export async function updateUserRoleAction(userId: string, role: string): Promise<ActionResult> {
  try {
    await serverAction(`/api/v1/user/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    await serverAction(`/api/v1/user/${userId}`, {
      method: 'DELETE',
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================================================
// Course Actions
// ============================================================================

export async function deleteCourseAction(courseId: string): Promise<ActionResult> {
  try {
    await serverAction(`/api/v1/courses/${courseId}`, {
      method: 'DELETE',
    })
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================================================
// Coupon Actions
// ============================================================================

export async function createCouponAction(data: {
  code: string
  discountValue: number
  appliesTo?: string
  expiresAt?: string
  isActive?: boolean
  usageLimit?: number
}): Promise<ActionResult> {
  try {
    await serverAction('/api/v1/coupon', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    revalidatePath('/admin/coupons')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateCouponAction(
  couponId: string,
  data: {
    code?: string
    discountValue?: number
    appliesTo?: string
    expiresAt?: string
    isActive?: boolean
    usageLimit?: number
  }
): Promise<ActionResult> {
  try {
    await serverAction(`/api/v1/coupon/${couponId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    revalidatePath('/admin/coupons')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteCouponAction(couponId: string): Promise<ActionResult> {
  try {
    await serverAction(`/api/v1/coupon/${couponId}`, {
      method: 'DELETE',
    })
    revalidatePath('/admin/coupons')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

