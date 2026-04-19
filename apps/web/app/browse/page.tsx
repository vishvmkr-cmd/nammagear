'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Nav } from '@/components/nav';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { useListings, useCategories } from '@/lib/api';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  border: '1px solid var(--line-strong)',
  borderRadius: '8px',
  background: 'var(--form-bg)',
  color: 'var(--ink)',
  outline: 'none',
};

function BrowseMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') ?? '';

  const [filters, setFilters] = useState({
    condition: [] as string[],
    minPrice: '',
    maxPrice: '',
    area: [] as string[],
  });

  const { data: catData } = useCategories();
  const apiCategories = catData?.categories || [];

  const { data, isLoading } = useListings({
    category: categorySlug || undefined,
    condition: filters.condition.length > 0 ? filters.condition[0] as 'A' | 'B' | 'C' : undefined,
    minPrice: filters.minPrice ? parseInt(filters.minPrice, 10) : undefined,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice, 10) : undefined,
  });

  const setCategoryFilter = (slug: string) => {
    if (slug === categorySlug) router.replace('/browse', { scroll: false });
    else router.replace(`/browse?category=${encodeURIComponent(slug)}`, { scroll: false });
  };

  const toggleCondition = (cond: string) => {
    setFilters(prev => ({
      ...prev,
      condition: prev.condition.includes(cond)
        ? prev.condition.filter(c => c !== cond)
        : [...prev.condition, cond],
    }));
  };

  const toggleArea = (area: string) => {
    setFilters(prev => ({
      ...prev,
      area: prev.area.includes(area)
        ? prev.area.filter(a => a !== area)
        : [...prev.area, area],
    }));
  };

  const listings = data?.items || [];
  const filteredListings = listings.filter((listing: { area: string }) => {
    if (filters.area.length > 0 && !filters.area.includes(listing.area)) return false;
    return true;
  });

  const sectionLabel: React.CSSProperties = {
    fontFamily: "'Geist Mono', monospace",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '12px',
  };

  return (
    <main className="flex-1 min-h-screen">
      <div style={{ borderBottom: '1px solid var(--line)', padding: '32px 0' }}>
        <div className="wrap-wide">
          <div className="eyebrow">Browse</div>
          <h1 className="h-section" style={{ marginTop: '12px' }}>
            Find your next <em>gear</em>.
          </h1>
        </div>
      </div>

      <div className="wrap-wide" style={{ padding: '32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
          <aside style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            padding: '24px',
            alignSelf: 'start',
            position: 'sticky',
            top: '80px',
          }}>
            <div style={sectionLabel}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
              {apiCategories.map((cat) => (
                <div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCategoryFilter(cat.slug); }}
                  onClick={() => setCategoryFilter(cat.slug)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '6px 0', fontSize: '13px', cursor: 'pointer',
                    color: categorySlug === cat.slug ? 'var(--forest)' : 'var(--ink-soft)',
                    fontWeight: categorySlug === cat.slug ? 600 : 400,
                  }}
                >
                  <span style={{
                    width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
                    border: '1px solid',
                    borderColor: categorySlug === cat.slug ? 'var(--forest)' : 'var(--line-strong)',
                    background: categorySlug === cat.slug ? 'var(--forest)' : 'transparent',
                  }} />
                  {cat.name}
                </div>
              ))}
            </div>

            <div style={sectionLabel}>Price range</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input
                type="number"
                placeholder="₹ min"
                value={filters.minPrice}
                onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="₹ max"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={sectionLabel}>Condition</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {(['A', 'B', 'C'] as const).map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => toggleCondition(cond)}
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '11px', padding: '6px 14px',
                    borderRadius: '999px', cursor: 'pointer',
                    border: '1px solid',
                    borderColor: filters.condition.includes(cond) ? 'var(--ink)' : 'var(--line-strong)',
                    background: filters.condition.includes(cond) ? 'var(--ink)' : 'transparent',
                    color: filters.condition.includes(cond) ? 'var(--bg)' : 'var(--ink-soft)',
                    transition: 'all 0.15s',
                  }}
                >
                  Grade {cond}
                </button>
              ))}
            </div>

            <div style={sectionLabel}>Area</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['Koramangala', 'HSR Layout', 'Indiranagar', 'Marathahalli', 'BTM Layout', 'Electronic City', 'Whitefield', 'Jayanagar'].map(area => (
                <div
                  key={area}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleArea(area); }}
                  onClick={() => toggleArea(area)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '6px 0', fontSize: '13px', cursor: 'pointer',
                    color: filters.area.includes(area) ? 'var(--forest)' : 'var(--ink-soft)',
                  }}
                >
                  <span style={{
                    width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
                    border: '1px solid',
                    borderColor: filters.area.includes(area) ? 'var(--forest)' : 'var(--line-strong)',
                    background: filters.area.includes(area) ? 'var(--forest)' : 'transparent',
                  }} />
                  {area}
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 500, color: 'var(--ink)' }}>
                  {filteredListings?.length || 0}
                </span>{' '}
                listings found
                {categorySlug ? (
                  <span style={{ marginLeft: 8, fontSize: '12px', color: 'var(--muted-2)' }}>
                    · category: <strong style={{ color: 'var(--ink-soft)' }}>{categorySlug}</strong>
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Sort: Newest first ↓</div>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>Loading listings...</div>
            ) : filteredListings && filteredListings.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {filteredListings.map((listing: { id: string; title: string; images?: { url: string }[]; condition: string; category?: { name: string }; price: number; negotiable: boolean; area: string; createdAt: string }) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.id}`}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--line)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{
                      aspectRatio: '4/3',
                      background: 'linear-gradient(145deg, var(--img-warm-1), var(--img-warm-2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}>
                      {listing.images?.[0] ? (
                        <img src={listing.images[0].url} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.3 }}>
                          <rect x="15" y="20" width="70" height="60" rx="4" fill="currentColor" />
                        </svg>
                      )}
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px',
                        fontFamily: "'Geist Mono', monospace", fontSize: '10px',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '4px',
                        background: 'var(--bg-elevated)', border: '1px solid var(--line)',
                        color: listing.condition === 'A' ? 'var(--forest-text)' : listing.condition === 'B' ? 'var(--saffron-text)' : 'var(--rose)',
                      }}>
                        Grade {listing.condition}
                      </span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.25 }}>
                        {listing.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{listing.category?.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--line-strong)' }}>
                        <span style={{ fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: 500, color: 'var(--ink)' }}>
                          {formatPrice(listing.price)}
                        </span>
                        {listing.negotiable && (
                          <span style={{ fontFamily: "'Caveat', cursive", fontSize: '14px', color: 'var(--saffron-text)' }}>neg.</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                        <MapPin style={{ width: '11px', height: '11px' }} />
                        {listing.area} · {formatTimeAgo(listing.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '80px 32px',
                background: 'var(--bg-elevated)', borderRadius: '16px',
                border: '1px solid var(--line)',
              }}>
                <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '8px' }}>No listings found</p>
                <p style={{ fontSize: '13px', color: 'var(--muted-2)' }}>Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <>
      <Nav />
      <Suspense
        fallback={(
          <main className="flex-1 min-h-[40vh] flex items-center justify-center text-[var(--muted)]">
            Loading browse…
          </main>
        )}
      >
        <BrowseMain />
      </Suspense>
    </>
  );
}
