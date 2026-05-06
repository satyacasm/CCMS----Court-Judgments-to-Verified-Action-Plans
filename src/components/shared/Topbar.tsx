'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, Upload } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

const BREADCRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/judgments': 'Judgments',
  '/actions': 'Action Items',
  '/departments': 'Departments',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar, notificationCount } = useAppStore();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    return {
      label: BREADCRUMBS[path] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      path,
    };
  });

  return (
    <header className="topbar" role="banner">
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-gray-600" />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors font-mono text-xs">
            CCMS
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              <span className="text-gray-300">/</span>
              {i === crumbs.length - 1 ? (
                <span className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-display)' }}>
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.path} className="text-gray-500 hover:text-gray-700 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search judgments, actions..."
            className="bg-transparent text-sm text-gray-600 outline-none w-52 placeholder:text-gray-400"
            aria-label="Global search"
          />
          <kbd className="text-[10px] text-gray-400 bg-gray-200 rounded px-1 py-0.5 font-mono">⌘K</kbd>
        </div>

        {/* Upload shortcut */}
        <Link
          href="/judgments"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--color-saffron)' }}
        >
          <Upload size={14} />
          Upload
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={`Notifications: ${notificationCount} unread`}
        >
          <Bell size={18} className="text-gray-600" />
          {notificationCount > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
              aria-hidden="true"
            >
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
