# Automation Definition Inputs

추가 자동화를 위한 사용자 입력 정의는 아래처럼 나눠서 관리합니다.

## 1. 비밀값 / 계정 / 환경별 값

루트 `.env`에 둡니다.

- 현재 기본 로그인 계정
  - `EXEMBLE_USERNAME`
  - `EXEMBLE_PASSWORD`
- 권한 비교용 계정
  - `EXEMBLE_ADMIN_USERNAME`
  - `EXEMBLE_ADMIN_PASSWORD`
  - `EXEMBLE_USER_USERNAME`
  - `EXEMBLE_USER_PASSWORD`
- 쓰기 / 보안 전용 폐기 계정
  - `EXEMBLE_ALLOW_MUTATION_TESTS`
  - `EXEMBLE_MUTATION_USERNAME`
  - `EXEMBLE_MUTATION_PASSWORD`
- 업로드 샘플 경로
  - `EXEMBLE_UPLOAD_*`

원칙:

- 비밀번호, 토큰, 민감한 endpoint 인증값은 `.env`에만 둡니다.
- `_workspace/automation-definitions/*.json` 에는 비밀값을 넣지 않습니다.

## 2. 자동화 기대 결과 / 테스트 대상 정의

아래 JSON 파일에 둡니다.

- `chat-cases.json`
  - 사용자 질의 고정 질문, 기대 답변, 첨부/근거/폴백 규칙
- `data-fixtures.json`
  - 테스트 DB, 기대 상태, 기본정보/스키마, 벡터 테이블 기대값
- `tool-fixtures.json`
  - 호출해도 안전한 도구 테스트 endpoint, payload, 성공 기준
- `ai-service-fixtures.json`
  - 아이콘 선택 검증 기준, 활성화/비활성화 대상 서비스
- `security-policy.json`
  - 비밀번호 정책과 정책 검증용 폐기 계정 식별자
- `mutation-scope.json`
  - 생성/수정/활성화 등 쓰기 테스트 허용 범위와 정리 규칙

## 최소 입력 기준

엄격한 기대값이 없어도 아래 수준이면 자동화 확장이 가능합니다.

- 사용자 질의
  - 질문만 고정되어 있으면 됩니다.
  - 답변 내용이 특정 문구와 정확히 일치할 필요는 없습니다.
  - 기본 기준은 "빈 응답이 아니고, 오류만 내지 않으면 통과" 로 둘 수 있습니다.
- 데이터
  - DB/스키마 상세 기대 문구가 없어도 됩니다.
  - 최소한 비어 있지 않은 대상 이름 1개만 있으면 목록/상세 진입형 테스트를 확장할 수 있습니다.
- 도구
  - 이미 등록된 도구를 써도 됩니다.
  - 단, 호출해도 외부 시스템에 쓰기 부작용이 없는 도구여야 합니다.
- AI 서비스
  - 아이콘은 "선택만 확인" 할지, "저장 후 반영까지 확인" 할지 정하면 됩니다.
  - 활성화/비활성화는 운영 영향이 없는 폐기용 서비스 1개가 필요합니다.
- 보안/쓰기 기능
  - 실제 공유 계정이 아닌 전용 테스트 계정이 필요합니다.
  - 비밀번호 등 민감값은 `.env` 에만 넣습니다.

## 3. 실제 업로드 샘플 파일

실제 파일은 다음 위치에 둡니다.

- `file_upload_test/`

예:

- `file_upload_test/99MB`
- `file_upload_test/100MB`
- `file_upload_test/101MB`

## 4. 문서 원본

매뉴얼/체크리스트 원본은 `manual/` 에 유지합니다.

## 권장 입력 순서

1. `.env` 에 계정과 경로를 입력
2. `chat-cases.json` 에 질문/기대결과 입력
3. `data-fixtures.json` 에 테스트 DB/벡터 대상 입력
4. `tool-fixtures.json` 에 안전 endpoint 입력
5. `ai-service-fixtures.json` / `security-policy.json` / `mutation-scope.json` 입력

## 메모

- 지금 파일들은 하네스 확장용 입력 템플릿입니다.
- 이후 spec 생성 시 이 경로들을 기준으로 읽어오면 됩니다.
- 계정 등록 UI 기준 필드는 현재 `이름`, `이메일`, `비밀번호`, `역할`, `소속`, `직책` 으로 확인되어 있습니다.
- 쓰기 테스트를 실제로 돌릴 때는 `.env` 에서 아래를 같이 맞춥니다.
  - `EXEMBLE_ALLOW_MUTATION_TESTS=1`
  - `EXEMBLE_MUTATION_USERNAME=<전용 테스트 계정>`
  - `EXEMBLE_MUTATION_PASSWORD=<전용 테스트 계정 비밀번호>`
