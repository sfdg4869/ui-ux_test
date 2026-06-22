# Playwright Harness Reuse Guide

## 목적

이 문서는 현재 `eXemble`용으로 만든 standalone Playwright 하네스를
다른 제품에도 재사용할 수 있는지,
재사용하려면 무엇을 바꿔야 하는지,
그리고 장기적으로 어떻게 공용화하면 좋은지를 정리한 운영 가이드입니다.

이 문서는 재사용만 다룹니다.
보안 테스트 확장 내용은 여기서 다루지 않습니다.

## 현재 하네스에서 재사용 가능한 핵심 구조

### 1. 실행 구조

- `playwright.config.ts`
  - 브라우저, 리포터, trace, screenshot, `ignoreHTTPSErrors` 같은 공통 실행 정책을 담당합니다.
- `fixtures/`
  - 환경변수, 공통 유틸, 모듈 시나리오를 관리합니다.
- `pages/`
  - 제품별 UI 조작 로직을 페이지 객체로 분리합니다.
- `tests/`
  - 실제 테스트 시나리오를 담습니다.
- `scripts/generate-catalog.mjs`
  - 체크리스트 PDF와 기능리스트 XLSX를 읽어 작업용 카탈로그를 생성합니다.
- `_workspace/`
  - 실행 결과, 가공된 체크리스트, 보고서 산출물을 저장합니다.

이 구조는 특정 제품에 종속되지 않고,
“문서 기반 테스트 자동화 하네스”라는 개념 자체를 그대로 재사용할 수 있습니다.

### 2. 환경변수 기반 실행

현재 하네스는 URL과 계정을 코드에 하드코딩하지 않고 환경변수로 받습니다.

- `PLAYWRIGHT_BASE_URL`
- `EXEMBLE_USERNAME`
- `EXEMBLE_PASSWORD`
- `EXEMBLE_STORAGE_STATE`

권한 분리까지 재사용하려면 계정 프로필을 2개로 나누는 방식을 권장합니다.

- `EXEMBLE_ADMIN_USERNAME`
- `EXEMBLE_ADMIN_PASSWORD`
- `EXEMBLE_USER_USERNAME`
- `EXEMBLE_USER_PASSWORD`
- `EXEMBLE_AUTHZ_ADMIN_VISIBLE_MENUS`
- `EXEMBLE_AUTHZ_USER_HIDDEN_MENUS`
- `EXEMBLE_AUTHZ_ADMIN_ALLOWED_ROUTES`
- `EXEMBLE_AUTHZ_USER_BLOCKED_ROUTES`

이 패턴을 쓰면 제품마다 관리자와 일반사용자의 메뉴 노출 차이, URL 직접 접근 차이, 권한 우회 여부를 같은 하네스로 반복 검증할 수 있습니다.

즉 다른 제품에서도 기본적으로는 URL과 계정만 바꿔서 같은 실행 방식을 유지할 수 있습니다.

단, 이름이 `EXEMBLE_*`로 되어 있으므로 제품 공용화까지 생각하면 아래처럼 바꾸는 것을 권장합니다.

- `HARNESS_USERNAME`
- `HARNESS_PASSWORD`
- `HARNESS_STORAGE_STATE`

현재 상태에서도 재사용은 가능하지만,
여러 제품을 동시에 운영할 계획이면 env 이름은 일반화하는 편이 좋습니다.

### 3. 문서 기반 카탈로그 생성 흐름

현재 흐름은 아래와 같습니다.

1. `manual/`에 체크리스트 PDF를 넣습니다.
2. `manual/`에 기능리스트 XLSX를 넣습니다.
3. 필요하면 사용자 매뉴얼 PDF도 같이 둡니다.
4. `npm.cmd run catalog:build`를 실행합니다.
5. `_workspace/`에 작업용 XLSX, JSON, Markdown 보고서를 생성합니다.

이 흐름 자체는 다른 제품에도 그대로 재사용 가능합니다.

## 다른 제품으로 옮길 때 바꿔야 하는 부분

### 1. 가장 먼저 바꿀 파일

#### `playwright.config.ts`

주요 변경 지점:

- `baseURL`
- 브라우저 옵션
- 인증서 우회 필요 여부
- 프로젝트명

보통은 `PLAYWRIGHT_BASE_URL`만 바꾸면 되지만,
사내망, 사설 인증서, 프록시, 모바일 뷰 테스트가 있으면 여기서 추가 조정합니다.

#### `fixtures/env.ts`

주요 변경 지점:

- 계정 환경변수 이름
- 공통 storage state 이름

한 제품만 계속 쓸 거면 유지해도 되지만,
여러 제품을 돌릴 거면 제품명 종속 env 이름을 일반화하는 편이 좋습니다.

#### `pages/`

가장 제품 의존도가 큰 곳입니다.

예를 들면:

- 로그인 input 이름
- 메뉴 텍스트
- 버튼 라벨
- 테이블 구조
- 대화창 구조

UI가 바뀌면 대부분 이 폴더를 수정하게 됩니다.
즉 하네스 재사용의 핵심은 `tests/`보다 먼저 `pages/`를 새 제품에 맞게 다시 잡는 것입니다.

#### `fixtures/module-scenarios.ts`

이 파일은 모듈명, 메뉴 alias, landing keyword를 정의합니다.
다른 제품에서는 거의 반드시 수정이 필요합니다.

예:

- `대시보드`가 `모니터링`으로 바뀌는 경우
- `AI 서비스`가 `서비스 관리`로 바뀌는 경우
- 좌측 메뉴 구조가 다른 경우

#### `scripts/generate-catalog.mjs`

이 파일은 문서 형식 의존도가 큽니다.
특히 아래가 제품별로 달라질 수 있습니다.

- 체크리스트 PDF 파일명 규칙
- 기능리스트 XLSX 파일명 규칙
- 체크리스트 컬럼 구조
- 모듈명 매핑 규칙
- 자동화 대상 분류 규칙

현재 스크립트는 `TC-ID`, `Depth`, `기능명`, `Expected Result`, `1차 Result` 류의 표 형식을 가정합니다.
다른 제품의 체크리스트도 비슷한 형식이면 거의 그대로 재사용 가능합니다.
형식이 다르면 이 스크립트만 맞추면 됩니다.

### 2. 그대로 써도 되는 부분

아래는 대부분의 제품에서 구조를 그대로 유지해도 됩니다.

- `_workspace/` 산출물 구조
- Playwright reporter 설정
- 실패 시 trace와 screenshot 보존
- 문서 기반 분류 후 `auto`, `manual`, `blocked`, `deferred`로 나누는 방식
- `P0`, `P1`, `P2` 우선순위 체계
- 테스트 코드에서 `TC-ID`를 제목과 annotation으로 붙이는 방식

## 재사용 난이도

### 바로 재사용 가능

- URL만 다르고 로그인 방식이 비슷한 웹 제품
- 좌측 메뉴 기반 관리자 화면
- 체크리스트가 표 형태 PDF
- 기능리스트가 XLSX로 정리된 경우

### 약간 수정 필요

- 로그인 폼 라벨이 다른 경우
- 메뉴명이 다른 경우
- 체크리스트 PDF의 표 컬럼 순서가 다른 경우
- 검색, 상세, 목록 UI 구조가 다른 경우

### 큰 수정 필요

- SPA가 아니라 다중 팝업, 새 창 중심 제품
- 문서가 PDF가 아니라 Word, 한글, 이미지 위주인 경우
- 체크리스트에 `TC-ID` 같은 고유 키가 없는 경우
- API 중심 제품이라 UI보다 API 테스트가 주가 되는 경우

## 다른 제품으로 복제할 때 추천 절차

### 최소 절차

1. 현재 폴더를 새 제품용 작업 폴더로 복사합니다.
2. `manual/`에 새 제품의 체크리스트 PDF, 기능리스트 XLSX, 매뉴얼 PDF를 넣습니다.
3. `playwright.config.ts`의 URL 주입 방식을 그대로 사용합니다.
4. `pages/login.page.ts`와 `pages/app-shell.page.ts`부터 새 제품 UI에 맞게 고칩니다.
5. `fixtures/module-scenarios.ts`를 새 메뉴 구조로 수정합니다.
6. `scripts/generate-catalog.mjs`가 새 체크리스트를 읽는지 확인합니다.
7. `npx.cmd playwright test --list`로 스펙이 깨지지 않는지 확인합니다.
8. 로그인 화면, 메인 메뉴 진입 같은 스모크부터 돌립니다.

### 권장 절차

1. 제품별로 `manual/` 폴더에 문서를 분리합니다.
2. 제품별 `AGENTS.md`를 둡니다.
3. 제품별 `module-scenarios.ts`를 분리합니다.
4. 제품별 `pages/` 하위 폴더를 둡니다.
5. 공통 하네스와 제품 프로파일을 분리합니다.

예를 들면 이런 구조가 이상적입니다.

```text
products/
  exemble/
    manual/
    fixtures/
    pages/
    tests/
  product-b/
    manual/
    fixtures/
    pages/
    tests/
shared/
  playwright.config.base.ts
  checklist-parser/
```

## 장기적으로 더 재사용 가능하게 만드는 방법

현재도 재사용은 가능하지만,
여러 제품을 반복 운영하려면 아래 리팩터링을 추천합니다.

### 1. 제품 프로파일 파일 도입

예:

```json
{
  "productName": "exemble",
  "baseUrlEnv": "PLAYWRIGHT_BASE_URL",
  "usernameEnv": "HARNESS_USERNAME",
  "passwordEnv": "HARNESS_PASSWORD",
  "checklistPattern": "Check List",
  "featureWorkbookPattern": "기능리스트",
  "manualPattern": "사용자취급설명서"
}
```

이렇게 하면 제품별 차이를 코드가 아니라 설정으로 밀어낼 수 있습니다.

### 2. 체크리스트 파서 어댑터화

현재 `generate-catalog.mjs`는 한 종류의 PDF 표 형식에 최적화되어 있습니다.
장기적으로는 아래처럼 분리하는 것이 좋습니다.

- `parseGsChecklistPdf()`
- `parseSimpleChecklistPdf()`
- `parseSpreadsheetChecklist()`

그러면 제품마다 문서 형식이 달라도 공통 하네스를 유지하기 쉬워집니다.

## 실무 권장 결론

현재 하네스는 이미 재사용 가능한 출발점입니다.
다만 “완전 공용 프레임워크”는 아직 아니고,
“한 제품용 하네스를 다른 제품에도 복제해 빠르게 적응시킬 수 있는 상태”에 가깝습니다.

실무적으로는 아래 두 단계를 권장합니다.

1. 지금 구조로 다른 제품에 한번 복제 적용
2. 그다음 공통부를 추려서 제품 프로파일 방식으로 일반화
