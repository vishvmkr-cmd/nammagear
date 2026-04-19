'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/lib/admin';
import { formatTimeAgo } from '@/lib/utils';
import { AdminErrorBanner } from '@/components/admin-error-banner';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAdminUsers({ page });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.025em] text-ink">
          Users
        </h1>
        <p className="text-sm text-muted mt-1">All registered Student Gear Shop users</p>
      </div>

      {isError ? (
        <AdminErrorBanner message={error instanceof Error ? error.message : 'Unknown error'} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="text-muted py-12 text-center">Loading users...</div>
      ) : (
        <>
          <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line)] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-[0.5px] border-[var(--line)] bg-[var(--bg-muted)]">
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">User</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Area</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Listings</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Orders</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-[0.14em] uppercase text-muted font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-muted text-sm">
                        No users in the database yet.
                      </td>
                    </tr>
                  ) : null}
                  {data?.items?.map((user: Record<string, unknown>) => {
                    const counts = user._count as Record<string, number>;
                    return (
                      <tr key={user.id as string} className="border-b-[0.5px] border-[var(--line)] last:border-0 hover:bg-[var(--bg-muted)] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-forest text-white dark:text-[#0A0A0A] flex items-center justify-center font-serif text-[12px] flex-shrink-0 font-medium">
                              {(user.name as string).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-ink text-[13px]">{user.name as string}</div>
                              <div className="text-[11px] text-muted">{user.email as string}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-mono text-[10px] tracking-[0.12em] uppercase py-1 px-2 rounded-[3px] ${
                            user.role === 'ADMIN'
                              ? 'bg-saffron-soft text-saffron-text'
                              : 'bg-[var(--bg-muted)] text-muted'
                          }`}>
                            {user.role as string}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[12px] text-muted">
                          {user.area as string}
                        </td>
                        <td className="py-3.5 px-4 text-[13px] text-ink">
                          {counts?.listings ?? 0}
                        </td>
                        <td className="py-3.5 px-4 text-[13px] text-ink">
                          {counts?.orders ?? 0}
                        </td>
                        <td className="py-3.5 px-4 text-[12px] text-muted">
                          {formatTimeAgo(user.createdAt as string)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
