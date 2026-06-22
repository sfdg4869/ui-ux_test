import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  getAiServiceActivationFixture,
  getAiServiceIconFixture,
  type AiServiceMutationState,
} from '../../fixtures/automation-definitions.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import {
  hasCredentialProfile,
  mutationTestsEnabled,
  requireCredentialProfile,
} from '../../fixtures/env.js';
import {
  assertNoNewUiErrors,
  knownCspConsolePatterns,
} from '../../fixtures/regression-flow-helpers.js';
import { installUiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { pickFirstActionable } from '../../fixtures/ui-helpers.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { LoginPage } from '../../pages/login.page.js';

type IconOption = {
  x: number;
  y: number;
  width: number;
  height: number;
  path: string;
  current: boolean;
};

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function shortPath(value: string): string {
  return value.slice(0, 24);
}

async function loginForAdminMutation(page: Page): Promise<void> {
  const { username, password } = requireCredentialProfile('admin');
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

async function openAiServiceList(page: Page): Promise<void> {
  await page.goto('/ai-service');
  await expect(page.getByRole('heading', { name: 'AI서비스' })).toBeVisible();
}

async function openServiceDetail(page: Page, serviceName: string): Promise<void> {
  await openAiServiceList(page);

  const serviceCard = page.locator('a[href^="/ai-service/"]').filter({ hasText: serviceName }).first();
  await expect(serviceCard, `${serviceName} service card should be visible on the AI service list.`).toBeVisible();
  await serviceCard.click();

  await expect(page).toHaveURL(/\/ai-service\/\d+$/);
  await expect(page.getByRole('heading', { name: serviceName })).toBeVisible();
}

async function openServiceEdit(page: Page, serviceName: string): Promise<void> {
  await openServiceDetail(page, serviceName);

  const editTrigger = await pickFirstActionable([
    page.getByRole('button', { name: '편집' }),
    page.getByRole('link', { name: '편집' }),
  ]);
  expect(editTrigger, `Edit control for ${serviceName} should be visible on the detail page.`).not.toBeNull();

  await editTrigger!.click();
  await expect(page).toHaveURL(/\/ai-service\/edit\/\d+$/);
  await expect(page.getByRole('heading', { name: '서비스 편집' })).toBeVisible();
}

async function readServiceState(page: Page): Promise<AiServiceMutationState> {
  const statusRow = page.getByText('활성 상태').first().locator('xpath=ancestor::*[self::div][1]');
  const statusText = normalizeText(await statusRow.textContent().catch(() => ''));

  if (statusText.includes('비활성')) {
    return 'inactive';
  }

  if (statusText.includes('활성')) {
    return 'active';
  }

  const deactivateButton = page.getByRole('button', { name: '비활성화' }).first();
  if (await deactivateButton.isVisible().catch(() => false)) {
    return 'active';
  }

  const activateButton = page.getByRole('button', { name: '활성화' }).first();
  if (await activateButton.isVisible().catch(() => false)) {
    return 'inactive';
  }

  throw new Error('Could not determine the service state from the detail action buttons.');
}

async function maybeConfirmToggleDialog(page: Page, targetState: AiServiceMutationState): Promise<boolean> {
  const dialog = await pickFirstActionable([
    page.getByRole('dialog').last(),
    page.getByRole('alertdialog').last(),
  ]);

  if (!dialog) {
    return false;
  }

  const confirmLabel = targetState === 'active' ? '활성화' : '비활성화';
  const confirmTrigger = await pickFirstActionable([
    dialog.getByRole('button', { name: '확인' }),
    dialog.getByRole('button', { name: confirmLabel }),
    dialog.locator('button').last(),
  ]);

  expect(confirmTrigger, 'Toggle confirmation dialog should expose a confirm button.').not.toBeNull();
  await confirmTrigger!.click();
  return true;
}

async function readLatestNotificationText(page: Page): Promise<string> {
  const candidates = [
    page.locator('[data-sonner-toast]').last(),
    page.locator('[role="alert"]').last(),
    page.locator('[role="status"]').last(),
    page.locator('body').getByText(/배포할 서비스 버전이 없습니다.|실패|오류|완료|성공/).last(),
  ];

  for (const candidate of candidates) {
    const isVisible = await candidate.isVisible().catch(() => false);
    if (!isVisible) {
      continue;
    }

    const text = normalizeText(await candidate.textContent().catch(() => ''));
    if (text) {
      return text;
    }
  }

  return '';
}

async function setServiceState(
  page: Page,
  targetState: AiServiceMutationState,
  testInfo: TestInfo,
  context: string,
): Promise<boolean> {
  const currentState = await readServiceState(page);
  if (currentState === targetState) {
    return false;
  }

  const actionLabel = targetState === 'active' ? '활성화' : '비활성화';
  const actionTrigger = page.getByRole('button', { name: actionLabel }).first();
  await expect(actionTrigger, `${context}: ${actionLabel} button should be visible.`).toBeVisible();

  const monitor = installUiErrorMonitor(page);
  const snapshot = monitor.snapshot();

  await actionTrigger.click();
  await maybeConfirmToggleDialog(page, targetState);
  await page.waitForLoadState('networkidle').catch(() => {});

  const deadline = Date.now() + 20_000;
  let observedState = await readServiceState(page);
  while (observedState !== targetState && Date.now() < deadline) {
    await page.waitForTimeout(500);
    observedState = await readServiceState(page);
  }

  if (observedState !== targetState) {
    const latestNotification = await readLatestNotificationText(page);
    testInfo.annotations.push({
      type: 'observed',
      description: `${context}: notification=${latestNotification || 'none'}`,
    });

    throw new Error(
      `${context}: expected ${targetState} but observed ${observedState}. ` +
        `Latest notification: ${latestNotification || 'none'}`,
    );
  }

  await assertNoNewUiErrors(page, monitor, snapshot, `${context}: the toggle action should not create a UI error.`, {
    ignoreErrorsMatching: knownCspConsolePatterns,
  });

  testInfo.annotations.push({
    type: 'observed',
    description: `${context}: ${currentState} -> ${targetState}`,
  });

  return true;
}

async function readIconTriggerPath(page: Page): Promise<string> {
  const pathValue =
    (await page
      .locator('main button[data-slot="popover-trigger"][aria-haspopup="dialog"] svg path')
      .first()
      .getAttribute('d')
      .catch(() => null)) ?? '';

  const normalized = normalizeText(pathValue);
  if (!normalized) {
    throw new Error('Could not read the current icon path from the edit surface.');
  }

  return normalized;
}

async function openIconPicker(page: Page): Promise<void> {
  const trigger = page.locator('main button[data-slot="popover-trigger"][aria-haspopup="dialog"]').first();
  await expect(trigger, 'The icon picker trigger should be visible on the edit surface.').toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute('data-state', 'open');
}

async function listIconOptions(page: Page): Promise<IconOption[]> {
  return await page.evaluate(() => {
    const trigger = document.querySelector('main button[data-slot="popover-trigger"][aria-haspopup="dialog"][data-state="open"]');
    if (!(trigger instanceof HTMLElement)) {
      return [];
    }

    const triggerRect = trigger.getBoundingClientRect();
    const triggerPath = trigger.querySelector('svg path')?.getAttribute('d')?.replace(/\s+/g, ' ').trim() ?? '';

    const isVisible = (element: Element, rect: DOMRect): boolean => {
      const style = window.getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        !element.hasAttribute('hidden')
      );
    };

    return Array.from(document.querySelectorAll('button, [role="button"]'))
      .map((element) => {
        if (!(element instanceof HTMLElement) || element === trigger) {
          return null;
        }

        const rect = element.getBoundingClientRect();
        const path = element.querySelector('svg path')?.getAttribute('d')?.replace(/\s+/g, ' ').trim() ?? '';
        if (!path || !isVisible(element, rect)) {
          return null;
        }

        const withinPopoverBand =
          rect.width <= 60 &&
          rect.height <= 60 &&
          rect.x >= triggerRect.left - 8 &&
          rect.x <= triggerRect.left + 160 &&
          rect.y >= triggerRect.top + 20 &&
          rect.y <= triggerRect.bottom + 140;

        if (!withinPopoverBand) {
          return null;
        }

        return {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          path,
          current: path === triggerPath,
        };
      })
      .filter((option): option is IconOption => Boolean(option))
      .sort((left, right) => left.y - right.y || left.x - right.x);
  });
}

async function selectIconByPath(page: Page, targetPath: string): Promise<void> {
  await openIconPicker(page);
  const options = await listIconOptions(page);
  expect(options.length, 'The icon picker should expose at least one selectable icon option.').toBeGreaterThan(0);

  const option = options.find((candidate) => candidate.path === targetPath);
  expect(option, 'The requested icon path should exist in the picker options.').toBeDefined();

  await page.mouse.click(option!.x + option!.width / 2, option!.y + option!.height / 2);
  await expect
    .poll(() => readIconTriggerPath(page), {
      timeout: 10_000,
      message: 'The icon trigger should reflect the selected icon before save.',
    })
    .toBe(targetPath);
}

async function selectDifferentIcon(page: Page): Promise<{ originalPath: string; selectedPath: string }> {
  const originalPath = await readIconTriggerPath(page);
  await openIconPicker(page);
  const options = await listIconOptions(page);

  expect(options.length, 'The icon picker should expose multiple icon options.').toBeGreaterThan(1);

  const option = options.find((candidate) => candidate.path !== originalPath);
  expect(option, 'The icon picker should contain at least one icon different from the current selection.').toBeDefined();

  await page.mouse.click(option!.x + option!.width / 2, option!.y + option!.height / 2);
  await expect
    .poll(() => readIconTriggerPath(page), {
      timeout: 10_000,
      message: 'The selected icon should replace the original icon before save.',
    })
    .toBe(option!.path);

  return {
    originalPath,
    selectedPath: option!.path,
  };
}

async function saveServiceEdit(page: Page, context: string): Promise<void> {
  const saveButton = page.getByRole('button', { name: '저장' }).first();
  await expect(saveButton, `${context}: save button should be visible.`).toBeVisible();
  await expect(saveButton, `${context}: save button should be enabled after the mutation.`).toBeEnabled();

  await saveButton.click();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(600);
}

test.describe('AI service mutation regression', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentialProfile('admin'), 'Admin credentials are required for AI service mutation checks.');
    test.skip(!mutationTestsEnabled(), 'Set EXEMBLE_ALLOW_MUTATION_TESTS=1 before running write-scope AI service tests.');
    await loginForAdminMutation(page);
  });

  test(
    checklistTitle(['eXemble_AI서비스_037'], 'MaxGauge icon selection is saved and reflected after reopening the edit screen'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_AI서비스_037']);
      const iconFixture = getAiServiceIconFixture();

      test.skip(!iconFixture?.serviceName, 'ai-service-fixtures.json must define the target service for icon automation.');
      test.skip(iconFixture?.selectionOnlyOk, 'This case requires save-reflected verification, not selection-only verification.');
      test.skip(!iconFixture?.saveRequired, 'This case expects save-required verification.');

      const monitor = installUiErrorMonitor(page);
      let originalPath = '';
      let selectedPath = '';

      try {
        await openServiceEdit(page, iconFixture.serviceName!);
        const snapshot = monitor.snapshot();

        const selection = await selectDifferentIcon(page);
        originalPath = selection.originalPath;
        selectedPath = selection.selectedPath;

        await saveServiceEdit(page, 'Icon selection save');
        await assertNoNewUiErrors(page, monitor, snapshot, 'Saving the icon change should not introduce a UI error.', {
          ignoreErrorsMatching: knownCspConsolePatterns,
        });

        await openServiceEdit(page, iconFixture.serviceName!);
        const persistedPath = await readIconTriggerPath(page);
        expect(persistedPath, 'The saved icon should still be selected after reopening the edit screen.').toBe(selectedPath);

        testInfo.annotations.push({
          type: 'observed',
          description: `icon ${shortPath(originalPath)} -> ${shortPath(selectedPath)} persisted`,
        });
      } finally {
        if (originalPath && selectedPath && originalPath !== selectedPath) {
          await openServiceEdit(page, iconFixture.serviceName!);
          const currentPath = await readIconTriggerPath(page);

          if (currentPath !== originalPath) {
            await selectIconByPath(page, originalPath);
            await saveServiceEdit(page, 'Icon selection restore');
            await openServiceEdit(page, iconFixture.serviceName!);
            expect(await readIconTriggerPath(page), 'The original icon should be restored after the test.').toBe(originalPath);
          }
        }
      }
    },
  );

  test(
    checklistTitle(['eXemble_AI서비스_053'], 'MaxGauge can be activated and restored to the disposable baseline'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_AI서비스_053']);
      const activationFixture = getAiServiceActivationFixture('eXemble_AI서비스_053');

      test.skip(!activationFixture?.serviceName, 'ai-service-fixtures.json must define the target service for activation automation.');
      test.skip(!activationFixture?.disposable, 'Activation automation is limited to disposable services.');

      await openServiceDetail(page, activationFixture.serviceName!);

      if (activationFixture.startState) {
        await setServiceState(page, activationFixture.startState, testInfo, 'Activation precondition');
      }

      await setServiceState(page, 'active', testInfo, 'Service activation');
      expect(await readServiceState(page), 'The service should be active immediately after activation.').toBe('active');

      if (activationFixture.restoreState) {
        await setServiceState(page, activationFixture.restoreState, testInfo, 'Activation restore');
        expect(await readServiceState(page), 'The service should be restored to the configured baseline state.').toBe(
          activationFixture.restoreState,
        );
      }
    },
  );

  test(
    checklistTitle(['eXemble_AI서비스_054'], 'MaxGauge can be deactivated and left at the disposable baseline'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_AI서비스_054']);
      const activationFixture = getAiServiceActivationFixture('eXemble_AI서비스_054');

      test.skip(!activationFixture?.serviceName, 'ai-service-fixtures.json must define the target service for deactivation automation.');
      test.skip(!activationFixture?.disposable, 'Deactivation automation is limited to disposable services.');

      await openServiceDetail(page, activationFixture.serviceName!);

      if (activationFixture.startState) {
        await setServiceState(page, activationFixture.startState, testInfo, 'Deactivation precondition');
      }

      await setServiceState(page, 'inactive', testInfo, 'Service deactivation');
      expect(await readServiceState(page), 'The service should be inactive immediately after deactivation.').toBe('inactive');

      if (activationFixture.restoreState) {
        await setServiceState(page, activationFixture.restoreState, testInfo, 'Deactivation restore');
        expect(await readServiceState(page), 'The service should end at the configured restore state.').toBe(
          activationFixture.restoreState,
        );
      }
    },
  );
});
