# EdgeTrust Development & Agent Workflow Guide

This document outlines the standard development, verification, and contribution workflows for developers and AI agents working on the **EdgeTrust Control Tower** codebase.

---

## 1. Development Principles & Code Standards

All contributions must strictly adhere to the 20 permanent engineering rules defined in [AGENTS.md](file:///d:/EdgeTrust/AGENTS.md):
- **100% Synthetic Data:** Never use real PII, financial, or regulatory data.
- **Layered Boundaries:** Keep `src/views/`, `src/components/`, `src/services/`, `src/data/`, `src/context/`, and `src/types/` cleanly decoupled.
- **Mandatory Audit Trail:** Every state mutation (approvals, edits, rejections, escalations, pause/resume, policy updates, containment actions) must call `logAuditEvent()`.
- **Confirmation Modals:** All destructive or high-risk actions must require a user confirmation step.
- **Complete UI States:** Implement loading, empty, success, and error states for all interactive features.

---

## 2. Environment Setup & Execution

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Package Manager:** `npm`

### Daily Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (with HMR)
npm run dev

# 3. Run full automated test suite (Logic & Route Smoke Tests)
npm test

# 4. Strict TypeScript type check
npx tsc --noEmit

# 5. Production build compilation
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 3. Verification & Quality Gates

Before concluding any development task or preparing a Git checkpoint, you **must** execute and pass the three core quality gates:

```
┌─────────────────────────────────────────────────────────────┐
│                   Quality Gate Pipeline                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
   ┌─────────────────┐ ┌────────────────┐ ┌────────────────┐
   │ npx tsc --noEmit│ │    npm test    │ │ npm run build  │
   │  (Strict Types) │ │(33 Vitest tests│ │ (Vite & Rollup)│
   └─────────────────┘ └────────────────┘ └────────────────┘
```

1. **Strict Type Checking (`npx tsc --noEmit`):**
   - Zero type errors allowed.
   - All models must be typed in `src/types/index.ts`. No `any` types.

2. **Automated Vitest Test Suite (`npm test`):**
   - Must pass 100% of tests across `tests/app.test.ts` and `tests/routes.test.tsx`.
   - Never weaken or delete test assertions to force a passing status.

3. **Production Compilation (`npm run build`):**
   - Verifies module transformation, tree-shaking, and production asset bundling in `dist/`.

---

## 4. UI State Guidelines

When building or updating views and components, ensure all four UI states are handled gracefully:

| State | Implementation Requirement |
|---|---|
| **Loading** | Render animated pulse bars, spinner icons, or skeleton cards while fetching/simulating. |
| **Empty** | Render descriptive message, clear icon, and action button when lists/filters return 0 records. |
| **Success** | Trigger toast alert via `useToast()` and update reactive state immediately. |
| **Error** | Catch service exceptions, display informative warning banner, and avoid component crashing. |

---

## 5. Adding New Routes & Views

When creating a new route:
1. Define view component in `src/views/MyNewView.tsx`.
2. Add route case in `src/App.tsx` hash router.
3. Add navigation link in `src/components/common/AppShell.tsx` if it belongs in the main sidebar.
4. Add corresponding smoke test in `tests/routes.test.tsx`.
5. Run `npx tsc --noEmit` and `npm test` to verify.

---

## 6. Git Checkpoint Guidelines

- **Clean Working Tree:** Ensure no temporary debug logs (`console.log`, `debugger`) exist in `src/`.
- **Secret Safety:** Confirm no API keys, tokens, or `.env` files are tracked.
- **Meaningful Commits:** Use conventional commit messages (e.g., `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`).
- **User Approval:** Always request explicit user approval before committing or pushing changes.
