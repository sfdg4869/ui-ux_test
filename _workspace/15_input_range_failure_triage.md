# Input Range Failure Triage

- Baseline run: `33 tests`
- Result: `6 passed`, `27 failed`, `2 skipped`
- Scope: input length/range validation only
- Interpretation rule:
  - `Failed` means the harness successfully opened the target field and compared the manual limit with the actual UI behavior.
  - If the observed length is `manual + 1` or another over-limit value, this is a **product-side spec mismatch**.
  - If the harness read the wrong DOM surface, this is a **harness issue** and should not be counted as a product defect.

## 1. Executive summary

- Confirmed product-side spec mismatches: `27`
- Harness issues affecting interpretation: `1` historical issue, already fixed
- Environment issues: not part of the `33-test / 27-fail` baseline run
- Skipped by design: `2`

## 2. Confirmed product-side spec mismatches

아래 항목들은 테스트 의도대로 동작했고, 실제 제품이 매뉴얼 스펙을 넘는 값을 허용해서 실패한 케이스입니다.

### A. 200자 제한인데 201자를 허용한 케이스

| TC-ID | 화면/필드 | 매뉴얼 기준 | 실제 관측 | 분류 |
| --- | --- | --- | --- | --- |
| eXemble_AI서비스_038 | AI 서비스 이름 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_005 | AI 에이전트 이름 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_005 | AI 에이전트 설명 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_005 | 도구 엔드포인트 URL | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_006 | 도구 헤더명 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_006 | 도구 헤더값 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_007 | 도구 Path 파라미터명 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_007 | 도구 Path 파라미터값 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_007 | 도구 Path 설명 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_008 | 도구 Query 파라미터명 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_008 | 도구 Query 파라미터값 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_008 | 도구 Query 설명 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_권한_005 | 계정 등록 이름 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_권한_005 | 계정 등록 이메일 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_036 | AI 서비스 검색어 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_004 | AI 에이전트 검색어 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_데이터_002 | 데이터 검색어 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_모델_003 | 모델 검색어 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_도구_003 | 도구 검색어 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |
| eXemble_권한_002 | 계정 검색어 | 최대 200자 | 201자 허용 | 제품 스펙 불일치 |

### B. 5000자 제한인데 5001자를 허용한 케이스

| TC-ID | 화면/필드 | 매뉴얼 기준 | 실제 관측 | 분류 |
| --- | --- | --- | --- | --- |
| eXemble_사용자 질의_005 | 채팅 입력창 | 최대 5000자 | 5001자 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_008 | AI 에이전트 프롬프트 | 최대 5000자 | 5001자 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_010 | AI 에이전트 테스트 채팅 | 최대 5000자 | 5001자 허용 | 제품 스펙 불일치 |
| eXemble_도구_009 | 도구 요청 본문 | 최대 5000자 | 5001자 허용 | 제품 스펙 불일치 |

### C. 숫자 자리수 제한을 초과 허용한 케이스

| TC-ID | 화면/필드 | 매뉴얼 기준 | 실제 관측 | 분류 |
| --- | --- | --- | --- | --- |
| eXemble_AI서비스_009 | 온도 | 최대 2자리 | 3자리 허용 | 제품 스펙 불일치 |
| eXemble_AI서비스_009 | 최대 토큰 수 | 최대 10자리 | 11자리 허용 | 제품 스펙 불일치 |

### D. 비밀번호 길이 제한을 초과 허용한 케이스

| TC-ID | 화면/필드 | 매뉴얼 기준 | 실제 관측 | 분류 |
| --- | --- | --- | --- | --- |
| eXemble_권한_005 | 계정 등록 비밀번호 | 최대 20자 | 21자 허용 | 제품 스펙 불일치 |

## 3. Passed cases

아래는 현재 기준으로 스펙과 일치하게 동작한 케이스입니다.

| TC-ID | 화면/필드 | 매뉴얼 기준 | 결과 |
| --- | --- | --- | --- |
| eXemble_사용자 로그인_004 | 아이디 길이 하한/상한 | 5~32자 | 정상 거부 |
| eXemble_사용자 로그인_005 | 비밀번호 길이 하한/상한 | 9~32자 | 정상 거부 |
| eXemble_AI서비스_038 | 사용자 설명 | 최대 100자 | 스펙 일치 |
| eXemble_AI서비스_038 | 식별 설명 | 최대 100자 | 스펙 일치 |

## 4. Skipped cases

이 두 케이스는 제품 실패가 아니라, 샘플 데이터 파일 경로가 `.env`에 없어서 보류된 케이스입니다.

| TC-ID | 케이스 | 상태 | 이유 |
| --- | --- | --- | --- |
| eXemble_데이터_011 | 업로드 최대 10개 파일 제한 | skipped | `EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR` 미설정 |
| eXemble_데이터_012 | 100MB 초과 파일 제한 | skipped | `EXEMBLE_UPLOAD_LIMIT_100MB_FILE` 미설정 |

## 5. Harness issues

### Historical harness issue already fixed

| 대상 | 이전 오판 | 원인 | 현재 상태 |
| --- | --- | --- | --- |
| eXemble_도구_009 도구 요청 본문 | 2048자까지만 읽는 것처럼 보임 | CodeMirror 에디터에서 렌더된 DOM `textContent`만 읽음 | 수정 완료. 이제 실제 editor doc 길이를 읽음 |

수정 후 재검증 결과:

- `5000자 입력`은 정상 통과
- `5001자 입력`도 허용되어 최종적으로는 제품 스펙 불일치로 분류

## 6. Environment notes

이후 일부 별도 재실행에서는 셸 네트워크 제한 때문에 `ERR_NETWORK_ACCESS_DENIED`가 발생했습니다.

이 값은 **제품 결함 분류용 기준 결과에 포함하지 않습니다.**

즉, 이 문서의 `27 failed`는 네트워크 실패가 아니라, 정상 실행된 baseline run에서 수집한 입력 제한 실패를 정리한 것입니다.

## 7. Conclusion

- 현재 기준으로 `27 failed`는 대체로 “테스트가 실패한 것”이 아니라 “제품이 매뉴얼 입력 스펙을 지키지 못한 것”으로 해석하면 됩니다.
- 단, 하네스 자체 문제가 있었던 것은 `도구 요청 본문` 1건이었고, 이 부분은 이미 수정해서 다시 확인했습니다.
- 따라서 현재 남은 핵심 액션은 하네스 수정이 아니라 제품 입력 제한 정책 적용 여부를 화면별로 점검하는 것입니다.
