import { redirect } from "next/navigation"
import Image from "next/image"
import { BarChart, Trophy, BookOpen, Clock, Target, TrendingUp, Award, Star, CheckCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/shared"
import { getUserDTO } from "@/lib/dto"
import { cookies } from "next/headers"
import Link from "next/link"

interface CourseProgress {
  course: {
    _id: string
    title: string
    thumbnail?: {
      url: string
    }
    category?: string
    level?: string
    averageRating?: number
  }
  progress: number
  isCompleted: boolean
  lastViewed: {
    _id: string
    title: string
    order: number
  } | null
  totalLectures: number
  totalQuizzes: number
  totalLecturesCompleted: number
  totalQuizzesCompleted: number
  totalItems: number
  completedItems: number
  averageQuizScore: number
  rewardPoints: {
    lecturePoints: number
    quizPoints: number
    completionBonus: number
    totalPoints: number
  }
}

interface DashboardData {
  totalEnrollments: number
  completedCourses: number
  inProgressCourses: number
  totalRewardPoints: number
  courses: CourseProgress[]
}

async function getUserProgress(): Promise<DashboardData> {
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
      .join('; ')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/progress/dashboard`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch progress")
    }

    const data = await response.json()
    return data.data || {
      totalEnrollments: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalRewardPoints: 0,
      courses: []
    }
  } catch (error) {
    console.error("Error fetching progress:", error)
    return {
      totalEnrollments: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalRewardPoints: 0,
      courses: []
    }
  }
}

export default async function ProgressPage() {
  const user = await getUserDTO()

  if (!user) {
    redirect("/signin")
  }

  const dashboardData = await getUserProgress()
  
  // Calculate average quiz score across all courses
  const coursesWithQuizzes = dashboardData.courses.filter(c => c.totalQuizzesCompleted > 0)
  const averageQuizScore = coursesWithQuizzes.length > 0
    ? Math.round(
        coursesWithQuizzes.reduce((sum, c) => sum + c.averageQuizScore, 0) / coursesWithQuizzes.length
      )
    : 0

  return (
    <div className="w-full max-w-6xl py-6 sm:py-8 lg:py-10">
      {/* Header Section */}
      <div className="relative mb-8 sm:mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 shadow-xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Learning Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              My <span className="text-purple-400">Progress</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Track your learning journey and celebrate your achievements
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-blue-400 mb-0.5">
                  {dashboardData.totalEnrollments}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Enrolled Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-0.5">
                  {dashboardData.completedCourses}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-purple-400 mb-0.5">
                  {dashboardData.inProgressCourses}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-orange-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-orange-400 mb-0.5">
                  {dashboardData.totalRewardPoints || 0}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Reward Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Stats */}
      {dashboardData.totalEnrollments > 0 && (
        <div className="mb-8 sm:mb-10 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <BarChart className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <CardTitle className="text-white text-lg font-bold">Learning Statistics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 sm:p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-500/10 mb-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
                    {Math.round((dashboardData.completedCourses / dashboardData.totalEnrollments) * 100)}%
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Completion Rate</p>
                </div>

                <div className="text-center p-4 sm:p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/10 mb-3">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
                    {averageQuizScore}%
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Avg Quiz Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-orange-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <CardTitle className="text-white text-lg font-bold">Reward Points Breakdown</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">Lecture Points</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {dashboardData.courses.reduce((sum, c) => sum + (c.rewardPoints?.lecturePoints || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-orange-500/30 transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Target className="h-3.5 w-3.5 text-orange-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">Quiz Points</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {dashboardData.courses.reduce((sum, c) => sum + (c.rewardPoints?.quizPoints || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Trophy className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">Completion Bonus</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {dashboardData.courses.reduce((sum, c) => sum + (c.rewardPoints?.completionBonus || 0), 0)}
                  </span>
                </div>
                <div className="border-t border-slate-700/50 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">Total Points</span>
                    <span className="text-2xl sm:text-3xl font-bold text-orange-400">
                      {dashboardData.totalRewardPoints || 0}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center font-medium">
                    10 pts/lecture · 20 pts/quiz · 50 pts/completion
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Progress List */}
      <div>
        <div className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Course Progress</h2>
          <p className="text-xs sm:text-sm text-slate-400">Detailed progress for each enrolled course</p>
        </div>

        {dashboardData.courses.length === 0 ? (
          <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
            <CardContent className="relative z-10 p-12 sm:p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-6">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Courses Enrolled</h3>
              <p className="text-slate-400 mb-8 text-sm sm:text-base max-w-md mx-auto">
                Start your learning journey by enrolling in courses
              </p>
              <Link href="/courses">
                <Button className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {dashboardData.courses.map((courseProgress, index) => (
              <Card 
                key={courseProgress.course._id} 
                className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative z-10 p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* Course Thumbnail */}
                    <div className="shrink-0">
                      {courseProgress.course.thumbnail?.url ? (
                        <div className="relative w-full md:w-48 aspect-video rounded-xl overflow-hidden border border-slate-700/50 group-hover:border-violet-500/30 transition-colors duration-300">
                          <Image
                            src={courseProgress.course.thumbnail.url}
                            alt={courseProgress.course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                          {courseProgress.isCompleted && (
                            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <CheckCircle className="h-3 w-3" />
                              Complete
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full md:w-48 aspect-video rounded-xl bg-slate-800 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                            {courseProgress.course.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            {courseProgress.course.category && (
                              <span className="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded-full border border-slate-700">
                                {courseProgress.course.category}
                              </span>
                            )}
                            {courseProgress.course.level && (
                              <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">
                                {courseProgress.course.level}
                              </span>
                            )}
                            {courseProgress.course.averageRating && courseProgress.course.averageRating > 0 && (
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span>{courseProgress.course.averageRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <ProgressBar
                          value={courseProgress.progress}
                          showLabel
                          variant={courseProgress.isCompleted ? "success" : "default"}
                          size="md"
                        />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-200">
                          <p className="text-base sm:text-lg font-bold text-purple-400">
                            {courseProgress.totalLecturesCompleted}/{courseProgress.totalLectures || 0}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">Lectures</p>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-200">
                          <p className="text-base sm:text-lg font-bold text-blue-400">
                            {courseProgress.totalQuizzesCompleted}/{courseProgress.totalQuizzes || 0}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">Quizzes</p>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-200">
                          <p className="text-base sm:text-lg font-bold text-emerald-400">{courseProgress.averageQuizScore}%</p>
                          <p className="text-xs text-slate-500 font-medium">Quiz Avg</p>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-orange-500/30 transition-all duration-200">
                          <p className="text-base sm:text-lg font-bold text-orange-400">
                            {courseProgress.rewardPoints?.totalPoints || 0}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">Points</p>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-200">
                          <p className="text-base sm:text-lg font-bold text-white">
                            {courseProgress.completedItems}/{courseProgress.totalItems}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">Total</p>
                        </div>
                      </div>

                      {/* Last Viewed & Action */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          {courseProgress.lastViewed ? (
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                <Clock className="h-3.5 w-3.5 text-blue-400" />
                              </div>
                              <span className="truncate">
                                Last: {courseProgress.lastViewed.title}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 italic">Not started yet</p>
                          )}
                        </div>
                        <Link href={`/courses/${courseProgress.course._id}/learn`} className="w-full sm:w-auto">
                          <Button
                            size="sm"
                            className={`w-full sm:w-auto border-0 shadow-lg transition-all duration-300 group/btn whitespace-nowrap ${
                              courseProgress.isCompleted
                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                                : 'bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
                            } text-white`}
                          >
                            {courseProgress.isCompleted ? 'Review Course' : 'Continue Learning'}
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Achievements Section */}
      {dashboardData.completedCourses > 0 && (
        <div className="mt-8 sm:mt-10">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Achievements</h2>
            <p className="text-xs sm:text-sm text-slate-400">Your learning milestones and badges</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {dashboardData.completedCourses >= 1 && (
              <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative z-10 p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-purple-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-7 w-7 sm:h-8 sm:w-8 text-purple-400" />
                  </div>
                  <h4 className="text-white font-bold mb-1.5 text-base sm:text-lg">First Course</h4>
                  <p className="text-xs sm:text-sm text-slate-400">Completed your first course</p>
                </CardContent>
              </Card>
            )}

            {dashboardData.completedCourses >= 5 && (
              <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative z-10 p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-emerald-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400" />
                  </div>
                  <h4 className="text-white font-bold mb-1.5 text-base sm:text-lg">Dedicated Learner</h4>
                  <p className="text-xs sm:text-sm text-slate-400">Completed 5+ courses</p>
                </CardContent>
              </Card>
            )}

            {averageQuizScore >= 90 && coursesWithQuizzes.length >= 3 && (
              <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-orange-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative z-10 p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-orange-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-7 w-7 sm:h-8 sm:w-8 text-orange-400" />
                  </div>
                  <h4 className="text-white font-bold mb-1.5 text-base sm:text-lg">Top Performer</h4>
                  <p className="text-xs sm:text-sm text-slate-400">90%+ average quiz score</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

