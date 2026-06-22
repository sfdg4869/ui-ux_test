# eXemble Playwright Harness

Standalone Playwright harness for `https://10.10.34.114/`.

Source inputs live in `manual/`.
Generated outputs and working artifacts live in `_workspace/`.

## Reference Docs

- Reuse guide: [docs/reuse-guide.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/docs/reuse-guide.md)
- Shared harness operating model: [AGENTS.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/AGENTS.md)
- eXemble product profile: [docs/agent-profiles/exemble.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/docs/agent-profiles/exemble.md)
- Automation input templates: [_workspace/automation-definitions/README.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/_workspace/automation-definitions/README.md)

## Source Documents

- Checklist PDF:
  - `manual/eXemble_GS인증 - Check List.pdf`
- Feature list workbook:
  - `manual/5_[KTR]기능리스트_주식회사엑셈.xlsx`
- User manual PDF:
  - `manual/사용자취급설명서_eXemble 생성형 AI 플랫폼 V1.0_(주)엑셈 251231.pdf`

## Setup

```powershell
npm.cmd install
$env:PLAYWRIGHT_BROWSERS_PATH = "0"
npx.cmd playwright install chromium
```

## Environment

Create `.env` in the repository root based on `.env.example`.

```dotenv
PLAYWRIGHT_BASE_URL=https://10.10.34.114
PLAYWRIGHT_WORKERS=1
EXEMBLE_USERNAME=your-username
EXEMBLE_PASSWORD=your-password
EXEMBLE_STORAGE_STATE=
EXEMBLE_ADMIN_USERNAME=
EXEMBLE_ADMIN_PASSWORD=
EXEMBLE_ADMIN_STORAGE_STATE=
EXEMBLE_USER_USERNAME=
EXEMBLE_USER_PASSWORD=
EXEMBLE_USER_STORAGE_STATE=
EXEMBLE_MUTATION_USERNAME=
EXEMBLE_MUTATION_PASSWORD=
EXEMBLE_MUTATION_STORAGE_STATE=
EXEMBLE_AUTHZ_ADMIN_VISIBLE_MENUS=권한,로그
EXEMBLE_AUTHZ_USER_HIDDEN_MENUS=권한,로그
EXEMBLE_AUTHZ_ADMIN_ALLOWED_ROUTES=/permission/account,/permission/org,/permission/vector-database-access,/log
EXEMBLE_AUTHZ_USER_BLOCKED_ROUTES=/permission/account,/permission/org,/permission/vector-database-access,/log
EXEMBLE_AUTHZ_DENIAL_MARKERS=권한이 없습니다,접근 권한이 없습니다,Unauthorized,Forbidden,403
EXEMBLE_ALLOW_MUTATION_TESTS=0
EXEMBLE_MUTATION_USERNAME=
EXEMBLE_UPLOAD_SIZE_FIXTURE_ROOT=
EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR=
EXEMBLE_UPLOAD_LIMIT_100MB_FILE=
EXEMBLE_UPLOAD_SAMPLE_TEXT_FILE=
EXEMBLE_UPLOAD_SAMPLE_IMAGE_FILE=
EXEMBLE_UPLOAD_SAMPLE_DOCUMENT_FILE=
EXEMBLE_UPLOAD_SAMPLE_MEDIA_FILE=
```

- `.env` is loaded automatically.
- If the same variables are set in the shell, the shell values win.
- `PLAYWRIGHT_WORKERS` defaults to `1` because the current product/account flow is more reliable in single-worker mode.
- Increase `PLAYWRIGHT_WORKERS` only when the target environment is confirmed to handle parallel authenticated sessions safely.
- Upload size boundary tests auto-detect `file_upload_test/test_99MB`, `file_upload_test/test_100MB`, and `file_upload_test/test_101MB`.
- If those fixtures live elsewhere, set `EXEMBLE_UPLOAD_SIZE_FIXTURE_ROOT` to the parent folder.
- If `EXEMBLE_PASSWORD` contains `#`, spaces, or similar special characters, wrap it in quotes.
- Example: `EXEMBLE_PASSWORD="password12#"`
- Authorization profile comparison can use two separate accounts.
- If `EXEMBLE_ADMIN_*` is empty, the admin profile falls back to `EXEMBLE_USERNAME` / `EXEMBLE_PASSWORD`.
- `EXEMBLE_USER_*` activates non-admin role comparison and direct-route blocking checks.
- `EXEMBLE_MUTATION_*` is a third, separate disposable profile for password-policy and other write/security tests.
- `EXEMBLE_AUTHZ_*` values are comma-separated and can be customized per product or role policy.
- `EXEMBLE_ALLOW_MUTATION_TESTS` defaults to `0` and should stay `0` for the current working account.
- Any future write or account-changing spec must use the separate disposable credentials in `EXEMBLE_MUTATION_*`.

## Build Catalog

```powershell
npm.cmd run catalog:build
```

Outputs:

- `_workspace/00_input.md`
- `_workspace/01_manual_module_map.md`
- `_workspace/02_test_catalog.md`
- `_workspace/03_execution_report.md`
- `_workspace/04_excluded_cases.md`
- `_workspace/test-catalog.json`
- workbook working copies under `_workspace/`

## Build Input Range Matrix

```powershell
npm.cmd run input-range:build
```

Outputs:

- `_workspace/12_input_range_matrix.json`
- `_workspace/12_input_range_matrix.md`
- `_workspace/13_input_field_inventory.md`
- `_workspace/16_manual_input_coverage_report.md`

## Run Tests

Smoke:

```powershell
npm.cmd run test:smoke
```

Safe UI button sweep:

```powershell
npm.cmd run test:ui-safe
```

Authorization separation:

```powershell
npm.cmd run test:authz
```

Regression:

```powershell
npm.cmd run test:regression
```

Expanded read-only automation:

```powershell
npm.cmd run test:deep-readonly
```

Quick authenticated smoke sample:

```powershell
npx.cmd playwright test tests/smoke/auth.smoke.spec.ts tests/smoke/security.headers.smoke.spec.ts tests/smoke/security.auth-surface.smoke.spec.ts --project=smoke
```

Full TC catalog run:

```powershell
npm.cmd run test:tc
```

Filtered TC catalog run example:

```powershell
npm.cmd run test:tc -- --grep "X-Frame-Options"
```

`test:tc` rebuilds the catalog, runs the implemented Playwright specs, and then writes a TC-level execution matrix for every checklist case.

Outputs:

- `_workspace/05_tc_execution_matrix.json`
- `_workspace/05_tc_execution_matrix.md`
- `_workspace/06_tc_execution_summary.md`

`test:deep-readonly` expands the automated read-only scope across dashboard monitoring, AI service/detail tabs, permission list/detail flows, and theme toggle regression.

Execution states used in the TC matrix:

- `passed`
- `failed`
- `skipped`
- `planned`
- `manual`
- `blocked`
- `deferred`
- `not-run`
- `unmapped`

## Notes

- `ignoreHTTPSErrors: true` is enabled for the private certificate environment.
- Tests that require credentials are skipped automatically when `EXEMBLE_USERNAME` and `EXEMBLE_PASSWORD` are missing.
- Account-changing or destructive flows must remain disabled for the current account unless a separate disposable test account is explicitly configured.
- Write-heavy flows remain `manual` or `blocked` until a safe test account and cleanup path are confirmed.
