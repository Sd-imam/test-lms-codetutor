import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserDTO } from "@/lib/dto"
import { getCoursesByInstructorServer, getInstructorDashboardServer } from "@/lib/server-api"
import { CoursesList } from "@/components/instructor/courses-list"
import { SuccessToast } from "@/components/instructor/success-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Users, TrendingUp, DollarSign } from "lucide-react"
import { Suspense } from "react"


export default async function InstructorCoursesPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Success Toast */}
      <SuccessToast />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            My Courses
          </h1>
          <p className="text-slate-400">Manage and track your course performance</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards - Load in parallel with Suspense */}
      <Suspense fallback={<CoursesStatsSkeleton />}>
        <CoursesStatsWrapper instructorId={user.id!} />
      </Suspense>

      {/* Courses List - Load in parallel with Suspense */}
      <Suspense fallback={<CoursesListSkeleton />}>
        <CoursesListWrapper instructorId={user.id!} />
      </Suspense>
    </div>
  )
}

// ============================================================================
// Server Components for Data Fetching
// ============================================================================

async function CoursesStatsWrapper({ instructorId }: { instructorId: string }) {
  const dashboard = await getInstructorDashboardServer(instructorId)
  
  const stats = [
    {
      label: "Total Courses",
      value: dashboard.totalCourses || 0,
      icon: BookOpen,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400"
    },
    {
      label: "Total Students",
      value: dashboard.totalStudents || 0,
      icon: Users,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400"
    },
    {
      label: "Total Revenue",
      value: `$${(dashboard.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400"
    },
    {
      label: "Avg Rating",
      value: dashboard.averageRating ? dashboard.averageRating.toFixed(1) : "0.0",
      icon: TrendingUp,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      valueColor: "text-orange-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={index}
            className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl hover:border-slate-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardContent className="relative z-10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className={`text-3xl font-bold ${stat.valueColor}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

async function CoursesListWrapper({ instructorId }: { instructorId: string }) {
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

function CoursesStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
            <div className="h-4 w-24 bg-slate-800 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CoursesListSkeleton() {
  return (
    <div className="mt-8">
      <div className="h-8 w-48 bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
