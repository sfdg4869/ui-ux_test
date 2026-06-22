import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials } from '../../fixtures/env.js';
import { ChatPage } from '../../pages/chat.page.js';
import {
  assertNoUiErrorsSince,
  clickFirstVisibleCombobox,
  clickLocatorAndAssertStable,
  clickNamedControl,
  expectKoreanSurface,
  expectListLikeSurface,
  expectVisibleLabels,
  loginWithDefaultCredentials,
  openFirstContentItem,
  openScenario,
  requireSearchInput,
  startUiMonitor,
  type HarnessScenario,
} from '../../fixtures/planned-readonly-helpers.js';

type Monitor = ReturnType<typeof startUiMonitor>;
type PlannedCase = {
  caseId: string;
  title: string;
  run: (page: Page, monitor: Monitor) => Promise<void>;
};

const dashboardScenario: HarnessScenario = {
  name: '대시보드',
  menuAliases: ['대시보드', '통합 대시보드'],
  landingKeywords: ['서비스 성공률', 'CPU(%)', 'GPU Utilization(%)', 'Memory(GB)'],
  requiresServiceManagement: true,
};

const logScenario: HarnessScenario = {
  name: '로그',
  menuAliases: ['로그'],
  landingKeywords: ['서비스 로그', '로그 목록', '필터 추가'],
  requiresServiceManagement: true,
};

async function openChatHistorySearch(page: Page, monitor: Monitor): Promise<void> {
  const chatPage = new ChatPage(page);
  await chatPage.openChatWorkspace();
  await chatPage.openHistory();
  await expectVisibleLabels(page, ['대화 내역', '히스토리', '사규 질의응답', '검색'], 2, '대화 내역 진입 UI가 보여야 합니다.');

  const historySearchButton = await clickNamedControl(page, ['검색'], monitor, '대화 이력 검색 UI를 열 수 있어야 합니다.');
  expect(historySearchButton, '대화 이력 검색 버튼을 찾지 못했습니다.').toBe(true);
}

async function openFirstHistoryEntry(page: Page, monitor: Monitor, query: string): Promise<void> {
  const candidates = page.getByRole('button');
  const count = Math.min(await candidates.count().catch(() => 0), 250);

  for (let index = 0; index < count; index += 1) {
    const locator = candidates.nth(index);
    const isVisible = await locator.isVisible().catch(() => false);
    const isEnabled = await locator.isEnabled().catch(() => false);
    if (!isVisible || !isEnabled) {
      continue;
    }

    const text = await locator
      .evaluate((element) => {
        const htmlElement = element as HTMLElement;
        return htmlElement.innerText || htmlElement.textContent || '';
      })
      .then((value) => value.replace(/\s+/g, ' ').trim())
      .catch(() => '');

    if (
      !text ||
      /사규 질의응답|GS인증|검색|새 채팅|AI서비스|서비스 관리|라이트모드|비밀번호 변경|로그아웃|전체|활성|비활성|생성|삭제|편집|배포/.test(text) ||
      text.length < 4
    ) {
      continue;
    }

    if (!text.includes(query)) {
      continue;
    }

    await clickLocatorAndAssertStable(page, locator, monitor, '대화 내역 검색 결과 항목은 열려야 합니다.');
    return;
  }

  throw new Error('대화 내역에서 클릭 가능한 결과 항목을 찾지 못했습니다.');
}

async function openDashboard(page: Page): Promise<void> {
  await openScenario(page, dashboardScenario);
}

async function openLogList(page: Page): Promise<void> {
  await openScenario(page, logScenario);
  await expectListLikeSurface(page, '로그 목록 화면이 열려야 합니다.');
}

const chatCases: PlannedCase[] = [
  {
    caseId: 'eXemble_사용자 질의_010',
    title: '대화 내역을 검색할 수 있다',
    run: async (page, monitor) => {
      await openChatHistorySearch(page, monitor);
      const input = await requireSearchInput(page);
      await input.fill('사규');
      await input.press('Enter');
      await expect(input).toHaveValue('사규');
    },
  },
  {
    caseId: 'eXemble_사용자 질의_011',
    title: '검색된 대화 내역 상세를 열 수 있다',
    run: async (page, monitor) => {
      await openChatHistorySearch(page, monitor);
      const input = await requireSearchInput(page);
      await input.fill('사규');
      await input.press('Enter');
      await expect(input).toHaveValue('사규');
      await openFirstHistoryEntry(page, monitor, '사규');
      await expectKoreanSurface(page, '검색된 대화 상세 본문에 한국어 상호작용 내용이 보여야 합니다.');
      await expect(page.locator('textarea, [contenteditable="true"]').first()).toBeVisible();
    },
  },
];

const dashboardAndSystemCases: PlannedCase[] = [
  {
    caseId: 'eXemble_대시보드_014',
    title: '전체 자원 보기를 열 수 있다',
    run: async (page, monitor) => {
      await openDashboard(page);
      await clickFirstVisibleCombobox(page, monitor, '전체 자원 보기 또는 서비스 선택 제어를 열 수 있어야 합니다.', {
        modifiers: ['Shift'],
      });
    },
  },
  {
    caseId: 'eXemble_시스템_026',
    title: '서비스 상태 모니터링 지표를 확인할 수 있다',
    run: async (page) => {
      await openDashboard(page);
      await expectVisibleLabels(
        page,
        ['서비스 성공률', 'CPU(%)', 'GPU Utilization(%)', 'GPU Power(W)', 'Memory(GB)'],
        3,
        '서비스 상태 모니터링 지표가 보여야 합니다.',
      );
    },
  },
  {
    caseId: 'eXemble_시스템_005',
    title: '권장 해상도에서 화면이 정상 표시된다',
    run: async (page, monitor) => {
      const snapshot = monitor.snapshot();
      await page.setViewportSize({ width: 1920, height: 1280 });
      await expect(page.locator('body')).toBeVisible();
      await assertNoUiErrorsSince(page, monitor, snapshot, '권장 해상도에서 UI 오류가 없어야 합니다.');
    },
  },
  {
    caseId: 'eXemble_시스템_006',
    title: '최소 해상도에서 화면이 정상 표시된다',
    run: async (page, monitor) => {
      const snapshot = monitor.snapshot();
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('body')).toBeVisible();
      await assertNoUiErrorsSince(page, monitor, snapshot, '최소 해상도에서 UI 오류가 없어야 합니다.');
    },
  },
  {
    caseId: 'eXemble_시스템_013',
    title: '한국어 인터페이스를 제공한다',
    run: async (page) => {
      await expectKoreanSurface(page, '한국어 인터페이스가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_시스템_021',
    title: '로그 화면에서 요청일시 정보를 확인할 수 있다',
    run: async (page) => {
      await openLogList(page);
      await expectVisibleLabels(page, ['서비스 로그', '로그 목록', '요청일시'], 2, '요청일시 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_시스템_022',
    title: '로그 화면에서 서비스명 정보를 확인할 수 있다',
    run: async (page) => {
      await openLogList(page);
      await expectVisibleLabels(page, ['서비스 로그', '로그 목록', '서비스명'], 2, '서비스명 정보가 보여야 합니다.');
    },
  },
  {
    caseId: 'eXemble_시스템_023',
    title: '로그 상세에서 입력과 응답 기록을 확인할 수 있다',
    run: async (page, monitor) => {
      await openLogList(page);
      await openFirstContentItem(page, monitor, '로그 목록에서 첫 번째 항목을 열 수 있어야 합니다.');
      await expectVisibleLabels(page, ['기본 정보', '사용자 입력', 'AI서비스 응답'], 2, '입력과 응답 기록이 보여야 합니다.');
    },
  },
];

test.describe('Planned chat, dashboard, and system automation expansion', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginWithDefaultCredentials(page);
  });

  for (const plannedCase of [...chatCases, ...dashboardAndSystemCases]) {
    test(checklistTitle([plannedCase.caseId], plannedCase.title), async ({ page }, testInfo) => {
      annotateChecklist(testInfo, [plannedCase.caseId]);
      const monitor = startUiMonitor(page);
      await plannedCase.run(page, monitor);
    });
  }
});
