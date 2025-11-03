import { getAdminDashboardStats } from "@/lib/server-api"
import { StatCard, QuickActions } from "@/components/admin"
import { 
  Users, 
  GraduationCap, 
  Award,
  UserCheck,
  UserX,
  BookOpen,
  TrendingUp,
  Activity
} from "lucide-react"
import { Suspense } from "react"

// Generate dynamic metadata for admin dashboard
export async function generateMetadata() {
  return {
    title: "Admin Dashboard | CodeTutor LMS",
    description: "Manage users, courses, and platform analytics with CodeTutor LMS admin dashboard.",
    robots: {
      index: false, // Don't index admin pages
      follow: false,
    },
  }
}

export default async function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">
          Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Dashboard Stats - Load in parallel with Suspense */}
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardStats />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity - Placeholder */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-slate-700/50 rounded-xl p-6">
          <p className="text-slate-400 text-center py-8">
            Activity tracking coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Server Component for Data Fetching
// ============================================================================

async function AdminDashboardStats() {
  const stats = await getAdminDashboardStats()
  
  // Type assertions for stats with null checks
  const users = (stats.users || {}) as Record<string, number>
  const courses = (stats.courses || {}) as Record<string, number>

  return (
    <>
      {/* User Statistics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-rose-500" />
          User Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={users.totalUsers || 0}
            icon={Users}
            color="from-rose-500 to-orange-500"
            link="/admin/users"
          />
          <StatCard
            title="Students"
            value={users.totalStudents || 0}
            icon={GraduationCap}
            color="from-blue-500 to-purple-600"
            link="/admin/users?role=user"
          />
          <StatCard
            title="Instructors"
            value={users.totalInstructors || 0}
            icon={Award}
            color="from-purple-500 to-purple-400"
            link="/admin/users?role=instructor"
          />
          <StatCard
            title="Admins"
            value={users.totalAdmins || 0}
            icon={UserCheck}
            color="from-amber-500 to-orange-500"
            link="/admin/users?role=admin"
          />
        </div>
      </div>

      {/* User Verification */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-500" />
          User Verification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Verified Users"
            value={users.verifiedUsers || 0}
            icon={UserCheck}
            color="from-green-500 to-emerald-500"
            subtitle={`${Math.round(((users.verifiedUsers || 0) / (users.totalUsers || 1)) * 100)}% of total users`}
          />
          <StatCard
            title="Unverified Users"
            value={users.unverifiedUsers || 0}
            icon={UserX}
            color="from-red-500 to-rose-500"
            subtitle={`${Math.round(((users.unverifiedUsers || 0) / (users.totalUsers || 1)) * 100)}% of total users`}
          />
        </div>
      </div>

      {/* Course Statistics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Course Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Courses"
            value={courses.total || 0}
            icon={BookOpen}
            color="from-blue-500 to-purple-600"
            link="/admin/courses"
          />
          <StatCard
            title="Published Courses"
            value={courses.published || 0}
            icon={TrendingUp}
            color="from-green-500 to-emerald-500"
            subtitle={`${Math.round(((courses.published || 0) / (courses.total || 1)) * 100)}% of total`}
          />
          <StatCard
            title="Draft Courses"
            value={courses.draft || 0}
            icon={BookOpen}
            color="from-amber-500 to-orange-500"
            subtitle={`${Math.round(((courses.draft || 0) / (courses.total || 1)) * 100)}% of total`}
          />
        </div>
      </div>
    </>
  )
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 mb-8">
      {/* User Statistics Skeleton */}
      <div>
        <div className="h-8 w-48 bg-slate-800/50 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-slate-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
              <div className="h-8 w-16 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* User Verification Skeleton */}
      <div>
        <div className="h-8 w-48 bg-slate-800/50 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-slate-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 w-32 bg-slate-800 rounded mb-3" />
              <div className="h-8 w-20 bg-slate-800 rounded mb-2" />
              <div className="h-3 w-28 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Course Statistics Skeleton */}
      <div>
        <div className="h-8 w-48 bg-slate-800/50 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-slate-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 w-32 bg-slate-800 rounded mb-3" />
              <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
              <div className="h-3 w-24 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
