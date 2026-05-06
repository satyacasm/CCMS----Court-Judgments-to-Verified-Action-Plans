'use client';

import { useEffect, useState } from 'react';
import { FileText, ListChecks, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DEMO_ACTIONS, DEMO_JUDGMENTS } from '@/lib/demo-data';

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const totalJudgments = DEMO_JUDGMENTS.length;
const totalActions = DEMO_ACTIONS.length;
const overdueCount = DEMO_ACTIONS.filter((a) => a.status === 'overdue').length;
const completedCount = DEMO_ACTIONS.filter((a) => a.status === 'completed').length;
const compliancePct = Math.round((completedCount / totalActions) * 100);

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  suffix?: string;
  sublabel?: string;
}

const STATS: Stat[] = [
  {
    label: 'Total Judgments',
    value: totalJudgments,
    icon: <FileText size={20} />,
    color: '#185FA5',
    bg: '#EFF6FF',
    sublabel: `${DEMO_JUDGMENTS.filter(j => j.status === 'verified').length} verified`,
  },
  {
    label: 'Action Items',
    value: totalActions,
    icon: <ListChecks size={20} />,
    color: '#D4831A',
    bg: '#FEF3C7',
    sublabel: `across 8 departments`,
  },
  {
    label: 'Overdue',
    value: overdueCount,
    icon: <AlertTriangle size={20} />,
    color: '#C1121F',
    bg: '#FEE2E2',
    sublabel: `require immediate action`,
  },
  {
    label: 'Compliant',
    value: compliancePct,
    icon: <CheckCircle2 size={20} />,
    color: '#2D6A4F',
    bg: '#D1FAE5',
    suffix: '%',
    sublabel: `${completedCount} of ${totalActions} completed`,
  },
];

function StatCard({ stat }: { stat: Stat }) {
  const count = useCountUp(stat.value);
  return (
    <div className="card p-5 flex items-center gap-4 animate-fade-in stat-card">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 stat-icon"
        style={{ background: stat.bg, color: stat.color }}
      >
        {stat.icon}
      </div>
      <div className="min-w-0">
        <div
          className="text-2xl font-bold font-mono leading-none tracking-tight"
          style={{ color: stat.color }}
        >
          {count}{stat.suffix}
        </div>
        <div className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</div>
        {stat.sublabel && (
          <div className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</div>
        )}
      </div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
