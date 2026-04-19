'use client';

import Link from 'next/link';
import { useAdminStats } from '@/lib/admin';
import { formatPrice } from '@/lib/utils';
import { AdminErrorBanner } from '@/components/admin-error-banner';
import {
  Users,
  Package,
  ShoppingCart,
  Headphones,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useAdminStats();

  if (isLoading) {
    return <div className="text-muted py-12 text-center">Loading dashboard...</div>;
  }

  if (isError) {
    return (
      <div>
        <AdminErrorBanner message={error instanceof Error ? error.message : 'Unknown error'} onRetry={() => refetch()} />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-forest-text',
      bg: 'bg-forest-soft',
      href: '/admin/users',
    },
    {
      label: 'Active Listings',
      value: `${stats?.activeListings ?? 0} / ${stats?.totalListings ?? 0}`,
      icon: Package,
      color: 'text-saffron-text',
      bg: 'bg-saffron-soft',
      href: '/admin/listings',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'text-forest-text',
      bg: 'bg-forest-soft',
      href: '/admin/orders',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders ?? 0,
      icon: AlertCircle,
      color: 'text-saffron-text',
      bg: 'bg-saffron-soft',
      href: '/admin/orders',
    },
    {
      label: 'Open Tickets',
      value: stats?.openTickets ?? 0,
      icon: Headphones,
      color: 'text-rose',
      bg: 'bg-rose-soft',
      href: '/admin/service-tickets',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: 'text-forest-text',
      bg: 'bg-forest-soft',
      href: '/admin/orders',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.025em] text-ink">
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">Overview of Student Gear Shop platform activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift no-underline"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-[28px] font-normal tracking-[-0.03em] text-ink leading-none mb-1.5">
                {card.value}
              </div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
                {card.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
