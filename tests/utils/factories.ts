import {
  User,
  Role,
  LoanCase,
  Agent,
  Approval,
  Policy,
  Incident,
  AuditEvent,
  RiskTier,
  CaseStatus,
  ApprovalStatus,
  AgentStatus
} from '../../src/types';

/**
 * Factory for creating synthetic User objects for tests
 */
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-test-1',
    name: 'Test Operator',
    email: 'operator@edgetrust.demo',
    role: 'Operations Manager' as Role,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    department: 'Collections Operations',
    status: 'active',
    lastActiveAt: '2026-08-14T09:00:00Z',
    ...overrides,
  };
}

/**
 * Factory for creating synthetic LoanCase objects for tests
 */
export function createLoanCase(overrides: Partial<LoanCase> = {}): LoanCase {
  return {
    id: 'CASE-TEST-101',
    customerId: 'CUST-TEST-001',
    maskedCustomerName: 'Rajesh K****',
    maskedPhone: '+91 ****** 4821',
    maskedAccount: '**** 8392',
    loanProduct: 'Personal Loan',
    outstandingAmountInr: 34500,
    daysPastDue: 21,
    riskBand: 'High' as RiskTier,
    status: 'Pending Approval' as CaseStatus,
    assignedTo: 'Vikram Sethi (Ops Lead)',
    recommendedAction: 'Propose structured 3-month EMI extension with waived late fees.',
    approvalStatus: 'Pending Review' as ApprovalStatus,
    confidence: 88,
    lastContactAt: '2026-08-10T14:30:00Z',
    createdAt: '2026-08-12T08:00:00Z',
    draftMessage: 'Dear Rajesh, we noticed your repayment is overdue. We can offer a 3-month payment extension.',
    evidence: [
      'Customer has 8 on-time EMI repayments out of past 10 billing cycles.',
      'Active UPI autopay mandate setup on registered HDFC account.',
      'No previous default or hardship flag registered in loan tenure.'
    ],
    policyChecks: [
      {
        policyId: 'POL-01',
        policyName: 'High-Risk & High-Value Human Approval',
        passed: true,
        severity: 'Critical',
        details: 'Case exceeds ₹25,000 balance threshold (₹34,500) and requires human review.'
      },
      {
        policyId: 'POL-02',
        policyName: 'Strict Zero-Harassment Communication Rule',
        passed: true,
        severity: 'Critical',
        details: 'Message scan verified zero coercive, abusive, or statutory threat keywords.'
      }
    ],
    vulnerabilityFlag: false,
    consentStatus: 'Consent Granted',
    timeline: [
      {
        id: 'TL-1',
        timestamp: '2026-08-12T08:00:00Z',
        title: 'Case Ingested',
        description: 'Account flagged 21 DPD during morning portfolio scan.',
        actor: 'Portfolio Ingestion Engine',
        type: 'system'
      },
      {
        id: 'TL-2',
        timestamp: '2026-08-12T08:01:00Z',
        title: 'AI Recommendation Generated',
        description: 'Collections Conversation Agent generated next best action.',
        actor: 'Collections Agent v2.4.1',
        type: 'ai'
      }
    ],
    ...overrides,
  };
}

/**
 * Factory for creating synthetic Agent objects for tests
 */
export function createAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: 'agent-test-conv',
    name: 'Test Collections Agent',
    description: 'Autonomous communication assistant for customer repayment outreach.',
    type: 'Conversational LLM Agent',
    businessFunction: 'Delinquency Contact Strategy',
    ownerId: 'user-aipm',
    ownerName: 'Priya Sharma (AI PM)',
    status: 'Healthy' as AgentStatus,
    riskTier: 'High' as RiskTier,
    currentVersion: 'v2.4.1',
    modelProvider: 'Anthropic Claude 3.5 Sonnet / Edge Simulated Sandbox',
    tools: ['Loan LMS Lookup', 'Customer Communication Gateway (SMS/WhatsApp)'],
    dataSources: ['Core Banking Loan Ledger', 'Customer Consent Preference Store'],
    trustScore: 94,
    accuracy: 96.2,
    latencyMs: 380,
    costPerRunInr: 2.40,
    automationRatePercent: 78.4,
    lastEvaluatedAt: '2026-08-12T09:00:00Z',
    dataSensitivity: 'High (Customer contact info & repayment history)',
    ...overrides,
  };
}

/**
 * Factory for creating synthetic Approval objects for tests
 */
export function createApproval(overrides: Partial<Approval> = {}): Approval {
  return {
    id: 'APP-TEST-001',
    caseId: 'CASE-TEST-101',
    runId: 'RUN-TEST-99',
    requestedAt: '2026-08-12T08:01:00Z',
    requestedReason: 'Policy POL-01 triggered: Loan balance > ₹25,000 with >20 DPD requires human approval.',
    priority: 'High',
    assignedTo: 'Vikram Sethi (Ops Lead)',
    status: 'Pending Review' as ApprovalStatus,
    proposedAction: 'Offer 3-Month Restructured Installment Plan',
    aiDraft: 'Dear Customer, we have a flexible 3-month payment restructuring option available.',
    riskLevel: 'High' as RiskTier,
    confidence: 88,
    waitingTimeHours: 6.5,
    evidence: ['Consistent prior repayment record (8/10 cycles)'],
    policyChecks: [
      {
        policyId: 'POL-01',
        policyName: 'High-Risk & High-Value Human Approval',
        passed: true,
        severity: 'Critical',
        details: 'Routed to human approval queue.'
      }
    ],
    ...overrides,
  };
}

/**
 * Factory for creating synthetic Policy objects for tests
 */
export function createPolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    id: 'POL-TEST-01',
    name: 'High-Value Transfer Check',
    category: 'Human Approval',
    description: 'Mandates human approval for collection commitments exceeding threshold.',
    severity: 'Critical',
    condition: 'outstandingAmountInr > 25000 && daysPastDue > 20',
    action: 'REQUIRE_HUMAN_APPROVAL',
    escalationTarget: 'Operations Manager Queue',
    status: 'Active',
    version: 'v1.0.0',
    ownerId: 'user-comp',
    ownerName: 'Ananya Roy (Compliance Lead)',
    effectiveDate: '2026-08-01',
    reviewDate: '2026-11-01',
    appliesToAgents: ['agent-collections-conv'],
    ...overrides,
  };
}

/**
 * Factory for creating synthetic Incident objects for tests
 */
export function createIncident(overrides: Partial<Incident> = {}): Incident {
  return {
    id: 'INC-TEST-01',
    title: 'Model Provider Latency Spike',
    type: 'Model Drift',
    severity: 'High',
    status: 'Open',
    agentId: 'agent-test-conv',
    agentName: 'Test Collections Agent',
    ownerId: 'user-aipm',
    ownerName: 'Priya Sharma (AI PM)',
    rootCause: 'Underlying simulated endpoint experienced elevated response delay.',
    correctiveAction: 'Increase human review sampling rate to 50%.',
    createdAt: '2026-08-14T10:00:00Z',
    timeline: [
      {
        timestamp: '2026-08-14T10:00:00Z',
        actor: 'Telemetry Guard',
        note: 'Incident detected and flagged.'
      }
    ],
    ...overrides,
  };
}

/**
 * Factory for creating synthetic AuditEvent objects for tests
 */
export function createAuditEvent(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    id: 'AUDIT-TEST-1',
    timestamp: '2026-08-14T10:00:00Z',
    actorId: 'user-admin',
    actorName: 'Deepak Verma',
    role: 'Admin',
    eventType: 'approval_approved',
    resourceType: 'Case',
    resourceId: 'CASE-TEST-101',
    severity: 'Info',
    outcome: 'Success',
    correlationId: 'CORR-TEST-999',
    details: 'Approved case recommendation via case workbench.',
    previousState: 'Pending Review',
    newState: 'Approved',
    ...overrides,
  };
}
