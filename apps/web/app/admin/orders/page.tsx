'use client';

import { useState } from 'react';
import { useAdminOrders, useAdminUpdateOrder } from '@/lib/admin';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { AdminErrorBanner } from '@/components/admin-error-banner';

const ORDER_STATUSES = ['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

const statusColors: Record<string, string> = {
  PENDING: 'bg-saffron-soft text-saffron-text',
  CONFIRMED: 'bg-forest-soft text-forest-text',
  COMPLETED: 'bg-forest-soft text-forest-text',
  CANCELLED: 'bg-rose-soft text-rose',
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminOrders({ status: statusFilter || undefined, page });
  const updateOrder = useAdminUpdateOrder();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrder.mutateAsync({ id: orderId, status: newStatus });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.025em] text-ink">
          Manage Orders
        </h1>
        <p className="text-sm text-muted mt-1">Track purchases and update order statuses</p>
      </div>

      <div className="flex gap-2 mb-6">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`font-mono text-[11px] py-1.5 px-3 border-[0.5px] rounded-full transition-all ${
              statusFilter === s
                ? 'bg-ink text-bg border-ink'
                : 'border-[var(--line-strong)] text-ink-soft hover:border-ink'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {isError ? (
        <AdminErrorBanner message={error instanceof Error ? error.message : 'Unknown error'} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="text-muted py-12 text-center">Loading orders...</div>
      ) : data?.items?.length === 0 ? (
        <div className="text-muted py-12 text-center">No orders found.</div>
      ) : (
        <>
          <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-[0.5px] border-[var(--line)] bg-[var(--bg-muted)]">
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Item</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Buyer</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Service Until</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Tickets</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((order: Record<string, unknown>) => {
                    const listing = order.listing as Record<string, unknown>;
                    const buyer = order.buyer as Record<string, unknown>;
                    const count = order._count as Record<string, number>;
                    return (
                      <tr key={order.id as string} className="border-b-[0.5px] border-[var(--line)] last:border-0 hover:bg-[var(--bg-muted)] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-ink text-[13px]">
                            {listing?.title as string}
                          </div>
                          <div className="text-[11px] text-muted">
                            {(listing?.category as Record<string, string>)?.name} · Seller: {(listing?.user as Record<string, string>)?.name}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-[13px] text-ink">{buyer?.name as string}</div>
                          <div className="text-[11px] text-muted">{buyer?.email as string}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-serif font-medium text-ink">
                            {formatPrice(order.amount as number)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status as string}
                            onChange={(e) => handleStatusChange(order.id as string, e.target.value)}
                            className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1.5 px-2.5 rounded-lg border-[0.5px] border-[var(--line)] cursor-pointer ${statusColors[order.status as string] || ''}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-[12px] text-muted">
                          {new Date(order.serviceExpiresAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4">
                          {count?.serviceTickets > 0 ? (
                            <span className="font-mono text-[11px] bg-saffron-soft text-saffron-text py-1 px-2 rounded-full">
                              {count.serviceTickets}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[12px] text-muted">
                          {formatTimeAgo(order.createdAt as string)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-[13px] transition-all ${
                    page === i + 1
                      ? 'bg-ink text-bg'
                      : 'bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] text-muted hover:text-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
