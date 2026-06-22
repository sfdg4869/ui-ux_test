import { test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { ChatPage } from '../../pages/chat.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

const smokePrompt = '자동화 스모크 테스트입니다. 짧게 응답해 주세요.';

test.describe('P0 채팅 스모크', () => {
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
    checklistTitle(['eXemble_사용자 질의_001', 'eXemble_사용자 질의_005'], '새 채팅을 시작하고 응답을 확인한다'),
    async ({ page }, testInfo) => {
      const caseIds = ['eXemble_사용자 질의_001', 'eXemble_사용자 질의_005'];
      annotateChecklist(testInfo, caseIds);

      const chatPage = new ChatPage(page);

      await chatPage.openChatWorkspace();
      await chatPage.startNewChatIfAvailable();
      await chatPage.sendMessage(smokePrompt);
      await chatPage.expectResponseToAppear();
    },
  );

  test(
    checklistTitle(['eXemble_사용자 질의_003'], '대화 내역을 열 수 있다'),
    async ({ page }, testInfo) => {
      const caseIds = ['eXemble_사용자 질의_003'];
      annotateChecklist(testInfo, caseIds);

      const chatPage = new ChatPage(page);

      await chatPage.openChatWorkspace();
      await chatPage.openHistory();
      await chatPage.expectHistoryVisible();
    },
  );
});
