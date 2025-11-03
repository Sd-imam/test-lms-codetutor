"use client"

import { useEffect, useState } from "react"

export default function OAuthSyncClient({ 
  email, 
  name, 
  image 
}: { 
  email: string | null
  name: string | null
  image: string | null 
}) {
  const [status, setStatus] = useState("Syncing with backend...")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    async function syncWithBackend() {
      console.log("🔄 OAuth Sync - Starting...", { email, name, hasImage: !!image })
      
      if (!email || !name) {
        console.error("❌ OAuth Sync - Missing email or name")
        setError("Missing user data from OAuth provider")
        setTimeout(() => window.location.replace("/signin"), 2000)
        return
      }

      setStatus("Authenticating with backend...")
      
      try {
        const payload = { 
          email, 
          name, 
          avatar: image ? { url: image, public_id: `oauth_${email}` } : undefined 
        }
        
        console.log("📤 Calling backend social-auth:", payload)
        
        // Call backend - backend will set accessToken and refreshToken cookies
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/social-auth`, {
          method: "POST",
          credentials: "include", // Important: allows backend to set cookies
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        
        console.log("📥 Backend response:", res.status, res.statusText)
        
        if (!mounted) return
        
        if (res.ok) {
          const data = await res.json()
          console.log("✅ Social auth successful! Cookies set by backend")
          
          // Check cookies were set
          const cookies = document.cookie
          console.log("🍪 Cookies:", cookies)
          
          setStatus("Success! Redirecting...")
          // Redirect to dashboard - cookies are already set by backend
          setTimeout(() => window.location.replace("/dashboard"), 500)
        } else {
          const errorData = await res.json().catch(() => ({ message: "Unknown error" }))
          console.error("❌ Social auth failed:", errorData)
          setError(errorData.message || "Authentication failed")
          setTimeout(() => window.location.replace("/signin"), 2000)
        }
      } catch (err) {
        console.error("❌ Network error during social auth:", err)
        if (!mounted) return
        setError("Network error. Please try again.")
        setTimeout(() => window.location.replace("/signin"), 2000)
      }
    }
    
    syncWithBackend()
    return () => { mounted = false }
  }, [email, name, image])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center">
          {!error ? (
            <>
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white text-lg font-semibold mb-2">{status}</p>
              <p className="text-slate-400 text-sm text-center">Please wait while we complete your sign in</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-400 text-lg font-semibold mb-2">Authentication Failed</p>
              <p className="text-slate-400 text-sm text-center mb-4">{error}</p>
              <p className="text-slate-500 text-xs">Redirecting to sign in...</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


