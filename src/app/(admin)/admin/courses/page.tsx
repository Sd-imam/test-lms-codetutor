import { getAllCoursesServer } from "@/lib/server-api"
import { CoursesClient } from "@/components/admin"

interface SearchParams {
  page?: string
  search?: string
}

export default async function CoursesManagementPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Next.js 15: searchParams is now a Promise
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const search = params.search || ""

  const { courses, total } = await getAllCoursesServer({
    page,
    limit: 10,
    search: search || undefined,
  })

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Course Management
        </h1>
        <p className="text-slate-400">
          Manage all courses on the platform
        </p>
      </div>

      <CoursesClient
        initialCourses={courses}
        initialTotal={total}
        initialPage={page}
        initialSearch={search}
      />
    </div>
  )
}
