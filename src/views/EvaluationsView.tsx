import React, { useState } from 'react';
import { getEvaluationSuites, runEvaluationSimulation } from '../services/api';
import { EvaluationSuite, EvaluationRun } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FlaskConical, Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface EvaluationsViewProps {
  onNavigate: (route: string) => void;
}

export const EvaluationsView: React.FC<EvaluationsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const suites = getEvaluationSuites();
  const [runningSuiteId, setRunningSuiteId] = useState<string | null>(null);
  const [runProgress, setRunProgress] = useState<number>(0);
  const [lastRunResult, setLastRunResult] = useState<EvaluationRun | null>(null);

  const handleRunEvaluation = (suite: EvaluationSuite) => {
    setRunningSuiteId(suite.id);
    setRunProgress(10);
    setLastRunResult(null);

    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (user) {
            const run = runEvaluationSimulation(suite.id, 'agent-collections-conv', user);
            setLastRunResult(run);
            showToast('Evaluation Suite Completed', `Suite "${suite.name}" finished with 94% pass rate.`, 'success');
          }
          setRunningSuiteId(null);
          return 100;
        }
        return prev + 22;
      });
    }, 300);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Evaluation Studio & Benchmark Suite</h3>
            <p className="text-xs text-slate-400">Test agent versions against synthetic safety, quality, and prompt injection suites before production deployment.</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/evaluations/EV-RUN-241')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <span>Compare Agent v2.3.0 vs v2.4.1</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Live Simulation Running Banner */}
      {runningSuiteId && (
        <div className="bg-slate-900 border border-blue-500/40 p-5 rounded-xl space-y-3 animate-slide-up">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-300">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
              Simulating Agent Evaluation Suite Runs...
            </span>
            <span className="font-mono text-white">{runProgress}% Completed</span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-blue-500 h-full transition-all duration-300 rounded-full" style={{ width: `${runProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Latest Execution Summary Result Card */}
      {lastRunResult && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-xl space-y-3 animate-slide-up">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-emerald-300">Evaluation Execution Run Complete</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">{lastRunResult.id}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Pass Rate:</span>
              <p className="text-base font-bold font-mono text-emerald-400">{lastRunResult.passRatePercent}%</p>
            </div>
            <div>
              <span className="text-slate-400">Policy Compliance:</span>
              <p className="text-base font-bold font-mono text-blue-400">{lastRunResult.policyCompliancePercent}%</p>
            </div>
            <div>
              <span className="text-slate-400">Evidence Grounding:</span>
              <p className="text-base font-bold font-mono text-purple-300">{lastRunResult.evidenceGroundingPercent}%</p>
            </div>
            <div>
              <span className="text-slate-400">Tests Passed:</span>
              <p className="text-base font-bold font-mono text-slate-200">{lastRunResult.passedTests}/{lastRunResult.totalTests}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6 Seed Evaluation Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suites.map((suite) => (
          <div
            key={suite.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-500/30">
                  {suite.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{suite.testCount} Test Cases</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{suite.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{suite.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-500">
                Last run: {new Date(suite.lastRunAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => handleRunEvaluation(suite)}
                disabled={runningSuiteId === suite.id}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Evaluation</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
