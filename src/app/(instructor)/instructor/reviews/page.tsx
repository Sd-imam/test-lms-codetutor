import { redirect } from "next/navigation"
import { getUserDTO } from "@/lib/dto"
import { getInstructorReviewsServer } from "@/lib/server-api"
import { InstructorReviewsClient } from "@/components/instructor/instructor-reviews-client"

export default async function InstructorReviewsPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  let reviewsData
  try {
    reviewsData = await getInstructorReviewsServer(user.id!)
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    reviewsData = {
      reviews: [],
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  return <InstructorReviewsClient reviewsData={reviewsData} />
}
