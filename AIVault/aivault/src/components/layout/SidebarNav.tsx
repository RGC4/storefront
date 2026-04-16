'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Compass, Upload, Heart, Settings, LogOut,
  Zap, Music, Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarNavProps {
  profile: { username: string; display_name: string; avatar_url: string | null } | null
}

const navItems = [
  { href: '/feed',    label: 'Home',     icon: Home },
  { href: '/explore', label: 'Explore',  icon: Compass },
  { href: '/upload',  label: 'Upload',   icon: Upload },
]

const libraryItems = [
  { href: '/library/liked',     label: 'Liked tracks',  icon: Heart },
  { href: '/library/purchases', label: 'Purchases',     icon: Zap },
  { href: '/library/subscriptions', label: 'Subscriptions', icon: Crown },
]

export function SidebarNav({ profile }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="space-y-6 py-2">
      {/* Main nav */}
      <div className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </div>

      {/* Library */}
      {profile && (
        <div>
          <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Library
          </p>
          <div className="space-y-1">
            {libraryItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                  pathname === href
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Account */}
      {profile && (
        <div>
          <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Account
          </p>
          <div className="space-y-1">
            <Link
              href="/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                pathname.startsWith('/settings')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
