import React, { useState } from 'react';
import { getIncidents, executeContainmentAction } from '../services/api';
import { Incident } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { AlertTriangle, ShieldAlert, CheckCircle2, Pause, History, ArrowRight } from 'lucide-react';

interface IncidentsViewProps {
  onNavigate: (route: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>(getIncidents());
  const [selectedInc, setSelectedInc] = useState<Incident | null>(incidents[0] || null);
  const [containmentModalOpen, setContainmentModalOpen] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<string>('');

  const handleTriggerContainment = (actionType: string) => {
    setSelectedActionType(actionType);
    setContainmentModalOpen(true);
  };

  const handleConfirmContainment = () => {
    if (!selectedInc || !user) return;
    executeContainmentAction(selectedInc.id, selectedActionType, user);
    setIncidents(getIncidents());
    showToast('Containment Executed', `Action "${selectedActionType}" executed for ${selectedInc.id}.`, 'warning');
    setContainmentModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Safety & Incident Management ({incidents.length})</h3>
            <p className="text-xs text-slate-400">Track policy breaches, model drift signals, and prompt injection attempts.</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Incident List & Incident Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Incident Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedInc(inc)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedInc?.id === inc.id
                  ? 'bg-slate-900 border-blue-500/60 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-400">{inc.id}</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {inc.type}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    inc.status === 'Resolved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {inc.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mt-2">{inc.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.rootCause}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-3 mt-2 border-t border-slate-800/80">
                <span>AGENT: {inc.agentName}</span>
                <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incident Detail Workbench (7 Cols) */}
        {selectedInc && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs text-red-400 font-bold">{selectedInc.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedInc.title}</h3>
              </div>
              <span className="px-3 py-1 bg-red-950/60 text-red-300 border border-red-500/40 text-xs font-mono font-bold rounded">
                {selectedInc.severity} Severity
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="font-semibold text-slate-300">Root Cause Analysis:</p>
                <p className="text-slate-300 leading-relaxed">{selectedInc.rootCause}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="font-semibold text-emerald-300">Corrective Action Taken:</p>
                <p className="text-slate-300 leading-relaxed">{selectedInc.correctiveAction}</p>
              </div>
            </div>

            {/* Emergency Containment Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Emergency Containment Controls
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTriggerContainment('Pause Agent Execution')}
                  className="py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Agent</span>
                </button>

                <button
                  onClick={() => handleTriggerContainment('Increase Human Review to 100%')}
                  className="py-2 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Force 100% Review</span>
                </button>

                <button
                  onClick={() => handleTriggerContainment('Roll Back Agent Version')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Roll Back Version</span>
                </button>

                <button
                  onClick={() => handleTriggerContainment('Notify Compliance Manager')}
                  className="py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <span>Alert Compliance</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={containmentModalOpen}
        onClose={() => setContainmentModalOpen(false)}
        onConfirm={handleConfirmContainment}
        title="Execute Emergency Containment?"
        description={`This will immediately execute containment action: "${selectedActionType}".`}
        confirmText="Confirm Containment"
        confirmVariant="danger"
        icon="shield"
      />
    </div>
  );
};
