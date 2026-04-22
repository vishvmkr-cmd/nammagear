'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useListing, useListingContact, useCart, useAddToCart } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatPrice, formatTimeAgo, getConditionLabel } from '@/lib/utils';
import { MapPin, Eye, MessageCircle, ShoppingCart, Shield } from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: listing, isLoading } = useListing(params?.id as string);
  const { refetch: getContact } = useListingContact(params?.id as string);
  const { data: authData } = useAuth();
  const { data: cartData } = useCart(!!authData?.user);
  const addToCart = useAddToCart();
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState<{ phone: string; whatsappUrl: string } | null>(null);
  const [contactError, setContactError] = useState('');
  const [cartError, setCartError] = useState('');
  const [cartAdded, setCartAdded] = useState(false);

  const inCart = cartData?.items?.some((c) => c.listingId === listing?.id) ?? false;

  const handleContactClick = async () => {
    setContactError('');
    try {
      const { data } = await getContact();
      if (data) {
        setContact(data);
        setShowContact(true);
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
      }
    } catch (error: any) {
      if (error?.message?.includes('Not authenticated') || error?.message?.includes('401')) {
        router.push('/auth/signin?redirect=' + encodeURIComponent(`/listing/${params?.id}`));
      } else {
        setContactError(error?.message || 'Could not fetch contact info. Please sign in first.');
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted">Loading listing...</div>
        </div>
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-ink mb-2">Listing not found</h2>
            <Link href="/browse">
              <Button>Browse listings</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const images = listing.images || [];
  const currentImage = images[activeImage];

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-8">
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-12">
              {/* Gallery */}
              <div>
                <div className="aspect-[4/3] rounded-[10px] bg-gradient-to-br from-[var(--img-slate-1)] to-[var(--img-slate-2)] flex items-center justify-center relative overflow-hidden">
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted">No image</div>
                  )}
                  <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.15em] uppercase py-[5px] px-[10px] bg-[var(--bg-elevated)] text-forest-text rounded-[3px] border-[0.5px] border-[var(--line)]">
                    Just listed · {formatTimeAgo(listing.createdAt)}
                  </span>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-2.5">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        onClick={() => setActiveImage(idx)}
                        className={`aspect-square rounded-md border cursor-pointer transition-all ${
                          activeImage === idx
                            ? 'border-[1.5px] border-ink'
                            : 'border-[0.5px] border-[var(--line)] hover:border-[var(--line-strong)]'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${listing.title} ${idx + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <div className="flex gap-1.5 mb-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase py-[5px] px-[10px] rounded-[3px] bg-forest-soft text-forest-text">
                    {getConditionLabel(listing.condition)}
                  </span>
                  {listing.negotiable && (
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase py-[5px] px-[10px] rounded-[3px] bg-[var(--bg-muted)] text-muted">
                      Negotiable
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-[clamp(26px,3.2vw,36px)] font-normal tracking-[-0.025em] leading-[1.1] mb-2 text-ink">
                  {listing.title}
                </h1>

                <div className="flex gap-3.5 flex-wrap text-xs text-muted mb-5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.area}
                  </span>
                  <span>· {listing.views} views</span>
                  {listing.saves && <span>· {listing.saves.length} saves</span>}
                </div>

                <div className="font-serif text-[46px] font-normal tracking-[-0.035em] leading-[1] mb-6 text-ink">
                  {formatPrice(listing.price)}
                </div>

                <div className="grid grid-cols-2 gap-4 gap-x-6 py-5 border-t-[0.5px] border-b-[0.5px] border-[var(--line-strong)] mb-6">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Location</div>
                    <div className="text-sm text-ink mt-1">{listing.area} · {listing.pincode}</div>
                  </div>
                  {listing.ageYears && (
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Age</div>
                      <div className="text-sm text-ink mt-1">{listing.ageYears} years</div>
                    </div>
                  )}
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Box & bill</div>
                    <div className="text-sm text-ink mt-1">{listing.hasBill ? 'Bill available' : 'No bill'}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Category</div>
                    <div className="text-sm text-ink mt-1">{listing.category.name}</div>
                  </div>
                </div>

                {/* Service Warranty Banner */}
                <div className="flex items-start gap-3 p-4 border-[0.5px] border-saffron/30 rounded-[10px] mb-6 bg-saffron/5">
                  <Shield className="w-5 h-5 text-saffron flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-ink mb-1">1-Year Doorstep Service Included</div>
                    <div className="text-xs text-muted leading-relaxed">
                      Every purchase includes free doorstep service for 1 year. Contact our support team anytime for repairs, maintenance, or issues.
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                {(listing.processor || listing.memory || listing.storage || listing.display || listing.graphics) && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg mb-4 text-ink">Technical Specifications</h3>
                    <div className="grid gap-3">
                      {listing.processor && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Processor</span>
                          <span className="text-sm text-ink text-right">{listing.processor}</span>
                        </div>
                      )}
                      {listing.memory && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Memory</span>
                          <span className="text-sm text-ink text-right">{listing.memory}</span>
                        </div>
                      )}
                      {listing.storage && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Storage</span>
                          <span className="text-sm text-ink text-right">{listing.storage}</span>
                        </div>
                      )}
                      {listing.display && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Display</span>
                          <span className="text-sm text-ink text-right">{listing.display}</span>
                        </div>
                      )}
                      {listing.graphics && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Graphics</span>
                          <span className="text-sm text-ink text-right">{listing.graphics}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Warranty Information */}
                {(listing.warrantyType || listing.warrantyPeriod) && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg mb-4 text-ink">Warranty Information</h3>
                    <div className="grid gap-3">
                      {listing.warrantyType && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Type</span>
                          <span className="text-sm text-ink text-right">{listing.warrantyType}</span>
                        </div>
                      )}
                      {listing.warrantyFrom && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">From</span>
                          <span className="text-sm text-ink text-right">{listing.warrantyFrom}</span>
                        </div>
                      )}
                      {listing.warrantyPeriod && (
                        <div className="flex justify-between py-2.5 border-b-[0.5px] border-[var(--line)]">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Period</span>
                          <span className="text-sm text-ink text-right">{listing.warrantyPeriod}</span>
                        </div>
                      )}
                      {listing.warrantyDetails && (
                        <div className="py-2.5">
                          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mb-2">Details</div>
                          <div className="text-sm text-ink leading-relaxed">{listing.warrantyDetails}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3.5 p-4 border-[0.5px] border-[var(--line)] rounded-[10px] mb-4 bg-[var(--bg-muted)]">
                  <div className="w-11 h-11 rounded-full bg-forest text-white dark:text-[#0A0A0A] flex items-center justify-center font-serif text-[15px] flex-shrink-0 font-medium">
                    {listing.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink flex items-center gap-2 flex-wrap">
                      {listing.user.name}
                      {listing.user.verifiedAt && (
                        <span className="font-mono text-[9px] tracking-[0.15em] uppercase py-[3px] px-[7px] bg-forest-soft text-forest-text rounded-[3px]">
                          Verified{listing.user.college && ` · ${listing.user.college}`}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted mt-[3px]">
                      Member since{' '}
                      {listing.user.createdAt
                        ? new Date(listing.user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : '—'}{' '}
                      · {listing.user.totalSales} listings · ★ {listing.user.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    setCartError('');
                    setCartAdded(false);
                    if (!authData?.user) {
                      router.push('/auth/signin?redirect=' + encodeURIComponent(`/listing/${params?.id}`));
                      return;
                    }
                    if (inCart) {
                      router.push('/cart');
                      return;
                    }
                    try {
                      await addToCart.mutateAsync(listing.id);
                      setCartAdded(true);
                    } catch (err: unknown) {
                      setCartError(err instanceof Error ? err.message : 'Failed to add to cart');
                    }
                  }}
                  variant="forest"
                  size="lg"
                  className="w-full justify-center mb-2.5"
                  disabled={addToCart.isPending || listing.status !== 'ACTIVE'}
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  {addToCart.isPending
                    ? 'Adding...'
                    : listing.status !== 'ACTIVE'
                      ? 'Not Available'
                      : inCart
                        ? 'View cart'
                        : 'Add to cart'}
                </Button>

                {cartAdded && listing.status === 'ACTIVE' && (
                  <div className="mb-2.5 p-3 bg-forest-soft border border-forest/20 rounded-xl text-sm text-forest-text text-center">
                    Added to your cart.{' '}
                    <Link href="/cart" className="underline font-medium">
                      View cart →
                    </Link>
                  </div>
                )}
                {inCart && !cartAdded && listing.status === 'ACTIVE' && (
                  <p className="mb-2.5 text-xs text-center text-muted">
                    Already in your cart —{' '}
                    <Link href="/cart" className="text-forest-text underline font-medium">
                      open cart
                    </Link>
                  </p>
                )}

                {cartError && (
                  <div className="mb-2.5 p-3 bg-rose-soft border border-rose/20 rounded-xl text-sm text-rose text-center">
                    {cartError}
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-forest-soft rounded-xl mb-4">
                  <Shield className="w-4 h-4 text-forest-text flex-shrink-0" />
                  <span className="text-[12px] text-forest-text">
                    Buy via Student Gear Shop and get <strong>1 year of free service support</strong>
                  </span>
                </div>

                <Button
                  onClick={handleContactClick}
                  variant="wa"
                  size="lg"
                  className="w-full justify-center mb-2.5"
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Chat on WhatsApp
                </Button>

                {contactError && (
                  <div className="mb-2.5 p-3 bg-rose-soft border border-rose/20 rounded-lg text-sm text-rose text-center">
                    {contactError}
                  </div>
                )}

                <Button variant="outline" size="lg" className="w-full justify-center">
                  Make an offer
                </Button>

                <div className="mt-6 pt-6 border-t-[0.5px] border-[var(--line)]">
                  <h3 className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mb-3">Description</h3>
                  <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>
        </div>
      </main>
    </>
  );
}
