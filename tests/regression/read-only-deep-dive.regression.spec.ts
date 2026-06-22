import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { regressionModules, type ModuleScenario } from '../../fixtures/module-scenarios.js';
import { clickFirstActionable, interactiveTextCandidates, pickFirstVisible, textCandidates } from '../../fixtures/ui-helpers.js';
import { closeNewPages, dismissTransientUi, installUiErrorMonitor, type UiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';

type ReadOnlyDeepDiveScenario = {
  name: string;
  caseIds: string[];
  searchTerm?: string;
  overviewLabels: string[];
  selectionLabels?: string[];
  expectedNavigationPattern?: RegExp;
  detailLabels?: string[];
  detailTabLabels?: string[];
  open: (page: Page) => Promise<void>;
};

const logScenario: ModuleScenario = {
  name: '로그',
  menuAliases: ['로그'],
  landingKeywords: ['서비스 로그', '로그 목록', '필터 추가'],
  requiresServiceManagement: true,
};

const readOnlyDeepDiveScenarios: ReadOnlyDeepDiveScenario[] = [
  {
    name: 'AI 서비스',
    caseIds: ['eXemble_사용자 질의_002', 'eXemble_사용자 질의_012', 'eXemble_사용자 질의_013'],
    searchTerm: 'GS',
    overviewLabels: ['AI 서비스', 'GS인증'],
    selectionLabels: ['GS인증'],
    expectedNavigationPattern: /\/chat\/new\/\d+/,
    open: async (page) => {
      const listPage = new ListPage(page);
      await listPage.openScenario(regressionModules[0]);
    },
  },
  {
    name: '데이터',
    caseIds: ['eXemble_데이터_005', 'eXemble_데이터_014'],
    searchTerm: '문서',
    overviewLabels: ['데이터 소스', '연결된 DB', '업로드한 문서'],
    open: async (page) => {
      const listPage = new ListPage(page);
      await listPage.openScenario(regressionModules[1]);
    },
  },
  {
    name: '로그',
    caseIds: ['eXemble_로그_007', 'eXemble_로그_008', 'eXemble_로그_009', 'eXemble_로그_010'],
    overviewLabels: ['서비스 로그'],
    detailLabels: ['기본 정보', '사용자 입력', 'AI서비스 응답'],
    open: async (page) => {
      const listPage = new ListPage(page);
      await listPage.openScenario(logScenario);
    },
  },
];

async function login(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

async function expectLabelVisible(page: Page, label: string): Promise<void> {
  await expect
    .poll(async () => {
      const locator = await pickFirstVisible(textCandidates(page, [label]));
      return Boolean(locator);
    }, { message: `"${label}" 텍스트가 표시되어야 합니다.` })
    .toBe(true);
}

async function expectAllLabelsVisible(page: Page, labels: string[]): Promise<void> {
  for (const label of labels) {
    await expectLabelVisible(page, label);
  }
}

async function assertNoNewUiErrors(
  page: Page,
  monitor: UiErrorMonitor,
  snapshot: ReturnType<UiErrorMonitor['snapshot']>,
  context: string,
): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(350);
  await dismissTransientUi(page);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);
  expect(monitor.getErrorsSince(snapshot), context).toEqual([]);
}

async function clickNamedActionAndAssertStable(
  page: Page,
  labels: string[],
  monitor: UiErrorMonitor,
  context: string,
): Promise<string> {
  const baselinePages = [...page.context().pages()];
  const snapshot = monitor.snapshot();
  const candidates = interactiveTextCandidates(page, labels);
  const clicked = await clickFirstActionable(candidates);
  expect(clicked, `${context}: 클릭 가능한 컨트롤을 찾지 못했습니다.`).toBe(true);

  const openedPages = await closeNewPages(page.context(), baselinePages);
  await assertNoNewUiErrors(page, monitor, snapshot, context);
  if (openedPages > 0) {
    await page.waitForTimeout(150);
  }

  return labels.join(' / ');
}

async function runOverviewPhase(page: Page, scenario: ReadOnlyDeepDiveScenario): Promise<void> {
  await scenario.open(page);
  await expectAllLabelsVisible(page, scenario.overviewLabels);
}

async function runSelectionPhase(page: Page, scenario: ReadOnlyDeepDiveScenario, monitor: UiErrorMonitor): Promise<string | null> {
  if (!scenario.selectionLabels?.length) {
    return null;
  }

  await scenario.open(page);
  return clickNamedActionAndAssertStable(
    page,
    scenario.selectionLabels,
    monitor,
    `${scenario.name} 화면의 읽기 전용 선택 컨트롤은 안정적으로 동작해야 합니다.`,
  );
}

async function runSearchPhase(page: Page, scenario: ReadOnlyDeepDiveScenario, monitor: UiErrorMonitor): Promise<string | null> {
  if (!scenario.searchTerm) {
    return null;
  }

  await scenario.open(page);
  const listPage = new ListPage(page);
  const snapshot = monitor.snapshot();
  await listPage.runSearch(scenario.searchTerm);
  await assertNoNewUiErrors(page, monitor, snapshot, `${scenario.name} 화면 검색 후 UI 오류가 없어야 합니다.`);
  return scenario.searchTerm;
}

async function runDetailPhase(
  page: Page,
  scenario: ReadOnlyDeepDiveScenario,
  monitor: UiErrorMonitor,
): Promise<{ openedDetail: boolean; clickedTabs: string[] }> {
  if (!scenario.detailLabels?.length && !scenario.detailTabLabels?.length) {
    return { openedDetail: false, clickedTabs: [] };
  }

  await scenario.open(page);
  const listPage = new ListPage(page);
  const detailSnapshot = monitor.snapshot();
  await listPage.openFirstRowAndExpectDetail();
  await assertNoNewUiErrors(page, monitor, detailSnapshot, `${scenario.name} 첫 행 상세 화면은 정상적으로 열려야 합니다.`);

  if (scenario.detailLabels?.length) {
    await expectAllLabelsVisible(page, scenario.detailLabels);
  }

  const clickedTabs: string[] = [];
  for (const label of scenario.detailTabLabels ?? []) {
    const locator = await pickFirstVisible(textCandidates(page, [label]));
    expect(locator, `${scenario.name} 상세 화면에서 "${label}" 영역을 찾지 못했습니다.`).not.toBeNull();

    const snapshot = monitor.snapshot();
    const interactive = await clickFirstActionable(interactiveTextCandidates(page, [label]));
    if (interactive) {
      await assertNoNewUiErrors(page, monitor, snapshot, `${scenario.name} 상세 화면에서 "${label}" 탭 전환 후 UI 오류가 없어야 합니다.`);
    }

    await expectLabelVisible(page, label);
    clickedTabs.push(label);
  }

  return { openedDetail: true, clickedTabs };
}

test.describe('P1 읽기 전용 상세 탐색 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await login(page);
  });

  for (const scenario of readOnlyDeepDiveScenarios) {
    test(checklistTitle(scenario.caseIds, `${scenario.name} 읽기 전용 상세 탐색을 자동화한다`), async ({ page }, testInfo) => {
      annotateChecklist(testInfo, scenario.caseIds);
      const monitor = installUiErrorMonitor(page);

      await runOverviewPhase(page, scenario);
      const searchTerm = await runSearchPhase(page, scenario, monitor);
      const clickedSelection = await runSelectionPhase(page, scenario, monitor);
      const detailResult = await runDetailPhase(page, scenario, monitor);

      if (clickedSelection) {
        testInfo.annotations.push({
          type: 'selection-control',
          description: `${scenario.name}: ${clickedSelection}`,
        });
      }

      if (searchTerm) {
        testInfo.annotations.push({
          type: 'search-term',
          description: `${scenario.name}: ${searchTerm}`,
        });
      }

      if (detailResult.openedDetail) {
        testInfo.annotations.push({
          type: 'detail-tabs',
          description: `${scenario.name}: ${detailResult.clickedTabs.join(' | ') || 'detail-opened'}`,
        });
      }

      if (scenario.expectedNavigationPattern) {
        await expect(page).toHaveURL(scenario.expectedNavigationPattern);
      }

      expect(detailResult.openedDetail || Boolean(searchTerm) || Boolean(clickedSelection)).toBe(true);
    });
  }
});
