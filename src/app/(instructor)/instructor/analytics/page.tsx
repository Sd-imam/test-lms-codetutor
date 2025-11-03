import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, BookOpen, Star, ArrowRight } from "lucide-react"
import { getInstructorDashboardServer } from "@/lib/server-api"
import { getUserDTO } from "@/lib/dto"
import type { Course } from "@/lib/types"

export default async function InstructorAnalyticsPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  let dashboard = null
  try {
    dashboard = await getInstructorDashboardServer(user.id!)
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
  }

  // Stats are now directly on the dashboard object, not nested under 'stats'
  const courses = (dashboard?.courses || []) as Course[]
  const stats = {
    totalCourses: dashboard?.totalCourses || 0,
    totalStudents: dashboard?.totalStudents || 0,
    totalRevenue: dashboard?.totalRevenue || 0,
    avgRating: dashboard?.averageRating || 0,
    totalEnrollments: courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0),
    publishedCourses: courses.filter(c => c.status === 'published').length,
    draftCourses: courses.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Analytics Overview</h1>
        <p className="text-slate-400">Track your teaching performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Total Courses</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-purple-400">{stats.totalCourses}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">
              {stats.publishedCourses} published, {stats.draftCourses} draft
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Total Students</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-blue-400">{stats.totalStudents}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Total Revenue</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-emerald-400">${stats.totalRevenue.toFixed(2)}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Average Rating</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-yellow-500">{stats.avgRating.toFixed(1)}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Course Performance</CardTitle>
          <CardDescription className="text-slate-400">Detailed analytics for each course</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No courses available
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrollmentCount || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {course.averageRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                  <Link href={`/instructor/analytics/${course._id}`}>
                    <Button className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                      View Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
