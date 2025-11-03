'use server'

/**
 * Server Actions for User Operations
 * Following Next.js 16 best practices
 */

import 'server-only'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Update user profile
 */
export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')

  try {
    const profileData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }

    const response = await fetch(`${API_URL}/api/v1/user/update-profile`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update profile' }))
      throw new Error(error.message || 'Failed to update profile')
    }

    const data = await response.json()

    // Revalidate profile paths
    revalidatePath('/profile')
    revalidateTag('user-profile', 'default')
    revalidateTag('user-notifications', 'default')

    return { success: true, data: data.data || data.user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

/**
 * Update user avatar
 */
export async function updateAvatarAction(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')

  try {
    const avatarData = {
      avatar: formData.get('avatar') as string, // base64 string
    }

    const response = await fetch(`${API_URL}/api/v1/user/update-profile-picture`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(avatarData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update avatar' }))
      throw new Error(error.message || 'Failed to update avatar')
    }

    const data = await response.json()

    revalidatePath('/profile')
    revalidateTag('user-profile', 'default')
    revalidateTag('user-notifications', 'default')

    return { success: true, data: data.data || data.user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update avatar',
    }
  }
}

/**
 * Reset user password
 */
export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')

  try {
    const passwordData = {
      password: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
    }

    const response = await fetch(`${API_URL}/api/v1/user/reset-password`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reset password' }))
      throw new Error(error.message || 'Failed to reset password')
    }

    const data = await response.json()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset password',
    }
  }
}

