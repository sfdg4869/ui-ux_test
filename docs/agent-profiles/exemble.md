# eXemble Agent Profile

This file keeps the current eXemble-specific assumptions that were previously stored in `AGENTS.md`.

## Target

- Product: `eXemble`
- Base URL: `https://10.10.34.114/`
- Harness type: standalone Playwright automation harness

## Product-Specific Role Focus

- `harness-orchestrator`
  - connects the GS checklist PDF, feature list XLSX, and user manual PDF
  - keeps eXemble scope, priorities, and result summaries aligned
- `manual-analyst`
  - maps `manual/` documents to checklist `TC-ID`s and feature rows
- `playwright-engineer`
  - implements and maintains eXemble selectors, flows, and specs in `playwright.config.ts`, `fixtures/`, `pages/`, and `tests/`
- `case-reviewer`
  - compares checklist expectations with actual eXemble behavior and notes mismatches
- `security-sanity-reviewer`
  - reviews login, authorization, session, and HTTP security behavior that can be safely automated

## Source Documents

- Primary checklist:
  - `manual/eXemble_GS인증 - Check List.pdf`
- Feature list:
  - `manual/5_[KTR]기능리스트_주식회사엑셈.xlsx`
- User manual:
  - `manual/사용자_제품설명서_eXemble 생성형 AI 플랫폼_V1.0_(주)엑셈 251231.pdf`

## Working Assumptions

- keep source documents in `manual/` unchanged
- generate processed outputs under `_workspace/`
- do not hardcode credentials or file-based secrets
- use environment variables only:
  - `PLAYWRIGHT_BASE_URL`
  - `EXEMBLE_USERNAME`
  - `EXEMBLE_PASSWORD`
  - `EXEMBLE_STORAGE_STATE` optional
  - `EXEMBLE_ADMIN_USERNAME` / `EXEMBLE_ADMIN_PASSWORD` optional
  - `EXEMBLE_USER_USERNAME` / `EXEMBLE_USER_PASSWORD` optional
  - `EXEMBLE_MUTATION_USERNAME` / `EXEMBLE_MUTATION_PASSWORD` optional
  - `EXEMBLE_AUTHZ_*` optional for role-based menu and route expectations
- never modify or delete the currently configured `EXEMBLE_USERNAME` account
- keep `EXEMBLE_ALLOW_MUTATION_TESTS=0` unless a disposable write-test account is explicitly assigned
- keep the disposable write-test account separate from both the shared default account and the role-comparison user account
- treat the private certificate as a normal test-environment condition and handle it in Playwright config
- keep write-heavy flows as `manual` or `blocked` until a disposable test account and cleanup strategy exist

## Priority Model

- `P0`
  - login
  - logout
  - login failure
  - chat start
  - prompt input
  - response check
  - conversation history
  - dashboard entry and read-only surface checks
- `P1`
  - AI service
  - data
  - model
  - tool
  - permission
  - log
  - list, search, and detail-oriented read flows
- `P2`
  - create
  - register
  - update
  - delete
  - deploy
  - fine-tuning
  - policy or account-changing flows

## Expected Deliverables For This Profile

- `playwright.config.ts`
- `fixtures/`
- `pages/`
- `tests/`
- `_workspace/00_input.md`
- `_workspace/01_manual_module_map.md`
- `_workspace/02_test_catalog.md`
- `_workspace/03_execution_report.md`
- `_workspace/04_excluded_cases.md`
- `_workspace/05_tc_execution_matrix.json`
- `_workspace/05_tc_execution_matrix.md`
- `_workspace/06_tc_execution_summary.md`
- `_workspace/test-catalog.json`
- `_workspace/eXemble_GS인증 - Check List.work.xlsx`
- `_workspace/5_[KTR]기능리스트_주식회사엑셈.work.xlsx`

## Current Profile Notes

- `SSO` is currently disabled in the observed environment
- some authenticated regression checks still require:
  - `EXEMBLE_USERNAME`
  - `EXEMBLE_PASSWORD`
- role-separation regression can additionally use:
  - `EXEMBLE_ADMIN_*`
  - `EXEMBLE_USER_*`
  - `EXEMBLE_AUTHZ_ADMIN_VISIBLE_MENUS`
  - `EXEMBLE_AUTHZ_USER_HIDDEN_MENUS`
  - `EXEMBLE_AUTHZ_ADMIN_ALLOWED_ROUTES`
  - `EXEMBLE_AUTHZ_USER_BLOCKED_ROUTES`
- `eXemble_보안_005` is validated with a dual-path rule:
  - cookie-based auth: verify `SameSite`
  - non-cookie auth: verify `HTTPS POST`, JSON body, no query-string leakage, and hashed password transmission
