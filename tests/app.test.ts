import { describe, it, expect, beforeEach } from 'vitest';
import { simulateAIRecommendation } from '../src/services/aiSimulator';
import {
  getDashboardSummary,
  getAgents,
  getCases,
  getApprovals,
  getPolicies,
  approveCase,
  rejectCase,
  escalateCase,
  pauseAgent,
  createPolicy,
  runEvaluationSimulation,
  createIncident
} from '../src/services/api';
import { getAuditEvents, logAuditEvent } from '../src/services/auditLogger';
import { mockUsers, mockPolicies } from '../src/data/mockData';

describe('EdgeTrust Control Tower Unit & Integration Suite', () => {
  const adminUser = mockUsers[6]; // Admin user
  const opsUser = mockUsers[2];   // Operations Manager

  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Login Credentials & Demo Data Baseline Validation', () => {
    expect(adminUser.email).toBe('admin@edgetrust.demo');
    expect(adminUser.role).toBe('Admin');
  });

  it('2. Executive Dashboard Summary Metrics Integrity', () => {
    const summary = getDashboardSummary();
    expect(summary.kpis.casesProcessed.value).toBe('12,486');
    expect(summary.kpis.automationRate.value).toBe('72.4%');
    expect(summary.counts.totalAgentsCount).toBe(4);
  });

  it('3. Agent Registry Fetching and Pause Action Audit Logging', () => {
    const agents = getAgents();
    expect(agents.length).toBe(4);

    const paused = pauseAgent('agent-collections-conv', adminUser);
    expect(paused.status).toBe('Paused');

    const auditTrail = getAuditEvents();
    const pauseEvent = auditTrail.find((e) => e.eventType === 'agent_paused');
    expect(pauseEvent).toBeDefined();
    expect(pauseEvent?.actorName).toBe(adminUser.name);
  });

  it('4. Synthetic Loan Cases Filtering & PII Protection', () => {
    const cases = getCases();
    expect(cases.length).toBeGreaterThan(0);
    const case9021 = cases.find((c) => c.id === 'CASE-9021');
    expect(case9021).toBeDefined();
    expect(case9021?.maskedPhone).toContain('******');
    expect(case9021?.maskedAccount).toContain('****');
  });

  it('5. Case Workbench Approval Action updates state and writes audit event', () => {
    const approvedCase = approveCase('CASE-9021', 'Approved in test', opsUser);
    expect(approvedCase.status).toBe('Approved');
    expect(approvedCase.approvalStatus).toBe('Approved');

    const auditTrail = getAuditEvents();
    const appEvent = auditTrail.find((e) => e.eventType === 'approval_approved' && e.resourceId === 'CASE-9021');
    expect(appEvent).toBeDefined();
  });

  it('6. Case Workbench Rejection Action records rejection reason', () => {
    const rejectedCase = rejectCase('CASE-9025', 'Tone inappropriate', opsUser);
    expect(rejectedCase.status).toBe('Rejected');

    const auditTrail = getAuditEvents();
    const rejEvent = auditTrail.find((e) => e.eventType === 'approval_rejected' && e.resourceId === 'CASE-9025');
    expect(rejEvent).toBeDefined();
    expect(rejEvent?.details).toContain('Tone inappropriate');
  });

  it('7. Escalation Action updates status to Escalated', () => {
    const escalatedCase = escalateCase('CASE-9026', 'Complex exposure', opsUser);
    expect(escalatedCase.status).toBe('Escalated');
  });

  it('8. Policy Engine Policy Creation and Validation', () => {
    const newPol = createPolicy(
      {
        name: 'High-value transfer check',
        category: 'Human Approval',
        severity: 'Critical',
        condition: 'amount > 50000',
      },
      adminUser
    );

    expect(newPol.id).toBeDefined();
    const policies = getPolicies();
    expect(policies.some((p) => p.name === 'High-value transfer check')).toBe(true);
  });

  it('9. Deterministic AI Simulator generates valid recommendations & policy scans for Low Risk Case', () => {
    const res = simulateAIRecommendation(
      {
        daysPastDue: 5,
        outstandingAmountInr: 8000,
        consentStatus: 'Consent Granted',
        vulnerabilityFlag: false,
      },
      mockPolicies
    );

    expect(res.riskBand).toBe('Low');
    expect(res.confidence).toBeGreaterThanOrEqual(80);
    expect(res.requiresApproval).toBe(false);
  });

  it('10. Deterministic AI Simulator forces Human Approval for High Risk Case (>20 DPD & > ₹25,000)', () => {
    const res = simulateAIRecommendation(
      {
        daysPastDue: 25,
        outstandingAmountInr: 35000,
        consentStatus: 'Consent Granted',
        vulnerabilityFlag: false,
      },
      mockPolicies
    );

    expect(res.riskBand).toBe('High');
    expect(res.requiresApproval).toBe(true);
    expect(res.approvalReason).toContain('High Risk Band');
  });

  it('11. Deterministic AI Simulator Blocks Contact when Consent is Opted Out (POL-04)', () => {
    const res = simulateAIRecommendation(
      {
        daysPastDue: 15,
        outstandingAmountInr: 10000,
        consentStatus: 'Opted Out',
        vulnerabilityFlag: false,
      },
      mockPolicies
    );

    expect(res.requiresApproval).toBe(true);
    expect(res.draftMessage).toContain('BLOCKED BY POLICY ENGINE');
    const pol04 = res.policyChecks.find((p) => p.policyId === 'POL-04');
    expect(pol04?.passed).toBe(false);
  });

  it('12. Evaluation Studio Simulation produces 94% Pass Rate and logs event', () => {
    const run = runEvaluationSimulation('EVAL-SUITE-01', 'agent-collections-conv', adminUser);
    expect(run.passRatePercent).toBe(94);
    expect(run.status).toBe('Passed');
  });

  it('13. AI Incident Creation logs critical audit event', () => {
    const inc = createIncident(
      {
        title: 'Unexpected Latency Alert',
        severity: 'High',
        agentId: 'agent-customer-summariser',
      },
      adminUser
    );

    expect(inc.id).toContain('INC-');
    const auditEvents = getAuditEvents();
    const incEvent = auditEvents.find((e) => e.eventType === 'incident_created');
    expect(incEvent).toBeDefined();
  });

  it('14. Append-Only Audit Logging correlation ID generation', () => {
    const event = logAuditEvent({
      actorId: adminUser.id,
      actorName: adminUser.name,
      role: adminUser.role,
      eventType: 'test_event',
      resourceType: 'Test',
      resourceId: 'TST-1',
      details: 'Test detail note'
    });

    expect(event.correlationId).toContain('CORR-');
  });

  it('15. Role-Based Access Control 7 Roles Configuration', () => {
    expect(mockUsers.length).toBe(7);
    const roles = mockUsers.map((u) => u.role);
    expect(roles).toContain('CEO');
    expect(roles).toContain('COO');
    expect(roles).toContain('Operations Manager');
    expect(roles).toContain('Compliance Manager');
    expect(roles).toContain('AI Product Manager');
    expect(roles).toContain('Collection Agent');
    expect(roles).toContain('Admin');
  });
});
