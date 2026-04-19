'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useMyOrders } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { Package, Shield, Clock, Headphones, MapPin } from 'lucide-react';

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-saffron-soft text-saffron-text',
  CONFIRMED: 'bg-forest-soft text-forest-text',
  COMPLETED: 'bg-forest-soft text-forest-text',
  CANCELLED: 'bg-rose-soft text-rose',
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useMyOrders();
  const user = authData?.user;

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace('/auth/signin?redirect=/my-orders');
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center text-muted px-8">
          {authLoading ? 'Loading…' : 'Redirecting…'}
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen">
        <div className="max-w-[900px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-[clamp(26px,3.2vw,36px)] font-normal tracking-[-0.025em] text-ink">
              My Orders
            </h1>
            <p className="text-sm text-muted mt-1">
              Your purchases on Student Gear Shop — each with 1 year of service support
            </p>
          </div>

          {isLoading ? (
            <div className="text-muted py-12 text-center">Loading orders...</div>
          ) : !data?.items?.length ? (
            <div className="text-center py-16 bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl">
              <Package className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="font-serif text-xl text-ink mb-2">No orders yet</h3>
              <p className="text-sm text-muted mb-6 max-w-[40ch] mx-auto">
                When you buy something on Student Gear Shop, it will show up here with your service support details.
              </p>
              <Link href="/browse">
                <Button>Browse listings</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.items.map((order: Record<string, unknown>) => {
                const listing = order.listing as Record<string, unknown>;
                const images = listing?.images as Array<Record<string, string>>;
                const category = listing?.category as Record<string, string>;
                const seller = listing?.user as Record<string, string>;
                const serviceExpires = new Date(order.serviceExpiresAt as string);
                const isServiceActive = serviceExpires > new Date();
                const ticketCount = (order._count as Record<string, number>)?.serviceTickets ?? 0;

                return (
                  <div
                    key={order.id as string}
                    className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-6 hover:border-[var(--line-strong)] transition-all"
                  >
                    <div className="flex gap-5 items-start">
                      {images?.[0] && (
                        <img
                          src={images[0].url}
                          alt=""
                          className="w-20 h-20 rounded-xl object-cover border-[0.5px] border-[var(--line)] flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-serif text-[17px] font-medium tracking-[-0.015em] text-ink">
                              {listing?.title as string}
                            </h3>
                            <div className="text-[12px] text-muted flex items-center gap-1.5 mt-0.5">
                              {category?.name} · Seller: {seller?.name}
                            </div>
                          </div>
                          <span className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1 px-2.5 rounded-[3px] flex-shrink-0 ${
                            statusColors[order.status as string]
                          }`}>
                            {statusLabels[order.status as string]}
                          </span>
                        </div>

                        <div className="flex items-center gap-5 mt-3 text-[12px]">
                          <span className="font-serif text-[18px] font-medium text-ink">
                            {formatPrice(order.amount as number)}
                          </span>
                          <span className="text-muted">{formatTimeAgo(order.createdAt as string)}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t-[0.5px] border-dashed border-[var(--line)]">
                          <div className="flex items-center gap-1.5">
                            <Shield className={`w-3.5 h-3.5 ${isServiceActive ? 'text-forest-text' : 'text-rose'}`} />
                            <span className={`text-[12px] ${isServiceActive ? 'text-forest-text' : 'text-rose'}`}>
                              {isServiceActive
                                ? `Service active until ${serviceExpires.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                : 'Service expired'
                              }
                            </span>
                          </div>
                          {ticketCount > 0 && (
                            <span className="text-[12px] text-muted">
                              {ticketCount} ticket{ticketCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {isServiceActive && order.status !== 'CANCELLED' && (
                          <div className="mt-4">
                            <Link href={`/service-request?orderId=${order.id}`}>
                              <Button variant="outline" size="default">
                                <Headphones className="w-3.5 h-3.5" />
                                Request Service Support
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
