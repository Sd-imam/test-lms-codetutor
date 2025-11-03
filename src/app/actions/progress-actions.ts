'use server'

/**
 * Server Actions for Progress Tracking
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
 * Update lecture progress
 */
export async function updateLectureProgressAction(
  lectureId: string,
  courseId: string,
  progressPercentage: number
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/progress/lecture/${lectureId}`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ progressPercentage }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update progress' }))
      throw new Error(error.message || 'Failed to update progress')
    }

    const data = await response.json()

    // Revalidate course progress
    revalidatePath(`/courses/${courseId}/learn`)
    revalidatePath('/dashboard/courses')
    revalidateTag(`course-progress-${courseId}`, 'default')
    revalidateTag('user-progress', 'default')

    return { success: true, data: data.data || data.progress }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update progress',
    }
  }
}

/**
 * Submit quiz answers
 */
export async function submitQuizAction(
  quizId: string,
  courseId: string,
  answers: number[]
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/quizes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answers }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to submit quiz' }))
      throw new Error(error.message || 'Failed to submit quiz')
    }

    const data = await response.json()

    // Revalidate course progress if quiz passed
    if (data.data?.score === 100) {
      revalidatePath(`/courses/${courseId}/learn`)
      revalidatePath('/dashboard/courses')
      revalidateTag(`course-progress-${courseId}`, 'default')
      revalidateTag('user-progress', 'default')
    }

    return { success: true, data: data.data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit quiz',
    }
  }
}

