import { test, type Page } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { smokeModules } from '../../fixtures/module-scenarios.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';

async function loginIfNeeded(page: Page) {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

test.describe('P0 모듈 진입 스모크', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginIfNeeded(page);
  });

  for (const scenario of smokeModules) {
    const caseIds = scenario.checklistCaseIds ?? [];
    const title = checklistTitle(caseIds, `${scenario.name} 모듈에 진입할 수 있다`);

    test(title, async ({ page }, testInfo) => {
      annotateChecklist(testInfo, caseIds);
      const listPage = new ListPage(page);
      await listPage.openScenario(scenario);
      await listPage.expectModuleReady(scenario);
    });
  }
});
