/**
 * Course Player Types
 * Types for the course video player component
 */

import type { ChapterItem, EnrollmentProgress } from './index'

/**
 * Backend API Response Structure for Enrolled Course
 * This is what the backend returns from GET /api/v1/enrollment/enrolled/:courseId
 * 
 * The backend returns courseContent as an array of chapter objects with:
 * - chapterId: string
 * - chapterTitle: string  
 * - chapterContent: ChapterItem[] (the items array from the chapter)
 */
export interface EnrolledCourseChapter {
  chapterId: string
  chapterTitle: string
  chapterContent: ChapterItem[]
}

/**
 * Enrolled Course for Course Player
 * This is the complete structure passed to CoursePlayer component
 * Matches the backend response from getEnrolledCourseDetails
 */
export interface EnrolledCourseForPlayer {
  _id: string
  title: string
  description: string
  whatYouWillLearn: string[]
  category: string
  level: "beginner" | "intermediate" | "advanced"
  instructor: {
    _id?: string
    name: string
    avatar?: {
      public_id: string | null
      url: string
    } | null
  }
  courseTitle: string
  courseThumbnail: {
    public_id: string | null
    url: string
  }
  courseContent: EnrolledCourseChapter[]
  isEnrolled: true
  enrollmentDate: string
  paymentStatus: "pending" | "free" | "paid"
  amountPaid: number
  enrollmentId: string
  progress: EnrollmentProgress
}

/**
 * Player Data with Chapter and Lecture Indices
 * Used internally by CoursePlayer for navigation
 * Extends ChapterItem and adds navigation indices
 */
export interface PlayerData extends ChapterItem {
  chapter: number  // 1-indexed for display
  lecture: number  // 1-indexed for display
  
  // Legacy field aliases for backward compatibility
  title?: string
  videoUrl?: string
  duration?: number
}

/**
 * Helper type to access chapter content items
 * This ensures type safety when accessing chapterContent in CoursePlayer
 */
export type ChapterContentAccessor = {
  chapterContent: ChapterItem[]
}

/**
 * Type guard to check if an object has chapterContent property
 */
export function hasChapterContent(obj: any): obj is ChapterContentAccessor {
  return obj && typeof obj === 'object' && 'chapterContent' in obj
}

/**
 * Safe accessor for chapter items
 * Returns the items array from a chapter object
 */
export function getChapterItems(chapter: any): ChapterItem[] {
  // Backend returns chapterContent in enrolled course details
  if (hasChapterContent(chapter)) {
    return chapter.chapterContent
  }
  // Fallback for other API responses that might use 'items'
  if (chapter && typeof chapter === 'object' && 'items' in chapter) {
    return chapter.items
  }
  return []
}

