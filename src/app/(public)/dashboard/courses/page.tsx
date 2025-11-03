import { redirect } from "next/navigation"
import { getUserDTO } from "@/lib/dto"
import { getMyEnrollmentsServer } from "@/lib/server-api"
import type { Enrollment, BackendEnrollmentItem } from "@/lib/types"
import { MyCoursesClient } from "@/components/dashboard/my-courses-client"

export default async function MyCoursesPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  let enrollments: Enrollment[] = []
  try {
    const data = await getMyEnrollmentsServer(user.id!)
    
    // Transform backend response - only extract what MyCoursesClient needs
    enrollments = (data.enrolledCourses || []).map((item: BackendEnrollmentItem): Enrollment => ({
      _id: item.enrollmentId,
      student: user.id!,
      course: {
        _id: item._id,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        totalDuration: item.totalDuration,
        instructor: item.instructor,
      } as any,
      enrollmentDate: item.enrollmentDate,
      paymentStatus: item.paymentStatus,
      amountPaid: item.amountPaid,
      progress: item.progress,
      createdAt: item.enrollmentDate,
      updatedAt: item.updatedAt || item.enrollmentDate,
    }))
  } catch (error) {
    console.error("Failed to fetch enrollments:", error)
  }

  return <MyCoursesClient enrollments={enrollments} />
}
