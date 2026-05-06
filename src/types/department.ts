export interface Department {
  id: string;
  name: string;
  code: string;
  head_name?: string;
  head_email?: string;
  color_hex: string;
}

export interface DepartmentStats {
  department: string;
  color_hex: string;
  total: number;
  completed: number;
  in_progress: number;
  overdue: number;
  pending: number;
  compliance_pct: number;
  sparkline?: number[];
}

export const DEPARTMENT_COLORS: Record<string, string> = {
  'Home Affairs': '#185FA5',
  'Environment': '#2D6A4F',
  'Finance': '#D4831A',
  'Education': '#7F77DD',
  'Health': '#C1121F',
  'Infrastructure': '#888780',
  'Law': '#5B4FCF',
  'Agriculture': '#4A7C59',
  'Water Resources': '#2980B9',
  'Urban Development': '#8E6B3E',
};

export const DEPARTMENTS = Object.keys(DEPARTMENT_COLORS);
