import { ReactNode } from "react"

/**
 * Auth Layout
 * For authentication pages (signin, signup, activate, forgot-password)
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}

