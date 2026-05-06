import { ActionStatus } from '@/types/action';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  ActionStatus,
  { label: string; className: string; dot: string }
> = {
  pending_verification: {
    label: 'Pending Verification',
    className: 'badge-pending',
    dot: 'bg-gray-400',
  },
  verified: {
    label: 'Verified',
    className: 'badge-verified',
    dot: 'bg-blue-500',
  },
  assigned: {
    label: 'Assigned',
    className: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-500',
  },
  in_progress: {
    label: 'In Progress',
    className: 'badge-in-progress',
    dot: 'bg-purple-500',
  },
  completed: {
    label: 'Completed',
    className: 'badge-completed',
    dot: 'bg-green-500',
  },
  overdue: {
    label: 'Overdue',
    className: 'badge-overdue',
    dot: 'bg-red-500',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-gray-100 text-gray-500 line-through',
    dot: 'bg-gray-400',
  },
};

interface StatusBadgeProps {
  status: ActionStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatusBadge({
  status,
  showDot = true,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending_verification;

  return (
    <span
      className={cn(
        'badge',
        config.className,
        size === 'sm' && 'text-[11px] px-2 py-0.5',
        className
      )}
      aria-label={`Status: ${config.label}`}
      role="status"
    >
      {showDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
}
