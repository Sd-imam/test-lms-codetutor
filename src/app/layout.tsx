import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { ConditionalFooter } from "@/components/layout/conditional-footer"
import Providers from "@/providers/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CodeTutor LMS - Unlock Your Coding Potential with Us",
  description: "A modern learning management system for online education with CodeTutor",
}

// Navbar loading fallback
function NavbarSkeleton() {
  return (
    <nav className="w-full fixed top-0 left-0 right-0 bg-linear-to-b from-black/95 via-black/90 to-transparent backdrop-blur-xl border-b border-slate-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="h-9 w-32 bg-slate-800/50 rounded-lg animate-pulse" />
        <div className="hidden lg:flex space-x-1">
          <div className="h-9 w-16 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="h-9 w-16 bg-slate-800/50 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-9 w-24 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-slate-800/50 rounded-full animate-pulse" />
        </div>
      </div>
    </nav>
  )
}

// Footer loading fallback (minimal placeholder)
function FooterSkeleton() {
  return (
    <footer className="bg-slate-950 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-20 w-full bg-slate-800/30 rounded-lg animate-pulse" />
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<NavbarSkeleton />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Suspense fallback={<FooterSkeleton />}>
              <ConditionalFooter />
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  )
}
