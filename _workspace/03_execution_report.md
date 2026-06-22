# Execution Report

- Status: security harness updated and re-verified
- Primary source of truth: `manual/eXemble_GS인증 - Check List.pdf`
- Dev dependencies installed: `@playwright/test`, `xlsx`, `pdf-parse`
- Workspace-local browser install completed with `PLAYWRIGHT_BROWSERS_PATH=0`

## Latest security smoke run

- Command:
  `npx.cmd playwright test tests/smoke/security.headers.smoke.spec.ts tests/smoke/security.auth-surface.smoke.spec.ts --project=smoke`
- Result summary:
  - passed: 10
  - failed: 0
  - skipped: 0

## Latest security regression run

- Command:
  `npx.cmd playwright test tests/regression/security.navigation.regression.spec.ts --project=regression`
- Result summary:
  - passed: 1
  - skipped: 2

## Latest safe create-cancel regression run

- Command:
  `npx.cmd playwright test tests/regression/permission.create-cancel.regression.spec.ts tests/regression/data.create-cancel.regression.spec.ts tests/regression/tool.create-cancel.regression.spec.ts tests/regression/ai-create-cancel.regression.spec.ts --project=regression`
- Result summary:
  - passed: 11
  - failed: 0
  - skipped: 0

## Newly implemented checklist cases

- `eXemble_AI서비스_012`
- `eXemble_AI서비스_044`
- `eXemble_권한_004`
- `eXemble_권한_006`
- `eXemble_권한_008`
- `eXemble_권한_016`
- `eXemble_권한_022`
- `eXemble_데이터_006`
- `eXemble_데이터_007`
- `eXemble_데이터_010`
- `eXemble_데이터_029`
- `eXemble_데이터_033`
- `eXemble_데이터_034`
- `eXemble_데이터_035`
- `eXemble_데이터_036`
- `eXemble_데이터_038`
- `eXemble_데이터_039`
- `eXemble_데이터_040`
- `eXemble_데이터_041`
- `eXemble_도구_004`
- `eXemble_도구_014`

## Catalog status after rebuild

- Auto target cases: 131
- Implemented cases: 103
- Planned auto cases: 49
- Remaining planned cases from the latest reclassification:
  - `eXemble_AI서비스_037`
  - `eXemble_도구_010`

## Latest upload boundary fixture run

- Command:
  `npx.cmd playwright test tests/regression/input-upload-limits.regression.spec.ts --project=regression`
- Fixture root:
  `file_upload_test`
- Result summary:
  - passed: 3
  - skipped: 1
- Observed behavior:
  - `test_99MB` representative fixture was accepted in the upload dialog
  - `test_100MB` representative fixture was accepted at the exact boundary
  - `test_101MB` representative fixture was rejected as over the documented 100MB limit
  - `eXemble_데이터_011` remained skipped because `EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR` is still unset

## Passed checklist cases

- `eXemble_보안_003`
- `eXemble_보안_004`
- `eXemble_보안_005`
- `eXemble_보안_006`

## Passed supplemental security checks

- `X-Content-Type-Options` is `nosniff`
- `Content-Security-Policy` includes `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`
- `Content-Security-Policy` does not include `'unsafe-eval'`
- `Referrer-Policy` is `strict-origin-when-cross-origin`
- Login page uses `input[type="password"]`
- Login page submits through `button[type="submit"]`
- No auth-like keys exist in `localStorage` or `sessionStorage` before login
- Login API uses `HTTPS POST` JSON to `/api/v1/login`
- Login request does not expose the raw password in the URL or request body
- Login request sends a 64-character hex digest instead of the raw password
- Unauthenticated access to `/` redirects to `/login`

## Skipped

- `security.navigation.regression.spec.ts` authenticated logout/back-button checks
  - `EXEMBLE_USERNAME` and `EXEMBLE_PASSWORD` are still required

## Notes

- `eXemble_보안_005` was corrected from a cookie-only assumption.
- The live app does not set a login cookie on `GET /login`, so SameSite-only verification was a false failure.
- The revised check now supports both models:
  - cookie-based auth: verify `SameSite`
  - non-cookie auth: verify `HTTPS POST`, JSON body, no query-string exposure, and hashed password transmission
- Observed live behavior during verification:
  - login request path: `/api/v1/login`
  - method: `POST`
  - content type: `application/json`
  - password field in the request body is a 64-character hex digest, not the raw password
- The following security items still need separate handling:
  - `eXemble_보안_007`: requires an account creation or password change surface
  - `eXemble_보안_008`: packet-level verification remains a `blocked/manual` item
  - `eXemble_보안_010`: account lockout needs a dedicated test account
## Latest authorization profile regression run

- Command:
  `npx.cmd playwright test tests/regression/authorization.profiles.regression.spec.ts tests/regression/session-and-search.regression.spec.ts --project=regression`
- Result summary:
  - passed: 3
  - skipped: 3
- Observed behavior:
  - admin profile route-access regression passed with the current default credential fallback
  - user-profile direct-route and menu-separation checks remained skipped because `EXEMBLE_USER_*` is not configured yet
  - session-expiry replay still remains gated behind `EXEMBLE_STORAGE_STATE`

## Latest shell compatibility rerun

- Commands:
  - `npx.cmd playwright test tests/regression/theme.regression.spec.ts --project=regression`
  - `npx.cmd playwright test tests/smoke/auth.smoke.spec.ts --project=smoke`
- Result summary:
  - passed: 6
  - skipped: 1
- Observed behavior:
  - the generalized account-menu detection continued to support theme toggle and logout flows
