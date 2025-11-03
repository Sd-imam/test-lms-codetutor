"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  user: {
    name: string | null
    avatarUrl: string | null
  } | null
}

export function DashboardLayoutClient({ children, user }: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Sync collapse state with sidebar
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("sidebar:collapsed")
        if (saved !== null) {
          setIsCollapsed(saved === "1")
        }
      } catch {}
    }

    handleStorageChange()
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab updates
    const handleSidebarToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ collapsed: boolean }>
      setIsCollapsed(customEvent.detail.collapsed)
    }
    window.addEventListener('sidebar-toggle', handleSidebarToggle)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle', handleSidebarToggle)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-24 left-4 z-40 p-3 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar 
        type="student" 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        user={user}
      />
      
      <main className={`
        min-h-screen transition-all duration-300 ease-out
        ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}
        p-4 sm:px-6 lg:px-16
      `}>
        {children}
      </main>
    </div>
  )
}

