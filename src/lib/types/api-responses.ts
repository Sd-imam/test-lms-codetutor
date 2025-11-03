/**
 * API Response Types
 * Types for API response wrappers matching server/src/utils/response.ts
 */

import type {
  User,
  Course,
  Enrollment,
  Review,
  Certificate,
  Notification,
  Discussion,
  Coupon,
  Chapter,
  ChapterItem,
  Progress,
  InstructorStats,
  BackendEnrollmentItem,
  PopulatedReview,
} from './index'
import type { EnrolledCourseForPlayer } from './course-player'

// ============================================================================
// Generic API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    cached?: boolean
  }
  errors?: string[]
}

export interface ResponseMeta {
  total?: number
  page?: number
  limit?: number
  totalPages?: number
  cached?: boolean
}

// ============================================================================
// Auth API Response Types
// ============================================================================

export interface RegisterResponse {
  success: boolean
  message: string
}

export interface ActivationResponse {
  success: boolean
  message: string
}

export interface LoginResponse {
  success: boolean
  user: User
  accessToken: string
}

export interface UserProfileResponse {
  success: boolean
  user: User
}

// ============================================================================
// Course API Response Types
// ============================================================================

export interface CourseResponse {
  success: boolean
  course: Course
}

export interface CoursesListResponse {
  success: boolean
  courses: Course[]
  total?: number
}

// ============================================================================
// Enrollment API Response Types
// ============================================================================

export interface EnrollmentResponse {
  success: boolean
  enrollment?: Enrollment
  checkoutUrl?: string | null
  sessionId?: string
}

export interface CheckoutSessionResponse {
  success: boolean
  checkoutUrl: string | null
  sessionId: string
}

export interface EnrollmentsListResponse {
  success: boolean
  enrollments: Enrollment[]
}

// ============================================================================
// Progress API Response Types
// ============================================================================

export interface ProgressResponse {
  success: boolean
  progress: Progress
}

// ============================================================================
// Review API Response Types
// ============================================================================

export interface ReviewResponse {
  success: boolean
  review: Review
}

export interface ReviewsListResponse<T = Review> {
  success: boolean
  message?: string
  data: T[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// Certificate API Response Types
// ============================================================================

export interface CertificateResponse {
  success: boolean
  certificate: Certificate
}

// ============================================================================
// Notification API Response Types
// ============================================================================

export interface NotificationsResponse {
  success: boolean
  notifications: Notification[]
}

// ============================================================================
// Generic Response Type
// ============================================================================

export interface GenericResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

// ============================================================================
// Server Function Response Types
// ============================================================================

export interface AdminDashboardStatsResponse {
  data: {
    totalUsers: number
    totalStudents: number
    totalInstructors: number
    totalAdmins: number
    verifiedUsers: number
    unverifiedUsers: number
  }
}

export interface UsersListResponse {
  data: {
    users: User[]
    total: number
    page: number
    pages: number
  }
}

export interface CoursesListDataResponse {
  data: Course[]
  meta?: {
    total: number
  }
}

export interface CouponsListResponse {
  data: Coupon[]
}

export interface CourseByIdResponse {
  data: Course
}

export interface FeaturedCoursesResponse {
  data: Course[]
}

export interface RecommendedCoursesResponse {
  data: Course[]
}

export interface EnrollmentsListDataResponse {
  data: {
    enrolledCourses: BackendEnrollmentItem[]
    totalCoursesCompleted?: number
    totalRewardPoints?: number
  }
}

export interface CheckEnrollmentResponse {
  data: {
    isEnrolled: boolean
  }
}

export interface EnrolledCourseDetailsResponse {
  data: {
    course: EnrolledCourseForPlayer
  }
}

export interface CourseProgressResponse {
  data: Progress | null
}

export interface UserDashboardResponse {
  data: {
    totalEnrollments: number
    completedCourses: number
    inProgressCourses: number
    totalRewardPoints: number
    courses: Enrollment[]
  }
}

export interface CourseReviewsResponse {
  data: Review[]
}

export interface InstructorReviewsResponse {
  data: {
    reviews: PopulatedReview[]
    totalReviews: number
    averageRating: number
    ratingDistribution: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
}

export interface CourseChaptersResponse {
  data: Chapter[]
}

export interface UserCertificatesResponse {
  data: Certificate[]
}

export interface CertificateByIdResponse {
  data: Certificate
}

export interface NotificationsDataResponse {
  data: Notification[]
}

export interface LectureDiscussionsResponse {
  data: Discussion[]
}

export interface CourseDiscussionsResponse {
  data: Discussion[]
}

export interface UserDiscussionsResponse {
  data: Discussion[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
    cached?: boolean
  }
}

export interface DiscussionByIdResponse {
  data: Discussion
}

export interface PostDiscussionReplyResponse {
  data: Discussion
}

export interface CoursesByInstructorResponse {
  data: Course[]
}

export interface StudentsByInstructorResponse {
  data: {
    students: Array<{
      _id: string
      name: string
      email: string
      avatar?: string
      joinedAt: string
      courses: Array<{
        courseId: string
        courseTitle: string
        enrolledAt: string
        amountPaid: number
        paymentStatus: string
        completionPercentage: number
        isCompleted: boolean
      }>
      totalEnrolled: number
      totalCompleted: number
      totalRevenue: number
    }>
    totalStudents: number
    totalEnrollments: number
    courseMap: Record<string, string>
  }
}

export interface StudentsByInstructorData {
  students: Array<{
    _id: string
    name: string
    email: string
    avatar?: string
    joinedAt: string
    courses: Array<{
      courseId: string
      courseTitle: string
      enrolledAt: string
      amountPaid: number
      paymentStatus: string
      completionPercentage: number
      isCompleted: boolean
    }>
    totalEnrolled: number
    totalCompleted: number
    totalRevenue: number
  }>
  totalStudents: number
  totalEnrollments: number
  courseMap: Record<string, string>
}

export interface UsersListData {
  users: User[]
  total: number
  page: number
  pages: number
}

export interface CoursesListData {
  courses: Course[]
  total: number
}

export interface EnrollmentsListData {
  enrolledCourses: BackendEnrollmentItem[]
  totalCoursesCompleted?: number
  totalRewardPoints?: number
}

export interface InstructorReviewsData {
  reviews: PopulatedReview[]
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface DiscussionsListData {
  discussions: Discussion[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface InstructorDashboardResponse {
  data: InstructorStats & {
    courses?: Course[]
  }
}

export interface CourseAnalyticsResponse {
  data: Record<string, number>
}

export interface QuizResponse {
  data: ChapterItem
}

export interface QuizResultsResponse {
  data: ChapterItem[]
}

// ============================================================================
// Error Types
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export interface ValidationError {
  field: string
  message: string
}

// ============================================================================
// Form Types
// ============================================================================

export interface CourseFiltersParams {
  search?: string
  category?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  page?: number
  limit?: number
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface CourseCardProps {
  course: Course
  showInstructor?: boolean
  variant?: 'default' | 'compact'
}

export interface EnrollmentCardProps {
  enrollment: Enrollment
  onContinue?: () => void
}

export interface ProgressBarProps {
  percentage: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

