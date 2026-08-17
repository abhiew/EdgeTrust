# AGENTS.md — Permanent Engineering & Architectural Rules

Welcome to the **EdgeTrust Control Tower** project. This file defines the permanent, non-negotiable engineering principles, architectural boundaries, safety guardrails, and development standards for any human or AI agent working on this codebase.

---

## 1. Core Project Principles & Scope

1. **Portfolio Project Identity:**  
   EdgeTrust Control Tower is an independent SaaS portfolio demonstration project designed to illustrate Human-in-the-Loop AI governance and operational control boundaries for Non-Banking Financial Company (NBFC) collection workflows.

2. **Synthetic Data Mandate:**  
   Use 100% synthetic customer profiles, loan balances, repayment timelines, and phone numbers. Never ingest, generate, simulate, or process real financial, credit score, health, or personally identifiable information (PII).

3. **Strict Privacy & PII Handling:**  
   All customer identifiers must be masked by default (`+91 ****** 4821`, `**** 8392`, `XXXXX1234X`). Unmasking must require explicit user interaction and always produce an immutable audit event.

4. **Zero Regulatory Claims:**  
   Do not claim or imply regulatory compliance, official RBI certification, statutory approval, or legal validity. EdgeTrust is a product governance demonstration, not a legal advisory tool.

5. **No Private Chain-of-Thought Exposure:**  
   Never expose raw internal model reasoning traces or unvetted scratchpads in the UI.

6. **Concise Evidence-Based Explanations:**  
   Present clean, auditable, evidence-grounded rationales (e.g., policy check results, verifiable repayment history facts, confidence scores) to operators.

---

## 2. Architecture & Code Structure

7. **Clean Separation of Concerns:**  
   Maintain strict boundaries between:
   - **Frontend Presentation:** `src/views/` and `src/components/`
   - **Business & Mock Services:** `src/services/` (`api.ts`, `aiSimulator.ts`, `auditLogger.ts`, `analytics.ts`)
   - **Static & Seed Data:** `src/data/` (`mockData.ts`)
   - **Data Contracts & Types:** `src/types/` (`index.ts`)
   - **State Contexts:** `src/context/` (`AuthContext.tsx`, `ToastContext.tsx`)

8. **Component Reusability:**  
   Reuse existing components (e.g., `AppShell`, `ConfirmationModal`, `DataMask`, `DemoDataBanner`) rather than duplicating markup or styling across views.

9. **Strict Typed Data Models:**  
   All domain entities, API payloads, state objects, and function returns must adhere to defined TypeScript interfaces in `src/types/index.ts`. Do not use `any` or untyped object literals.

10. **State Management & UI Completeness:**  
    Every view and interactive workflow must explicitly account for and handle:
    - **Loading States:** Skeleton loaders, spinners, or progress bars during async operations.
    - **Empty States:** Clear, helpful messaging and action cues when lists or filters return zero items.
    - **Success States:** Toast alerts and state updates confirming successful operations.
    - **Error States:** Informative, non-crashing UI banners or dialogs with recovery paths.

---

## 3. Governance, Auditability & Safety Guardrails

11. **Mandatory Audit Logging for Mutations:**  
    Every state-changing or sensitive action (e.g., approve case, edit draft, reject, escalate, pause agent, create policy, disable policy, trigger containment, unmask PII, generate report) must log an append-only audit record via `logAuditEvent()` containing actor ID, role, correlation ID (`CORR-XXXXX`), resource ID, and state diff.

12. **Confirmation Flows for Sensitive Actions:**  
    Destructive or high-risk actions (e.g., pausing an agent, executing emergency containment, rejecting recommendations, rolling back versions, disabling compliance policies) must be gated by a `ConfirmationModal` before execution.

13. **No Scattered Hardcoded Business Data:**  
    Do not hardcode domain logic, loan thresholds, agent configurations, or seed records directly inside React components. All data must reside in `src/data/mockData.ts` or flow through `src/services/api.ts`.

14. **Preserve Working Architecture:**  
    Do not rewrite unrelated working code, replace established project architecture, or alter directory conventions unless explicitly directed.

15. **Integrity of Test Suites:**  
    Never delete, bypass, or weaken tests or business logic to make test runs pass. Always resolve the root cause.

---

## 4. Quality Assurance, Testing & Delivery

16. **Verification Lifecycle:**  
    After every meaningful code change, always run and verify:
    ```bash
    npx tsc --noEmit     # Strict type checking
    npm test             # Automated Vitest test suite
    npm run build        # Production bundle compilation
    ```

17. **Test Coverage for Business Logic:**  
    Add or update unit and integration tests in `tests/` whenever new services, policy rules, deterministic simulator calculations, or routes are introduced.

18. **Explicit Labeling of Simulated Metrics:**  
    All synthetic metrics, estimated ROI figures, simulated model scores, and demo benchmarks must be clearly badged or labeled as simulated sandbox data in the UI.

19. **Calm, Premium Enterprise Aesthetics:**  
    Maintain a cohesive, modern, high-density dark-mode SaaS design palette (slate-950/slate-900 surfaces, subtle borders, high contrast typography, precise status badges, and fluid micro-animations).

20. **Accessibility & Responsiveness:**  
    Preserve keyboard navigability, semantic HTML elements, visible focus rings, ARIA labels for interactive controls, and responsive layouts across desktop, tablet, and mobile breakpoints.
