'use client';

import { DEMO_DEPARTMENT_STATS, DEMO_ACTIONS } from '@/lib/demo-data';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import DepartmentTag from '@/components/shared/DepartmentTag';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import Link from 'next/link';
import { Building2, ArrowRight, AlertTriangle } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building2 size={28} className="text-blue-500" />
          Departments
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Compliance overview for all government departments with court-mandated actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {DEMO_DEPARTMENT_STATS.map((dept) => {
          const sparkData = (dept.sparkline || []).map((v, i) => ({ i, v }));
          return (
            <Link
              key={dept.department}
              href={`/departments/${encodeURIComponent(dept.department)}`}
              className="card p-5 action-card-hover block"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <DepartmentTag department={dept.department} />
                {dept.overdue > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} />
                    {dept.overdue} overdue
                  </span>
                )}
              </div>

              {/* Ring + stats */}
              <div className="flex items-center gap-5 mb-4">
                <ComplianceRing
                  percentage={dept.compliance_pct}
                  size={80}
                  strokeWidth={7}
                  color={dept.color_hex}
                />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <div className="text-gray-400">Total</div>
                    <div className="font-mono font-bold text-gray-800 text-base">{dept.total}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Completed</div>
                    <div className="font-mono font-bold text-green-600 text-base">{dept.completed}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">In Progress</div>
                    <div className="font-mono font-bold text-purple-600 text-base">{dept.in_progress}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Pending</div>
                    <div className="font-mono font-bold text-gray-500 text-base">{dept.pending}</div>
                  </div>
                </div>
              </div>

              {/* Sparkline */}
              {sparkData.length > 0 && (
                <div className="h-12 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={dept.color_hex}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Tooltip
                        formatter={(v: any) => [`${v}%`, 'Compliance']}
                        contentStyle={{ fontSize: 11 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">30-day trend</span>
                <span className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                  View actions <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
