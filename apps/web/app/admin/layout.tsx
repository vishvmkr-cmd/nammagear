'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Nav } from '@/components/nav';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Headphones,
  Users,
  ChevronRight,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/service-tickets', label: 'Service Tickets', icon: Headphones },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: authData, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const user = authData?.user;
  const allowed = !!user && user.role === 'ADMIN';

  useEffect(() => {
    if (isLoading) return;
    if (!allowed) router.replace('/');
  }, [isLoading, allowed, router]);

  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted">Loading...</div>
        </div>
      </>
    );
  }

  if (!allowed) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted">Redirecting…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="grid md:grid-cols-[220px_1fr] gap-8">
            <aside className="hidden md:block">
              <div className="sticky top-[85px]">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mb-4">
                  Admin Panel
                </div>
                <nav className="space-y-0.5">
                  {adminLinks.map((link) => {
                    const isActive = pathname === link.href ||
                      (link.href !== '/admin' && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] no-underline transition-all ${
                          isActive
                            ? 'bg-forest text-white font-medium'
                            : 'text-ink-soft hover:bg-[var(--bg-muted)] hover:text-ink'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
