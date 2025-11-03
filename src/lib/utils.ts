import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * File & Image Utilities
 */


//  Convert a file to base64 string


export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}


//  Validate if a file is an image

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}


//Validate file size

export const isValidFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

//Format file size to human readable format

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Validate image file (type and size)

export const validateImageFile = (
  file: File, 
  maxSizeMB: number = 5
): { valid: boolean; error?: string } => {
  if (!isImageFile(file)) {
    return { valid: false, error: 'Please select a valid image file' }
  }
  
  if (!isValidFileSize(file, maxSizeMB)) {
    return { 
      valid: false, 
      error: `Image size should be less than ${maxSizeMB}MB` 
    }
  }
  
  return { valid: true }
}

// Duration & Time Utilities

// Format duration in seconds to human readable format (e.g., "1h 30m", "45m")

export const formatDuration = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return "0m"
  
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// Format a date to a human-readable "time ago" format
export const formatTimeAgo = (date: Date | string): string => {
  const reviewDate = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 1) {
    return 'today'
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months !== 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }
}
