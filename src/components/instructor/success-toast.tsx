'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, X } from 'lucide-react'

export function SuccessToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const success = searchParams.get('success')
  const title = searchParams.get('title')

  useEffect(() => {
    if (success === 'created' && title) {
      // Show toast for 5 seconds
      const timer = setTimeout(() => {
        // Remove query params from URL without reloading
        const url = new URL(window.location.href)
        url.searchParams.delete('success')
        url.searchParams.delete('title')
        router.replace(url.pathname, { scroll: false })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [success, title, router])

  if (success !== 'created' || !title) {
    return null
  }

  const handleClose = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('success')
    url.searchParams.delete('title')
    router.replace(url.pathname, { scroll: false })
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-center gap-3 bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg shadow-green-500/30 border border-green-500/20 backdrop-blur-sm min-w-[320px] max-w-md">
        <CheckCircle className="h-6 w-6 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Course Created Successfully!</p>
          <p className="text-sm text-green-100 mt-0.5">{decodeURIComponent(title)}</p>
        </div>
        <button
          onClick={handleClose}
          className="shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

