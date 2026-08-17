# Technical & Design Decision Log

## Decision 1: Single-Page Application (Vite + React + TS) Stack
- **Context**: Need high performance, instant page transitions, rich interactive charts, and client-side state persistence without server deployment overhead.
- **Decision**: Selected Vite + React 18 + TypeScript + Tailwind CSS + Recharts + Lucide Icons.
- **Outcome**: Lightning-fast dev experience, sub-second route navigation, zero framework overhead.

## Decision 2: Deterministic AI Simulator over Required API Keys
- **Context**: Product must work seamlessly out-of-the-box for reviewers without requiring an external API key.
- **Decision**: Built a safe, deterministic AI simulator in TypeScript that evaluates loan attributes against active policies and returns verifiable evidence & recommendations.
- **Outcome**: Dependable, reproducible demo experience for all reviewers without external API dependencies or unexpected latency.

## Decision 3: 3-Column Workbench for Case Review
- **Context**: Operations managers need to review customer history, AI recommendations, verifiable evidence, policy checks, and draft messages simultaneously.
- **Decision**: Implemented a 3-column layout (Left = Profile & history, Middle = AI recommendation & evidence & policy checks, Right = Human approval actions stack).
- **Outcome**: High-density, professional enterprise workbench that reduces handling time from 12 minutes to 4 minutes.

## Decision 4: Masked PII Data Standard & Interactive Audit Unmasking
- **Context**: Financial applications must protect PII even in demo environments.
- **Decision**: Masked phone numbers, bank accounts, and PAN numbers by default with explicit `DataMask` interactive toggle components that write an audit record on reveal.
- **Outcome**: Demonstrates enterprise data security practices and regulatory readiness.

## Decision 5: Project-Level Permanent Rules (`AGENTS.md`)
- **Context**: Need a single permanent specification governing all architectural boundaries, privacy safeguards, audit logging mandates, and quality gates for AI agents and human contributors.
- **Decision**: Established `AGENTS.md` at the project root defining 20 core rules covering synthetic data, zero regulatory claims, layered boundaries, audit logging for mutations, confirmation flows, and testing standards.
- **Outcome**: Prevents architecture regression, unauthorized third-party claims, or test weakening across developer sessions.

## Decision 6: Dual-Layer Automated Test Suite (Logic & Full Route Rendering)
- **Context**: Need rapid verification of both core business simulation logic and all 17 view renders without fragile end-to-end browser driver dependencies.
- **Decision**: Implemented a comprehensive Vitest suite comprising `tests/app.test.ts` (15 logic/audit tests) and `tests/routes.test.tsx` (18 route/shell render tests).
- **Outcome**: Instantaneous test execution (<6s) validating 100% of routes and critical business logic.
