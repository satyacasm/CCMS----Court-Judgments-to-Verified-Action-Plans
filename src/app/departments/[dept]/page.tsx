'use client';

import { DEMO_ACTIONS, DEMO_DEPARTMENT_STATS } from '@/lib/demo-data';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import DepartmentTag from '@/components/shared/DepartmentTag';
import ActionCard from '@/components/actions/ActionCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function DeptDetailPage(props: PageProps<'/departments/[dept]'>) {
  const params = use(props.params);
  const deptName = decodeURIComponent(params.dept);
  const stats = DEMO_DEPARTMENT_STATS.find((d) => d.department === deptName);
  const actions = DEMO_ACTIONS.filter((a) => a.department === deptName);

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/departments" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft size={16} /> Back to Departments
      </Link>

      <div className="flex items-start gap-6 flex-wrap">
        <div className="flex-1">
          <DepartmentTag department={deptName} size="md" />
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">{deptName}</h1>
          <p className="text-gray-500 text-sm mt-1">{actions.length} court-mandated action items</p>
        </div>
        {stats && (
          <ComplianceRing
            percentage={stats.compliance_pct}
            size={100}
            color={stats.color_hex}
            sublabel="compliant"
          />
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: '#374151' },
            { label: 'Completed', value: stats.completed, color: '#2D6A4F' },
            { label: 'In Progress', value: stats.in_progress, color: '#7F77DD' },
            { label: 'Overdue', value: stats.overdue, color: '#C1121F' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold text-gray-800 mb-4">Action Items</h2>
        <div className="space-y-3">
          {actions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
          {actions.length === 0 && (
            <div className="text-center py-12 text-gray-400">No actions for this department</div>
          )}
        </div>
      </div>
    </div>
  );
}
