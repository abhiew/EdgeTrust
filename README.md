# EdgeTrust Control Tower

> **Subtitle**: Human-in-the-loop AI governance and operations platform for NBFC collections.  
> **Disclaimer**: EdgeTrust is an original, independent portfolio concept inspired by enterprise AI governance practices. It uses synthetic demo data and does not copy TuringEdge trademarks, code, or proprietary assets. It is not a credit decisioning, collections, legal or regulatory compliance system.

---

## 1. Product Overview & Vision

**EdgeTrust Control Tower** is a SaaS platform designed for Non-Banking Financial Company (NBFC) operations teams to register, monitor, evaluate, and govern AI agents assisting in loan collection workflows.

EdgeTrust establishes an auditable control boundary between autonomous AI actions and human operational judgment:
- **100% Policy-enforced human approval boundary** for sensitive actions (high risk, low confidence, vulnerable customer flags).
- **Verifiable evidence grounding** for every AI decision.
- **Append-only audit trail** with correlation IDs and timestamped state diffs.
- **Agent version evaluation studio** to test release candidates before production deployment.

---

## 2. Target Users & Role-Based Access Control (RBAC)

EdgeTrust supports **7 demo roles** with a live interactive Role Switcher in the top navigation bar:

1. **CEO**: Strategic ROI, automation payback, overall agent trust scores.
2. **COO**: Operational efficiency, approval queue workload, handling time reduction.
3. **Operations Manager**: Reviewing, editing, approving, rejecting, and escalating collection recommendations.
4. **Compliance Manager**: Setting safety policies, auditing evidence logs, executing incident containment.
5. **AI Product Manager**: Evaluating agent release versions against test suites and comparing benchmarks.
6. **Collection Agent**: Handling assigned cases with AI-assisted message drafting.
7. **Admin**: Platform settings, user management, and product usage analytics.

---

## 3. Key Application Routes (17 Routes)

| Route | Description |
| :--- | :--- |
| `/login` | Demo login page with 1-click login, security notes, and onboarding checklist |
| `/dashboard` | Executive overview dashboard with KPI cards, Recharts funnel, and alerts |
| `/agents` | Agent Registry with status indicators, trust scores, and risk tiers |
| `/agents/:agentId` | Agent Workbench with 7 tabs (Overview, Runs, Evaluations, Policies, Versions, Access, Incidents) |
| `/agents/:agentId/runs` | Execution run traces and log drawers |
| `/cases` | Operations workspace with masked PII synthetic loan cases and filters |
| `/cases/:caseId` | 3-Column Case Workbench (Profile & History, AI Recommendation & Evidence, Human Actions) |
| `/approvals` | Human-in-the-loop Approval Queue with SLA indicators and review drawer |
| `/evaluations` | Evaluation Studio with 6 test suites and live progress execution simulator |
| `/evaluations/:evaluationId` | Version Comparison Workbench comparing Agent v2.3.0 vs v2.4.1 side-by-side |
| `/policies` | Policy Engine with 6 financial compliance guardrails and policy editor modal |
| `/policies/:policyId` | Policy Rule DSL details and version audit history |
| `/audit` | Immutable append-only audit trail with CSV export and PDF summary |
| `/incidents` | AI Incidents management and emergency containment controls |
| `/reports` | Executive and compliance audit report builder with CSV download |
| `/settings` | Workspace configuration, RBAC permissions matrix, and product analytics |
| `/help` | Interactive 3-minute reviewer demo script, personas, and safety guardrails |

---

## 4. Primary Demo Scenario

A customer has an overdue loan account. The AI Collections Agent:
1. Retrieves the synthetic customer profile (masked phone, masked account).
2. Reads repayment history (paid on time 8 of past 10 cycles).
3. Checks overdue balance (₹34,500) and days past due (21 DPD).
4. Classifies case as **High Risk Tier**.
5. Evaluates active policies (**POL-01**, **POL-02**, **POL-04**).
6. Flags case for **Mandatory Human Operations Review** (88% confidence).
7. Drafts a respectful, compliant customer reminder.
8. Logs all verifiable evidence, policy checks, and timestamps to the **Append-Only Audit Trail**.

---

## 5. Technology Stack & Architecture

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & Aesthetics**: Vanilla CSS Design System + Tailwind CSS, Dark Navy Shell (`#0F172A`), Electric Blue Accent (`#2563EB`), Emerald (`#10B981`), Amber (`#F59E0B`), Red (`#EF4444`), AI Purple (`#8B5CF6`)
- **Icons & Visualization**: Lucide React, Recharts (AreaChart, BarChart, PieChart)
- **State & Service Layer**: Centralized mock RESTful service layer (`src/services/api.ts`), LocalStorage persistence, Deterministic AI Simulator (`src/services/aiSimulator.ts`), Audit Logger (`src/services/auditLogger.ts`), Analytics Bus (`src/services/analytics.ts`)
- **Testing**: Vitest (`15/15 tests passing`)

---

## 6. Quick Start & Local Setup Instructions

### Prerequisites
- Node.js v20+ and npm v10+

### Installation & Launch
```bash
# 1. Clone or navigate to directory
cd d:/EdgeTrust

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 7. Demo Credentials

- **Email**: `admin@edgetrust.demo`
- **Password**: `Demo@12345`
- Or simply click **"Use Demo Workspace (1-Click Login)"** on the login page.

---

## 8. Test Instructions

Run the 15-scenario automated unit and integration test suite:

```bash
npm test
```

Expected Output:
```
✓ tests/app.test.ts (15 tests)
  ✓ 1. Login Credentials & Demo Data Baseline Validation
  ✓ 2. Executive Dashboard Summary Metrics Integrity
  ✓ 3. Agent Registry Fetching and Pause Action Audit Logging
  ✓ 4. Synthetic Loan Cases Filtering & PII Protection
  ✓ 5. Case Workbench Approval Action updates state and writes audit event
  ✓ 6. Case Workbench Rejection Action records rejection reason
  ✓ 7. Escalation Action updates status to Escalated
  ✓ 8. Policy Engine Policy Creation and Validation
  ✓ 9. Deterministic AI Simulator generates valid recommendations & policy scans for Low Risk Case
  ✓ 10. Deterministic AI Simulator forces Human Approval for High Risk Case (>20 DPD & > ₹25,000)
  ✓ 11. Deterministic AI Simulator Blocks Contact when Consent is Opted Out (POL-04)
  ✓ 12. Evaluation Studio Simulation produces 94% Pass Rate and logs event
  ✓ 13. AI Incident Creation logs critical audit event
  ✓ 14. Append-Only Audit Logging correlation ID generation
  ✓ 15. Role-Based Access Control 7 Roles Configuration

Test Files  1 passed (1)
     Tests  15 passed (15)
```

---

## 9. Comprehensive Documentation Suite

Find detailed technical documentation in the [`docs/`](file:///d:/EdgeTrust/docs/) directory:

- [`product-requirements-document.md`](file:///d:/EdgeTrust/docs/product-requirements-document.md)
- [`user-personas.md`](file:///d:/EdgeTrust/docs/user-personas.md)
- [`user-stories.md`](file:///d:/EdgeTrust/docs/user-stories.md)
- [`workflow-map.md`](file:///d:/EdgeTrust/docs/workflow-map.md)
- [`ai-governance-model.md`](file:///d:/EdgeTrust/docs/ai-governance-model.md)
- [`evaluation-plan.md`](file:///d:/EdgeTrust/docs/evaluation-plan.md)
- [`security-and-privacy.md`](file:///d:/EdgeTrust/docs/security-and-privacy.md)
- [`metrics-tree.md`](file:///d:/EdgeTrust/docs/metrics-tree.md)
- [`roadmap.md`](file:///d:/EdgeTrust/docs/roadmap.md)
- [`demo-script.md`](file:///d:/EdgeTrust/docs/demo-script.md)
- [`architecture.md`](file:///d:/EdgeTrust/docs/architecture.md)
- [`decision-log.md`](file:///d:/EdgeTrust/docs/decision-log.md)

---

## 10. Portfolio Disclaimer

*EdgeTrust Control Tower is an independent product concept for enterprise AI governance in financial operations. It is not affiliated with, endorsed by, or derived from TuringEdge or any specific financial institution. All data, customer profiles, loan balances, phone numbers, and accounts are 100% synthetic.*
