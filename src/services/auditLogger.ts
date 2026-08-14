import { AuditEvent, Role } from '../types';
import { mockAuditEvents } from '../data/mockData';

const STORAGE_KEY = 'edgetrust_audit_events_v1';

export function getAuditEvents(): AuditEvent[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load audit events from localStorage', e);
  }
  return mockAuditEvents;
}

export function logAuditEvent(params: {
  actorId: string;
  actorName: string;
  role: Role;
  eventType: string;
  resourceType: string;
  resourceId: string;
  severity?: 'Info' | 'Warning' | 'Critical';
  outcome?: 'Success' | 'Failure' | 'Pending';
  details: string;
  previousState?: string;
  newState?: string;
}): AuditEvent {
  const events = getAuditEvents();
  const newEvent: AuditEvent = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    actorId: params.actorId,
    actorName: params.actorName,
    role: params.role,
    eventType: params.eventType,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    severity: params.severity ?? 'Info',
    outcome: params.outcome ?? 'Success',
    correlationId: `CORR-${Math.floor(10000 + Math.random() * 90000)}`,
    details: params.details,
    previousState: params.previousState,
    newState: params.newState,
  };

  const updated = [newEvent, ...events];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save audit event', e);
  }

  return newEvent;
}
