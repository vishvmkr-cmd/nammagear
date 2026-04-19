'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Moon, Sun, LogOut, ShoppingCart,
  ChevronDown, Menu, X, LayoutDashboard,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { useAuth, useLogout } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Crazy Deals', href: '/collections' },
  { label: 'Laptops',     href: '/browse?category=laptops' },
  { label: 'Desktops',    href: '/browse?category=desktops' },
  { label: 'Phones',      href: '/browse?category=phones' },
  { label: 'Monitors',    href: '/browse?category=monitors' },
  {
    label: 'Peripherals',
    href: '/browse?category=keyboards',
    children: [
      { label: 'Keyboards',       href: '/browse?category=keyboards' },
      { label: 'Mice & Trackpads', href: '/browse?category=mice' },
      { label: 'Audio',           href: '/browse?category=audio' },
      { label: 'Webcams',         href: '/browse?category=cameras' },
    ],
  },
  {
    label: 'Storage',
    href: '/browse?category=storage',
  },
  {
    label: 'Networking',
    href: '/browse?category=networking',
  },
  {
    label: 'Gaming',
    href: '/browse?category=gaming',
  },
  {
    label: 'Components',
    href: '/browse?category=components',
  },
  {
    label: 'Accessories',
    href: '/browse?category=accessories',
    children: [
      { label: 'Chargers & Docks', href: '/browse?category=accessories' },
      { label: 'Stands & Mounts',  href: '/browse?category=accessories' },
      { label: 'Cables & Hubs',    href: '/browse?category=accessories' },
      { label: 'Wearables',        href: '/browse?category=wearables' },
    ],
  },
  {
    label: 'Tablets',
    href: '/browse?category=tablets',
  },
  {
    label: 'Software',
    href: '/browse?category=software',
  },
  {
    label: 'Printers',
    href: '/browse?category=printers',
  },
  {
    label: 'Others',
    href: '/browse?category=others',
  },
];

const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', hint: 'Overview & stats' },
  { href: '/admin/listings', label: 'Listings', hint: 'Edit, remove, status' },
  { href: '/admin/orders', label: 'Orders', hint: 'All buyer orders' },
  { href: '/admin/service-tickets', label: 'Service tickets', hint: 'Support queue' },
  { href: '/admin/users', label: 'Users', hint: 'Accounts & roles' },
] as const;

function AdminNavDropdown() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 180); };

  return (
    <div style={{ position: 'relative' }} onMouseEnter={enter} onMouseLeave={leave}>
      <div
        className="nav-admin-trigger"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '8px 14px', borderRadius: 999, fontSize: 12,
          fontWeight: 600, background: 'var(--saffron-soft)',
          color: 'var(--saffron-text)', cursor: 'default',
          border: '1px solid color-mix(in srgb, var(--saffron) 35%, transparent)',
          userSelect: 'none',
        }}
      >
        <LayoutDashboard size={14} strokeWidth={2.25} />
        Admin panel
        <ChevronDown size={12} style={{ opacity: 0.65 }} />
      </div>
      {open && (
        <div
          style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 6,
            minWidth: 240, padding: '6px 0',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            boxShadow: '0 12px 32px -8px rgba(0,0,0,0.14)',
            zIndex: 220,
          }}
        >
          {ADMIN_NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: 'block', padding: '10px 16px', textDecoration: 'none',
                borderBottom: '1px solid var(--line-soft)',
              }}
              className="nav-admin-dd-item"
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{l.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{l.hint}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function categorySlugFromHref(href: string): string | null {
  const q = href.split('?')[1];
  if (!q) return null;
  try {
    return new URLSearchParams(q).get('category');
  } catch {
    return null;
  }
}

function navLinkClass(active: boolean, deal: boolean): string {
  const base = 'nav-cat-link';
  if (deal) return `${base} nav-cat-link--deal${active ? ' nav-cat-link--deal-active' : ''}`;
  return `${base}${active ? ' nav-cat-link--active' : ''}`;
}

function NavDropdownLink({
  item,
  pathname,
  activeCategory,
}: {
  item: NavItem;
  pathname: string;
  activeCategory: string | null;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  const deal = item.label === 'Crazy Deals';
  const browseCat = pathname === '/browse' ? activeCategory : null;

  const isActive = (): boolean => {
    if (deal) return pathname.startsWith('/collections');
    if (item.children) {
      return item.children.some((ch) => categorySlugFromHref(ch.href) === browseCat);
    }
    return pathname === '/browse' && categorySlugFromHref(item.href) === browseCat;
  };

  const active = isActive();

  if (!item.children) {
    return (
      <Link href={item.href} className={navLinkClass(active, deal)}>
        {item.label}
      </Link>
    );
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={enter} onMouseLeave={leave}>
      <Link href={item.href} className={navLinkClass(active, false)}>
        {item.label}
        <ChevronDown size={11} style={{ marginLeft: 3, opacity: 0.5 }} />
      </Link>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0,
            minWidth: 190, padding: '6px 0',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)',
            zIndex: 200,
          }}
        >
          {item.children.map((child) => {
            const slug = categorySlugFromHref(child.href);
            const childActive = pathname === '/browse' && slug === browseCat;
            return (
              <Link
                key={child.href + child.label}
                href={child.href}
                className={`nav-cat-dd-link${childActive ? ' nav-cat-dd-link--active' : ''}`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavCategoryStripInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = pathname === '/browse' ? searchParams.get('category') : null;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map((item) => (
          <NavDropdownLink
            key={item.label}
            item={item}
            pathname={pathname}
            activeCategory={activeCategory}
          />
        ))}
      </div>
    </div>
  );
}

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { data: authData, isLoading } = useAuth();
  const logout = useLogout();
  const user = authData?.user;

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 94%, transparent)', backdropFilter: 'blur(20px) saturate(1.5)' }}
    >
      {/* ─── Row 1: Logo · Actions (top right) ─── */}
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 56, gap: 16 }}>

            {/* Logo */}
            <Link
              href="/"
              style={{
                fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22,
                letterSpacing: '-0.02em', display: 'flex', alignItems: 'center',
                gap: 6, textDecoration: 'none', color: 'var(--ink)', flexShrink: 0,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)' }} />
              Namma<em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--forest-text)' }}>Gear</em>
            </Link>

            {/* Top right: theme · account · Sell · Sign in */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
              <button
                onClick={toggleTheme}
                title="Toggle theme"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid var(--line)', background: 'var(--bg-elevated)',
                  color: 'var(--ink)', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              </button>

              {!isLoading && user && (
                <>
                  <Link href="/my-orders" title="My Orders"
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: '1px solid var(--line)', background: 'var(--bg-elevated)',
                      color: 'var(--ink-soft)', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                    }}>
                    <ShoppingCart size={15} />
                  </Link>
                  <Link href="/profile" title={user.name}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: '1px solid var(--line)', background: 'var(--forest)',
                      color: '#fff', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', fontSize: 13, fontWeight: 600,
                    }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Link>
                  {user.role === 'ADMIN' && (
                    <>
                      <Link
                        href="/admin"
                        title="Admin dashboard"
                        className="sm:hidden"
                        style={{
                          width: 36, height: 36, borderRadius: '50%',
                          border: '1px solid var(--line)', background: 'var(--saffron-soft)',
                          color: 'var(--saffron-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        <LayoutDashboard size={15} strokeWidth={2.25} />
                      </Link>
                      <div className="hidden sm:block">
                        <AdminNavDropdown />
                      </div>
                    </>
                  )}
                </>
              )}

              {!isLoading && user?.role === 'ADMIN' && (
                <Link href="/sell"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 18px', borderRadius: 999, fontSize: 13,
                    fontWeight: 600, background: 'var(--ink)', color: 'var(--bg)',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}>
                  Sell your tech
                </Link>
              )}

              {!isLoading && !user && (
                <Link href="/auth/signin"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 999, fontSize: 13,
                    fontWeight: 500, color: 'var(--ink-soft)', textDecoration: 'none',
                    border: '1px solid var(--line-strong)', background: 'transparent',
                  }}>
                  Sign in
                </Link>
              )}

              {!isLoading && user && (
                <button onClick={() => logout.mutate()} title="Logout"
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '1px solid var(--line)', background: 'var(--bg-elevated)',
                    color: 'var(--muted)', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                  <LogOut size={14} />
                </button>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="nav-mobile-toggle"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid var(--line)', background: 'var(--bg-elevated)',
                  color: 'var(--ink)', display: 'none', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                }}>
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Category bar (URL-aware active state) ─── */}
      <div className="nav-category-bar" style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg-elevated)' }}>
        <Suspense fallback={<div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 42 }} />}>
          <NavCategoryStripInner />
        </Suspense>
      </div>

      {/* ─── Mobile drawer ─── */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, top: 56, zIndex: 100, background: 'var(--bg)', padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {NAV_ITEMS.map(item => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', padding: '12px 0', fontSize: 15,
                    textDecoration: 'none', borderBottom: '1px solid var(--line)',
                    color: item.label === 'Crazy Deals' ? 'var(--saffron)' : 'var(--ink-soft)',
                    fontWeight: item.label === 'Crazy Deals' ? 600 : 400,
                  }}>
                  {item.label}
                </Link>
                {item.children && (
                  <div style={{ paddingLeft: 16 }}>
                    {item.children.map(child => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: 'block', padding: '10px 0', fontSize: 14,
                          color: 'var(--muted)', textDecoration: 'none',
                          borderBottom: '1px solid var(--line-soft)',
                        }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!isLoading && !user && (
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1px solid var(--line-strong)', color: 'var(--ink)', textDecoration: 'none' }}>
                  Sign in
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <>
                  <div
                    style={{
                      fontFamily: "'Geist Mono', monospace", fontSize: 10,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--saffron-text)', fontWeight: 600, marginTop: 8, marginBottom: 4,
                    }}
                  >
                    Admin panel
                  </div>
                  {ADMIN_NAV_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'block', padding: '12px 14px', borderRadius: 10,
                        fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                        textDecoration: 'none', background: 'var(--bg-muted)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      {l.label}
                      <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: 'var(--muted)', marginTop: 2 }}>{l.hint}</span>
                    </Link>
                  ))}
                  <Link href="/sell" onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'var(--ink)', color: 'var(--bg)', textDecoration: 'none' }}>
                    Sell your tech — new listing
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-cat-link {
          display: inline-flex;
          align-items: center;
          padding: 10px 13px;
          font-size: 13px;
          font-weight: 400;
          color: var(--ink-soft);
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          cursor: pointer;
        }
        .nav-cat-link:hover {
          color: var(--forest);
          border-bottom-color: var(--forest);
        }
        .nav-cat-link--active {
          color: var(--forest);
          border-bottom-color: var(--forest);
        }
        .nav-cat-link--deal {
          font-weight: 600;
          color: var(--saffron);
        }
        .nav-cat-link--deal:hover,
        .nav-cat-link--deal-active {
          color: var(--saffron);
          border-bottom-color: var(--saffron);
        }
        .nav-cat-dd-link {
          display: block;
          padding: 8px 16px;
          font-size: 13px;
          color: var(--ink-soft);
          text-decoration: none;
          transition: background 0.1s, color 0.1s;
        }
        .nav-cat-dd-link:hover {
          background: var(--bg-muted);
          color: var(--forest);
        }
        .nav-cat-dd-link--active {
          background: var(--bg-muted);
          color: var(--forest);
          font-weight: 600;
        }
        .nav-admin-dd-item:last-child { border-bottom: none !important; }
        .nav-admin-dd-item:hover {
          background: var(--bg-muted);
        }
        .nav-mobile-toggle { display: none !important; }
        .nav-category-bar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .nav-mobile-toggle { display: inline-flex !important; }
          .nav-category-bar { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
