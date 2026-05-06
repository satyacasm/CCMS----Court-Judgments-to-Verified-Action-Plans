'use client';

import { DEMO_ACTIONS, DEMO_DEPARTMENT_STATS, DEMO_JUDGMENTS } from '@/lib/demo-data';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import DepartmentTag from '@/components/shared/DepartmentTag';
import StatusBadge from '@/components/shared/StatusBadge';
import { BarChart3, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

export default function ReportsPage() {
  const totalActions = DEMO_ACTIONS.length;
  const completed = DEMO_ACTIONS.filter((a) => a.status === 'completed').length;
  const overdue = DEMO_ACTIONS.filter((a) => a.status === 'overdue').length;
  const verified = DEMO_ACTIONS.filter((a) => ['verified', 'in_progress', 'assigned', 'completed'].includes(a.status)).length;

  const pieData = [
    { name: 'Completed', value: completed, color: '#2D6A4F' },
    { name: 'In Progress', value: DEMO_ACTIONS.filter(a => a.status === 'in_progress').length, color: '#7F77DD' },
    { name: 'Pending', value: DEMO_ACTIONS.filter(a => a.status === 'pending_verification').length, color: '#9CA3AF' },
    { name: 'Overdue', value: overdue, color: '#C1121F' },
    { name: 'Verified', value: DEMO_ACTIONS.filter(a => a.status === 'verified').length, color: '#185FA5' },
  ];

  const deptBarData = DEMO_DEPARTMENT_STATS.map((d) => ({
    name: d.department.split(' ')[0],
    compliance: d.compliance_pct,
    fill: d.color_hex,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 size={28} className="text-purple-500" />
            Compliance Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">Exportable compliance summaries across all judgments and departments.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <FileSpreadsheet size={15} className="text-green-600" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ background: 'var(--color-saffron)' }}>
            <FileText size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Directives', value: totalActions, color: '#374151' },
          { label: '% Verified', value: `${Math.round((verified / totalActions) * 100)}%`, color: '#185FA5' },
          { label: '% Compliant', value: `${Math.round((completed / totalActions) * 100)}%`, color: '#2D6A4F' },
          { label: 'Overdue', value: overdue, color: '#C1121F' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <div className="text-3xl font-bold font-mono" style={{ color }}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-gray-800 mb-4">Actions by Status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v} actions`, '']} />
              <Legend formatter={(v: any) => <span className="text-xs text-gray-600">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-gray-800 mb-4">Compliance by Department</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptBarData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2D9CC" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Compliance']} />
              <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
                {deptBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action items table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-semibold text-gray-800">All Action Items</h2>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
            <Download size={13} /> Download
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Action items report">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Case', 'Department', 'Directive', 'Deadline', 'Priority', 'Status', 'Confidence'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_ACTIONS.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">
                    {a.judgment?.case_number}
                  </td>
                  <td className="px-4 py-3">
                    <DepartmentTag department={a.department} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={a.directive_text}>
                    {a.directive_text.slice(0, 60)}…
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                    {a.deadline_iso ? new Date(a.deadline_iso).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[11px] ${a.priority === 'high' ? 'bg-red-50 text-red-600' : a.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500'}`}>
                      {a.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} size="sm" showDot />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {Math.round(a.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
