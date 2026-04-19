'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useListing, useListingContact } from '@/lib/api';
import { formatPrice, formatTimeAgo, getConditionLabel } from '@/lib/utils';
import { MapPin, Eye, Heart, ExternalLink, MessageCircle } from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: listing, isLoading } = useListing(params?.id as string);
  const { refetch: getContact } = useListingContact(params?.id as string);
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState<{ phone: string } | null>(null);

  const handleContactClick = async () => {
    try {
      const { data } = await getContact();
      setContact(data);
      setShowContact(true);
      
      if (data?.phone) {
        const whatsappUrl = `https://wa.me/91${data.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
          `Hi! I'm interested in your listing: ${listing?.title}`
        )}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      router.push('/auth/signin?redirect=' + encodeURIComponent(`/listing/${params?.id}`));
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
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="rounded-2xl overflow-hidden border-[0.5px] border-[var(--line-strong)] bg-[var(--bg-elevated)] shadow-browser">
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
                nammagear.in/listing/{listing.id.slice(0, 8)}
              </div>
            </div>

            <div className="grid md:grid-cols-[1.1fr_1fr] gap-12 p-9">
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
                  <span>· {listing.saves?.length || 0} saves</span>
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
                      Member since {new Date(listing.user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} · {listing.user.totalSales} listings · ★ {listing.user.rating.toFixed(1)}
                    </div>
                  </div>
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
        </div>
      </main>
    </>
  );
}
