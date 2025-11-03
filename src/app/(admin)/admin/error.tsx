'use client'

/**
 * Error boundary for Admin Dashboard
 * Handles errors in the admin dashboard
 */

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home, Shield } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Admin dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-slate-900/60 border border-red-500/20 rounded-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Dashboard Error
          </h2>
          <p className="text-slate-400">
            We couldn&apos;t load the admin dashboard. Please try again.
          </p>
          {error.message && (
            <p className="text-sm text-red-400 mt-2">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/admin'}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Admin
          </Button>
        </div>
      </div>
    </div>
  )
}

