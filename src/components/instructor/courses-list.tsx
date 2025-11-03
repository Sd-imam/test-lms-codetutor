import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import type { Course } from "@/lib/types"

interface CoursesListProps {
  courses: Course[]
}

/**
 * Instructor Courses List - Server Component
 * Displays instructor's courses
 */
export function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <Card className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl pt-12">
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">My Courses</CardTitle>
              <CardDescription className="text-slate-400">Manage and track your courses</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-8">
            <div className="p-4 bg-purple-500/10 rounded-2xl w-fit mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-purple-400" />
            </div>
            <p className="text-slate-300 mb-4">No courses yet</p>
            <Link href="/instructor/courses/create">
              <Button className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 border-0 transition-all duration-300">
                Create Your First Course
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5"></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">My Courses</CardTitle>
            <CardDescription className="text-slate-400">Manage and track your courses</CardDescription>
          </div>
          <Link href="/instructor/courses">
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course._id}
              className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="h-16 w-24 bg-slate-800 rounded-lg shrink-0 overflow-hidden">
                  {course.thumbnail?.url && (
                    <Image
                      src={course.thumbnail.url}
                      alt={course.title}
                      width={96}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">
                    {course.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-400">
                    <span>{course.enrollmentCount || 0} students</span>
                    <span>⭐ {(course.averageRating || 0).toFixed(1)}</span>
                    <span className="font-semibold text-purple-400">${course.price || 0}</span>
                  </div>
                </div>
              </div>
              <Link href={`/instructor/courses/${course._id}`}>
                <Button variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600">Manage</Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

