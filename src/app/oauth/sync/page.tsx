import OAuthSyncClient from "@/components/oauth/sync/sync-client"

// This page is hit after OAuth callback
// It calls backend social-auth endpoint which sets cookies
export default async function OAuthSyncPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Get OAuth user data from URL params (passed by next-auth)
  const params = await searchParams
  const email = (params.email as string) ?? null
  const name = (params.name as string) ?? null
  const image = (params.image as string) ?? null

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <OAuthSyncClient email={email} name={name} image={image} />
    </div>
  )
}

