'use client';

import Link from 'next/link';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useAuth, useLogout } from '@/lib/auth';

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { data: authData, isLoading } = useAuth();
  const logout = useLogout();
  const user = authData?.user;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-[20px] backdrop-saturate-150 bg-[rgba(250,250,250,0.82)] dark:bg-[rgba(10,10,10,0.8)] border-b border-[var(--line)] transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between py-4 gap-6">
          <Link href="/" className="font-serif font-medium text-2xl tracking-tight flex items-center gap-1 text-ink no-underline" style={{ fontVariationSettings: '"opsz" 144' }}>
            <span className="w-2 h-2 rounded-full bg-saffron mr-1.5" />
            Namma<em className="italic font-normal text-forest-text">Gear</em>
          </Link>

          <div className="flex items-center gap-7 text-sm text-ink-soft">
            <Link href="/browse" className="relative font-normal no-underline transition-colors hover:text-forest">
              Browse
            </Link>
            <Link href="/collections" className="hidden md:block font-normal no-underline transition-colors hover:text-forest">
              Collections
            </Link>
            <Link href="/how-it-works" className="hidden md:block font-normal no-underline transition-colors hover:text-forest">
              How it works
            </Link>
            <Link href="/safety" className="hidden sm:block font-normal no-underline transition-colors hover:text-forest">
              Safety
            </Link>
            
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-[var(--line-strong)] bg-[var(--bg-elevated)] text-ink inline-flex items-center justify-center transition-all duration-250 hover:bg-[var(--bg-muted)] hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/my-listings" className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-[13px] font-medium bg-transparent text-ink-soft transition-all duration-200 no-underline hover:text-forest">
                      My Listings
                    </Link>
                    <Link href="/profile" className="inline-flex items-center gap-2 text-ink-soft hover:text-forest transition-colors" title={user.name}>
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user.name}</span>
                    </Link>
                    <button
                      onClick={() => logout.mutate()}
                      className="inline-flex items-center gap-2 text-ink-soft hover:text-rose transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                    <Link href="/sell" className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full font-sans text-[13px] font-medium bg-ink text-bg border-[0.5px] border-transparent transition-all duration-200 hover:bg-forest hover:text-white hover:-translate-y-0.5 no-underline whitespace-nowrap">
                      Sell your tech →
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-[13px] font-medium bg-transparent text-ink-soft transition-all duration-200 no-underline hover:text-forest">
                      Sign in
                    </Link>
                    <Link href="/sell" className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full font-sans text-[13px] font-medium bg-ink text-bg border-[0.5px] border-transparent transition-all duration-200 hover:bg-forest hover:text-white hover:-translate-y-0.5 no-underline whitespace-nowrap">
                      Sell your tech →
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
