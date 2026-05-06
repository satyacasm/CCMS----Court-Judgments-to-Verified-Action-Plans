'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ActionItem } from '@/types/action';
import { formatDate } from '@/lib/utils';
import { DEPARTMENT_COLORS } from '@/types/department';

interface ActionTimelineProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}

export default function ActionTimeline({ actions, onActionClick }: ActionTimelineProps) {
  const withDeadlines = actions
    .filter((a) => a.deadline_iso)
    .sort((a, b) => new Date(a.deadline_iso!).getTime() - new Date(b.deadline_iso!).getTime())
    .slice(0, 15)
    .map((a) => ({
      ...a,
      label: a.department.slice(0, 10),
      date: formatDate(a.deadline_iso),
      daysLeft: Math.ceil(
        (new Date(a.deadline_iso!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
      color: DEPARTMENT_COLORS[a.department] || '#6B7280',
    }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof withDeadlines[0] }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="card p-3 text-xs shadow-lg max-w-xs">
        <div className="font-semibold text-gray-800 mb-1 line-clamp-2">{d.directive_text}</div>
        <div className="text-gray-500">Deadline: <span className="font-mono text-gray-700">{d.date}</span></div>
        <div className="text-gray-500">Dept: <span style={{ color: d.color }}>{d.department}</span></div>
        <div className={d.daysLeft < 0 ? 'text-red-600 font-semibold' : d.daysLeft <= 7 ? 'text-amber-600 font-semibold' : 'text-green-600'}>
          {d.daysLeft < 0 ? `${Math.abs(d.daysLeft)}d overdue` : `${d.daysLeft}d remaining`}
        </div>
      </div>
    );
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-gray-800">Action Deadline Timeline</h3>
        <span className="text-xs text-gray-400 font-mono">{withDeadlines.length} items</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={withDeadlines} layout="vertical" barSize={10}
          onClick={(data: any) => {
            if (data?.activePayload?.[0] && onActionClick) {
              onActionClick(data.activePayload[0].payload as ActionItem);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2D9CC" />
          <XAxis
            type="number"
            dataKey="daysLeft"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v) => `${v}d`}
          />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="daysLeft" radius={[0, 4, 4, 0]}>
            {withDeadlines.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.daysLeft < 0 ? '#C1121F' : entry.daysLeft <= 7 ? '#E09B2D' : entry.color}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
