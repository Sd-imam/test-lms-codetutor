'use server'

/**
 * Server Actions for Review Operations
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

async function getCookieHeader() {
  const cookieStore = await cookies()
  return cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')
}

/**
 * Create a course review
 */
export async function createReviewAction(
  courseId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const reviewData = {
      course: courseId, // Backend expects 'course' not 'courseId'
      rating: parseInt(formData.get('rating') as string),
      comment: formData.get('comment') as string,
    }

    const response = await fetch(`${API_URL}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create review' }))
      throw new Error(error.message || 'Failed to create review')
    }

    const data = await response.json()

    // Revalidate course pages to show new review
    revalidatePath(`/courses/${courseId}`)
    revalidatePath(`/courses/${courseId}/learn`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-reviews-${courseId}`, 'default')

    return { success: true, data: data.data || data.review }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create review',
    }
  }
}

/**
 * Update a course review
 */
export async function updateReviewAction(
  reviewId: string,
  courseId: string,
  rating: number,
  comment: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ rating, comment }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update review' }))
      throw new Error(error.message || 'Failed to update review')
    }

    const data = await response.json()

    // Revalidate course pages to show updated review
    revalidatePath(`/courses/${courseId}`)
    revalidatePath(`/courses/${courseId}/learn`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-reviews-${courseId}`, 'default')

    return { success: true, data: data.data || data.review }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update review',
    }
  }
}

/**
 * Delete a course review
 */
export async function deleteReviewAction(
  reviewId: string,
  courseId: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookieHeader,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete review' }))
      throw new Error(error.message || 'Failed to delete review')
    }

    // Revalidate course pages to remove deleted review
    revalidatePath(`/courses/${courseId}`)
    revalidatePath(`/courses/${courseId}/learn`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-reviews-${courseId}`, 'default')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete review',
    }
  }
}

