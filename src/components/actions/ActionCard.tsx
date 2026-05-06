'use client';

import Link from 'next/link';
import { formatDate, formatDateRelative, getDaysUntilDeadline, truncate } from '@/lib/utils';
import { ActionItem } from '@/types/action';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfidenceBadge from '@/components/shared/ConfidenceBadge';
import DepartmentTag from '@/components/shared/DepartmentTag';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEPARTMENT_COLORS } from '@/types/department';

interface ActionCardProps {
  action: ActionItem;
  compact?: boolean;
  onClick?: () => void;
  highlighted?: boolean;
}

export default function ActionCard({ action, compact = false, onClick, highlighted }: ActionCardProps) {
  const daysLeft = getDaysUntilDeadline(action.deadline_iso);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const deptColor = DEPARTMENT_COLORS[action.department] || '#6B7280';

  return (
    <div
      className={cn(
        'card action-card-hover p-4 cursor-pointer border-l-4 transition-all duration-200',
        highlighted && 'ring-2 ring-amber-400/50',
      )}
      style={{ borderLeftColor: deptColor }}
      onClick={onClick}
      role="article"
      aria-label={`Action: ${action.directive_text.slice(0, 60)}...`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          <DepartmentTag department={action.department} size="sm" />
          <StatusBadge status={action.status} size="sm" />
          <span
            className={cn(
              'badge text-[11px]',
              action.priority === 'high' && 'bg-red-50 text-red-600',
              action.priority === 'medium' && 'bg-amber-50 text-amber-700',
              action.priority === 'low' && 'bg-gray-50 text-gray-500',
            )}
            aria-label={`Priority: ${action.priority}`}
          >
            {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
          </span>
        </div>
        <ConfidenceBadge score={action.confidence} size="sm" showScore={false} />
      </div>

      {/* Directive text */}
      <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">
        {compact ? truncate(action.directive_text, 140) : action.directive_text}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        {action.deadline_iso && (
          <span
            className={cn(
              'flex items-center gap-1 font-mono',
              isOverdue && 'text-red-600 font-semibold',
              isUrgent && !isOverdue && 'text-amber-600 font-semibold',
            )}
            aria-label={`Deadline: ${formatDate(action.deadline_iso)}`}
          >
            <Calendar size={12} />
            {formatDateRelative(action.deadline_iso)}
          </span>
        )}
        {action.assigned_to && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {action.assigned_to}
          </span>
        )}
        {action.judgment && (
          <span className="flex items-center gap-1 text-blue-600">
            <FileText size={12} />
            {action.judgment.case_number}
          </span>
        )}
        <span className="ml-auto text-gray-400 font-mono text-[11px]">
          p.{action.source_page}
        </span>
      </div>

      {/* Link to detail */}
      {!compact && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Confidence: <span className="font-mono font-medium text-gray-600">{Math.round(action.confidence * 100)}%</span>
          </span>
          <Link
            href={`/actions/${action.id}`}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View detail <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
