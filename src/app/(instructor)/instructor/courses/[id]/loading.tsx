/**
 * Loading state for Course Detail/Edit page
 * Shows while course data is being fetched
 */

import { CourseDetailSkeleton } from '@/components/shared/loading-skeletons'

export default function CourseDetailLoading() {
  return <CourseDetailSkeleton />
}

