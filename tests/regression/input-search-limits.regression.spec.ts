import { expect, type Page, test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ListPage } from '../../pages/list-page.js';
import { regressionModules } from '../../fixtures/module-scenarios.js';
import { assertFieldRespectsMaxLength } from '../../fixtures/input-limit-helpers.js';

type SearchScenario = {
  title: string;
  caseIds: string[];
  open: (deps: { page: Page; listPage: ListPage }) => Promise<void>;
};

const searchScenarios: SearchScenario[] = [
  {
    title: 'AI 서비스 검색어',
    caseIds: ['eXemble_AI서비스_036'],
    open: async ({ page }) => {
      await page.goto('/ai-service');
      await expect(page.getByRole('heading', { name: 'AI서비스' })).toBeVisible();
    },
  },
  {
    title: 'AI 에이전트 검색어',
    caseIds: ['eXemble_AI서비스_004'],
    open: async ({ page }) => {
      await page.goto('/ai-agent');
      await expect(page.getByRole('heading', { name: 'AI에이전트' })).toBeVisible();
    },
  },
  {
    title: '데이터 검색어',
    caseIds: ['eXemble_데이터_002'],
    open: async ({ listPage }) => {
      await listPage.openScenario(regressionModules[1]);
    },
  },
  {
    title: '모델 검색어',
    caseIds: ['eXemble_모델_003'],
    open: async ({ page }) => {
      await page.goto('/model');
      await expect(page.getByText(/모델/u).first()).toBeVisible();
    },
  },
  {
    title: '도구 검색어',
    caseIds: ['eXemble_도구_003'],
    open: async ({ page }) => {
      await page.goto('/tool');
      await expect(page.getByRole('heading', { name: '도구 목록' }).first()).toBeVisible();
    },
  },
  {
    title: '계정 검색어',
    caseIds: ['eXemble_권한_002'],
    open: async ({ page }) => {
      await page.goto('/permission/account');
      await expect(page.getByRole('heading', { name: '계정 관리' })).toBeVisible();
    },
  },
];

test.describe('Input search field limits', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD are required.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();
  });

  for (const scenario of searchScenarios) {
    test(
      checklistTitle(scenario.caseIds, `${scenario.title}는 메뉴얼 기준 최대 200자를 넘기지 않는다`),
      async ({ page }, testInfo) => {
        annotateChecklist(testInfo, scenario.caseIds);
        const shellPage = new AppShellPage(page);
        const listPage = new ListPage(page);

        await scenario.open({ page, listPage });
        const searchInput = await shellPage.findSearchInput();

        await assertFieldRespectsMaxLength({
          fieldName: scenario.title,
          locator: searchInput,
          limit: 200,
          testInfo,
        });
      },
    );
  }
});
