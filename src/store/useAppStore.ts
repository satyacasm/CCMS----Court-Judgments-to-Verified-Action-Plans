'use client';

import { create } from 'zustand';
import { Judgment } from '@/types/judgment';
import { ActionItem } from '@/types/action';
import { AppNotification, INITIAL_NOTIFICATIONS, INITIAL_UNREAD_COUNT } from '@/lib/notifications';

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Selected judgment for context
  selectedJudgment: Judgment | null;
  setSelectedJudgment: (j: Judgment | null) => void;

  // Selected action for detail panel
  selectedAction: ActionItem | null;
  setSelectedAction: (a: ActionItem | null) => void;

  // PDF viewer state
  pdfCurrentPage: number;
  setPdfCurrentPage: (page: number) => void;
  pdfHighlightedActionId: string | null;
  setPdfHighlightedActionId: (id: string | null) => void;

  // Notifications
  notifications: AppNotification[];
  notificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Filters
  actionFilter: {
    status: string;
    department: string;
    priority: string;
    search: string;
  };
  setActionFilter: (filter: Partial<AppState['actionFilter']>) => void;

  // Demo mode
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  selectedJudgment: null,
  setSelectedJudgment: (j) => set({ selectedJudgment: j }),

  selectedAction: null,
  setSelectedAction: (a) => set({ selectedAction: a }),

  pdfCurrentPage: 1,
  setPdfCurrentPage: (page) => set({ pdfCurrentPage: page }),
  pdfHighlightedActionId: null,
  setPdfHighlightedActionId: (id) => set({ pdfHighlightedActionId: id }),

  notifications: INITIAL_NOTIFICATIONS,
  notificationCount: INITIAL_UNREAD_COUNT,
  markNotificationRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        notificationCount: updated.filter((n) => !n.read).length,
      };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      notificationCount: 0,
    })),

  actionFilter: {
    status: 'all',
    department: 'all',
    priority: 'all',
    search: '',
  },
  setActionFilter: (filter) =>
    set((s) => ({ actionFilter: { ...s.actionFilter, ...filter } })),

  isDemoMode: false,
  setDemoMode: (v) => set({ isDemoMode: v }),
}));
