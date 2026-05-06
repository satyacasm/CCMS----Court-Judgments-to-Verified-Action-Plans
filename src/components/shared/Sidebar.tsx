'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  Building2,
  BarChart3,
  Settings,
  Scale,
  Search,
  Bell,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { DEMO_ACTIONS } from '@/lib/demo-data';

const overdueCount = DEMO_ACTIONS.filter((a) => a.status === 'overdue').length;

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/judgments', label: 'Judgments', icon: FileText },
  { href: '/actions', label: 'Action Items', icon: ListChecks },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, notificationCount } = useAppStore();

  return (
    <aside
      className={cn(
        'sidebar transition-transform duration-300',
        !sidebarOpen && '-translate-x-full md:translate-x-0'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #D4831A, #F5A623)' }}
        >
          <Scale size={18} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display text-white font-bold text-base leading-tight">
            JudgmentOS
          </div>
          <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-0.5">
            CCMS v1.0
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="mx-4 mt-4 mb-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-300 text-[11px] font-mono font-medium">SYSTEM ACTIVE</span>
        <span className="ml-auto text-green-400/60 text-[10px] font-mono">v2.1</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto" role="navigation">
        <div className="mb-1 px-5 pb-1">
          <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
            Main
          </span>
        </div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-nav-item', isActive && 'active')}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Action Items' && overdueCount > 0 && (
                <span className="ml-auto text-[10px] bg-red-500/20 text-red-300 font-mono px-1.5 py-0.5 rounded-full">
                  {overdueCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-4 mb-1 px-5 pb-1">
          <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
            Tools
          </span>
        </div>
        <Link
          href="/actions?search=true"
          className={cn('sidebar-nav-item', pathname === '/search' && 'active')}
        >
          <Search size={16} strokeWidth={1.8} />
          <span>RAG Search</span>
        </Link>
        <Link
          href="/notifications"
          className={cn('sidebar-nav-item', pathname === '/notifications' && 'active')}
        >
          <Bell size={16} strokeWidth={1.8} />
          <span>Notifications</span>
          {notificationCount > 0 && (
            <span className="ml-auto text-[10px] bg-red-500/80 text-white font-mono px-1.5 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 py-3">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn('sidebar-nav-item', pathname === href && 'active')}
          >
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}

        {/* User avatar */}
        <div className="flex items-center gap-3 px-5 py-3 mt-2 border-t border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 flex-shrink-0">
            S
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-medium truncate">Registrar Office</div>
            <div className="text-white/40 text-[11px] truncate">registrar@supremecourt.gov.in</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
