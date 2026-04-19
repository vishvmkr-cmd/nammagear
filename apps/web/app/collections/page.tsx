'use client';

import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

const collections = [
  {
    id: 'starter-setup',
    eyebrow: 'Essentials',
    title: 'Starter setup',
    titleEm: 'under ₹30K',
    desc: 'Everything a first-year needs — a refurbished laptop, a solid 24" monitor, and a decent keyboard. All verified, all Bangalore.',
    price: 'From ₹22,000',
    items: 24,
    className: 'coll-1',
    featured: [
      { name: 'Dell Latitude 5420', spec: 'i5-11th · 8GB · 256GB', price: '₹24,500', area: 'HSR Layout', grade: 'A' },
      { name: 'Dell U2419H 24"', spec: 'IPS · height-adjustable', price: '₹6,800', area: 'Koramangala', grade: 'A' },
      { name: 'Keychron K2 · brown', spec: 'mechanical · 84-key · RGB', price: '₹5,800', area: 'Jayanagar', grade: 'B' },
    ],
  },
  {
    id: 'creator-tools',
    eyebrow: 'For Creators',
    title: 'Design &',
    titleEm: 'video tools',
    desc: 'Colour-accurate monitors, iPads with Apple Pencil, and graphic tablets. Curated for design and media students.',
    price: 'From ₹8,500',
    items: 18,
    className: 'coll-2',
    featured: [
      { name: 'iPad Air 4 · 64GB WiFi', spec: 'Space Grey · w/ Apple Pencil', price: '₹32,000', area: 'Indiranagar', grade: 'A' },
      { name: 'Dell UltraSharp U2419H', spec: '24" IPS · sRGB 99%', price: '₹6,800', area: 'Koramangala', grade: 'A' },
      { name: 'Wacom Intuos S', spec: 'Bluetooth · 4096 levels', price: '₹4,200', area: 'BTM Layout', grade: 'A' },
    ],
  },
  {
    id: 'mech-keyboards',
    eyebrow: 'For Engineers',
    title: 'Mechanical',
    titleEm: 'keyboard nirvana',
    desc: 'Keychron, Royal Kludge, custom builds — the clicky corner of Student Gear Shop. Switches, caps, and full boards.',
    price: 'From ₹2,800',
    items: 32,
    className: 'coll-3',
    featured: [
      { name: 'Keychron K2 · brown', spec: 'mechanical · 84-key · RGB', price: '₹5,800', area: 'Jayanagar', grade: 'B' },
      { name: 'Royal Kludge RK84', spec: 'hot-swap · tri-mode', price: '₹3,400', area: 'Electronic City', grade: 'A' },
      { name: 'Keychron Q1 Pro', spec: 'QMK/VIA · gasket mount', price: '₹8,900', area: 'Whitefield', grade: 'A' },
    ],
  },
  {
    id: 'audio-gear',
    eyebrow: 'Music & Podcasting',
    title: 'Audio',
    titleEm: 'essentials',
    desc: 'Headphones, IEMs, microphones, and DACs. Perfect for music lovers, podcasters, and anyone who cares about sound.',
    price: 'From ₹1,800',
    items: 22,
    className: 'coll-1',
    featured: [
      { name: 'AirPods Pro 2nd gen', spec: 'USB-C · 8 months old', price: '₹14,500', area: 'BTM Layout', grade: 'A' },
      { name: 'Sony WH-1000XM4', spec: 'ANC · 30h battery', price: '₹11,500', area: 'HSR Layout', grade: 'B' },
      { name: 'Blue Yeti Nano', spec: 'USB condenser', price: '₹4,800', area: 'Koramangala', grade: 'A' },
    ],
  },
  {
    id: 'work-from-dorm',
    eyebrow: 'Remote Work',
    title: 'Work-from-',
    titleEm: 'dorm setup',
    desc: 'Webcams, USB hubs, standing desk converters and ergonomic chairs. Make your desk feel less like a battleground.',
    price: 'From ₹1,200',
    items: 15,
    className: 'coll-2',
    featured: [
      { name: 'Logitech MX Master 3', spec: 'graphite · with charger', price: '₹4,500', area: 'Marathahalli', grade: 'B' },
      { name: 'Logitech C920 HD Pro', spec: '1080p · auto-focus', price: '₹2,800', area: 'Electronic City', grade: 'A' },
      { name: 'Anker USB-C Hub 7-in-1', spec: 'HDMI + PD + SD', price: '₹1,800', area: 'Indiranagar', grade: 'A' },
    ],
  },
  {
    id: 'gaming-corner',
    eyebrow: 'Gaming',
    title: 'The gaming',
    titleEm: 'corner',
    desc: 'Controllers, gaming mice, headsets and the occasional GPU. For the after-class warriors.',
    price: 'From ₹1,500',
    items: 14,
    className: 'coll-3',
    featured: [
      { name: 'Xbox Controller', spec: 'Wireless · Carbon Black', price: '₹3,200', area: 'BTM Layout', grade: 'A' },
      { name: 'Razer DeathAdder V2', spec: 'wired · 20K DPI', price: '₹2,100', area: 'Jayanagar', grade: 'B' },
      { name: 'HyperX Cloud II', spec: '7.1 surround · detachable mic', price: '₹3,800', area: 'Whitefield', grade: 'A' },
    ],
  },
];

export default function CollectionsPage() {
  const { data: authData } = useAuth();
  const isAdmin = authData?.user?.role === 'ADMIN';

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen">
        <section className="section" style={{ paddingTop: '48px' }}>
          <div className="wrap-wide">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow">Curated by the editors</div>
                <h2 className="h-section">Themed <em>bundles</em>,<br />handpicked.</h2>
                <p>Not just a search bar — a point of view. Complete setups for different student budgets and vibes.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-16">
              {collections.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/browse?collection=${c.id}`} className="no-underline">
                  <div className={`coll ${c.className}`}>
                    <div>
                      <div className="coll-eyebrow">{c.eyebrow}</div>
                      <div className="coll-title">{c.title}<br /><em>{c.titleEm}</em></div>
                      <div className="coll-price">{c.desc.slice(0, 60)}...</div>
                    </div>
                    <div className="coll-meta"><span>{c.items} items</span><span>·</span><span className="coll-arrow">→</span></div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-20">
              {collections.slice(3).map((c) => (
                <Link key={c.id} href={`/browse?collection=${c.id}`} className="no-underline">
                  <div className={`coll ${c.className}`}>
                    <div>
                      <div className="coll-eyebrow">{c.eyebrow}</div>
                      <div className="coll-title">{c.title}<br /><em>{c.titleEm}</em></div>
                      <div className="coll-price">{c.desc.slice(0, 60)}...</div>
                    </div>
                    <div className="coll-meta"><span>{c.items} items</span><span>·</span><span className="coll-arrow">→</span></div>
                  </div>
                </Link>
              ))}
            </div>

            {collections.map((c) => (
              <div key={c.id} className="mb-20">
                <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
                  <div>
                    <div className="eyebrow muted-label">{c.eyebrow}</div>
                    <h3 className="font-serif text-[clamp(28px,3.5vw,42px)] font-normal tracking-[-0.02em] leading-[1.05] text-ink mt-3">
                      {c.title} <em className="italic text-forest-text font-normal">{c.titleEm}</em>
                    </h3>
                    <p className="text-[15px] text-muted mt-3 max-w-[52ch] leading-[1.6]">{c.desc}</p>
                  </div>
                  <Link href={`/browse?collection=${c.id}`}>
                    <Button variant="outline">View all {c.items} items →</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {c.featured.map((item, idx) => (
                    <div key={idx} className="listing">
                      <div className={`listing-img ${idx === 0 ? 'warm' : idx === 1 ? 'sage' : 'slate'}`}>
                        <span className={`corner-tag ${item.grade === 'A' ? 'a' : 'b'}`}>Grade {item.grade}</span>
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                          <rect x="15" y="20" width="70" height="60" rx="4" fill="currentColor" opacity="0.15" />
                          <rect x="20" y="25" width="60" height="50" rx="2" fill="currentColor" opacity="0.1" />
                        </svg>
                      </div>
                      <div className="listing-body">
                        <div className="listing-title">{item.name}</div>
                        <div className="listing-subtitle">{item.spec}</div>
                        <div className="listing-price-row">
                          <span className="listing-price">{item.price}</span>
                        </div>
                        <div className="listing-meta">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z" /></svg>
                          {item.area}
                          <span className="verified-mini">Verified</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap-wide">
            <div className="cta-block">
              <div className="relative z-[2]">
                <h2 className="font-serif font-light text-[clamp(36px,5vw,68px)] leading-[1] tracking-[-0.03em] text-[var(--cta-text)]">
                  {isAdmin ? (
                    <>Got gear for a<br />specific setup?<br /><em className="italic text-[#FBB24A] font-normal">List it.</em></>
                  ) : (
                    <>Find your<br />perfect setup.<br /><em className="italic text-[#FBB24A] font-normal">Browse.</em></>
                  )}
                </h2>
                <p className="text-[rgba(250,250,250,0.75)] text-base mt-5 max-w-[44ch] leading-[1.55]">
                  {isAdmin
                    ? 'Add listings that match these bundles — owner tools only.'
                    : 'Curated bundles for student budgets. Explore live listings on the marketplace.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 relative z-[2]">
                {isAdmin && (
                  <Link href="/sell"><Button variant="cream" size="xl" className="w-full justify-center">Sell your tech →</Button></Link>
                )}
                <Link href="/browse"><Button variant="outline-cream" size="xl" className="w-full justify-center">Browse listings</Button></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
