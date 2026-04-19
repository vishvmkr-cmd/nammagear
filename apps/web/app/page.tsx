'use client';

import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export default function HomePage() {
  const { data: authData } = useAuth();
  const isAdmin = authData?.user?.role === 'ADMIN';
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* ── HERO ── */}
        <header className="py-20 md:py-[80px] relative">
          <div className="wrap-wide">
            <div className="grid md:grid-cols-[1.25fr_1fr] gap-[60px] items-center max-md:grid-cols-1 max-md:gap-12">
              <div>
                <div className="hero-kicker fade-up">
                  <span className="live-dot" />
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--forest-text)]">
                    Live · 47 new listings this week
                  </span>
                  <span className="text-[var(--line-strong)] text-sm">·</span>
                  <span className="intro-kannada">ಬೆಂಗಳೂರಿಗೆ ಮಾತ್ರ</span>
                </div>

                <h1 className="h-display mb-8 relative fade-up delay-1">
                  Pre-loved tech.<br />
                  <em>Campus</em> to <span className="accent">campus.</span>
                  <span className="scribble-note">verified students only ↘</span>
                </h1>

                <p className="h-sub fade-up delay-2">
                  Laptops, monitors and gear, passed between verified Bangalore students. Fair prices. Pincode-locked. Zero resellers, zero scams.
                </p>

                <div className="hero-cta-group fade-up delay-3">
                  <div className="hero-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                    <input placeholder="Dell Latitude, mechanical keyboard, 24 inch monitor…" />
                    <Button>Search</Button>
                  </div>
                </div>

                <div className="hero-badges fade-up delay-4">
                  <span className="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> College email verified</span>
                  <span className="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/><circle cx="12" cy="9" r="3"/></svg> Bangalore pincode only</span>
                  <span className="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg> Avg. response under 10 min</span>
                </div>
              </div>

              <div className="hero-gallery fade-up delay-3 hidden md:block">
                <div className="stamp-verified">Student<br/>verified<br/>· est 2025 ·</div>

                <div className="float-card float-1">
                  <div className="fc-img" style={{ background: 'linear-gradient(145deg, var(--img-warm-1) 0%, var(--img-warm-2) 100%)' }}>
                    <span className="fc-corner">Grade A</span>
                    <svg width="85" height="85" viewBox="0 0 100 100" fill="none">
                      <rect x="10" y="20" width="80" height="52" rx="3" fill="#2A2823" stroke="#3A362F" strokeWidth="1"/>
                      <rect x="14" y="24" width="72" height="44" rx="1" fill="#4A5C5A"/>
                      <rect x="16" y="26" width="68" height="40" rx="1" fill="#6B7D7B" opacity="0.7"/>
                      <path d="M5 72h90l-4 8H9z" fill="#1A1815"/>
                      <rect x="44" y="72" width="12" height="3" fill="#0D0B09"/>
                    </svg>
                  </div>
                  <div className="fc-body">
                    <div className="fc-title">Dell Latitude 5420</div>
                    <div className="fc-price">₹24,500</div>
                    <div className="fc-meta">HSR Layout · 2h</div>
                  </div>
                </div>

                <div className="float-card float-2">
                  <div className="fc-img" style={{ background: 'linear-gradient(145deg, var(--img-sage-1) 0%, var(--img-sage-2) 100%)' }}>
                    <span className="fc-corner">Grade A</span>
                    <svg width="75" height="75" viewBox="0 0 100 100" fill="none">
                      <rect x="8" y="18" width="84" height="54" rx="2" fill="#2A322A"/>
                      <rect x="12" y="22" width="76" height="46" rx="1" fill="#4A5548"/>
                      <rect x="14" y="24" width="72" height="42" rx="1" fill="#607058" opacity="0.6"/>
                      <rect x="42" y="72" width="16" height="14" fill="#2A322A"/>
                      <rect x="32" y="86" width="36" height="4" rx="1" fill="#1D251D"/>
                    </svg>
                  </div>
                  <div className="fc-body">
                    <div className="fc-title">Dell U2419H 24&quot;</div>
                    <div className="fc-price">₹6,800</div>
                    <div className="fc-meta">Koramangala · 5h</div>
                  </div>
                </div>

                <div className="float-card float-3">
                  <div className="fc-img" style={{ background: 'linear-gradient(145deg, var(--img-terra-1) 0%, var(--img-terra-2) 100%)' }}>
                    <span className="fc-corner">Grade A</span>
                    <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                      <rect x="22" y="10" width="56" height="80" rx="6" fill="#2A2823"/>
                      <rect x="26" y="14" width="48" height="72" rx="2" fill="#D9C8AF"/>
                      <rect x="28" y="16" width="44" height="68" rx="1" fill="#E8D9BE" opacity="0.6"/>
                      <circle cx="50" cy="86" r="2" fill="#5A4A33"/>
                    </svg>
                  </div>
                  <div className="fc-body">
                    <div className="fc-title">iPad Air 4 · 64GB</div>
                    <div className="fc-price">₹32,000</div>
                    <div className="fc-meta">Indiranagar · 3h</div>
                  </div>
                </div>

                <div className="float-card float-4">
                  <div className="fc-img" style={{ background: 'linear-gradient(145deg, var(--img-slate-1) 0%, var(--img-slate-2) 100%)' }}>
                    <span className="fc-corner">Grade B</span>
                    <svg width="75" height="75" viewBox="0 0 100 100" fill="none">
                      <rect x="8" y="32" width="84" height="36" rx="3" fill="#2A2823"/>
                      <rect x="12" y="36" width="76" height="28" rx="1" fill="#3A362F"/>
                      <g fill="#5A5348">
                        <rect x="16" y="40" width="5" height="5" rx="0.5"/><rect x="23" y="40" width="5" height="5" rx="0.5"/><rect x="30" y="40" width="5" height="5" rx="0.5"/><rect x="37" y="40" width="5" height="5" rx="0.5"/>
                        <rect x="44" y="40" width="5" height="5" rx="0.5"/><rect x="51" y="40" width="5" height="5" rx="0.5"/><rect x="58" y="40" width="5" height="5" rx="0.5"/><rect x="65" y="40" width="5" height="5" rx="0.5"/>
                        <rect x="16" y="47" width="5" height="5" rx="0.5"/><rect x="23" y="47" width="5" height="5" rx="0.5"/><rect x="30" y="47" width="5" height="5" rx="0.5"/><rect x="37" y="47" width="5" height="5" rx="0.5"/>
                        <rect x="44" y="47" width="5" height="5" rx="0.5"/><rect x="51" y="47" width="5" height="5" rx="0.5"/><rect x="58" y="47" width="5" height="5" rx="0.5"/><rect x="65" y="47" width="5" height="5" rx="0.5"/>
                        <rect x="20" y="56" width="60" height="5" rx="0.5"/>
                      </g>
                    </svg>
                  </div>
                  <div className="fc-body">
                    <div className="fc-title">Keychron K2 · brown</div>
                    <div className="fc-price">₹5,800</div>
                    <div className="fc-meta">Jayanagar · 1d</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── LIVE TICKER ── */}
        <section className="bg-[var(--ticker-bg)] text-[var(--ticker-text)] py-3.5 border-t-[0.5px] border-b-[0.5px] border-[var(--line)] overflow-hidden relative z-[3]">
          <div className="ticker-track">
            {[0, 1].map(i => (
              <div key={i} className="flex gap-12">
                <div className="ticker-item"><span className="dot-sold"/><span className="tag">Sold</span> <b>Dell Latitude 5420</b> — <em>₹24,500</em> — HSR · 12 min ago</div>
                <div className="ticker-item"><span className="dot-new"/><span className="tag">New</span> <b>BenQ GW2480 · 24&quot;</b> — <em>₹7,400</em> — Indiranagar · 8 min ago</div>
                <div className="ticker-item"><span className="dot-drop"/><span className="tag">Price drop</span> <b>iPad Air 4</b> — <em>₹29,500</em> — was ₹32,000 · 18 min ago</div>
                <div className="ticker-item"><span className="dot-sold"/><span className="tag">Sold</span> <b>Logitech MX Master 3</b> — <em>₹4,200</em> — Marathahalli · 22 min ago</div>
                <div className="ticker-item"><span className="dot-new"/><span className="tag">New</span> <b>ThinkPad T480 · i7</b> — <em>₹22,000</em> — Electronic City · 24 min ago</div>
                <div className="ticker-item"><span className="dot-sold"/><span className="tag">Sold</span> <b>Keychron K2</b> — <em>₹5,500</em> — Jayanagar · 31 min ago</div>
                <div className="ticker-item"><span className="dot-new"/><span className="tag">New</span> <b>AirPods Pro 2</b> — <em>₹14,500</em> — BTM · 38 min ago</div>
                <div className="ticker-item"><span className="dot-drop"/><span className="tag">Price drop</span> <b>HP 24mh IPS</b> — <em>₹7,200</em> — was ₹8,100 · 42 min ago</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-[72px] border-b-[0.5px] border-[var(--line)]">
          <div className="wrap">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-10">
              <div><div className="stat-num"><em>520</em>+</div><div className="stat-label">items listed<br/>across <em>Bangalore</em></div></div>
              <div><div className="stat-num">12</div><div className="stat-label">colleges<br/>with verified sellers</div></div>
              <div><div className="stat-num">₹1.4<sup>Cr</sup></div><div className="stat-label">in deals facilitated<br/><em>since launch</em></div></div>
              <div><div className="stat-num">4.8<span className="text-[0.45em] text-[var(--saffron-text)]">★</span></div><div className="stat-label">avg. seller rating<br/>from 1,200 buyers</div></div>
            </div>
          </div>
        </section>

        {/* ── 01 CATEGORY TILES ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow">01 · what&apos;s on offer</div>
                <h2 className="h-section">Everything a <em>Bangalore dorm</em> needs.</h2>
              </div>
              <Link href="/browse" className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full text-[13px] font-medium bg-transparent text-[var(--ink)] border-[0.5px] border-[var(--line-strong)] transition-all duration-200 no-underline hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)]">View all categories →</Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="cat-tile" style={{ background: 'var(--cat-warm-bg)', color: 'var(--cat-warm-ink)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="12" rx="1"/><path d="M2 20h20"/></svg>
                <div><div className="cat-name">Laptops</div><div className="cat-count">214 items</div></div>
              </div>
              <div className="cat-tile" style={{ background: 'var(--cat-sage-bg)', color: 'var(--cat-sage-ink)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M12 16v4M8 20h8"/></svg>
                <div><div className="cat-name">Monitors</div><div className="cat-count">98 items</div></div>
              </div>
              <div className="cat-tile" style={{ background: 'var(--cat-rose-bg)', color: 'var(--cat-rose-ink)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 12h8M8 7h8M8 17h5"/></svg>
                <div><div className="cat-name">Desktops</div><div className="cat-count">41 items</div></div>
              </div>
              <div className="cat-tile" style={{ background: 'var(--cat-slate-bg)', color: 'var(--cat-slate-ink)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="10" rx="1"/><path d="M6 11h1M9 11h1M12 11h1M15 11h1M18 11h.01M6 14h12"/></svg>
                <div><div className="cat-name">Keyboards</div><div className="cat-count">67 items</div></div>
              </div>
              <div className="cat-tile" style={{ background: 'var(--cat-cream-bg)', color: 'var(--cat-cream-ink)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11a9 9 0 1 1 18 0v7a2 2 0 0 1-2 2h-2v-7h4M3 18v-7h4v7H5a2 2 0 0 1-2-2z"/></svg>
                <div><div className="cat-name">Audio</div><div className="cat-count">52 items</div></div>
              </div>
              <div className="cat-tile" style={{ background: 'var(--cat-ink-bg)', color: 'var(--cat-ink-ink)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                <div><div className="cat-name">Tablets</div><div className="cat-count">48 items</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 FEATURED LISTINGS ── */}
        <section className="section" style={{ paddingTop: '40px' }}>
          <div className="wrap-wide">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">02 · fresh drops</div>
                <h2 className="h-section">Trending <em>near Koramangala</em>.</h2>
                <p>Listings from the last 48 hours. All sellers verified with a college email domain. Tap to chat on WhatsApp.</p>
              </div>
              <Link href="/browse" className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full text-[13px] font-medium bg-transparent text-[var(--ink)] border-[0.5px] border-[var(--line-strong)] transition-all duration-200 no-underline hover:bg-[var(--ink)] hover:text-[var(--bg)]">Browse all →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Listing 1 */}
              <div className="listing just-listed">
                <div className="listing-img warm"><span className="corner-tag a">Grade A</span>
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none"><rect x="8" y="22" width="84" height="50" rx="3" fill="#2A2823"/><rect x="12" y="26" width="76" height="42" rx="1" fill="#4A5C5A"/><rect x="14" y="28" width="72" height="38" rx="1" fill="#6B7D7B" opacity="0.7"/><path d="M3 72h94l-5 8H8z" fill="#1A1815"/><rect x="44" y="72" width="12" height="3" fill="#0D0B09"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">Dell Latitude 5420</div><div className="listing-subtitle">i5-11th gen · 8GB · 256GB SSD</div><div className="listing-price-row"><span className="listing-price">₹24,500</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>HSR Layout · 2h ago<span className="verified-mini">Verified</span></div></div>
              </div>
              {/* Listing 2 */}
              <div className="listing">
                <div className="listing-img sage"><span className="corner-tag a">Grade A</span>
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none"><rect x="6" y="18" width="88" height="52" rx="2" fill="#2A322A"/><rect x="10" y="22" width="80" height="44" rx="1" fill="#4A5548"/><rect x="12" y="24" width="76" height="40" rx="1" fill="#607058" opacity="0.6"/><rect x="40" y="70" width="20" height="16" fill="#2A322A"/><rect x="28" y="86" width="44" height="5" rx="1" fill="#1D251D"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">Dell UltraSharp U2419H</div><div className="listing-subtitle">24&quot; IPS · height-adjustable</div><div className="listing-price-row"><span className="listing-price">₹6,800</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>Koramangala · 5h<span className="verified-mini">Verified</span></div></div>
              </div>
              {/* Listing 3 */}
              <div className="listing">
                <div className="listing-img slate"><span className="corner-tag b">Grade B</span>
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none"><rect x="6" y="30" width="88" height="40" rx="3" fill="#2A2823"/><rect x="10" y="34" width="80" height="32" rx="1" fill="#3A362F"/><g fill="#5A5348"><rect x="14" y="38" width="5" height="5" rx="0.5"/><rect x="21" y="38" width="5" height="5" rx="0.5"/><rect x="28" y="38" width="5" height="5" rx="0.5"/><rect x="35" y="38" width="5" height="5" rx="0.5"/><rect x="42" y="38" width="5" height="5" rx="0.5"/><rect x="49" y="38" width="5" height="5" rx="0.5"/><rect x="56" y="38" width="5" height="5" rx="0.5"/><rect x="63" y="38" width="5" height="5" rx="0.5"/><rect x="14" y="45" width="5" height="5" rx="0.5"/><rect x="21" y="45" width="5" height="5" rx="0.5"/><rect x="28" y="45" width="5" height="5" rx="0.5"/><rect x="35" y="45" width="5" height="5" rx="0.5"/><rect x="42" y="45" width="5" height="5" rx="0.5"/><rect x="49" y="45" width="5" height="5" rx="0.5"/><rect x="56" y="45" width="5" height="5" rx="0.5"/><rect x="63" y="45" width="5" height="5" rx="0.5"/><rect x="18" y="55" width="64" height="6" rx="0.5"/></g></svg>
                </div>
                <div className="listing-body"><div className="listing-title">Keychron K2 · brown</div><div className="listing-subtitle">mechanical · 84-key · RGB</div><div className="listing-price-row"><span className="listing-price">₹5,800</span><span className="listing-neg">negotiable</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>Jayanagar · yesterday</div></div>
              </div>
              {/* Listing 4 */}
              <div className="listing just-listed">
                <div className="listing-img terra"><span className="corner-tag a">Grade A</span>
                  <svg width="110" height="110" viewBox="0 0 100 100" fill="none"><rect x="28" y="8" width="44" height="84" rx="7" fill="#2A2823"/><rect x="32" y="12" width="36" height="76" rx="2" fill="#D9C8AF"/><rect x="34" y="14" width="32" height="72" rx="1" fill="#E8D9BE" opacity="0.6"/><circle cx="50" cy="89" r="1.5" fill="#5A4A33"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">iPad Air 4 · 64GB WiFi</div><div className="listing-subtitle">Space Grey · w/ Apple Pencil</div><div className="listing-price-row"><span className="listing-price">₹32,000</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>Indiranagar · 3h<span className="verified-mini">Verified</span></div></div>
              </div>
              {/* Listing 5 */}
              <div className="listing">
                <div className="listing-img warm"><span className="corner-tag a">Grade A</span>
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none"><rect x="8" y="22" width="84" height="50" rx="3" fill="#1A1815"/><rect x="12" y="26" width="76" height="42" rx="1" fill="#2A2824"/><rect x="14" y="28" width="72" height="38" rx="1" fill="#3A3632" opacity="0.9"/><path d="M3 72h94l-5 8H8z" fill="#0D0B09"/><rect x="44" y="72" width="12" height="3" fill="#000"/><circle cx="50" cy="36" r="4" fill="#C0261D" opacity="0.6"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">Lenovo ThinkPad T480</div><div className="listing-subtitle">i7-8th · 16GB · 512GB SSD</div><div className="listing-price-row"><span className="listing-price">₹22,000</span><span className="listing-neg">negotiable</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>Electronic City · 6h</div></div>
              </div>
              {/* Listing 6 */}
              <div className="listing">
                <div className="listing-img slate"><span className="corner-tag b">Grade B</span>
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="52" rx="26" ry="36" fill="#2A2823"/><ellipse cx="50" cy="50" rx="22" ry="32" fill="#3A362F" opacity="0.85"/><circle cx="50" cy="46" r="4" fill="#5A5348"/><path d="M32 32 Q35 22 48 22" stroke="#1A1815" strokeWidth="2" fill="none"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">Logitech MX Master 3</div><div className="listing-subtitle">graphite · with charger</div><div className="listing-price-row"><span className="listing-price">₹4,500</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>Marathahalli · 1d</div></div>
              </div>
              {/* Listing 7 */}
              <div className="listing just-listed">
                <div className="listing-img terra"><span className="corner-tag a">Grade A</span>
                  <svg width="110" height="110" viewBox="0 0 100 100" fill="none"><ellipse cx="28" cy="64" rx="8" ry="10" fill="#F5F3EE"/><ellipse cx="72" cy="58" rx="8" ry="10" fill="#F5F3EE"/><path d="M28 54 Q28 42 35 26 L65 22 Q72 42 72 48" fill="#F5F3EE"/><rect x="24" y="68" width="8" height="8" rx="1" fill="#D9C8AF"/><rect x="68" y="62" width="8" height="8" rx="1" fill="#D9C8AF"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">AirPods Pro 2nd gen</div><div className="listing-subtitle">USB-C · 8 months old</div><div className="listing-price-row"><span className="listing-price">₹14,500</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>BTM Layout · 2h<span className="verified-mini">Verified</span></div></div>
              </div>
              {/* Listing 8 */}
              <div className="listing">
                <div className="listing-img sage"><span className="corner-tag a">Grade A</span>
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none"><rect x="30" y="8" width="40" height="76" rx="3" fill="#2A322A"/><rect x="34" y="12" width="32" height="68" rx="1" fill="#4A5548"/><circle cx="50" cy="78" r="2" fill="#1D251D"/><rect x="24" y="82" width="52" height="8" rx="2" fill="#1D251D"/></svg>
                </div>
                <div className="listing-body"><div className="listing-title">Dell OptiPlex 3070</div><div className="listing-subtitle">i5-9th · 16GB · 512GB</div><div className="listing-price-row"><span className="listing-price">₹18,000</span><span className="listing-neg">negotiable</span></div><div className="listing-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"/></svg>Whitefield · 4h</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 CURATED COLLECTIONS ── */}
        <section className="section" style={{ paddingTop: '20px' }}>
          <div className="wrap-wide">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">03 · curated by the editors</div>
                <h2 className="h-section">Themed <em>bundles</em>, handpicked.</h2>
                <p>Not just a search bar — a point of view. Complete setups for different student budgets and vibes.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="coll coll-1">
                <div><div className="coll-eyebrow">Essentials</div><div className="coll-title">Starter setup<br/><em>under ₹30K</em></div><div className="coll-price">Refurb laptop + 24&quot; monitor + keyboard</div></div>
                <div className="coll-meta"><span>24 bundles</span><span>·</span><span className="coll-arrow">→</span></div>
              </div>
              <div className="coll coll-2">
                <div><div className="coll-eyebrow">For creators</div><div className="coll-title">Design &amp;<br/><em>video tools</em></div><div className="coll-price">iPad, graphic tablet, colour-accurate monitors</div></div>
                <div className="coll-meta"><span>18 items</span><span>·</span><span className="coll-arrow">→</span></div>
              </div>
              <div className="coll coll-3">
                <div><div className="coll-eyebrow">For engineers</div><div className="coll-title">Mechanical<br/><em>keyboard nirvana</em></div><div className="coll-price">Keychron, Royal Kludge, custom builds</div></div>
                <div className="coll-meta"><span>32 items</span><span>·</span><span className="coll-arrow">→</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 COMPARISON TABLE ── */}
        <section className="section" style={{ paddingTop: '30px' }}>
          <div className="wrap-wide">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">04 · how we&apos;re different</div>
                <h2 className="h-section">Why <em>not just use OLX</em>?</h2>
                <p>The existing options all trade off on something. Here&apos;s the honest comparison.</p>
              </div>
            </div>
            <div className="compare-table">
              <div className="compare-row header"><div>Feature</div><div>Student Gear Shop</div><div>OLX</div><div>Cashify</div><div>FB Marketplace</div></div>
              <div className="compare-row namma"><div>Bangalore-only</div><div>✓</div><div className="compare-x">✕</div><div className="compare-x">✕</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Student-verified sellers</div><div>✓</div><div className="compare-x">✕</div><div className="compare-x">✕</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Condition grading (A / B / C)</div><div>✓</div><div className="compare-x">✕</div><div>✓</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Peer-to-peer (no middleman)</div><div>✓</div><div>✓</div><div className="compare-x">✕</div><div>✓</div></div>
              <div className="compare-row namma"><div>Direct WhatsApp chat</div><div>✓</div><div className="compare-dash">—</div><div className="compare-x">✕</div><div className="compare-dash">—</div></div>
              <div className="compare-row namma"><div>Free to list</div><div>✓</div><div>✓</div><div>✓</div><div>✓</div></div>
              <div className="compare-row namma"><div>Zero reseller spam</div><div>✓</div><div className="compare-x">✕</div><div className="compare-dash">n/a</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Campus meet-up safe spots</div><div>✓</div><div className="compare-x">✕</div><div className="compare-x">✕</div><div className="compare-x">✕</div></div>
            </div>
          </div>
        </section>

        {/* ── 05 BANGALORE MAP ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="map-section">
              <div className="grid md:grid-cols-[1fr_1.3fr] gap-12 items-center max-md:grid-cols-1">
                <div>
                  <div className="eyebrow" style={{ color: '#FBB24A' }}>05 · city coverage</div>
                  <h2 className="h-section" style={{ marginTop: '18px' }}>520 listings.<br/><em>12 neighbourhoods.</em></h2>
                  <p>From Whitefield to Jayanagar, active across every major student hub in Bangalore. Koramangala leads — no surprises.</p>
                  <div className="grid grid-cols-3 gap-4 mt-10">
                    <div><div className="map-stat-num">142</div><div className="map-stat-label">Koramangala</div></div>
                    <div><div className="map-stat-num">98</div><div className="map-stat-label">HSR Layout</div></div>
                    <div><div className="map-stat-num">67</div><div className="map-stat-label">Indiranagar</div></div>
                  </div>
                </div>
                <div className="relative" style={{ aspectRatio: '4/3' }}>
                  <svg className="w-full h-full" viewBox="0 0 400 320" fill="none">
                    <path d="M60 80 Q40 120 55 160 Q50 210 80 240 Q110 270 160 275 Q220 280 270 260 Q320 240 340 200 Q355 160 340 120 Q320 80 270 70 Q220 55 170 65 Q110 75 60 80 Z" stroke="rgba(250,250,250,0.15)" strokeWidth="1" fill="rgba(250,250,250,0.03)"/>
                    <circle cx="200" cy="170" r="9" className="map-dot big" opacity="0.3"/><circle cx="200" cy="170" r="5" className="map-dot big"/>
                    <text x="210" y="173" className="map-label active">Koramangala · 142</text>
                    <circle cx="230" cy="200" r="7" className="map-dot" opacity="0.25"/><circle cx="230" cy="200" r="4" className="map-dot"/>
                    <text x="240" y="203" className="map-label">HSR · 98</text>
                    <circle cx="230" cy="130" r="6" className="map-dot" opacity="0.25"/><circle cx="230" cy="130" r="3" className="map-dot"/>
                    <text x="240" y="133" className="map-label">Indiranagar · 67</text>
                    <circle cx="290" cy="150" r="5" className="map-dot" opacity="0.25"/><circle cx="290" cy="150" r="3" className="map-dot"/>
                    <text x="298" y="153" className="map-label">Marathahalli · 52</text>
                    <circle cx="320" cy="170" r="4" className="map-dot" opacity="0.25"/><circle cx="320" cy="170" r="3" className="map-dot"/>
                    <text x="328" y="164" className="map-label">Whitefield · 38</text>
                    <circle cx="200" cy="250" r="4" className="map-dot" opacity="0.25"/><circle cx="200" cy="250" r="3" className="map-dot"/>
                    <text x="210" y="253" className="map-label">E-city · 42</text>
                    <circle cx="180" cy="200" r="4" className="map-dot" opacity="0.25"/><circle cx="180" cy="200" r="3" className="map-dot"/>
                    <text x="120" y="203" className="map-label" textAnchor="end">BTM · 34</text>
                    <circle cx="140" cy="180" r="4" className="map-dot" opacity="0.25"/><circle cx="140" cy="180" r="3" className="map-dot"/>
                    <text x="130" y="183" className="map-label" textAnchor="end">Jayanagar · 28</text>
                    <circle cx="130" cy="120" r="3" className="map-dot" opacity="0.25"/><circle cx="130" cy="120" r="2" className="map-dot"/>
                    <text x="122" y="123" className="map-label" textAnchor="end">Malleswaram · 19</text>
                    <text x="200" y="45" className="map-label" textAnchor="middle" style={{ fontSize: '10px', letterSpacing: '0.2em', fill: 'rgba(250,250,250,0.4)' }}>BENGALURU · 560001 – 560103</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 TESTIMONIAL ── */}
        <section className="testimonial-section">
          <div className="wrap">
            <div className="eyebrow muted-label">09 · from the community</div>
            <div style={{ marginTop: '32px' }} />
            <p className="pull-quote">
              Sold my monitor and old keyboard in <em>under three days</em>, both to students from PESU I could meet on campus. Felt safer than OLX and way faster than classifieds.&quot;
            </p>
            <div className="quote-attr">
              <div className="avatar">SR</div>
              <div>
                <em>Shreya R.</em> · 3rd year CS at RVCE
                <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '3px' }}>Koramangala · verified since Oct 2025</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section">
          <div className="wrap-wide">
            <div className="cta-block">
              <div className="relative z-[2]">
                <h2 className="font-serif font-light text-[clamp(36px,5vw,68px)] leading-[1] tracking-[-0.03em] text-[var(--cta-text)]">
                  Got tech<br/>collecting dust?<br/><em className="italic text-[#FBB24A] font-normal">Let it earn.</em>
                </h2>
                <p className="text-[rgba(250,250,250,0.75)] text-base mt-5 max-w-[44ch] leading-[1.55]">
                  {isAdmin
                    ? 'Add verified laptops, monitors, and gear for students. Bangalore only.'
                    : 'Curated pre-loved laptops, monitors, and gear from verified sellers. Bangalore only.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 relative z-[2]">
                {isAdmin && (
                  <Link href="/sell"><Button variant="cream" size="xl" className="w-full justify-center">Sell your tech →</Button></Link>
                )}
                <Link href="/browse"><Button variant="outline-cream" size="xl" className="w-full justify-center">Browse listings</Button></Link>
                <p className="text-[rgba(250,250,250,0.55)] text-xs text-center mt-2.5">
                  {isAdmin ? 'Owner tools · sign in required' : 'Sign up to buy, save listings, and track orders'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-20 border-t-[0.5px] border-[var(--line)]">
        <div className="wrap-wide">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="font-serif font-medium text-2xl tracking-tight flex items-center gap-1 text-[var(--ink)]" style={{ fontVariationSettings: '"opsz" 144' }}>
                <span className="w-2 h-2 rounded-full bg-[var(--saffron)] mr-1.5" />
                Namma<em className="italic font-normal text-[var(--forest-text)]">Gear</em>
              </div>
              <p className="text-[var(--muted)] text-sm mt-4 max-w-[36ch] leading-[1.55]">
                Pre-loved tech, passed between Bangalore students. Local, verified, direct. Made with care in Koramangala.
              </p>
              <div className="newsletter">
                <input placeholder="your.name@college.edu.in" />
                <Button variant="forest">Notify me →</Button>
              </div>
            </div>
            <div>
              <h5 className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--muted)] font-medium mb-[18px]">Explore</h5>
              <ul className="list-none space-y-1"><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Browse all</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">By category</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Near me</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Curated collections</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">New arrivals</li></ul>
            </div>
            <div>
              <h5 className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--muted)] font-medium mb-[18px]">Sell</h5>
              <ul className="list-none space-y-1"><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">List an item</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Seller guide</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Pricing tips</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Meet-up safely</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Dispute help</li></ul>
            </div>
            <div>
              <h5 className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--muted)] font-medium mb-[18px]">Company</h5>
              <ul className="list-none space-y-1"><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">About</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Safety &amp; trust</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Terms of use</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Privacy</li><li className="text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors hover:text-[var(--forest)]">Contact</li></ul>
            </div>
          </div>
          <div className="flex flex-wrap justify-between pt-7 border-t-[0.5px] border-[var(--line)] text-xs text-[var(--muted)] gap-3.5">
            <div>Made in Bangalore · <em className="italic text-[var(--ink)] font-serif">for students</em> · 2026</div>
            <div>student-gear-shop.in · all listings ship from within city limits</div>
          </div>
        </div>
      </footer>
    </>
  );
}
