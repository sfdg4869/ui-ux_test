import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials } from '../../fixtures/env.js';
import {
  assertNoNewUiErrors,
  expectExitedCreateFlow,
  expectLabelVisible,
  knownCspConsolePatterns,
  loginForRegression,
} from '../../fixtures/regression-flow-helpers.js';
import { installUiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';

async function openAgentCreate(page: Page): Promise<void> {
  await page.goto('/ai-agent/create');
  await expect(page.getByRole('heading', { name: 'AI 에이전트 생성' })).toBeVisible();
}

async function openServiceCreate(page: Page): Promise<void> {
  await page.goto('/ai-service/new');
  await expect(page.getByRole('heading', { name: '서비스 생성' })).toBeVisible();
}

test.describe('AI 생성 취소 회귀', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginForRegression(page);
  });

  test(
    checklistTitle(['eXemble_AI서비스_012'], 'AI 에이전트 생성 화면을 열고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_AI서비스_012']);
      const monitor = installUiErrorMonitor(page);

      await openAgentCreate(page);
      for (const label of ['기본 속성', '프롬프트', '테스트 채팅']) {
        await expectLabelVisible(page, label);
      }

      const snapshot = monitor.snapshot();
      await page.getByRole('button', { name: '취소' }).click();
      await expectExitedCreateFlow(page, /\/ai-agent\/create$/);
      testInfo.annotations.push({ type: 'observed', description: `cancel-url=${new URL(page.url()).pathname}` });
      await assertNoNewUiErrors(page, monitor, snapshot, 'AI 에이전트 생성 취소 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
      });
    },
  );

  test(
    checklistTitle(['eXemble_AI서비스_044'], 'AI 서비스 생성 화면을 열고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_AI서비스_044']);
      const monitor = installUiErrorMonitor(page);

      await openServiceCreate(page);
      for (const label of ['서비스 정보', '아이콘 및 이름', '사용자 설명', '식별 설명', '접근 대상']) {
        await expectLabelVisible(page, label);
      }

      const snapshot = monitor.snapshot();
      await page.getByRole('button', { name: '취소' }).click();
      await expectExitedCreateFlow(page, /\/ai-service\/new$/);
      testInfo.annotations.push({ type: 'observed', description: `cancel-url=${new URL(page.url()).pathname}` });
      await assertNoNewUiErrors(page, monitor, snapshot, 'AI 서비스 생성 취소 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
      });
    },
  );
});
