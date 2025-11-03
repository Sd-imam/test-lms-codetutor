"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, Tag } from "lucide-react"
import { enrollInCourse, validateCoupon, checkEnrollment } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

interface EnrollmentCardProps {
  courseId: string
  price: number
  discount?: number
  isAuthenticated: boolean 
}

export function EnrollmentCard({
  courseId,
  price,
  discount = 0,
  isAuthenticated,
}: EnrollmentCardProps) {
  const router = useRouter()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)
  const [error, setError] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState("")

  // Check enrollment status when authenticated (cookies sent automatically)
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (isAuthenticated) {
        try {
          // Cookies sent automatically via credentials: "include"
          const result = await checkEnrollment(courseId)
          setIsEnrolled(result.isEnrolled)
        } catch (err) {
          console.error("Failed to check enrollment:", err)
          setIsEnrolled(false)
        } finally {
          setIsCheckingEnrollment(false)
        }
      } else {
        setIsCheckingEnrollment(false)
      }
    }

    checkEnrollmentStatus()
  }, [isAuthenticated, courseId])

  // Calculate final price with discount and coupon
  let finalPrice = price

  // Apply course discount first
  if (discount > 0) {
    finalPrice = price * (1 - discount / 100)
  }

  // Apply coupon discount on top of course discount
  if (appliedCoupon?.discountValue) {
    const couponDiscount = appliedCoupon.discountValue
    finalPrice = finalPrice * (1 - couponDiscount / 100)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    setIsValidatingCoupon(true)
    setCouponError("")

    try {
      const result = await validateCoupon(courseId, couponCode.trim())
      setAppliedCoupon(result.coupon)
      setCouponError("")
    } catch (err) {
      const error = err as Error
      setCouponError(error.message || "Invalid coupon code")
      setAppliedCoupon(null)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
  }

  const handleEnroll = async () => {
    // Prevent double enrollment attempts
    if (isEnrolling) {
      return
    }

    // If already enrolled, go to learning page
    if (isEnrolled) {
      router.push(`/courses/${courseId}/learn`)
      return
    }

    if (!isAuthenticated) {
      router.push(`/signin?callbackUrl=/courses/${courseId}`)
      return
    }

    setIsEnrolling(true)
    setError("")

    try {
      // Pass the applied coupon code if available
      const couponCodeToSend = appliedCoupon?.code || undefined
      
      // Cookies sent automatically via credentials: "include"
      const response = await enrollInCourse(courseId, couponCodeToSend)
      
      // If there's a checkout URL, redirect to Stripe for payment
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl
      } else {
        // Free course - navigate to learning page
        // Don't call router.refresh() to avoid race conditions
        router.push(`/courses/${courseId}/learn`)
      }
    } catch (err) {
      const error = err as Error
      console.error("Enrollment error:", error)
      setError(error.message || "Failed to enroll in course")
      setIsEnrolling(false)
    }
    // Note: Don't set isEnrolling to false if successful - user is navigating away
  }

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 sticky top-24 shadow-xl">
      <CardHeader>
        <div className="space-y-3">
          {(discount > 0 || appliedCoupon) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl text-slate-500 line-through">${price.toFixed(2)}</span>
              {discount > 0 && (
                <span className="text-xs font-bold text-white bg-red-600 px-2.5 py-1 rounded-md shadow-lg">
                  {discount}% OFF
                </span>
              )}
              {appliedCoupon && (
                <span className="text-xs font-bold text-white bg-green-600 px-2.5 py-1 rounded-md shadow-lg">
                  Coupon: {appliedCoupon.discountValue}% OFF
                </span>
              )}
            </div>
          )}
          <div className="text-3xl sm:text-4xl font-bold text-white">
            ${finalPrice.toFixed(2)}
          </div>
          {appliedCoupon && (
            <p className="text-sm text-green-400 font-medium">
              You save ${(price - finalPrice).toFixed(2)}!
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="error" className="bg-red-900/20 border-red-500/50 text-red-400">{error}</Alert>}
        
        {/* Coupon Section - Only show if not enrolled */}
        {!isEnrolled && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Tag className="h-3.5 w-3.5 text-green-400" />
              </div>
              <span>Have a coupon code?</span>
            </div>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    Coupon &quot;{appliedCoupon.code}&quot; applied!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-green-300 hover:text-green-200 hover:bg-green-900/30"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase())
                      setCouponError("")
                    }}
                    className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={isValidatingCoupon}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {isValidatingCoupon ? "Applying..." : "Apply"}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-sm text-red-400">{couponError}</p>
                )}
              </div>
            )}
          </div>
        )}

        <Button 
          className={`w-full ${
            isEnrolled 
              ? 'bg-slate-700 hover:bg-slate-600' 
              : 'bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
          } text-white border-0 transition-all duration-300`}
          size="lg"
          onClick={handleEnroll}
          disabled={isEnrolling || isCheckingEnrollment}
        >
          {isCheckingEnrollment
            ? "Checking..." 
            : isEnrolling 
            ? "Enrolling..." 
            : isEnrolled 
            ? "Continue Learning" 
            : "Enroll Now"}
        </Button>

        <div className="space-y-2.5 text-sm text-slate-300">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-blue-400" />
            <span>Full lifetime access</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-blue-400" />
            <span>Certificate of completion</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-blue-400" />
            <span>Access on mobile and desktop</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

