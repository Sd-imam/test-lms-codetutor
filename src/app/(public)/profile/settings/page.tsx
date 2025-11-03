"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { resetPassword, logout } from "@/lib/api-client"
import { Lock, Bell, Shield, Trash2, Key, AlertTriangle, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      // No token needed - cookies are sent automatically via credentials: "include"
      await resetPassword({
        password: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      setSuccess("Password updated successfully! Logging out...")
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      
      // Wait a moment to show the success message, then logout and redirect
      setTimeout(async () => {
        await logout()
        router.push("/signin?message=password-updated")
      }, 1500)
    } catch (err) {
      const error = err as Error
      const errorMessage = error.message || "Failed to update password"
      
      console.error('❌ Password reset error:', errorMessage)
      
      // Check if error is related to social auth
      if (errorMessage.includes("Cannot reset password") || errorMessage.includes("account type")) {
        setError("You signed in with a social provider (Google, Facebook, etc.). Password changes are not available for social authentication accounts.")
      } else if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        setError("Your session has expired. Please sign in again and try.")
      } else {
        setError(errorMessage)
      }
      setIsLoading(false)
    }
  }

  // For social auth detection, you can add user prop to this component if needed
  const isSocialAuthUser = false // Can be passed as prop from parent Server Component

  return (
    <div className="min-h-screen bg-slate-950 pt-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account <span className="text-blue-400">Settings</span>
          </h1>
          <p className="text-slate-400">Manage your account security and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Change Password</CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your password to keep your account secure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isSocialAuthUser ? (
                <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span className="ml-2">
                    You signed in with a social provider. Password changes are not available for social authentication accounts.
                  </span>
                </Alert>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {error && (
                    <Alert variant="error" className="bg-red-500/10 border-red-500/30 text-red-400">
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                      {success}
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        required
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPasswords.old ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                        placeholder="Enter new password (min 8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 shadow-lg transition-all duration-200"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Account Preferences */}
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Account Preferences</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your account preferences and privacy
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-slate-400">
                        Receive updates about your courses
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
                  >
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Privacy Settings</h4>
                      <p className="text-sm text-slate-400">
                        Control who can see your profile
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-red-400 text-xl">Danger Zone</CardTitle>
                  <CardDescription className="text-slate-400">
                    Irreversible and destructive actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <Trash2 className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Delete Account</h4>
                    <p className="text-sm text-slate-400">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
