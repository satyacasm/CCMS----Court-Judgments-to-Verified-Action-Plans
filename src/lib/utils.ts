import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRelative(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days}d left`;
  return formatDate(date);
}

export function getDaysUntilDeadline(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDeadlineUrgency(deadline: string | null | undefined): 'overdue' | 'urgent' | 'soon' | 'normal' | null {
  const days = getDaysUntilDeadline(deadline);
  if (days === null) return null;
  if (days < 0) return 'overdue';
  if (days <= 1) return 'urgent';
  if (days <= 7) return 'soon';
  return 'normal';
}

export function getConfidenceLevel(score: number): 'high' | 'review' | 'manual' {
  if (score >= 0.85) return 'high';
  if (score >= 0.60) return 'review';
  return 'manual';
}

export function getConfidenceLabel(score: number): string {
  const lvl = getConfidenceLevel(score);
  if (lvl === 'high') return 'High confidence';
  if (lvl === 'review') return 'Review suggested';
  return 'Manual verification required';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
