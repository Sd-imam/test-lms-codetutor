'use server'

/**
 * Server Actions for Course Operations
 * Following Next.js 16 best practices
 */

import 'server-only'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Helper to get cookie header for API calls
async function getCookieHeader() {
  const cookieStore = await cookies()
  return cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')
}

/**
 * Create a new course
 */
export async function createCourseAction(formData: FormData): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as string,
      price: parseFloat(formData.get('price') as string),
      discount: formData.get('discount') ? parseFloat(formData.get('discount') as string) : 0,
      thumbnail: formData.get('thumbnail') as string,
      stacks: JSON.parse(formData.get('stacks') as string || '[]'),
      requirements: JSON.parse(formData.get('requirements') as string || '[]'),
      whatYouWillLearn: JSON.parse(formData.get('whatYouWillLearn') as string || '[]'),
    }

    const response = await fetch(`${API_URL}/api/v1/courses/create`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(courseData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create course' }))
      throw new Error(error.message || 'Failed to create course')
    }

    const data = await response.json()
    const courseId = data.data?._id || data.course?._id
    const courseTitle = data.data?.title || data.course?.title || 'Course'

    // Revalidate courses list
    revalidatePath('/instructor/courses')
    revalidateTag('instructor-courses', 'default')
    revalidateTag('courses', 'default')
    
    // Redirect to courses list with success message
    redirect(`/instructor/courses?success=created&title=${encodeURIComponent(courseTitle)}`)
  } catch (error) {
    // Check if it's a redirect error (Next.js uses digest starting with NEXT_REDIRECT)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error // Re-throw redirect/notFound errors
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create course',
    }
  }
}

/**
 * Update an existing course
 */
export async function updateCourseAction(
  courseId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const updates: Record<string, unknown> = {}
    
    // Extract fields from FormData
    formData.forEach((value, key) => {
      if (key === 'stacks' || key === 'requirements' || key === 'whatYouWillLearn') {
        updates[key] = JSON.parse(value as string)
      } else if (key === 'price' || key === 'discount') {
        updates[key] = parseFloat(value as string)
      } else {
        updates[key] = value
      }
    })

    const response = await fetch(`${API_URL}/api/v1/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update course' }))
      throw new Error(error.message || 'Failed to update course')
    }

    const data = await response.json()

    // Revalidate paths and tags
    revalidatePath(`/instructor/courses/${courseId}`)
    revalidatePath('/instructor/courses')
    revalidatePath(`/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag('instructor-courses', 'default')
    revalidateTag('courses', 'default')

    return { success: true, data: data.data || data.course }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update course',
    }
  }
}

/**
 * Delete a course
 */
export async function deleteCourseAction(courseId: string): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete course' }))
      throw new Error(error.message || 'Failed to delete course')
    }

    // Revalidate paths
    revalidatePath('/instructor/courses')
    revalidateTag('instructor-courses', 'default')
    revalidateTag(`course-${courseId}`, 'default')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete course',
    }
  }
}

/**
 * Create a new chapter
 */
export async function createChapterAction(
  courseId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const chapterData = {
      title: formData.get('title') as string,
      course: courseId,
      order: formData.get('order') ? parseInt(formData.get('order') as string) : undefined,
    }

    const response = await fetch(`${API_URL}/api/v1/chapters`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(chapterData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create chapter' }))
      throw new Error(error.message || 'Failed to create chapter')
    }

    const data = await response.json()

    // Revalidate course page
    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-chapters-${courseId}`, 'default')

    return { success: true, data: data.data || data.chapter }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create chapter',
    }
  }
}

/**
 * Update a chapter
 */
export async function updateChapterAction(
  courseId: string,
  chapterId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const updates: Record<string, unknown> = {}
    formData.forEach((value, key) => {
      if (key === 'order') {
        updates[key] = parseInt(value as string)
      } else {
        updates[key] = value
      }
    })

    const response = await fetch(`${API_URL}/api/v1/chapters/${chapterId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update chapter' }))
      throw new Error(error.message || 'Failed to update chapter')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-chapters-${courseId}`, 'default')

    return { success: true, data: data.data || data.chapter }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update chapter',
    }
  }
}

/**
 * Delete a chapter
 */
export async function deleteChapterAction(
  courseId: string,
  chapterId: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/chapters/${chapterId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete chapter' }))
      throw new Error(error.message || 'Failed to delete chapter')
    }

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-chapters-${courseId}`, 'default')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete chapter',
    }
  }
}

/**
 * Create a new lecture
 */
export async function createLectureAction(
  courseId: string,
  chapterId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const lectureData = {
      title: formData.get('title') as string,
      course: courseId,
      chapter: chapterId,
      videoUrl: formData.get('videoUrl') as string,
      duration: parseInt(formData.get('duration') as string),
      order: formData.get('order') ? parseInt(formData.get('order') as string) : undefined,
      isPreview: formData.get('isPreview') === 'true',
      resources: formData.get('resources') as string,
    }

    const response = await fetch(`${API_URL}/api/v1/lectures`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(lectureData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create lecture' }))
      throw new Error(error.message || 'Failed to create lecture')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-chapters-${courseId}`, 'default')

    return { success: true, data: data.data || data.lecture }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lecture',
    }
  }
}

/**
 * Update a lecture
 */
export async function updateLectureAction(
  courseId: string,
  lectureId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const updates: Record<string, unknown> = {}
    formData.forEach((value, key) => {
      if (key === 'duration' || key === 'order') {
        updates[key] = parseInt(value as string)
      } else if (key === 'isPreview') {
        updates[key] = value === 'true'
      } else {
        updates[key] = value
      }
    })

    const response = await fetch(`${API_URL}/api/v1/lectures/${lectureId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update lecture' }))
      throw new Error(error.message || 'Failed to update lecture')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag('courses', 'default')

    return { success: true, data: data.data || data.lecture }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lecture',
    }
  }
}

/**
 * Delete a lecture
 */
export async function deleteLectureAction(
  courseId: string,
  lectureId: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/lectures/${lectureId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete lecture' }))
      throw new Error(error.message || 'Failed to delete lecture')
    }

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag('courses', 'default')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lecture',
    }
  }
}

/**
 * Create a quiz
 */
export async function createQuizAction(
  courseId: string,
  chapterId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const quizData = {
      course: courseId,
      chapter: chapterId,
      title: formData.get('title') as string,
      order: formData.get('order') ? parseInt(formData.get('order') as string) : undefined,
      duration: formData.get('duration') ? parseInt(formData.get('duration') as string) : undefined,
      questions: JSON.parse(formData.get('questions') as string || '[]'),
    }

    const response = await fetch(`${API_URL}/api/v1/quizes`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(quizData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create quiz' }))
      throw new Error(error.message || 'Failed to create quiz')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag('courses', 'default')

    return { success: true, data: data.data || data.quiz }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create quiz',
    }
  }
}

/**
 * Update a quiz
 */
export async function updateQuizAction(
  courseId: string,
  quizId: string,
  formData: FormData
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const updates: Record<string, unknown> = {}
    formData.forEach((value, key) => {
      if (key === 'order' || key === 'duration') {
        updates[key] = parseInt(value as string)
      } else if (key === 'questions') {
        updates[key] = JSON.parse(value as string)
      } else {
        updates[key] = value
      }
    })

    const response = await fetch(`${API_URL}/api/v1/quizes/${quizId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update quiz' }))
      throw new Error(error.message || 'Failed to update quiz')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag('courses', 'default')

    return { success: true, data: data.data || data.quiz }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update quiz',
    }
  }
}

/**
 * Delete a quiz
 */
export async function deleteQuizAction(
  courseId: string,
  quizId: string
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/quizes/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete quiz' }))
      throw new Error(error.message || 'Failed to delete quiz')
    }

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag('courses', 'default')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete quiz',
    }
  }
}

/**
 * Reorder chapters in a course
 */
export async function reorderChaptersAction(
  courseId: string,
  orderData: { chapterId: string; newOrder: number }[]
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/chapters/reorder`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId,
        orderData,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder chapters' }))
      throw new Error(error.message || 'Failed to reorder chapters')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidateTag(`course-${courseId}`, 'default')
    revalidateTag(`course-chapters-${courseId}`, 'default')

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder chapters',
    }
  }
}

/**
 * Reorder lectures in a chapter
 */
export async function reorderLecturesAction(
  chapterId: string,
  reorderData: { lectureId: string; newOrder: number }[]
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/lectures/reorder`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapterId,
        reorderData,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder lectures' }))
      throw new Error(error.message || 'Failed to reorder lectures')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${data.courseId}`)
    revalidateTag(`course-chapters-${data.courseId}`, 'default')
    revalidateTag(`course-${data.courseId}`, 'default')

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder lectures',
    }
  }
}

/**
 * Reorder chapter content (lectures and quizzes)
 */
export async function reorderChapterContentAction(
  chapterId: string,
  items: Array<{ id: string; type: 'lecture' | 'quiz'; order: number }>
): Promise<ActionResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/v1/chapters/${chapterId}/reorder-content`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder content' }))
      throw new Error(error.message || 'Failed to reorder content')
    }

    const data = await response.json()

    revalidatePath(`/instructor/courses/${data.courseId}`)
    revalidateTag(`course-chapters-${data.courseId}`, 'default')
    revalidateTag(`course-${data.courseId}`, 'default')

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder content',
    }
  }
}

