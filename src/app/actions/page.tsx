'use client';

import { useState } from 'react';
import { DEMO_ACTIONS } from '@/lib/demo-data';
import { formatDate, formatDateRelative } from '@/lib/utils';
import ActionCard from '@/components/actions/ActionCard';
import ActionTimeline from '@/components/actions/ActionTimeline';
import StatusBadge from '@/components/shared/StatusBadge';
import DepartmentTag from '@/components/shared/DepartmentTag';
import { Search, Filter, LayoutList, Columns, ListChecks } from 'lucide-react';
import { ActionStatus, ActionPriority } from '@/types/action';
import { cn } from '@/lib/utils';

const STATUSES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending_verification', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

const DEPARTMENTS = [
  'all',
  'Environment',
  'Finance',
  'Health',
  'Infrastructure',
  'Education',
  'Home Affairs',
  'Water Resources',
  'Social Justice',
];
const PRIORITIES = ['all', 'high', 'medium', 'low'];

export default function ActionsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [dept, setDept] = useState('all');
  const [priority, setPriority] = useState('all');
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const filtered = DEMO_ACTIONS.filter((a) => {
    const matchSearch =
      !search ||
      a.directive_text.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || a.status === status;
    const matchDept = dept === 'all' || a.department === dept;
    const matchPriority = priority === 'all' || a.priority === priority;
    return matchSearch && matchStatus && matchDept && matchPriority;
  });

  const kanbanCols: { key: ActionStatus; label: string }[] = [
    { key: 'pending_verification', label: 'Pending' },
    { key: 'verified', label: 'Verified' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ListChecks size={28} className="text-amber-500" />
            Action Items
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} of {DEMO_ACTIONS.length} actions shown
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600')}
            aria-label="List view"
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={cn('p-2 rounded-lg transition-colors', view === 'kanban' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600')}
            aria-label="Kanban view"
          >
            <Columns size={16} />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <ActionTimeline actions={DEMO_ACTIONS} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search directives, departments..."
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search actions"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 outline-none focus:border-amber-400"
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 outline-none focus:border-amber-400"
          aria-label="Filter by department"
        >
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d === 'all' ? 'All Depts' : d}</option>)}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 outline-none focus:border-amber-400"
          aria-label="Filter by priority"
        >
          {PRIORITIES.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-3">
          {filtered.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Filter size={36} className="mx-auto mb-3 opacity-30" />
              <p>No actions match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Kanban view */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanCols.map((col) => {
            const colActions = filtered.filter((a) => a.status === col.key);
            return (
              <div key={col.key} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                  <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {colActions.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colActions.map((action) => (
                    <ActionCard key={action.id} action={action} compact />
                  ))}
                  {colActions.length === 0 && (
                    <div className="p-4 text-center text-gray-300 text-sm border border-dashed border-gray-200 rounded-xl">
                      No items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
