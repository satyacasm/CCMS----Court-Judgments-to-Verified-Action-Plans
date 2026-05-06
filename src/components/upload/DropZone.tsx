'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

export default function DropZone({ onFileAccepted, disabled, maxSizeMB = 50 }: DropZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);
      if (rejected.length > 0) {
        setError(rejected[0].errors[0].message);
        return;
      }
      if (accepted.length > 0) {
        setFile(accepted[0]);
        onFileAccepted(accepted[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled,
  });

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
  };

  if (file) {
    return (
      <div className="card p-5 flex items-center gap-4 border-green-200 bg-green-50/50">
        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
          <FileText size={22} className="text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 truncate">{file.name}</div>
          <div className="text-sm text-gray-500 font-mono">
            {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
          </div>
        </div>
        <button
          onClick={clear}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Remove file"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'dropzone p-10 flex flex-col items-center justify-center text-center cursor-pointer',
          isDragActive && 'active',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        role="button"
        aria-label="Upload PDF judgment file"
        tabIndex={0}
      >
        <input {...getInputProps()} aria-hidden="true" />
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200',
            isDragActive ? 'scale-110' : ''
          )}
          style={{ background: isDragActive ? 'rgba(212,131,26,0.12)' : '#F5F0E8' }}
        >
          <Upload
            size={28}
            style={{ color: isDragActive ? 'var(--color-saffron)' : '#9CA3AF' }}
          />
        </div>

        <p className="text-base font-semibold text-gray-700 mb-1">
          {isDragActive ? 'Drop your PDF here' : 'Drag & drop judgment PDF'}
        </p>
        <p className="text-sm text-gray-400 mb-3">
          or{' '}
          <span style={{ color: 'var(--color-saffron)' }} className="font-medium cursor-pointer hover:underline">
            browse to upload
          </span>
        </p>
        <p className="text-xs text-gray-400 font-mono">PDF only · max {maxSizeMB}MB</p>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
