"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

interface InstructorLayoutClientProps {
  children: React.ReactNode
  user: {
    name: string | null
    avatarUrl: string | null
  } | null
}

export function InstructorLayoutClient({ children, user }: InstructorLayoutClientProps) {
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
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-20 left-4 z-40 p-3 bg-linear-to-br from-violet-500/90 to-purple-500/90 backdrop-blur-sm border border-violet-600/50 rounded-lg text-white hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/20"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar 
        type="instructor" 
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

