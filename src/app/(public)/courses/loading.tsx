/**
 * Loading state for Courses page
 * Shows while courses are being fetched
 */

import { CoursesGridSkeleton } from '@/components/shared/loading-skeletons'

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-slate-800/50 rounded w-64 animate-pulse" />
          <div className="h-6 bg-slate-800/50 rounded w-96 animate-pulse" />
        </div>

        {/* Filter Skeleton */}
        <div className="flex gap-4 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/50 rounded w-24 animate-pulse" />
          ))}
        </div>

        {/* Courses Grid Skeleton */}
        <CoursesGridSkeleton count={9} />
      </div>
    </div>
  )
}

