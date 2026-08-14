import { AnalyticsEvent, Role } from '../types';

const STORAGE_KEY = 'edgetrust_analytics_events_v1';

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load analytics events', e);
  }
  return [
    { id: 'an-1', eventName: 'login_completed', timestamp: '2026-08-13T08:00:00Z', userId: 'usr-admin-07', role: 'Admin' },
    { id: 'an-2', eventName: 'dashboard_viewed', timestamp: '2026-08-13T08:01:00Z', userId: 'usr-admin-07', role: 'Admin' },
    { id: 'an-3', eventName: 'case_opened', timestamp: '2026-08-13T09:12:00Z', userId: 'usr-opmgr-03', role: 'Operations Manager', metadata: { caseId: 'CASE-9021' } },
    { id: 'an-4', eventName: 'approval_opened', timestamp: '2026-08-13T09:15:00Z', userId: 'usr-opmgr-03', role: 'Operations Manager', metadata: { approvalId: 'APP-1001' } },
  ];
}

export function trackEvent(eventName: string, userId: string, role: Role, metadata?: Record<string, any>): AnalyticsEvent {
  const events = getAnalyticsEvents();
  const newEvent: AnalyticsEvent = {
    id: `an-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventName,
    timestamp: new Date().toISOString(),
    userId,
    role,
    metadata,
  };

  const updated = [newEvent, ...events];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save analytics event', e);
  }

  return newEvent;
}
