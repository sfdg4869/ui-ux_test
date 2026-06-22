import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { regressionModules, smokeModules, type ModuleScenario } from '../../fixtures/module-scenarios.js';
import {
  clickSafeControl,
  closeNewPages,
  collectVisibleSafeControls,
  dismissTransientUi,
  installUiErrorMonitor,
  type SafeControlDescriptor,
} from '../../fixtures/ui-smoke-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';

type UiSmokeScenario = {
  caseIds: string[];
  name: string;
  open: (page: Page) => Promise<void>;
};

const logModuleScenario: ModuleScenario = {
  name: '로그',
  menuAliases: ['로그'],
  landingKeywords: ['서비스 로그', '로그 목록', '필터 추가'],
  requiresServiceManagement: true,
};

async function loginIfNeeded(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

async function openListScenario(page: Page, scenario: ModuleScenario): Promise<void> {
  const listPage = new ListPage(page);
  await listPage.openScenario(scenario);
  await listPage.expectModuleReady(scenario);
}

async function runSafeUiSweep(
  page: Page,
  scenario: UiSmokeScenario,
  testInfo: TestInfo,
  monitor = installUiErrorMonitor(page),
): Promise<void> {
  await scenario.open(page);
  const controls = await collectVisibleSafeControls(page);

  testInfo.annotations.push({
    type: 'safe-controls',
    description: `${scenario.name}: ${controls.map((control) => `${control.role}:${control.name}`).join(' | ') || 'none'}`,
  });

  expect(controls.length, `${scenario.name} 화면에서 클릭할 안전한 UI 컨트롤을 찾지 못했습니다.`).toBeGreaterThan(0);

  const clickedControls: string[] = [];
  const skippedControls: string[] = [];
  for (const control of controls) {
    await clickAndAssertNoUiErrors(page, scenario, control, clickedControls, skippedControls, monitor, testInfo);
  }

  testInfo.annotations.push({
    type: 'clicked-controls',
    description: `${scenario.name}: ${clickedControls.join(' | ')}`,
  });

  if (skippedControls.length > 0) {
    testInfo.annotations.push({
      type: 'skipped-controls',
      description: `${scenario.name}: ${skippedControls.join(' | ')}`,
    });
  }

  expect(clickedControls.length, `${scenario.name} 화면에서 실제 클릭까지 완료한 안전 컨트롤이 없습니다.`).toBeGreaterThan(0);
}

async function clickAndAssertNoUiErrors(
  page: Page,
  scenario: UiSmokeScenario,
  control: SafeControlDescriptor,
  clickedControls: string[],
  skippedControls: string[],
  monitor: ReturnType<typeof installUiErrorMonitor>,
  testInfo: TestInfo,
): Promise<void> {
  await scenario.open(page);

  const baselinePages = [...page.context().pages()];
  const snapshot = monitor.snapshot();

  try {
    await clickSafeControl(page, control);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    skippedControls.push(`${control.role}:${control.name} (${message})`);
    testInfo.annotations.push({
      type: 'skipped-control',
      description: `${scenario.name}: ${control.role}:${control.name} -> ${message}`,
    });
    return;
  }

  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(350);

  const newPageCount = await closeNewPages(page.context(), baselinePages);
  if (newPageCount > 0) {
    await scenario.open(page);
  }

  await dismissTransientUi(page);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);

  const errors = monitor.getErrorsSince(snapshot);
  expect(
    errors,
    `${scenario.name} 화면에서 ${control.role}:${control.name} 클릭 후 UI 오류가 발생했습니다.`,
  ).toEqual([]);

  clickedControls.push(`${control.role}:${control.name}`);
}

const uiSmokeScenarios: UiSmokeScenario[] = [
  {
    name: '대시보드',
    caseIds: ['eXemble_대시보드_001'],
    open: async (page) => openListScenario(page, smokeModules[0]),
  },
  {
    name: 'AI 서비스',
    caseIds: ['eXemble_사용자 질의_002', 'eXemble_AI서비스_001', 'eXemble_AI서비스_003', 'eXemble_AI서비스_004'],
    open: async (page) => openListScenario(page, regressionModules[0]),
  },
  {
    name: '채팅',
    caseIds: ['eXemble_사용자 질의_001', 'eXemble_사용자 질의_003', 'eXemble_사용자 질의_005'],
    open: async (page) => openListScenario(page, smokeModules[2]),
  },
  {
    name: '데이터',
    caseIds: ['eXemble_데이터_001', 'eXemble_데이터_002', 'eXemble_데이터_003'],
    open: async (page) => openListScenario(page, regressionModules[1]),
  },
  {
    name: '모델',
    caseIds: ['eXemble_모델_001', 'eXemble_모델_002', 'eXemble_모델_003', 'eXemble_모델_004'],
    open: async (page) => openListScenario(page, regressionModules[2]),
  },
  {
    name: '도구',
    caseIds: ['eXemble_도구_001', 'eXemble_도구_002', 'eXemble_도구_003'],
    open: async (page) => openListScenario(page, regressionModules[3]),
  },
  {
    name: '권한',
    caseIds: ['eXemble_권한_001', 'eXemble_권한_002'],
    open: async (page) => {
      await page.goto('/permission/account');
      await expect(page.getByRole('heading', { name: '계정 관리' })).toBeVisible();
    },
  },
  {
    name: '로그',
    caseIds: ['eXemble_로그_001', 'eXemble_로그_002', 'eXemble_로그_003', 'eXemble_로그_005'],
    open: async (page) => openListScenario(page, logModuleScenario),
  },
];

test.describe('안전한 UI 컨트롤 스모크', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginIfNeeded(page);
  });

  for (const scenario of uiSmokeScenarios) {
    test(
      checklistTitle(scenario.caseIds, `${scenario.name} 화면의 안전한 UI 컨트롤을 순회 클릭해도 UI 오류가 없어야 한다`),
      async ({ page }, testInfo) => {
        annotateChecklist(testInfo, scenario.caseIds);
        await runSafeUiSweep(page, scenario, testInfo);
      },
    );
  }
});
