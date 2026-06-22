# Service Management Path Rerun Results

## Applied Change

- Added `서비스 관리` as a required entry path before:
  - `대시보드`
  - `데이터`
  - `모델`
  - `도구`
  - `권한`
  - `로그`
- Added submenu support for `데이터 -> 데이터 소스`
- Updated search input detection to ignore disabled fields

## Verified Runs

### Smoke navigation

- `eXemble_대시보드_001`
  - `passed`
- `eXemble_사용자 질의_002`
  - `passed`
- `eXemble_사용자 질의_001`
  - `passed`
- `eXemble_사용자 질의_005`
  - `passed`

Result:

- `3 passed`

### Auth smoke

- `eXemble_사용자 로그인_001`
  - `passed`
- `eXemble_사용자 로그인_002`
  - `passed`
- `eXemble_환경설정_005`
  - `passed`
- `eXemble_사용자 로그인_003`
  - `skipped`
  - SSO disabled

Result:

- `5 passed`
- `1 skipped`

### Security navigation regression

- logout and post-logout protection checks
  - `passed`

Result:

- `3 passed`

### Read-only module regression

- `eXemble_AI서비스_001`
  - `passed`
- `eXemble_AI서비스_003`
  - `passed`
- `eXemble_AI서비스_004`
  - `passed`
- `eXemble_데이터_001`
  - `passed`
- `eXemble_데이터_002`
  - `passed`
- `eXemble_데이터_003`
  - `passed`
- `eXemble_모델_001`
  - `passed`
- `eXemble_모델_002`
  - `passed`
- `eXemble_모델_003`
  - `passed`
- `eXemble_모델_004`
  - `passed`
- `eXemble_도구_001`
  - `passed`
- `eXemble_도구_002`
  - `passed`
- `eXemble_도구_003`
  - `passed`
- `eXemble_권한_001`
  - `failed`
- `eXemble_권한_002`
  - `failed`
- `eXemble_로그_001`
  - `failed`
- `eXemble_로그_002`
  - `failed`
- `eXemble_로그_003`
  - `failed`
- `eXemble_로그_005`
  - `failed`

Result:

- `4 passed`
- `2 failed`
- `1 skipped`

## Remaining Known Issue

The remaining failures are no longer caused by missing `서비스 관리` entry.

Current remaining cause:

- `권한`
- `로그`

Both pages fail at the search step because the harness cannot find an enabled visible page-level search input on those screens.

Interpretation:

- module entry itself likely works
- the next locator to refine is the page-specific search surface for `권한` and `로그`
