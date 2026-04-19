'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
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
        return await api<{ user: User }>('/api/auth/me');
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
      phone?: string;
      college?: string;
    }) => {
      return api<{ user: User }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return api<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return api('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
    },
  });
}
