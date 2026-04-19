import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return 'yesterday';
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function getConditionLabel(condition: 'A' | 'B' | 'C'): string {
  const labels = {
    A: 'Grade A · like new',
    B: 'Grade B · good',
    C: 'Grade C · fair',
  };
  return labels[condition];
}

export function getConditionColor(condition: 'A' | 'B' | 'C'): string {
  const colors = {
    A: 'a',
    B: 'b',
    C: 'c',
  };
  return colors[condition];
}
