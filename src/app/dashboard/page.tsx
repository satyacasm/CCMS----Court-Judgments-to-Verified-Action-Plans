'use client';

import StatsBar from '@/components/dashboard/StatsBar';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import ActionCard from '@/components/actions/ActionCard';
import ActionTimeline from '@/components/actions/ActionTimeline';
import DepartmentTag from '@/components/shared/DepartmentTag';
import { DEMO_ACTIONS, DEMO_JUDGMENTS, DEMO_DEPARTMENT_STATS } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, FileText, Clock, TrendingUp, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const overdueActions = DEMO_ACTIONS.filter((a) => a.status === 'overdue');
  const recentActions = DEMO_ACTIONS.slice(0, 3);
  const totalCompleted = DEMO_ACTIONS.filter((a) => a.status === 'completed').length;
  const overallCompliance = Math.round((totalCompleted / DEMO_ACTIONS.length) * 100);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero header */}
      <div className="dashboard-hero rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="hero-pattern" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scale size={16} className="opacity-70" />
              <span className="text-white/70 text-xs font-mono uppercase tracking-widest">
                Supreme Court of India · CCMS
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight">
              Compliance Dashboard
            </h1>
            <p className="text-white/70 mt-1.5 text-sm max-w-xl">
              Real-time tracking of court-mandated action compliance across all departments.
              {overdueActions.length > 0 && (
                <span className="text-amber-300 font-medium ml-1">
                  {overdueActions.length} action{overdueActions.length > 1 ? 's' : ''} require immediate attention.
                </span>
              )}
            </p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-white/50 text-[11px] font-mono mb-1">{dateStr}</div>
            <div className="text-white text-xs font-mono flex items-center gap-1.5 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
            </div>
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
              <div className="text-xl font-bold font-mono text-white">{overallCompliance}%</div>
              <div className="text-white/60 text-[11px]">Overall compliance</div>
            </div>
          </div>
        </div>

        {/* Alert strip */}
        {overdueActions.length > 0 && (
          <div className="relative z-10 mt-4 flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2">
            <AlertTriangle size={14} className="text-red-300 flex-shrink-0" />
            <span className="text-red-200 text-xs font-medium">
              {overdueActions.length} overdue directive{overdueActions.length > 1 ? 's' : ''} across departments —
            </span>
            <Link href="/actions?status=overdue" className="text-red-200 underline underline-offset-2 text-xs hover:text-white transition-colors">
              Review now
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Department compliance rings */}
        <div className="xl:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-600" />
                  Department Compliance
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Live compliance rates across all 8 departments</p>
              </div>
              <Link
                href="/departments"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors font-medium"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEMO_DEPARTMENT_STATS.map((dept) => (
                <Link
                  key={dept.department}
                  href={`/departments/${encodeURIComponent(dept.department)}`}
                  className="dept-ring-card flex flex-col items-center gap-2.5 p-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-100"
                >
                  <ComplianceRing
                    percentage={dept.compliance_pct}
                    size={80}
                    strokeWidth={6}
                    color={dept.color_hex}
                    sublabel="done"
                  />
                  <div className="text-center w-full">
                    <DepartmentTag department={dept.department} size="sm" />
                    <div className="text-xs text-gray-400 mt-1 font-mono">
                      {dept.completed}/{dept.total} done
                    </div>
                    {dept.overdue > 0 ? (
                      <div className="text-[11px] text-red-500 font-semibold mt-0.5 flex items-center justify-center gap-0.5">
                        <AlertTriangle size={10} />
                        {dept.overdue} overdue
                      </div>
                    ) : (
                      <div className="text-[11px] text-green-600 font-medium mt-0.5 flex items-center justify-center gap-0.5">
                        <CheckCircle2 size={10} />
                        On track
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
            <div className="card p-4 border-red-200 bg-red-50/50">
              <h3 className="font-semibold text-red-700 text-sm mb-3 flex items-center gap-2">
                <Clock size={14} className="text-red-600" />
                Overdue Actions
                <span className="ml-auto bg-red-100 text-red-600 text-[11px] font-mono px-1.5 py-0.5 rounded-full">
                  {overdueActions.length}
                </span>
              </h3>
              <div className="space-y-2">
                {overdueActions.map((action) => (
                  <ActionCard key={action.id} action={action} compact />
                ))}
              </div>
              <Link
                href="/actions?status=overdue"
                className="mt-3 flex items-center justify-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium pt-3 border-t border-red-100 transition-colors"
              >
                View all overdue <ArrowRight size={11} />
              </Link>
            </div>
          )}

          {/* Recent judgments */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-gray-800 text-sm flex items-center gap-2">
                <FileText size={15} className="text-blue-500" />
                Recent Judgments
              </h3>
              <Link href="/judgments" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                All <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {DEMO_JUDGMENTS.slice(0, 4).map((j) => {
                const compliancePct = j.action_count
                  ? Math.round(((j.completed_count || 0) / j.action_count) * 100)
                  : 0;
                return (
                  <Link
                    key={j.id}
                    href={`/judgments/${j.id}`}
                    className="block p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-blue-600 font-semibold group-hover:text-blue-700">{j.case_number}</span>
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: compliancePct >= 70 ? '#2D6A4F' : compliancePct >= 40 ? '#D4831A' : '#C1121F' }}
                      >
                        {compliancePct}%
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-800 line-clamp-1">{j.case_title}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-gray-400 truncate max-w-[130px]">{j.court}</span>
                      <span className="text-[11px] font-mono text-gray-400 shrink-0">{formatDate(j.date_of_judgment)}</span>
                    </div>
                    <div className="mt-1.5 bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${compliancePct}%`,
                          background: compliancePct >= 70 ? '#2D6A4F' : compliancePct >= 40 ? '#D4831A' : '#C1121F',
                        }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent action items */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-gray-800 text-sm">Recent Actions</h3>
              <Link href="/actions" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
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
