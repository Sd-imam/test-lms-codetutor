import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react"

interface InstructorStatsProps {
  totalCourses: number
  totalStudents: number
  totalRevenue: number
  avgRating: number
}

/**
 * Instructor Stats - Server Component
 * Displays instructor's course statistics
 */
export function InstructorStats({
  totalCourses,
  totalStudents,
  totalRevenue,
  avgRating,
}: InstructorStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="relative overflow-hidden card-glass hover:border-blue-500/40 hover:shadow-xl card-hover-scale">
        <div className="overlay-gradient-blue hover:opacity-100"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Courses</CardTitle>
          <div className="icon-sm-blue">
            <BookOpen className="h-4 w-4 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-primary-light">{totalCourses}</div>
          <p className="text-xs text-slate-400 mt-1">
            Published courses
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden card-glass hover:border-purple-500/40 hover:shadow-xl card-hover-scale">
        <div className="overlay-gradient-purple hover:opacity-100"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Students</CardTitle>
          <div className="icon-sm-purple">
            <Users className="h-4 w-4 text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-purple-400">{totalStudents}</div>
          <p className="text-xs text-slate-400 mt-1">
            Enrolled students
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden card-glass hover:border-emerald-500/40 hover:shadow-xl card-hover-scale">
        <div className="overlay-gradient-emerald hover:opacity-100"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Revenue</CardTitle>
          <div className="icon-sm-emerald">
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">
            Lifetime earnings
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden card-glass hover:border-yellow-500/40 hover:shadow-xl card-hover-scale">
        <div className="overlay-gradient-orange hover:opacity-100"></div>
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Avg Rating</CardTitle>
          <div className="icon-sm-orange">
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-yellow-500">{avgRating.toFixed(1)}</div>
          <p className="text-xs text-slate-400 mt-1">
            Course rating
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

