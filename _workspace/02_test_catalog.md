# Checklist Test Catalog

- Total checklist cases: **293**
- Total feature rows: **115**
- Target counts: `auto`=131, `blocked`=6, `manual`=111, `deferred`=45
- Priority counts: `P0`=33, `P1`=76, `P2`=184
- Harness status: `implemented`=152, `manual`=98, `deferred`=38, `blocked`=5
- Source checklist result: `Pass`=202, `N/T`=72, `UNKNOWN`=2, `N/A`=1, `Fail`=16

## 현재 스펙에 연결된 체크리스트 케이스

| TC-ID | 모듈 | 기능명 | 우선순위 | 매핑 Spec |
| --- | --- | --- | --- | --- |
| eXemble_사용자 로그인_001 | 사용자 로그인 | ID/PW 로그인 | P0 | tests\regression\input-range.regression.spec.ts, tests\smoke\auth.smoke.spec.ts |
| eXemble_사용자 로그인_002 | 사용자 로그인 | 아이디 저장 기능 | P0 | tests\smoke\auth.smoke.spec.ts |
| eXemble_사용자 로그인_003 | 사용자 로그인 | SSO 로그인 | P1 | tests\smoke\auth.smoke.spec.ts |
| eXemble_사용자 로그인_004 | 사용자 로그인 | 잘못된 아이디 입력 | P0 | tests\regression\input-range.regression.spec.ts, tests\smoke\auth.smoke.spec.ts |
| eXemble_사용자 로그인_005 | 사용자 로그인 | 잘못된 비밀번호 입력 | P0 | tests\regression\input-range.regression.spec.ts, tests\smoke\auth.smoke.spec.ts |
| eXemble_환경설정_001 | 환경설정 | 다크모드 전환 | P1 | tests\regression\theme.regression.spec.ts |
| eXemble_환경설정_002 | 환경설정 | 라이트모드 전환 | P1 | tests\regression\theme.regression.spec.ts |
| eXemble_환경설정_005 | 환경설정 | 로그인 상태 | P0 | tests\smoke\auth.smoke.spec.ts |
| eXemble_사용자 질의_001 | 사용자 질의 | 신규 채팅 시작 | P0 | tests\smoke\chat.smoke.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_사용자 질의_002 | 사용자 질의 | AI 서비스 목록 조회 | P0 | tests\regression\read-only-deep-dive.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_사용자 질의_003 | 사용자 질의 | 대화내역 목록 확인 | P0 | tests\smoke\chat.smoke.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_사용자 질의_004 | 사용자 질의 | 권한별 대표 서비스 확인 | P0 | tests\regression\planned-user-query-evidence.regression.spec.ts |
| eXemble_사용자 질의_005 | 사용자 질의 | 질의 입력 | P0 | tests\regression\input-range.regression.spec.ts, tests\smoke\chat.smoke.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_사용자 질의_006 | 사용자 질의 | 첨부문서 확인 | P0 | tests\regression\planned-user-query-evidence.regression.spec.ts |
| eXemble_사용자 질의_007 | 사용자 질의 | 답변 및 요약 확인 | P0 | tests\regression\planned-chat-generic.regression.spec.ts |
| eXemble_사용자 질의_008 | 사용자 질의 | 근거 자료 확인 | P0 | tests\regression\planned-user-query-evidence.regression.spec.ts |
| eXemble_사용자 질의_009 | 사용자 질의 | 근거 파일 링크 클릭 | P0 | tests\regression\planned-user-query-evidence.regression.spec.ts |
| eXemble_사용자 질의_010 | 사용자 질의 | 대화내역 검색 | P0 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_사용자 질의_011 | 사용자 질의 | 검색결과 상세 확인 | P0 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_사용자 질의_012 | 사용자 질의 | AI 서비스 검색 | P0 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_사용자 질의_013 | 사용자 질의 | AI 서비스 선택 | P0 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_사용자 질의_014 | 사용자 질의 | 정의되지 않은 질문 | P0 | tests\regression\planned-chat-generic.regression.spec.ts |
| eXemble_대시보드_001 | 대시보드 | 로그인 상태 | P0 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_대시보드_002 | 대시보드 | 서비스 성공율 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_003 | 대시보드 | 서비스 요청수 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_004 | 대시보드 | 서비스 오류율 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_005 | 대시보드 | GPU 온도 실시간 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_006 | 대시보드 | VRAM 사용량 실시간 모니터링 관리자 모드 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_007 | 대시보드 | 응답지연 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_008 | 대시보드 | CPU 사용율 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_009 | 대시보드 | GPU Utilization 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_010 | 대시보드 | GPU Power(W) 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_011 | 대시보드 | Memory(GB) 모니터링 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_012 | 대시보드 | GPU Power Efficiency(FPS/W) 관리자 모드 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_013 | 대시보드 | 개별 서비스 선택 | P0 | tests\regression\dashboard.monitoring.regression.spec.ts |
| eXemble_대시보드_014 | 대시보드 | 전체 자원 보기 | P0 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_데이터_001 | 데이터 | 데이터소스 메뉴 접근 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_데이터_002 | 데이터 | 데이터소스 검색 | P1 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_데이터_003 | 데이터 | 트리 데이터 확인 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_데이터_005 | 데이터 | 검색 시 트리 자동확장 | P1 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_데이터_006 | 데이터 | 데이터 업로드 창 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_007 | 데이터 | 파일 위치 선택 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_010 | 데이터 | 파일 업로드 취소 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_011 | 데이터 | 파일 개수 제한(10개) | P2 | tests\regression\input-upload-limits.regression.spec.ts |
| eXemble_데이터_012 | 데이터 | 파일 용량 제한(100MB) | P2 | tests\regression\input-upload-limits.regression.spec.ts |
| eXemble_데이터_014 | 데이터 | 문서 검색 | P1 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_데이터_019 | 데이터 | DB 연결 상태 확인 | P1 | tests\regression\planned-data-tool-expansion.regression.spec.ts |
| eXemble_데이터_020 | 데이터 | DB 기본정보 확인 | P1 | tests\regression\planned-data-tool-expansion.regression.spec.ts |
| eXemble_데이터_021 | 데이터 | 카탈로그/스키마 확인 | P1 | tests\regression\planned-data-tool-expansion.regression.spec.ts |
| eXemble_데이터_022 | 데이터 | 벡터 테이블 목록 조회 | P1 | tests\regression\planned-data-tool-expansion.regression.spec.ts |
| eXemble_데이터_023 | 데이터 | 전체 필터 조회 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_024 | 데이터 | 상태별 필터 조회 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_025 | 데이터 | 데이터 타입별 필터 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_026 | 데이터 | 벡터 테이블 검색 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_027 | 데이터 | 목록 상세정보 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_029 | 데이터 | 파일 유형 선택 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_033 | 데이터 | 파일 벡터 테이블 취소 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_034 | 데이터 | 폴더 유형 선택 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_035 | 데이터 | 폴더 선택 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_036 | 데이터 | 폴더 선택 취소 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_038 | 데이터 | 데이터베이스 유형 선택 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_039 | 데이터 | 드라이브 선택 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_040 | 데이터 | 드라이브 검색 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_041 | 데이터 | 데이터 미리보기 | P2 | tests\regression\data.create-cancel.regression.spec.ts |
| eXemble_데이터_044 | 데이터 | 벡터 기본정보 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_045 | 데이터 | 벡터화 파일 목록 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_046 | 데이터 | 파일 목록 검색 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_054 | 데이터 | 접근정책 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_055 | 데이터 | 접근정책 미지정 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_056 | 데이터 | 정책 관리로 이동 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_057 | 데이터 | 히스토리 조회 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_데이터_058 | 데이터 | 히스토리 검색 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_모델_001 | 모델 | 모델 메뉴 접근 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_모델_002 | 모델 | 모델 상태정보 확인 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_모델_003 | 모델 | 모델 검색 | P1 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_모델_004 | 모델 | 모델 기본정보 확인 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_모델_007 | 모델 | 리소스 정보 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_모델_008 | 모델 | 사용 에이전트 목록 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_모델_009 | 모델 | 모델 변경 이력 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_도구_001 | 도구 | 도구 메뉴 접근 | P2 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_도구_002 | 도구 | 도구 상세정보 확인 | P2 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_도구_003 | 도구 | 도구 검색 | P2 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_도구_004 | 도구 | 도구 생성-기본정보 | P2 | tests\regression\tool.create-cancel.regression.spec.ts |
| eXemble_도구_005 | 도구 | 요청옵션 입력 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_도구_006 | 도구 | HTTP 헤더 입력 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_도구_007 | 도구 | Path 파라미터 추가 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_도구_008 | 도구 | Query 파라미터 추가 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_도구_009 | 도구 | 요청 본문 입력 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_도구_010 | 도구 | 응답 테스트 | P2 | tests\regression\planned-data-tool-expansion.regression.spec.ts |
| eXemble_도구_014 | 도구 | 도구 생성 취소 | P2 | tests\regression\tool.create-cancel.regression.spec.ts |
| eXemble_AI서비스_001 | AI서비스 | AI 에이전트 메뉴 접근 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_AI서비스_003 | AI서비스 | 에이전트 목록 확인 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_AI서비스_004 | AI서비스 | 에이전트 검색 | P1 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_AI서비스_005 | AI서비스 | 에이전트 생성-기본속성 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_AI서비스_008 | AI서비스 | 프롬프트 입력 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_AI서비스_009 | AI서비스 | 파라미터 설정 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_AI서비스_010 | AI서비스 | 테스트 채팅 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_AI서비스_012 | AI서비스 | 에이전트 생성 취소 | P2 | tests\regression\ai-create-cancel.regression.spec.ts |
| eXemble_AI서비스_033 | AI서비스 | AI 서비스 메뉴 접근 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_034 | AI서비스 | 서비스 목록 정보 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_035 | AI서비스 | 상태별 필터 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_036 | AI서비스 | 서비스 검색 | P1 | tests\regression\input-search-limits.regression.spec.ts |
| eXemble_AI서비스_037 | AI서비스 | 서비스 아이콘 선택 | P2 | tests\regression\ai-service-mutation.regression.spec.ts |
| eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_AI서비스_044 | AI서비스 | 서비스 생성 취소 | P2 | tests\regression\ai-create-cancel.regression.spec.ts |
| eXemble_AI서비스_045 | AI서비스 | 서비스 기본정보 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_046 | AI서비스 | 워크플로우 확인 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_047 | AI서비스 | 워크플로우 확대/축소 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_048 | AI서비스 | 서비스 버전 목록 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_049 | AI서비스 | 버전 검색 | P1 | tests\regression\planned-readonly-expansion.regression.spec.ts |
| eXemble_AI서비스_053 | AI서비스 | 서비스 활성화 | P1 | tests\regression\ai-service-mutation.regression.spec.ts |
| eXemble_AI서비스_054 | AI서비스 | 서비스 비활성화 | P1 | tests\regression\ai-service-mutation.regression.spec.ts |
| eXemble_권한_001 | 권한 | 계정 관리 메뉴 접근 | P1 | tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_권한_002 | 권한 | 계정 검색 | P1 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_권한_004 | 권한 | 계정 등록 팝업 | P2 | tests\regression\permission.create-cancel.regression.spec.ts |
| eXemble_권한_005 | 권한 | 기본정보 입력 | P2 | tests\regression\input-form-limits.regression.spec.ts |
| eXemble_권한_006 | 권한 | 권한정보 선택 | P2 | tests\regression\permission.create-cancel.regression.spec.ts |
| eXemble_권한_008 | 권한 | 계정 등록 취소 | P2 | tests\regression\permission.create-cancel.regression.spec.ts |
| eXemble_권한_013 | 권한 | 조직 관리 메뉴 접근 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_014 | 권한 | 소속 목록 정보 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_016 | 권한 | 소속 추가 취소 | P2 | tests\regression\permission.create-cancel.regression.spec.ts |
| eXemble_권한_022 | 권한 | 직책 추가 취소 | P2 | tests\regression\permission.create-cancel.regression.spec.ts |
| eXemble_권한_028 | 권한 | 벡터테이블 접근정책 메뉴 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_029 | 권한 | 목록 정보 확인 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_030 | 권한 | 접근정책 미지정 안내 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_031 | 권한 | 접근정책 검색 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_033 | 권한 | 기본정보 확인 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_권한_034 | 권한 | 현재 접근정책 확인 | P1 | tests\regression\permission.readonly.regression.spec.ts |
| eXemble_로그_001 | 로그 | 로그 메뉴 접근 | P1 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_로그_002 | 로그 | 로그 목록 정보 | P1 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_로그_003 | 로그 | 요청일시 필터 | P1 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_로그_005 | 로그 | 로그 정렬 | P1 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts |
| eXemble_로그_007 | 로그 | 로그 상세 화면 | P1 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_로그_008 | 로그 | 기본정보 확인 | P1 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_로그_009 | 로그 | 사용자 입력 확인 | P1 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_로그_010 | 로그 | AI 서비스 응답 확인 | P1 | tests\regression\read-only-deep-dive.regression.spec.ts |
| eXemble_시스템_005 | 시스템 | 권장 브라우저 해상도 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_시스템_006 | 시스템 | 최소 브라우저 해상도 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_시스템_009 | 시스템 | 일반 파일 형식 | P2 | tests\regression\input-upload-formats.regression.spec.ts |
| eXemble_시스템_010 | 시스템 | 이미지 파일 형식 | P2 | tests\regression\input-upload-formats.regression.spec.ts |
| eXemble_시스템_011 | 시스템 | 문서 파일 형식 | P2 | tests\regression\input-upload-formats.regression.spec.ts |
| eXemble_시스템_012 | 시스템 | 음성/비디오 파일 형식 | P2 | tests\regression\input-upload-formats.regression.spec.ts |
| eXemble_시스템_013 | 시스템 | 한국어 지원 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_시스템_021 | 시스템 | 로그 기록-요청일시 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_시스템_022 | 시스템 | 로그 기록-서비스명 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_시스템_023 | 시스템 | 로그 기록-입력/응답 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_시스템_026 | 시스템 | 서비스 상태 모니터링 | P1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts |
| eXemble_보안_003 | 보안 | Clickjacking 방지 설정 | P1 | tests\smoke\security.headers.smoke.spec.ts |
| eXemble_보안_004 | 보안 | XSS 공격 방지 설정 | P1 | tests\smoke\security.headers.smoke.spec.ts |
| eXemble_보안_005 | 보안 | CSRF 방지 설정 | P1 | tests\smoke\security.auth-surface.smoke.spec.ts |
| eXemble_보안_006 | 보안 | HSTS 설정 | P1 | tests\smoke\security.headers.smoke.spec.ts |
| eXemble_보안_007 | 보안 | 취약 비밀번호 비활성화 | P1 | tests\regression\security.password-policy.regression.spec.ts |

## 자동화 예정 P0/P1 케이스

| TC-ID | 모듈 | 기능명 | 우선순위 | 차단 사유 |
| --- | --- | --- | --- | --- |

## 원본 체크리스트에서 Fail 로 기록된 항목

| TC-ID | 모듈 | 기능명 | 원본 이슈 | 자동화 대상 |
| --- | --- | --- | --- | --- |
| eXemble_데이터_011 | 데이터 | 파일 개수 제한(10개) | 11개 이상 업로드 가능 UI와 메뉴얼 간의 스펙과 불일치 | manual |
| eXemble_데이터_012 | 데이터 | 파일 용량 제한(100MB) | 100mb 이상 업로드 가능 UI와 메뉴얼 간의 스펙과 불일치 | manual |
| eXemble_권한_005 | 권한 | 기본정보 입력 | 103자 까지 입력 가능 그 후에는 500error | manual |
| eXemble_권한_027 | 권한 | 소속/직책 삭제 제약 | - | manual |
| eXemble_권한_031 | 권한 | 접근정책 검색 | - | auto |
| eXemble_권한_035 | 권한 | 접근정책 추가 | 비밀번호 영문없이도 저장가능 | manual |
| eXemble_권한_037 | 권한 | 접근정책 저장 | - | manual |
| eXemble_시스템_004 | 시스템 | 최대 동시 첨부 파일 수 | - | deferred |
| eXemble_매뉴얼_001 | 매뉴얼 | 오류 FAQ 제공 | 26/01/23 정경수 작성 및 테스트 | manual |
| eXemble_매뉴얼_003 | 매뉴얼 | 데이터 백업 및 복구 절차 제공 | 26/01/23 정경수 작성 및 테스트 | manual |
| eXemble_매뉴얼_004 | 매뉴얼 | 암호 알고리즘 정보 제공 | 26/01/23 정경수 작성 및 테스트 | manual |
| eXemble_매뉴얼_006 | 매뉴얼 | 운영 로그 저장 위치 제공 | 26/01/23 정경수 작성 및 테스트 | manual |
| eXemble_매뉴얼_009 | 매뉴얼 | 개인정보 암호화 알고리즘 명시 보안 관련 매뉴얼이 제공되어 있음 | 26/01/23 정경수 작성 및 테스트 | manual |
| eXemble_보안_005 | 보안 | CSRF 방지 설정 | 26/01/23 정경수 작성 및 테스트 26/03/10 개발자 도구에서 확인 불가 JWT Authorization 헤더 방식으로 인 증 중. CSRF 방지됨 | auto |
| eXemble_보안_009 | 보안 | 데이터 파손 방지 정보 제공 | - | manual |
| eXemble_보안_010 | 보안 | 계정 잠금 정책 | -- 2 of 3 -- TC-ID Depth 1 Depth 2 Depth 3 기능명 Pre-condition Process Expected Result 1차 Result 1차 이슈요약 1차 제품기술연구 comment 1차 개발자 comment 담당자 일정 첨부이미지 -- 3 of 3 -- | manual |