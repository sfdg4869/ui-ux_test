import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { smokeModules } from '../../fixtures/module-scenarios.js';
import { pickFirstVisible, textCandidates } from '../../fixtures/ui-helpers.js';
import { closeNewPages, dismissTransientUi, installUiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';

const dashboardMetricCaseIds = [
  'eXemble_대시보드_002',
  'eXemble_대시보드_003',
  'eXemble_대시보드_004',
  'eXemble_대시보드_005',
  'eXemble_대시보드_006',
  'eXemble_대시보드_007',
  'eXemble_대시보드_008',
  'eXemble_대시보드_009',
  'eXemble_대시보드_010',
  'eXemble_대시보드_011',
  'eXemble_대시보드_012',
];

const dashboardControlCaseIds = ['eXemble_대시보드_013'];

const dashboardMetricLabels = [
  '서비스 성공률',
  '서비스 요청 수',
  '오류율',
  'GPU 온도',
  'VRAM 사용량',
  '응답 지연',
  'CPU(%)',
  'GPU Utilization(%)',
  'GPU Power(W)',
  'Memory(GB)',
  'GPU Power Efficiency(FPS/W)',
];

async function login(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

async function openDashboard(page: Page): Promise<void> {
  const listPage = new ListPage(page);
  await listPage.openScenario(smokeModules[0]);
}

async function expectLabelVisible(page: Page, label: string): Promise<void> {
  await expect
    .poll(async () => {
      const locator = await pickFirstVisible(textCandidates(page, [label]));
      return Boolean(locator);
    }, { message: `"${label}" 텍스트가 표시되어야 합니다.` })
    .toBe(true);
}

test.describe('대시보드 모니터링 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await login(page);
  });

  test(checklistTitle(dashboardMetricCaseIds, '대시보드 모니터링 지표를 확인한다'), async ({ page }, testInfo) => {
    annotateChecklist(testInfo, dashboardMetricCaseIds);
    await openDashboard(page);

    for (const label of dashboardMetricLabels) {
      await expectLabelVisible(page, label);
    }
  });

  test(checklistTitle(dashboardControlCaseIds, '대시보드 서비스 선택 컨트롤을 확인한다'), async ({ page }, testInfo) => {
    annotateChecklist(testInfo, dashboardControlCaseIds);
    await openDashboard(page);

    const monitor = installUiErrorMonitor(page);
    const snapshot = monitor.snapshot();
    const baselinePages = [...page.context().pages()];
    const serviceSelector = page.getByRole('combobox').first();
    const clicked = (await serviceSelector.isVisible().catch(() => false)) && (await serviceSelector.isEnabled().catch(() => false));

    expect(clicked, '대시보드 서비스 선택 컨트롤을 찾지 못했습니다.').toBe(true);
    await serviceSelector.click();

    await closeNewPages(page.context(), baselinePages);
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(350);
    await dismissTransientUi(page);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveURL(/\/login$/);
    expect(monitor.getErrorsSince(snapshot), '대시보드 서비스 선택 후 UI 오류가 없어야 합니다.').toEqual([]);
  });
});
