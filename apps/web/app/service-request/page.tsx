'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useCreateServiceTicket, useMyServiceTickets, useMyOrders } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { Headphones, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const priorityOptions = [
  { value: 'LOW', label: 'Low — general inquiry' },
  { value: 'MEDIUM', label: 'Medium — needs attention' },
  { value: 'HIGH', label: 'High — affecting usage' },
  { value: 'URGENT', label: 'Urgent — device not working' },
] as const;

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  OPEN: { label: 'Open', color: 'text-saffron-text', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'text-forest-text', icon: AlertCircle },
  RESOLVED: { label: 'Resolved', color: 'text-forest-text', icon: CheckCircle },
  CLOSED: { label: 'Closed', color: 'text-muted', icon: CheckCircle },
};

function ServiceRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedOrderId = searchParams.get('orderId') || '';

  const { data: authData, isLoading: authLoading } = useAuth();
  const { data: ordersData } = useMyOrders();
  const { data: ticketsData, isLoading: ticketsLoading } = useMyServiceTickets();
  const createTicket = useCreateServiceTicket();

  const [orderId, setOrderId] = useState(preselectedOrderId);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const user = authData?.user;

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace('/auth/signin?redirect=/service-request');
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center text-muted px-8">
          {authLoading ? 'Loading…' : 'Redirecting…'}
        </div>
      </>
    );
  }

  const eligibleOrders = (ordersData?.items || []).filter((order: Record<string, unknown>) => {
    const serviceExpires = new Date(order.serviceExpiresAt as string);
    return serviceExpires > new Date() && order.status !== 'CANCELLED';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!orderId) { setError('Please select an order'); return; }
    if (subject.length < 5) { setError('Subject must be at least 5 characters'); return; }
    if (description.length < 20) { setError('Description must be at least 20 characters'); return; }

    try {
      await createTicket.mutateAsync({ orderId, subject, description, priority });
      setSuccess(true);
      setSubject('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    }
  };

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen">
        <div className="max-w-[900px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-[clamp(26px,3.2vw,36px)] font-normal tracking-[-0.025em] text-ink">
              Service Support
            </h1>
            <p className="text-sm text-muted mt-1">
              Every Student Gear Shop purchase includes 1 year of service support. File a ticket below.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_1fr] gap-8">
            {/* Create ticket form */}
            <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-7">
              <h2 className="font-serif text-xl font-medium text-ink mb-5">New Ticket</h2>

              {success && (
                <div className="mb-5 p-4 bg-forest-soft rounded-xl text-sm text-forest-text flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Ticket submitted! Our team will get back to you shortly.
                </div>
              )}

              {error && (
                <div className="mb-5 p-4 bg-rose-soft rounded-xl text-sm text-rose">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2">
                    Order
                  </label>
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border-[0.5px] border-[var(--line-strong)] rounded-xl bg-[var(--form-bg)] text-ink outline-none focus:border-forest"
                  >
                    <option value="">Select an order...</option>
                    {eligibleOrders.map((order: Record<string, unknown>) => {
                      const listing = order.listing as Record<string, unknown>;
                      return (
                        <option key={order.id as string} value={order.id as string}>
                          {listing?.title as string} — {formatPrice(order.amount as number)}
                        </option>
                      );
                    })}
                  </select>
                  {eligibleOrders.length === 0 && (
                    <p className="text-[11px] text-muted mt-1.5">No eligible orders with active service support.</p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2">
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Battery draining too fast"
                    className="w-full px-3 py-2.5 text-sm border-[0.5px] border-[var(--line-strong)] rounded-xl bg-[var(--form-bg)] text-ink outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof priority)}
                    className="w-full px-3 py-2.5 text-sm border-[0.5px] border-[var(--line-strong)] rounded-xl bg-[var(--form-bg)] text-ink outline-none focus:border-forest"
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe the issue in detail. Include what you've already tried..."
                    className="w-full px-3 py-2.5 text-sm border-[0.5px] border-[var(--line-strong)] rounded-xl bg-[var(--form-bg)] text-ink outline-none focus:border-forest resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="forest"
                  size="lg"
                  className="w-full justify-center"
                  disabled={createTicket.isPending}
                >
                  <Headphones className="w-4 h-4" />
                  {createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </div>

            {/* Existing tickets */}
            <div>
              <h2 className="font-serif text-xl font-medium text-ink mb-5">Your Tickets</h2>
              {ticketsLoading ? (
                <div className="text-muted text-sm">Loading...</div>
              ) : !ticketsData?.items?.length ? (
                <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-7 text-center">
                  <Headphones className="w-10 h-10 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted">No tickets yet. If you have an issue with a purchase, create one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ticketsData.items.map((ticket: Record<string, unknown>) => {
                    const order = ticket.order as Record<string, unknown>;
                    const listing = order?.listing as Record<string, unknown>;
                    const statusInfo = statusLabels[ticket.status as string];
                    const StatusIcon = statusInfo?.icon || Clock;

                    return (
                      <div
                        key={ticket.id as string}
                        className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-serif text-[15px] font-medium text-ink">
                            {ticket.subject as string}
                          </h4>
                          <span className={`flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] uppercase flex-shrink-0 ${statusInfo?.color || 'text-muted'}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo?.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted mb-2">
                          Re: {listing?.title as string} · {formatTimeAgo(ticket.createdAt as string)}
                        </div>
                        <p className="text-sm text-ink-soft line-clamp-2">
                          {ticket.description as string}
                        </p>
                        {ticket.resolution && (
                          <div className="mt-3 p-3 bg-forest-soft rounded-xl">
                            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-forest-text mb-1">Resolution</div>
                            <p className="text-sm text-ink-soft">{ticket.resolution as string}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ServiceRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <ServiceRequestContent />
    </Suspense>
  );
}
