'use client';

import { useState } from 'react';
import { useAdminServiceTickets, useAdminUpdateServiceTicket } from '@/lib/admin';
import { formatTimeAgo } from '@/lib/utils';
import { AdminErrorBanner } from '@/components/admin-error-banner';

const TICKET_STATUSES = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;

const statusColors: Record<string, string> = {
  OPEN: 'bg-saffron-soft text-saffron-text',
  IN_PROGRESS: 'bg-forest-soft text-forest-text',
  RESOLVED: 'bg-forest-soft text-forest-text',
  CLOSED: 'bg-[var(--bg-muted)] text-muted',
};

const priorityColors: Record<string, string> = {
  LOW: 'text-muted',
  MEDIUM: 'text-saffron-text',
  HIGH: 'text-rose',
  URGENT: 'text-rose font-bold',
};

export default function AdminServiceTicketsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  const { data, isLoading, isError, error, refetch } = useAdminServiceTickets({ status: statusFilter || undefined, page });
  const updateTicket = useAdminUpdateServiceTicket();

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    await updateTicket.mutateAsync({ id: ticketId, status: newStatus });
  };

  const handlePriorityChange = async (ticketId: string, newPriority: string) => {
    await updateTicket.mutateAsync({ id: ticketId, priority: newPriority });
  };

  const handleResolve = async (ticketId: string) => {
    await updateTicket.mutateAsync({
      id: ticketId,
      status: 'RESOLVED',
      resolution,
    });
    setResolvingId(null);
    setResolution('');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.025em] text-ink">
          Service Tickets
        </h1>
        <p className="text-sm text-muted mt-1">Handle customer service requests from buyers with active 1-year support</p>
      </div>

      <div className="flex gap-2 mb-6">
        {TICKET_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`font-mono text-[11px] py-1.5 px-3 border-[0.5px] rounded-full transition-all ${
              statusFilter === s
                ? 'bg-ink text-bg border-ink'
                : 'border-[var(--line-strong)] text-ink-soft hover:border-ink'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {isError ? (
        <AdminErrorBanner message={error instanceof Error ? error.message : 'Unknown error'} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="text-muted py-12 text-center">Loading tickets...</div>
      ) : data?.items?.length === 0 ? (
        <div className="text-muted py-12 text-center">No service tickets found.</div>
      ) : (
        <>
          <div className="space-y-3">
            {data?.items?.map((ticket: Record<string, unknown>) => {
              const order = ticket.order as Record<string, unknown>;
              const listing = order?.listing as Record<string, unknown>;
              const user = ticket.user as Record<string, unknown>;

              return (
                <div
                  key={ticket.id as string}
                  className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl p-6 hover:border-[var(--line-strong)] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-[17px] font-medium tracking-[-0.015em] text-ink mb-1">
                        {ticket.subject as string}
                      </h3>
                      <div className="text-[12px] text-muted flex items-center gap-2 flex-wrap">
                        <span>Re: {listing?.title as string}</span>
                        <span>·</span>
                        <span>{user?.name as string} ({user?.email as string})</span>
                        <span>·</span>
                        <span>{formatTimeAgo(ticket.createdAt as string)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={ticket.priority as string}
                        onChange={(e) => handlePriorityChange(ticket.id as string, e.target.value)}
                        className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1.5 px-2 rounded-lg border-[0.5px] border-[var(--line)] bg-[var(--bg)] cursor-pointer ${priorityColors[ticket.priority as string] || ''}`}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                      <select
                        value={ticket.status as string}
                        onChange={(e) => handleStatusChange(ticket.id as string, e.target.value)}
                        className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1.5 px-2.5 rounded-lg border-[0.5px] border-[var(--line)] cursor-pointer ${statusColors[ticket.status as string] || ''}`}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-sm text-ink-soft leading-relaxed mb-4">
                    {ticket.description as string}
                  </p>

                  {ticket.resolution && (
                    <div className="bg-forest-soft rounded-xl p-4 mb-3">
                      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-forest-text mb-1.5">Resolution</div>
                      <p className="text-sm text-ink-soft">{ticket.resolution as string}</p>
                    </div>
                  )}

                  {resolvingId === ticket.id ? (
                    <div className="flex gap-2 mt-3">
                      <input
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Write resolution note..."
                        className="flex-1 px-3 py-2 text-sm border-[0.5px] border-[var(--line-strong)] rounded-xl bg-[var(--form-bg)] text-ink outline-none focus:border-forest"
                      />
                      <button
                        onClick={() => handleResolve(ticket.id as string)}
                        disabled={!resolution.trim()}
                        className="px-4 py-2 rounded-xl bg-forest text-white text-[13px] font-medium hover:bg-forest-2 transition-colors disabled:opacity-40"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => { setResolvingId(null); setResolution(''); }}
                        className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] text-muted text-[13px] hover:text-ink transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    !ticket.resolution && (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                      <button
                        onClick={() => setResolvingId(ticket.id as string)}
                        className="text-[13px] text-forest-text font-medium hover:text-forest transition-colors"
                      >
                        Write resolution &rarr;
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-[13px] transition-all ${
                    page === i + 1
                      ? 'bg-ink text-bg'
                      : 'bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] text-muted hover:text-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
