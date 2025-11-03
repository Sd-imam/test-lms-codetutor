import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Star, DollarSign, CheckCircle } from "lucide-react"
import { getCourseAnalyticsServer } from "@/lib/server-api"
import { getUserDTO } from "@/lib/dto"

interface CourseAnalyticsPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseAnalyticsPage({ params }: CourseAnalyticsPageProps) {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  const { id } = await params

  let analytics = null
  let error = null

  try {
    analytics = await getCourseAnalyticsServer(id)
  } catch (err) {
    error = (err as Error).message
    console.error("Failed to fetch analytics:", err)
  }

  if (error || !analytics) {
    return (
      <div className="w-full max-w-7xl py-10">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400">{error || "Failed to load analytics"}</p>
        </div>
      </div>
    )
  }

  const analyticsData = analytics as Record<string, number>
  const enrollments = analyticsData.enrollments || 0
  const reviews = analyticsData.reviews || 0
  const averageRating = analyticsData.averageRating || 0
  const completionRate = analyticsData.completionRate || 0
  const totalRevenue = analyticsData.totalRevenue || 0

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Back Button */}
      <Link href="/instructor/analytics">
        <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Course Analytics</h1>
        <p className="text-slate-400">Detailed performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Enrollments</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-blue-400">{enrollments}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">Total students enrolled</p>
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
            <CardTitle className="text-3xl text-yellow-500">{averageRating.toFixed(1)}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">{reviews} reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Completion Rate</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-emerald-400">{completionRate.toFixed(0)}%</CardTitle>
            <p className="text-xs text-slate-500 mt-2">Students who finished</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-slate-400">Total Revenue</CardDescription>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-purple-400">${totalRevenue.toFixed(2)}</CardTitle>
            <p className="text-xs text-slate-500 mt-2">From this course</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
