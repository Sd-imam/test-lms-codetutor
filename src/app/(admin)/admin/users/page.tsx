import { getAllUsersServer } from "@/lib/server-api"
import { getUserDTO } from "@/lib/dto"
import { UsersClient } from "@/components/admin"

interface SearchParams {
  page?: string
  search?: string
  role?: string
}

export default async function UsersManagementPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Next.js 15: searchParams is now a Promise
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const search = params.search || ""
  const role = params.role || ""

  // Get current user to prevent self-deletion
  const currentUser = await getUserDTO()

  const data = await getAllUsersServer({
    page,
    limit: 10,
    search: search || undefined,
    role: role || undefined,
  })

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent mb-2">
          User Management
        </h1>
        <p className="text-slate-400">
          Manage all users, roles, and permissions
        </p>
      </div>

      <UsersClient
        initialUsers={data.users}
        initialTotal={data.total}
        initialPage={data.page}
        initialPages={data.pages}
        initialSearch={search}
        initialRole={role}
        currentUserId={currentUser?.id || undefined}
      />
    </div>
  )
}
