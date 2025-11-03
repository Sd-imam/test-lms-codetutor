"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "Access denied. You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication.",
  }

  const message = errorMessages[error || "Default"] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-red-900/50 shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600/10 border border-red-600/30 rounded-full p-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-red-500">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Something went wrong
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant="error">
              {message}
            </Alert>

            <div className="flex flex-col gap-3">
              <Link href="/signin">
                <Button size="lg" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
