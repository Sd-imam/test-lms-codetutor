import { getUserDTO } from "@/lib/dto"
import { AdminLayoutClient } from "./layout-client"

/**
 * Admin Layout
 * For admin pages with admin sidebar
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserDTO()
  
  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
}
