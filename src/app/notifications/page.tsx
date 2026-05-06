'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { AppNotification, NotificationType } from '@/lib/notifications';
import {
  Bell,
  BellOff,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileSearch,
  Cpu,
  ArrowRight,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypeConfig {
  label: string;
  icon: React.ReactNode;
  cardBg: string;
  cardBorder: string;
  chipBg: string;
  chipText: string;
  iconBg: string;
  iconText: string;
  linkText: string;
  dotBg: string;
}

const TYPE_CONFIG: Record<NotificationType, TypeConfig> = {
  overdue: {
    label: 'Overdue',
    icon: <AlertTriangle size={16} />,
    cardBg: 'bg-red-50',
    cardBorder: 'border-red-200',
    chipBg: 'bg-red-100',
    chipText: 'text-red-700',
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    linkText: 'text-red-600',
    dotBg: 'bg-red-500',
  },
  due_soon: {
    label: 'Due Soon',
    icon: <Clock size={16} />,
    cardBg: 'bg-amber-50',
    cardBorder: 'border-amber-200',
    chipBg: 'bg-amber-100',
    chipText: 'text-amber-700',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    linkText: 'text-amber-600',
    dotBg: 'bg-amber-500',
  },
  pending_review: {
    label: 'Review',
    icon: <FileSearch size={16} />,
    cardBg: 'bg-blue-50',
    cardBorder: 'border-blue-200',
    chipBg: 'bg-blue-100',
    chipText: 'text-blue-700',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    linkText: 'text-blue-600',
    dotBg: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 size={16} />,
    cardBg: 'bg-green-50',
    cardBorder: 'border-green-200',
    chipBg: 'bg-green-100',
    chipText: 'text-green-700',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    linkText: 'text-green-600',
    dotBg: 'bg-green-500',
  },
  system: {
    label: 'System',
    icon: <Cpu size={16} />,
    cardBg: 'bg-purple-50',
    cardBorder: 'border-purple-200',
    chipBg: 'bg-purple-100',
    chipText: 'text-purple-700',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    linkText: 'text-purple-600',
    dotBg: 'bg-purple-500',
  },
};

const FILTER_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'due_soon', label: 'Due Soon' },
  { value: 'pending_review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
];

const SUMMARY_ITEMS: { type: NotificationType; label: string }[] = [
  { type: 'overdue', label: 'Overdue' },
  { type: 'due_soon', label: 'Due Soon' },
  { type: 'pending_review', label: 'Needs Review' },
  { type: 'system', label: 'System' },
];

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function NotificationItem({
  notif,
  onRead,
}: {
  notif: AppNotification;
  onRead: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[notif.type];
  const actionHref = notif.actionId
    ? `/actions/${notif.actionId}`
    : notif.judgmentId
    ? `/judgments/${notif.judgmentId}`
    : null;

  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-xl border transition-all duration-200',
        notif.read
          ? 'bg-white border-gray-100 opacity-60'
          : cn(cfg.cardBg, cfg.cardBorder, 'shadow-sm'),
      )}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div className="flex-shrink-0 mt-2">
          <div className={cn('w-2 h-2 rounded-full', cfg.dotBg)} />
        </div>
      )}
      {notif.read && <div className="flex-shrink-0 w-2" />}

      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
          notif.read ? 'bg-gray-100 text-gray-400' : cn(cfg.iconBg, cfg.iconText),
        )}
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-xs font-semibold font-mono px-2 py-0.5 rounded-full',
                notif.read ? 'bg-gray-100 text-gray-500' : cn(cfg.chipBg, cfg.chipText),
              )}
            >
              {cfg.label}
            </span>
            {notif.caseNumber && (
              <span className="text-xs font-mono text-blue-600 font-medium">{notif.caseNumber}</span>
            )}
            {notif.department && (
              <span className="text-xs text-gray-500">{notif.department}</span>
            )}
          </div>
          <span className="text-[11px] text-gray-400 font-mono shrink-0 mt-0.5">
            {formatTimeAgo(notif.createdAt)}
          </span>
        </div>

        <p className="font-semibold text-gray-800 text-sm mt-1.5">{notif.title}</p>
        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{notif.body}</p>

        <div className="flex items-center gap-3 mt-3">
          {actionHref && (
            <Link
              href={actionHref}
              onClick={() => onRead(notif.id)}
              className={cn(
                'flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80',
                notif.read ? 'text-gray-500' : cfg.linkText,
              )}
            >
              View directive <ArrowRight size={11} />
            </Link>
          )}
          {!notif.read && (
            <button
              onClick={() => onRead(notif.id)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors ml-auto"
            >
              <Check size={12} /> Mark read
            </button>
          )}
          {notif.read && (
            <span className="ml-auto text-[11px] text-gray-300 font-mono flex items-center gap-1">
              <Check size={10} /> Read
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, notificationCount, markNotificationRead, markAllRead } = useAppStore();
  const [filter, setFilter] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const counts: Record<string, number> = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    overdue: notifications.filter((n) => n.type === 'overdue').length,
    due_soon: notifications.filter((n) => n.type === 'due_soon').length,
    pending_review: notifications.filter((n) => n.type === 'pending_review').length,
    completed: notifications.filter((n) => n.type === 'completed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="relative">
              <Bell size={28} className="text-amber-500" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </div>
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {notificationCount > 0
              ? `${notificationCount} unread — court-mandated actions require attention`
              : 'All caught up — no unread notifications'}
          </p>
        </div>

        {notificationCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium shrink-0"
          >
            <BellOff size={15} />
            Mark all read
          </button>
        )}
      </div>

      {/* Summary strip */}
      {notificationCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUMMARY_ITEMS.map(({ type, label }) => {
            const count = notifications.filter((n) => n.type === type && !n.read).length;
            if (count === 0) return null;
            const cfg = TYPE_CONFIG[type];
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all hover:shadow-sm',
                  filter === type
                    ? cn(cfg.cardBg, cfg.cardBorder)
                    : 'bg-white border-gray-100 hover:border-gray-200',
                )}
              >
                <div className={cn('text-xl font-bold font-mono', cfg.chipText)}>{count}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap border-b border-gray-100 pb-3">
        {FILTER_TABS.map((tab) => {
          const count = counts[tab.value] ?? 0;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all',
                filter === tab.value
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    'text-[11px] font-mono px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                    filter === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BellOff size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 font-medium">
              {filter === 'unread' ? 'All caught up!' : 'No notifications in this category'}
            </p>
            <p className="text-gray-300 text-sm mt-1">Nothing to show here</p>
          </div>
        )}
        {filtered.map((notif) => (
          <NotificationItem
            key={notif.id}
            notif={notif}
            onRead={markNotificationRead}
          />
        ))}
      </div>
    </div>
  );
}
