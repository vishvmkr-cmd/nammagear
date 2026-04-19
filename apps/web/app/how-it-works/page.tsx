'use client';

import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';

const buyerSteps = [
  {
    num: '01',
    title: 'Browse & filter',
    desc: 'Search by category, pincode, condition grade, or price range. Everything is from verified Bangalore students.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Chat on WhatsApp',
    desc: 'Tap the contact button on any listing. You\'ll get a direct WhatsApp link to the seller — no middlemen, no in-app messaging.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Meet & inspect',
    desc: 'Agree on a campus safe spot or a public location in Bangalore. Check the item in person — condition grade gives you a head start.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z" /><circle cx="12" cy="9" r="3" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Pay & enjoy',
    desc: 'Pay the seller directly — UPI, cash, whatever works. No platform fees, no commissions. The deal is between you two.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" />
      </svg>
    ),
  },
];

const sellerSteps = [
  {
    num: '01',
    title: 'Sign up with college email',
    desc: 'Create an account using your college email and Bangalore pincode. This is how we keep out resellers and spammers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'List in 90 seconds',
    desc: 'Upload up to 5 photos, pick a condition grade (A/B/C), set your price, and add your Bangalore pincode. That\'s it.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Get WhatsApp messages',
    desc: 'Interested buyers tap "Chat on WhatsApp" and message you directly. No bots, no spam — real students from nearby campuses.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Meet, sell, done',
    desc: 'Pick a campus safe spot, hand over the item, collect your money. Mark the listing as sold. Zero commission — keep 100%.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
];

const faqs = [
  { q: 'Is Student Gear Shop free?', a: 'Completely free to list and browse. We don\'t charge commissions or fees. The deal happens directly between buyer and seller.' },
  { q: 'How do you verify students?', a: 'We verify college email domains (.edu.in, .ac.in, etc.) during signup. Combined with Bangalore pincode locks, this keeps the community student-only.' },
  { q: 'What does the condition grade mean?', a: 'Grade A = like new, minimal signs of use. Grade B = good, normal wear. Grade C = fair, visible wear but fully functional.' },
  { q: 'What if I\'m scammed?', a: 'Always meet in person at a campus safe spot. Inspect the item before paying. Report any suspicious listings — we investigate and ban bad actors.' },
  { q: 'Can I list items other than tech?', a: 'Right now we\'re focused on tech gear — laptops, monitors, keyboards, audio, tablets, desktops. We may expand categories later.' },
  { q: 'Why only Bangalore?', a: 'We believe in depth over breadth. By focusing on one city, we can ensure every listing is reachable, every seller is verifiable, and every meet-up is practical.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen">
        {/* Hero */}
        <section className="py-20 md:py-[80px]">
          <div className="wrap">
            <div className="max-w-[680px]">
              <div className="eyebrow">How Student Gear Shop works</div>
              <h1 className="h-display mt-5 mb-6" style={{ fontSize: 'clamp(42px, 6vw, 80px)' }}>
                Simple.<br /><em>Student-first.</em><br /><span className="accent">Direct.</span>
              </h1>
              <p className="h-sub">
                No algorithms, no hidden fees, no corporate middlemen. Just verified Bangalore students buying and selling tech directly — the way it should be.
              </p>
            </div>
          </div>
        </section>

        {/* For Buyers */}
        <section className="section" style={{ paddingTop: '40px' }}>
          <div className="wrap">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">For Buyers</div>
                <h2 className="h-section">Find your <em>next gear</em>.</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buyerSteps.map((step) => (
                <div key={step.num} className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="text-forest mb-5">{step.icon}</div>
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted mb-2">{step.num}</div>
                  <h3 className="font-serif text-xl font-medium tracking-[-0.015em] text-ink mb-2.5">{step.title}</h3>
                  <p className="text-sm text-muted leading-[1.55]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Sellers */}
        <section className="section">
          <div className="wrap">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">For Sellers</div>
                <h2 className="h-section">Turn dust into <em>cash</em>.</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellerSteps.map((step) => (
                <div key={step.num} className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="text-saffron mb-5">{step.icon}</div>
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted mb-2">{step.num}</div>
                  <h3 className="font-serif text-xl font-medium tracking-[-0.015em] text-ink mb-2.5">{step.title}</h3>
                  <p className="text-sm text-muted leading-[1.55]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Numbers */}
        <section className="py-[72px] border-t-[0.5px] border-b-[0.5px] border-[var(--line)]">
          <div className="wrap">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div><div className="stat-num">90<sup>sec</sup></div><div className="stat-label">average listing<br />creation time</div></div>
              <div><div className="stat-num">&lt;10<sup>min</sup></div><div className="stat-label">average seller<br />response time</div></div>
              <div><div className="stat-num"><em>0</em>%</div><div className="stat-label">commission<br />on any sale</div></div>
              <div><div className="stat-num">100<sup>%</sup></div><div className="stat-label">of payment goes<br />to the <em>seller</em></div></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="wrap">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow muted-label">FAQ</div>
                <h2 className="h-section">Common <em>questions</em>.</h2>
              </div>
            </div>

            <div className="max-w-[720px]">
              {faqs.map((faq, i) => (
                <div key={i} className="py-7 border-b-[0.5px] border-[var(--line)]">
                  <h3 className="font-serif text-[19px] font-medium tracking-[-0.015em] text-ink mb-3">{faq.q}</h3>
                  <p className="text-sm text-muted leading-[1.65]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap-wide">
            <div className="cta-block">
              <div className="relative z-[2]">
                <h2 className="font-serif font-light text-[clamp(36px,5vw,68px)] leading-[1] tracking-[-0.03em] text-[var(--cta-text)]">
                  Ready to<br />start trading?<br /><em className="italic text-[#FBB24A] font-normal">Let&apos;s go.</em>
                </h2>
                <p className="text-[rgba(250,250,250,0.75)] text-base mt-5 max-w-[44ch] leading-[1.55]">
                  Join 1,200+ Bangalore students already on Student Gear Shop.
                </p>
              </div>
              <div className="flex flex-col gap-3 relative z-[2]">
                <Link href="/auth/signup"><Button variant="cream" size="xl" className="w-full justify-center">Sign up free →</Button></Link>
                <Link href="/browse"><Button variant="outline-cream" size="xl" className="w-full justify-center">Browse listings first</Button></Link>
                <p className="text-[rgba(250,250,250,0.55)] text-xs text-center mt-2.5">College email · 30 seconds · 100% free</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
