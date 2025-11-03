"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

function ActivateAccountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")

  const [email, setEmail] = useState(emailParam || "")
  const [activationCode, setActivationCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await apiClient.activateUser({ email, activationCode })
      setSuccess(true)
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (err) {
      const error = err as Error
      setError(error.message || "Activation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setIsResending(true)

    try {
      await apiClient.resendActivation(email)
      setResendCooldown(60)
      setError("")
    } catch (err) {
      const error = err as Error
      if (error.message.includes("retry")) {
        const match = error.message.match(/(\d+)/)
        if (match && match[1]) {
          setResendCooldown(parseInt(match[1]))
        }
      }
      setError(error.message || "Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Activate Your Account
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter the activation code sent to your email
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <Alert variant="success">
                Account activated successfully! Redirecting to login...
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="error">
                    {error}
                  </Alert>
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Activation Code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  required
                  maxLength={6}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLoading ? "Activating..." : "Activate Account"}
                </Button>

                <div className="flex flex-col items-center space-y-3 pt-2">
                  <p className="text-sm text-slate-400">
                    Didn&apos;t receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isResending}
                    isLoading={isResending}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Code"}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <Link
                    href="/signin"
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ActivateAccountContent />
    </Suspense>
  )
}
