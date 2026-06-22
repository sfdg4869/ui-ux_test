import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials } from '../../fixtures/env.js';
import { assertNoNewUiErrors, chooseOverlayOption, expectLabelVisible, loginForRegression } from '../../fixtures/regression-flow-helpers.js';
import { installUiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';

async function openAccountRegister(page: Page): Promise<void> {
  await page.goto('/permission/account');
  await expect(page.getByRole('heading', { name: '계정 관리' })).toBeVisible();
  await page.getByRole('button', { name: '계정 등록' }).click();
  await expect(page.getByRole('dialog', { name: '계정 등록' })).toBeVisible();
}

async function openOrgPage(page: Page): Promise<void> {
  await page.goto('/permission/org');
  await expect(page.getByRole('heading', { name: '조직 관리' })).toBeVisible();
}

async function chooseDialogComboboxValue(page: Page, index: number, value: string): Promise<void> {
  const dialog = page.getByRole('dialog');
  const combobox = dialog.getByRole('combobox').nth(index);

  await combobox.click();
  await chooseOverlayOption(page, value);
  await expect(combobox).toContainText(value);
}

test.describe('권한 비영속 생성 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginForRegression(page);
  });

  test(
    checklistTitle(['eXemble_권한_004', 'eXemble_권한_006', 'eXemble_권한_008'], '계정 등록 팝업에서 권한 정보를 선택하고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_권한_004', 'eXemble_권한_006', 'eXemble_권한_008']);

      const monitor = installUiErrorMonitor(page);
      await openAccountRegister(page);
      const dialog = page.getByRole('dialog', { name: '계정 등록' });

      for (const label of ['기본 정보', '권한 정보', '이름', '이메일', '비밀번호', '역할', '소속', '직책']) {
        await expectLabelVisible(page, label);
      }

      const selectSnapshot = monitor.snapshot();
      await chooseDialogComboboxValue(page, 0, '사용자');
      await chooseDialogComboboxValue(page, 1, '어드민');
      await chooseDialogComboboxValue(page, 2, '최종관리자');
      await assertNoNewUiErrors(page, monitor, selectSnapshot, '계정 등록 권한정보 선택 후 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      testInfo.annotations.push({
        type: 'selected-permission-values',
        description: '역할=사용자 | 소속=어드민 | 직책=최종관리자',
      });

      const cancelSnapshot = monitor.snapshot();
      await dialog.getByRole('button', { name: '취소' }).click();
      await expect(dialog).toBeHidden();
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '계정 등록 취소 후 UI 오류가 없어야 합니다.');
    },
  );

  test(
    checklistTitle(['eXemble_권한_016'], '소속 추가 팝업을 열고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_권한_016']);
      const monitor = installUiErrorMonitor(page);

      await openOrgPage(page);
      const openSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '소속 추가' }).click();
      const dialog = page.getByRole('dialog', { name: '소속 추가' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('textbox', { name: '소속명' })).toBeVisible();
      await assertNoNewUiErrors(page, monitor, openSnapshot, '소속 추가 팝업을 열어도 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      const cancelSnapshot = monitor.snapshot();
      await dialog.getByRole('button', { name: '취소' }).click();
      await expect(dialog).toBeHidden();
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '소속 추가 취소 후 UI 오류가 없어야 합니다.');
    },
  );

  test(
    checklistTitle(['eXemble_권한_022'], '직책 추가 팝업을 열고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_권한_022']);
      const monitor = installUiErrorMonitor(page);

      await openOrgPage(page);
      const openSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '직책 추가' }).click();
      const dialog = page.getByRole('dialog', { name: '직책 추가' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('textbox', { name: '직책명' })).toBeVisible();
      await assertNoNewUiErrors(page, monitor, openSnapshot, '직책 추가 팝업을 열어도 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      const cancelSnapshot = monitor.snapshot();
      await dialog.getByRole('button', { name: '취소' }).click();
      await expect(dialog).toBeHidden();
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '직책 추가 취소 후 UI 오류가 없어야 합니다.');
    },
  );
});
