import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Clock, Search, Package, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 relative">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid md:grid-cols-[1.25fr_1fr] gap-12 md:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3.5 mb-7 flex-wrap fade-up">
                  <span className="w-2 h-2 rounded-full bg-forest animate-pulse" style={{ animationDuration: '2s' }} />
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-forest-text">
                    Live · 47 new listings this week
                  </span>
                  <span className="text-[var(--line-strong)] text-sm">·</span>
                  <span className="font-serif text-sm italic text-saffron-text">ಬೆಂಗಳೂರಿಗೆ ಮಾತ್ರ</span>
                </div>

                <h1 className="font-serif font-light text-[clamp(52px,8.5vw,128px)] leading-[0.94] tracking-[-0.045em] text-ink mb-8 fade-up delay-1" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}>
                  Pre-loved tech.<br />
                  <em className="italic font-normal text-forest-text" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>Campus</em> to <span className="text-saffron-text italic font-normal">campus.</span>
                </h1>

                <p className="text-[clamp(16px,1.35vw,19px)] leading-[1.55] text-muted max-w-[52ch] mb-9 fade-up delay-2">
                  Laptops, monitors and gear, passed between verified Bangalore students. Fair prices. Pincode-locked. Zero resellers, zero scams.
                </p>

                <div className="flex gap-3.5 flex-wrap items-center mb-8 fade-up delay-3">
                  <div className="flex items-center gap-3 bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line-strong)] rounded-full py-2 px-4 pr-2 max-w-[460px] w-full shadow-card">
                    <Search className="w-4 h-4 text-muted flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Dell Latitude, mechanical keyboard, 24 inch monitor…"
                      className="flex-1 border-none outline-none bg-transparent text-sm text-ink py-2"
                    />
                    <Button size="default">Search</Button>
                  </div>
                </div>

                <div className="flex gap-5 flex-wrap fade-up delay-4">
                  <span className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <Check className="w-[15px] h-[15px] text-forest flex-shrink-0" />
                    College email verified
                  </span>
                  <span className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <MapPin className="w-[15px] h-[15px] text-forest flex-shrink-0" />
                    Bangalore pincode only
                  </span>
                  <span className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <Clock className="w-[15px] h-[15px] text-forest flex-shrink-0" />
                    Avg. response under 10 min
                  </span>
                </div>
              </div>

              {/* Hero Gallery - Placeholder for now */}
              <div className="relative h-[560px] hidden md:block fade-up delay-3">
                <div className="absolute top-[-14px] right-[-14px] md:right-2 w-[84px] h-[84px] rounded-full bg-saffron text-white flex items-center justify-center rotate-12 font-mono text-[9px] font-medium tracking-[0.14em] uppercase text-center leading-[1.15] shadow-stamp z-10 p-2.5">
                  Student<br />verified<br />· est 2025 ·
                </div>
                <div className="absolute top-0 left-0 w-[230px] bg-[var(--bg-elevated)] rounded-2xl overflow-hidden border-[0.5px] border-[var(--line-strong)] shadow-float -rotate-[4deg] z-[3] transition-transform hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[var(--img-warm-1)] to-[var(--img-warm-2)] flex items-center justify-center relative">
                    <span className="absolute top-2.5 left-2.5 font-mono text-[9px] tracking-[0.12em] uppercase py-[3px] px-[7px] rounded-[3px] bg-[var(--bg-elevated)] text-forest-text border-[0.5px] border-[var(--line)]">
                      Grade A
                    </span>
                    <Package className="w-20 h-20 text-[#2A2823] opacity-70" />
                  </div>
                  <div className="p-3 px-3.5">
                    <div className="font-serif text-[15px] font-medium leading-[1.2] text-ink">Dell Latitude 5420</div>
                    <div className="font-serif text-[18px] font-medium mt-1 tracking-[-0.02em] text-ink">₹24,500</div>
                    <div className="text-[11px] text-muted mt-[3px]">HSR Layout · 2h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Ticker */}
        <section className="bg-[var(--ticker-bg)] text-[var(--ticker-text)] py-3.5 border-t-[0.5px] border-b-[0.5px] border-[var(--line)] overflow-hidden relative z-[3]">
          <div className="flex gap-12 animate-scroll whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12">
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-bright" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-65">Sold</span>
                  <b className="font-medium text-[var(--ticker-text-strong)]">Dell Latitude 5420</b> — <em className="italic font-serif text-[var(--ticker-text-strong)]">₹24,500</em> — HSR · 12 min ago
                </div>
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBB24A]" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-65">New</span>
                  <b className="font-medium text-[var(--ticker-text-strong)]">BenQ GW2480 · 24"</b> — <em className="italic font-serif text-[var(--ticker-text-strong)]">₹7,400</em> — Indiranagar · 8 min ago
                </div>
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-65">Price drop</span>
                  <b className="font-medium text-[var(--ticker-text-strong)]">iPad Air 4</b> — <em className="italic font-serif text-[var(--ticker-text-strong)]">₹29,500</em> — was ₹32,000 · 18 min ago
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 border-b-[0.5px] border-[var(--line)]">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              <div>
                <div className="font-serif text-[clamp(42px,5.5vw,72px)] font-light tracking-[-0.04em] leading-[0.95] text-ink" style={{ fontVariationSettings: '"opsz" 144' }}>
                  <em className="italic text-saffron-text font-normal">520</em>+
                </div>
                <div className="text-[13px] text-muted mt-3.5 leading-[1.4]">
                  items listed<br />across <em className="italic font-serif text-ink">Bangalore</em>
                </div>
              </div>
              <div>
                <div className="font-serif text-[clamp(42px,5.5vw,72px)] font-light tracking-[-0.04em] leading-[0.95] text-ink" style={{ fontVariationSettings: '"opsz" 144' }}>
                  12
                </div>
                <div className="text-[13px] text-muted mt-3.5 leading-[1.4]">
                  colleges<br />with verified sellers
                </div>
              </div>
              <div>
                <div className="font-serif text-[clamp(42px,5.5vw,72px)] font-light tracking-[-0.04em] leading-[0.95] text-ink" style={{ fontVariationSettings: '"opsz" 144' }}>
                  ₹1.4<sup className="text-[0.4em] font-normal tracking-[0] text-forest-text">Cr</sup>
                </div>
                <div className="text-[13px] text-muted mt-3.5 leading-[1.4]">
                  in deals facilitated<br /><em className="italic font-serif text-ink">since launch</em>
                </div>
              </div>
              <div>
                <div className="font-serif text-[clamp(42px,5.5vw,72px)] font-light tracking-[-0.04em] leading-[0.95] text-ink" style={{ fontVariationSettings: '"opsz" 144' }}>
                  4.8<span className="text-[0.45em] text-saffron-text">★</span>
                </div>
                <div className="text-[13px] text-muted mt-3.5 leading-[1.4]">
                  avg. seller rating<br />from 1,200 buyers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-forest/10 mb-4">
                  <Shield className="h-6 w-6 text-forest" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2 text-ink">Bangalore Only</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Verified Bangalore pincodes for safe local transactions
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-forest/10 mb-4">
                  <Zap className="h-6 w-6 text-forest" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2 text-ink">Quick Connect</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Chat directly with sellers via WhatsApp
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-forest/10 mb-4">
                  <Package className="h-6 w-6 text-forest" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2 text-ink">Student Focused</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Built for students, by students. No middlemen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="bg-[var(--cta-bg)] text-[var(--cta-text)] rounded-[32px] p-14 md:p-20 grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center relative overflow-hidden">
              <div className="absolute right-[-100px] top-[-100px] w-[380px] h-[380px] rounded-full bg-[rgba(245,158,11,0.25)] blur-[80px]" />
              <div className="absolute left-[-60px] bottom-[-60px] w-[240px] h-[240px] rounded-full bg-[rgba(200,235,77,0.15)] blur-[60px]" />
              
              <div className="relative z-[2]">
                <h2 className="font-serif font-light text-[clamp(36px,5vw,68px)] leading-[1] tracking-[-0.03em] text-[var(--cta-text)]">
                  Got tech<br />collecting dust?<br /><em className="italic text-[#FBB24A] font-normal">Let it earn.</em>
                </h2>
                <p className="text-[rgba(250,250,250,0.75)] text-base mt-5 max-w-[44ch] leading-[1.55]">
                  List your unused laptops, monitors or gear in 90 seconds. Free. Student-verified. Bangalore only.
                </p>
              </div>

              <div className="flex flex-col gap-3 relative z-[2]">
                <Link href="/sell">
                  <Button variant="cream" size="xl" className="w-full justify-center">
                    Sell your tech →
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button variant="outline-cream" size="xl" className="w-full justify-center">
                    Browse listings first
                  </Button>
                </Link>
                <p className="text-[rgba(250,250,250,0.55)] text-xs text-center mt-2.5">
                  Sign up with your college email · 30 seconds
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-[0.5px] border-[var(--line)] py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14">
            <div className="col-span-2 md:col-span-1">
              <div className="font-serif font-medium text-2xl tracking-tight flex items-center gap-1 text-ink mb-4" style={{ fontVariationSettings: '"opsz" 144' }}>
                <span className="w-2 h-2 rounded-full bg-saffron mr-1.5" />
                Namma<em className="italic font-normal text-forest-text">Gear</em>
              </div>
              <p className="text-muted text-sm leading-[1.55] max-w-[36ch] mb-7">
                Pre-loved tech, passed between Bangalore students. Local, verified, direct. Made with care in Koramangala.
              </p>
            </div>
            <div>
              <h5 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mb-4.5">Explore</h5>
              <ul className="space-y-1.5">
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">Browse all</li>
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">By category</li>
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">Near me</li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mb-4.5">Sell</h5>
              <ul className="space-y-1.5">
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">List an item</li>
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">Seller guide</li>
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">Meet-up safely</li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted font-medium mb-4.5">Company</h5>
              <ul className="space-y-1.5">
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">About</li>
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">Safety & trust</li>
                <li className="text-[13px] text-ink-soft cursor-pointer transition-colors hover:text-forest">Contact</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap justify-between pt-7 border-t-[0.5px] border-[var(--line)] text-xs text-muted gap-3.5">
            <div>Made in Bangalore · <em className="italic text-ink font-serif">for students</em> · 2026</div>
            <div>nammagear.in · all listings ship from within city limits</div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </>
  );
}
