import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { dismissTransientUi, installUiErrorMonitor, type UiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

type ThemeToggleLabel = '다크모드' | '라이트모드';

async function login(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

async function openAccountMenu(page: Page): Promise<void> {
  const shellPage = new AppShellPage(page);
  const opened = await shellPage.openAccountMenu();

  expect(opened, '계정 메뉴 진입 버튼을 찾지 못했습니다.').toBe(true);
}

async function readThemeToggleLabel(page: Page): Promise<ThemeToggleLabel> {
  await openAccountMenu(page);

  const lightToggle = page.getByRole('menuitem', { name: '라이트모드' });
  if (await lightToggle.isVisible().catch(() => false)) {
    return '라이트모드';
  }

  const darkToggle = page.getByRole('menuitem', { name: '다크모드' });
  if (await darkToggle.isVisible().catch(() => false)) {
    return '다크모드';
  }

  throw new Error('테마 전환 메뉴를 찾지 못했습니다.');
}

async function clickThemeToggle(page: Page, label: ThemeToggleLabel): Promise<void> {
  await page.getByRole('menuitem', { name: label }).click();
}

async function isDarkMode(page: Page): Promise<boolean> {
  const className = (await page.locator('html').getAttribute('class')) ?? '';
  return className.split(/\s+/).includes('dark');
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

test.describe('환경설정 테마 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await login(page);
  });

  test(
    checklistTitle(['eXemble_환경설정_001', 'eXemble_환경설정_002'], '테마 모드를 왕복 전환할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_환경설정_001', 'eXemble_환경설정_002']);

      const monitor = installUiErrorMonitor(page);
      const initialDarkMode = await isDarkMode(page);
      const firstToggleLabel = await readThemeToggleLabel(page);
      const firstSnapshot = monitor.snapshot();

      await clickThemeToggle(page, firstToggleLabel);
      await expect.poll(() => isDarkMode(page)).toBe(!initialDarkMode);
      await assertNoNewUiErrors(page, monitor, firstSnapshot, '첫 번째 테마 전환 후 UI 오류가 없어야 합니다.');

      const secondToggleLabel = await readThemeToggleLabel(page);
      const expectedSecondLabel: ThemeToggleLabel = firstToggleLabel === '라이트모드' ? '다크모드' : '라이트모드';
      expect(secondToggleLabel).toBe(expectedSecondLabel);

      const secondSnapshot = monitor.snapshot();
      await clickThemeToggle(page, secondToggleLabel);
      await expect.poll(() => isDarkMode(page)).toBe(initialDarkMode);
      await assertNoNewUiErrors(page, monitor, secondSnapshot, '두 번째 테마 전환 후 UI 오류가 없어야 합니다.');

      const restoredToggleLabel = await readThemeToggleLabel(page);
      expect(restoredToggleLabel).toBe(firstToggleLabel);

      testInfo.annotations.push({
        type: 'theme-cycle',
        description: `${initialDarkMode ? 'dark' : 'light'} -> ${!initialDarkMode ? 'dark' : 'light'} -> ${initialDarkMode ? 'dark' : 'light'}`,
      });
    },
  );
});
