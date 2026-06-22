export type ModuleScenario = {
  name: string;
  menuAliases: string[];
  submenuAliases?: string[];
  landingKeywords: string[];
  searchTerm?: string;
  checklistCaseIds?: string[];
  requiresServiceManagement?: boolean;
};

export const smokeModules: ModuleScenario[] = [
  {
    name: '대시보드',
    menuAliases: ['대시보드', '통합 대시보드'],
    landingKeywords: ['모든 서비스', '서비스 성공률', '대시보드'],
    checklistCaseIds: ['eXemble_대시보드_001'],
    requiresServiceManagement: true,
  },
  {
    name: 'AI 서비스',
    menuAliases: ['AI서비스', 'AI 서비스'],
    landingKeywords: ['AI서비스', 'AI 서비스', '모든 서비스 보기'],
    checklistCaseIds: ['eXemble_사용자 질의_002'],
  },
  {
    name: '채팅',
    menuAliases: ['새 채팅', '채팅'],
    landingKeywords: ['새 채팅', '무엇을 도와드릴까요', '질의응답'],
    checklistCaseIds: ['eXemble_사용자 질의_001', 'eXemble_사용자 질의_005'],
  },
];

export const regressionModules: ModuleScenario[] = [
  {
    name: 'AI 서비스',
    menuAliases: ['AI서비스', 'AI 서비스'],
    landingKeywords: ['AI서비스', 'AI 서비스', '모든 서비스 보기'],
    searchTerm: 'GS',
    checklistCaseIds: ['eXemble_AI서비스_001', 'eXemble_AI서비스_003', 'eXemble_AI서비스_004'],
  },
  {
    name: '데이터',
    menuAliases: ['데이터'],
    submenuAliases: ['데이터 소스'],
    landingKeywords: ['데이터 소스', '데이터베이스', '파일'],
    searchTerm: 'sample',
    checklistCaseIds: ['eXemble_데이터_001', 'eXemble_데이터_002', 'eXemble_데이터_003'],
    requiresServiceManagement: true,
  },
  {
    name: '모델',
    menuAliases: ['모델'],
    landingKeywords: ['모델'],
    searchTerm: 'model',
    checklistCaseIds: ['eXemble_모델_001', 'eXemble_모델_002', 'eXemble_모델_003', 'eXemble_모델_004'],
    requiresServiceManagement: true,
  },
  {
    name: '도구',
    menuAliases: ['도구'],
    landingKeywords: ['도구'],
    searchTerm: 'tool',
    checklistCaseIds: ['eXemble_도구_001', 'eXemble_도구_002', 'eXemble_도구_003'],
    requiresServiceManagement: true,
  },
  {
    name: '권한',
    menuAliases: ['권한'],
    submenuAliases: ['계정 관리'],
    landingKeywords: ['계정 관리', '조직 관리', '벡터 테이블 접근 정책'],
    searchTerm: 'admin',
    checklistCaseIds: ['eXemble_권한_001', 'eXemble_권한_002'],
    requiresServiceManagement: true,
  },
];

export const manualOnlySmokeScenarios = [
  '아이디 저장',
  '잘못된 로그인',
  '상단/좌측 메뉴 진입',
  '세션 만료 후 재로그인',
  '인증서 우회 상태 페이지 로드 안정성',
];
