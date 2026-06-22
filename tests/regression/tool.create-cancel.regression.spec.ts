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

async function openToolCreate(page: Page): Promise<void> {
  await page.goto('/tool/create');
  await expect(page.getByRole('heading', { name: '도구 생성' })).toBeVisible();
}

test.describe('도구 비영속 생성 회귀', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginForRegression(page);
  });

  test(
    checklistTitle(['eXemble_도구_004', 'eXemble_도구_014'], '도구 생성 화면에서 기본 정보를 입력하고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_도구_004', 'eXemble_도구_014']);
      const monitor = installUiErrorMonitor(page);

      await openToolCreate(page);
      for (const label of ['기본 정보', '도구 유형', '이름', '설명', '접근 대상', '요청 옵션', '엔드포인트 URL']) {
        await expectLabelVisible(page, label);
      }

      const nameInput = page.getByPlaceholder('이름을 입력하세요');
      const descriptionInput = page.getByPlaceholder('설명을 입력하세요');
      const endpointInput = page.getByPlaceholder('엔드포인트 URL을 입력하세요');

      const fillSnapshot = monitor.snapshot();
      await nameInput.fill('Auto Tool Draft');
      await descriptionInput.fill('safe create cancel flow');
      await endpointInput.fill('https://example.com/health');
      await expect(nameInput).toHaveValue('Auto Tool Draft');
      await expect(descriptionInput).toHaveValue('safe create cancel flow');
      await expect(endpointInput).toHaveValue('https://example.com/health');
      await assertNoNewUiErrors(page, monitor, fillSnapshot, '도구 기본정보 입력 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });

      const cancelSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '취소' }).click();
      await expectExitedCreateFlow(page, /\/tool\/create$/);
      testInfo.annotations.push({ type: 'observed', description: `cancel-url=${new URL(page.url()).pathname}` });
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '도구 생성 취소 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
      });
    },
  );
});
