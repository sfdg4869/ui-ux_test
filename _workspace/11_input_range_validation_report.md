# Input Range Validation Report

- Run date: `2026-06-17`
- Command: `npx.cmd playwright test input-range.regression.spec.ts --project=regression`
- Scope: safe boundary-value checks that do not save or mutate product data

## Covered TC and limits

| TC-ID | Screen | Manual limit | Automated check |
| --- | --- | --- | --- |
| eXemble_사용자 로그인_004 | 로그인 | 아이디 `5~32자` | `4자`, `33자` 로그인 거부 |
| eXemble_사용자 로그인_005 | 로그인 | 비밀번호 `9~32자` | `8자`, `33자` 로그인 거부 |
| eXemble_사용자 질의_005 | 채팅 입력 | 질의 `최대 5000자` | `5000자` 허용, `5001자` 차단 여부 |
| eXemble_사용자 질의_012 | AI 서비스 검색 | 검색어 `최대 200자` | `200자` 허용, `201자` 차단 여부 |

## Result summary

- `6 passed`
- `2 failed`

## Passed

1. `eXemble_사용자 로그인_004`
   - `4자` 아이디 로그인 시도 거부
   - `33자` 아이디 로그인 시도 거부
2. `eXemble_사용자 로그인_005`
   - `8자` 비밀번호 로그인 시도 거부
   - `33자` 비밀번호 로그인 시도 거부
3. `eXemble_사용자 질의_005`
   - `5000자` 메시지는 입력창에 정상 반영
4. `eXemble_사용자 질의_012`
   - `200자` 검색어는 검색창에 정상 반영

## Failed

1. `eXemble_사용자 질의_005`
   - Expected: `5001자` 입력 시 `5000자 이하`로 제한
   - Observed: 입력창이 `5001자`를 그대로 유지
   - Interpretation: 채팅 입력창에 클라이언트 측 길이 제한이 현재 적용되지 않음
   - Evidence:
     - `test-results/input-range.regression-Inp-19820-longer-than-5000-characters-regression/test-failed-1.png`
     - `test-results/input-range.regression-Inp-19820-longer-than-5000-characters-regression/trace.zip`

2. `eXemble_사용자 질의_012`
   - Expected: `201자` 검색어 입력 시 `200자 이하`로 제한
   - Observed: 검색창이 `201자`를 그대로 유지
   - Interpretation: AI 서비스 검색창에 클라이언트 측 길이 제한이 현재 적용되지 않음
   - Evidence:
     - `test-results/input-range.regression-Inp-92659--longer-than-200-characters-regression/test-failed-1.png`
     - `test-results/input-range.regression-Inp-92659--longer-than-200-characters-regression/trace.zip`

## Notes

- 로그인 범위 테스트는 "길이 범위를 벗어난 값이 인증 흐름에서 거부되는지"를 검증합니다.
- 채팅/검색 테스트는 실제 입력 필드가 초과 길이를 UI에서 막는지 확인합니다.
- 이번 범위에는 저장/등록/수정이 수반되는 쓰기 기능을 넣지 않았습니다.
  - 예: `eXemble_권한_005`, `eXemble_권한_035`, `eXemble_데이터_011`, `eXemble_데이터_012`
- 위 쓰기 기능은 전용 테스트 데이터 또는 정리 가능한 계정이 확보되면 다음 단계로 확장 가능합니다.

## Harness health check

- Follow-up verification command: `npx.cmd playwright test auth.smoke.spec.ts chat.smoke.spec.ts --project=smoke`
- Result: `7 passed`, `1 skipped`
- Meaning: 입력 범위 테스트 추가 후에도 로그인/채팅 핵심 스모크는 정상 유지
