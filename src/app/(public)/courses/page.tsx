import { CourseCard } from "@/components/course/course-card"
import { CourseFilters } from "@/components/course/course-filters"
import { getAllCoursesPublic } from "@/lib/server-api"
import { Suspense } from "react"
import { CoursesGridSkeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import type { Course } from "@/lib/types"
import { Search, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

// Server Action for filtering
async function applyFilters(formData: FormData) {
  'use server'
  
  const search = formData.get('search') as string
  const category = formData.get('category') as string
  const level = formData.get('level') as string
  
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (level) params.set('level', level)
  
  redirect(`/courses?${params.toString()}`)
} 



interface CoursesPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    level?: string
    page?: string
  }>
}

async function CoursesList({ searchParams }: CoursesPageProps) {
  const { search, category, level, page } = await searchParams
  
  let courses: unknown[] = []
  let total = 0
  let error = null

  try {
    const data = await getAllCoursesPublic({
      search,
      category,
      level,
      page: page ? parseInt(page) : 1,
      limit: 12,
    })
    courses = data.courses || []
    total = data.total || 0
  } catch (err) {
    const errorObj = err as Error
    error = errorObj.message
    console.error("Failed to fetch courses:", err)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Failed to Load Courses
        </h3>
        <p className="text-slate-400 text-sm sm:text-base max-w-md text-center mb-2">{error}</p>
        <p className="text-xs sm:text-sm text-slate-500">Please try refreshing the page</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-6">
          <Search className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          No Courses Found
        </h3>
        <p className="text-slate-400 text-sm sm:text-base max-w-md text-center mb-2">
          We couldn&apos;t find any courses matching your criteria.
        </p>
        <p className="text-xs sm:text-sm text-slate-500">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {courses.map((course, index) => (
          <div key={(course as { _id: string })._id} style={{ animationDelay: `${index * 30}ms` }}>
            <CourseCard course={course as unknown as Course} />
          </div>
        ))}
      </div>
      
      {total > 12 && (
        <div className="mt-12 sm:mt-16 flex items-center justify-center">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl px-6 sm:px-8 py-4 sm:py-5 shadow-xl">
            <p className="text-sm sm:text-base font-medium text-slate-300">
              Showing{" "}
              <span className="text-lg sm:text-xl font-bold text-white">
                {courses.length}
              </span>
              {" "}of{" "}
              <span className="text-lg sm:text-xl font-bold text-white">
                {total}
              </span>
              {" "}courses
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 pt-28 sm:pt-32 pb-16 sm:pb-20">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 sm:px-5 py-2 mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">
                Browse Our Library
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              <span className="block mb-2 text-white">
                Explore All Courses
              </span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-400">
                Learn. Build. Succeed.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
              Discover world-class courses taught by industry experts and unlock your potential
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16">
        {/* Filters Card */}
        <div className="mb-10 sm:mb-12">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 rounded-xl p-5 sm:p-6 shadow-xl transition-all duration-300">
            <CourseFilters 
              search={params.search}
              category={params.category}
              level={params.level}
              applyFilters={applyFilters}
            />
          </div>
        </div>

        {/* Courses Grid Section */}
        <div className="pb-16 sm:pb-20">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Available Courses
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-400 flex items-center gap-2 ml-11">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Choose from our extensive collection
            </p>
          </div>

          {/* Courses Grid - Server Component with Suspense and Error Boundary */}
          <ErrorBoundary>
            <Suspense fallback={<CoursesGridSkeleton count={8} />}>
              <CoursesList searchParams={searchParams} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Browse All Courses | CodeTutor LMS - 5,000+ Expert Courses",
    description: "Explore 5,000+ expert-led coding courses. Learn programming, web development, data science, and more. Filter by category, level, and price.",
    keywords: ["coding courses", "programming courses", "web development courses", "online courses", "learn programming"],
    openGraph: {
      title: "Browse All Courses | CodeTutor LMS",
      description: "Explore 5,000+ expert-led coding courses. Learn programming, web development, data science, and more.",
    },
  }
}
