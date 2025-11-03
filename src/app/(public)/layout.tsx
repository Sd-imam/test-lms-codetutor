import { ReactNode } from "react"

/**
 * Public Layout
 * For public-facing pages like home and course browsing
 */
export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}

