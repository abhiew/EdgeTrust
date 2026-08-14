import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { DemoDataBanner } from './DemoDataBanner';
import {
  LayoutDashboard,
  Bot,
  Briefcase,
  CheckSquare,
  FlaskConical,
  ShieldCheck,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  pageTitle: string;
  pageSubtitle: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  currentRoute,
  onNavigate,
  pageTitle,
  pageSubtitle,
}) => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const rolesList: Role[] = [
    'CEO',
    'COO',
    'Operations Manager',
    'Compliance Manager',
    'AI Product Manager',
    'Collection Agent',
    'Admin',
  ];

  const navItems = [
    { id: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: '/agents', label: 'Agents', icon: Bot, badge: '4' },
    { id: '/cases', label: 'Cases', icon: Briefcase, badge: '12' },
    { id: '/approvals', label: 'Approval Queue', icon: CheckSquare, badge: '5', highlight: true },
    { id: '/evaluations', label: 'Evaluations', icon: FlaskConical },
    { id: '/policies', label: 'Policies', icon: ShieldCheck, badge: '6' },
    { id: '/audit', label: 'Audit Log', icon: FileText },
    { id: '/incidents', label: 'Incidents', icon: AlertTriangle, badge: '1', danger: true },
    { id: '/reports', label: 'Reports', icon: BarChart3 },
    { id: '/settings', label: 'Settings', icon: Settings },
    { id: '/help', label: 'Help & Docs', icon: HelpCircle },
  ];

  const notifications = [
    { id: 1, title: '4 high-risk approvals waiting', time: '10m ago', unread: true },
    { id: 2, title: 'Collections Agent evaluation completed (93% pass rate)', time: '1h ago', unread: true },
    { id: 3, title: 'Trust score dropped by 3 points on Customer Support Summariser', time: '3h ago', unread: false },
    { id: 4, title: 'New Policy version POL-01 v2.1 is active', time: '5h ago', unread: false },
    { id: 5, title: 'Incident INC-1042 assigned to AI PM team', time: '1d ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <DemoDataBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 shrink-0 hidden md:flex z-30`}
        >
          {/* Logo Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => onNavigate('/dashboard')}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/30 border border-blue-400/30">
                <span className="font-mono tracking-tighter">ET</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1">
                    EdgeTrust
                  </h1>
                  <p className="text-[10px] text-blue-400 font-mono tracking-wide">CONTROL TOWER</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id || (item.id !== '/dashboard' && currentRoute.startsWith(item.id));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        item.danger
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : item.highlight
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer System Status */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 text-[11px]">
            {!sidebarCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-300 font-medium">System status: Operational</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>LATENCY: 42ms</span>
                  <span>SAFETY: 99.8%</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center" title="System status: Operational">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Bar Navigation Header */}
          <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4 z-20">
            {/* Left: Mobile Toggle & Workspace + Search */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Workspace Selector */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>EdgeTrust NBFC Operations</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-700/60 px-1.5 py-0.5 rounded">
                  IN-SOUTH-1
                </span>
              </div>

              {/* Global Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Case ID (e.g. CASE-9021), Agent, Policy or Correlation ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      if (searchQuery.toUpperCase().startsWith('CASE-')) {
                        onNavigate(`/cases/${searchQuery.trim().toUpperCase()}`);
                      } else {
                        onNavigate('/cases');
                      }
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Right Controls: Role Switcher & Notifications & User */}
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="hidden xl:block text-xs font-mono text-slate-400 bg-slate-800/40 px-2.5 py-1.5 rounded border border-slate-700/50">
                Aug 01, 2026 – Aug 13, 2026
              </div>

              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-medium hover:bg-blue-900/60 transition-colors shadow-sm"
                  title="Switch Role for Demo Review"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold">{activeRole}</span>
                  <ChevronDown className="w-3 h-3 text-blue-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs animate-slide-up">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                      SELECT DEMO ROLE (RBAC VIEW)
                    </div>
                    {rolesList.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setActiveRole(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                          activeRole === role ? 'text-blue-400 font-semibold bg-blue-950/40' : 'text-slate-300'
                        }`}
                      >
                        <span>{role}</span>
                        {activeRole === role && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-900"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs animate-slide-up space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-semibold text-white">Notifications</span>
                      <span className="text-[10px] text-blue-400 hover:underline cursor-pointer">
                        Mark all as read
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg border transition-colors ${
                            n.unread
                              ? 'bg-blue-950/30 border-blue-800/50 text-slate-200'
                              : 'bg-slate-800/30 border-slate-800 text-slate-400'
                          }`}
                        >
                          <p className="font-medium text-xs text-slate-200">{n.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 inline-block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Profile */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full border border-slate-700 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-slate-200 leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{user?.department || 'Operations'}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Breadcrumb & Sub-header */}
          <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                <span className="hover:text-slate-200 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
                  EdgeTrust
                </span>
                <span>/</span>
                <span className="text-blue-400 font-medium capitalize">
                  {currentRoute.replace('/', '').split('/')[0] || 'Overview'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{pageTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{pageSubtitle}</p>
            </div>
            {/* Quick Demo Script Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/help')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Demo Script & Docs</span>
              </button>
            </div>
          </div>

          {/* Main View Container */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
