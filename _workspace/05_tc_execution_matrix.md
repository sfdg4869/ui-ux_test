# TC Execution Matrix

| TC-ID | Module | Feature | Target | Priority | Harness Status | Current Run | Run Count | Mapped Specs | Reason / Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| eXemble_사용자 로그인_001 | 사용자 로그인 | ID/PW 로그인 | auto | P0 | implemented | failed | 3 | tests\regression\input-range.regression.spec.ts, tests\smoke\auth.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m32[39m Received: [31m33[39m |
| eXemble_사용자 로그인_002 | 사용자 로그인 | 아이디 저장 기능 | auto | P0 | implemented | passed | 1 | tests\smoke\auth.smoke.spec.ts | - |
| eXemble_사용자 로그인_003 | 사용자 로그인 | SSO 로그인 | blocked | P1 | implemented | skipped | 1 | tests\smoke\auth.smoke.spec.ts | 현재 환경에서 SSO 버튼이 비활성화되어 있어 SSO 연동 환경이 준비되어야 합니다. |
| eXemble_사용자 로그인_004 | 사용자 로그인 | 잘못된 아이디 입력 | auto | P0 | implemented | passed | 3 | tests\regression\input-range.regression.spec.ts, tests\smoke\auth.smoke.spec.ts | - |
| eXemble_사용자 로그인_005 | 사용자 로그인 | 잘못된 비밀번호 입력 | auto | P0 | implemented | passed | 3 | tests\regression\input-range.regression.spec.ts, tests\smoke\auth.smoke.spec.ts | - |
| eXemble_환경설정_001 | 환경설정 | 다크모드 전환 | auto | P1 | implemented | passed | 1 | tests\regression\theme.regression.spec.ts | - |
| eXemble_환경설정_002 | 환경설정 | 라이트모드 전환 | auto | P1 | implemented | passed | 1 | tests\regression\theme.regression.spec.ts | - |
| eXemble_환경설정_003 | 환경설정 | 비밀번호 변경 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_환경설정_004 | 환경설정 | 비밀번호 변경 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_환경설정_005 | 환경설정 | 로그인 상태 | auto | P0 | implemented | passed | 1 | tests\smoke\auth.smoke.spec.ts | - |
| eXemble_사용자 질의_001 | 사용자 질의 | 신규 채팅 시작 | auto | P0 | implemented | passed | 3 | tests\smoke\chat.smoke.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_사용자 질의_002 | 사용자 질의 | AI 서비스 목록 조회 | auto | P0 | implemented | passed | 3 | tests\regression\read-only-deep-dive.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_사용자 질의_003 | 사용자 질의 | 대화내역 목록 확인 | auto | P0 | implemented | passed | 2 | tests\smoke\chat.smoke.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_사용자 질의_004 | 사용자 질의 | 권한별 대표 서비스 확인 | auto | P0 | implemented | passed | 1 | tests\regression\planned-user-query-evidence.regression.spec.ts | - |
| eXemble_사용자 질의_005 | 사용자 질의 | 질의 입력 | auto | P0 | implemented | failed | 4 | tests\regression\input-range.regression.spec.ts, tests\smoke\chat.smoke.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_사용자 질의_006 | 사용자 질의 | 첨부문서 확인 | auto | P0 | implemented | failed | 1 | tests\regression\planned-user-query-evidence.regression.spec.ts | Error: eXemble_사용자 질의_006 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다. [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBeNull[2m()[22m Received: [31mnull[39m |
| eXemble_사용자 질의_007 | 사용자 질의 | 답변 및 요약 확인 | auto | P0 | implemented | passed | 1 | tests\regression\planned-chat-generic.regression.spec.ts | - |
| eXemble_사용자 질의_008 | 사용자 질의 | 근거 자료 확인 | auto | P0 | implemented | failed | 1 | tests\regression\planned-user-query-evidence.regression.spec.ts | Error: eXemble_사용자 질의_008 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다. [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBeNull[2m()[22m Received: [31mnull[39m |
| eXemble_사용자 질의_009 | 사용자 질의 | 근거 파일 링크 클릭 | auto | P0 | implemented | failed | 1 | tests\regression\planned-user-query-evidence.regression.spec.ts | Error: eXemble_사용자 질의_009 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다. [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBeNull[2m()[22m Received: [31mnull[39m |
| eXemble_사용자 질의_010 | 사용자 질의 | 대화내역 검색 | auto | P0 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_사용자 질의_011 | 사용자 질의 | 검색결과 상세 확인 | auto | P0 | implemented | failed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | Error: 대화 내역에서 클릭 가능한 결과 항목을 찾지 못했습니다. |
| eXemble_사용자 질의_012 | 사용자 질의 | AI 서비스 검색 | auto | P0 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_사용자 질의_013 | 사용자 질의 | AI 서비스 선택 | auto | P0 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_사용자 질의_014 | 사용자 질의 | 정의되지 않은 질문 | auto | P0 | implemented | passed | 1 | tests\regression\planned-chat-generic.regression.spec.ts | - |
| eXemble_대시보드_001 | 대시보드 | 로그인 상태 | auto | P0 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_대시보드_002 | 대시보드 | 서비스 성공율 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_003 | 대시보드 | 서비스 요청수 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_004 | 대시보드 | 서비스 오류율 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_005 | 대시보드 | GPU 온도 실시간 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_006 | 대시보드 | VRAM 사용량 실시간 모니터링 관리자 모드 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_007 | 대시보드 | 응답지연 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_008 | 대시보드 | CPU 사용율 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_009 | 대시보드 | GPU Utilization 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_010 | 대시보드 | GPU Power(W) 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_011 | 대시보드 | Memory(GB) 모니터링 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_012 | 대시보드 | GPU Power Efficiency(FPS/W) 관리자 모드 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_013 | 대시보드 | 개별 서비스 선택 | auto | P0 | implemented | passed | 1 | tests\regression\dashboard.monitoring.regression.spec.ts | - |
| eXemble_대시보드_014 | 대시보드 | 전체 자원 보기 | auto | P0 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_데이터_001 | 데이터 | 데이터소스 메뉴 접근 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_데이터_002 | 데이터 | 데이터소스 검색 | auto | P1 | implemented | failed | 3 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_데이터_003 | 데이터 | 트리 데이터 확인 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_데이터_004 | 데이터 | 저장 용량 확인 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_005 | 데이터 | 검색 시 트리 자동확장 | auto | P1 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_데이터_006 | 데이터 | 데이터 업로드 창 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_007 | 데이터 | 파일 위치 선택 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_008 | 데이터 | 파일 드래그앤드랍 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_009 | 데이터 | 파일 업로드 확인 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_010 | 데이터 | 파일 업로드 취소 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_011 | 데이터 | 파일 개수 제한(10개) | manual | P2 | implemented | skipped | 1 | tests\regression\input-upload-limits.regression.spec.ts | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_012 | 데이터 | 파일 용량 제한(100MB) | manual | P2 | implemented | passed | 1 | tests\regression\input-upload-limits.regression.spec.ts | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_013 | 데이터 | 업로드한 문서 관리 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_014 | 데이터 | 문서 검색 | auto | P1 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_데이터_015 | 데이터 | 파일/폴더 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_016 | 데이터 | 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_017 | 데이터 | 새폴더 생성 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_018 | 데이터 | 하위 테이블 토글 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_데이터_019 | 데이터 | DB 연결 상태 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-data-tool-expansion.regression.spec.ts | - |
| eXemble_데이터_020 | 데이터 | DB 기본정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-data-tool-expansion.regression.spec.ts | - |
| eXemble_데이터_021 | 데이터 | 카탈로그/스키마 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-data-tool-expansion.regression.spec.ts | - |
| eXemble_데이터_022 | 데이터 | 벡터 테이블 목록 조회 | auto | P1 | implemented | passed | 1 | tests\regression\planned-data-tool-expansion.regression.spec.ts | - |
| eXemble_데이터_023 | 데이터 | 전체 필터 조회 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_024 | 데이터 | 상태별 필터 조회 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_025 | 데이터 | 데이터 타입별 필터 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_026 | 데이터 | 벡터 테이블 검색 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_027 | 데이터 | 목록 상세정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_028 | 데이터 | 파일 벡터 테이블 생성-기본정보 벡터화 목록 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_029 | 데이터 | 파일 유형 선택 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_030 | 데이터 | 파일 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_031 | 데이터 | 벡터화 대상 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_032 | 데이터 | 파일 벡터 테이블 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_033 | 데이터 | 파일 벡터 테이블 취소 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_034 | 데이터 | 폴더 유형 선택 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_035 | 데이터 | 폴더 선택 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_036 | 데이터 | 폴더 선택 취소 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_037 | 데이터 | 폴더 벡터 테이블 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_038 | 데이터 | 데이터베이스 유형 선택 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_039 | 데이터 | 드라이브 선택 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_040 | 데이터 | 드라이브 검색 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_041 | 데이터 | 데이터 미리보기 | auto | P2 | implemented | passed | 1 | tests\regression\data.create-cancel.regression.spec.ts | - |
| eXemble_데이터_042 | 데이터 | 쿼리 입력 및 실행 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_043 | 데이터 | DB 벡터 테이블 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_044 | 데이터 | 벡터 기본정보 확인 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_045 | 데이터 | 벡터화 파일 목록 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_046 | 데이터 | 파일 목록 검색 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_047 | 데이터 | 벡터 데이터 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_048 | 데이터 | 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_049 | 데이터 | 편집 화면 이동 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_050 | 데이터 | 재벡터화 시작 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_051 | 데이터 | 재벡터화 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_052 | 데이터 | 벡터화 작업 중단 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_053 | 데이터 | 중단 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_054 | 데이터 | 접근정책 확인 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_055 | 데이터 | 접근정책 미지정 확인 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_056 | 데이터 | 정책 관리로 이동 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_057 | 데이터 | 히스토리 조회 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_058 | 데이터 | 히스토리 검색 | auto | P1 | implemented | skipped | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_데이터_059 | 데이터 | 편집 시 데이터 유형 확인 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_060 | 데이터 | 벡터화 대상 재구성 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_061 | 데이터 | 벡터화 대상 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_062 | 데이터 | 편집 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_063 | 데이터 | 편집 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_064 | 데이터 | 저장 없이 페이지 이동 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_001 | 모델 | 모델 메뉴 접근 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_모델_002 | 모델 | 모델 상태정보 확인 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_모델_003 | 모델 | 모델 검색 | auto | P1 | implemented | failed | 3 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_모델_004 | 모델 | 모델 기본정보 확인 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_모델_005 | 모델 | 모델명 수정 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_006 | 모델 | 모델명 수정 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_007 | 모델 | 리소스 정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_모델_008 | 모델 | 사용 에이전트 목록 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_모델_009 | 모델 | 모델 변경 이력 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_모델_010 | 모델 | 파인튜닝 시작 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_011 | 모델 | 파인튜닝 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_012 | 모델 | 파인튜닝 종료 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_013 | 모델 | 파인튜닝 재시작(오류 시) | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_014 | 모델 | 모델 배포 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_015 | 모델 | 배포 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_016 | 모델 | 모델 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_017 | 모델 | 모델 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_001 | 도구 | 도구 메뉴 접근 | deferred | P2 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_002 | 도구 | 도구 상세정보 확인 | deferred | P2 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_003 | 도구 | 도구 검색 | deferred | P2 | implemented | failed | 3 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_004 | 도구 | 도구 생성-기본정보 | auto | P2 | implemented | passed | 1 | tests\regression\tool.create-cancel.regression.spec.ts | - |
| eXemble_도구_005 | 도구 | 요청옵션 입력 | manual | P2 | implemented | failed | 1 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_006 | 도구 | HTTP 헤더 입력 | manual | P2 | implemented | failed | 2 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_007 | 도구 | Path 파라미터 추가 | manual | P2 | implemented | failed | 3 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_008 | 도구 | Query 파라미터 추가 | manual | P2 | implemented | failed | 3 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_009 | 도구 | 요청 본문 입력 | manual | P2 | implemented | failed | 1 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_도구_010 | 도구 | 응답 테스트 | auto | P2 | implemented | skipped | 1 | tests\regression\planned-data-tool-expansion.regression.spec.ts | - |
| eXemble_도구_011 | 도구 | 테스트 실행 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_012 | 도구 | 테스트 창 닫기 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_013 | 도구 | 도구 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_014 | 도구 | 도구 생성 취소 | auto | P2 | implemented | passed | 1 | tests\regression\tool.create-cancel.regression.spec.ts | - |
| eXemble_AI서비스_001 | AI서비스 | AI 에이전트 메뉴 접근 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_AI서비스_002 | AI서비스 | 사용자 피드백 순위 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_003 | AI서비스 | 에이전트 목록 확인 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_AI서비스_004 | AI서비스 | 에이전트 검색 | auto | P1 | implemented | failed | 3 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_005 | AI서비스 | 에이전트 생성-기본속성 | manual | P2 | implemented | failed | 2 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_006 | AI서비스 | 벡터테이블 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_007 | AI서비스 | 벡터테이블 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_008 | AI서비스 | 프롬프트 입력 | manual | P2 | implemented | failed | 1 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_AI서비스_009 | AI서비스 | 파라미터 설정 | manual | P2 | implemented | failed | 2 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m2[39m Received: [31m3[39m |
| eXemble_AI서비스_010 | AI서비스 | 테스트 채팅 | manual | P2 | implemented | failed | 1 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_AI서비스_011 | AI서비스 | 에이전트 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_012 | AI서비스 | 에이전트 생성 취소 | auto | P2 | implemented | passed | 1 | tests\regression\ai-create-cancel.regression.spec.ts | - |
| eXemble_AI서비스_013 | AI서비스 | 기본속성 확인 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_014 | AI서비스 | 파라미터 확인 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_015 | AI서비스 | 프롬프트 확인 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_016 | AI서비스 | 참조 AI서비스 목록 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_017 | AI서비스 | 버전별 이전내역 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_018 | AI서비스 | 버전 비교 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_019 | AI서비스 | 버전 상하 이동 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_020 | AI서비스 | 새 모델 이름 입력 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_021 | AI서비스 | 피드백 선택 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_022 | AI서비스 | 피드백 선택 해제 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_023 | AI서비스 | 피드백 반영 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_024 | AI서비스 | 피드백 반영 취소 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_025 | AI서비스 | 버전별 성능 비교 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_026 | AI서비스 | 평가 목록 확인 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_027 | AI서비스 | 새 평가 시작 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_028 | AI서비스 | 평가 취소 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_029 | AI서비스 | 에이전트 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_030 | AI서비스 | 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_031 | AI서비스 | 에이전트 편집 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_032 | AI서비스 | 버전 배포 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_033 | AI서비스 | AI 서비스 메뉴 접근 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_034 | AI서비스 | 서비스 목록 정보 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_035 | AI서비스 | 상태별 필터 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_036 | AI서비스 | 서비스 검색 | auto | P1 | implemented | failed | 1 | tests\regression\input-search-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_037 | AI서비스 | 서비스 아이콘 선택 | auto | P2 | implemented | failed | 1 | tests\regression\ai-service-mutation.regression.spec.ts | Error: The saved icon should still be selected after reopening the edit screen. [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m Expected: [32m"M[7m2[27m 2[7m2V5q0-.824.587-1.413A1.93 1.93 0 0 1 4 3h16[27mq.824 0 1.413.587.586.589.587 1.413v1[7m1[27mq0 .824-.587 1.413A1.93 1.93 0 0 1 [7m20 18H6zm3.15-6H20V5H4v12.125z[27m"[39m Received: [31m"M[7m5[27m 2[7m1q-.824 0-1.413-.587A1.93 1.93 0 0 1 3 19V5q0-.824.587-1.413A1.93 1.93 0 0 1 5 3h4.2a3 3 0 0 1 1.088-1.45A2.86 2.86 0 0 1 12 1q.95 0 1.713.55.762.55 1.087 1.45H19[27mq.824 0 1.413.587.586.589.587 1.413v1[7m4[27mq0 .824-.587 1.413A1.93 1.93 0 0 1 [7m19 21zm0-2h14V5H5zm2-2h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zm5-4.75a.73.73 0 0 0 .75-.75.73.73 0 0 0-.75-.75.73.73 0 0 0-.75.75.73.73 0 0 0 .75.75[27m"[39m |
| eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | manual | P2 | implemented | failed | 3 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_039 | AI서비스 | 접근대상 설정 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_040 | AI서비스 | 워크플로우-에이전트 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_041 | AI서비스 | 워크플로우-도구 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_042 | AI서비스 | 워크플로우-분기문 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_043 | AI서비스 | 서비스 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_044 | AI서비스 | 서비스 생성 취소 | auto | P2 | implemented | passed | 1 | tests\regression\ai-create-cancel.regression.spec.ts | - |
| eXemble_AI서비스_045 | AI서비스 | 서비스 기본정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_046 | AI서비스 | 워크플로우 확인 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_047 | AI서비스 | 워크플로우 확대/축소 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_048 | AI서비스 | 서비스 버전 목록 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_049 | AI서비스 | 버전 검색 | auto | P1 | implemented | passed | 1 | tests\regression\planned-readonly-expansion.regression.spec.ts | - |
| eXemble_AI서비스_050 | AI서비스 | 서비스 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_051 | AI서비스 | 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_052 | AI서비스 | 서비스 편집 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_053 | AI서비스 | 서비스 활성화 | auto | P1 | implemented | failed | 1 | tests\regression\ai-service-mutation.regression.spec.ts | Error: Service activation: expected active but observed inactive. Latest notification: none |
| eXemble_AI서비스_054 | AI서비스 | 서비스 비활성화 | auto | P1 | implemented | failed | 1 | tests\regression\ai-service-mutation.regression.spec.ts | Error: Deactivation precondition: expected active but observed inactive. Latest notification: none |
| eXemble_AI서비스_055 | AI서비스 | 버전 배포 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_056 | AI서비스 | 배포 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_057 | AI서비스 | 서비스 정보 편집 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_058 | AI서비스 | 편집 버전 선택 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_059 | AI서비스 | 워크플로우 편집 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_060 | AI서비스 | 테스트 채팅 이동 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_AI서비스_061 | AI서비스 | 테스트 질의 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_AI서비스_062 | AI서비스 | 답변 복사 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_AI서비스_063 | AI서비스 | 편집 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_064 | AI서비스 | 편집 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_001 | 권한 | 계정 관리 메뉴 접근 | auto | P1 | implemented | passed | 2 | tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_권한_002 | 권한 | 계정 검색 | auto | P1 | implemented | failed | 3 | tests\regression\input-search-limits.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_권한_003 | 권한 | 계정 수정 접근 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_004 | 권한 | 계정 등록 팝업 | auto | P2 | implemented | passed | 1 | tests\regression\permission.create-cancel.regression.spec.ts | - |
| eXemble_권한_005 | 권한 | 기본정보 입력 | manual | P2 | implemented | failed | 3 | tests\regression\input-form-limits.regression.spec.ts | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_권한_006 | 권한 | 권한정보 선택 | auto | P2 | implemented | passed | 1 | tests\regression\permission.create-cancel.regression.spec.ts | - |
| eXemble_권한_007 | 권한 | 계정 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_008 | 권한 | 계정 등록 취소 | auto | P2 | implemented | passed | 1 | tests\regression\permission.create-cancel.regression.spec.ts | - |
| eXemble_권한_009 | 권한 | 계정 잠금 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_010 | 권한 | 계정 잠금 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_011 | 권한 | 계정 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_012 | 권한 | 계정 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_013 | 권한 | 조직 관리 메뉴 접근 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_014 | 권한 | 소속 목록 정보 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_015 | 권한 | 소속 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_016 | 권한 | 소속 추가 취소 | auto | P2 | implemented | passed | 1 | tests\regression\permission.create-cancel.regression.spec.ts | - |
| eXemble_권한_017 | 권한 | 소속명 수정 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_018 | 권한 | 소속 수정 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_019 | 권한 | 소속 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_020 | 권한 | 소속 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_021 | 권한 | 직책 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_022 | 권한 | 직책 추가 취소 | auto | P2 | implemented | passed | 1 | tests\regression\permission.create-cancel.regression.spec.ts | - |
| eXemble_권한_023 | 권한 | 직책명 수정 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_024 | 권한 | 직책 수정 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_025 | 권한 | 직책 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_026 | 권한 | 직책 삭제 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_027 | 권한 | 소속/직책 삭제 제약 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_028 | 권한 | 벡터테이블 접근정책 메뉴 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_029 | 권한 | 목록 정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_030 | 권한 | 접근정책 미지정 안내 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_031 | 권한 | 접근정책 검색 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_032 | 권한 | 접근정책 관리 팝업 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_권한_033 | 권한 | 기본정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_034 | 권한 | 현재 접근정책 확인 | auto | P1 | implemented | passed | 1 | tests\regression\permission.readonly.regression.spec.ts | - |
| eXemble_권한_035 | 권한 | 접근정책 추가 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_036 | 권한 | 접근정책 삭제 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_037 | 권한 | 접근정책 저장 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_권한_038 | 권한 | 접근정책 수정 취소 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_로그_001 | 로그 | 로그 메뉴 접근 | auto | P1 | implemented | passed | 2 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_로그_002 | 로그 | 로그 목록 정보 | auto | P1 | implemented | passed | 2 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_로그_003 | 로그 | 요청일시 필터 | auto | P1 | implemented | passed | 2 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_로그_004 | 로그 | 로그 화면 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_로그_005 | 로그 | 로그 정렬 | auto | P1 | implemented | passed | 2 | tests\regression\log.regression.spec.ts, tests\smoke\ui-safe-controls.smoke.spec.ts | - |
| eXemble_로그_006 | 로그 | 서비스 요청 그래프 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_로그_007 | 로그 | 로그 상세 화면 | auto | P1 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_로그_008 | 로그 | 기본정보 확인 | auto | P1 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_로그_009 | 로그 | 사용자 입력 확인 | auto | P1 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_로그_010 | 로그 | AI 서비스 응답 확인 | auto | P1 | implemented | passed | 1 | tests\regression\read-only-deep-dive.regression.spec.ts | - |
| eXemble_시스템_001 | 시스템 | 입력필드 입력값 범위 제한 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_002 | 시스템 | 중복 접속 허용 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_003 | 시스템 | 최대 동시 접속자 수 | blocked | P2 | blocked | blocked | 0 | - | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| eXemble_시스템_004 | 시스템 | 최대 동시 첨부 파일 수 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_005 | 시스템 | 권장 브라우저 해상도 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_006 | 시스템 | 최소 브라우저 해상도 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_007 | 시스템 | 폐쇄망/클라우드 운영 | blocked | P2 | blocked | blocked | 0 | - | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| eXemble_시스템_008 | 시스템 | 도구 유형 제한 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_009 | 시스템 | 일반 파일 형식 | deferred | P2 | implemented | skipped | 1 | tests\regression\input-upload-formats.regression.spec.ts | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_010 | 시스템 | 이미지 파일 형식 | deferred | P2 | implemented | skipped | 1 | tests\regression\input-upload-formats.regression.spec.ts | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_011 | 시스템 | 문서 파일 형식 | deferred | P2 | implemented | skipped | 1 | tests\regression\input-upload-formats.regression.spec.ts | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_012 | 시스템 | 음성/비디오 파일 형식 | deferred | P2 | implemented | skipped | 1 | tests\regression\input-upload-formats.regression.spec.ts | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_013 | 시스템 | 한국어 지원 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_014 | 시스템 | 웹브라우저 기반 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_015 | 시스템 | 이중화 구성(HA) | blocked | P2 | blocked | blocked | 0 | - | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| eXemble_시스템_016 | 시스템 | 테마/색상 변경 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_017 | 시스템 | 시큐어코딩 적용 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_018 | 시스템 | 데이터 백업 및 복구 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_시스템_019 | 시스템 | 오류 메시지 표시 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_020 | 시스템 | 데이터 자동 점검 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_021 | 시스템 | 로그 기록-요청일시 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_022 | 시스템 | 로그 기록-서비스명 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_023 | 시스템 | 로그 기록-입력/응답 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_024 | 시스템 | 최고 관리자 기능 | deferred | P2 | deferred | deferred | 0 | - | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_시스템_025 | 시스템 | 일반 관리자 기능 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_026 | 시스템 | 서비스 상태 모니터링 | auto | P1 | implemented | passed | 1 | tests\regression\planned-chat-dashboard-system.regression.spec.ts | - |
| eXemble_시스템_027 | 시스템 | 자원활용 상태 모니터링 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_시스템_028 | 시스템 | 시스템 로그 제공 | blocked | P2 | blocked | blocked | 0 | - | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| eXemble_매뉴얼_001 | 매뉴얼 | 오류 FAQ 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_002 | 매뉴얼 | 시스템 요구사항 명시 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_003 | 매뉴얼 | 데이터 백업 및 복구 절차 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_004 | 매뉴얼 | 암호 알고리즘 정보 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_005 | 매뉴얼 | 접근 제어 정보 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_006 | 매뉴얼 | 운영 로그 저장 위치 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_007 | 매뉴얼 | 제품 공급자 정보 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_008 | 매뉴얼 | 유지보수 정보 제공 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_009 | 매뉴얼 | 개인정보 암호화 알고리즘 명시 보안 관련 매뉴얼이 제공되어 있음 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_매뉴얼_010 | 매뉴얼 | 제품명 및 버전 일치 여부 | manual | P2 | manual | manual | 0 | - | 문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다. |
| eXemble_보안_001 | 보안 | 시험 범위 외 정보 제외 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_보안_002 | 보안 | 오픈소스 최신 버전 사용 | deferred | P2 | deferred | deferred | 0 | - | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_보안_003 | 보안 | Clickjacking 방지 설정 | auto | P1 | implemented | passed | 1 | tests\smoke\security.headers.smoke.spec.ts | - |
| eXemble_보안_004 | 보안 | XSS 공격 방지 설정 | auto | P1 | implemented | passed | 1 | tests\smoke\security.headers.smoke.spec.ts | - |
| eXemble_보안_005 | 보안 | CSRF 방지 설정 | auto | P1 | implemented | passed | 1 | tests\smoke\security.auth-surface.smoke.spec.ts | - |
| eXemble_보안_006 | 보안 | HSTS 설정 | auto | P1 | implemented | passed | 1 | tests\smoke\security.headers.smoke.spec.ts | - |
| eXemble_보안_007 | 보안 | 취약 비밀번호 비활성화 | auto | P1 | implemented | passed | 1 | tests\regression\security.password-policy.regression.spec.ts | - |
| eXemble_보안_008 | 보안 | 비밀번호 평문 전송 방지 | blocked | P2 | blocked | blocked | 0 | - | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| eXemble_보안_009 | 보안 | 데이터 파손 방지 정보 제공 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_보안_010 | 보안 | 계정 잠금 정책 | manual | P2 | manual | manual | 0 | - | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |