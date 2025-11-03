import { useState, useCallback } from "react"

type ToastType = "default" | "destructive" | "success"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastType
}

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastType
  duration?: number
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default", duration = 3000 }: ToastOptions) => {
    const id = `toast-${++toastCount}`
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toast, toasts, dismiss }
}

