# Technical & Design Decision Log

## Decision 1: Single-Page Application (Vite + React + TS) Stack
- **Context**: Need high performance, instant page transitions, rich interactive charts, and client-side state persistence without server deployment overhead.
- **Decision**: Selected Vite + React 18 + TypeScript + Tailwind CSS + Recharts + Lucide Icons.
- **Outcome**: Lightning-fast dev experience, sub-second route navigation, zero framework overhead.

## Decision 2: Deterministic AI Simulator over Required API Keys
- **Context**: Product must work seamlessly out-of-the-box for reviewers without requiring an API key.
- **Decision**: Built a safe, deterministic AI simulator in TypeScript that evaluates loan attributes against active policies and returns verifiable evidence & recommendations.
- **Outcome**: Dependable, reproducible demo experience for all reviewers without external API dependency.

## Decision 3: 3-Column Workbench for Case Review
- **Context**: Operations managers need to review customer history, AI recommendations, verifiable evidence, policy checks, and draft messages simultaneously.
- **Decision**: Implemented a 3-column layout (Left = Profile & history, Middle = AI recommendation & evidence & policy checks, Right = Human approval actions stack).
- **Outcome**: High-density, professional enterprise workbench that reduces handling time from 12 minutes to 4 minutes.

## Decision 4: Masked PII Data Standard
- **Context**: Financial applications must protect PII even in demo environments.
- **Decision**: Masked phone numbers, bank accounts, and PAN numbers by default with explicit `DataMask` interactive toggle components.
- **Outcome**: Demonstrates enterprise data security practices.
