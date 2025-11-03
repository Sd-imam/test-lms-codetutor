/**
 * Loading state for Admin Dashboard
 * Shows while admin data is being fetched
 */

import { TableSkeleton } from '@/components/shared/loading-skeletons'

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 bg-slate-800/50 rounded w-64" />
            <div className="h-6 bg-slate-800/50 rounded w-96" />
          </div>
          <div className="h-12 bg-slate-800/50 rounded w-40" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-700 rounded-xl p-6">
              <div className="h-6 bg-slate-800/50 rounded w-3/4 mb-4" />
              <div className="h-10 bg-slate-800/50 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-slate-800/50 rounded w-48" />
          <TableSkeleton rows={8} />
        </div>
      </div>
    </div>
  )
}

