import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserDashboardServer } from "@/lib/server-api"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DashboardCoursesList } from "@/components/dashboard/dashboard-courses-list"
import { ErrorBoundary } from "@/components/error-boundary"
import { getUserDTO } from "@/lib/dto"
import { redirect } from "next/navigation"
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  // Get user from cookies
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="w-full max-w-6xl  py-6 sm:py-8 lg:py-10">
      {/* Welcome Section */}
      <div className="relative mb-8 sm:mb-10 lg:mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 lg:p-10 shadow-xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Student Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3">
                  Welcome back, <span className="text-blue-400">{user.name}</span>!
                </h1>
                <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl">
                  Continue your learning journey and achieve your goals
                </p>
              </div>
              
              {/* Quick Action */}
              <Link href="/courses" className="shrink-0">
                <Button className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group">
                  Browse Courses
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Load in parallel with Suspense */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <ErrorBoundary>
          <DashboardStatsWrapper />
        </ErrorBoundary>
      </Suspense>

      {/* Dashboard Courses List - Load in parallel with Suspense */}
      <Suspense fallback={<DashboardCoursesSkeleton />}>
        <ErrorBoundary>
          <DashboardCoursesWrapper />
        </ErrorBoundary>
      </Suspense>

      {/* Recommended Courses */}
      <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group shadow-xl">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div>
              <CardTitle className="text-white text-xl sm:text-2xl font-bold mb-2">
                Recommended for You
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm sm:text-base">
                Based on your learning preferences and progress
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">AI Powered</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-4 sm:mb-6">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
              Discover new courses tailored to your interests and skill level
            </p>
            <Link href="/courses">
              <Button 
                variant="outline" 
                className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all duration-200 group/btn"
              >
                Browse All Courses
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// Server Components for Data Fetching
// ============================================================================

async function DashboardStatsWrapper() {
  const dashboard = await getUserDashboardServer()
  
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <StatsCards
        totalCourses={dashboard?.totalCourses || 0}
        inProgress={dashboard?.inProgress || 0}
        completed={dashboard?.completed || 0}
      />
    </div>
  )
}

async function DashboardCoursesWrapper() {
  const dashboard = await getUserDashboardServer()
  
  // The backend returns courses in the dashboard response
  const courses = dashboard.courses || []
  
  return (
    <div className="mb-8 sm:mb-10">
      <DashboardCoursesList courses={courses} />
    </div>
  )
}

// ============================================================================
// Loading Skeletons
// ============================================================================

function DashboardStatsSkeleton() {
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-800 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DashboardCoursesSkeleton() {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="h-8 w-48 bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl animate-pulse">
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

// ============================================================================
// Metadata is generated at the top of the file
// ============================================================================
// Generate dynamic metadata for dashboard
export async function generateMetadata() {
  const user = await getUserDTO()
  
  return {
    title: `Dashboard - ${user?.name || "Student"} | CodeTutor LMS`,
    description: "Track your learning progress, view enrolled courses, and continue your coding journey with CodeTutor LMS.",
    robots: {
      index: false, // Don't index user-specific pages
      follow: false,
    },
  }
}