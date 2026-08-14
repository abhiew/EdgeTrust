import { LoanCase, PolicyCheckResult, Policy } from '../types';
import { mockPolicies } from '../data/mockData';

export interface AISimulationResult {
  confidence: number;
  riskBand: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedAction: string;
  draftMessage: string;
  requiresApproval: boolean;
  approvalReason?: string;
  evidence: string[];
  policyChecks: PolicyCheckResult[];
  explanation: {
    decisionSummary: string;
    evidenceUsed: string[];
    policyChecksPassed: boolean;
    confidenceFactors: string[];
    limitations: string[];
  };
}

export function simulateAIRecommendation(
  loanCase: Partial<LoanCase>,
  activePolicies: Policy[] = mockPolicies
): AISimulationResult {
  const dpd = loanCase.daysPastDue ?? 15;
  const amount = loanCase.outstandingAmountInr ?? 10000;
  const consentStatus = loanCase.consentStatus ?? 'Consent Granted';
  const isVulnerable = loanCase.vulnerabilityFlag ?? false;
  const draftInput = loanCase.draftMessage ?? '';

  // 1. Policy Evaluations
  const policyResults: PolicyCheckResult[] = [];

  // Check POL-04 Consent
  const hasConsent = consentStatus === 'Consent Granted';
  policyResults.push({
    policyId: 'POL-04',
    policyName: 'Consent required for digital contact',
    passed: hasConsent,
    severity: 'Critical',
    details: hasConsent
      ? 'Active customer digital consent verified in registry.'
      : `Consent status "${consentStatus}". Outbound digital outreach prohibited.`
  });

  // Check POL-02 Threatening Language
  const threatKeywords = ['police', 'court', 'arrest', 'jail', 'seize', 'repossess', 'sue', 'legal action'];
  const hasThreat = threatKeywords.some((kw) => draftInput.toLowerCase().includes(kw));
  policyResults.push({
    policyId: 'POL-02',
    policyName: 'No threatening language',
    passed: !hasThreat,
    severity: 'Critical',
    details: hasThreat
      ? 'PROHIBITED KEYWORD DETECTED: Message contains coercive or threat terminology.'
      : 'Passed safety scan. No threat or aggressive legal language detected.'
  });

  // Determine Risk Band
  let computedRiskBand: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (dpd > 40 || amount > 150000 || isVulnerable) {
    computedRiskBand = 'Critical';
  } else if (dpd > 20 || amount > 25000) {
    computedRiskBand = 'High';
  } else if (dpd > 10 || amount > 15000) {
    computedRiskBand = 'Medium';
  }

  // Check POL-01 High-risk approval
  const isHighRiskOrAbove = computedRiskBand === 'High' || computedRiskBand === 'Critical';
  policyResults.push({
    policyId: 'POL-01',
    policyName: 'High-risk communication approval',
    passed: true, // Passed check means routing rule evaluated correctly
    severity: 'Critical',
    details: isHighRiskOrAbove
      ? `Account categorized as ${computedRiskBand} Risk. Routed to human operations queue per Policy POL-01.`
      : 'Low/Medium risk account. Eligible for automated delivery after policy verification.'
  });

  // Compute Confidence
  let confidence = 94;
  if (!hasConsent) confidence = 99; // Very confident that it must be blocked!
  else if (hasThreat) confidence = 98;
  else if (isVulnerable) confidence = 91;
  else if (dpd > 30) confidence = 84;
  else if (amount > 100000) confidence = 76;

  // Check POL-03 Low confidence
  const isLowConfidence = confidence < 80;
  policyResults.push({
    policyId: 'POL-03',
    policyName: 'Low-confidence escalation',
    passed: !isLowConfidence,
    severity: 'High',
    details: isLowConfidence
      ? `Confidence ${confidence}% is below 80% automated threshold. Escalating.`
      : `Confidence score ${confidence}% meets automated threshold.`
  });

  // Determine Human Approval Requirement
  const requiresApproval = !hasConsent || hasThreat || isHighRiskOrAbove || isLowConfidence || isVulnerable;

  let approvalReason = '';
  if (!hasConsent) approvalReason = 'Digital contact consent missing or opted out.';
  else if (hasThreat) approvalReason = 'Policy check failed: Threatening language detected in draft.';
  else if (isVulnerable) approvalReason = 'Vulnerable customer protocol triggered (Hospitalization/Emergency).';
  else if (isHighRiskOrAbove) approvalReason = `${computedRiskBand} Risk Band account (DPD: ${dpd}, Balance: ₹${amount.toLocaleString()}).`;
  else if (isLowConfidence) approvalReason = `Low AI Confidence (${confidence}% < 80% threshold).`;

  // Evidence List
  const evidence: string[] = [
    `Account is ${dpd} days past due with balance of ₹${amount.toLocaleString()}.`,
    `Consent status verified: ${consentStatus}.`,
    `Risk Tier assigned: ${computedRiskBand}.`,
    `Policy compliance score: ${policyResults.filter((p) => p.passed).length}/${policyResults.length} rules passed.`
  ];
  if (isVulnerable) {
    evidence.push('Vulnerability indicator active on customer profile.');
  }

  // Recommended Action & Draft Message
  let recommendedAction = '';
  let finalDraft = '';

  if (!hasConsent) {
    recommendedAction = 'DO NOT CONTACT via digital channels. Suppress automated outreach and flag for compliance audit.';
    finalDraft = '[BLOCKED BY POLICY ENGINE] Customer has opted out of digital communications.';
  } else if (hasThreat) {
    recommendedAction = 'REJECT DRAFT immediately. Re-generate communication using respectful tone guidelines.';
    finalDraft = '[BLOCKED BY POLICY ENGINE] Draft contains prohibited aggressive keywords.';
  } else if (isVulnerable) {
    recommendedAction = 'Route to Specialized Vulnerable Customer Care Team with extended 14-day grace period.';
    finalDraft = `Dear Customer, we hope you are well. We are reaching out regarding your loan account (ref ${loanCase.maskedAccount ?? '****'}). Please contact your care coordinator whenever convenient to discuss flexible repayment options.`;
  } else if (computedRiskBand === 'Critical') {
    recommendedAction = 'Escalate to Senior Relationship Manager for personalized consultation call.';
    finalDraft = `Dear Customer, regarding your loan account (ref ${loanCase.maskedAccount ?? '****'}), your dedicated account manager would like to schedule a brief call to discuss customized restructuring options.`;
  } else {
    recommendedAction = requiresApproval
      ? 'Send digital payment reminder via SMS/WhatsApp after operations review approval.'
      : 'Send automated digital courtesy reminder via WhatsApp/SMS.';
    finalDraft = `Dear Customer, your loan account balance of ₹${amount.toLocaleString()} is currently past due by ${dpd} days. Please review your account or tap to complete payment securely online.`;
  }

  return {
    confidence,
    riskBand: computedRiskBand,
    recommendedAction,
    draftMessage: finalDraft,
    requiresApproval,
    approvalReason,
    evidence,
    policyChecks: policyResults,
    explanation: {
      decisionSummary: `Recommend ${requiresApproval ? 'Human Review & Approval' : 'Automated Dispatch'}: ${recommendedAction}`,
      evidenceUsed: evidence,
      policyChecksPassed: policyResults.every((p) => p.passed),
      confidenceFactors: [
        `Historical repayment consistency weight: 35%`,
        `Days past due (${dpd} DPD) severity weight: 40%`,
        `Policy compliance safety score: 25%`
      ],
      limitations: [
        'Deterministic simulation for demonstration purposes.',
        'Does not perform credit score underwriting or legal decisioning.'
      ]
    }
  };
}
