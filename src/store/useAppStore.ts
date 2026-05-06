'use client';

import { create } from 'zustand';
import { Judgment } from '@/types/judgment';
import { ActionItem } from '@/types/action';

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
  notificationCount: number;
  setNotificationCount: (n: number) => void;

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

  notificationCount: 3,
  setNotificationCount: (n) => set({ notificationCount: n }),

  actionFilter: {
    status: 'all',
    department: 'all',
    priority: 'all',
    search: '',
  },
  setActionFilter: (filter) =>
    set((s) => ({ actionFilter: { ...s.actionFilter, ...filter } })),

  isDemoMode: true,
  setDemoMode: (v) => set({ isDemoMode: v }),
}));
