import { expect, test, type Page } from '@playwright/test';
import { getPasswordPolicyFixture, readSecurityPolicyDefinitions } from '../../fixtures/automation-definitions.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials } from '../../fixtures/env.js';
import { assertNoNewUiErrors, loginForRegression } from '../../fixtures/regression-flow-helpers.js';
import { installUiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { pickFirstActionable } from '../../fixtures/ui-helpers.js';

async function openAccountRegister(page: Page): Promise<void> {
  await page.goto('/permission/account');
  await expect(page.getByRole('heading', { name: '계정 관리' })).toBeVisible();
  await page.getByRole('button', { name: '계정 등록' }).click();
  await expect(page.getByRole('dialog', { name: '계정 등록' })).toBeVisible();
}

async function chooseFirstVisibleOption(page: Page): Promise<string> {
  const option = await pickFirstActionable([
    page.getByRole('option').first(),
    page.locator('[role="option"]').first(),
  ]);

  expect(option, '선택 가능한 오버레이 옵션을 찾지 못했습니다.').not.toBeNull();
  const text = ((await option!.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  await option!.click();
  return text;
}

async function chooseDialogComboboxOptions(page: Page): Promise<string[]> {
  const dialog = page.getByRole('dialog', { name: '계정 등록' });
  const selections: string[] = [];

  for (const index of [0, 1, 2]) {
    const combobox = dialog.getByRole('combobox').nth(index);
    await combobox.click();
    selections.push(await chooseFirstVisibleOption(page));
    await page.waitForTimeout(150);
  }

  return selections;
}

async function fillRequiredAccountFields(page: Page, password: string): Promise<void> {
  const dialog = page.getByRole('dialog', { name: '계정 등록' });
  const policy = readSecurityPolicyDefinitions();
  const disposableEmail =
    policy.disposableAccounts?.find((account) => account.purpose === 'password-policy-validation')?.username ??
    `password-policy-${Date.now()}@example.com`;

  await dialog.getByRole('textbox', { name: '이름*' }).fill('Password Policy Test');
  await dialog.getByRole('textbox', { name: '이메일*' }).fill(disposableEmail);
  await dialog.getByRole('textbox', { name: '비밀번호*' }).fill(password);
  await chooseDialogComboboxOptions(page);
}

async function weakPasswordBlocked(page: Page): Promise<boolean> {
  const dialog = page.getByRole('dialog', { name: '계정 등록' });
  const confirmButton = dialog.getByRole('button', { name: '확인' });
  const bodyText = ((await page.locator('body').textContent()) ?? '').replace(/\s+/g, ' ');

  if (await confirmButton.isDisabled().catch(() => false)) {
    return true;
  }

  const policyMessage = dialog.getByText(/8-20자의 영문,\s*숫자,\s*특수문자를 포함해 주세요\./);
  if (await policyMessage.isVisible().catch(() => false)) {
    return true;
  }

  return /(8.?20자|영문|숫자|특수문자|비밀번호 형식|비밀번호 정책)/u.test(bodyText);
}

test.describe('보안 비밀번호 정책 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginForRegression(page);
  });

  test(
    checklistTitle(['eXemble_보안_007'], '약한 비밀번호는 계정 등록 화면에서 차단된다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_보안_007']);
      const policy = getPasswordPolicyFixture();
      test.skip(!policy, 'security-policy.json의 passwordPolicy 정의가 필요합니다.');
      test.skip(!policy.forbiddenSamples?.length, '약한 비밀번호 샘플이 필요합니다.');

      const monitor = installUiErrorMonitor(page);
      await openAccountRegister(page);

      const weakSample = policy.forbiddenSamples[0];
      const validSample = policy.allowedSamples?.[0];

      const weakSnapshot = monitor.snapshot();
      await fillRequiredAccountFields(page, weakSample);

      await expect
        .poll(async () => weakPasswordBlocked(page), {
          timeout: 15_000,
          message: '약한 비밀번호는 저장 불가 또는 정책 경고로 차단되어야 합니다.',
        })
        .toBe(true);

      await assertNoNewUiErrors(page, monitor, weakSnapshot, '약한 비밀번호 입력 후 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      if (validSample) {
        const dialog = page.getByRole('dialog', { name: '계정 등록' });
        const passwordField = dialog.getByRole('textbox', { name: '비밀번호*' });
        await passwordField.fill(validSample);
        await expect(passwordField).toHaveValue(validSample);
      }

      testInfo.annotations.push({
        type: 'password-policy',
        description: `min=${policy.minLength ?? 'n/a'} max=${policy.maxLength ?? 'n/a'} classes=${(policy.requiredCharacterClasses ?? []).join('+')}`,
      });
    },
  );
});
