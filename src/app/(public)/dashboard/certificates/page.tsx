import { redirect } from "next/navigation"
import Link from "next/link"
import { Award, Trophy, CheckCircle, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserDTO } from "@/lib/dto"
import { CertificateCard } from "@/components/dashboard/CertificateCard"
import { EmptyState } from "@/components/ui"
import { getUserCertificatesServer } from "@/lib/server-api"

// Force dynamic rendering for personalized content
export default async function CertificatesPage() {
  const user = await getUserDTO()

  if (!user) {
    redirect("/signin")
  }

  const certificates = await getUserCertificatesServer()

  // Calculate latest month for stats (done on server)
  const latestMonth = certificates.length > 0 && certificates[0]?.issueDate
    ? new Date(certificates[0].issueDate).toLocaleDateString('en-US', { month: 'short' })
    : 'N/A'

  return (
    <div className="w-full max-w-6xl py-6 sm:py-8 lg:py-10">
      {/* Header Section */}
      <div className="relative mb-8 sm:mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 shadow-xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-emerald-500/5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Achievements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              My <span className="text-emerald-400">Certificates</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              View and download your course completion certificates
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-0.5">
                  {certificates.length}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Total Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-blue-400 mb-0.5">
                  {certificates.length}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-purple-400 mb-0.5">
                  {latestMonth}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Latest Achievement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div>
        <div className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Your Achievements</h2>
          <p className="text-xs sm:text-sm text-slate-400">Browse and download your earned certificates</p>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No Certificates Yet"
            description="Complete courses to earn certificates and showcase your achievements"
            action={
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert._id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CertificateCard 
                  certificate={cert}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

