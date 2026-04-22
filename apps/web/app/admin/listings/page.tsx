'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminListings, useAdminDeleteListing } from '@/lib/admin';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { AdminErrorBanner } from '@/components/admin-error-banner';
import { Pencil, Trash2, Plus, LayoutGrid, List } from 'lucide-react';

export default function AdminListingsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const { data, isLoading, isError, error, refetch } = useAdminListings({ status: statusFilter || undefined, page });
  const deleteListing = useAdminDeleteListing();

  const statuses = ['', 'ACTIVE', 'SOLD', 'REMOVED'];

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteListing.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.025em] text-ink">
            Manage Listings
          </h1>
          <p className="text-sm text-muted mt-1">Browse, edit, or remove listings</p>
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
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted">
              <span className="font-serif text-xl font-medium text-ink">{data?.total || 0}</span> total listings
            </div>
            
            <div className="flex gap-1 border-[0.5px] border-[var(--line-strong)] rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'card'
                    ? 'bg-ink text-bg'
                    : 'text-muted hover:text-ink'
                }`}
                title="Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Card
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-ink text-bg'
                    : 'text-muted hover:text-ink'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
            </div>
          </div>

          {data?.items?.length === 0 ? (
            <div className="py-16 text-center text-muted bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl">
              No listings match this filter.{' '}
              <Link href="/sell" className="text-forest-text font-medium underline-offset-2 hover:underline">
                Add one on Sell
              </Link>
              .
            </div>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data?.items?.map((listing: any) => (
                <div
                  key={listing.id}
                  className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[var(--img-warm-1)] to-[var(--img-warm-2)] flex items-center justify-center relative">
                    {listing.images?.[0] ? (
                      <img 
                        src={listing.images[0].url} 
                        alt={listing.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="opacity-30">
                        <rect x="15" y="20" width="70" height="60" rx="4" fill="currentColor" />
                      </svg>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`font-mono text-[9px] tracking-[0.12em] uppercase py-1 px-2 rounded-[4px] ${
                        listing.status === 'ACTIVE' ? 'bg-forest-soft text-forest-text' :
                        listing.status === 'SOLD' ? 'bg-saffron-soft text-saffron-text' :
                        'bg-rose-soft text-rose'
                      }`}>
                        {listing.status}
                      </span>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="font-mono text-[9px] tracking-[0.12em] uppercase py-1 px-2 rounded-[4px] bg-black/60 text-white backdrop-blur-sm">
                        Grade {listing.condition}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-medium text-sm text-ink line-clamp-2 mb-1">
                        {listing.title}
                      </h3>
                      <div className="text-xs text-muted">
                        {listing.category?.name} · {listing.area}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-serif text-lg font-medium text-ink">
                        {formatPrice(listing.price)}
                      </span>
                      {listing.negotiable && (
                        <span className="text-xs text-forest-text">negotiable</span>
                      )}
                    </div>

                    <div className="text-xs text-muted mb-4">
                      By {listing.user?.name} · {formatTimeAgo(listing.createdAt)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/listing/${listing.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-forest-soft text-forest-text text-sm font-medium hover:bg-forest hover:text-white transition-colors no-underline"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id, listing.title)}
                        className="px-3 py-2 rounded-lg bg-rose-soft text-rose hover:bg-rose hover:text-white transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
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
                    {data?.items?.map((listing: any) => (
                      <tr key={listing.id} className="border-b-[0.5px] border-[var(--line)] last:border-0 hover:bg-[var(--bg-muted)] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {listing.images?.[0] && (
                              <img
                                src={listing.images[0].url}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover border-[0.5px] border-[var(--line)]"
                              />
                            )}
                            <div>
                              <div className="font-medium text-ink">{listing.title}</div>
                              <div className="text-[11px] text-muted">{listing.category?.name} · Grade {listing.condition}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-serif font-medium text-ink">
                            {formatPrice(listing.price)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1 px-2 rounded-[3px] ${
                            listing.status === 'ACTIVE' ? 'bg-forest-soft text-forest-text' :
                            listing.status === 'SOLD' ? 'bg-saffron-soft text-saffron-text' :
                            'bg-rose-soft text-rose'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-muted text-[12px]">
                          {listing.user?.name}
                        </td>
                        <td className="py-3.5 px-4 text-muted text-[12px]">
                          {formatTimeAgo(listing.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <Link
                              href={`/listing/${listing.id}/edit`}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] text-muted flex items-center justify-center hover:text-forest transition-colors no-underline"
                              title="Edit listing"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(listing.id, listing.title)}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] text-muted flex items-center justify-center hover:text-rose transition-colors"
                              title="Remove listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
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
