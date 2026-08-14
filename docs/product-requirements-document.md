# Product Requirements Document (PRD)

## Product Name
**EdgeTrust Control Tower**

## Subtitle
Human-in-the-loop AI governance and operations platform for NBFC collections.

---

## 1. Problem Statement
Non-Banking Financial Company (NBFC) operations teams lack a unified, secure, and auditable system to monitor, evaluate, and control AI-assisted collections workflows. Early AI pilots frequently risk regulatory non-compliance, hallucinated communications, unverified legal claims, and lack of human accountability.

## 2. Product Opportunity
Provide an enterprise SaaS Control Tower that acts as the control boundary between autonomous AI actions and human operational judgment. Enable NBFCs to transition safely from experimental AI pilots to controlled, auditable production.

## 3. Core Goals
1. **Human-in-the-Loop Boundaries**: Guarantee 100% human operator approval for sensitive actions (high risk, low confidence, vulnerable customer flags).
2. **Observability & Health**: Monitor agent trust scores, accuracy, latency, and cost per execution in real-time.
3. **Verifiable Evidence Grounding**: Provide auditable facts and active policy compliance checks for every AI recommendation.
4. **Agent Version Evaluation**: Test agent release candidates against safety, quality, and prompt injection suites before deployment.
5. **Immutable Auditability**: Maintain append-only audit trails with correlation IDs, timestamps, and state diffs for regulatory readiness.

## 4. Non-Goals
- Credit underwriting or loan approval/rejection decisions.
- Automated legal claims or coercive collections outreach.
- Real personal data processing (Synthetic demo environment only).
- Regulatory certification or legal advice.

## 5. North Star Metric
*Percentage of AI-assisted collection workflows resolved cleanly with zero policy violations and complete human accountability.*

## 6. Functional Requirements
- **Agent Registry**: Register, pause, resume, and version control AI agents.
- **Operations Cases Workspace**: 3-Column workbench with masked PII customer profiles.
- **Approval Queue**: Prioritized queue for human review of high-risk touchpoints.
- **Evaluation Studio**: Live simulator & side-by-side version benchmark comparison.
- **Compliance Policy Engine**: Configurable rules (no threats, consent required, low-confidence escalation).
- **Immutable Audit Trail**: Filterable event log with CSV/PDF export.
- **AI Incidents Management**: Lifecycle tracking and emergency containment controls.
- **Executive Reports & ROI**: Automated KPI summary generation and cost-savings calculator.
- **Role-Based Access Control (RBAC)**: Support for 7 distinct enterprise roles.

## 7. Non-Functional Requirements
- **Security & Privacy**: Masked PII (`+91 ****** 4821`), synthetic data sandbox.
- **Performance**: Sub-100ms UI response time with deterministic AI simulation.
- **Accessibility**: High contrast, visible focus states, ARIA labels, semantic markup.
- **Explainability**: Auditable decision rationale without exposing raw private chain-of-thought.
