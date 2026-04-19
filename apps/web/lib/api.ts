import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: 'A' | 'B' | 'C';
  pincode: string;
  area: string;
  ageYears?: number;
  hasBill: boolean;
  status: 'ACTIVE' | 'SOLD' | 'REMOVED';
  views: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    createdAt: string;
    college?: string;
    verifiedAt?: string;
  };
  images: Array<{
    id: string;
    url: string;
    order: number;
  }>;
  saves: Array<{ id: string }>;
}

interface ListingsFilters {
  category?: string;
  pincode?: string;
  condition?: 'A' | 'B' | 'C';
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export function useListings(filters?: ListingsFilters) {
  const query = new URLSearchParams();
  if (filters?.category) query.append('category', filters.category);
  if (filters?.pincode) query.append('pincode', filters.pincode);
  if (filters?.condition) query.append('condition', filters.condition);
  if (filters?.minPrice) query.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) query.append('maxPrice', filters.maxPrice.toString());
  if (filters?.sort) query.append('sort', filters.sort);
  if (filters?.page) query.append('page', filters.page.toString());
  if (filters?.limit) query.append('limit', filters.limit.toString());

  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/listings?${query.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch listings');
      }
      return res.json();
    },
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) throw new Error('No listing ID provided');
      const res = await fetch(`${API_URL}/listings/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch listing');
      }
      return res.json();
    },
    enabled: !!id,
  });
}

export function useListingContact(id: string) {
  return useQuery({
    queryKey: ['listing-contact', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/listings/${id}/contact`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch contact info');
      }
      return res.json();
    },
    enabled: false,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create listing');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_URL}/listings/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useDeleteListing(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete listing');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload images');
      }
      return res.json();
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/categories`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch categories');
      }
      return res.json();
    },
  });
}
