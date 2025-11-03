"use client"

import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent mb-2">
          Platform Settings
        </h1>
        <p className="text-slate-400">
          Configure platform-wide settings
        </p>
      </div>

      <div className="bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-slate-700/50 rounded-xl p-12 text-center">
        <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Platform Settings Coming Soon</h3>
        <p className="text-slate-400">
          This feature is under development. You&apos;ll be able to configure various platform settings here.
        </p>
      </div>
    </div>
  )
}

