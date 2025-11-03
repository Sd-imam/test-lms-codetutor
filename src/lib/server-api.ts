/**
 * Server-side API functions
 * These run on the server and can be called from Server Components
 */

import 'server-only' // Prevents this module from being imported on the client
import { cache } from 'react'
import { getCookieHeader } from './cookie-utils'

import type {
  Course,
  Discussion,
  Coupon,
  Review,
  Certificate,
  Notification,
  Chapter,
  ChapterItem,
  DashboardStats,
  InstructorStats,
  CourseProgress,
  BackendEnrollmentItem,
} from "./types"

import type {
  AdminDashboardStatsResponse,
  UsersListResponse,
  CoursesListDataResponse,
  CouponsListResponse,
  CourseByIdResponse,
  FeaturedCoursesResponse,
  RecommendedCoursesResponse,
  EnrollmentsListDataResponse,
  CheckEnrollmentResponse,
  EnrolledCourseDetailsResponse,
  CourseProgressResponse,
  UserDashboardResponse,
  CourseReviewsResponse,
  InstructorReviewsResponse,
  CourseChaptersResponse,
  UserCertificatesResponse,
  CertificateByIdResponse,
  NotificationsDataResponse,
  LectureDiscussionsResponse,
  CourseDiscussionsResponse,
  UserDiscussionsResponse,
  DiscussionByIdResponse,
  PostDiscussionReplyResponse,
  CoursesByInstructorResponse,
  StudentsByInstructorResponse,
  StudentsByInstructorData,
  UsersListData,
  CoursesListData,
  EnrollmentsListData,
  InstructorReviewsData,
  DiscussionsListData,
  InstructorDashboardResponse,
  CourseAnalyticsResponse,
  QuizResponse,
  QuizResultsResponse,
} from "./types/api-responses"

import type { EnrolledCourseForPlayer } from "./types/course-player"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Public request function for non-authenticated endpoints (doesn't use cookies)
async function publicRequest<T>(endpoint: string, options: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  const config: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    ...options,
    headers,
    ...(options.next?.revalidate !== undefined ? {} : { cache: 'no-store' }),
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Server request function that forwards cookies from the request
async function serverRequest<T>(endpoint: string, options: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {}): Promise<T> {
  // Get formatted cookie header (handles prerendering gracefully)
  const cookieHeader = await getCookieHeader()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  // Forward cookies to backend if available
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader
  }

  const config: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    ...options,
    headers,
    credentials: "include",
    // Don't override cache if next.revalidate is set
    ...(options.next?.revalidate !== undefined ? {} : { cache: 'no-store' }),
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// ============================================================================
// Admin Dashboard APIs
// ============================================================================

export const getAdminDashboardStats = cache(async () => {
  try {
    const [userStatsResponse, coursesResponse] = await Promise.all([
      serverRequest<AdminDashboardStatsResponse>("/api/v1/user/stats"),
      serverRequest<{ data: Course[] }>("/api/v1/courses?limit=1000"),
    ])

    const courses = coursesResponse.data || []
    const totalCourses = courses.length
    const publishedCourses = courses.filter((c: Course) => c.status === 'published').length
    const draftCourses = totalCourses - publishedCourses

    // Ensure userStatsResponse.data exists and has all required properties
    const userStats = userStatsResponse.data || {
      totalUsers: 0,
      totalStudents: 0,
      totalInstructors: 0,
      totalAdmins: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
    }

    return {
      users: userStats,
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: draftCourses,
      },
      enrollments: {
        total: 0,
        active: 0,
        completed: 0,
      },
      revenue: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
      },
    }
  } catch (error) {
  
    // In development, log the error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to fetch admin dashboard stats:", error)
    }
    // Return default values on error
    return {
      users: {
        totalUsers: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalAdmins: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
      },
      courses: {
        total: 0,
        published: 0,
        draft: 0,
      },
      enrollments: {
        total: 0,
        active: 0,
        completed: 0,
      },
      revenue: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
      },
    }
  }
})

// ============================================================================
// User Management APIs
// ============================================================================

export async function getAllUsersServer(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
}): Promise<UsersListData> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  if (params?.search) queryParams.append("search", params.search)
  if (params?.role) queryParams.append("role", params.role)

  const queryString = queryParams.toString()
  const response = await serverRequest<UsersListResponse>(
    `/api/v1/user/all${queryString ? `?${queryString}` : ""}`
  )

  return response.data
}

// ============================================================================
// Course Management APIs
// ============================================================================

export async function getAllCoursesServer(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<CoursesListData> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  if (params?.search) queryParams.append("search", params.search)

  const queryString = queryParams.toString()
  const response = await serverRequest<CoursesListDataResponse>(
    `/api/v1/courses${queryString ? `?${queryString}` : ""}`
  )

  return {
    courses: response.data || [],
    total: response.meta?.total || response.data?.length || 0,
  }
}

// ============================================================================
// Coupon Management APIs
// ============================================================================

export async function getAllCouponsServer(): Promise<Coupon[]> {
  const response = await serverRequest<CouponsListResponse>("/api/v1/coupon")
  return response.data || []
}

export async function getCoursesForCoupons(): Promise<Course[]> {
  const response = await serverRequest<{ data: Course[] }>("/api/v1/courses?limit=1000")
  return response.data || []
}

// ============================================================================
// Public Course APIs
// ============================================================================

export async function getAllCoursesPublic(params?: {
  search?: string
  category?: string
  level?: string
  page?: number
  limit?: number
}): Promise<CoursesListData> {
  const queryParams = new URLSearchParams()
  if (params) {
    if (params.search) queryParams.append('search', params.search)
    if (params.category) queryParams.append('category', params.category)
    if (params.level) queryParams.append('level', params.level)
    if (params.page) queryParams.append('page', String(params.page))
    if (params.limit) queryParams.append('limit', String(params.limit))
  }
  const queryString = queryParams.toString()
  
  const response = await publicRequest<CoursesListDataResponse>(
    `/api/v1/courses${queryString ? `?${queryString}` : ""}`,
    { next: { revalidate: 3600 } } // 1 hour cache for public courses
  )
  
  return {
    courses: response.data,
    total: response.meta?.total || 0,
  }
}

export async function getCourseByIdServer(id: string): Promise<Course> {
  const response = await serverRequest<CourseByIdResponse>(
    `/api/v1/courses/${id}`,
    { next: { revalidate: 1800 } } // 30 minutes cache for course details
  )
  return response.data
}

export async function getFeaturedCoursesServer(): Promise<Course[]> {
  const response = await publicRequest<FeaturedCoursesResponse>(
    "/api/v1/courses/featured",
    { next: { revalidate: 7200 } } // 2 hours cache for featured courses
  )
  return response.data || []
}

export async function getRecommendedCoursesServer(): Promise<Course[]> {
  const response = await serverRequest<RecommendedCoursesResponse>(
    "/api/v1/courses/recommended",
    { next: { revalidate: 0 } } // No cache for user-specific recommendations
  )
  return response.data || []
}

// ============================================================================
// Enrollment APIs
// ============================================================================

export async function getMyEnrollmentsServer(userId: string): Promise<EnrollmentsListData> {
  const response = await serverRequest<EnrollmentsListDataResponse>(
    `/api/v1/enrollment/enrolled-courses/${userId}`,
    { next: { revalidate: 0 } } // Disable caching for user-specific enrollments
  )
  
  return response.data
}

export async function checkEnrollmentServer(courseId: string): Promise<boolean> {
  const response = await serverRequest<CheckEnrollmentResponse>(
    `/api/v1/enrollment/check-enrollment/${courseId}`,
    { next: { revalidate: 0 } } // Disable caching for real-time enrollment status
  )
  return response.data?.isEnrolled || false
}

export async function getEnrolledCourseDetailsServer(courseId: string): Promise<EnrolledCourseForPlayer> {
  const response = await serverRequest<EnrolledCourseDetailsResponse>(
    `/api/v1/enrollment/enrolled/${courseId}`,
    { next: { revalidate: 0 } } // Disable caching for user-specific content
  )
  return response.data.course
}

// ============================================================================
// Progress APIs
// ============================================================================

export async function getCourseProgressServer(courseId: string): Promise<CourseProgress | null> {
  const response = await serverRequest<CourseProgressResponse>(
    `/api/v1/progress/course/${courseId}`,
    { next: { revalidate: 0 } } // No cache for real-time progress
  )
  return response.data as CourseProgress | null
}

export const getUserDashboardServer = cache(async (): Promise<DashboardStats & { courses: BackendEnrollmentItem[] }> => {
  const response = await serverRequest<UserDashboardResponse>(
    "/api/v1/progress/dashboard",
    { next: { revalidate: 0 } } // No caching for real-time dashboard data
  )
  
  // Transform backend courses to match frontend BackendEnrollmentItem type
  const transformedCourses = (response.data.courses || []).map((item: any) => ({
    _id: item.course._id,
    enrollmentId: item.course._id, // Use course ID as enrollment ID
    title: item.course.title,
    thumbnail: item.course.thumbnail,
    instructor: item.course.instructor || { name: 'Unknown' },
    price: item.course.price || 0,
    totalDuration: item.course.totalDuration || 0,
    enrollmentDate: item.course.enrollmentDate || new Date().toISOString(),
    paymentStatus: item.paymentStatus || 'free',
    amountPaid: item.amountPaid || 0,
    updatedAt: item.course.updatedAt,
    progress: {
      totalLectures: item.totalLectures || 0,
      completedLectures: item.totalLecturesCompleted || 0,
      totalQuizzes: item.totalQuizzes || 0,
      completedQuizzes: item.totalQuizzesCompleted || 0,
      totalItems: item.totalItems || 0,
      completedItems: item.completedItems || 0,
      completionPercentage: item.progress || 0,
      quizzesCompleted: item.isCompleted || false,
      isCourseCompleted: item.isCompleted || false,
      averageQuizScore: item.averageQuizScore || 0,
    }
  }))
  
  // Map backend response to frontend DashboardStats type
  return {
    totalCourses: response.data.totalEnrollments,
    inProgress: response.data.inProgressCourses,
    completed: response.data.completedCourses,
    totalHours: 0, // Not provided by backend
    certificates: 0, // Not provided by backend
    rewardPoints: response.data.totalRewardPoints,
    courses: transformedCourses
  }
})

// ============================================================================
// Review APIs
// ============================================================================

export async function getCourseReviewsServer(courseId: string): Promise<Review[]> {
  const response = await serverRequest<CourseReviewsResponse>(
    `/api/v1/reviews/course/${courseId}`,
    { next: { revalidate: 900 } } // 15 minutes cache for reviews
  )
  return response.data || []
}

export async function getInstructorReviewsServer(instructorId: string): Promise<InstructorReviewsData> {
  const response = await serverRequest<InstructorReviewsResponse>(`/api/v1/reviews/instructor/${instructorId}`)
  return response.data
}

// ============================================================================
// Chapter & Lecture APIs
// ============================================================================

export async function getCourseChaptersServer(courseId: string): Promise<Chapter[]> {
  const response = await serverRequest<CourseChaptersResponse>(
    `/api/v1/chapters/course/${courseId}`,
    { next: { revalidate: 0 } } // No cache for course chapters
  )
  return response.data || []
}

// ============================================================================
// Certificate APIs
// ============================================================================

export async function getUserCertificatesServer(): Promise<Certificate[]> {
  const response = await serverRequest<UserCertificatesResponse>(
    "/api/v1/certificates",
    { next: { revalidate: 0 } } // Disable caching for user-specific certificates
  )
  return response.data || []
}

export async function getCertificateServer(enrollmentId: string): Promise<Certificate> {
  const response = await serverRequest<CertificateByIdResponse>(`/api/v1/certificates/${enrollmentId}`)
  return response.data
}

// ============================================================================
// Notification APIs
// ============================================================================

export async function getNotificationsServer(params?: {
  page?: number
  limit?: number
  isRead?: boolean
  type?: string
  includeArchived?: boolean
}): Promise<Notification[]> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  if (params?.isRead !== undefined) queryParams.append("isRead", String(params.isRead))
  if (params?.type) queryParams.append("type", params.type)
  if (params?.includeArchived) queryParams.append("includeArchived", String(params.includeArchived))
  
  const queryString = queryParams.toString()
  
  const response = await serverRequest<NotificationsDataResponse>(
    `/api/v1/notifications${queryString ? `?${queryString}` : ""}`,
    { next: { revalidate: 0 } } // Disable caching for real-time notifications
  )
  return response.data || []
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await serverRequest<{ data: number }>(
    "/api/v1/notifications/unread/count",
    { next: { revalidate: 0 } }
  )
  return response.data || 0
}

export async function markNotificationsAsRead(notificationIds?: string[], markAll?: boolean): Promise<void> {
  await serverRequest<{ success: boolean }>(
    "/api/v1/notifications/read",
    {
      method: "PATCH",
      body: JSON.stringify({ notificationIds, markAll }),
      headers: { "Content-Type": "application/json" },
    }
  )
}

export async function archiveNotifications(notificationIds: string[]): Promise<void> {
  await serverRequest<{ success: boolean }>(
    "/api/v1/notifications/archive",
    {
      method: "PATCH",
      body: JSON.stringify({ notificationIds }),
      headers: { "Content-Type": "application/json" },
    }
  )
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await serverRequest<{ success: boolean }>(
    `/api/v1/notifications/${notificationId}`,
    {
      method: "DELETE",
    }
  )
}

// ============================================================================
// Discussion APIs
// ============================================================================

export async function getLectureDiscussionsServer(lectureId: string): Promise<Discussion[]> {
  const response = await serverRequest<LectureDiscussionsResponse>(`/api/v1/discussions/lecture/${lectureId}`)
  return response.data || []
}

export async function getCourseDiscussionsServer(courseId: string): Promise<Discussion[]> {
  const response = await serverRequest<CourseDiscussionsResponse>(`/api/v1/discussions/course/${courseId}`)
  return response.data || []
}

export async function getUserDiscussionsServer(params?: { page?: number; limit?: number }): Promise<DiscussionsListData> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  
  const queryString = queryParams.toString()
  
  // Backend returns: { success, message, data: Discussion[], meta: { page, limit, total, totalPages } }
  const response = await serverRequest<UserDiscussionsResponse>(
    `/api/v1/discussions/user/me${queryString ? `?${queryString}` : ""}`,
    { next: { revalidate: 0 } } // Disable caching for user-specific discussions
  )
  
  return {
    discussions: response.data || [],
    pagination: response.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }
  }
}

export async function getEnrolledCoursesDiscussionsServer(params?: { page?: number; limit?: number }): Promise<DiscussionsListData> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  
  const queryString = queryParams.toString()
  
  // Backend returns: { success, message, data: Discussion[], meta: { page, limit, total, totalPages } }
  const response = await serverRequest<UserDiscussionsResponse>(`/api/v1/discussions/enrolled${queryString ? `?${queryString}` : ""}`)
  
  return {
    discussions: response.data || [],
    pagination: response.meta || { page: 1, limit: 20, total: 0, totalPages: 0 }
  }
}

export async function getDiscussionByIdServer(discussionId: string): Promise<Discussion | null> {
  try {
    const response = await serverRequest<DiscussionByIdResponse>(`/api/v1/discussions/${discussionId}`)
    return response.data
  } catch (error) {
    console.error("Failed to fetch discussion:", error)
    return null
  }
}

export async function postDiscussionReplyServer(discussionId: string, text: string): Promise<Discussion> {
  const response = await serverRequest<PostDiscussionReplyResponse>(
    `/api/v1/discussions/${discussionId}/answer`,
    {
      method: "POST",
      body: JSON.stringify({ text }),
    }
  )
  return response.data
}

// ============================================================================
// Instructor APIs
// ============================================================================

export async function getCoursesByInstructorServer(instructorId: string): Promise<Course[]> {
  const response = await serverRequest<CoursesByInstructorResponse>(
    `/api/v1/courses/instructor/${instructorId}`,
    { next: { revalidate: 0 } } // No cache for instructor courses
  )
  return response.data || []
}

export async function getStudentsByInstructorServer(instructorId: string): Promise<StudentsByInstructorData> {
  const response = await serverRequest<StudentsByInstructorResponse>(
    `/api/v1/enrollment/students/${instructorId}`,
    { next: { revalidate: 0 } } // No cache for instructor students
  )
  return response.data
}

export async function getInstructorDashboardServer(instructorId: string): Promise<InstructorStats> {
  const response = await serverRequest<InstructorDashboardResponse>(
    `/api/v1/enrollment/instructor-dashboard/${instructorId}`,
    { next: { revalidate: 0 } } // No cache for instructor dashboard
  )
  return response.data
}

export async function getCourseAnalyticsServer(courseId: string): Promise<Record<string, number>> {
  const response = await serverRequest<CourseAnalyticsResponse>(
    `/api/v1/courses/analytics/${courseId}`,
    { next: { revalidate: 0 } } // No cache for course analytics
  )
  return response.data
}

// ============================================================================
// Quiz APIs
// ============================================================================

export async function getQuizServer(quizId: string): Promise<ChapterItem> {
  const response = await serverRequest<QuizResponse>(`/api/v1/quizes/${quizId}`)
  return response.data
}

export async function getQuizResultsServer(courseId: string): Promise<ChapterItem[]> {
  const response = await serverRequest<QuizResultsResponse>(`/api/v1/quizes/results/course/${courseId}`)
  return response.data || []
}
