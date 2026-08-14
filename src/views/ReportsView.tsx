import React, { useState } from 'react';
import { generateReport } from '../services/api';
import { Report } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BarChart3, Download, Sparkles, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ReportsViewProps {
  onNavigate: (route: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState('Monthly AI Operations Report');
  const [dateRange, setDateRange] = useState('Aug 01, 2026 – Aug 13, 2026');
  const [activeReport, setActiveReport] = useState<Report | null>(() => {
    if (user) return generateReport({ title: 'Monthly AI Operations Report', type: 'Monthly', dateRange: 'Aug 01, 2026 – Aug 13, 2026' }, user);
    return null;
  });

  const reportTypes = [
    'Monthly AI Operations Report',
    'Policy Compliance Report',
    'Human Review Workload Report',
    'Agent Performance Report',
    'Cost and ROI Report',
    'Incident Summary Report',
    'Evaluation Readiness Report',
  ];

  const handleGenerate = () => {
    if (!user) return;
    const rpt = generateReport({ title: selectedReportType, type: selectedReportType, dateRange }, user);
    setActiveReport(rpt);
    showToast('Report Generated', `Generated ${selectedReportType} for ${dateRange}.`, 'success');
  };

  const handleExportCSV = () => {
    if (!activeReport) return;
    const csvContent = `Report Title,${activeReport.title}\nGenerated At,${activeReport.generatedAt}\nDate Range,${activeReport.dateRange}\nSummary,"${activeReport.summary}"\n\nMetric,Value,Change\n${activeReport.kpis.map(k => `${k.label},${k.value},${k.change}`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `edgetrust_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Report CSV file downloaded.', 'success');
  };

  const handleExportPDF = () => {
    showToast('PDF Report Export Simulated', 'Audit PDF compliance report formatted for executive archive.', 'info');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Audit-Ready Reports Generator</h3>
            <p className="text-xs text-slate-400">Generate executive summaries, policy compliance audits, and ROI impact metrics.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Builder Controls */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
          Report Builder Configuration
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Select Report Type</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none"
            >
              {reportTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none font-mono"
            >
              <option value="Aug 01, 2026 – Aug 13, 2026">Last 30 Days (Aug 2026)</option>
              <option value="Jul 01, 2026 – Jul 31, 2026">Previous Month (Jul 2026)</option>
              <option value="Q2 2026 (Apr - Jun)">Q2 2026 Executive Summary</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview Document */}
      {activeReport && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 shadow-2xl glass-card relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                DEMO REPORT (SYNTHETIC DATA)
              </span>
              <h3 className="text-2xl font-bold text-white mt-2">{activeReport.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generated at {new Date(activeReport.generatedAt).toLocaleString()} by {activeReport.generatedBy}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded">
              ID: {activeReport.id}
            </span>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">1. Executive Overview:</h4>
            <p className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
              {activeReport.summary}
            </p>
          </div>

          {/* KPI Cards Grid */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">2. Key Performance & Governance Indicators:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {activeReport.kpis.map((kpi, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                  <p className="text-[10px] text-slate-500">{kpi.label}</p>
                  <p className="text-base font-bold font-mono text-white">{kpi.value}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">{kpi.change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Recommendations */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">3. Operational Governance Recommendations:</h4>
            <div className="space-y-2">
              {activeReport.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono text-center">
            “Demo report generated from synthetic data — EdgeTrust Control Tower Portfolio Project.”
          </div>
        </div>
      )}
    </div>
  );
};
