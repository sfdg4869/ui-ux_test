# TC Execution Summary

- Total TC cases: **293**
- Execution states: `failed`=26, `passed`=111, `skipped`=15, `manual`=98, `deferred`=38, `blocked`=5

## Failed Auto Cases

| TC-ID | Module | Feature | Error |
| --- | --- | --- | --- |
| eXemble_사용자 로그인_001 | 사용자 로그인 | ID/PW 로그인 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m32[39m Received: [31m33[39m |
| eXemble_사용자 질의_005 | 사용자 질의 | 질의 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_사용자 질의_006 | 사용자 질의 | 첨부문서 확인 | Error: eXemble_사용자 질의_006 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다. [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBeNull[2m()[22m Received: [31mnull[39m |
| eXemble_사용자 질의_008 | 사용자 질의 | 근거 자료 확인 | Error: eXemble_사용자 질의_008 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다. [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBeNull[2m()[22m Received: [31mnull[39m |
| eXemble_사용자 질의_009 | 사용자 질의 | 근거 파일 링크 클릭 | Error: eXemble_사용자 질의_009 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다. [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBeNull[2m()[22m Received: [31mnull[39m |
| eXemble_사용자 질의_011 | 사용자 질의 | 검색결과 상세 확인 | Error: 대화 내역에서 클릭 가능한 결과 항목을 찾지 못했습니다. |
| eXemble_데이터_002 | 데이터 | 데이터소스 검색 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_모델_003 | 모델 | 모델 검색 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_003 | 도구 | 도구 검색 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_005 | 도구 | 요청옵션 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_006 | 도구 | HTTP 헤더 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_007 | 도구 | Path 파라미터 추가 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_008 | 도구 | Query 파라미터 추가 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_도구_009 | 도구 | 요청 본문 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_AI서비스_004 | AI서비스 | 에이전트 검색 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_005 | AI서비스 | 에이전트 생성-기본속성 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_008 | AI서비스 | 프롬프트 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_AI서비스_009 | AI서비스 | 파라미터 설정 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m2[39m Received: [31m3[39m |
| eXemble_AI서비스_010 | AI서비스 | 테스트 채팅 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m5000[39m Received: [31m5001[39m |
| eXemble_AI서비스_036 | AI서비스 | 서비스 검색 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_037 | AI서비스 | 서비스 아이콘 선택 | Error: The saved icon should still be selected after reopening the edit screen. [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m Expected: [32m"M[7m2[27m 2[7m2V5q0-.824.587-1.413A1.93 1.93 0 0 1 4 3h16[27mq.824 0 1.413.587.586.589.587 1.413v1[7m1[27mq0 .824-.587 1.413A1.93 1.93 0 0 1 [7m20 18H6zm3.15-6H20V5H4v12.125z[27m"[39m Received: [31m"M[7m5[27m 2[7m1q-.824 0-1.413-.587A1.93 1.93 0 0 1 3 19V5q0-.824.587-1.413A1.93 1.93 0 0 1 5 3h4.2a3 3 0 0 1 1.088-1.45A2.86 2.86 0 0 1 12 1q.95 0 1.713.55.762.55 1.087 1.45H19[27mq.824 0 1.413.587.586.589.587 1.413v1[7m4[27mq0 .824-.587 1.413A1.93 1.93 0 0 1 [7m19 21zm0-2h14V5H5zm2-2h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zm5-4.75a.73.73 0 0 0 .75-.75.73.73 0 0 0-.75-.75.73.73 0 0 0-.75.75.73.73 0 0 0 .75.75[27m"[39m |
| eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_AI서비스_053 | AI서비스 | 서비스 활성화 | Error: Service activation: expected active but observed inactive. Latest notification: none |
| eXemble_AI서비스_054 | AI서비스 | 서비스 비활성화 | Error: Deactivation precondition: expected active but observed inactive. Latest notification: none |
| eXemble_권한_002 | 권한 | 계정 검색 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |
| eXemble_권한_005 | 권한 | 기본정보 입력 | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m Expected: <= [32m200[39m Received: [31m201[39m |

## Planned Auto Cases

- none

## Non-Auto Cases

| TC-ID | Target | Feature | Reason |
| --- | --- | --- | --- |
| eXemble_사용자 로그인_003 | blocked | SSO 로그인 | 현재 환경에서 SSO 버튼이 비활성화되어 있어 SSO 연동 환경이 준비되어야 합니다. |
| eXemble_환경설정_003 | manual | 비밀번호 변경 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_환경설정_004 | manual | 비밀번호 변경 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_004 | manual | 저장 용량 확인 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_008 | manual | 파일 드래그앤드랍 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_009 | manual | 파일 업로드 확인 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_011 | manual | 파일 개수 제한(10개) | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_012 | manual | 파일 용량 제한(100MB) | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_013 | manual | 업로드한 문서 관리 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_015 | manual | 파일/폴더 삭제 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_016 | manual | 삭제 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_017 | manual | 새폴더 생성 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_018 | deferred | 하위 테이블 토글 | 1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다. |
| eXemble_데이터_028 | manual | 파일 벡터 테이블 생성-기본정보 벡터화 목록 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_030 | manual | 파일 추가 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_031 | manual | 벡터화 대상 삭제 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_032 | manual | 파일 벡터 테이블 저장 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_037 | manual | 폴더 벡터 테이블 저장 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_042 | manual | 쿼리 입력 및 실행 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_043 | manual | DB 벡터 테이블 저장 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_047 | manual | 벡터 데이터 삭제 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_048 | manual | 삭제 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_049 | manual | 편집 화면 이동 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_050 | manual | 재벡터화 시작 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_051 | manual | 재벡터화 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_052 | manual | 벡터화 작업 중단 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_053 | manual | 중단 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_059 | manual | 편집 시 데이터 유형 확인 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_060 | manual | 벡터화 대상 재구성 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_061 | manual | 벡터화 대상 삭제 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_062 | manual | 편집 저장 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_063 | manual | 편집 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_데이터_064 | manual | 저장 없이 페이지 이동 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_005 | manual | 모델명 수정 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_006 | manual | 모델명 수정 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_010 | manual | 파인튜닝 시작 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_011 | manual | 파인튜닝 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_012 | manual | 파인튜닝 종료 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_013 | manual | 파인튜닝 재시작(오류 시) | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_014 | manual | 모델 배포 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_015 | manual | 배포 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_016 | manual | 모델 삭제 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_모델_017 | manual | 모델 삭제 취소 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_001 | deferred | 도구 메뉴 접근 | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_002 | deferred | 도구 상세정보 확인 | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_003 | deferred | 도구 검색 | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_005 | manual | 요청옵션 입력 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_006 | manual | HTTP 헤더 입력 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_007 | manual | Path 파라미터 추가 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_008 | manual | Query 파라미터 추가 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_009 | manual | 요청 본문 입력 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_도구_011 | deferred | 테스트 실행 | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_012 | deferred | 테스트 창 닫기 | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_도구_013 | manual | 도구 저장 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_002 | deferred | 사용자 피드백 순위 | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| eXemble_AI서비스_005 | manual | 에이전트 생성-기본속성 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_006 | manual | 벡터테이블 추가 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_007 | manual | 벡터테이블 삭제 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_008 | manual | 프롬프트 입력 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| eXemble_AI서비스_009 | manual | 파라미터 설정 | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |