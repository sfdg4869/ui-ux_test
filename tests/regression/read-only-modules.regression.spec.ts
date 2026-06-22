import { test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { regressionModules } from '../../fixtures/module-scenarios.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';

test.describe('P1 읽기 전용 모듈 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();
  });

  for (const scenario of regressionModules) {
    const caseIds = scenario.checklistCaseIds ?? [];
    const title = checklistTitle(caseIds, `${scenario.name} 목록과 검색 화면에 진입한다`);

    test(title, async ({ page }, testInfo) => {
      annotateChecklist(testInfo, caseIds);
      const listPage = new ListPage(page);
      await listPage.openScenario(scenario);

      if (scenario.searchTerm) {
        await listPage.runSearch(scenario.searchTerm);
      }
    });
  }

  test.fixme('상세 화면 검증은 실제 데이터 계약을 확인한 뒤 확장한다', async ({ page }) => {
    const listPage = new ListPage(page);
    await listPage.openScenario(regressionModules[0]);
    await listPage.openFirstRowAndExpectDetail();
  });
});
