'use client';

import { useState, use } from 'react';
import { DEMO_JUDGMENTS, DEMO_ACTIONS } from '@/lib/demo-data';
import { ActionItem } from '@/types/action';
import DepartmentTag from '@/components/shared/DepartmentTag';
import ConfidenceBadge from '@/components/shared/ConfidenceBadge';
import { ChevronLeft, Check, X, Edit3, Save, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerificationPage(props: PageProps<'/judgments/[id]/verify'>) {
  const params = use(props.params);
  const judgment = DEMO_JUDGMENTS.find((j) => j.id === params.id) || DEMO_JUDGMENTS[0];
  const actions = DEMO_ACTIONS.filter((a) => a.judgment_id === judgment.id);
  
  const pendingActions = actions.filter(a => a.status === 'pending_verification' || a.status === 'in_progress');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ActionItem>>({});
  
  const action = pendingActions[currentIndex] || actions[0];

  const handleApprove = () => {
    // In a real app, this would make an API call to update the status to 'verified'
    if (currentIndex < pendingActions.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setEditing(false);
    } else {
      alert('All pending actions verified!');
    }
  };

  const handleReject = () => {
    // In a real app, this would make an API call to update the status to 'rejected'
    if (currentIndex < pendingActions.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setEditing(false);
    }
  };

  const toggleEdit = () => {
    if (!editing) {
      setEditForm({
        directive_text: action.directive_text,
        department: action.department,
        deadline_raw: action.deadline_raw,
      });
    }
    setEditing(!editing);
  };

  const saveEdit = () => {
    // In a real app, save to DB
    setEditing(false);
  };

  if (!action) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <CheckCircle2 size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold font-display text-gray-800">All caught up!</h2>
        <p className="text-gray-500 mt-2">No actions pending verification for this judgment.</p>
        <Link href={`/judgments/${params.id}`} className="mt-6 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition">
          Return to Judgment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <Link href={`/judgments/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeft size={16} /> Back
        </Link>
        <div className="text-sm font-mono text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
          Action {currentIndex + 1} of {pendingActions.length || 1}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left: PDF Viewer with Highlights */}
        <div className="card flex flex-col overflow-hidden bg-gray-50">
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText size={16} className="text-blue-500" />
              Source Context (Page {action.source_page})
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden flex flex-col items-center p-4 bg-gray-200/50">
            {/* Mock PDF Document */}
            <div className="bg-white w-full max-w-lg flex-1 shadow-md border border-gray-200 relative p-8 font-serif text-sm leading-relaxed text-gray-800 overflow-y-auto">
              <div className="text-center font-bold mb-6 pb-4 border-b border-gray-300">
                IN THE SUPREME COURT OF INDIA<br/>
                CIVIL ORIGINAL JURISDICTION
              </div>
              <p className="mb-4 text-justify">
                ... considering the severe health impacts of the deteriorating air quality index in the National Capital Region, it is imperative that immediate, concrete steps are taken by the responsible authorities. The right to breathe clean air is fundamental.
              </p>
              
              {/* Highlighted text */}
              <div className="relative my-4 p-2 -mx-2 rounded bg-amber-100/60 border border-amber-200 animate-pulse-highlight cursor-pointer group">
                <span className="absolute -left-3 top-0 bottom-0 w-1 bg-amber-500 rounded-full"></span>
                <span className="absolute -top-3 -right-2 text-[10px] font-mono bg-amber-500 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Target Selection
                </span>
                {action.source_text}
              </div>
              
              <p className="mt-4 text-justify">
                Furthermore, the court notes that previous orders have not been fully complied with. The respective state governments must coordinate closely...
              </p>
            </div>
          </div>
        </div>

        {/* Right: Verification Panel */}
        <div className="card flex flex-col overflow-hidden shadow-md border-t-4 border-t-saffron">
          <div className="px-6 py-4 bg-white border-b border-gray-100">
            <h2 className="font-display text-lg font-bold text-gray-800 flex items-center gap-2">
              Verify Extracted Action
              <ConfidenceBadge score={action.confidence} size="sm" className="ml-auto" />
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            
            {!editing ? (
              <>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Directive</div>
                  <div className="text-gray-900 text-base leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {action.directive_text}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Department</div>
                    <DepartmentTag department={action.department} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Deadline</div>
                    <div className="font-mono text-sm text-gray-800 bg-gray-50 px-3 py-1.5 rounded border border-gray-100 inline-block">
                      {action.deadline_raw || 'Not specified'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-fade-in bg-amber-50/30 p-5 rounded-xl border border-amber-100">
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 font-medium uppercase tracking-wider block">Directive Text</label>
                  <textarea 
                    className="w-full text-gray-900 text-sm leading-relaxed p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[100px]"
                    value={editForm.directive_text}
                    onChange={e => setEditForm({...editForm, directive_text: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-1.5 font-medium uppercase tracking-wider block">Department</label>
                    <input 
                      type="text"
                      className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      value={editForm.department}
                      onChange={e => setEditForm({...editForm, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1.5 font-medium uppercase tracking-wider block">Deadline Extract</label>
                    <input 
                      type="text"
                      className="w-full text-sm font-mono p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      value={editForm.deadline_raw}
                      onChange={e => setEditForm({...editForm, deadline_raw: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                  <button onClick={saveEdit} className="px-4 py-2 text-sm text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 transition shadow-sm">
                    <Save size={14} /> Save Changes
                  </button>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-100 pt-5">
               <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">AI Context Output</div>
               <div className="bg-gray-900 text-green-400 font-mono text-[11px] p-4 rounded-lg overflow-x-auto">
                 <pre>
{`{
  "confidence_score": ${action.confidence},
  "priority": "${action.priority}",
  "reasoning": "Explicit mandate directed at ${action.department} with clear timeline of ${action.deadline_raw}."
}`}
                 </pre>
               </div>
            </div>

          </div>

          {/* Action Bar */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button 
              onClick={toggleEdit}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300 shadow-sm bg-white"
            >
              <Edit3 size={16} /> Edit
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleReject}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200 shadow-sm bg-white"
              >
                <X size={16} /> Reject
              </button>
              <button 
                onClick={handleApprove}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
                style={{ background: 'linear-gradient(135deg, #2D6A4F, #3a8a66)' }}
              >
                <Check size={18} /> Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
