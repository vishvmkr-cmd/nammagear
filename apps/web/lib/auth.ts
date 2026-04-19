'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from './api-url';

async function readAuthError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body?.error === 'Validation failed' && Array.isArray(body.details)) {
      const first = body.details[0];
      if (first?.path?.length && first?.message) {
        return `${String(first.path[0])}: ${first.message}`;
      }
      return first?.message || body.error;
    }
    if (typeof body?.error === 'string') return body.error;
    if (typeof body?.message === 'string') return body.message;
  } catch {
    /* non-JSON body */
  }
  return `Request failed (${res.status})`;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  pincode: string;
  area: string;
  phone?: string;
  college?: string;
  avatarUrl?: string;
  rating: number;
  totalSales: number;
  verifiedAt?: string;
  createdAt: string;
}

export function useAuth() {
  return useQuery<{ user: User } | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      pincode: string;
      phone: string;
      college?: string;
    }) => {
      const payload: Record<string, string> = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        name: data.name.trim(),
        pincode: data.pincode.trim(),
        phone: data.phone.replace(/\D/g, ''),
      };
      const c = data.college?.trim();
      if (c) payload.college = c;

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await readAuthError(res));
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });
      if (!res.ok) throw new Error(await readAuthError(res));
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
    },
  });
}
