import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { CourseCard } from "@/components/course/course-card"
import type { Course } from "@/lib/types"

interface FeaturedCoursesProps {
  courses: Course[]
}

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  if (courses.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <div className="section-tag-emerald">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Featured Courses
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learn from the <span className="text-gradient-emerald">Best</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
            Top-rated courses crafted to deliver real results
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {courses.slice(0, 6).map((course, index) => (
            <div 
              key={course._id} 
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link href="/courses">
            <Button 
              size="lg" 
              variant="outline" 
              className="btn-emerald group"
            >
              Explore All Courses
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

