import 'server-only' // Prevents this module from being imported on the client
import { getUser } from './dal'

export async function getUserDTO() {
  const user = await getUser()
  if (!user) return null
  return {
    id: (user as any)._id ?? (user as any).id ?? null,
    name: (user as any).name ?? null,
    email: (user as any).email ?? null,
    role: (user as any).role ?? null,
    avatarUrl: (user as any).avatar?.url ?? null,
  }
}


