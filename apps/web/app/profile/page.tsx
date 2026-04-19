'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useUpdateProfile } from '@/lib/api';
import { Check, MapPin, Star, Package, LayoutDashboard } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const user = authData?.user;

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        college: user.college || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace('/auth/signin?redirect=/profile');
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted">Loading profile...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted">Redirecting…</div>
        </div>
      </>
    );
  }

  const handleSave = async () => {
    setSuccess('');
    try {
      await updateProfile.mutateAsync(formData);
      setEditing(false);
      setSuccess('Profile updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch {}
  };

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen py-8">
        <div className="max-w-[600px] mx-auto px-8">
          <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line-strong)] rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-full bg-forest text-white flex items-center justify-center font-serif text-2xl font-medium flex-shrink-0">
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-2xl font-normal tracking-[-0.025em] text-ink">
                  {user.name}
                </h1>
                <p className="text-sm text-muted">{user.email}</p>
                {user.role === 'ADMIN' && (
                  <span className="inline-block mt-2 text-[11px] font-mono tracking-[0.12em] uppercase px-2 py-0.5 rounded-md bg-saffron-soft text-saffron-text font-semibold">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {user.role === 'ADMIN' && (
              <div className="mb-6 p-5 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-muted)]">
                <div className="flex items-center gap-2 text-saffron-text mb-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase font-semibold">Admin panel</span>
                </div>
                <p className="text-sm text-muted mb-4">
                  After login, use the <strong className="text-ink-soft">Admin panel</strong> button in the top bar (hover for all tools), or open any section below.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/admin"><Button variant="forest" size="sm">Dashboard</Button></Link>
                  <Link href="/admin/listings"><Button variant="outline" size="sm">Listings</Button></Link>
                  <Link href="/admin/orders"><Button variant="outline" size="sm">Orders</Button></Link>
                  <Link href="/admin/service-tickets"><Button variant="outline" size="sm">Tickets</Button></Link>
                  <Link href="/admin/users"><Button variant="outline" size="sm">Users</Button></Link>
                  <Link href="/sell"><Button variant="outline" size="sm">New listing</Button></Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 py-5 border-t-[0.5px] border-b-[0.5px] border-[var(--line-strong)] mb-6">
              <div className="text-center">
                <div className="font-serif text-xl font-medium text-ink">{user.totalSales}</div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mt-1">Listings</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-xl font-medium text-ink flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-saffron" />{user.rating.toFixed(1)}
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mt-1">Rating</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-xl font-medium text-ink flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4 text-forest" />{user.pincode}
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mt-1">Pincode</div>
              </div>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-forest-soft border border-forest/20 rounded-lg text-sm text-forest-text flex items-center gap-2">
                <Check className="w-4 h-4" /> {success}
              </div>
            )}

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    College
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="IIIT Bangalore"
                    className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="forest" size="lg" className="flex-1 justify-center" onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Phone</div>
                    <div className="text-sm text-ink mt-1">{user.phone || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">College</div>
                    <div className="text-sm text-ink mt-1">{user.college || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Area</div>
                    <div className="text-sm text-ink mt-1">{user.area || user.pincode}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">Member since</div>
                    <div className="text-sm text-ink mt-1">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" size="lg" className="flex-1 justify-center" onClick={() => setEditing(true)}>
                    Edit profile
                  </Button>
                  <Link href="/my-listings">
                    <Button variant="dark" size="lg">
                      <Package className="w-4 h-4" />
                      My listings
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
