import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from './api-url';

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
    createdAt?: string;
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
  return useQuery<Listing>({
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
      const urls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to upload image');
        }
        const data = await res.json();
        urls.push(data.url);
      }
      return { urls };
    },
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users/me/listings`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch your listings');
      }
      return res.json();
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; phone?: string; college?: string }) => {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useCategories() {
  return useQuery<{ categories: Array<{ id: string; name: string; slug: string }> }>({
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

// ─── Cart (server-backed, per logged-in user) ────────────────────────

export interface CartItem {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing: Listing;
}

export function useCart(enabled = true) {
  return useQuery<{ items: CartItem[] }>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/cart`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error((error as { error?: string }).error || 'Failed to fetch cart');
      }
      return res.json();
    },
    enabled,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      return res.json() as Promise<{ items: CartItem[] }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const res = await fetch(`${API_URL}/cart/${encodeURIComponent(listingId)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to remove');
      }
      return res.json() as Promise<{ items: CartItem[] }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCheckoutCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/cart/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Checkout failed');
      }
      return res.json() as Promise<{ orders: unknown[] }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

// ─── Orders ────────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { listingId: string; notes?: string }) => {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create order');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/orders`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch orders');
      }
      return res.json();
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('No order ID');
      const res = await fetch(`${API_URL}/orders/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch order');
      }
      return res.json();
    },
    enabled: !!id,
  });
}

// ─── Service Tickets ───────────────────────────────────────────────

export function useCreateServiceTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      orderId: string;
      subject: string;
      description: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    }) => {
      const res = await fetch(`${API_URL}/service-tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create service ticket');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useMyServiceTickets() {
  return useQuery({
    queryKey: ['service-tickets'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/service-tickets`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch service tickets');
      }
      return res.json();
    },
  });
}

export function useServiceTicket(id: string | undefined) {
  return useQuery({
    queryKey: ['service-ticket', id],
    queryFn: async () => {
      if (!id) throw new Error('No ticket ID');
      const res = await fetch(`${API_URL}/service-tickets/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch service ticket');
      }
      return res.json();
    },
    enabled: !!id,
  });
}
