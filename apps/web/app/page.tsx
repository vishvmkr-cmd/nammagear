import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Package, Search, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Buy & Sell Electronics
            <br />
            <span className="text-primary">in Bangalore</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The peer-to-peer marketplace for students. Find great deals on
            laptops, monitors, keyboards, and more from verified sellers near you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Listings
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Package className="mr-2 h-4 w-4" />
              Start Selling
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bangalore Only</h3>
                <p className="text-sm text-muted-foreground">
                  Verified Bangalore pincodes for safe local transactions
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quick Connect</h3>
                <p className="text-sm text-muted-foreground">
                  Chat directly with sellers via WhatsApp
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Student Focused</h3>
                <p className="text-sm text-muted-foreground">
                  Built for students, by students. No middlemen.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 NammaGear. Built for Bangalore students.</p>
        </div>
      </footer>
    </>
  );
}
