'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useMyListings, useUpdateListing, useDeleteListing } from '@/lib/api';
import { API_URL } from '@/lib/api-url';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { Plus, Eye, Edit2, Trash2, MapPin } from 'lucide-react';

export default function MyListingsPage() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuth();
  const isAdmin = authData?.user?.role === 'ADMIN';
  const { data, isLoading, refetch } = useMyListings();
  const user = authData?.user;

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace('/auth/signin?redirect=/my-listings');
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center text-muted">
          {authLoading ? 'Loading…' : 'Redirecting…'}
        </div>
      </>
    );
  }

  const listings = data?.listings || [];

  const handleMarkSold = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'SOLD' }),
      });
      if (res.ok) refetch();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this listing?')) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) refetch();
    } catch {}
  };

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen py-8">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-[clamp(26px,3.2vw,36px)] font-normal tracking-[-0.025em] leading-[1.1] text-ink">
                My Listings
              </h1>
              <p className="text-sm text-muted mt-1">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
            </div>
            {isAdmin && (
              <Link href="/sell">
                <Button variant="forest" size="lg">
                  <Plus className="w-4 h-4" />
                  New listing
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-muted">Loading your listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted mb-4">You haven&apos;t listed anything yet.</p>
              {isAdmin ? (
                <Link href="/sell">
                  <Button variant="forest" size="lg">Add your first listing →</Button>
                </Link>
              ) : (
                <p className="text-sm text-muted max-w-md mx-auto">
                  New inventory is listed by the Student Gear Shop team. Browse the marketplace to find gear.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((listing: any) => (
                <div
                  key={listing.id}
                  className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--line-strong)] hover:shadow-lift"
                >
                  <Link href={`/listing/${listing.id}`} className="block no-underline">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[var(--img-warm-1)] to-[var(--img-warm-2)] flex items-center justify-center relative">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-muted text-xs">No image</div>
                      )}
                      <span className={`absolute top-3 left-3 font-mono text-[10px] tracking-[0.12em] uppercase py-1 px-2 rounded-[3px] border-[0.5px] border-[var(--line)] ${
                        listing.status === 'ACTIVE' ? 'bg-forest-soft text-forest-text' :
                        listing.status === 'SOLD' ? 'bg-saffron-soft text-saffron-text' :
                        'bg-rose-soft text-rose'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="p-4 px-[18px]">
                      <div className="font-serif text-[14px] font-medium tracking-[-0.015em] leading-[1.25] text-ink mb-1">
                        {listing.title}
                      </div>
                      <div className="text-[12px] text-muted mb-2">{listing.category?.name}</div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-[16px] font-medium tracking-[-0.025em] text-ink">
                          {formatPrice(listing.price)}
                        </span>
                        <span className="text-[11px] text-muted flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {listing.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {listing.status === 'ACTIVE' && (
                    <div className="px-[18px] pb-4 flex gap-2">
                      <button
                        onClick={() => handleMarkSold(listing.id)}
                        className="flex-1 text-[11px] font-mono py-2 px-3 rounded-full border-[0.5px] border-[var(--line-strong)] text-ink-soft hover:bg-saffron-soft hover:text-saffron-text hover:border-saffron transition-all"
                      >
                        Mark sold
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="text-[11px] font-mono py-2 px-3 rounded-full border-[0.5px] border-[var(--line-strong)] text-ink-soft hover:bg-rose-soft hover:text-rose hover:border-rose transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
