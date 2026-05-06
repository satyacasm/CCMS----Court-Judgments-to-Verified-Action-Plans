import { getConfidenceLabel, getConfidenceLevel } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  score: number;
  showScore?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ConfidenceBadge({
  score,
  showScore = true,
  size = 'md',
  className,
}: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(score);
  const label = getConfidenceLabel(score);
  const pct = Math.round(score * 100);

  const classMap = {
    high: 'badge-high',
    review: 'badge-review',
    manual: 'badge-manual',
  };

  return (
    <span
      className={cn(
        'badge',
        classMap[level],
        size === 'sm' && 'text-[11px] px-2 py-0.5',
        className
      )}
      aria-label={`Confidence: ${label} (${pct}%)`}
      title={`Confidence score: ${pct}%`}
    >
      {showScore && (
        <span className="font-mono font-semibold">{pct}%</span>
      )}
      <span>{label}</span>
    </span>
  );
}
