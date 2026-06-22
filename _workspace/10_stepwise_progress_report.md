# Stepwise Progress Report

## 1. 현재 계정 기준 TC 접근 경로 정리

- 일반 사용자 진입 후 `admin@ex-em.com` 계정 패널에서 `서비스 관리`를 눌러야 관리자성 메뉴가 노출됨
- 직접 접근 가능한 P0 화면: 로그인, 로그아웃, 새 채팅, AI 서비스
- 서비스 관리 경유 확인 화면: 대시보드, 데이터, 모델, 도구, 권한, 로그

## 2. blocked / manual / deferred 정리

- blocked: 6건
- manual: 111건
- deferred: 45건
- skipped: 0건
- 대표 blocked:
  - 없음

## 3. 최신 자동화 실행 반영

- passed: 0건
- planned: 0건
- 대표 pass TC:
  - eXemble_사용자 로그인_001
  - eXemble_사용자 로그인_002
  - eXemble_사용자 로그인_004
  - eXemble_사용자 로그인_005
  - eXemble_환경설정_005
  - eXemble_사용자 질의_001
  - eXemble_사용자 질의_002
  - eXemble_사용자 질의_003
  - eXemble_사용자 질의_005
  - eXemble_대시보드_001
  - eXemble_AI서비스_001
  - eXemble_AI서비스_003
  - eXemble_AI서비스_004
  - eXemble_데이터_001
  - eXemble_데이터_002
  - eXemble_데이터_003
  - eXemble_모델_001
  - eXemble_모델_002
  - eXemble_모델_003
  - eXemble_모델_004
  - eXemble_도구_001
  - eXemble_도구_002
  - eXemble_도구_003
  - eXemble_권한_001
  - eXemble_권한_002
  - eXemble_로그_001
  - eXemble_로그_002
  - eXemble_로그_003
  - eXemble_로그_005
  - eXemble_보안_003
  - eXemble_보안_004
  - eXemble_보안_005
  - eXemble_보안_006

## 4. 서비스 관리 하위 모듈 순차 검증 결과

- 대시보드: 서비스 관리 경유 후 진입 확인
- 데이터: `데이터 -> 데이터 소스` 경로 확인
- 모델: 목록/검색 진입 확인
- 도구: 목록/검색 진입 확인
- 권한: `권한 -> 계정 관리` 경로로 보정 후 목록/검색 확인
- 로그: 검색 화면이 아니라 목록/필터/정렬 TC로 분리 보정 후 확인

## 산출물

- checklist workbook updated: _workspace\eXemble_GS인증 - Check List.work.xlsx
- feature workbook updated: _workspace\5_[KTR]기능리스트_주식회사엑셈.work.xlsx
- matrix json: _workspace\05_tc_execution_matrix.json
