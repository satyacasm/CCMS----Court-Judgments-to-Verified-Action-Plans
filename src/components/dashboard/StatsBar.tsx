'use client';

import { useEffect, useState } from 'react';
import { FileText, ListChecks, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  suffix?: string;
}

const STATS: Stat[] = [
  {
    label: 'Total Judgments',
    value: 3,
    icon: <FileText size={20} />,
    color: '#185FA5',
    bg: '#EFF6FF',
  },
  {
    label: 'Action Items',
    value: 28,
    icon: <ListChecks size={20} />,
    color: '#D4831A',
    bg: '#FEF3C7',
  },
  {
    label: 'Overdue',
    value: 3,
    icon: <AlertTriangle size={20} />,
    color: '#C1121F',
    bg: '#FEE2E2',
  },
  {
    label: 'Compliant',
    value: 64,
    icon: <CheckCircle2 size={20} />,
    color: '#2D6A4F',
    bg: '#D1FAE5',
    suffix: '%',
  },
];

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

function StatCard({ stat }: { stat: Stat }) {
  const count = useCountUp(stat.value);
  return (
    <div className="card p-5 flex items-center gap-4 animate-fade-in">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: stat.bg, color: stat.color }}
      >
        {stat.icon}
      </div>
      <div>
        <div
          className="text-2xl font-bold font-mono leading-none"
          style={{ color: stat.color }}
        >
          {count}{stat.suffix}
        </div>
        <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
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
