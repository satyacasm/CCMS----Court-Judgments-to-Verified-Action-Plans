'use client';

import { DEMO_ACTIONS, DEMO_JUDGMENTS } from '@/lib/demo-data';
import { formatDate, formatDateRelative, getDaysUntilDeadline } from '@/lib/utils';
import ActionCard from '@/components/actions/ActionCard';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfidenceBadge from '@/components/shared/ConfidenceBadge';
import DepartmentTag from '@/components/shared/DepartmentTag';
import ComplianceRing from '@/components/dashboard/ComplianceRing';
import { CheckCircle2, FileText, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function JudgmentDetailPage(props: PageProps<'/judgments/[id]'>) {
  const { id } = await props.params;
  const judgment = DEMO_JUDGMENTS.find((j) => j.id === id) || DEMO_JUDGMENTS[0];
  const actions = DEMO_ACTIONS.filter((a) => a.judgment_id === judgment.id);
  const verified = actions.filter((a) => a.status === 'verified' || a.status === 'completed' || a.status === 'in_progress' || a.status === 'assigned');
  const compliancePct = actions.length
    ? Math.round((actions.filter((a) => a.status === 'completed').length / actions.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Link href="/judgments" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft size={16} /> Back to Judgments
      </Link>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="text-sm font-mono font-bold text-blue-600">{judgment.case_number}</span>
              <StatusBadge status={judgment.status as never} />
            </div>
            <h1 className="font-display text-2xl font-bold text-gray-900 leading-tight mb-2">
              {judgment.case_title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><FileText size={14} />{judgment.court}</span>
              {judgment.bench && <span>{judgment.bench}</span>}
              <span className="font-mono">{formatDate(judgment.date_of_judgment)}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <ComplianceRing percentage={compliancePct} size={80} color="#2D6A4F" sublabel="done" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-mono font-bold text-gray-800">{actions.length}</span> Total actions
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <span className="font-mono font-bold">{verified.length}</span> Verified
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 size={14} />
                <span className="font-mono font-bold">{actions.filter(a => a.status === 'completed').length}</span> Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split view hint */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* PDF viewer placeholder */}
        <div className="card p-0 overflow-hidden">
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-gray-300 text-xs font-mono flex-1 text-center">{judgment.case_number}.pdf</span>
          </div>
          <div className="bg-gray-100 flex flex-col items-center justify-center" style={{ height: 520 }}>
            <div className="bg-white shadow-xl rounded-sm w-4/5 h-4/5 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {/* Highlight overlay demo */}
              <div
                className="absolute left-4 right-4 rounded"
                style={{ top: '25%', height: 28, background: '#2D6A4F22', border: '1.5px solid #2D6A4F55' }}
              />
              <div
                className="absolute left-4 right-4 rounded"
                style={{ top: '45%', height: 28, background: '#D4831A22', border: '1.5px solid #D4831A55' }}
              />
              <div
                className="absolute left-4 right-4 rounded"
                style={{ top: '65%', height: 28, background: '#C1121F22', border: '1.5px solid #C1121F55' }}
              />
              <div className="text-center z-10">
                <FileText size={36} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">PDF Viewer</p>
                <p className="text-gray-300 text-xs mt-1">Connect Supabase Storage to enable</p>
                <Link href={`/judgments/${id}/verify`}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                  style={{ background: 'var(--color-saffron)' }}>
                  Open Verification View
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-gray-800">Extracted Action Items</h2>
            <span className="text-xs font-mono text-gray-400">{actions.length} total</span>
          </div>
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {actions.map((action) => (
              <ActionCard key={action.id} action={action} compact />
            ))}
            {actions.length === 0 && (
              <div className="card p-8 text-center text-gray-400">
                <Loader2 size={24} className="mx-auto mb-2 animate-spin opacity-30" />
                <p className="text-sm">Extraction in progress...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
