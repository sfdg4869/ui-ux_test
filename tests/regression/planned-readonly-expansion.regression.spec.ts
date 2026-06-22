import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials } from '../../fixtures/env.js';
import {
  clickLocatorAndAssertStable,
  clickFirstVisibleCombobox,
  clickNamedControl,
  expectListLikeSurface,
  expectVisibleLabels,
  loginWithDefaultCredentials,
  openFirstContentItem,
  openScenario,
  requireSearchInput,
  searchCurrentPage,
  startUiMonitor,
  type HarnessScenario,
} from '../../fixtures/planned-readonly-helpers.js';

type Monitor = ReturnType<typeof startUiMonitor>;
type PlannedCase = {
  caseId: string;
  title: string;
  run: (page: Page, monitor: Monitor) => Promise<void>;
};

const aiServiceScenario: HarnessScenario = {
  name: 'AI서비스',
  menuAliases: ['AI서비스'],
  landingKeywords: ['AI서비스', '서비스 목록', '검색어를 입력하세요'],
  requiresServiceManagement: true,
};

const dataScenario: HarnessScenario = {
  name: '데이터',
  menuAliases: ['데이터'],
  submenuAliases: ['벡터화 관리'],
  landingKeywords: ['벡터화 관리', '벡터 테이블', '검색어를 입력하세요'],
  requiresServiceManagement: true,
};

const modelScenario: HarnessScenario = {
  name: '모델',
  menuAliases: ['모델'],
  landingKeywords: ['모델', '검색어를 입력하세요'],
  requiresServiceManagement: true,
};

async function expectSearchValue(page: Page, expected: string): Promise<void> {
  const input = await requireSearchInput(page);
  await expect(input).toHaveValue(expected);
}

async function openAiServiceList(page: Page, monitor: Monitor): Promise<void> {
  await openScenario(page, aiServiceScenario);
  await clickNamedControl(
    page,
    ['AI 서비스', '서비스 목록'],
    monitor,
    '서비스 관리에서 AI 서비스 목록으로 이동할 수 있어야 합니다.',
  ).catch(() => false);
  await expectListLikeSurface(page, 'AI 서비스 목록 화면이 열려야 합니다.');
}

async function openAiServiceDetail(page: Page, monitor: Monitor): Promise<void> {
  await openAiServiceList(page, monitor);
  await openFirstContentItem(page, monitor, 'AI 서비스 목록에서 상세 대상을 열 수 있어야 합니다.');
}

async function openDataList(page: Page): Promise<void> {
  await openScenario(page, dataScenario);
  await expectListLikeSurface(page, '벡터화 관리 목록 화면이 열려야 합니다.');
}

async function requireVectorData(page: Page): Promise<void> {
  const noVectorData = await page.getByText(/No data found\./i).first().isVisible().catch(() => false);
  test.skip(noVectorData, '벡터 상세 TC를 실행하려면 벡터 테이블 테스트 데이터가 필요합니다.');
}

async function openDataDetail(page: Page, monitor: Monitor): Promise<void> {
  await openDataList(page);
  await requireVectorData(page);
  await openFirstContentItem(page, monitor, '벡터화 목록에서 상세 대상을 열 수 있어야 합니다.');
}

async function openModelList(page: Page): Promise<void> {
  await openScenario(page, modelScenario);
  await expectListLikeSurface(page, '모델 목록 화면이 열려야 합니다.');
}

async function requireModelData(page: Page): Promise<void> {
  const noModelData = await page
    .getByText(/등록된 모델이 없습니다\.|No data found\./i)
    .first()
    .isVisible()
    .catch(() => false);
  test.skip(noModelData, '모델 상세 TC를 실행하려면 등록된 모델 테스트 데이터가 필요합니다.');
}

async function openModelDetail(page: Page, monitor: Monitor): Promise<void> {
  await openModelList(page);
  await requireModelData(page);
  const detailRow = page.locator('main table').nth(1).getByRole('row').first();
  await expect(detailRow).toBeVisible();
  await clickLocatorAndAssertStable(page, detailRow, monitor, '모델 목록에서 상세 대상을 열 수 있어야 합니다.');
}

const aiServiceCases: PlannedCase[] = [
  {
    caseId: 'eXemble_AI서비스_033',
    title: 'AI 서비스 메뉴에 접근할 수 있다',
    run: async (page, monitor) => {
      await openAiServiceList(page, monitor);
      await expectVisibleLabels(page, ['AI서비스', '서비스 목록', '검색어를 입력하세요'], 2, 'AI 서비스 목록 진입 UI가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_AI서비스_034',
    title: 'AI 서비스 목록 정보가 보인다',
    run: async (page, monitor) => {
      await openAiServiceList(page, monitor);
      await expectVisibleLabels(page, ['서비스 목록', '활성', '비활성', '검색어를 입력하세요'], 3, '서비스 목록 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_AI서비스_035',
    title: 'AI 서비스 상태 필터를 열 수 있다',
    run: async (page, monitor) => {
      await openAiServiceList(page, monitor);
      await clickFirstVisibleCombobox(page, monitor, 'AI 서비스 상태 필터를 열 수 있어야 합니다.');
    },
  },
  {
    caseId: 'eXemble_AI서비스_045',
    title: 'AI 서비스 기본정보를 확인할 수 있다',
    run: async (page, monitor) => {
      await openAiServiceDetail(page, monitor);
      await expectVisibleLabels(
        page,
        ['서비스 정보', '활성 상태', '접근 대상', '상세 설명'],
        3,
        '서비스 기본정보가 보여야 합니다.',
      );
    },
  },
  {
    caseId: 'eXemble_AI서비스_046',
    title: 'AI 서비스 워크플로우를 확인할 수 있다',
    run: async (page, monitor) => {
      await openAiServiceDetail(page, monitor);
      await expect(page.getByRole('application').first()).toBeVisible();
      await expect(page.getByText('100%')).toBeVisible();
    },
  },
  {
    caseId: 'eXemble_AI서비스_047',
    title: 'AI 서비스 워크플로우 확대 축소 도구를 확인할 수 있다',
    run: async (page, monitor) => {
      await openAiServiceDetail(page, monitor);
      const workflowButtons = page.locator('main button');
      const workflowButtonCount = await workflowButtons.count().catch(() => 0);
      expect(workflowButtonCount, '워크플로우 화면 도구 버튼이 3개 이상 보여야 합니다.').toBeGreaterThanOrEqual(3);
    },
  },
  {
    caseId: 'eXemble_AI서비스_048',
    title: 'AI 서비스 버전 목록을 확인할 수 있다',
    run: async (page, monitor) => {
      await openAiServiceDetail(page, monitor);
      await expectVisibleLabels(page, ['서비스 버전', '버전', '등록자', '등록일'], 3, '서비스 버전 목록이 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_AI서비스_049',
    title: 'AI 서비스 버전을 검색할 수 있다',
    run: async (page, monitor) => {
      await openAiServiceDetail(page, monitor);
      const versionSearchInput = page.locator('main').getByPlaceholder('검색어를 입력하세요').last();
      await expect(versionSearchInput).toBeVisible();
      await versionSearchInput.fill('v');
      await expect(versionSearchInput).toHaveValue('v');
    },
  },
];

const dataCases: PlannedCase[] = [
  {
    caseId: 'eXemble_데이터_023',
    title: '벡터화 목록의 전체 필터를 확인할 수 있다',
    run: async (page) => {
      await openDataList(page);
      await expectVisibleLabels(page, ['전체', '벡터 테이블', '검색어를 입력하세요'], 2, '전체 필터와 목록 UI가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_024',
    title: '벡터화 목록의 상태 필터를 열 수 있다',
    run: async (page, monitor) => {
      await openDataList(page);
      await clickFirstVisibleCombobox(page, monitor, '상태 필터를 열 수 있어야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_025',
    title: '벡터화 목록의 데이터 타입 필터를 열 수 있다',
    run: async (page, monitor) => {
      await openDataList(page);
      await clickFirstVisibleCombobox(page, monitor, '데이터 타입 필터를 열 수 있어야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_026',
    title: '벡터 테이블을 검색할 수 있다',
    run: async (page) => {
      await openDataList(page);
      await searchCurrentPage(page, 'sample');
      await expectSearchValue(page, 'sample');
    },
  },
  {
    caseId: 'eXemble_데이터_027',
    title: '벡터화 목록의 기본 컬럼을 확인할 수 있다',
    run: async (page) => {
      await openDataList(page);
      await expectVisibleLabels(
        page,
        ['벡터 테이블명', '데이터 타입', '용량', '활용중인 AI 서비스', '권한 정책'],
        3,
        '벡터화 목록의 기본 컬럼이 보여야 합니다.',
      );
    },
  },
  {
    caseId: 'eXemble_데이터_044',
    title: '벡터 기본정보를 확인할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      await expectVisibleLabels(page, ['기본 정보'], 1, '벡터 기본정보 영역이 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_045',
    title: '벡터화 파일 목록을 확인할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const opened = await clickNamedControl(page, ['파일 목록'], monitor, '파일 목록 탭을 열 수 있어야 합니다.');
      expect(opened, '파일 목록 탭을 찾지 못했습니다.').toBe(true);
      await expectVisibleLabels(page, ['파일 목록', '파일명', '파일유형', '경로'], 2, '파일 목록 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_046',
    title: '벡터화 파일 목록을 검색할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const opened = await clickNamedControl(page, ['파일 목록'], monitor, '파일 목록 탭을 열 수 있어야 합니다.');
      expect(opened, '파일 목록 탭을 찾지 못했습니다.').toBe(true);
      await searchCurrentPage(page, 'sample');
      await expectSearchValue(page, 'sample');
    },
  },
  {
    caseId: 'eXemble_데이터_054',
    title: '접근정책을 확인할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const opened = await clickNamedControl(page, ['접근정책'], monitor, '접근정책 탭을 열 수 있어야 합니다.');
      expect(opened, '접근정책 탭을 찾지 못했습니다.').toBe(true);
      await expectVisibleLabels(page, ['계정', '소속', '직책'], 1, '접근정책 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_055',
    title: '접근정책 미지정 상태를 확인할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const opened = await clickNamedControl(page, ['접근정책'], monitor, '접근정책 탭을 열 수 있어야 합니다.');
      expect(opened, '접근정책 탭을 찾지 못했습니다.').toBe(true);
      await expectVisibleLabels(page, ['모든 사용자', '접근정책'], 1, '정책 미지정 또는 전체 사용자 접근 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_056',
    title: '정책 관리 화면으로 이동할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const openedPolicy = await clickNamedControl(page, ['접근정책'], monitor, '접근정책 탭을 열 수 있어야 합니다.');
      expect(openedPolicy, '접근정책 탭을 찾지 못했습니다.').toBe(true);
      const moved = await clickNamedControl(page, ['정책 관리'], monitor, '정책 관리 화면으로 이동할 수 있어야 합니다.');
      expect(moved, '정책 관리 버튼을 찾지 못했습니다.').toBe(true);
    },
  },
  {
    caseId: 'eXemble_데이터_057',
    title: '벡터 히스토리를 조회할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const opened = await clickNamedControl(page, ['히스토리'], monitor, '히스토리 탭을 열 수 있어야 합니다.');
      expect(opened, '히스토리 탭을 찾지 못했습니다.').toBe(true);
      await expectVisibleLabels(page, ['히스토리', '로그', '작업'], 1, '히스토리 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_데이터_058',
    title: '벡터 히스토리를 검색할 수 있다',
    run: async (page, monitor) => {
      await openDataDetail(page, monitor);
      const opened = await clickNamedControl(page, ['히스토리'], monitor, '히스토리 탭을 열 수 있어야 합니다.');
      expect(opened, '히스토리 탭을 찾지 못했습니다.').toBe(true);
      await searchCurrentPage(page, 'log');
      await expectSearchValue(page, 'log');
    },
  },
];

const modelCases: PlannedCase[] = [
  {
    caseId: 'eXemble_모델_007',
    title: '모델 리소스 정보를 확인할 수 있다',
    run: async (page, monitor) => {
      await openModelDetail(page, monitor);
      await expectVisibleLabels(page, ['리소스 정보', 'GPU', 'VRAM'], 2, '리소스 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_모델_008',
    title: '모델 사용 에이전트 목록을 확인할 수 있다',
    run: async (page, monitor) => {
      await openModelDetail(page, monitor);
      await expectVisibleLabels(page, ['사용 중인 에이전트 목록', '에이전트 이름', '설명'], 2, '사용 에이전트 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_모델_009',
    title: '모델 변경 이력을 확인할 수 있다',
    run: async (page, monitor) => {
      await openModelDetail(page, monitor);
      await expectVisibleLabels(page, ['모델 히스토리', '모델 배포', 'GPU 변경'], 2, '모델 변경 이력 정보가 보여야 합니다.');
    },
  },
];

test.describe('Planned read-only automation expansion', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginWithDefaultCredentials(page);
  });

  for (const plannedCase of [...aiServiceCases, ...dataCases, ...modelCases]) {
    test(checklistTitle([plannedCase.caseId], plannedCase.title), async ({ page }, testInfo) => {
      annotateChecklist(testInfo, [plannedCase.caseId]);
      const monitor = startUiMonitor(page);
      await plannedCase.run(page, monitor);
    });
  }
});
