'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from './api-url';

async function readAdminError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.error === 'string') return body.error;
  } catch {
    /* ignore */
  }
  if (res.status === 401) return 'Not signed in or session expired. Log in as an admin.';
  if (res.status === 403) return 'Admin access required. Log out and log in again if your account was promoted.';
  return `Request failed (${res.status})`;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/stats`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(await readAdminError(res));
      return res.json();
    },
  });
}

export function useAdminListings(filters?: { status?: string; page?: number }) {
  const query = new URLSearchParams();
  if (filters?.status) query.append('status', filters.status);
  if (filters?.page) query.append('page', filters.page.toString());

  return useQuery({
    queryKey: ['admin', 'listings', filters],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/listings?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(await readAdminError(res));
      return res.json();
    },
  });
}

export function useAdminUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title?: string; price?: number; status?: string; condition?: string; negotiable?: boolean; description?: string }) => {
      const res = await fetch(`${API_URL}/admin/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update listing');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/admin/listings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to remove listing');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminOrders(filters?: { status?: string; page?: number }) {
  const query = new URLSearchParams();
  if (filters?.status) query.append('status', filters.status);
  if (filters?.page) query.append('page', filters.page.toString());

  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/orders?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(await readAdminError(res));
      return res.json();
    },
  });
}

export function useAdminUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_URL}/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update order');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminServiceTickets(filters?: { status?: string; page?: number }) {
  const query = new URLSearchParams();
  if (filters?.status) query.append('status', filters.status);
  if (filters?.page) query.append('page', filters.page.toString());

  return useQuery({
    queryKey: ['admin', 'service-tickets', filters],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/service-tickets?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(await readAdminError(res));
      return res.json();
    },
  });
}

export function useAdminUpdateServiceTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; status?: string; resolution?: string; priority?: string }) => {
      const res = await fetch(`${API_URL}/admin/service-tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update service ticket');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminUsers(filters?: { page?: number }) {
  const query = new URLSearchParams();
  if (filters?.page) query.append('page', filters.page.toString());

  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/users?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(await readAdminError(res));
      return res.json();
    },
  });
}
