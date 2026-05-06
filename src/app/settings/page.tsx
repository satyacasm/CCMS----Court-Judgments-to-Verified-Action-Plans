'use client';

import { Settings, Database, Key, Bell, Users, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings size={28} className="text-gray-500" /> Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure JudgmentOS environment and integrations.</p>
      </div>

      {[
        {
          icon: <Database size={18} className="text-blue-500" />,
          title: 'Database — Supabase',
          desc: 'Configure PostgreSQL connection for judgments, actions, and embeddings.',
          fields: [
            { label: 'NEXT_PUBLIC_SUPABASE_URL', placeholder: 'https://xxx.supabase.co', type: 'text' },
            { label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', placeholder: 'eyJhbGc...', type: 'password' },
            { label: 'SUPABASE_SERVICE_ROLE_KEY', placeholder: 'eyJhbGc...', type: 'password' },
          ],
        },
        {
          icon: <Key size={18} className="text-amber-500" />,
          title: 'AI / LLM — Anthropic',
          desc: 'Claude claude-sonnet-4-20250514 is used for PDF extraction and RAG queries.',
          fields: [
            { label: 'ANTHROPIC_API_KEY', placeholder: 'sk-ant-...', type: 'password' },
          ],
        },
        {
          icon: <Bell size={18} className="text-green-500" />,
          title: 'Email Notifications — Resend',
          desc: 'Deadline alerts sent to assigned officers and department heads.',
          fields: [
            { label: 'RESEND_API_KEY', placeholder: 're_...', type: 'password' },
          ],
        },
        {
          icon: <Shield size={18} className="text-purple-500" />,
          title: 'Vector Store — Pinecone',
          desc: 'Semantic search across all indexed judgment chunks.',
          fields: [
            { label: 'PINECONE_API_KEY', placeholder: 'pcsk_...', type: 'password' },
            { label: 'PINECONE_INDEX', placeholder: 'judgmentos-index', type: 'text' },
          ],
        },
      ].map((section) => (
        <div key={section.title} className="card p-5">
          <div className="flex items-center gap-2.5 mb-1">
            {section.icon}
            <h2 className="font-display font-semibold text-gray-800">{section.title}</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">{section.desc}</p>
          <div className="space-y-3">
            {section.fields.map((f) => (
              <div key={f.label}>
                <label className="text-xs font-mono font-medium text-gray-600 block mb-1">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 bg-gray-50"
                />
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: 'var(--color-saffron)' }}>
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
