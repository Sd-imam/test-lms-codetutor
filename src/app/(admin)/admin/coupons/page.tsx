import { getAllCouponsServer, getCoursesForCoupons } from "@/lib/server-api"
import { CouponsClient } from "@/components/admin"

export default async function CouponsPage() {
  const [coupons, courses] = await Promise.all([
    getAllCouponsServer(),
    getCoursesForCoupons(),
  ])
  

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent mb-2">
          Coupon Management
        </h1>
        <p className="text-slate-400">
          Create and manage discount coupons
        </p>
      </div>

      <CouponsClient initialCoupons={coupons} courses={courses} />
    </div>
  )
}
