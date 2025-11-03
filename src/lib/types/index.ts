/**
 * Frontend Types - Based on Backend MongoDB Schemas
 * All types match exactly with backend models in server/src/modules
 */

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  _id: string
  name: string
  email: string
  isVerified: boolean
  role: "user" | "instructor" | "admin"
  avatar: {
    public_id: string | null
    url: string
  }
  signature: {
    public_id: string | null
    url: string | null
  }
  username: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface Instructor {
  _id: string
  name: string
  email?: string
  role?: "user" | "instructor" | "admin"
  avatar?: {
    public_id: string | null
    url: string
  }
  signature?: {
    public_id: string | null
    url: string | null
  }
  username?: string
  isVerified?: boolean
  bio?: string
  expertise?: string[]
}

// ============================================================================
// COURSE TYPES
// ============================================================================

export interface Course {
  _id: string
  title: string
  description: string
  price: number
  discount: number
  stacks: string[]
  thumbnail: {
    public_id: string | null
    url: string
  }
  category: string
  instructor: Instructor | string
  level: "beginner" | "intermediate" | "advanced"
  requirements: string[]
  whatYouWillLearn: string[]
  totalDuration: number
  enrollmentCount: number
  averageRating: number
  reviewCount: number
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Computed/virtual fields
  isEnrolled?: boolean
  chapters?: Chapter[]
  courseContent?: Chapter[]
  isFeatured?: boolean
  isPublished?: boolean
  courseTitle?: string
  courseThumbnail?: {
    public_id: string | null
    url: string
  }
}

// ============================================================================
// CHAPTER TYPES
// ============================================================================

export interface Chapter {
  _id: string
  title: string
  course: string
  order: number
  chapterDuration: number
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Populated fields
  items?: ChapterItem[]
  chapterTitle?: string
  chapterContent?: ChapterItem[]
}

// ============================================================================
// CHAPTER ITEM TYPES (Lectures & Quizzes)
// ============================================================================

export interface ChapterItem {
  type: "lecture" | "quiz"
  order: number
  
  // Common fields
  lectureTitle: string
  
  // Lecture-specific fields
  lectureId?: string
  lectureUrl?: string
  lectureDuration?: number
  isPreview?: boolean
  resources?: string
  
  // Quiz-specific fields
  quizId?: string
  questionCount?: number
  questions?: Question[]
  
  // Progress tracking
  isCompleted?: boolean
  
  // Legacy fields
  title?: string
  videoUrl?: string
  duration?: number
}

// ============================================================================
// LECTURE TYPES
// ============================================================================

export interface Lecture {
  _id: string
  title: string
  course: string
  chapter: string
  videoUrl: string
  duration: number
  order: number
  isPreview: boolean
  resources?: string
  createdAt: string
  updatedAt: string
  isCompleted?: boolean
}

// ============================================================================
// QUIZ TYPES
// ============================================================================

export interface Quiz {
  _id: string
  course: string
  chapter: string
  title: string
  order: number
  duration: number
  questions: Question[]
  createdAt: string
  updatedAt: string
  isCompleted?: boolean
  passingScore?: number
}

export interface Question {
  _id?: string
  questionText: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface QuizResult {
  score: number
  correctAnswers: number
  totalQuestions: number
  passed: boolean
  answers?: QuizAnswerDetail[]
}

export interface QuizAnswerDetail {
  questionId: string
  questionText: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  explanation?: string
}

export interface QuizAttempt {
  _id: string
  quizId: string
  userId: string
  answers: number[]
  score: number
  correctAnswers: number
  totalQuestions: number
  passed: boolean
  attemptedAt: string
}

// ============================================================================
// ENROLLMENT TYPES
// ============================================================================

export interface Enrollment {
  _id: string
  student: User | string
  course: Course | string
  coupon?: string
  enrollmentDate: string
  amountPaid: number
  paymentStatus: "pending" | "free" | "paid"
  stripeSessionId?: string
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Computed/virtual fields
  courseId?: string
  courseTitle?: string
  title?: string
  courseThumbnail?: {
    url: string
    public_id: string | null
  }
  thumbnail?: {
    url: string
    public_id: string | null
  }
  instructor?: Instructor
  totalDuration?: number
  progress?: number | EnrollmentProgress
  isCompleted?: boolean
  certificate?: Certificate
  lastAccessed?: string
  enrollmentId?: string
}

export interface EnrolledCourse extends Course {
  enrollmentId: string
  enrollmentDate: string
  paymentStatus: "pending" | "free" | "paid"
  amountPaid: number
  progress?: EnrollmentProgress
  isEnrolled: true
}

export interface BackendEnrollmentItem {
  _id: string
  enrollmentId: string
  title: string
  thumbnail: {
    url: string
    public_id: string | null
  }
  instructor: {
    _id?: string
    name: string
    avatar?: {
      url: string
      public_id: string | null
    } | null
  }
  price: number
  totalDuration: number
  enrollmentDate: string
  paymentStatus: "pending" | "free" | "paid"
  amountPaid: number
  updatedAt?: string
  progress: EnrollmentProgress
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

export interface CourseProgress {
  _id: string
  user: string
  course: string
  completedLectures: Record<string, boolean>
  completedQuizzes: Record<string, {
    completed: boolean
    score: number
    completedAt: string
  }>
  lastViewedLecture?: string
  totalLecturesCompleted: number
  totalQuizzesCompleted: number
  quizzesCompleted: boolean
  averageQuizScore: number
  isCourseCompleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface EnrollmentProgress {
  totalLectures: number
  completedLectures: number
  totalQuizzes: number
  completedQuizzes: number
  totalItems: number
  completedItems: number
  completionPercentage: number
  quizzesCompleted: boolean
  averageQuizScore: number
  isCourseCompleted: boolean
  lastViewedLecture?: string | null
  completedLectureIds?: Record<string, boolean>
  completedQuizIds?: Record<string, {
    completed: boolean
    score: number
    completedAt: string
  }>
  rewardPoints?: RewardPoints
}

export interface RewardPoints {
  lecturePoints: number
  quizPoints: number
  completionBonus: number
  totalPoints: number
}

export interface Progress {
  _id?: string
  enrollment?: string
  lectureProgress?: {
    lecture: string
    completed: boolean
    completedAt?: string
    progressPercentage?: number
  }[]
  quizProgress?: {
    quiz: string
    completed: boolean
    score: number
    completedAt?: string
  }[]
  overallProgress?: number
  totalLectures?: number
  completedLectures?: number
  totalQuizzes?: number
  completedQuizzes?: number
  totalItems?: number
  completedItems?: number
  completionPercentage?: number
  quizzesCompleted?: boolean
  averageQuizScore?: number
  isCourseCompleted?: boolean
  lastViewedLecture?: string | null
  rewardPoints?: RewardPoints
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface Review {
  _id: string
  course: string | Course
  user: string | User
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Populated/virtual fields
  student?: User
  userName?: string
  userAvatar?: {
    url: string
  }
  courseTitle?: string
}

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

export interface Certificate {
  _id: string
  user: string | User
  course: string | {
    _id: string
    title: string
    thumbnail?: {
      url: string
    }
    category?: string
    instructor?: string | User
  }
  issueDate: string
  certificateId: string
  downloadUrl: string
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Populated/virtual fields
  userName?: string
  courseTitle?: string
  verificationCode?: string
  enrollmentId?: string
  completionDate?: string
  certificateUrl?: string
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  _id: string
  user: string
  type: 
    | 'course_update'
    | 'new_review'
    | 'quiz_grade'
    | 'announcement'
    | 'enrollment'
    | 'course_completion'
    | 'certificate_earned'
    | 'payment_success'
    | 'payment_failed'
  message: string
  isRead: boolean
  relatedEntityId?: string
  priority: 'high' | 'normal' | 'low'
  archived: boolean
  title?: string
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Backward compatibility
  read?: boolean
  link?: string
}

// ============================================================================
// DISCUSSION TYPES
// ============================================================================

export interface Discussion {
  _id: string
  user: string | User | null
  lecture: string | { _id: string; title: string; order?: number } | null
  course: string | { _id: string; title: string; thumbnail?: { url: string; public_id?: string | null } } | null
  question: string
  answers: DiscussionAnswer[]
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Populated fields
  userName?: string
  userAvatar?: {
    url: string
  }
}

export interface DiscussionAnswer {
  _id?: string
  user: string | User
  text: string
  isInstructorAnswer: boolean
  createdAt: string
  
  // Populated fields
  userName?: string
  userAvatar?: {
    url: string
  }
}

export interface Reply extends DiscussionAnswer {
  content?: string
}

// ============================================================================
// COUPON TYPES
// ============================================================================

export interface Coupon {
  _id: string
  code: string
  discountValue: number
  appliesTo: "all" | string
  expiresAt?: string
  isActive: boolean
  usageLimit?: number
  usageCount: number
  createdAt: string
  updatedAt: string
  __v?: number
  
  // Aliases
  discount?: number
  type?: "percentage" | "fixed"
  discountType?: "percentage" | "fixed"
  courseId?: string
  courses?: string[]
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface CheckoutSession {
  id: string
  url: string | null
  courseId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalCourses: number
  inProgress: number
  completed: number
  totalHours: number
  certificates: number
  rewardPoints: number
}

export interface InstructorStats {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  courses?: Course[]
}

// ============================================================================
// RESOURCE TYPES
// ============================================================================

export interface Resource {
  title: string
  url: string
  type?: "pdf" | "link" | "file"
}

// ============================================================================
// COURSE DETAIL TYPES
// ============================================================================

/**
 * Base Course type (simplified for course cards)
 */
export interface CourseBase {
  _id: string
  title: string
  description: string
  price: number
  discount: number
  stacks: string[]
  thumbnail: {
    public_id: string | null
    url: string
  }
  category: string
  instructor: {
    _id?: string
    name: string
    email?: string
    avatar?: {
      url: string
      public_id?: string | null
    }
    bio?: string
    expertise?: string[]
  }
  level: 'beginner' | 'intermediate' | 'advanced'
  requirements: string[]
  whatYouWillLearn: string[]
  totalDuration: number
  enrollmentCount: number
  averageRating: number
  reviewCount: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  
  // Computed/additional fields
  totalReviews?: number
  isFeatured?: boolean
  isPublished?: boolean
}

/**
 * Detailed course with populated chapters/content
 */
export interface CourseDetail extends CourseBase {
  chapters?: Chapter[]
  courseContent?: Chapter[]
  isEnrolled: boolean
  language?: string
}

// ============================================================================
// CHAPTER CONTENT TYPES
// ============================================================================

export interface ChapterContent {
  type: 'lecture' | 'quiz'
  title: string
  lectureId?: string
  quizId?: string
  lectureTitle?: string
  quizTitle?: string
  lectureUrl?: string
  lectureDuration?: number
  questionCount?: number
  questions?: Question[]
  resources?: string | Resource[]
  isCompleted: boolean
  order: number
  videoUrl?: string
  duration?: number
  isPreview?: boolean
}

// ============================================================================
// POPULATED REVIEW TYPES
// ============================================================================

/**
 * Populated Review - User is always populated with name and avatar
 * Used by: GET /api/v1/reviews/course/:courseId and GET /api/v1/reviews/instructor/:instructorId
 */
export interface PopulatedReview {
  _id: string
  course: string | {
    _id: string
    title: string
    thumbnail?: {
      url: string
      public_id?: string | null
    }
  }
  user: {
    _id: string
    name: string
    avatar: {
      url: string
      public_id?: string | null
    }
  }
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  __v?: number
}

