export type Role =
  | 'CEO'
  | 'COO'
  | 'Operations Manager'
  | 'Compliance Manager'
  | 'AI Product Manager'
  | 'Collection Agent'
  | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  status: 'active' | 'inactive';
  lastActiveAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  region: string;
  plan: string;
  createdAt: string;
}

export type RiskTier = 'Low' | 'Medium' | 'High' | 'Critical';
export type AgentStatus = 'Healthy' | 'Degraded' | 'Paused' | 'Under Evaluation' | 'Draft';

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  businessFunction: string;
  ownerId: string;
  ownerName: string;
  status: AgentStatus;
  riskTier: RiskTier;
  currentVersion: string;
  modelProvider: string;
  tools: string[];
  dataSources: string[];
  trustScore: number;
  accuracy: number;
  latencyMs: number;
  costPerRunInr: number;
  automationRatePercent: number;
  lastEvaluatedAt: string;
  dataSensitivity: string;
  knownLimitations?: string[];
  changelog?: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  agentName: string;
  caseId: string;
  customerName: string;
  version: string;
  startedAt: string;
  completedAt: string;
  status: 'completed' | 'failed' | 'flagged';
  confidence: number;
  recommendation: string;
  evidence: string[];
  policyResults: PolicyCheckResult[];
  requiresApproval: boolean;
  error?: string;
  costInr: number;
}

export interface Customer {
  id: string;
  maskedName: string;
  maskedPhone: string;
  maskedAccount: string;
  maskedPan: string;
  segment: string;
  consentStatus: 'Consent Granted' | 'Expired' | 'Opted Out';
  vulnerabilityFlag: boolean;
  vulnerabilityReason?: string;
  createdAt: string;
  repaymentScore: number;
}

export type CaseStatus =
  | 'Pending AI Analysis'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Escalated'
  | 'Automation Paused'
  | 'Resolved';

export type ApprovalStatus = 'Pending Review' | 'Approved' | 'Edited & Approved' | 'Rejected' | 'Escalated';

export interface LoanCase {
  id: string;
  customerId: string;
  maskedCustomerName: string;
  maskedPhone: string;
  maskedAccount: string;
  loanProduct: 'Personal Loan' | 'Two-Wheeler Loan' | 'MSME Business Loan' | 'Microfinance';
  outstandingAmountInr: number;
  daysPastDue: number;
  riskBand: RiskTier;
  status: CaseStatus;
  assignedTo: string;
  recommendedAction: string;
  approvalStatus: ApprovalStatus;
  confidence: number;
  lastContactAt: string;
  createdAt: string;
  draftMessage: string;
  evidence: string[];
  policyChecks: PolicyCheckResult[];
  vulnerabilityFlag: boolean;
  vulnerabilityReason?: string;
  consentStatus: 'Consent Granted' | 'Expired' | 'Opted Out';
  timeline: CaseTimelineEvent[];
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  type: 'system' | 'ai' | 'human' | 'policy';
}

export interface PolicyCheckResult {
  policyId: string;
  policyName: string;
  passed: boolean;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  details: string;
}

export interface Approval {
  id: string;
  caseId: string;
  runId: string;
  requestedAt: string;
  requestedReason: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNote?: string;
  proposedAction: string;
  aiDraft: string;
  riskLevel: RiskTier;
  confidence: number;
  waitingTimeHours: number;
  evidence: string[];
  policyChecks: PolicyCheckResult[];
}

export type PolicySeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type PolicyCategory =
  | 'Communication Safety'
  | 'Consent & Contact Preferences'
  | 'Human Approval'
  | 'Data Access'
  | 'Sensitive Attributes'
  | 'Escalation'
  | 'Rate Limits'
  | 'Audit Retention'
  | 'Prompt Injection'
  | 'Third-party Model Usage';

export interface Policy {
  id: string;
  name: string;
  category: PolicyCategory;
  description: string;
  severity: PolicySeverity;
  condition: string;
  action: string;
  escalationTarget: string;
  status: 'Active' | 'Inactive' | 'Draft';
  version: string;
  ownerId: string;
  ownerName: string;
  effectiveDate: string;
  reviewDate: string;
  appliesToAgents: string[];
  history?: {
    version: string;
    updatedAt: string;
    updatedBy: string;
    changeNote: string;
  }[];
}

export interface TestCase {
  id: string;
  title: string;
  inputScenario: string;
  expectedAction: string;
  expectedRiskBand: RiskTier;
  expectedEscalation: boolean;
  policyConstraints: string[];
  referenceEvidence: string;
  result?: 'Passed' | 'Failed' | 'Warning' | 'Needs Review';
  failureReason?: string;
}

export interface EvaluationSuite {
  id: string;
  name: string;
  description: string;
  category: string;
  testCount: number;
  lastRunAt: string;
  testCases: TestCase[];
}

export interface EvaluationRun {
  id: string;
  suiteId: string;
  suiteName: string;
  agentId: string;
  agentName: string;
  version: string;
  passRatePercent: number;
  policyCompliancePercent: number;
  evidenceGroundingPercent: number;
  escalationAccuracyPercent: number;
  costPerCaseInr: number;
  status: 'Passed' | 'Failed' | 'Warning' | 'Needs Review';
  completedAt: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestCase[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: Role;
  eventType: string;
  resourceType: string;
  resourceId: string;
  severity: 'Info' | 'Warning' | 'Critical';
  outcome: 'Success' | 'Failure' | 'Pending';
  correlationId: string;
  details: string;
  previousState?: string;
  newState?: string;
}

export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Open' | 'Investigating' | 'Contained' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  type:
    | 'Policy Violation'
    | 'Hallucinated Recommendation'
    | 'Data Access Violation'
    | 'Prompt Injection'
    | 'Model Drift'
    | 'Bias Signal'
    | 'Excessive Latency'
    | 'Tool Failure'
    | 'Customer Complaint'
    | 'Unexpected Automation';
  severity: IncidentSeverity;
  status: IncidentStatus;
  agentId: string;
  agentName: string;
  caseId?: string;
  ownerId: string;
  ownerName: string;
  rootCause: string;
  correctiveAction: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  timeline: {
    timestamp: string;
    actor: string;
    note: string;
  }[];
}

export interface Report {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  dateRange: string;
  generatedBy: string;
  summary: string;
  kpis: {
    label: string;
    value: string;
    change: string;
  }[];
  recommendations: string[];
}

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  timestamp: string;
  userId: string;
  role: Role;
  metadata?: Record<string, any>;
}
