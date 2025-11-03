"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Sparkles, ArrowRight, Mail, BookOpen, Trophy } from "lucide-react"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    // Simulate verification (in production, you might verify with backend)
    const timer = setTimeout(() => {
      setIsVerifying(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 relative flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {isVerifying ? (
          <div className="text-center space-y-8 animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-linear-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-xl animate-pulse" />
              </div>
              <div className="relative flex items-center justify-center">
                <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 text-blue-400 animate-spin" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                Verifying your payment
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">
                Please wait while we confirm your enrollment...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeInUp">
            {/* Success Icon */}
            <div className="text-center mt-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-green-600 to-emerald-600 p-0.5 shadow-2xl shadow-green-500/50">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-4 mt-10">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Payment Successful
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                Welcome to Your New Course!
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                Thank you for your purchase! You are now enrolled and ready to start your learning journey.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-4 py-6">
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">Full Access</p>
                <p className="text-xs text-slate-400">All course materials</p>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:border-cyan-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">Certificate</p>
                <p className="text-xs text-slate-400">Upon completion</p>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">Confirmation</p>
                <p className="text-xs text-slate-400">Email sent</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={() => router.push("/dashboard/courses")}
                size="lg"
                className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 group"
              >
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => router.push("/courses")}
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Browse More Courses
              </Button>
            </div>

            {/* Session Info */}
            {sessionId && (
              <div className="pt-6 border-t border-slate-700/50">
                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                  <p className="text-sm text-slate-400 font-mono">{sessionId}</p>
                </div>
              </div>
            )}

            {/* Email Confirmation */}
            <div className="text-center">
              <p className="text-sm text-slate-500">
                📧 A confirmation email has been sent to your registered email address
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EnrollSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-blue-400 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

