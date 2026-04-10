import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GlobalPlayer } from '@/components/player/GlobalPlayer'
import { SidebarNav } from '@/components/layout/SidebarNav'

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile if logged in
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-card">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            AV
          </div>
          <span className="text-lg font-semibold tracking-tight">AIVault</span>
        </Link>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3">
          <SidebarNav profile={profile} />
        </div>

        {/* User profile footer */}
        {profile ? (
          <div className="border-t border-border p-3">
            <Link
              href={`/${profile.username}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-muted"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.display_name}</p>
                <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="border-t border-border p-3 space-y-2">
            <Link
              href="/login"
              className="block w-full rounded-lg border border-border py-2 text-center text-sm transition hover:bg-muted"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Sign up free
            </Link>
          </div>
        )}
      </aside>

      {/* Main content — offset by sidebar width, padded for player */}
      <main className="ml-56 flex-1 pb-24">
        {children}
      </main>

      {/* Persistent player */}
      <GlobalPlayer />
    </div>
  )
}
