/**
 * Functional API Client for LMS
 * Uses functional programming principles instead of OOP
 */

import type {
  RegisterResponse,
  LoginResponse,
  ActivationResponse,
  UserProfileResponse,
  CoursesListResponse,
  CourseResponse,
  CheckoutSessionResponse,
  EnrollmentsListResponse,
  ProgressResponse,
  ReviewResponse,
  ReviewsListResponse,
  CertificateResponse,
  GenericResponse,
  ApiResponse,
} from "./types/api-responses"

import type {
  CourseBase,
  CourseDetail,
  Progress,
  QuizResult,
  PopulatedReview,
  Course,
  Enrollment,
  User,
  Notification,
} from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Core request function - handles all HTTP requests
 * Uses cookie-based authentication (accessToken, refreshToken)
 * Backend sets cookies, we just send them via credentials: "include"
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Send cookies automatically
  }

  const url = `${API_URL}${endpoint}`
  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }))
    // Log detailed error for debugging
    console.error("API Error Details:", {
      url,
      status: response.status,
      statusText: response.statusText,
      error
    })
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// ============================================================================
// Auth API Functions
// ============================================================================

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<RegisterResponse> {
  return request("/api/v1/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function login(data: {
  email: string
  password: string
}): Promise<LoginResponse> {
  return request("/api/v1/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function activateUser(data: {
  email: string
  activationCode: string
}): Promise<ActivationResponse> {
  return request("/api/v1/user/activate-user", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function resendActivation(email: string): Promise<GenericResponse> {
  return request("/api/v1/user/resend-activation", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function forgotPassword(email: string): Promise<GenericResponse> {
  return request("/api/v1/user/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function resetPasswordWithOtp(data: {
  email: string
  otp: string
  newPassword: string
}): Promise<GenericResponse> {
  return request("/api/v1/user/reset-password-otp", {
    method: "POST",
    body: JSON.stringify(data),
  })
}



export async function getProfile(): Promise<UserProfileResponse> {
  return request("/api/v1/user/me", {
    method: "GET",
  })
}

export async function updateProfile(
  data: { name?: string; email?: string }
): Promise<UserProfileResponse> {
  return request("/api/v1/user/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function updateProfilePicture(
  data: { avatar: string }
): Promise<UserProfileResponse> {
  return request("/api/v1/user/update-profile-picture", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function resetPassword(
  data: { password: string; newPassword: string }
): Promise<GenericResponse> {
  return request("/api/v1/user/reset-password", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Course API Functions
// ============================================================================

export async function getAllCourses(params?: {
  search?: string
  category?: string
  level?: string
  page?: number
  limit?: number
}): Promise<{ courses: CourseBase[]; total: number }> {
  // Build query params only from defined values
  const queryParams = new URLSearchParams()
  if (params) {
    if (params.search) queryParams.append('search', params.search)
    if (params.category) queryParams.append('category', params.category)
    if (params.level) queryParams.append('level', params.level)
    if (params.page) queryParams.append('page', String(params.page))
    if (params.limit) queryParams.append('limit', String(params.limit))
  }
  const queryString = queryParams.toString()
  
  const response = await request<ApiResponse<CourseBase[]>>(
    `/api/v1/courses${queryString ? `?${queryString}` : ""}`
  )
  // Transform to expected format
  return {
    courses: response.data || [],
    total: response.meta?.total || 0,
  }
}

export async function getCourseById(id: string): Promise<{ course: CourseDetail }> {
  const response = await request<ApiResponse<CourseDetail>>(`/api/v1/courses/${id}`)
  // Transform to expected format
  return {
    course: response.data!,
  }
}

export async function getFeaturedCourses(): Promise<CoursesListResponse> {
  const response = await request<{ data: Course[] }>("/api/v1/courses/featured")
  // Transform to expected format
  return {
    success: true,
    courses: response.data || [],
  }
}

export async function getRecommendedCourses(): Promise<CoursesListResponse> {
  const response = await request<{ data: Course[] }>("/api/v1/courses/recommended")
  return {
    success: true,
    courses: response.data || [],
  }
}

export async function createCourse(data: Record<string, unknown>): Promise<CourseResponse> {
  const response = await request<{ data: Course }>("/api/v1/courses/create", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return {
    success: true,
    course: response.data,
  }
}

export async function updateCourse(
  id: string,
  data: Record<string, unknown>
): Promise<CourseResponse> {
  const response = await request<{ data: Course }>(`/api/v1/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
  return {
    success: true,
    course: response.data,
  }
}

export async function deleteCourse(id: string): Promise<GenericResponse> {
  return request(`/api/v1/courses/${id}`, {
    method: "DELETE",
  })
}

export async function getCourseAnalytics(
  id: string
): Promise<GenericResponse> {
  return request(`/api/v1/courses/analytics/${id}`)
}

export async function getCoursesByInstructor(
  instructorId: string
): Promise<CoursesListResponse> {
  const response = await request<{ data: Course[] }>(`/api/v1/courses/instructor/${instructorId}`)
  return {
    success: true,
    courses: response.data || [],
  }
}

export async function getStudentsByInstructor(
  instructorId: string
): Promise<GenericResponse> {
  return request(`/api/v1/enrollment/students/${instructorId}`)
}

export async function getInstructorDashboard(
  instructorId: string
): Promise<GenericResponse> {
  return request(`/api/v1/enrollment/instructor-dashboard/${instructorId}`)
}

// ============================================================================
// Enrollment API Functions
// ============================================================================

export async function enrollInCourse(
  courseId: string,
  couponCode?: string
): Promise<CheckoutSessionResponse> {
  const response = await request<{ data: { id: string; url: string | null } }>(
    "/api/v1/enrollment/create-session",
    {
      method: "POST",
      body: JSON.stringify({ courseId, couponCode }),
    }
  )
  
  return {
    success: true,
    checkoutUrl: response.data.url,
    sessionId: response.data.id,
  }
}

export async function getMyEnrollments(userId?: string): Promise<EnrollmentsListResponse> {
  const response = await request<{ 
    data: { 
      enrolledCourses: Enrollment[]
      totalCoursesCompleted?: number
      totalRewardPoints?: number
    } 
  }>(`/api/v1/enrollment/enrolled-courses/${userId}`)
  return {
    success: true,
    enrollments: response.data?.enrolledCourses || [],
  }
}

export async function checkEnrollment(courseId: string): Promise<{ isEnrolled: boolean }> {
  const response = await request<{ data: { isEnrolled: boolean } }>(
    `/api/v1/enrollment/check-enrollment/${courseId}`
  )
  return {
    isEnrolled: response.data?.isEnrolled || false,
  }
}

export async function getEnrolledCourseDetails(
  courseId: string
): Promise<CourseResponse> {
  const response = await request<{ data: Course }>(
    `/api/v1/enrollment/enrolled/${courseId}`
  )
  return {
    success: true,
    course: response.data,
  }
}

// ============================================================================
// Progress API Functions
// ============================================================================

export async function updateLectureProgress(
  lectureId: string,
  progressPercentage: number
): Promise<ProgressResponse> {
  return request(`/api/v1/progress/lecture/${lectureId}`, {
    method: "POST",
    body: JSON.stringify({ progressPercentage }),
  })
}

export async function getCourseProgress(
  courseId: string
): Promise<{ progress: Progress }> {
  const response = await request<ApiResponse<Progress>>(`/api/v1/progress/course/${courseId}`)
  return {
    progress: response.data!,
  }
}

export async function getUserDashboard(): Promise<ProgressResponse> {
  return request("/api/v1/progress/dashboard")
}

// ============================================================================
// Quiz API Functions
// ============================================================================

export async function submitQuiz(
  quizId: string,
  answers: number[]
): Promise<ApiResponse<QuizResult>> {
  return request<ApiResponse<QuizResult>>(`/api/v1/quizes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  })
}

export async function getQuiz(
  quizId: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/${quizId}`)
}

export async function getQuizResults(
  courseId: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/results/course/${courseId}`)
}

// ============================================================================
// Review API Functions
// ============================================================================

export async function createReview(
  data: { courseId: string; rating: number; comment: string }
): Promise<ReviewResponse> {
  return request("/api/v1/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getCourseReviews(
  courseId: string,
  options?: { cache?: RequestCache }
): Promise<ReviewsListResponse<PopulatedReview>> {
  return request(`/api/v1/reviews/course/${courseId}`, { 
    ...options 
  })
}

export async function getInstructorReviews(
  instructorId: string
): Promise<GenericResponse> {
  return request(`/api/v1/reviews/instructor/${instructorId}`)
}

// ============================================================================
// Chapter API Functions
// ============================================================================

export async function getCourseChapters(
  courseId: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/course/${courseId}`)
}

export async function createChapter(
  data: { title: string; course: string; order?: number }
): Promise<GenericResponse> {
  return request(`/api/v1/chapters`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateChapter(
  chapterId: string,
  data: { title?: string; order?: number }
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/${chapterId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteChapter(
  chapterId: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/${chapterId}`, {
    method: 'DELETE',
  })
}

export async function reorderChapters(
  courseId: string,
  order: { chapterId: string; order: number }[]
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/reorder`, {
    method: 'POST',
    body: JSON.stringify({ courseId, order }),
  })
}

export async function reorderChapterContent(
  chapterId: string,
  items: { itemId: string; itemType: 'lecture' | 'quiz'; order: number }[]
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/${chapterId}/reorder-content`, {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}

// ============================================================================
// Lecture API Functions
// ============================================================================

export async function createLecture(
  data: {
    title: string
    course: string
    chapter: string
    videoUrl: string
    duration: number
    order?: number
    isPreview?: boolean
    resources?: string
  }
): Promise<GenericResponse> {
  return request(`/api/v1/lectures`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateLecture(
  lectureId: string,
  data: {
    title?: string
    videoUrl?: string
    duration?: number
    order?: number
    isPreview?: boolean
    resources?: string
  }
): Promise<GenericResponse> {
  return request(`/api/v1/lectures/${lectureId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteLecture(
  lectureId: string
): Promise<GenericResponse> {
  return request(`/api/v1/lectures/${lectureId}`, {
    method: 'DELETE',
  })
}

export async function reorderLectures(
  chapterId: string,
  reorderData: { lectureId: string; newOrder: number }[]
): Promise<GenericResponse> {
  return request(`/api/v1/lectures/reorder`, {
    method: 'POST',
    body: JSON.stringify({ chapterId, reorderData }),
  })
}

// ============================================================================
// Quiz API Functions
// ============================================================================

export async function createQuiz(
  data: {
    course: string
    chapter: string
    title: string
    order?: number
    duration?: number
    questions: {
      questionText: string
      options: string[]
      correctAnswer: number
      explanation?: string
    }[]
  }
): Promise<GenericResponse> {
  return request(`/api/v1/quizes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateQuiz(
  quizId: string,
  data: {
    title?: string
    order?: number
    duration?: number
    questions?: {
      questionText: string
      options: string[]
      correctAnswer: number
      explanation?: string
    }[]
  }
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/${quizId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteQuiz(
  quizId: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/${quizId}`, {
    method: 'DELETE',
  })
}

// ============================================================================
// Certificate API Functions
// ============================================================================

export async function getCertificate(
  enrollmentId: string
): Promise<CertificateResponse> {
  return request(`/api/v1/certificates/${enrollmentId}`)
}

export async function downloadCertificate(
  enrollmentId: string
): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/api/v1/certificates/${enrollmentId}/download`,
    {
      credentials: "include", // Send cookies
    }
  )

  if (!response.ok) {
    throw new Error("Failed to download certificate")
  }

  return response.blob()
}

// ============================================================================
// Coupon API Functions
// ============================================================================

export async function validateCoupon(
  courseId: string,
  couponCode: string
): Promise<{ success: boolean; coupon: import('./types').Coupon; message?: string }> {
  const response = await request<{ data: import('./types').Coupon; message?: string }>(
    `/api/v1/coupon/validate/${courseId}`,
    {
      method: "POST",
      body: JSON.stringify({ couponCode }),
    }
  )
  return {
    success: true,
    coupon: response.data,
    message: response.message,
  }
}

// ============================================================================
// Notification API Functions
// ============================================================================

/**
 * Get user notifications with filtering
 * @param token - Auth token
 * @param params - Query parameters
 * @returns Promise with notifications array
 */
export async function getNotifications(
  params?: {
    page?: number
    limit?: number
    isRead?: boolean
    type?: string
    includeArchived?: boolean
  }
): Promise<{ notifications: Notification[] }> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  
  // Backend validation requires STRINGS 'true' or 'false', not booleans
  if (params?.isRead !== undefined) {
    queryParams.append("isRead", params.isRead ? 'true' : 'false')
  }
  
  if (params?.type) queryParams.append("type", params.type)
  
  // Backend validation requires STRINGS 'true' or 'false', not booleans
  if (params?.includeArchived !== undefined) {
    queryParams.append("includeArchived", params.includeArchived ? 'true' : 'false')
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/api/v1/notifications${queryString ? `?${queryString}` : ""}`
  
  const response = await request<{ 
    success: boolean
    data: Notification[]
    meta?: any
    filters?: any
    cached?: boolean
  }>(endpoint)
  
  return { notifications: response.data || [] }
}

/**
 * Get unread notification count
 * @param token - Auth token
 * @returns Promise with unread count
 */
export async function getUnreadNotificationCount(): Promise<{ data: number }> {
  const response = await request<{ success: boolean; data: number }>(
    "/api/v1/notifications/unread/count"
  )
  return { data: response.data }
}

/**
 * Mark notifications as read
 * @param token - Auth token
 * @param notificationIds - Array of notification IDs (optional)
 * @param markAll - Mark all notifications as read (optional)
 * @returns Promise with success response
 */
export async function markNotificationsAsRead(
  notificationIds?: string[],
  markAll?: boolean
): Promise<GenericResponse> {
  // Backend validation: at least one field must be provided
  if (!markAll && (!notificationIds || notificationIds.length === 0)) {
    throw new Error("Either markAll must be true or notificationIds must be provided")
  }
  
  // Build body according to backend validation schema
  const body: { notificationIds?: string[]; markAll?: boolean } = {}
  
  if (markAll) {
    body.markAll = true
  } else if (notificationIds && notificationIds.length > 0) {
    body.notificationIds = notificationIds
  }
  
  return request<GenericResponse>("/api/v1/notifications/read", {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

/**
 * Archive notifications
 * @param token - Auth token
 * @param notificationIds - Array of notification IDs (required, min 1)
 * @returns Promise with success response
 */
export async function archiveNotifications(
  notificationIds: string[]
): Promise<GenericResponse> {
  // Backend validation: at least one notification ID required
  if (!notificationIds || notificationIds.length === 0) {
    throw new Error("At least one notification ID is required")
  }
  
  return request<GenericResponse>("/api/v1/notifications/archive", {
    method: "PATCH",
    body: JSON.stringify({ notificationIds }),
  })
}

/**
 * Delete a notification
 * @param token - Auth token
 * @param notificationId - Notification ID
 * @returns Promise with success response
 */
export async function deleteNotification(
  notificationId: string
): Promise<GenericResponse> {
  return request<GenericResponse>(`/api/v1/notifications/${notificationId}`, {
    method: "DELETE",
  })
}

// ============================================================================
// Discussion API Functions
// ============================================================================

export async function getLectureDiscussions(
  lectureId: string
): Promise<ApiResponse<any[]>> {
  return request(`/api/v1/discussions/lecture/${lectureId}`)
}

export async function getCourseDiscussions(
  courseId: string
): Promise<ApiResponse<any[]>> {
  return request(`/api/v1/discussions/course/${courseId}`)
}

export async function createDiscussion(
  data: { lecture: string; question: string }
): Promise<ApiResponse<any>> {
  return request("/api/v1/discussions", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function answerDiscussion(
  discussionId: string,
  data: { text: string }
): Promise<ApiResponse<any>> {
  return request(`/api/v1/discussions/${discussionId}/answer`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateDiscussion(
  discussionId: string,
  data: { question: string }
): Promise<ApiResponse<any>> {
  return request(`/api/v1/discussions/${discussionId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteDiscussion(
  discussionId: string
): Promise<ApiResponse<any>> {
  return request(`/api/v1/discussions/${discussionId}`, {
    method: "DELETE",
  })
}

export async function getUserDiscussions(): Promise<ApiResponse<any[]>> {
  return request("/api/v1/discussions/user/me")
}

export async function getEnrolledCoursesDiscussions(): Promise<ApiResponse<any[]>> {
  return request("/api/v1/discussions/enrolled")
}

// ============================================================================
// Certificate API Functions - Extended
// ============================================================================

export async function getUserCertificates(): Promise<ApiResponse<any[]>> {
  return request("/api/v1/certificates")
}

// ============================================================================
// Admin API Functions
// ============================================================================

export async function getAllUsers(
  params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }
): Promise<{
  users: User[]
  total: number
  page: number
  pages: number
}> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  if (params?.search) queryParams.append("search", params.search)
  if (params?.role) queryParams.append("role", params.role)

  const queryString = queryParams.toString()
  const response = await request<ApiResponse<{
    users: User[]
    total: number
    page: number
    pages: number
  }>>(`/api/v1/user/all${queryString ? `?${queryString}` : ""}`)

  return response.data!
}

export async function getUserStats(): Promise<{
  totalUsers: number
  totalStudents: number
  totalInstructors: number
  totalAdmins: number
  verifiedUsers: number
  unverifiedUsers: number
}> {
  const response = await request<ApiResponse<{
    totalUsers: number
    totalStudents: number
    totalInstructors: number
    totalAdmins: number
    verifiedUsers: number
    unverifiedUsers: number
  }>>("/api/v1/user/stats")

  return response.data!
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<GenericResponse> {
  return request(`/api/v1/user/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  })
}

export async function deleteUser(
  userId: string
): Promise<GenericResponse> {
  return request(`/api/v1/user/${userId}`, {
    method: "DELETE",
  })
}

// Get admin dashboard stats (courses, enrollments, etc.)
export async function getAdminDashboardStats(): Promise<{
  users: {
    totalUsers: number
    totalStudents: number
    totalInstructors: number
    totalAdmins: number
    verifiedUsers: number
    unverifiedUsers: number
  }
  courses: {
    total: number
    published: number
    draft: number
  }
  enrollments: {
    total: number
    active: number
    completed: number
  }
  revenue: {
    total: number
    monthly: number
    yearly: number
  }
}> {
  const [userStats, coursesResponse] = await Promise.all([
    getUserStats(),
    request<ApiResponse<Course[]>>("/api/v1/courses?limit=1000"),
  ])

  // Calculate course statistics
  const courses = coursesResponse.data || []
  const totalCourses = courses.length
  const publishedCourses = courses.filter((c: any) => c.status === 'published').length
  const draftCourses = totalCourses - publishedCourses

  return {
    users: userStats,
    courses: {
      total: totalCourses,
      published: publishedCourses,
      draft: draftCourses,
    },
    enrollments: {
      total: 0, // This would come from enrollment API
      active: 0,
      completed: 0,
    },
    revenue: {
      total: 0, // This would come from payment/revenue API
      monthly: 0,
      yearly: 0,
    },
  }
}

// ============================================================================
// Coupon API Functions
// ============================================================================

export async function getAllCoupons(): Promise<any[]> {
  const response = await request<ApiResponse<any[]>>("/api/v1/coupon")
  return response.data || []
}

export async function createCoupon(
  data: {
    code: string
    discountValue: number
    appliesTo?: string
    expiresAt?: string
    isActive?: boolean
    usageLimit?: number
  }
): Promise<GenericResponse> {
  return request("/api/v1/coupon", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCoupon(
  couponId: string,
  data: {
    code?: string
    discountValue?: number
    appliesTo?: string
    expiresAt?: string
    isActive?: boolean
    usageLimit?: number
  }
): Promise<GenericResponse> {
  return request(`/api/v1/coupon/${couponId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteCoupon(
  couponId: string
): Promise<GenericResponse> {
  return request(`/api/v1/coupon/${couponId}`, {
    method: "DELETE",
  })
}

// latest 

export async function logout(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/v1/user/logout`, {
      method: "POST",
      credentials: "include",
    })
    return res.ok
  } catch {
    return false
  }
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const url = typeof input === "string" || input instanceof URL ? input : (input as Request).url

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })

  // If unauthorized, try to refresh once then retry original request
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/api/v1/user/refresh-token`, {
      method: "POST",
      credentials: "include",
    })

    if (refreshRes.ok) {
      return fetch(url, {
        credentials: "include",
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      })
    }
  }

  return res
}

// Legacy export for backwards compatibility during migration
// TODO: Remove this after all components are updated
export const apiClient = {
  register,
  login,
  activateUser,
  resendActivation,
  forgotPassword,
  resetPasswordWithOtp,
  logout,
  apiFetch,
  getProfile,
  updateProfile,
  updateProfilePicture,
  resetPassword,
  getAllCourses,
  getCourseById,
  getFeaturedCourses,
  getRecommendedCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseAnalytics,
  getCoursesByInstructor,
  getStudentsByInstructor,
  getInstructorDashboard,
  enrollInCourse,
  getMyEnrollments,
  getEnrolledCourseDetails,
  updateLectureProgress,
  getCourseProgress,
  getUserDashboard,
  submitQuiz,
  getQuiz,
  getQuizResults,
  createReview,
  getCourseReviews,
  getInstructorReviews,
  // Chapters
  getCourseChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
  reorderChapterContent,
  // Lectures
  createLecture,
  updateLecture,
  deleteLecture,
  reorderLectures,
  // Quizes
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getCertificate,
  downloadCertificate,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  archiveNotifications,
  deleteNotification,
  getLectureDiscussions,
  getCourseDiscussions,
  createDiscussion,
  answerDiscussion,
  updateDiscussion,
  deleteDiscussion,
}
