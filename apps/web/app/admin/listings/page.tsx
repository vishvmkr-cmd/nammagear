'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminListings, useAdminUpdateListing, useAdminDeleteListing } from '@/lib/admin';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { AdminErrorBanner } from '@/components/admin-error-banner';
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';

export default function AdminListingsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ price?: string; title?: string; status?: string }>({});

  const { data, isLoading, isError, error, refetch } = useAdminListings({ status: statusFilter || undefined, page });
  const updateListing = useAdminUpdateListing();
  const deleteListing = useAdminDeleteListing();

  const startEdit = (listing: Record<string, unknown>) => {
    setEditingId(listing.id as string);
    setEditData({
      price: String(listing.price),
      title: listing.title as string,
      status: listing.status as string,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updates: Record<string, unknown> = { id: editingId };
    if (editData.price) updates.price = parseInt(editData.price);
    if (editData.title) updates.title = editData.title;
    if (editData.status) updates.status = editData.status;
    await updateListing.mutateAsync(updates as Parameters<typeof updateListing.mutateAsync>[0]);
    setEditingId(null);
  };

  const statuses = ['', 'ACTIVE', 'SOLD', 'REMOVED'];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.025em] text-ink">
            Manage Listings
          </h1>
          <p className="text-sm text-muted mt-1">Create on Sell, then edit or remove here</p>
        </div>
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-[13px] font-medium text-white no-underline hover:opacity-95"
        >
          <Plus className="w-4 h-4" />
          New listing
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {statuses.map((s) => (
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
        <div className="text-muted py-12 text-center">Loading listings...</div>
      ) : (
        <>
          <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-[0.5px] border-[var(--line)] bg-[var(--bg-muted)]">
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Item</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Seller</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Listed</th>
                    <th className="text-right py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-muted text-sm">
                        No listings match this filter.{' '}
                        <Link href="/sell" className="text-forest-text font-medium underline-offset-2 hover:underline">
                          Add one on Sell
                        </Link>
                        .
                      </td>
                    </tr>
                  ) : null}
                  {data?.items?.map((listing: Record<string, unknown>) => (
                    <tr key={listing.id as string} className="border-b-[0.5px] border-[var(--line)] last:border-0 hover:bg-[var(--bg-muted)] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {(listing.images as Array<Record<string, string>>)?.[0] && (
                            <img
                              src={(listing.images as Array<Record<string, string>>)[0].url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border-[0.5px] border-[var(--line)]"
                            />
                          )}
                          <div>
                            {editingId === listing.id ? (
                              <input
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="px-2 py-1 text-sm border-[0.5px] border-[var(--line-strong)] rounded-lg bg-[var(--form-bg)] text-ink w-full"
                              />
                            ) : (
                              <div className="font-medium text-ink">{listing.title as string}</div>
                            )}
                            <div className="text-[11px] text-muted">{(listing.category as Record<string, string>)?.name} · Grade {listing.condition as string}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {editingId === listing.id ? (
                          <input
                            type="number"
                            value={editData.price}
                            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                            className="px-2 py-1 text-sm border-[0.5px] border-[var(--line-strong)] rounded-lg bg-[var(--form-bg)] text-ink w-24"
                          />
                        ) : (
                          <span className="font-serif font-medium text-ink">
                            {formatPrice(listing.price as number)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {editingId === listing.id ? (
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="px-2 py-1 text-xs border-[0.5px] border-[var(--line-strong)] rounded-lg bg-[var(--form-bg)] text-ink"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="SOLD">Sold</option>
                            <option value="REMOVED">Removed</option>
                          </select>
                        ) : (
                          <span className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1 px-2 rounded-[3px] ${
                            listing.status === 'ACTIVE' ? 'bg-forest-soft text-forest-text' :
                            listing.status === 'SOLD' ? 'bg-saffron-soft text-saffron-text' :
                            'bg-rose-soft text-rose'
                          }`}>
                            {listing.status as string}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted text-[12px]">
                        {(listing.user as Record<string, string>)?.name}
                      </td>
                      <td className="py-3.5 px-4 text-muted text-[12px]">
                        {formatTimeAgo(listing.createdAt as string)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {editingId === listing.id ? (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={saveEdit}
                              className="w-8 h-8 rounded-lg bg-forest-soft text-forest-text flex items-center justify-center hover:bg-forest hover:text-white transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] text-muted flex items-center justify-center hover:text-ink transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => startEdit(listing)}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] text-muted flex items-center justify-center hover:text-forest transition-colors"
                              title="Edit listing"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteListing.mutate(listing.id as string)}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] text-muted flex items-center justify-center hover:text-rose transition-colors"
                              title="Remove listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
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
