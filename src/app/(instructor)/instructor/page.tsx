import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { InstructorStats } from "@/components/instructor/instructor-stats"
import { CoursesList } from "@/components/instructor/courses-list"
import { getInstructorDashboardServer, getCoursesByInstructorServer } from "@/lib/server-api"
import { getUserDTO } from "@/lib/dto"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"

// Generate dynamic metadata for instructor dashboard
export async function generateMetadata() {
  const user = await getUserDTO()
  
  return {
    title: `Instructor Dashboard - ${user?.name || "Instructor"} | CodeTutor LMS`,
    description: "Manage your courses, track student progress, and grow your teaching business with CodeTutor LMS.",
    robots: {
      index: false, // Don't index instructor-specific pages
      follow: false,
    },
  }
}

export default async function InstructorDashboardPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-slate-400">Manage your courses and track performance</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats - Load in parallel with Suspense */}
      <Suspense fallback={<InstructorStatsSkeleton />}>
        <InstructorStatsWrapper instructorId={user.id!} />
      </Suspense>

      {/* Courses List - Load in parallel with Suspense */}
      <Suspense fallback={<InstructorCoursesSkeleton />}>
        <InstructorCoursesWrapper instructorId={user.id!} />
      </Suspense>
    </div>
  )
}

// ============================================================================
// Server Components for Data Fetching
// ============================================================================

async function InstructorStatsWrapper({ instructorId }: { instructorId: string }) {
  const dashboard = await getInstructorDashboardServer(instructorId)
  
  const statsData = {
    totalCourses: dashboard.totalCourses || 0,
    totalStudents: dashboard.totalStudents || 0,
    totalRevenue: dashboard.totalRevenue || 0,
    avgRating: dashboard.averageRating || 0,
  }

  return <InstructorStats {...statsData} />
}

async function InstructorCoursesWrapper({ instructorId }: { instructorId: string }) {
  const courses = await getCoursesByInstructorServer(instructorId)
  
  return (
    <div className="mt-8">
      <CoursesList courses={courses} />
    </div>
  )
}

// ============================================================================
// Loading Skeletons
// ============================================================================

function InstructorStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-800 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function InstructorCoursesSkeleton() {
  return (
    <div className="mt-8">
      <div className="h-8 w-48 bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-xl animate-pulse">
            <div className="h-48 bg-slate-800" />
            <CardContent className="pt-6">
              <div className="h-6 w-3/4 bg-slate-800 rounded mb-3" />
              <div className="h-4 w-full bg-slate-800 rounded mb-3" />
              <div className="h-4 w-2/3 bg-slate-800 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
