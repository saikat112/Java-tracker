import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function getHealthColor(status: string): string {
  switch (status) {
    case 'HEALTHY': return 'text-green-500';
    case 'WARNING': return 'text-yellow-500';
    case 'OVER_BUDGET':
    case 'OVER': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getHealthBg(status: string): string {
  switch (status) {
    case 'HEALTHY': return 'bg-green-100 text-green-800';
    case 'WARNING': return 'bg-yellow-100 text-yellow-800';
    case 'OVER_BUDGET':
    case 'OVER': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F97316', Travel: '#3B82F6', Rent: '#8B5CF6',
  Electricity: '#EAB308', Shopping: '#EC4899', Medicine: '#EF4444',
  Bills: '#6B7280', Entertainment: '#14B8A6', Others: '#9CA3AF',
};
