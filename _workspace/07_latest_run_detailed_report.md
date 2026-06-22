# Latest Playwright Run Detailed Report

## Run Summary

- Date: `2026-06-17`
- Scope: `smoke` + `regression`
- Total tests: `35`
- Passed: `15`
- Failed: `16`
- Skipped: `4`

## Executive Summary

The `16` failed tests do not point to `16` separate product defects.
They all stopped at the same precondition: authenticated scenarios could not complete login successfully.

Common failure point:

- `pages/app-shell.page.ts:7`
- `await expect(this.page).not.toHaveURL(/\/login$/);`

Observed runtime behavior from every failed case:

- the browser remained on `https://10.10.34.114/login`
- the login page displayed a credential mismatch message
- downstream checks such as dashboard entry, chat interaction, module navigation, logout, and post-login security behavior never actually started

## Passed Tests

### Smoke

1. `tests/smoke/auth.smoke.spec.ts:8`
   - Login page base surface is visible
2. `tests/smoke/auth.smoke.spec.ts:35`
   - Invalid user ID login is rejected
3. `tests/smoke/auth.smoke.spec.ts:48`
   - Invalid password login is rejected
4. `tests/smoke/security.headers.smoke.spec.ts:17`
   - `eXemble_보안_003` X-Frame-Options configured
5. `tests/smoke/security.headers.smoke.spec.ts:28`
   - `eXemble_보안_004` XSS defense header configured
6. `tests/smoke/security.headers.smoke.spec.ts:39`
   - `eXemble_보안_006` HSTS configured
7. `tests/smoke/security.headers.smoke.spec.ts:51`
   - `X-Content-Type-Options: nosniff`
8. `tests/smoke/security.headers.smoke.spec.ts:56`
   - baseline `Content-Security-Policy`
9. `tests/smoke/security.headers.smoke.spec.ts:66`
   - `Referrer-Policy` hardened
10. `tests/smoke/security.auth-surface.smoke.spec.ts:34`
   - `eXemble_보안_005` auth transport / CSRF-related login surface rule
11. `tests/smoke/security.auth-surface.smoke.spec.ts:70`
   - password input masking and submit button presence
12. `tests/smoke/security.auth-surface.smoke.spec.ts:82`
   - no auth-like storage keys before login
13. `tests/smoke/security.auth-surface.smoke.spec.ts:95`
   - login API uses HTTPS JSON POST and avoids URL leakage

### Regression

14. `tests/regression/security.navigation.regression.spec.ts:7`
   - anonymous access to `/` redirects to `/login`
15. `tests/regression/session-and-search.regression.spec.ts:8`
   - login page opens correctly in the private-certificate environment

## Failed Tests

### Failure Cluster A: authenticated login precondition failed

All items below failed for the same reason:

- login was attempted with injected credentials
- `AppShellPage.expectAuthenticatedShell()` expected the app to leave `/login`
- the app stayed on `/login`
- therefore the test failed before the target feature could be verified

Evidence location:

- `pages/app-shell.page.ts:7`
- each failed folder under `test-results/*/error-context.md`

Representative failure message:

- `Expected pattern: not /\\/login$/`
- `Received string: "https://10.10.34.114/login"`

Affected tests:

1. `tests/smoke/auth.smoke.spec.ts:14`
   - `eXemble_사용자 로그인_002`
   - Expected: remembered ID persists after relaunch
   - Actual stop point: login did not succeed
2. `tests/smoke/auth.smoke.spec.ts:61`
   - `eXemble_사용자 로그인_001`, `eXemble_환경설정_005`
   - Expected: login then logout
   - Actual stop point: login did not succeed
3. `tests/smoke/chat.smoke.spec.ts:23`
   - `eXemble_사용자 질의_001`, `eXemble_사용자 질의_005`
   - Expected: start chat and verify answer
   - Actual stop point: login did not succeed
4. `tests/smoke/chat.smoke.spec.ts:38`
   - `eXemble_사용자 질의_003`
   - Expected: open conversation history
   - Actual stop point: login did not succeed
5. `tests/smoke/navigation.smoke.spec.ts:29`
   - `eXemble_대시보드_001`
   - Expected: enter dashboard module
   - Actual stop point: login did not succeed
6. `tests/smoke/navigation.smoke.spec.ts:29`
   - `eXemble_사용자 질의_002`
   - Expected: enter AI service module
   - Actual stop point: login did not succeed
7. `tests/smoke/navigation.smoke.spec.ts:29`
   - `eXemble_사용자 질의_001`, `eXemble_사용자 질의_005`
   - Expected: enter chat module
   - Actual stop point: login did not succeed
8. `tests/regression/read-only-modules.regression.spec.ts:26`
   - `eXemble_AI서비스_001`, `eXemble_AI서비스_003`, `eXemble_AI서비스_004`
   - Expected: AI service list and search
   - Actual stop point: login did not succeed
9. `tests/regression/read-only-modules.regression.spec.ts:26`
   - `eXemble_데이터_001`, `eXemble_데이터_002`, `eXemble_데이터_003`
   - Expected: data list and search
   - Actual stop point: login did not succeed
10. `tests/regression/read-only-modules.regression.spec.ts:26`
    - `eXemble_모델_001`, `eXemble_모델_002`, `eXemble_모델_003`, `eXemble_모델_004`
    - Expected: model list and search
    - Actual stop point: login did not succeed
11. `tests/regression/read-only-modules.regression.spec.ts:26`
    - `eXemble_도구_001`, `eXemble_도구_002`, `eXemble_도구_003`
    - Expected: tool list and search
    - Actual stop point: login did not succeed
12. `tests/regression/read-only-modules.regression.spec.ts:26`
    - `eXemble_권한_001`, `eXemble_권한_002`
    - Expected: permission list and search
    - Actual stop point: login did not succeed
13. `tests/regression/read-only-modules.regression.spec.ts:26`
    - `eXemble_로그_001`, `eXemble_로그_002`, `eXemble_로그_003`, `eXemble_로그_005`
    - Expected: log list and search
    - Actual stop point: login did not succeed
14. `tests/regression/security.navigation.regression.spec.ts:12`
    - Expected: cannot return to protected page via browser back after logout
    - Actual stop point: login did not succeed
15. `tests/regression/security.navigation.regression.spec.ts:30`
    - Expected: protected root page is not exposed after logout
    - Actual stop point: login did not succeed
16. `tests/regression/session-and-search.regression.spec.ts:22`
    - Expected: response copy button appears after chat response
    - Actual stop point: login did not succeed

## Skipped Tests

1. `tests/smoke/auth.smoke.spec.ts:81`
   - SSO login
   - Reason: current environment has disabled SSO button
2. `tests/regression/read-only-modules.regression.spec.ts:37`
   - detail view verification
   - Reason: real data contract needs to be confirmed first
3. `tests/regression/session-and-search.regression.spec.ts:14`
   - role-based hidden menu verification
   - Reason: permission-specific profile data is not ready
4. `tests/regression/session-and-search.regression.spec.ts:18`
   - session expiry and re-login scenario
   - Reason: storage-state-based expiry reproduction contract is not ready

## Why So Many Failures Happened At Once

This was a cascade failure, not a broad functional collapse.

- The authenticated suites reuse the same login precondition.
- When that precondition failed once, every post-login scenario failed at the same gate.
- That means the current run does **not** prove that dashboard, chat, AI service, data, model, tool, permission, or log screens are broken.
- It only proves that the current credential-based login attempt did not succeed in this run.

## Most Likely Root Cause

The highest-probability cause is a credential mismatch in the current run context.

Why this is the strongest reading:

- every failed case remained on `/login`
- the login form displayed a credential error message
- failures occurred before any post-login selector lookup or module-specific action started

Additional environment caveat:

- `.env` is auto-loaded, but an already-set shell environment variable still takes precedence
- if PowerShell previously exported `EXEMBLE_USERNAME` or `EXEMBLE_PASSWORD`, those values can override the `.env` file during the test run

Relevant files:

- `fixtures/load-env.ts`
- `fixtures/env.ts`
- `README.md`

## Recommended Next Check

1. Verify that the active `EXEMBLE_USERNAME` and `EXEMBLE_PASSWORD` are valid for `https://10.10.34.114/`.
2. Clear any stale PowerShell env overrides before rerun.
3. Rerun the authenticated suites after confirming the account.

Suggested PowerShell sequence:

```powershell
Remove-Item Env:EXEMBLE_USERNAME -ErrorAction Ignore
Remove-Item Env:EXEMBLE_PASSWORD -ErrorAction Ignore
Remove-Item Env:PLAYWRIGHT_BASE_URL -ErrorAction Ignore
npm.cmd run test:smoke
```

If `.env` is correct, the next run should consume the `.env` values automatically.
