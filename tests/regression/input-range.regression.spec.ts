import { expect, test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ChatPage } from '../../pages/chat.page.js';
import { assertFieldRespectsMaxLength } from '../../fixtures/input-limit-helpers.js';

const usernameMin = 5;
const usernameMax = 32;
const passwordMin = 9;
const passwordMax = 32;

function repeated(length: number, seed = 'a'): string {
  return seed.repeat(length);
}

test.describe('Input range validation regression', () => {
  test(
    checklistTitle(['eXemble_사용자 로그인_001'], 'login username input respects the 32-character manual limit'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_사용자 로그인_001']);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await assertFieldRespectsMaxLength({
        fieldName: '로그인 아이디',
        locator: loginPage.usernameInput(),
        limit: usernameMax,
        testInfo,
      });
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_001'], 'login password input respects the 32-character manual limit'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_사용자 로그인_001']);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await assertFieldRespectsMaxLength({
        fieldName: '로그인 비밀번호',
        locator: loginPage.passwordInput(),
        limit: passwordMax,
        testInfo,
      });
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_004'], 'login rejects username shorter than 5 characters'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_사용자 로그인_004']);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(repeated(usernameMin - 1), 'Password123!');
      await loginPage.expectFailedLogin();
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_004'], 'login rejects username longer than 32 characters'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_사용자 로그인_004']);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(repeated(usernameMax + 1), 'Password123!');
      await loginPage.expectFailedLogin();
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_005'], 'login rejects password shorter than 9 characters'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_사용자 로그인_005']);
      const loginPage = new LoginPage(page);
      const username = hasCredentials() ? requireCredentials().username : 'valid-user@example.com';

      await loginPage.goto();
      await loginPage.login(username, repeated(passwordMin - 1));
      await loginPage.expectFailedLogin();
    },
  );

  test(
    checklistTitle(['eXemble_사용자 로그인_005'], 'login rejects password longer than 32 characters'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_사용자 로그인_005']);
      const loginPage = new LoginPage(page);
      const username = hasCredentials() ? requireCredentials().username : 'valid-user@example.com';

      await loginPage.goto();
      await loginPage.login(username, repeated(passwordMax + 1));
      await loginPage.expectFailedLogin();
    },
  );

  test.describe('authenticated input limits', () => {
    test.beforeEach(async ({ page }) => {
      test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD are required.');

      const { username, password } = requireCredentials();
      const loginPage = new LoginPage(page);
      const shellPage = new AppShellPage(page);

      await loginPage.goto();
      await loginPage.login(username, password);
      await shellPage.expectAuthenticatedShell();
    });

    test(
      checklistTitle(['eXemble_사용자 질의_005'], 'chat composer respects the 5000-character manual limit'),
      async ({ page }, testInfo) => {
        annotateChecklist(testInfo, ['eXemble_사용자 질의_005']);
        const chatPage = new ChatPage(page);
        const composer = await (async () => {
          await chatPage.openChatWorkspace();
          await chatPage.startNewChatIfAvailable();
          return await chatPage.composer();
        })();

        await assertFieldRespectsMaxLength({
          fieldName: '채팅 질의 입력',
          locator: composer,
          limit: 5000,
          testInfo,
        });
      },
    );
  });
});
