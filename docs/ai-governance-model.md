# AI Governance & Safety Control Boundary

EdgeTrust Control Tower enforces a strict human-in-the-loop AI governance model tailored to NBFC financial workflows.

---

## 1. Governance Control Boundary
- **AI Recommendation Engine**: Restricted strictly to generating decision proposals, verifiable evidence lists, policy evaluation logs, and customer communication drafts.
- **Human Approval Boundary**: Every sensitive action (accounts > 20 DPD, balance > ₹25,000, low AI confidence < 80%, vulnerable customer flag, missing consent) **requires explicit human operator approval**.

## 2. Policy Enforcement Engine
- **POL-01 (High-risk communication approval)**: Mandatory human clearance for high-exposure accounts.
- **POL-02 (No threatening language)**: Zero-tolerance regex & guardrail check blocking harassment or unverified legal threats.
- **POL-03 (Low-confidence escalation)**: Automatically routes confidence scores < 80% to human review.
- **POL-04 (Consent required)**: Prohibits digital outreach without active consent.
- **POL-05 (Restricted attributes)**: Excludes religion, caste, gender, or health status from prompt context.
- **POL-06 (Minimum necessary data access)**: Redacts full PAN numbers and unmasked bank account numbers before model invocation.

## 3. Explainability Standard
Avoids exposing raw private internal chain-of-thought. Presents auditable decision rationale formatted into:
- Decision summary
- Verifiable evidence used
- Policy checks passed/flagged
- Confidence score (%)
- Recommended action
- Human approval status
