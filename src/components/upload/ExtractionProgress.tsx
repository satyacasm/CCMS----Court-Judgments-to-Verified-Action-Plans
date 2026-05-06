'use client';

import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { ExtractionProgress, EXTRACTION_STEPS, ExtractionStep } from '@/types/extraction';
import { cn } from '@/lib/utils';

interface ExtractionProgressProps {
  progress: ExtractionProgress;
}

const stepIndex = (step: ExtractionStep) =>
  EXTRACTION_STEPS.findIndex((s) => s.key === step);

export default function ExtractionProgressStepper({ progress }: ExtractionProgressProps) {
  const currentIdx = stepIndex(progress.step);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-gray-800">Extraction Pipeline</h3>
        {progress.extracted_count !== undefined && (
          <span className="text-sm font-mono text-gray-500">
            {progress.extracted_count} actions found
          </span>
        )}
      </div>

      {/* Overall progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress.progress}%`,
            background: progress.step === 'error'
              ? 'var(--color-crimson)'
              : 'linear-gradient(90deg, var(--color-saffron), var(--color-verdant))',
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {EXTRACTION_STEPS.filter(s => s.key !== 'error').map((step, idx) => {
          const isDone = currentIdx > idx || progress.step === 'complete';
          const isCurrent = progress.step === step.key;
          const isError = progress.step === 'error' && isCurrent;
          const isPending = currentIdx < idx && progress.step !== 'complete';

          return (
            <div key={step.key} className="stepper-step">
              <div
                className={cn(
                  'stepper-circle',
                  isDone && 'bg-green-100 text-green-600',
                  isCurrent && !isError && 'bg-amber-100 text-amber-600 ring-2 ring-amber-300',
                  isError && 'bg-red-100 text-red-600',
                  isPending && 'bg-gray-100 text-gray-400',
                )}
              >
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : isCurrent && !isError ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isError ? (
                  <XCircle size={16} />
                ) : (
                  <Circle size={16} />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    'text-sm font-medium',
                    isDone && 'text-green-700',
                    isCurrent && !isError && 'text-amber-700',
                    isError && 'text-red-600',
                    isPending && 'text-gray-400',
                  )}
                >
                  {step.label}
                </div>
                {isCurrent && progress.message && (
                  <div className="text-xs text-gray-500 mt-0.5 font-mono">
                    {progress.message}
                  </div>
                )}
              </div>
              {isCurrent && !isError && (
                <span className="text-xs font-mono text-amber-600 font-semibold">
                  {progress.progress}%
                </span>
              )}
              {isDone && (
                <span className="text-xs font-mono text-green-600">✓</span>
              )}
            </div>
          );
        })}
      </div>

      {progress.step === 'error' && progress.error && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700 font-mono">
          Error: {progress.error}
        </div>
      )}
    </div>
  );
}
