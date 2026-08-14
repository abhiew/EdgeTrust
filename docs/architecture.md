# System Architecture & Technical Design

## 1. High-Level System Architecture

EdgeTrust Control Tower is built as a single-page SaaS application with a reactive state management layer, in-memory mock backend API, deterministic AI simulator, and local audit & analytics loggers.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EdgeTrust Frontend Shell                      │
│   (Vite + React 18 + TypeScript + Tailwind CSS + Lucide Icons + Recharts) │
└────────────────────┬────────────────────────────────────┬───────────────┘
                     │                                    │
                     ▼                                    ▼
┌────────────────────────────────────────┐  ┌─────────────────────────────┐
│    Central API & State Layer (api.ts)  │  │  Deterministic AI Simulator │
│  - Agents, Cases, Approvals, Policies  │  │  - Policy check evaluator   │
│  - Evaluations, Incidents, Reports     │  │  - Evidence grounding       │
└────────────────────┬───────────────────┘  │  - Safe draft generator     │
                     │                      └─────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Local Persistence & Event Bus                     │
│  - LocalStorage State Persistence                                       │
│  - Append-Only Audit Logger (auditLogger.ts)                            │
│  - Internal Product Usage Analytics Engine (analytics.ts)               │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Key Technical Subsystems

### A. Deterministic AI Simulator (`src/services/aiSimulator.ts`)
Generates reproducible recommendations from synthetic loan account attributes. Runs active policy guardrail scans (POL-01 to POL-06), calculates confidence scores (0-100%), compiles verifiable evidence lists, and drafts customer messages without exposing private internal chain-of-thought.

### B. Append-Only Audit Engine (`src/services/auditLogger.ts`)
Logs immutable-looking audit events for every user action (Login, Approve, Edit, Reject, Escalate, Pause Agent, Create Policy, Run Evaluation, Create Incident). Generates unique correlation IDs (`CORR-XXXXX`) and state diffs.

### C. Role-Based Access Control (`src/context/AuthContext.tsx`)
Provides 7 demo roles (CEO, COO, Operations Manager, Compliance Manager, AI Product Manager, Collection Agent, Admin) with instant live role switching to evaluate permissions across different persona perspectives.

### D. Analytics Event Bus (`src/services/analytics.ts`)
Tracks 16 product usage events in real-time and renders internal usage statistics in the Settings view.
