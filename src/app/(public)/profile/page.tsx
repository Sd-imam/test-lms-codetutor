import { ProfileForm } from "@/components/profile/profile-form"
import { getUserDTO } from "@/lib/dto"
import { redirect } from "next/navigation"

/**
 * Profile Page - Server Component with SSR
 * No caching for personalized user data
 */
export default async function ProfilePage() {
  // Get user from cookies
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          My <span className="text-blue-400">Profile</span>
        </h1>
        <p className="text-slate-400 mb-8">Manage your account and track your learning progress</p>

        <div className="space-y-6">
          {/* Profile Info Card - Client Component for editing */}
          <ProfileForm 
            user={{
              id: user.id || "",
              name: user.name || "",
              email: user.email || "",
              role: user.role || "user",
              avatar: user.avatarUrl || undefined,
              isVerified: true // You can add this to getUserDTO if needed
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Generate metadata
export async function generateMetadata() {
  const user = await getUserDTO()
  
  return {
    title: `Profile - ${user?.name || "User"} | CodeTutor`,
    description: "Manage your profile and view your learning statistics",
  }
}
