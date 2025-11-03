"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Discussion } from "@/lib/types"

interface ReplyResult {
  success: boolean
  data?: Discussion
  error?: string
}

export async function postDiscussionReply(
  discussionId: string, 
  text: string
): Promise<ReplyResult> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join('; ')

  // Validate input
  if (!text || text.trim().length < 5) {
    return { success: false, error: "Reply must be at least 5 characters" }
  }

  if (text.length > 2000) {
    return { success: false, error: "Reply cannot exceed 2000 characters" }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/discussions/${discussionId}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieHeader,
        },
        credentials: "include",
        body: JSON.stringify({ text: text.trim() }),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `Failed to submit reply (${response.status})` 
      }))
      return { 
        success: false, 
        error: error.message || `Server error: ${response.status}` 
      }
    }

    const result = await response.json()
    
    // Revalidate both the discussion detail and list pages
    revalidatePath(`/dashboard/discussions/${discussionId}`)
    revalidatePath('/dashboard/discussions')
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Failed to submit reply:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Network error. Please try again." 
    }
  }
}

