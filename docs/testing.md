# EdgeTrust Testing Strategy & Quality Assurance Guide

This document outlines the testing architecture, suites, factories, utilities, and execution procedures for the **EdgeTrust Control Tower** platform.

---

## 1. Testing Philosophy & Standards

In accordance with **[AGENTS.md](file:///d:/EdgeTrust/AGENTS.md)** (Rules 15, 16, and 17):
- **User-Centric & Behavior-Driven:** Tests focus on user-visible outcomes, state transitions, and audit trails rather than brittle component internals.
- **Strict Test Integrity:** Never weaken assertions, delete tests, or remove features to force test passes.
- **100% Synthetic Data:** All test cases use synthetic fixtures generated via dedicated factories.
- **Fast Feedback Loop:** In-memory execution using Vitest + JSDOM executes the entire test suite in < 4 seconds.

---

## 2. Test Suite Architecture

```
tests/
├── setup.ts                     # Global JSDOM matchers, ResizeObserver, & cleanup
├── utils/
│   ├── factories.ts             # Synthetic data factories (Users, Cases, Agents, Policies, Audits)
│   └── mockServices.tsx         # Test state seeder, audit event matchers, & renderWithProviders
├── app.test.ts                  # Core business logic, simulation calculations, & audit logger
├── routes.test.tsx              # Full route smoke & component render verification (18 views)
├── component/
│   ├── auth.test.tsx            # 1-Click demo login, credentials validation, & error states
│   ├── rbac.test.tsx            # 7-Role dynamic perspective switching & governance matrix
│   ├── navigation.test.tsx      # Sidebar links, collapse state, notifications, & quick search
│   ├── dashboard.test.tsx       # KPI cards, ROI metrics, automation funnel, & chart mounts
│   ├── loadingState.test.tsx    # Live simulation progress bar & async completion
│   ├── errorState.test.tsx      # Non-existent ID handling & fallback banners
│   ├── caseTransitions.test.tsx # 3-Column workbench (Approve, Edit Draft, Reject, Escalate)
│   ├── approvals.test.tsx       # Priority queue tabs, SLA alerts, & batch review
│   └── auditEvents.test.tsx     # Immutable audit trails, PII unmask logs, & CSV exports
└── integration/
    └── e2eJourney.test.tsx      # Full operator journey (Login -> Queue -> Workbench -> Audit Log)
```

---

## 3. Test Data Factories (`tests/utils/factories.ts`)

Provides type-safe synthetic factories with customizable overrides:
- `createUser(overrides)`: Generates operator profiles across 7 demo roles.
- `createLoanCase(overrides)`: Generates loan cases with masked PII, evidence, and policy check items.
- `createAgent(overrides)`: Generates AI agent registry items and telemetry benchmarks.
- `createApproval(overrides)`: Generates pending human-in-the-loop approval tickets.
- `createPolicy(overrides)`: Generates compliance and approval policy guardrails.
- `createIncident(overrides)`: Generates synthetic system drift alerts.
- `createAuditEvent(overrides)`: Generates append-only audit events with `CORR-XXXXX` correlation IDs.

---

## 4. Mock Service Utilities (`tests/utils/mockServices.tsx`)

- `renderWithProviders(ui, options)`: Wraps component trees with `AuthProvider` and `ToastProvider`.
- `seedTestState(data)`: Seeds `localStorage` with deterministic test cases, agents, approvals, and policies.
- `resetTestState()`: Cleans `localStorage` and resets internal stores between runs.
- `findAuditEvent(eventType, resourceId)`: Retrieves specific audit records for verification.

---

## 5. Execution Commands

```bash
# 1. Run all test suites
npm test

# 2. Run a specific test suite
npx vitest run tests/component/caseTransitions.test.tsx

# 3. Run tests in watch mode (for active development)
npx vitest

# 4. Strict TypeScript type check
npx tsc --noEmit

# 5. Production build bundle verification
npm run build
```

---

## 6. Current Baseline Coverage Status

| Test Category | Suite Count | Test Count | Status |
|---|---|---|---|
| **Domain Logic & AI Simulation** | 1 file | 15 tests | ✅ Passed |
| **Route Smoke & Shell Rendering** | 1 file | 18 tests | ✅ Passed |
| **Component & State Transitions** | 9 files | 23 tests | ✅ Passed |
| **End-to-End Operational Journey** | 1 file | 1 test | ✅ Passed |
| **Total Test Suite** | **12 files** | **57 tests** | **✅ 100% Passed** |
