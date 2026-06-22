# Input Range Matrix

- Source: `manual/` documents -> `_workspace/test-catalog.json` + manual PDF input tables
- Total extracted field rules: **55**
- auto-ready: **25**
- auto-with-test-data: **10**
- manual: **15**
- deferred: **3**
- blocked: **2**
- checklist-derived: **39**
- manual-pdf supplement: **16**

| No | TC-ID | 모듈 | 기능 | 입력 필드 | 규칙 | 분류 | Spec | Source | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | eXemble_권한_002 | 권한 | 계정 검색 | 검색어 | 최대 200자 | auto-ready | tests/regression/input-search-limits.regression.spec.ts | checklist | 계정 관리 검색창 길이 검증 가능 |
| 2 | eXemble_권한_005 | 권한 | 기본정보 입력 | 비밀번호 | 8~20자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 계정 등록 팝업에서 저장 없이 길이 검증 가능<br>103자 까지 입력 가능 그 후에는 500error |
| 3 | eXemble_권한_005 | 권한 | 기본정보 입력 | 이름 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 계정 등록 팝업에서 저장 없이 길이 검증 가능<br>103자 까지 입력 가능 그 후에는 500error |
| 4 | eXemble_권한_005 | 권한 | 기본정보 입력 | 이메일 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 계정 등록 팝업에서 저장 없이 길이 검증 가능<br>103자 까지 입력 가능 그 후에는 500error |
| 5 | eXemble_권한_031 | 권한 | 접근정책 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 6 | eXemble_데이터_002 | 데이터 | 데이터소스 검색 | 검색어 | 최대 200자 | auto-ready | tests/regression/input-search-limits.regression.spec.ts | checklist | 데이터 목록 검색창 길이 검증 가능 |
| 7 | eXemble_데이터_011 | 데이터 | 파일 개수 제한(10개) | 업로드 파일 수 | 최대 10개 | auto-with-test-data | tests/regression/input-upload-limits.regression.spec.ts | checklist | 11개 이상 파일 샘플 세트 필요<br>11개 이상 업로드 가능 UI와 메뉴얼 간의 스펙과 불일치 |
| 8 | eXemble_데이터_012 | 데이터 | 파일 용량 제한(100MB) | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-limits.regression.spec.ts | checklist | 100MB 초과 샘플 파일 필요<br>100mb 이상 업로드 가능 UI와 메뉴얼 간의 스펙과 불일치 |
| 9 | eXemble_데이터_014 | 데이터 | 문서 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 10 | eXemble_데이터_026 | 데이터 | 벡터 테이블 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 11 | eXemble_데이터_040 | 데이터 | 드라이브 검색 | 검색어 | 최대 200자 | manual | - | checklist | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다.<br>드라이브가 하나만 존재하는 관계로 드라 이브가 여러 개 있으면 정확하게 확인 가 능할 듯 함 |
| 12 | eXemble_데이터_046 | 데이터 | 파일 목록 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 13 | eXemble_데이터_058 | 데이터 | 히스토리 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다.<br>히스토리 검색 시 '작업 요청 일시'와 '작업 유형' 컬럼에 대해서만 필터링하는 듯 한데 스펙 확인이 필요함. |
| 14 | eXemble_도구_003 | 도구 | 도구 검색 | 검색어 | 최대 200자 | auto-ready | tests/regression/input-search-limits.regression.spec.ts | checklist | 도구 목록 검색창 길이 검증 가능 |
| 15 | eXemble_도구_005 | 도구 | 요청옵션 입력 | 앤드포인트 URL | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 도구 생성 화면에서 엔드포인트 길이 검증 가능 |
| 16 | eXemble_도구_009 | 도구 | 요청 본문 입력 | JSON 형식으로 요청본문 | 최대 5000자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 도구 생성 화면에서 요청 본문 길이 검증 가능 |
| 17 | eXemble_도구_011 | 도구 | 테스트 실행 | 유형본문 | 최대 5000자 | deferred | - | manual-pdf | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| 18 | eXemble_모델_003 | 모델 | 모델 검색 | 검색어 | 최대 200자 | auto-ready | tests/regression/input-search-limits.regression.spec.ts | checklist | 모델 목록 검색창 길이 검증 가능 |
| 19 | eXemble_모델_005 | 모델 | 모델명 수정 | 모델명 수정 | 최대 200자 | manual | - | checklist | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| 20 | eXemble_사용자 로그인_001 | 사용자 로그인 | ID/PW 로그인 | 비밀번호 | 9~32자 | auto-ready | tests/regression/input-range.regression.spec.ts | checklist | 로그인 입력창 길이와 인증 경계값 검증 가능 |
| 21 | eXemble_사용자 로그인_001 | 사용자 로그인 | ID/PW 로그인 | 아이디 | 5~32자 | auto-ready | tests/regression/input-range.regression.spec.ts | checklist | 로그인 입력창 길이와 인증 경계값 검증 가능 |
| 22 | eXemble_사용자 질의_005 | 사용자 질의 | 질의 입력 | 내용 | 최대 5000자 | auto-ready | tests/regression/input-range.regression.spec.ts | checklist | 채팅 입력창에서 저장 없이 길이 검증 가능<br>1. 서비스를 이용한 채팅시도 시 All 'connection attempts failed' 발생 |
| 23 | eXemble_사용자 질의_010 | 사용자 질의 | 대화내역 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 24 | eXemble_사용자 질의_012 | 사용자 질의 | AI 서비스 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 25 | eXemble_시스템_003 | 시스템 | 최대 동시 접속자 수 | 동시 접속 사용자 | 최대 1000명 | blocked | - | checklist | 전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다. |
| 26 | eXemble_시스템_004 | 시스템 | 최대 동시 첨부 파일 수 | 첨부 파일 수 | 최대 9개 | blocked | - | checklist | 동시 첨부 검증용 다수 파일과 환경 제어 필요 |
| 27 | eXemble_시스템_009 | 시스템 | 일반 파일 형식 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 일반 파일 형식 샘플 필요 |
| 28 | eXemble_시스템_009 | 시스템 | 일반 파일 형식 | 허용 확장자 | 지원 형식: .txt, .md, .csv, .tsv, .html, .htm | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 일반 파일 형식 샘플 필요 |
| 29 | eXemble_시스템_010 | 시스템 | 이미지 파일 형식 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 이미지 파일 형식 샘플 필요 |
| 30 | eXemble_시스템_010 | 시스템 | 이미지 파일 형식 | 허용 확장자 | 지원 형식: .jpg, .jpeg, .png, .tif, .tiff, .bmp, .gif, .webp | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 이미지 파일 형식 샘플 필요 |
| 31 | eXemble_시스템_011 | 시스템 | 문서 파일 형식 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 문서 파일 형식 샘플 필요 |
| 32 | eXemble_시스템_011 | 시스템 | 문서 파일 형식 | 허용 확장자 | 지원 형식: .pdf, .doc, .docx, .odt, .hwp, .hwpx, .hwtx, .owpml, .ppt, .pptx, .odp, .xls, .xlsx, .ods, .rtf | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 문서 파일 형식 샘플 필요 |
| 33 | eXemble_시스템_012 | 시스템 | 음성/비디오 파일 형식 | 업로드 파일 용량 | 최대 100MB | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 음성/비디오 파일 형식 샘플 필요 |
| 34 | eXemble_시스템_012 | 시스템 | 음성/비디오 파일 형식 | 허용 확장자 | 지원 형식: .mp3, .wav, .mp4, .avi | auto-with-test-data | tests/regression/input-upload-formats.regression.spec.ts | manual-pdf | 허용 음성/비디오 파일 형식 샘플 필요 |
| 35 | eXemble_환경설정_003 | 환경설정 | 비밀번호 변경 | 비밀번호 | 8~20자 | manual | - | checklist | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| 36 | eXemble_환경설정_003 | 환경설정 | 비밀번호 변경 | 새 비밀번호 | 8~20자 | manual | - | checklist | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| 37 | eXemble_AI서비스_004 | AI서비스 | 에이전트 검색 | 검색어 | 최대 200자 | auto-ready | tests/regression/input-search-limits.regression.spec.ts | checklist | AI 에이전트 목록 검색창 길이 검증 가능 |
| 38 | eXemble_AI서비스_005 | AI서비스 | 에이전트 생성-기본속성 | 에이전트 설명 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | manual-pdf | 에이전트 생성 화면에서 저장 없이 기본 속성 길이 검증 가능 |
| 39 | eXemble_AI서비스_005 | AI서비스 | 에이전트 생성-기본속성 | 에이전트명 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | manual-pdf | 에이전트 생성 화면에서 저장 없이 기본 속성 길이 검증 가능 |
| 40 | eXemble_AI서비스_008 | AI서비스 | 프롬프트 입력 | 프롬프트 | 최대 5000자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 에이전트 생성 화면에서 프롬프트 길이 검증 가능 |
| 41 | eXemble_AI서비스_009 | AI서비스 | 파라미터 설정 | 온도 | 최대 2자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 에이전트 생성 화면에서 숫자 길이 검증 가능 |
| 42 | eXemble_AI서비스_009 | AI서비스 | 파라미터 설정 | 최대토큰수 | 최대 10자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 에이전트 생성 화면에서 숫자 길이 검증 가능 |
| 43 | eXemble_AI서비스_010 | AI서비스 | 테스트 채팅 | 테스트 채팅 | 최대 5000자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 에이전트 생성 화면에서 테스트 채팅 길이 검증 가능 |
| 44 | eXemble_AI서비스_020 | AI서비스 | 새 모델 이름 입력 | 새 모델 이름 | 최대 200자 | deferred | - | checklist | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| 45 | eXemble_AI서비스_027 | AI서비스 | 새 평가 시작 | 평가명 | 최대 200자 | deferred | - | checklist | 추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다. |
| 46 | eXemble_AI서비스_036 | AI서비스 | 서비스 검색 | 검색어 | 최대 200자 | auto-ready | tests/regression/input-search-limits.regression.spec.ts | checklist | AI 서비스 목록 검색창 길이 검증 가능 |
| 47 | eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | 사용자설명 | 최대 100자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | manual-pdf | 서비스 생성 화면에서 저장 없이 기본정보 길이 검증 가능 |
| 48 | eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | 설명 | 최대 100자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 서비스 생성 화면에서 저장 없이 기본정보 길이 검증 가능 |
| 49 | eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | 식별 설명 | 최대 100자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | manual-pdf | 서비스 생성 화면에서 저장 없이 기본정보 길이 검증 가능 |
| 50 | eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | 식별설명 | 최대 100자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 서비스 생성 화면에서 저장 없이 기본정보 길이 검증 가능 |
| 51 | eXemble_AI서비스_038 | AI서비스 | 기본정보 입력 | 이름 | 최대 200자 | auto-ready | tests/regression/input-form-limits.regression.spec.ts | checklist | 서비스 생성 화면에서 저장 없이 기본정보 길이 검증 가능 |
| 52 | eXemble_AI서비스_049 | AI서비스 | 버전 검색 | 검색어 | 최대 200자 | manual | - | checklist | 현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다. |
| 53 | eXemble_AI서비스_057 | AI서비스 | 서비스 정보 편집 | 사용자설명 | 최대 100자 | manual | - | manual-pdf | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| 54 | eXemble_AI서비스_057 | AI서비스 | 서비스 정보 편집 | 식별 설명 | 최대 100자 | manual | - | manual-pdf | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
| 55 | eXemble_AI서비스_057 | AI서비스 | 서비스 정보 편집 | 이름 | 최대 200자 | manual | - | manual-pdf | 실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다. |
