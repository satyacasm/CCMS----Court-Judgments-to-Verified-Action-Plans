import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase instance (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance (uses service role key, bypasses RLS)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export type Database = {
  public: {
    Tables: {
      judgments: {
        Row: {
          id: string;
          case_number: string;
          case_title: string;
          court: string;
          bench: string | null;
          date_of_judgment: string;
          pdf_url: string;
          pdf_hash: string | null;
          status: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['judgments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['judgments']['Insert']>;
      };
      action_items: {
        Row: {
          id: string;
          judgment_id: string;
          directive_text: string;
          department: string;
          deadline_raw: string | null;
          deadline_iso: string | null;
          compliance_metric: string | null;
          source_text: string;
          source_page: number;
          source_bbox: Record<string, unknown> | null;
          confidence: number;
          priority: string;
          status: string;
          assigned_to: string | null;
          verified_by: string | null;
          verified_at: string | null;
          llm_output: Record<string, unknown> | null;
          human_correction: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['action_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['action_items']['Insert']>;
      };
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          head_name: string | null;
          head_email: string | null;
          color_hex: string;
        };
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['departments']['Insert']>;
      };
    };
  };
};
