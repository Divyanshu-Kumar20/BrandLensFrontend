# BrandLens - Frontend and Design Guide
**Codex 48 | Round 2 - The Build | Team D&A CODERS**

## Core Workflow
1. **Submit Draft**: Creator inputs copy or selects "Try sample draft".
2. **Review & Highlights**: Rule checks + verified Gemini AI findings highlight violations (blocking, should_fix, suggestion).
3. **Resolve Findings**: Creator accepts fix, edits inline, or disputes with mandatory reason.
4. **Version Diffing**: Creator saves as new version; diff viewer highlights changes; re-checks.
5. **Approval Workflow**: Creator submits $\rightarrow$ Reviewer approves/requests changes $\rightarrow$ Manager final approval. Full audit log and comments.

## Contract Reference
- Base Path: `/api`
- Auth: Bearer `<token>` on protected routes.
- Response Envelope: `{ "ok": true, "data": ... }` or `{ "ok": false, "error": { "code": "...", "message": "..." } }`.
