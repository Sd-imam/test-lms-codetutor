"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, HelpCircle, RefreshCw, MessageCircle } from "lucide-react"

export default function EnrollmentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="space-y-8 animate-fadeInUp">
          {/* Cancel Icon */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-orange-600 to-red-600 p-0.5 shadow-2xl shadow-orange-500/50">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Message */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                Payment Cancelled
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              No Worries! 
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Your payment was cancelled and no charges have been made to your account. You can try again whenever you&apos;re ready.
            </p>
          </div>

          {/* Info Cards */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              What happened?
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                <span>Your payment process was interrupted or cancelled</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                <span>No charges were made to your payment method</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                <span>You can return to the course and try enrolling again</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              onClick={() => router.back()}
              size="lg"
              className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 group"
            >
              <RefreshCw className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>
            <Button 
              onClick={() => router.push("/courses")}
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white group"
            >
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Browse Courses
            </Button>
          </div>

          {/* Support Section */}
          <div className="pt-6 border-t border-slate-700/50">
            <div className="bg-linear-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <MessageCircle className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Need Help?</h4>
              <p className="text-sm text-slate-400 mb-4">
                Our support team is here to assist you with any questions or issues
              </p>
              <a 
                href="mailto:support@codetutor.com" 
                className="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Contact Support →
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-4 bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-lg hover:border-blue-500/30 transition-all text-left group"
            >
              <p className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">
                Go to Dashboard
              </p>
              <p className="text-xs text-slate-500">View your enrolled courses</p>
            </button>
            <button
              onClick={() => router.push("/")}
              className="p-4 bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-lg hover:border-cyan-500/30 transition-all text-left group"
            >
              <p className="text-white font-medium mb-1 group-hover:text-cyan-400 transition-colors">
                Back to Home
              </p>
              <p className="text-xs text-slate-500">Explore learning paths</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

