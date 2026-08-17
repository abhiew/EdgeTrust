# System Architecture & Technical Design

## 1. High-Level System Architecture

EdgeTrust Control Tower is built as a single-page SaaS application with a reactive state management layer, in-memory mock backend API, deterministic AI simulator, local audit logging engine, and internal product telemetry.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           EdgeTrust Frontend Shell                           │
│   (Vite + React 18 + TypeScript + Tailwind CSS + Lucide Icons + Recharts)    │
│   - AppShell & Nav  │  - Context Providers (Auth, Toast)  │  - 17 Views      │
└───────────────────────┬────────────────────────────────────┬─────────────────┘
                        │                                    │
                        ▼                                    ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────┐
│     Central API & State Layer (api.ts)    │  │  Deterministic AI Simulator   │
│   - Agents, Cases, Approvals, Policies    │  │  - Policy check evaluator     │
│   - Evaluations, Incidents, Reports       │  │  - Evidence grounding         │
│   - Typed Data Contracts (types/index.ts) │  │  - Safe draft generator       │
└───────────────────────┬───────────────────┘  └───────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Local Persistence & Event Bus                         │
│   - LocalStorage State Persistence                                           │
│   - Append-Only Audit Logger (auditLogger.ts with correlation IDs)           │
│   - Internal Product Usage Analytics Engine (analytics.ts)                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architectural Boundaries & Layer Separation

To maintain enterprise maintainability and prevent regression, the codebase strictly enforces five decoupled layers:

1. **Presentation Layer (`src/views/` & `src/components/`):**
   - Renders interactive UI components, dashboards, 3-column workbenches, and modals.
   - Consumes services and contexts; contains no raw business storage or unmasked sensitive data.
   - Implements loading states, empty states, success notifications, and error boundaries.

2. **State & Context Layer (`src/context/`):**
   - `AuthContext.tsx`: Manages active user session and dynamic 7-role RBAC perspective switching.
   - `ToastContext.tsx`: Provides centralized alert notifications (`success`, `warning`, `error`, `info`).

3. **Domain Service & Simulation Layer (`src/services/`):**
   - `api.ts`: Central mock backend orchestrating data retrieval, filtering, updates, and persistence.
   - `aiSimulator.ts`: Deterministic calculation engine evaluating loan metrics against compliance policies without external API dependencies.
   - `auditLogger.ts`: Append-only audit logger generating unique correlation IDs (`CORR-XXXXX`) and state diffs.
   - `analytics.ts`: Telemetry tracking system logging user engagement and feature usage.

4. **Data Contracts & Typed Models (`src/types/index.ts`):**
   - Single source of truth for all domain interfaces (`LoanCase`, `Agent`, `Approval`, `Policy`, `Incident`, `AuditEvent`, `User`, `Role`).

5. **Static Seed Data (`src/data/mockData.ts`):**
   - Central repository for synthetic NBFC data (accounts, agents, policies, evaluations, benchmark suites).
   - Zero hardcoded domain data allowed directly in UI components.

---

## 3. Key Subsystems & Governance Mechanics

### A. Deterministic AI Simulator (`src/services/aiSimulator.ts`)
Generates reproducible recommendations from synthetic loan account attributes. Runs active policy guardrail scans (POL-01 to POL-06), calculates confidence scores (0-100%), compiles verifiable evidence lists, and drafts customer messages without exposing private internal chain-of-thought.

### B. Append-Only Audit Engine (`src/services/auditLogger.ts`)
Logs immutable audit events for every user action (Login, Approve, Edit, Reject, Escalate, Pause Agent, Create Policy, Run Evaluation, Create Incident). Generates unique correlation IDs (`CORR-XXXXX`) and before/after state diffs with CSV export support.

### C. Human-in-the-Loop 3-Column Workbench (`src/views/CaseDetailView.tsx`)
Operations managers inspect customer history (Left Column), AI recommendations and policy checks (Middle Column), and execute human approval decisions (Right Column).

### D. Role-Based Access Control (`src/context/AuthContext.tsx`)
Provides 7 demo roles (CEO, COO, Operations Manager, Compliance Manager, AI Product Manager, Collection Agent, Admin) with instant live role switching to evaluate permissions across different persona perspectives.

---

## 4. Privacy, Security & Data Standards

- **PII Protection:** Phone numbers (`+91 ****** 4821`), bank accounts (`**** 8392`), and PAN IDs (`XXXXX1234X`) are masked by default via `DataMask.tsx`. Interactive unmasking produces an audit event (`data_unmasked`).
- **100% Synthetic Sandbox:** No real personal, financial, or regulatory data is processed.
- **Explicit Metric Labeling:** All business ROI estimates, automation rates, and agent benchmark metrics are badged as simulated sandbox data.
