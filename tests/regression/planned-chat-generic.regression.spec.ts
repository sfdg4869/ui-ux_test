import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { getChatFixtureByCaseId } from '../../fixtures/automation-definitions.js';
import { hasCredentials } from '../../fixtures/env.js';
import { loginWithDefaultCredentials, startUiMonitor } from '../../fixtures/planned-readonly-helpers.js';
import { ChatPage } from '../../pages/chat.page.js';

type GenericChatCase = {
  caseId: string;
  title: string;
  defaultQuestion: string;
};

const genericChatCases: GenericChatCase[] = [
  {
    caseId: 'eXemble_사용자 질의_007',
    title: '답변 및 요약 응답을 확인할 수 있다',
    defaultQuestion: '사규에 대해 정리해주세요(자동화 테스트)',
  },
  {
    caseId: 'eXemble_사용자 질의_014',
    title: '정의되지 않은 질문에도 응답 흐름이 유지된다',
    defaultQuestion: 'asdfgh qwerty 자동화용 정의되지 않은 질문입니다.',
  },
];

const ignorableChatConsolePatterns = [
  /Failed to load resource: the server responded with a status of 404 \(Not Found\)/i,
];

async function assertNoChatUiErrorsSince(
  page: Page,
  monitor: ReturnType<typeof startUiMonitor>,
  snapshot: ReturnType<ReturnType<typeof startUiMonitor>['snapshot']>,
  context: string,
): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(300);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);

  const remainingErrors = monitor
    .getErrorsSince(snapshot)
    .filter((message) => !ignorableChatConsolePatterns.some((pattern) => pattern.test(message)));

  expect(remainingErrors, context).toEqual([]);
}

async function runGenericChatCase(page: Page, caseId: string, fallbackQuestion: string): Promise<void> {
  const chatFixture = getChatFixtureByCaseId(caseId);
  const question = chatFixture?.question || fallbackQuestion;

  if (!question) {
    test.skip(true, `${caseId} 질문 정의가 비어 있습니다.`);
  }

  const chatPage = new ChatPage(page);
  const monitor = startUiMonitor(page);

  await chatPage.openChatWorkspace();
  await chatPage.startNewChatIfAvailable();

  const snapshot = monitor.snapshot();
  await chatPage.sendMessage(question);
  await chatPage.expectResponseToAppear();

  if (chatFixture?.expected?.fallbackMessage) {
    await expect(page.getByText(chatFixture.expected.fallbackMessage)).toBeVisible();
  }

  if (chatFixture?.expected?.mustContainAny?.length) {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const hasMarker = chatFixture.expected.mustContainAny.some((marker) => bodyText.includes(marker));
    expect(hasMarker, `${caseId} 응답에 기대 마커가 포함되어야 합니다.`).toBe(true);
  }

  if (chatFixture?.expected?.mustNotContainAny?.length) {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    for (const marker of chatFixture.expected.mustNotContainAny) {
      expect(bodyText).not.toContain(marker);
    }
  }

  await assertNoChatUiErrorsSince(page, monitor, snapshot, `${caseId} 질문 전송 후 UI 오류가 없어야 합니다.`);
}

test.describe('Planned generic chat automation expansion', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginWithDefaultCredentials(page);
  });

  for (const plannedCase of genericChatCases) {
    test(checklistTitle([plannedCase.caseId], plannedCase.title), async ({ page }, testInfo) => {
      annotateChecklist(testInfo, [plannedCase.caseId]);
      testInfo.annotations.push({
        type: 'observed',
        description: `prompt=${getChatFixtureByCaseId(plannedCase.caseId)?.question || plannedCase.defaultQuestion}`,
      });
      await runGenericChatCase(page, plannedCase.caseId, plannedCase.defaultQuestion);
    });
  }
});
