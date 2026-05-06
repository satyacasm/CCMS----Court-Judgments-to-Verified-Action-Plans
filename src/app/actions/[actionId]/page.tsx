'use client';

import { DEMO_ACTIONS } from '@/lib/demo-data';
import { use } from 'react';
import ActionCard from '@/components/actions/ActionCard';
import ConfidenceBadge from '@/components/shared/ConfidenceBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import DepartmentTag from '@/components/shared/DepartmentTag';
import { formatDate, formatDateRelative } from '@/lib/utils';
import { ChevronLeft, Calendar, FileText, User, Quote } from 'lucide-react';
import Link from 'next/link';

export default function ActionDetailPage(props: PageProps<'/actions/[actionId]'>) {
  const params = use(props.params);
  const action = DEMO_ACTIONS.find((a) => a.id === params.actionId) || DEMO_ACTIONS[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <Link href="/actions" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft size={16} /> Back to Actions
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <DepartmentTag department={action.department} />
          <StatusBadge status={action.status} />
          <ConfidenceBadge score={action.confidence} />
          <span className={`badge text-xs ${action.priority === 'high' ? 'bg-red-50 text-red-600' : action.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500'}`}>
            {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)} Priority
          </span>
        </div>
        <h1 className="font-display text-xl font-bold text-gray-900 leading-relaxed">
          {action.directive_text}
        </h1>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {action.deadline_iso && (
          <div className="card p-4">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
              <Calendar size={12} /> Deadline
            </div>
            <div className="font-mono font-semibold text-gray-800">{formatDate(action.deadline_iso)}</div>
            <div className="text-sm text-gray-500 mt-0.5">{formatDateRelative(action.deadline_iso)}</div>
            {action.deadline_raw && (
              <div className="text-xs text-gray-400 mt-1 italic">{action.deadline_raw}</div>
            )}
          </div>
        )}
        {action.assigned_to && (
          <div className="card p-4">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
              <User size={12} /> Assigned To
            </div>
            <div className="font-semibold text-gray-800">{action.assigned_to}</div>
          </div>
        )}
        {action.compliance_metric && (
          <div className="card p-4 sm:col-span-2">
            <div className="text-xs text-gray-400 mb-1">Compliance Metric</div>
            <div className="text-sm text-gray-700">{action.compliance_metric}</div>
          </div>
        )}
      </div>

      {/* Source */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
          <Quote size={15} className="text-gray-400" />
          Source Text (Page {action.source_page})
        </div>
        <blockquote className="border-l-4 pl-4 py-2 text-sm text-gray-700 italic leading-relaxed"
          style={{ borderLeftColor: 'var(--color-saffron)' }}>
          {action.source_text}
        </blockquote>
        {action.judgment && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <FileText size={12} />
            <Link href={`/judgments/${action.judgment_id}`} className="text-blue-600 hover:underline font-mono">
              {action.judgment.case_number}
            </Link>
            <span>·</span>
            <span>{action.judgment.court}</span>
          </div>
        )}
      </div>

      {/* Verification info */}
      {action.verified_by && (
        <div className="card p-4 bg-green-50/50 border-green-200">
          <div className="text-xs text-green-700 font-medium mb-1">✓ Verified</div>
          <div className="text-sm text-green-800">Verified by {action.verified_by}</div>
          {action.verified_at && (
            <div className="text-xs text-green-600 mt-0.5 font-mono">{formatDate(action.verified_at)}</div>
          )}
        </div>
      )}

      {/* Update status */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-gray-800 mb-4">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {(['pending_verification', 'verified', 'in_progress', 'completed', 'overdue'] as const).map((s) => (
            <button
              key={s}
              className="px-4 py-2 rounded-xl text-sm border transition-all hover:shadow-sm"
              style={{
                borderColor: action.status === s ? 'var(--color-saffron)' : '#E2D9CC',
                background: action.status === s ? 'rgba(212,131,26,0.08)' : 'white',
                fontWeight: action.status === s ? 600 : 400,
              }}
            >
              <StatusBadge status={s} size="sm" showDot={false} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
