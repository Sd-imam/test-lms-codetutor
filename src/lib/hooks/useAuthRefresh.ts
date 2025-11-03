"use client"

import { useEffect } from "react"

// Periodically hit refresh-token so access token cookie stays fresh.
// Runs only on the client, relies on HttpOnly refresh cookie.
export function useAuthRefresh(intervalMs: number = 12 * 60 * 1000) {
  useEffect(() => {
    let timer: any
    async function tick() {
      // Best-effort silent refresh
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/refresh-token`, {
          method: "POST",
          credentials: "include",
        })
      } catch {}
    }

    // Kick off a first refresh shortly after mount, then interval
    const initial = setTimeout(tick, 1000)
    timer = setInterval(tick, intervalMs)
    return () => {
      clearTimeout(initial)
      clearInterval(timer)
    }
  }, [intervalMs])
}


