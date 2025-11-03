import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users, BookOpen, Sparkles, ArrowRight } from "lucide-react"
import type { Course } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const discountedPrice = course.discount > 0 
    ? course.price * (1 - course.discount / 100) 
    : course.price

  return (
    <Link href={`/courses/${course._id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col card-glass hover:border-blue-500/50 card-hover-lift shadow-lg hover:shadow-glow-blue-lg">
        {/* Subtle gradient overlay */}
        <div className="overlay-gradient-blue group-hover:opacity-100" />
        
        {/* Thumbnail Section */}
        <div className="relative aspect-video overflow-hidden bg-slate-800">
          {course.thumbnail.url ? (
            <>
              <Image
                src={course.thumbnail.url}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              {/* Clean gradient overlay for text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-slate-600" />
            </div>
          )}
          
          {/* Clean badge */}
          <div className="absolute top-3 left-3 z-10">
            {course.isFeatured ? (
              <Badge className="badge-featured">
                <Sparkles className="w-3 h-3 mr-1.5" />
                Featured
              </Badge>
            ) : (
              <Badge className="badge-dark">
                {course.category}
              </Badge>
            )}
          </div>

          {/* Rating badge if exists */}
          {course.averageRating > 0 && (
            <div className="absolute top-3 right-3 z-10 rating-badge">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-white font-semibold text-sm">{course.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex-1 flex flex-col p-5">
          {/* Title - Clear and readable */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary-light transition-smooth">
            {course.title}
          </h3>

          {/* Description - Good contrast */}
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed grow">
            {course.description}
          </p>

          {/* Stats - Clean and simple */}
          <div className="flex items-center gap-5 mb-4 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="icon-sm-blue">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-slate-300 font-medium">
                {formatDuration(Math.floor((course.totalDuration || 0)))}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="icon-sm-purple">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-slate-300 font-medium">
                {course.enrollmentCount || 0} students
              </span>
            </div>
          </div>

          {/* Footer - Instructor and Price */}
          <div className="flex items-center justify-between">
            {/* Instructor */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
              {typeof course.instructor === 'object' && course.instructor?.avatar?.url ? (
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src={course.instructor.avatar.url}
                    alt={course.instructor?.name || 'Instructor'}
                    fill
                    className="rounded-full object-cover ring-2 ring-slate-700"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 shrink-0 rounded-full avatar-gradient-blue ring-2 ring-slate-700">
                  <span className="text-white text-xs font-semibold">
                    {typeof course.instructor === 'object' && course.instructor?.name ? course.instructor.name.charAt(0) : 'I'}
                  </span>
                </div>
              )}
              <span className="text-sm text-slate-300 font-medium truncate">
                {typeof course.instructor === 'object' && course.instructor?.name ? course.instructor.name : 'Instructor'}
              </span>
            </div>

            {/* Price - Clear and prominent */}
            <div className="flex flex-col items-end shrink-0">
              {course.discount > 0 && course.price > 0 && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs text-slate-500 line-through">
                    ${course.price.toFixed(2)}
                  </span>
                  <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {course.discount}% OFF
                  </span>
                </div>
              )}
              <span className="text-2xl font-bold text-white">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button - Clean and clear */}
        <div className="relative z-10 px-5 pb-5">
          <Button className="w-full h-11 btn-gradient-primary font-semibold group/btn">
            <span className="flex items-center justify-center">
              View Course Details
              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </Card>
    </Link>
  )
}

