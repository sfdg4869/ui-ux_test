import { expect, type Locator, type Page } from '@playwright/test';
import { requireCredentials } from './env.js';
import { LoginPage } from '../pages/login.page.js';
import { AppShellPage } from '../pages/app-shell.page.js';
import { dismissTransientUi, type UiErrorMonitor } from './ui-smoke-helpers.js';
import { pickFirstVisible, textCandidates } from './ui-helpers.js';

export const knownCspConsolePatterns = [
  /Executing inline script violates the following Content Security Policy directive 'script-src 'self''/i,
];

export async function loginForRegression(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

export async function expectLabelVisible(page: Page, label: string): Promise<void> {
  await expect
    .poll(async () => {
      const locator = await pickFirstVisible(textCandidates(page, [label]));
      return Boolean(locator);
    }, { message: `"${label}" 텍스트가 표시되어야 합니다.` })
    .toBe(true);
}

export async function assertNoNewUiErrors(
  page: Page,
  monitor: UiErrorMonitor,
  snapshot: ReturnType<UiErrorMonitor['snapshot']>,
  context: string,
  options?: {
    ignoreErrorsMatching?: RegExp[];
    preserveTransientUi?: boolean;
  },
): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(350);
  if (!options?.preserveTransientUi) {
    await dismissTransientUi(page);
  }
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);

  const filteredErrors = monitor
    .getErrorsSince(snapshot)
    .filter(
      (message) => !options?.ignoreErrorsMatching?.some((pattern) => pattern.test(message)),
    );

  expect(filteredErrors, context).toEqual([]);
}

export async function expectExitedCreateFlow(page: Page, createPath: RegExp): Promise<void> {
  const shellPage = new AppShellPage(page);
  await expect(page).not.toHaveURL(createPath);
  await shellPage.expectAuthenticatedShell();
}

export async function chooseOverlayOption(page: Page, optionText: string): Promise<Locator> {
  const option = await pickFirstVisible([
    page.getByRole('option', { name: optionText }),
    page.locator('[role="option"]').getByText(optionText, { exact: true }),
    page.getByText(optionText, { exact: true }).last(),
  ]);

  if (!option) {
    throw new Error(`Could not find an overlay option for "${optionText}".`);
  }

  await option.click();
  return option;
}
