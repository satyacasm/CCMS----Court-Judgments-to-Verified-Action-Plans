export type ExtractionStep =
  | 'uploading'
  | 'parsing'
  | 'chunking'
  | 'extracting'
  | 'storing'
  | 'complete'
  | 'error';

export interface ExtractionProgress {
  step: ExtractionStep;
  progress: number; // 0–100
  message: string;
  extracted_count?: number;
  error?: string;
}

export interface LLMExtractedAction {
  directive: string;
  department: string;
  deadline_raw: string;
  deadline_iso: string;
  metric: string;
  source_text: string;
  source_page: number;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

export const EXTRACTION_STEPS: { key: ExtractionStep; label: string }[] = [
  { key: 'uploading', label: 'Uploading PDF' },
  { key: 'parsing', label: 'Parsing Text' },
  { key: 'chunking', label: 'Chunking Content' },
  { key: 'extracting', label: 'LLM Extraction' },
  { key: 'storing', label: 'Storing Actions' },
  { key: 'complete', label: 'Complete' },
];
