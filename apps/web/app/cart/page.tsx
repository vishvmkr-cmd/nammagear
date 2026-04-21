'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useCart, useRemoveFromCart, useCheckoutCart } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { data: auth, isLoading: authLoading } = useAuth();
  const { data: cart, isLoading } = useCart(!!auth?.user);
  const removeItem = useRemoveFromCart();
  const checkout = useCheckoutCart();

  useEffect(() => {
    if (!authLoading && !auth?.user) {
      router.replace('/auth/signin?redirect=/cart');
    }
  }, [authLoading, auth?.user, router]);

  const items = cart?.items ?? [];
  const total = items.reduce((sum, row) => sum + row.listing.price, 0);

  if (!authLoading && !auth?.user) {
    return (
      <>
        <Nav />
        <div className="min-h-[40vh] flex items-center justify-center text-muted">Sign in to view cart…</div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen py-10 px-8">
        <div className="max-w-[720px] mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
            <h1 className="font-serif text-3xl tracking-tight text-ink">Your cart</h1>
            <Link
              href="/my-orders"
              className="text-sm text-muted hover:text-ink underline underline-offset-2"
            >
              My orders
            </Link>
          </div>

          {authLoading || isLoading ? (
            <p className="text-muted">Loading cart…</p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] p-10 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto text-muted mb-3 opacity-60" />
              <p className="text-ink-soft mb-4">Your cart is empty.</p>
              <Link href="/browse">
                <Button variant="forest">Browse listings</Button>
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-3 mb-8">
                {items.map((row) => {
                  const img = row.listing.images?.[0];
                  return (
                    <li
                      key={row.id}
                      className="flex gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)]"
                    >
                      <Link
                        href={`/listing/${row.listing.id}`}
                        className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-muted)]"
                      >
                        {img ? (
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted">
                            No img
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/listing/${row.listing.id}`}
                          className="font-medium text-ink hover:underline line-clamp-2"
                        >
                          {row.listing.title}
                        </Link>
                        <div className="text-sm text-muted mt-1">{row.listing.area}</div>
                        <div className="font-serif text-lg mt-2">{formatPrice(row.listing.price)}</div>
                      </div>
                      <button
                        type="button"
                        title="Remove"
                        className="self-start p-2 rounded-lg text-muted hover:text-rose hover:bg-rose-soft transition-colors"
                        disabled={removeItem.isPending}
                        onClick={() => removeItem.mutate(row.listing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--line)]">
                <div className="font-serif text-xl">
                  Total <span className="text-ink">{formatPrice(total)}</span>
                </div>
                <Button
                  variant="forest"
                  size="lg"
                  className="min-w-[200px]"
                  disabled={checkout.isPending}
                  onClick={async () => {
                    try {
                      const result = await checkout.mutateAsync();
                      const n = result.orders?.length ?? 0;
                      router.push(`/my-orders?checkout=${n}`);
                    } catch (e) {
                      alert(e instanceof Error ? e.message : 'Checkout failed');
                    }
                  }}
                >
                  {checkout.isPending ? 'Processing…' : 'Checkout'}
                </Button>
              </div>
              <p className="text-xs text-muted mt-4">
                Checkout places one order per item (same as buying each listing). Service support activates
                after checkout — see{' '}
                <Link href="/my-orders" className="underline">
                  My orders
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
