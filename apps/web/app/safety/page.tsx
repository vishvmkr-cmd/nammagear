'use client';

import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';

const principles = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Student-verified community',
    desc: 'Every seller signs up with a college email domain (.edu.in, .ac.in) and a valid Bangalore pincode. No anonymous accounts, no reseller farms.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z" /><circle cx="12" cy="9" r="3" />
      </svg>
    ),
    title: 'Pincode-locked to Bangalore',
    desc: 'All listings are geolocated to Bangalore pincodes (560001–560103). You can always meet locally, inspect items in person, and avoid long-distance scams.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
      </svg>
    ),
    title: 'Condition grading system',
    desc: 'Every listing has a transparent condition grade — A (like new), B (good), or C (fair). No guessing, no surprises when you show up.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Peer-to-peer, no middleman',
    desc: 'We don\'t take your money, hold escrow, or charge commissions. The transaction is between you and the other student. Direct and transparent.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
    title: 'Report & ban system',
    desc: 'See something suspicious? Report it. We review every report and permanently ban sellers who violate community rules. Zero tolerance for scams.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'No data selling',
    desc: 'We don\'t sell your data, run targeted ads, or share your information with third parties. Your college email and phone stay private until you choose to share.',
  },
];

const safetyTips = [
  {
    title: 'Always meet in public',
    desc: 'Campus canteens, college gates, or busy cafés are ideal. Never meet at a private residence for a first transaction.',
    emoji: '📍',
  },
  {
    title: 'Inspect before paying',
    desc: 'Check the item thoroughly — power it on, test all ports, check the screen. The condition grade gives you a baseline, but always verify.',
    emoji: '🔍',
  },
  {
    title: 'Use UPI for a digital trail',
    desc: 'While cash works, UPI payments create a transaction record. Useful if you ever need to dispute something.',
    emoji: '💳',
  },
  {
    title: 'Trust your instincts',
    desc: 'If a deal seems too good to be true, or the seller avoids meeting in person, walk away. There\'s always another listing.',
    emoji: '🧠',
  },
  {
    title: 'Check the seller profile',
    desc: 'Look at their verification status, join date, number of listings, and rating. Established, verified sellers are always safer.',
    emoji: '👤',
  },
  {
    title: 'Report suspicious activity',
    desc: 'If something feels off — fake photos, mismatched descriptions, pressure to pay online — report the listing immediately.',
    emoji: '🚩',
  },
];

export default function SafetyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen">
        {/* Hero */}
        <section className="py-20 md:py-[80px]">
          <div className="wrap">
            <div className="max-w-[680px]">
              <div className="eyebrow">Safety & Trust</div>
              <h1 className="h-display mt-5 mb-6" style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}>
                Built on<br /><em>trust</em>, not<br /><span className="accent">tricks.</span>
              </h1>
              <p className="h-sub">
                Student Gear Shop is designed from the ground up to be the safest way for Bangalore students to buy and sell tech. Here&apos;s how we keep the community clean.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Principles */}
        <section className="section" style={{ paddingTop: '40px' }}>
          <div className="wrap">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">Our principles</div>
                <h2 className="h-section">Six layers of <em>trust</em>.</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {principles.map((p, i) => (
                <div key={i} className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="text-forest mb-5">{p.icon}</div>
                  <h3 className="font-serif text-xl font-medium tracking-[-0.015em] text-ink mb-3">{p.title}</h3>
                  <p className="text-sm text-muted leading-[1.6]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-[72px] border-t-[0.5px] border-b-[0.5px] border-[var(--line)]">
          <div className="wrap">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div><div className="stat-num"><em>0</em></div><div className="stat-label">scam reports<br />in last 90 days</div></div>
              <div><div className="stat-num">100<sup>%</sup></div><div className="stat-label">sellers verified<br />with college email</div></div>
              <div><div className="stat-num">4.8<span className="text-[0.45em] text-[var(--saffron-text)]">★</span></div><div className="stat-label">average seller<br />trust rating</div></div>
              <div><div className="stat-num">&lt;2<sup>hrs</sup></div><div className="stat-label">average report<br />resolution time</div></div>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="section">
          <div className="wrap">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">Safety Tips</div>
                <h2 className="h-section">Smart <em>meet-up</em> rules.</h2>
                <p>Whether buying or selling, these tips keep every transaction smooth and safe.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {safetyTips.map((tip, i) => (
                <div key={i} className="py-7 px-7 bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="text-3xl mb-4">{tip.emoji}</div>
                  <h3 className="font-serif text-[18px] font-medium tracking-[-0.015em] text-ink mb-2.5">{tip.title}</h3>
                  <p className="text-sm text-muted leading-[1.6]">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap-wide">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">Honest Comparison</div>
                <h2 className="h-section">Why <em>Student Gear Shop</em> is safer.</h2>
              </div>
            </div>
            <div className="compare-table">
              <div className="compare-row header"><div>Safety Feature</div><div>Student Gear Shop</div><div>OLX</div><div>Cashify</div><div>FB Marketplace</div></div>
              <div className="compare-row namma"><div>Student-verified sellers</div><div>✓</div><div className="compare-x">✕</div><div className="compare-x">✕</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Pincode-locked listings</div><div>✓</div><div className="compare-x">✕</div><div className="compare-dash">—</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Condition grading</div><div>✓</div><div className="compare-x">✕</div><div>✓</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Zero reseller spam</div><div>✓</div><div className="compare-x">✕</div><div className="compare-dash">n/a</div><div className="compare-x">✕</div></div>
              <div className="compare-row namma"><div>Community reporting</div><div>✓</div><div>✓</div><div className="compare-dash">—</div><div>✓</div></div>
              <div className="compare-row namma"><div>No anonymous sellers</div><div>✓</div><div className="compare-x">✕</div><div>✓</div><div className="compare-x">✕</div></div>
            </div>
          </div>
        </section>

        {/* Community Rules */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="max-w-[720px]">
              <div className="eyebrow muted-label">Community Rules</div>
              <h2 className="h-section mt-4 mb-8">Zero tolerance <em>policy</em>.</h2>

              <div className="space-y-5">
                {[
                  'No stolen goods. All items must be legally owned by the seller.',
                  'No commercial resellers. This is a student-to-student platform.',
                  'Accurate condition grading. Misrepresenting item condition is grounds for a ban.',
                  'No harassment, threats, or abusive behaviour toward other users.',
                  'No fake or AI-generated photos. All images must be of the actual item.',
                  'Respect agreed meet-up times. Ghosting hurts the community.',
                ].map((rule, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-forest font-mono text-sm font-medium mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[15px] text-ink-soft leading-[1.55]">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap-wide">
            <div className="cta-block">
              <div className="relative z-[2]">
                <h2 className="font-serif font-light text-[clamp(36px,5vw,68px)] leading-[1] tracking-[-0.03em] text-[var(--cta-text)]">
                  Safe trading<br />starts with a<br /><em className="italic text-[#FBB24A] font-normal">verified you.</em>
                </h2>
                <p className="text-[rgba(250,250,250,0.75)] text-base mt-5 max-w-[44ch] leading-[1.55]">
                  Sign up with your college email and join 1,200+ trusted Bangalore students.
                </p>
              </div>
              <div className="flex flex-col gap-3 relative z-[2]">
                <Link href="/auth/signup"><Button variant="cream" size="xl" className="w-full justify-center">Get verified →</Button></Link>
                <Link href="/browse"><Button variant="outline-cream" size="xl" className="w-full justify-center">Browse listings first</Button></Link>
                <p className="text-[rgba(250,250,250,0.55)] text-xs text-center mt-2.5">College email · Bangalore pincode · 30 seconds</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
