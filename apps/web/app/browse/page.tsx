'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { formatPrice, formatTimeAgo, getConditionLabel } from '@/lib/utils';
import { MapPin, Search } from 'lucide-react';
import { useListings } from '@/lib/api';

export default function BrowsePage() {
  const [filters, setFilters] = useState({
    category: '',
    pincode: '',
    condition: [] as string[],
    minPrice: '',
    maxPrice: '',
    area: [] as string[],
  });

  const { data, isLoading } = useListings({
    category: filters.category || undefined,
    pincode: filters.pincode || undefined,
    condition: filters.condition.length > 0 ? filters.condition[0] as any : undefined,
    minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
  });

  const toggleCondition = (cond: string) => {
    setFilters((prev) => ({
      ...prev,
      condition: prev.condition.includes(cond)
        ? prev.condition.filter((c) => c !== cond)
        : [...prev.condition, cond],
    }));
  };

  const toggleArea = (area: string) => {
    setFilters((prev) => ({
      ...prev,
      area: prev.area.includes(area)
        ? prev.area.filter((a) => a !== area)
        : [...prev.area, area],
    }));
  };

  const listings = data?.items || [];
  const filteredListings = listings.filter((listing: any) => {
    if (filters.area.length > 0 && !filters.area.includes(listing.area)) return false;
    return true;
  });

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Browser Frame */}
          <div className="rounded-2xl overflow-hidden border-[0.5px] border-[var(--line-strong)] bg-[var(--bg-elevated)] shadow-browser mb-8">
            <div className="flex items-center gap-3 px-[18px] py-[13px] bg-[var(--bg-muted)] border-b-[0.5px] border-[var(--line)]">
              <div className="flex gap-[7px]">
                <span className="w-[11px] h-[11px] rounded-full bg-[#E28577]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#E9C473]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#8BB58B]" />
              </div>
              <div className="flex-1 font-mono text-[11px] text-muted bg-[var(--bg-elevated)] py-[7px] px-[14px] rounded-md border-[0.5px] border-[var(--line)] flex items-center gap-2">
                <svg className="w-[10px] h-[10px] text-forest flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                nammagear.in/browse
              </div>
            </div>

            <div className="grid md:grid-cols-[240px_1fr]">
              {/* Sidebar Filters */}
              <aside className="hidden md:block px-6 py-7 border-r-[0.5px] border-[var(--line)] bg-bg">
                <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mb-3.5">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {['Laptops', 'Monitors', 'Desktops', 'Keyboards', 'Audio', 'Tablets'].map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-2.5 py-1.5 text-[13px] text-ink-soft cursor-pointer hover:text-forest"
                    >
                      <span className="w-3.5 h-3.5 border-[0.5px] border-[var(--line-strong)] rounded-[3px] flex-shrink-0" />
                      {cat}
                    </div>
                  ))}
                </div>

                <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mt-6 mb-3.5">
                  Price range
                </h4>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="₹ min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs border-[0.5px] border-[var(--line-strong)] rounded-[10px] bg-[var(--form-bg)] text-ink outline-none focus:border-forest"
                  />
                  <input
                    type="number"
                    placeholder="₹ max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs border-[0.5px] border-[var(--line-strong)] rounded-[10px] bg-[var(--form-bg)] text-ink outline-none focus:border-forest"
                  />
                </div>

                <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mt-6 mb-3.5">
                  Condition
                </h4>
                <div className="flex gap-1.5 flex-wrap">
                  {['A', 'B', 'C'].map((cond) => (
                    <span
                      key={cond}
                      onClick={() => toggleCondition(cond)}
                      className={`font-mono text-[11px] py-1.5 px-[11px] border-[0.5px] rounded-full cursor-pointer transition-all ${
                        filters.condition.includes(cond)
                          ? 'bg-ink text-bg border-ink'
                          : 'border-[var(--line-strong)] text-ink-soft hover:border-ink'
                      }`}
                    >
                      {cond}
                    </span>
                  ))}
                </div>

                <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mt-6 mb-3.5">
                  Area
                </h4>
                <div className="space-y-1.5">
                  {['Koramangala', 'HSR Layout', 'Indiranagar', 'Marathahalli', 'BTM Layout'].map((area) => (
                    <div
                      key={area}
                      onClick={() => toggleArea(area)}
                      className="flex items-center gap-2.5 py-1.5 text-[13px] text-ink-soft cursor-pointer hover:text-forest"
                    >
                      <span
                        className={`w-3.5 h-3.5 border-[0.5px] rounded-[3px] flex-shrink-0 transition-all ${
                          filters.area.includes(area)
                            ? 'bg-forest border-forest relative after:content-[""] after:absolute after:left-[3.5px] after:top-[1.5px] after:w-1 after:h-[7px] after:border-r-[1.5px] after:border-b-[1.5px] after:border-white after:rotate-45'
                            : 'border-[var(--line-strong)]'
                        }`}
                      />
                      {area}
                    </div>
                  ))}
                </div>

                <h4 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mt-6 mb-3.5">
                  Seller
                </h4>
                <div className="flex items-center gap-2.5 py-1.5 text-[13px] text-ink-soft cursor-pointer hover:text-forest">
                  <span className="w-3.5 h-3.5 border-[0.5px] border-[var(--line-strong)] rounded-[3px] flex-shrink-0 bg-forest relative after:content-[''] after:absolute after:left-[3.5px] after:top-[1.5px] after:w-1 after:h-[7px] after:border-r-[1.5px] after:border-b-[1.5px] after:border-white after:rotate-45" />
                  Verified only
                </div>
              </aside>

              {/* Main Content */}
              <div className="p-6">
                <div className="flex justify-between items-baseline mb-5 gap-4 flex-wrap">
                  <div className="text-[14px] text-muted">
                    <em className="italic text-ink font-serif text-[18px] not-italic">{filteredListings?.length || 0}</em> listings found
                  </div>
                  <div className="text-[13px] text-muted">Sort: Newest first ↓</div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12 text-muted">Loading listings...</div>
                ) : filteredListings && filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredListings.map((listing: any) => (
                      <Link
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-lift no-underline"
                      >
                        <div className="aspect-[4/3] bg-gradient-to-br from-[var(--img-warm-1)] to-[var(--img-warm-2)] flex items-center justify-center relative">
                          {listing.images && listing.images[0] ? (
                            <img
                              src={listing.images[0].url}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                          <span className={`absolute top-3 left-3 font-mono text-[10px] tracking-[0.12em] uppercase py-1 px-2 rounded-[3px] bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] ${
                            listing.condition === 'A' ? 'text-forest-text' : listing.condition === 'B' ? 'text-saffron-text' : 'text-rose'
                          }`}>
                            Grade {listing.condition}
                          </span>
                        </div>
                        <div className="p-4 px-[18px]">
                          <div className="font-serif text-[14px] font-medium tracking-[-0.015em] leading-[1.25] text-ink mb-1">
                            {listing.title}
                          </div>
                          <div className="text-[12px] text-muted mb-2.5">{listing.category.name}</div>
                          <div className="flex items-baseline justify-between pt-2.5 border-t-[0.5px] border-dashed border-[var(--line-strong)]">
                            <span className="font-serif text-[16px] font-medium tracking-[-0.025em] text-ink">
                              {formatPrice(listing.price)}
                            </span>
                            {listing.negotiable && (
                              <span className="font-hand text-[14px] text-saffron-text font-medium">neg.</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted flex items-center gap-1.5 mt-2">
                            <MapPin className="w-[11px] h-[11px]" />
                            {listing.area} · {formatTimeAgo(listing.createdAt)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted">
                    No listings found. Try adjusting your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
