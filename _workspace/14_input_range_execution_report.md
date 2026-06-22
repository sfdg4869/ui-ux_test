# Input Range Execution Report

- Run date: `2026-06-17`
- Harness root: `C:\Users\jungkyungsoo\Desktop\jks\개발\exemble`
- Catalog source: `manual/` -> `_workspace/test-catalog.json`

## Generated artifacts

- Input range matrix: `_workspace/12_input_range_matrix.md`
- Input field inventory: `_workspace/13_input_field_inventory.md`
- Auto-ready specs:
  - `tests/regression/input-range.regression.spec.ts`
  - `tests/regression/input-search-limits.regression.spec.ts`
  - `tests/regression/input-form-limits.regression.spec.ts`
- Auto-with-test-data spec:
  - `tests/regression/input-upload-limits.regression.spec.ts`

## Extraction summary

- Total extracted field rules: `52`
- `auto-ready`: `30`
- `auto-with-test-data`: `2`
- `manual`: `19`
- `blocked`: `1`

## Commands

```powershell
npm.cmd run input-range:build
npx.cmd playwright test tests/regression/input-range.regression.spec.ts tests/regression/input-search-limits.regression.spec.ts tests/regression/input-form-limits.regression.spec.ts --project=regression
npx.cmd playwright test tests/regression/input-upload-limits.regression.spec.ts --project=regression
```

## Latest result summary

- Input matrix generation: `passed`
- Auto-ready range suite: `33 tests`, `6 passed`, `27 failed`
- Upload-limit suite: `2 skipped`
  - Activation requires `.env` values:
    - `EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR`
    - `EXEMBLE_UPLOAD_LIMIT_100MB_FILE`

## Passed checks

1. `eXemble_사용자 로그인_004`
   - 아이디 `4자` 로그인 거부
   - 아이디 `33자` 로그인 거부
2. `eXemble_사용자 로그인_005`
   - 비밀번호 `8자` 로그인 거부
   - 비밀번호 `33자` 로그인 거부
3. `eXemble_AI서비스_038`
   - 사용자 설명 `100자` 제한 준수
   - 식별 설명 `100자` 제한 준수

## Failed checks

### 1. 검색 필드 200자 제한 미준수

- `eXemble_AI서비스_036` AI 서비스 검색
- `eXemble_AI서비스_004` AI 에이전트 검색
- `eXemble_데이터_002` 데이터 검색
- `eXemble_모델_003` 모델 검색
- `eXemble_도구_003` 도구 검색
- `eXemble_권한_002` 계정 검색

Observed:
- 각 검색창이 `201자` 입력까지 그대로 허용됨

### 2. 채팅/프롬프트 5000자 제한 미준수

- `eXemble_사용자 질의_005` 채팅 입력창
- `eXemble_AI서비스_008` AI 에이전트 프롬프트
- `eXemble_AI서비스_010` AI 에이전트 테스트 채팅
- `eXemble_도구_009` 도구 요청 본문

Observed:
- 5000자 초과 입력 차단이 적용되지 않음
- 채팅 입력창과 프롬프트 입력창에서는 `5001자` 허용이 확인됨

### 3. 200자 일반 텍스트 필드 제한 미준수

- `eXemble_AI서비스_038` AI 서비스 이름
- `eXemble_AI서비스_005` AI 에이전트 이름
- `eXemble_AI서비스_005` AI 에이전트 설명
- `eXemble_도구_005` 도구 엔드포인트 URL
- `eXemble_도구_006` 도구 헤더명
- `eXemble_도구_006` 도구 헤더값
- `eXemble_도구_007` 도구 Path 파라미터명
- `eXemble_도구_007` 도구 Path 파라미터값
- `eXemble_도구_007` 도구 Path 설명
- `eXemble_도구_008` 도구 Query 파라미터명
- `eXemble_도구_008` 도구 Query 파라미터값
- `eXemble_도구_008` 도구 Query 설명
- `eXemble_권한_005` 계정 등록 이름
- `eXemble_권한_005` 계정 등록 이메일

Observed:
- 대표 케이스들에서 `201자`가 그대로 허용됨

### 4. 숫자 길이 제한 미준수

- `eXemble_AI서비스_009` 온도
- `eXemble_AI서비스_009` 최대 토큰 수

Observed:
- 온도 필드는 `2자리` 대신 `3자리` 입력 허용
- 최대 토큰 수는 `10자리` 대신 `11자리` 입력 허용

### 5. 계정 등록 비밀번호 길이 제한 미준수

- `eXemble_권한_005` 계정 등록 비밀번호

Observed:
- 메뉴얼의 `8~20자` 범위보다 긴 입력 차단이 적용되지 않음

## Interpretation

- 로그인 화면의 기본 길이 검증은 일부 동작함
- 서비스 관리 이후 화면의 다수 입력 필드에서는 메뉴얼 기반 길이 제한이 실제 UI에 반영되지 않음
- 현재 실패 대부분은 하네스 오동작이 아니라, `limit + 1` 값이 실제 화면에 그대로 남는 제품 동작 차이로 확인됨

## Evidence

- HTML report: `playwright-report/index.html`
- Failed screenshots/traces: `test-results/`
- Example evidence paths:
  - `test-results/input-form-limits.regressi-4e79a-I-서비스-이름은-메뉴얼-기준-길이-제한을-지킨다-regression/trace.zip`
  - `test-results/input-range.regression-Inp-f4159-5000-character-manual-limit-regression/trace.zip`
  - `test-results/input-search-limits.regres-d0bf9-색어는-메뉴얼-기준-최대-200자를-넘기지-않는다-regression/trace.zip`

## Next activation step

업로드 제한 2건까지 실제 실행하려면 `.env`에 아래 경로만 추가하면 됩니다.

```powershell
EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR=C:\path\to\11-files-folder
EXEMBLE_UPLOAD_LIMIT_100MB_FILE=C:\path\to\over-100mb-file.bin
```
