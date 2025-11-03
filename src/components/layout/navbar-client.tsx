"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  User, 
  LogOut, 
  Settings, 
  GraduationCap
} from "lucide-react"
import { logout } from "@/lib/api-client"
import { NotificationDropdown } from "@/components/shared/NotificationDropdown"

// Reusable NavLink Component
const NavLink = ({ href, children, pathname, className = "" }: { href: string; children: React.ReactNode; pathname: string; className?: string }) => {
  const isActive = pathname === href
  return (
    <Link 
      href={href} 
      className={`nav-link ${
        isActive 
          ? 'nav-link-active' 
          : 'nav-link-inactive'
      } ${className}`}
    >
      {children}
    </Link>
  )
}

interface NavbarClientProps {
  user: {
    id: string | null
    name: string | null
    email: string | null
    role: string | null
    avatarUrl: string | null
  } | null
}

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isAuthenticated = !!user

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      await logout()
      // Redirect to home page after logout
      router.push("/")
      router.refresh() // Refresh to clear user data
    } catch (error) {
      console.error("Logout failed:", error)
      // Force redirect even on error
      router.push("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Reset avatar error when user changes
  useEffect(() => {
    setAvatarError(false)
  }, [user?.avatarUrl])

  // Render minimal skeleton on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav 
        className="navbar-glass"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-overlay" />
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center">
            <Link href="/" className="group" aria-label="CodeTutor Home">
              <h1 className="font-bold w-auto h-9 flex items-center text-white justify-center gap-2.5 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex text-base items-center gap-0.5">
                  <span className="text-blue-400 font-bold">Code</span>
                  <span className="text-white font-bold">Tutor</span>
                </div>
              </h1>
            </Link>
          </div>
          <div className="h-9 w-32" /> {/* Placeholder for auth buttons */}
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav 
        className="navbar-glass"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Subtle gradient overlay */}
        <div className="navbar-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="group" aria-label="CodeTutor Home">
              <h1 className="font-bold w-auto h-9 flex items-center text-white justify-center gap-2.5 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex text-base items-center gap-0.5">
                  <span className="text-blue-400 font-bold">Code</span>
                  <span className="text-white font-bold">Tutor</span>
                </div>
              </h1>
            </Link>
          </div>

          {/* Middle: Main Navigation */}
          <div className="hidden lg:flex space-x-1">
            <NavLink href="/" pathname={pathname}>Home</NavLink>
            <NavLink href="/courses" pathname={pathname}>Courses</NavLink>
            <NavLink href="/books" pathname={pathname}>Books</NavLink>
            <NavLink href="/about" pathname={pathname}>About</NavLink>
            <NavLink href="/contact" pathname={pathname}>Contact</NavLink>
          </div>

          {/* Right: Dashboard + Notifications + Avatar */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {/* Dashboard Link */}
                <NavLink href="/dashboard" pathname={pathname}>Dashboard</NavLink>
                
                {/* Instructor Link (if instructor) */}
                {user?.role === "instructor" && (
                  <NavLink href="/instructor" pathname={pathname}>Instructor</NavLink>
                )}
                
                {/* Admin Link (if admin) */}
                {user?.role === "admin" && (
                  <NavLink href="/admin" pathname={pathname}>Admin</NavLink>
                )}

                {/* Notifications */}
                <NotificationDropdown isAuthenticated={user !== null} />

                {/* Profile Avatar Dropdown */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-1 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center justify-center"
                    aria-label="User menu"
                  >
                    {user?.avatarUrl && !avatarError ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border-2 border-blue-500 hover:border-blue-400 transition-colors object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform ring-2 ring-slate-700">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1 border-slate-700" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800/50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/signin">
                  <button 
                    className="px-6 py-2.5 rounded-xl border-2 text-white border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 cursor-pointer transition-all duration-300 font-medium"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button 
                    className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                    aria-label="Create a new account"
                  >
                    Register
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Auth & Menu Toggle */}
            <div className="md:hidden flex text-white items-center gap-3">
              {!isAuthenticated && (
                <Link href="/signin">
                  <button 
                    className="border-2 cursor-pointer border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
              )}
              
              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-all duration-300 relative z-60"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`} />
                  <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`} />
                  <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 lg:hidden z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-[73px] left-0 right-0 bottom-0 overflow-y-auto">
            {/* Clean background */}
            <div className="absolute inset-0 bg-slate-950" />
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-1">
              <Link 
                href="/" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/' 
                    ? 'bg-blue-500/10 text-white border-blue-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/courses' 
                    ? 'bg-blue-500/10 text-white border-blue-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
                onClick={toggleMobileMenu}
              >
                Courses
              </Link>
              <Link 
                href="/books" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/books' 
                    ? 'bg-blue-500/10 text-white border-blue-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
                onClick={toggleMobileMenu}
              >
                Books
              </Link>
              <Link 
                href="/about" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/about' 
                    ? 'bg-blue-500/10 text-white border-blue-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === '/contact' 
                    ? 'bg-blue-500/10 text-white border-blue-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>

              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-700/50 my-4 pt-4 space-y-1">
                    <Link 
                      href="/dashboard" 
                      className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                        pathname === '/dashboard' 
                          ? 'bg-blue-500/10 text-white border-blue-500/30' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                    {user?.role === "instructor" && (
                      <Link 
                        href="/instructor" 
                        className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                          pathname === '/instructor' 
                            ? 'bg-blue-500/10 text-white border-blue-500/30' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        Instructor
                      </Link>
                    )}
                    {user?.role === "admin" && (
                      <Link 
                        href="/admin" 
                        className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                          pathname === '/admin' 
                            ? 'bg-blue-500/10 text-white border-blue-500/30' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        Admin
                      </Link>
                    )}
                    <Link 
                      href="/profile" 
                      className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                        pathname === '/profile' 
                          ? 'bg-blue-500/10 text-white border-blue-500/30' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); toggleMobileMenu(); }}
                      className="block w-full text-left px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/40"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="border-t border-slate-700/50 my-4 pt-4 flex flex-col gap-3">
                  <Link href="/signup" onClick={toggleMobileMenu}>
                    <button className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3.5 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

