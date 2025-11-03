import { redirect } from "next/navigation"
import { getUserDTO } from "@/lib/dto"
import { getStudentsByInstructorServer } from "@/lib/server-api"
import { InstructorStudentsClient } from "@/components/instructor/instructor-students-client"

export default async function InstructorStudentsPage() {
  const user = await getUserDTO()
  
  if (!user) {
    redirect("/signin")
  }

  let studentsData
  try {
    studentsData = await getStudentsByInstructorServer(user.id!)
  } catch (error) {
    console.error("Failed to fetch students:", error)
    studentsData = {
      students: [],
      totalStudents: 0,
      totalEnrollments: 0,
      courseMap: {}
    }
  }

  return <InstructorStudentsClient studentsData={studentsData} />
}
