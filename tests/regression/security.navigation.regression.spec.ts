import { expect, test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

test.describe('보안 동작 회귀', () => {
  test('인증 없이 루트 경로에 접근하면 로그인 화면으로 이동한다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('로그아웃 후 뒤로가기로 보호 화면에 다시 들어갈 수 없다', async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();

    await shellPage.triggerLogout();
    await expect(page).toHaveURL(/\/login$/);

    await page.goBack().catch(() => undefined);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('로그아웃 후 루트 경로를 다시 열어도 보호 화면이 바로 노출되지 않는다', async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();

    await shellPage.triggerLogout();
    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
  });
});
