import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DemoDataBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/60 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between font-medium">
      <div className="flex items-center gap-2 max-w-5xl">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>DEMO ENVIRONMENT (SYNTHETIC DATA)</strong>: EdgeTrust is a portfolio demonstration using synthetic data. It is not a credit decisioning, collections, legal or regulatory compliance system.
        </span>
      </div>
      <span className="hidden md:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
        ENV: DEMO-IN-SOUTH-1
      </span>
    </div>
  );
};
