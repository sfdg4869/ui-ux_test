# Manual Input Coverage Report

- Generated from: `_workspace\12_input_range_matrix.json`
- Total extracted rules: **55**
- Auto-ready: **25**
- Auto with sample data: **10**
- Manual: **15**
- Deferred: **3**
- Blocked: **2**
- Manual PDF supplement rows kept: **16**

## Status Meaning

| Status | Meaning |
| --- | --- |
| `auto-ready` | 지금 바로 Playwright spec로 실행 가능한 입력 범위 규칙 |
| `auto-with-test-data` | 샘플 파일이나 추가 fixture가 있으면 자동 실행 가능한 규칙 |
| `manual` | 쓰기 위험, 상태 의존성, 또는 안전한 경로 미확보로 수동 검증 권장 |
| `deferred` | 상세 UI 계약이나 테스트 데이터가 더 필요해 다음 단계로 미룬 규칙 |
| `blocked` | 현 환경만으로는 검증이 어려운 규칙 |

## Manual PDF Additions

체크리스트만으로는 빠졌던 매뉴얼 기반 입력 규칙 중 현재 매트릭스에 유지된 항목입니다.

| TC-ID | 필드 | 규칙 | 상태 | Spec |
| --- | --- | --- | --- | --- |
| eXemble_도구_011 | 유형본문 | 최대 5000자 | deferred | - |
| eXemble_시스템_009 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_009 | 허용 확장자 | 지원 형식: .txt, .md, .csv, .tsv, .html, .htm | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_010 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_010 | 허용 확장자 | 지원 형식: .jpg, .jpeg, .png, .tif, .tiff, .bmp, .gif, .webp | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_011 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_011 | 허용 확장자 | 지원 형식: .pdf, .doc, .docx, .odt, .hwp, .hwpx, .hwtx, .owpml, .ppt, .pptx, .odp, .xls, .xlsx, .ods, .rtf | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_012 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_시스템_012 | 허용 확장자 | 지원 형식: .mp3, .wav, .mp4, .avi | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts |
| eXemble_AI서비스_005 | 에이전트 설명 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts |
| eXemble_AI서비스_005 | 에이전트명 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts |
| eXemble_AI서비스_038 | 사용자설명 | 최대 100자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts |
| eXemble_AI서비스_038 | 식별 설명 | 최대 100자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts |
| eXemble_AI서비스_057 | 사용자설명 | 최대 100자 | manual | - |
| eXemble_AI서비스_057 | 식별 설명 | 최대 100자 | manual | - |
| eXemble_AI서비스_057 | 이름 | 최대 200자 | manual | - |

## Remaining Non-Automated Rules

| TC-ID | 필드 | 규칙 | 상태 | 사유 |
| --- | --- | --- | --- | --- |
| eXemble_권한_031 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_데이터_014 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_데이터_026 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_데이터_040 | 검색어 | 최대 200자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_046 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_데이터_058 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_모델_005 | 모델명 수정 | 최대 200자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_사용자 질의_010 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_사용자 질의_012 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_환경설정_003 | 비밀번호 | 8~20자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_환경설정_003 | 새 비밀번호 | 8~20자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_049 | 검색어 | 최대 200자 | manual | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| eXemble_AI서비스_057 | 사용자설명 | 최대 100자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_057 | 식별 설명 | 최대 100자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_057 | 이름 | 최대 200자 | manual | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_011 | 유형본문 | 최대 5000자 | deferred | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_020 | 새 모델 이름 | 최대 200자 | deferred | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_027 | 평가명 | 최대 200자 | deferred | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_003 | 동시 접속 사용자 | 최대 1000명 | blocked | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| eXemble_시스템_004 | 첨부 파일 수 | 최대 9개 | blocked | 동시 첨부 검증용 다수 파일과 환경 제어 필요 |

## How To Use

1. `npm.cmd run input-range:build`를 실행하면 입력 범위 매트릭스와 이 보고서가 다시 생성됩니다.
2. `npm.cmd run test:input-range`를 실행하면 자동화 가능한 입력 범위 spec만 회귀로 실행됩니다.
3. 실패가 나오면 Playwright 리포트의 `observed=` annotation과 `_workspace/15_input_range_failure_triage.md`를 같이 보면 됩니다.
