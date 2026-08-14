# Security, Privacy & Data Protection Model

## 1. PII Protection & Data Masking
- Phone numbers masked (`+91 ****** 4821`).
- Bank account numbers masked (`**** 8392`).
- Permanent Account Numbers (PAN) masked (`XXXXX1234X`).
- Interactive unmasking button logs an audit event (`data_unmasked`).

## 2. Synthetic Data Environment
- All customer profiles, loan balances, repayment histories, and phone numbers are 100% synthetic demonstration data.
- No real personal, financial, credit score, or health data is ingested or transmitted.

## 3. Environment Variables & API Key Handling
- No hardcoded API keys in frontend code.
- Deterministic simulation mode works offline without requiring external API keys.
- Optional LLM provider adapters use environment variables (`VITE_OPENAI_API_KEY`, `VITE_ANTHROPIC_API_KEY`).

## 4. Role-Based Access Control (RBAC)
- Protected routes evaluate active user role.
- Destructive and sensitive operations (Pause agent, disable policy, rollback version, contain incident) require confirmation modals.
