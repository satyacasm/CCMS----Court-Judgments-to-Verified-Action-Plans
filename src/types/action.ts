export type ActionStatus =
  | 'pending_verification'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'overdue'
  | 'rejected';

export type ActionPriority = 'high' | 'medium' | 'low';

export interface SourceBBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  page: number;
}

export interface ActionItem {
  id: string;
  judgment_id: string;
  directive_text: string;
  department: string;
  deadline_raw?: string;
  deadline_iso?: string;
  compliance_metric?: string;
  source_text: string;
  source_page: number;
  source_bbox?: SourceBBox;
  confidence: number;
  priority: ActionPriority;
  status: ActionStatus;
  assigned_to?: string;
  verified_by?: string;
  verified_at?: string;
  llm_output?: Record<string, unknown>;
  human_correction?: Record<string, unknown>;
  created_at: string;
  // Joined fields
  judgment?: {
    case_number: string;
    case_title: string;
    court: string;
  };
}

export interface ActionUpdate {
  status?: ActionStatus;
  assigned_to?: string;
  deadline_iso?: string;
  directive_text?: string;
  compliance_metric?: string;
}

export interface VerificationDecision {
  decision: 'approve' | 'edit' | 'reject';
  corrections?: Partial<ActionItem>;
  verifier_notes?: string;
}
