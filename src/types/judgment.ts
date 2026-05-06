export type JudgmentStatus =
  | 'uploaded'
  | 'extracting'
  | 'extracted'
  | 'verified'
  | 'error';

export interface Judgment {
  id: string;
  case_number: string;
  case_title: string;
  court: string;
  bench?: string;
  date_of_judgment: string;
  pdf_url: string;
  pdf_hash?: string;
  status: JudgmentStatus;
  uploaded_by?: string;
  created_at: string;
  action_count?: number;
  verified_count?: number;
  completed_count?: number;
}

export interface JudgmentUpload {
  case_number: string;
  case_title: string;
  court: string;
  bench?: string;
  date_of_judgment: string;
  file: File;
}
