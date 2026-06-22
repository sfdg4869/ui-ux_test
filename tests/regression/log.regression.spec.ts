import { expect, test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';
import type { ModuleScenario } from '../../fixtures/module-scenarios.js';

const logScenario: ModuleScenario = {
  name: '로그',
  menuAliases: ['로그'],
  landingKeywords: ['서비스 로그', '로그 목록', '필터 추가'],
  requiresServiceManagement: true,
};

test.describe('로그 모듈 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();
  });

  test(
    checklistTitle(['eXemble_로그_001', 'eXemble_로그_002'], '서비스 로그 목록 화면에 진입한다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_로그_001', 'eXemble_로그_002']);

      const listPage = new ListPage(page);
      await listPage.openScenario(logScenario);

      await expect(page.getByText(/서비스 로그|로그 목록/i).first()).toBeVisible();
      await expect(page.locator('table').first()).toBeVisible();
    },
  );

  test(
    checklistTitle(['eXemble_로그_003'], '요청 일시 필터 컨트롤을 확인한다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_로그_003']);

      const listPage = new ListPage(page);
      await listPage.openScenario(logScenario);

      const filterButton = page.getByRole('button', { name: /요청 일시|필터 추가/i }).first();
      await expect(filterButton).toBeVisible();
      await expect(filterButton).toBeEnabled();
      await filterButton.click();
      await expect(page.getByText(/요청 일시|필터/i).first()).toBeVisible();
    },
  );

  test(
    checklistTitle(['eXemble_로그_005'], '로그 정렬 컨트롤을 확인한다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_로그_005']);

      const listPage = new ListPage(page);
      await listPage.openScenario(logScenario);

      const sortControl = page.locator('[role="combobox"]').last();
      await expect(sortControl).toBeVisible();
      await sortControl.click();
      await expect(page.getByText(/내림차순|오름차순/i).first()).toBeVisible();
    },
  );
});
