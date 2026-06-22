import { expect, test } from '@playwright/test';
import { closeAuthenticatedSessions, createAuthenticatedSession } from '../../fixtures/auth-profile-helpers.js';
import { getAuthorizationExpectations, hasCredentials, hasRoleComparisonProfiles, requireCredentials } from '../../fixtures/env.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ChatPage } from '../../pages/chat.page.js';

test.describe('세션과 검색 회귀', () => {
  test('비인증 상태에서는 로그인 페이지가 열린다', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('관리자와 사용자 계정의 메뉴 노출이 분리된다', async ({ browser }, testInfo) => {
    test.skip(!hasRoleComparisonProfiles(), 'EXEMBLE_ADMIN_* / EXEMBLE_USER_* 계정이 모두 필요합니다.');

    const expectations = getAuthorizationExpectations();
    let adminSession;
    let userSession;

    try {
      adminSession = await createAuthenticatedSession(browser, 'admin');
      userSession = await createAuthenticatedSession(browser, 'user');

      await adminSession.shellPage.enterServiceManagement();
      await userSession.shellPage.enterServiceManagement().catch(() => {});

      for (const label of expectations.adminVisibleMenus) {
        expect(
          await adminSession.shellPage.hasMenu([label]),
          `관리자 계정에서 "${label}" 메뉴가 보여야 합니다.`,
        ).toBe(true);
      }

      for (const label of expectations.userHiddenMenus) {
        expect(await userSession.shellPage.hasMenu([label]), `사용자 계정에서 "${label}" 메뉴가 노출되었습니다.`).toBe(false);
      }

      testInfo.annotations.push({
        type: 'authorization-profiles',
        description: `admin=${adminSession.profile.username}, user=${userSession.profile.username}`,
      });
    } finally {
      await closeAuthenticatedSessions(adminSession, userSession);
    }
  });

  test('세션 만료 후 재로그인 시나리오는 storageState 준비 후 확장한다', async () => {
    test.fixme(true, 'EXEMBLE_STORAGE_STATE를 이용한 세션 만료 재현 절차가 필요합니다.');
  });

  test('응답 복사 버튼 노출 여부를 확인한다', async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);
    const chatPage = new ChatPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();

    await chatPage.openChatWorkspace();
    await chatPage.startNewChatIfAvailable();
    await chatPage.sendMessage('응답 복사 기능 검증용 메시지입니다.');
    await chatPage.expectResponseToAppear();

    await expect
      .poll(async () => {
        return await page.getByText(/복사/i).first().isVisible().catch(() => false);
      })
      .toBe(true);
  });
});
