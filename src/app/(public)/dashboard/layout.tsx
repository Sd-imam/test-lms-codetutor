import { getUserDTO } from "@/lib/dto"
import { DashboardLayoutClient } from "./layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserDTO()
  
  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
}

