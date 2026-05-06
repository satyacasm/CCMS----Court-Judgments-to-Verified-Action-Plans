'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEMO_JUDGMENTS } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { FileText, Upload, Search, Filter, CheckCircle2, Loader2, AlertCircle, Eye } from 'lucide-react';
import DropZone from '@/components/upload/DropZone';
import ExtractionProgressStepper from '@/components/upload/ExtractionProgress';
import { ExtractionProgress } from '@/types/extraction';
import { cn } from '@/lib/utils';
import type { Judgment } from '@/types/judgment';

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  uploaded: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <FileText size={12} /> },
  extracting: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Loader2 size={12} className="animate-spin" /> },
  extracted: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle2 size={12} /> },
  verified: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 size={12} /> },
  error: { bg: 'bg-red-100', text: 'text-red-600', icon: <AlertCircle size={12} /> },
};

function JudgmentRow({ j }: { j: Judgment }) {
  const cfg = STATUS_COLORS[j.status] || STATUS_COLORS.uploaded;
  const compliancePct = j.action_count
    ? Math.round(((j.completed_count || 0) / j.action_count) * 100)
    : 0;

  return (
    <div className="card p-4 action-card-hover flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <FileText size={18} className="text-blue-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-blue-600 font-semibold">{j.case_number}</span>
          <span className={cn('badge text-[11px] flex items-center gap-1', cfg.bg, cfg.text)}>
            {cfg.icon}{j.status}
          </span>
        </div>
        <div className="font-semibold text-gray-800 text-sm mt-0.5 truncate">{j.case_title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{j.court} · {formatDate(j.date_of_judgment)}</div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-center shrink-0">
        <div>
          <div className="text-lg font-bold font-mono text-gray-800">{j.action_count || 0}</div>
          <div className="text-xs text-gray-400">Actions</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-green-600">{j.completed_count || 0}</div>
          <div className="text-xs text-gray-400">Done</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono" style={{ color: compliancePct >= 70 ? '#2D6A4F' : compliancePct >= 40 ? '#E09B2D' : '#C1121F' }}>
            {compliancePct}%
          </div>
          <div className="text-xs text-gray-400">Compliant</div>
        </div>
      </div>

      {/* Action */}
      <Link
        href={`/judgments/${j.id}`}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white shrink-0 transition-opacity hover:opacity-90"
        style={{ background: 'var(--color-saffron)' }}
      >
        <Eye size={14} /> View
      </Link>
    </div>
  );
}

export default function JudgmentsPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionProgress, setExtractionProgress] = useState<ExtractionProgress | null>(null);
  const [search, setSearch] = useState('');

  const filtered = DEMO_JUDGMENTS.filter(
    (j) =>
      j.case_title.toLowerCase().includes(search.toLowerCase()) ||
      j.case_number.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileAccepted = (file: File) => {
    setUploadedFile(file);
  };

  const handleExtract = async () => {
    if (!uploadedFile) return;
    const steps: ExtractionProgress[] = [
      { step: 'uploading', progress: 10, message: 'Uploading to secure storage...' },
      { step: 'parsing', progress: 30, message: 'Extracting text from PDF...' },
      { step: 'chunking', progress: 50, message: 'Chunking into semantic segments...' },
      { step: 'extracting', progress: 70, message: 'Running Claude claude-sonnet-4-20250514 extraction...', extracted_count: 0 },
      { step: 'extracting', progress: 85, message: 'Processing directives...', extracted_count: 5 },
      { step: 'storing', progress: 95, message: 'Storing to database...', extracted_count: 9 },
      { step: 'complete', progress: 100, message: 'Extraction complete!', extracted_count: 9 },
    ];
    for (const s of steps) {
      setExtractionProgress(s);
      await new Promise((r) => setTimeout(r, 1200));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Judgments</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage court judgment PDFs for extraction.</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-saffron)' }}
        >
          <Upload size={16} />
          Upload Judgment
        </button>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="card p-6 animate-fade-in space-y-4">
          <h2 className="font-display font-semibold text-gray-800">Upload New Judgment</h2>
          <DropZone onFileAccepted={handleFileAccepted} />
          {uploadedFile && !extractionProgress && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Case Number *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" placeholder="e.g. WP(C) 1234/2024" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Case Title *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" placeholder="e.g. Petitioner v. Respondent" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Court *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" placeholder="e.g. Supreme Court of India" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Date of Judgment *</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div className="sm:col-span-2">
                <button
                  onClick={handleExtract}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, var(--color-saffron), #F5A623)' }}
                >
                  Start Extraction Pipeline
                </button>
              </div>
            </div>
          )}
          {extractionProgress && <ExtractionProgressStepper progress={extractionProgress} />}
        </div>
      )}

      {/* Search & filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by case number or title..."
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search judgments"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={15} /> Filter
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((j) => (
          <JudgmentRow key={j.id} j={j} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>No judgments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
