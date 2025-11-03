// YouTube utility functions

/**
 * Get YouTube video ID from URL
 * Handles multiple YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - youtu.be/VIDEO_ID
 */
export function getYouTubeVideoId(url: string): string {
  if (!url) return ''
  
  // Remove any query parameters and fragments
  const cleanUrl = (url.split('?')[0] || url).split('#')[0] || url
  
  // Handle watch?v= format
  if (cleanUrl.includes('watch?v=')) {
    const match = cleanUrl.match(/watch\?v=([^&]+)/)
    return (match && match[1]) || ''
  }
  
  // Handle youtu.be format
  if (cleanUrl.includes('youtu.be/')) {
    const match = cleanUrl.match(/youtu\.be\/([^/]+)/)
    return (match && match[1]) || ''
  }
  
  // Handle embed format
  if (cleanUrl.includes('embed/')) {
    const match = cleanUrl.match(/embed\/([^?]+)/)
    return (match && match[1]) || ''
  }
  
  // Handle v/ format
  if (cleanUrl.includes('/v/')) {
    const match = cleanUrl.match(/\/v\/([^/]+)/)
    return (match && match[1]) || ''
  }
  
  // Fallback: get last part after splitting by "/"
  const parts = cleanUrl.split('/')
  return parts[parts.length - 1] || ''
}

// Alias for backward compatibility
export const extractYouTubeVideoId = getYouTubeVideoId

/**
 * Get video info using YouTube Player API (via react-youtube)
 * This is called when the YouTube player is ready
 */
export function extractVideoInfoFromPlayer(event: any) {
  try {
    const player = event.target
    const durationInSeconds = Math.round(player.getDuration())
    const videoData = player.getVideoData()
    const title = videoData.title || ''
    
    return {
      title,
      duration: durationInSeconds,
      videoId: videoData.video_id,
    }
  } catch (error) {
    console.error('Error extracting video info from player:', error)
    return null
  }
}
