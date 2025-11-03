import { redirect } from "next/navigation"
import { getUserDTO } from "@/lib/dto"

// Redirect to discussions list since we handle replies inline now
export default async function DiscussionDetailPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  // Redirect to the discussions page - replies are now handled inline
  redirect("/dashboard/discussions?tab=my")
}

