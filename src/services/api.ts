import {
  Agent,
  LoanCase,
  Approval,
  Policy,
  EvaluationSuite,
  EvaluationRun,
  AuditEvent,
  Incident,
  Report,
  User,
  Role
} from '../types';
import {
  mockAgents,
  mockCases,
  mockApprovals,
  mockPolicies,
  mockEvaluationSuites,
  mockAuditEvents,
  mockIncidents,
  mockEvaluationRunComparison
} from '../data/mockData';
import { logAuditEvent } from './auditLogger';
import { trackEvent } from './analytics';

const AGENTS_KEY = 'edgetrust_agents_v1';
const CASES_KEY = 'edgetrust_cases_v1';
const APPROVALS_KEY = 'edgetrust_approvals_v1';
const POLICIES_KEY = 'edgetrust_policies_v1';
const INCIDENTS_KEY = 'edgetrust_incidents_v1';
const EVAL_RUNS_KEY = 'edgetrust_eval_runs_v1';

// Helper to initialize LocalStorage safely
function loadInitial<T>(key: string, seed: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(key, JSON.stringify(seed));
  } catch (e) {
    console.error(`Error loading key ${key}`, e);
  }
  return seed;
}

function saveState<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key}`, e);
  }
}

// 1. Dashboard API
export function getDashboardSummary() {
  const cases = loadInitial<LoanCase[]>(CASES_KEY, mockCases);
  const approvals = loadInitial<Approval[]>(APPROVALS_KEY, mockApprovals);
  const agents = loadInitial<Agent[]>(AGENTS_KEY, mockAgents);
  const incidents = loadInitial<Incident[]>(INCIDENTS_KEY, mockIncidents);

  const totalCases = 12486; // Synthetic baseline total
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending Review').length;
  const healthyAgents = agents.filter((a) => a.status === 'Healthy').length;
  const openIncidentsCount = incidents.filter((i) => i.status === 'Open' || i.status === 'Investigating').length;

  return {
    kpis: {
      casesProcessed: { value: '12,486', change: '+18.4%', label: 'vs previous 30 days' },
      automationRate: { value: '72.4%', change: '+8.7%', label: 'Auto-recommended & executed' },
      humanReviewRate: { value: '18.9%', change: '-4.2%', label: 'Routed to ops queue' },
      policyCompliance: { value: '97.8%', change: '+1.6%', label: 'Passed safety checks' },
      avgCostPerCase: { value: '₹2.40', change: '-12.5%', label: 'Average AI run cost' },
      operationalSavings: { value: '₹8.6L', change: '+22.0%', label: 'Simulated estimate' },
    },
    counts: {
      totalCases,
      pendingApprovalsCount,
      healthyAgentsCount: healthyAgents,
      totalAgentsCount: agents.length,
      openIncidentsCount,
    }
  };
}

export function getDashboardTrends() {
  return {
    automationFunnel: [
      { step: 'Total Ingested', count: 12486, fill: '#3B82F6' },
      { step: 'AI Analyzed', count: 12140, fill: '#2563EB' },
      { step: 'Auto-Recommended', count: 9040, fill: '#8B5CF6' },
      { step: 'Human Approved', count: 2360, fill: '#10B981' },
      { step: 'Resolved', count: 11400, fill: '#0D9488' },
    ],
    volumeTrend: [
      { day: 'Aug 07', Processed: 410, Resolved: 390, Escalated: 15, PendingReview: 25 },
      { day: 'Aug 08', Processed: 440, Resolved: 410, Escalated: 12, PendingReview: 28 },
      { day: 'Aug 09', Processed: 480, Resolved: 450, Escalated: 18, PendingReview: 32 },
      { day: 'Aug 10', Processed: 510, Resolved: 480, Escalated: 20, PendingReview: 35 },
      { day: 'Aug 11', Processed: 530, Resolved: 500, Escalated: 14, PendingReview: 30 },
      { day: 'Aug 12', Processed: 560, Resolved: 520, Escalated: 22, PendingReview: 40 },
      { day: 'Aug 13', Processed: 590, Resolved: 550, Escalated: 19, PendingReview: 38 },
    ],
    riskDistribution: [
      { name: 'Low Risk', value: 58, color: '#10B981' },
      { name: 'Medium Risk', value: 24, color: '#3B82F6' },
      { name: 'High Risk', value: 14, color: '#F59E0B' },
      { name: 'Critical Risk', value: 4, color: '#EF4444' },
    ],
    businessImpact: {
      handlingTimeReductionPercent: 66.7,
      reviewWorkloadReductionPercent: 42.0,
      contactSuccessRatePercent: 78.4,
      promiseToPayRatePercent: 64.2,
      costSavedInr: '₹8,60,000',
    }
  };
}

// 2. Agents API
export function getAgents(): Agent[] {
  return loadInitial<Agent[]>(AGENTS_KEY, mockAgents);
}

export function getAgentById(id: string): Agent | undefined {
  const agents = getAgents();
  return agents.find((a) => a.id === id);
}

export function pauseAgent(agentId: string, actor: User): Agent {
  const agents = getAgents();
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) throw new Error('Agent not found');

  const previousStatus = agent.status;
  agent.status = 'Paused';
  saveState(AGENTS_KEY, agents);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'agent_paused',
    resourceType: 'Agent',
    resourceId: agent.id,
    severity: 'Warning',
    outcome: 'Success',
    details: `Paused agent "${agent.name}". Previous status: ${previousStatus}.`,
    previousState: previousStatus,
    newState: 'Paused'
  });

  trackEvent('agent_paused', actor.id, actor.role, { agentId: agent.id });

  return agent;
}

export function resumeAgent(agentId: string, actor: User): Agent {
  const agents = getAgents();
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) throw new Error('Agent not found');

  const previousStatus = agent.status;
  agent.status = 'Healthy';
  saveState(AGENTS_KEY, agents);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'agent_resumed',
    resourceType: 'Agent',
    resourceId: agent.id,
    severity: 'Info',
    outcome: 'Success',
    details: `Resumed agent "${agent.name}".`,
    previousState: previousStatus,
    newState: 'Healthy'
  });

  return agent;
}

// 3. Cases API
export function getCases(): LoanCase[] {
  return loadInitial<LoanCase[]>(CASES_KEY, mockCases);
}

export function getCaseById(id: string): LoanCase | undefined {
  const cases = getCases();
  return cases.find((c) => c.id === id);
}

export function approveCase(caseId: string, note: string, actor: User): LoanCase {
  const cases = getCases();
  const loanCase = cases.find((c) => c.id === caseId);
  if (!loanCase) throw new Error('Case not found');

  const prevStatus = loanCase.status;
  loanCase.status = 'Approved';
  loanCase.approvalStatus = 'Approved';
  loanCase.timeline.unshift({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: 'Recommendation Approved',
    description: note ? `Approved by ${actor.name}: ${note}` : `Approved by ${actor.name}`,
    actor: actor.name,
    type: 'human'
  });

  saveState(CASES_KEY, cases);

  // Update corresponding Approval Queue item if exists
  const approvals = loadInitial<Approval[]>(APPROVALS_KEY, mockApprovals);
  const appItem = approvals.find((a) => a.caseId === caseId);
  if (appItem) {
    appItem.status = 'Approved';
    appItem.reviewedBy = actor.name;
    appItem.reviewedAt = new Date().toISOString();
    appItem.reviewerNote = note;
    saveState(APPROVALS_KEY, approvals);
  }

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'approval_approved',
    resourceType: 'LoanCase',
    resourceId: caseId,
    severity: 'Info',
    outcome: 'Success',
    details: `Approved AI recommendation for case ${caseId}. Note: ${note || 'None'}.`,
    previousState: prevStatus,
    newState: 'Approved'
  });

  trackEvent('approval_approved', actor.id, actor.role, { caseId });

  return loanCase;
}

export function rejectCase(caseId: string, reason: string, actor: User): LoanCase {
  const cases = getCases();
  const loanCase = cases.find((c) => c.id === caseId);
  if (!loanCase) throw new Error('Case not found');

  const prevStatus = loanCase.status;
  loanCase.status = 'Rejected';
  loanCase.approvalStatus = 'Rejected';
  loanCase.timeline.unshift({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: 'Recommendation Rejected',
    description: `Rejected by ${actor.name}. Reason: ${reason}`,
    actor: actor.name,
    type: 'human'
  });

  saveState(CASES_KEY, cases);

  const approvals = loadInitial<Approval[]>(APPROVALS_KEY, mockApprovals);
  const appItem = approvals.find((a) => a.caseId === caseId);
  if (appItem) {
    appItem.status = 'Rejected';
    appItem.reviewedBy = actor.name;
    appItem.reviewedAt = new Date().toISOString();
    appItem.reviewerNote = reason;
    saveState(APPROVALS_KEY, approvals);
  }

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'approval_rejected',
    resourceType: 'LoanCase',
    resourceId: caseId,
    severity: 'Warning',
    outcome: 'Success',
    details: `Rejected AI recommendation for case ${caseId}. Reason: ${reason}.`,
    previousState: prevStatus,
    newState: 'Rejected'
  });

  trackEvent('approval_rejected', actor.id, actor.role, { caseId, reason });

  return loanCase;
}

export function escalateCase(caseId: string, reason: string, actor: User): LoanCase {
  const cases = getCases();
  const loanCase = cases.find((c) => c.id === caseId);
  if (!loanCase) throw new Error('Case not found');

  const prevStatus = loanCase.status;
  loanCase.status = 'Escalated';
  loanCase.approvalStatus = 'Escalated';
  loanCase.timeline.unshift({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: 'Case Escalated to Senior Review',
    description: `Escalated by ${actor.name}: ${reason}`,
    actor: actor.name,
    type: 'human'
  });

  saveState(CASES_KEY, cases);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'case_escalated',
    resourceType: 'LoanCase',
    resourceId: caseId,
    severity: 'Warning',
    outcome: 'Success',
    details: `Escalated case ${caseId} to senior operations panel. Reason: ${reason}`,
    previousState: prevStatus,
    newState: 'Escalated'
  });

  trackEvent('case_escalated', actor.id, actor.role, { caseId, reason });

  return loanCase;
}

export function editAndApproveCase(caseId: string, editedDraft: string, note: string, actor: User): LoanCase {
  const cases = getCases();
  const loanCase = cases.find((c) => c.id === caseId);
  if (!loanCase) throw new Error('Case not found');

  const prevDraft = loanCase.draftMessage;
  loanCase.draftMessage = editedDraft;
  loanCase.status = 'Approved';
  loanCase.approvalStatus = 'Edited & Approved';
  loanCase.timeline.unshift({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: 'Draft Edited & Approved',
    description: `Draft modified by ${actor.name}: ${note}`,
    actor: actor.name,
    type: 'human'
  });

  saveState(CASES_KEY, cases);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'draft_edited_and_approved',
    resourceType: 'LoanCase',
    resourceId: caseId,
    severity: 'Info',
    outcome: 'Success',
    details: `Edited customer message draft for case ${caseId}. Note: ${note}`,
    previousState: prevDraft,
    newState: editedDraft
  });

  trackEvent('approval_approved', actor.id, actor.role, { caseId, edited: true });

  return loanCase;
}

export function pauseCaseAutomation(caseId: string, actor: User): LoanCase {
  const cases = getCases();
  const loanCase = cases.find((c) => c.id === caseId);
  if (!loanCase) throw new Error('Case not found');

  loanCase.status = 'Automation Paused';
  loanCase.timeline.unshift({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: 'Automation Paused',
    description: `Automated processing paused by ${actor.name}.`,
    actor: actor.name,
    type: 'human'
  });

  saveState(CASES_KEY, cases);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'case_automation_paused',
    resourceType: 'LoanCase',
    resourceId: caseId,
    severity: 'Warning',
    outcome: 'Success',
    details: `Paused automated AI actions for case ${caseId}.`
  });

  return loanCase;
}

// 4. Approvals API
export function getApprovals(): Approval[] {
  return loadInitial<Approval[]>(APPROVALS_KEY, mockApprovals);
}

// 5. Policies API
export function getPolicies(): Policy[] {
  return loadInitial<Policy[]>(POLICIES_KEY, mockPolicies);
}

export function createPolicy(policyData: Partial<Policy>, actor: User): Policy {
  const policies = getPolicies();
  const newPolicy: Policy = {
    id: `POL-0${policies.length + 1}`,
    name: policyData.name || 'Untitled Policy',
    category: policyData.category || 'Human Approval',
    description: policyData.description || '',
    severity: policyData.severity || 'High',
    condition: policyData.condition || 'true',
    action: policyData.action || 'REQUIRE_HUMAN_REVIEW',
    escalationTarget: policyData.escalationTarget || 'Operations Manager',
    status: 'Active',
    version: 'v1.0',
    ownerId: actor.id,
    ownerName: actor.name,
    effectiveDate: new Date().toISOString().split('T')[0],
    reviewDate: '2026-12-31',
    appliesToAgents: policyData.appliesToAgents || ['Collections Conversation Agent'],
  };

  const updated = [newPolicy, ...policies];
  saveState(POLICIES_KEY, updated);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'policy_created',
    resourceType: 'Policy',
    resourceId: newPolicy.id,
    severity: 'Info',
    outcome: 'Success',
    details: `Created new compliance policy "${newPolicy.name}" (${newPolicy.id}).`
  });

  trackEvent('policy_created', actor.id, actor.role, { policyId: newPolicy.id });

  return newPolicy;
}

export function disablePolicy(policyId: string, actor: User): Policy {
  const policies = getPolicies();
  const policy = policies.find((p) => p.id === policyId);
  if (!policy) throw new Error('Policy not found');

  policy.status = 'Inactive';
  saveState(POLICIES_KEY, policies);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'policy_disabled',
    resourceType: 'Policy',
    resourceId: policyId,
    severity: 'Warning',
    outcome: 'Success',
    details: `Disabled policy "${policy.name}" (${policyId}).`
  });

  return policy;
}

// 6. Evaluations API
export function getEvaluationSuites(): EvaluationSuite[] {
  return mockEvaluationSuites;
}

export function runEvaluationSimulation(suiteId: string, agentId: string, actor: User): EvaluationRun {
  const suite = mockEvaluationSuites.find((s) => s.id === suiteId) || mockEvaluationSuites[0];
  const agent = mockAgents.find((a) => a.id === agentId) || mockAgents[0];

  const run: EvaluationRun = {
    id: `EV-RUN-${Math.floor(100 + Math.random() * 900)}`,
    suiteId: suite.id,
    suiteName: suite.name,
    agentId: agent.id,
    agentName: agent.name,
    version: agent.currentVersion,
    passRatePercent: 94,
    policyCompliancePercent: 98,
    evidenceGroundingPercent: 95,
    escalationAccuracyPercent: 96,
    costPerCaseInr: 2.35,
    status: 'Passed',
    completedAt: new Date().toISOString(),
    totalTests: suite.testCount,
    passedTests: Math.floor(suite.testCount * 0.94),
    failedTests: Math.ceil(suite.testCount * 0.06),
    results: suite.testCases
  };

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'evaluation_run_completed',
    resourceType: 'EvaluationRun',
    resourceId: run.id,
    severity: 'Info',
    outcome: 'Success',
    details: `Executed evaluation suite "${suite.name}" for agent ${agent.name} ${agent.currentVersion}. Result: 94% pass rate.`
  });

  trackEvent('evaluation_completed', actor.id, actor.role, { suiteId, agentId });

  return run;
}

// 7. Incidents API
export function getIncidents(): Incident[] {
  return loadInitial<Incident[]>(INCIDENTS_KEY, mockIncidents);
}

export function createIncident(data: Partial<Incident>, actor: User): Incident {
  const incidents = getIncidents();
  const newInc: Incident = {
    id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
    title: data.title || 'AI Safety Alert',
    type: data.type || 'Policy Violation',
    severity: data.severity || 'High',
    status: 'Open',
    agentId: data.agentId || 'agent-collections-conv',
    agentName: data.agentName || 'Collections Conversation Agent',
    caseId: data.caseId,
    ownerId: actor.id,
    ownerName: actor.name,
    rootCause: data.rootCause || 'Under investigation by governance committee.',
    correctiveAction: data.correctiveAction || 'Temporary human review threshold lowered to 100%.',
    createdAt: new Date().toISOString(),
    timeline: [
      { timestamp: new Date().toISOString(), actor: actor.name, note: 'Incident reported.' }
    ]
  };

  const updated = [newInc, ...incidents];
  saveState(INCIDENTS_KEY, updated);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'incident_created',
    resourceType: 'Incident',
    resourceId: newInc.id,
    severity: 'Critical',
    outcome: 'Success',
    details: `Created AI incident "${newInc.title}" (${newInc.id}). Severity: ${newInc.severity}.`
  });

  trackEvent('incident_created', actor.id, actor.role, { incidentId: newInc.id });

  return newInc;
}

export function executeContainmentAction(incidentId: string, actionType: string, actor: User): Incident {
  const incidents = getIncidents();
  const inc = incidents.find((i) => i.id === incidentId);
  if (!inc) throw new Error('Incident not found');

  inc.status = 'Contained';
  inc.timeline.unshift({
    timestamp: new Date().toISOString(),
    actor: actor.name,
    note: `Containment action executed: ${actionType}`
  });

  saveState(INCIDENTS_KEY, incidents);

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'incident_contained',
    resourceType: 'Incident',
    resourceId: incidentId,
    severity: 'Warning',
    outcome: 'Success',
    details: `Executed containment action "${actionType}" for incident ${incidentId}.`
  });

  return inc;
}

// 8. Reports API
export function generateReport(params: { title: string; type: string; dateRange: string }, actor: User): Report {
  const report: Report = {
    id: `RPT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: params.title,
    type: params.type,
    generatedAt: new Date().toISOString(),
    dateRange: params.dateRange,
    generatedBy: actor.name,
    summary: `Executive summary for ${params.title}. During ${params.dateRange}, the EdgeTrust Control Tower processed 12,486 synthetic NBFC collection accounts with a 72.4% automation rate and 97.8% policy compliance. Zero un-reviewed high-risk customer touchpoints occurred.`,
    kpis: [
      { label: 'Total Cases Analyzed', value: '12,486', change: '+18.4%' },
      { label: 'Automation Rate', value: '72.4%', change: '+8.7%' },
      { label: 'Human Review Rate', value: '18.9%', change: '-4.2%' },
      { label: 'Policy Compliance', value: '97.8%', change: '+1.6%' },
      { label: 'Cost per Case', value: '₹2.40', change: '-12.5%' },
      { label: 'Estimated Savings', value: '₹8.6L', change: '+22.0%' },
    ],
    recommendations: [
      'Maintain 100% human-in-the-loop review for accounts > 20 DPD with balance > ₹25,000.',
      'Upgrade Customer Support Summariser from v0.9.6 to v1.0.0 after completing quality benchmark.',
      'Review consent registry sync frequency to reduce false-positive contact suppression flags.'
    ]
  };

  logAuditEvent({
    actorId: actor.id,
    actorName: actor.name,
    role: actor.role,
    eventType: 'report_generated',
    resourceType: 'Report',
    resourceId: report.id,
    severity: 'Info',
    outcome: 'Success',
    details: `Generated report "${report.title}" for period ${params.dateRange}.`
  });

  trackEvent('report_generated', actor.id, actor.role, { reportId: report.id });

  return report;
}
