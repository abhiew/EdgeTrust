import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, Circle, Sparkles, Building2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, onboardingChecklist } = useAuth();
  const [email, setEmail] = useState('admin@edgetrust.demo');
  const [password, setPassword] = useState('Demo@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email && password) {
        login(email);
        setLoading(false);
        onLoginSuccess();
      } else {
        setError('Please enter valid email and password.');
        setLoading(false);
      }
    }, 600);
  };

  const handleQuickDemo = () => {
    setEmail('admin@edgetrust.demo');
    setPassword('Demo@12345');
    login('admin@edgetrust.demo');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/30 border border-blue-400/30">
            <span className="font-mono tracking-tighter">ET</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              EdgeTrust
            </h1>
            <p className="text-xs text-blue-400 font-mono">CONTROL TOWER FOR NBFC COLLECTIONS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            ● Demo Sandbox Ready
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left Hero & Overview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between glass-card shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Human-in-the-Loop AI Governance</span>
              </div>

              <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
                Control every AI decision with confidence.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                EdgeTrust enables NBFC operations teams to safely monitor AI agents, enforce compliance policies, review sensitive customer recommendations, and run version evaluations.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% Policy-enforced human approval boundary for sensitive actions.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Designed specifically for Non-Banking Financial Company (NBFC) operations.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Immutable audit logging with complete evidence grounding & PII masking.</span>
                </div>
              </div>
            </div>

            {/* Onboarding Preview Widget */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Workspace Onboarding Progress</span>
                <span className="text-blue-400 font-mono">4/5 Completed</span>
              </div>

              <div className="space-y-2">
                {onboardingChecklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs text-slate-400">
                    {item.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-300 font-medium'}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Sign In to EdgeTrust</h3>
              <p className="text-xs text-slate-400 mt-1">Access your enterprise AI Control Tower</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition-colors"
                  placeholder="admin@edgetrust.demo"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-medium text-white text-sm rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute border-t border-slate-800 inset-x-0"></div>
              <span className="relative bg-slate-900 px-3 text-[11px] font-mono text-slate-500">OR QUICK ACCESS</span>
            </div>

            {/* Quick Demo Workspace Button */}
            <button
              onClick={handleQuickDemo}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium text-slate-200 text-sm rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Use Demo Workspace (1-Click Login)</span>
            </button>

            {/* Demo Credentials Helper */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1 text-slate-400">
              <p className="font-mono text-slate-300 font-medium">Demo Credentials:</p>
              <p>Email: <code className="text-blue-300">admin@edgetrust.demo</code></p>
              <p>Password: <code className="text-blue-300">Demo@12345</code></p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Note */}
      <footer className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>EdgeTrust Control Tower — Independent Portfolio Product Concept for Enterprise Collections Operations.</p>
      </footer>
    </div>
  );
};
