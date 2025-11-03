"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialButton } from "@/components/ui/social-button"

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const urlError = searchParams.get("error")
  const message = searchParams.get("message")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setFormError(null)
    setFieldErrors({})
    setError("")

    const email = formData.email.trim()
    const password = formData.password

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({} as any))
        if (data?.errors && (data.errors.email || data.errors.password)) {
          setFieldErrors({
            email: typeof data.errors.email === "string" ? data.errors.email : undefined,
            password: typeof data.errors.password === "string" ? data.errors.password : undefined,
          })
        } else {
          setFormError(data?.message || "Invalid credentials")
        }
        return
      }

      // Success: backend set HttpOnly cookies in the browser
      window.location.href = "/dashboard"
    } catch {
      setFormError("Network error. Please try again.")
    } finally {
      setPending(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "github" | "facebook") => {
    setError("")
    setSocialLoading(provider)
    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error(`${provider} sign in exception:`, error)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setSocialLoading(null)
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to continue learning
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Social Login */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <SocialButton 
                provider="google"
                onClick={() => handleSocialLogin("google")}
                isLoading={socialLoading === "google"}
                disabled={socialLoading !== null}
                iconOnly
              />
              <SocialButton 
                provider="github"
                onClick={() => handleSocialLogin("github")}
                isLoading={socialLoading === "github"}
                disabled={socialLoading !== null}
                iconOnly
              />
              <SocialButton 
                provider="facebook"
                onClick={() => handleSocialLogin("facebook")}
                isLoading={socialLoading === "facebook"}
                disabled={socialLoading !== null}
                iconOnly
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">Or with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {message === "profile-updated" && !error && (
                <Alert variant="success" title="Profile Updated">
                  Your profile has been updated successfully. Please sign in again with your credentials.
                </Alert>
              )}

              {message === "password-updated" && !error && (
                <Alert variant="success" title="Password Updated">
                  Your password has been changed successfully. Please sign in with your new password.
                </Alert>
              )}
              
              {urlError && !error && (
                <Alert variant="warning" title="Authentication Error">
                  {urlError}
                </Alert>
              )}
              
              {error && (
                <Alert variant="error">
                  {error}
                </Alert>
              )}

              {formError && (
                <Alert variant="error">
                  {formError}
                </Alert>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={fieldErrors.email}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={fieldErrors.password}
                showPasswordToggle
                required
              />

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={pending}
                disabled={pending || socialLoading !== null}
              >
                {pending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
