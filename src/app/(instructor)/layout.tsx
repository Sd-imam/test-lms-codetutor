import { getUserDTO } from "@/lib/dto"
import { InstructorLayoutClient } from "./layout-client"

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserDTO()
  
  return <InstructorLayoutClient user={user}>{children}</InstructorLayoutClient>
}
