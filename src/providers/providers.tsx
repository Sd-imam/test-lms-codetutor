"use client"

import { useAuthRefresh } from "@/lib/hooks/useAuthRefresh"


export default function Providers({ children }: { children: React.ReactNode }) {
  useAuthRefresh()
  return children as any
}


