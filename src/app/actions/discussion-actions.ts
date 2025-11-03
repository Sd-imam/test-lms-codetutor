'use server'

/**
 * Server Actions for Discussion Operations
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
 * Create a new discussion/question
 */
export async function createDiscussionAction(
  lectureId: string,
  question: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/discussions`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        lecture: lectureId,
        question,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create discussion' }))
      throw new Error(error.message || 'Failed to create discussion')
    }

    const data = await response.json()

    // Revalidate lecture discussions
    revalidatePath(`/courses/${data.data?.course}/learn`)
    revalidateTag(`lecture-discussions-${lectureId}`, 'default')
    revalidateTag('discussions', 'default')

    return { success: true, data: data.data || data.discussion }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create discussion',
    }
  }
}

/**
 * Reply to a discussion
 */
export async function replyToDiscussionAction(
  discussionId: string,
  text: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/discussions/${discussionId}/answer`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reply to discussion' }))
      throw new Error(error.message || 'Failed to reply to discussion')
    }

    const data = await response.json()

    // Revalidate discussions
    revalidatePath(`/courses/${data.data?.course}/learn`)
    revalidateTag(`lecture-discussions-${data.data?.lecture}`, 'default')
    revalidateTag('discussions', 'default')

    return { success: true, data: data.data || data.answer }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reply to discussion',
    }
  }
}

