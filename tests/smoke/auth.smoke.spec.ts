import { expect, test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

test.describe('P0 인증 스모크', () => {
  test('로그인 화면 기본 요소가 보인다', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectLoginSurface();
  });

  test(
    checklistTitle(['eXemble_사용자 로그인_002'], '아이디 저장은 재접속 후에도 유지된다'),
    async ({ page }, testInfo) => {
      const caseIds = ['eXemble_사용자 로그인_002'];
      annotateChecklist(testInfo, caseIds);
      test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

      const { username, password } = requireCredentials();
      const loginPage = new LoginPage(page);
      const shellPage = new AppShellPage(page);

      await loginPage.goto();
      await loginPage.login(username, password, { rememberId: true });
      await shellPage.expectAuthenticatedShell();
      await shellPage.triggerLogout();

      await loginPage.goto();
      await loginPage.expectRememberedUsername(username);
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_004'], '짧은 아이디 입력은 거부된다'),
    async ({ page }, testInfo) => {
      const caseIds = ['eXemble_사용자 로그인_004'];
      annotateChecklist(testInfo, caseIds);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('abcd', 'password123!');
      await loginPage.expectFailedLogin();
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_005'], '짧은 비밀번호 입력은 거부된다'),
    async ({ page }, testInfo) => {
      const caseIds = ['eXemble_사용자 로그인_005'];
      annotateChecklist(testInfo, caseIds);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('valid-user', 'short123');
      await loginPage.expectFailedLogin();
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_001', 'eXemble_환경설정_005'], '정상 로그인 후 로그아웃할 수 있다'),
    async ({ page }, testInfo) => {
      const caseIds = ['eXemble_사용자 로그인_001', 'eXemble_환경설정_005'];
      annotateChecklist(testInfo, caseIds);
      test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');

      const { username, password } = requireCredentials();
      const loginPage = new LoginPage(page);
      const shellPage = new AppShellPage(page);

      await loginPage.goto();
      await loginPage.login(username, password, { rememberId: true });
      await shellPage.expectAuthenticatedShell();
      await shellPage.triggerLogout();

      await expect(page).toHaveURL(/\/login$/);
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_003'], 'SSO 로그인은 연동 환경이 준비되면 검증한다'),
    async () => {
      test.fixme(true, '현재 환경에서는 SSO 버튼이 비활성화되어 있습니다.');
    },
  );
});
