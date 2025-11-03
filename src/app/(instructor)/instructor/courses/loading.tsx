/**
 * Loading state for Instructor Courses page
 * Shows while courses are being fetched
 */

import { CoursesGridSkeleton } from '@/components/shared/loading-skeletons'

export default function InstructorCoursesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 bg-slate-800/50 rounded w-64 animate-pulse" />
            <div className="h-6 bg-slate-800/50 rounded w-96 animate-pulse" />
          </div>
          <div className="h-12 bg-slate-800/50 rounded w-40 animate-pulse" />
        </div>

        {/* Filter Skeleton */}
        <div className="flex gap-4 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/50 rounded w-32 animate-pulse" />
          ))}
        </div>

        {/* Courses Grid Skeleton */}
        <CoursesGridSkeleton count={6} />
      </div>
    </div>
  )
}

