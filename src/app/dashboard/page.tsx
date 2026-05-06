'use client';

import StatsBar from '@/components/dashboard/StatsBar';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import ActionCard from '@/components/actions/ActionCard';
import ActionTimeline from '@/components/actions/ActionTimeline';
import DepartmentTag from '@/components/shared/DepartmentTag';
import { DEMO_ACTIONS, DEMO_JUDGMENTS, DEMO_DEPARTMENT_STATS } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, FileText, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const overdueActions = DEMO_ACTIONS.filter((a) => a.status === 'overdue');
  const recentActions = DEMO_ACTIONS.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 leading-tight">
            Compliance Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Real-time overview of court-mandated action compliance across all departments.
          </p>
        </div>
        <div className="text-right text-xs text-gray-400 font-mono">
          <div>Updated: {new Date().toLocaleTimeString('en-IN')}</div>
          <div className="flex items-center gap-1 justify-end mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Department compliance rings */}
        <div className="xl:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                Department Compliance
              </h2>
              <Link
                href="/departments"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DEMO_DEPARTMENT_STATS.map((dept) => (
                <Link
                  key={dept.department}
                  href={`/departments/${encodeURIComponent(dept.department)}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ComplianceRing
                    percentage={dept.compliance_pct}
                    size={88}
                    strokeWidth={7}
                    color={dept.color_hex}
                    sublabel="done"
                  />
                  <div className="text-center">
                    <DepartmentTag department={dept.department} size="sm" />
                    <div className="text-xs text-gray-400 mt-1 font-mono">
                      {dept.completed}/{dept.total} actions
                    </div>
                    {dept.overdue > 0 && (
                      <div className="text-xs text-red-500 font-semibold mt-0.5">
                        {dept.overdue} overdue
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <ActionTimeline actions={DEMO_ACTIONS} />
        </div>

        {/* Right: Recent activity + overdue */}
        <div className="space-y-4">
          {/* Overdue alerts */}
          {overdueActions.length > 0 && (
            <div className="card p-4 border-red-200 bg-red-50/40">
              <h3 className="font-semibold text-red-700 text-sm mb-3 flex items-center gap-2">
                <Clock size={14} className="text-red-600" />
                Overdue Actions ({overdueActions.length})
              </h3>
              <div className="space-y-2">
                {overdueActions.map((action) => (
                  <ActionCard key={action.id} action={action} compact />
                ))}
              </div>
            </div>
          )}

          {/* Recent judgments */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-gray-800 text-sm flex items-center gap-2">
                <FileText size={15} className="text-blue-500" />
                Recent Judgments
              </h3>
              <Link href="/judgments" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                All <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-3">
              {DEMO_JUDGMENTS.map((j) => (
                <Link
                  key={j.id}
                  href={`/judgments/${j.id}`}
                  className="block p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <div className="text-xs font-mono text-blue-600 mb-0.5">{j.case_number}</div>
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">{j.case_title}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{j.court}</span>
                    <span className="text-xs font-mono text-gray-400">{formatDate(j.date_of_judgment)}</span>
                  </div>
                  <div className="flex gap-3 mt-1.5 text-xs font-mono">
                    <span className="text-gray-500">{j.action_count} actions</span>
                    <span className="text-green-600">{j.completed_count} done</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent action items */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-gray-800 text-sm">Recent Actions</h3>
              <Link href="/actions" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                All <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentActions.map((action) => (
                <ActionCard key={action.id} action={action} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
