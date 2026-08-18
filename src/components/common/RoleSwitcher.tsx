import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { UserCheck, ChevronDown, Check } from 'lucide-react';

const ROLES_CONFIG: { role: Role; description: string; badge: string }[] = [
  {
    role: 'CEO',
    description: 'Executive ROI, portfolio health, board-level compliance reporting',
    badge: 'Executive',
  },
  {
    role: 'COO',
    description: 'Operational throughput, SLA breach alerts, automation metrics',
    badge: 'Operations',
  },
  {
    role: 'Operations Manager',
    description: 'Human approval queue, case workbench reviews, batch approvals',
    badge: 'Lead',
  },
  {
    role: 'Compliance Manager',
    description: 'Policy guardrails, violation containment, statutory audit trails',
    badge: 'Governance',
  },
  {
    role: 'AI Product Manager',
    description: 'Agent lifecycle, golden benchmark suites, drift monitoring',
    badge: 'AI Core',
  },
  {
    role: 'Collection Agent',
    description: 'Assigned customer case outreach, draft inspection',
    badge: 'Frontline',
  },
  {
    role: 'Admin',
    description: 'Full workspace governance, role permissions matrix, audit logs',
    badge: 'Full Access',
  },
];

export const RoleSwitcher: React.FC = () => {
  const { activeRole, setActiveRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-medium hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors shadow-sm"
        title="Switch Role for Demo Review"
      >
        <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="font-semibold">{activeRole}</span>
        <ChevronDown className={`w-3 h-3 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs animate-slide-up"
        >
          <div className="px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">SELECT DEMO ROLE (RBAC VIEW)</span>
            <span className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono">7 Roles</span>
          </div>

          <div className="max-h-80 overflow-y-auto py-1 space-y-0.5">
            {ROLES_CONFIG.map(({ role, description, badge }) => {
              const isSelected = activeRole === role;
              return (
                <button
                  key={role}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveRole(role);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left flex items-start justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-blue-950/50 text-blue-300' : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isSelected ? 'text-blue-300' : 'text-white'}`}>{role}</span>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                        {badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{description}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
