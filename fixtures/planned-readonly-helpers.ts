import { expect, type Locator, type Page } from '@playwright/test';
import { requireCredentials } from './env.js';
import { closeNewPages, dismissTransientUi, installUiErrorMonitor, type UiErrorMonitor } from './ui-smoke-helpers.js';
import { pickFirstActionable, pickFirstVisible, textCandidates } from './ui-helpers.js';
import { AppShellPage } from '../pages/app-shell.page.js';
import { ListPage } from '../pages/list-page.js';
import { LoginPage } from '../pages/login.page.js';

export type HarnessScenario = Parameters<ListPage['openScenario']>[0];

export async function loginWithDefaultCredentials(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

export async function openScenario(page: Page, scenario: HarnessScenario): Promise<void> {
  const listPage = new ListPage(page);
  await listPage.openScenario(scenario);
  await expect(page).not.toHaveURL(/\/login$/);
}

export function startUiMonitor(page: Page): UiErrorMonitor {
  return installUiErrorMonitor(page);
}

export async function assertNoUiErrorsSince(
  page: Page,
  monitor: UiErrorMonitor,
  snapshot: ReturnType<UiErrorMonitor['snapshot']>,
  context: string,
): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(300);
  await dismissTransientUi(page);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);
  expect(monitor.getErrorsSince(snapshot), context).toEqual([]);
}

export async function clickLocatorAndAssertStable(
  page: Page,
  locator: Locator,
  monitor: UiErrorMonitor,
  context: string,
  options?: { modifiers?: Array<'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift'> },
): Promise<void> {
  const baselinePages = [...page.context().pages()];
  const snapshot = monitor.snapshot();
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await locator.click({ modifiers: options?.modifiers });
  await closeNewPages(page.context(), baselinePages);
  await assertNoUiErrorsSince(page, monitor, snapshot, context);
}

export async function expectVisibleLabels(
  page: Page,
  labels: string[],
  minimum: number,
  message: string,
): Promise<void> {
  await expect
    .poll(async () => {
      let count = 0;
      for (const label of labels) {
        const locator = await pickFirstVisible(textCandidates(page, [label]));
        if (locator) {
          count += 1;
        }
      }

      return count;
    }, { message })
    .toBeGreaterThanOrEqual(minimum);
}

export async function expectListLikeSurface(page: Page, context: string): Promise<void> {
  const main = page.locator('main, [role="main"]').first();

  await expect
    .poll(async () => {
      const locator = await pickFirstVisible([
        main.locator('table').first(),
        main.getByRole('tree').first(),
        main.getByRole('list').first(),
        main.locator('[class*="card"]').first(),
        main.locator('[class*="table"]').first(),
        main.locator('tbody tr').first(),
      ]);

      return Boolean(locator);
    }, { message: context })
    .toBe(true);
}

export async function searchCurrentPage(page: Page, term: string): Promise<void> {
  const shellPage = new AppShellPage(page);
  await shellPage.search(term);
}

export async function requireSearchInput(page: Page): Promise<Locator> {
  const shellPage = new AppShellPage(page);
  return shellPage.findSearchInput();
}

export async function clickNamedControl(
  page: Page,
  labels: string[],
  monitor: UiErrorMonitor,
  context: string,
  options?: { modifiers?: Array<'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift'> },
): Promise<boolean> {
  const locator = await pickFirstActionable(textCandidates(page, labels));
  if (!locator) {
    return false;
  }

  await clickLocatorAndAssertStable(page, locator, monitor, context, options);
  return true;
}

export async function clickFirstVisibleCombobox(
  page: Page,
  monitor: UiErrorMonitor,
  context: string,
  options?: { modifiers?: Array<'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift'> },
): Promise<void> {
  const main = page.locator('main, [role="main"]').first();
  const locator = await pickFirstActionable([
    main.getByRole('combobox').first(),
    page.getByRole('combobox').first(),
  ]);

  if (!locator) {
    throw new Error(`${context}: visible combobox was not found.`);
  }

  await clickLocatorAndAssertStable(page, locator, monitor, context, options);
}

export async function openFirstContentItem(
  page: Page,
  monitor: UiErrorMonitor,
  context: string,
): Promise<void> {
  const main = page.locator('main, [role="main"]').first();
  const locator = await pickFirstActionable([
    main.locator('tbody tr').first(),
    main.locator('[role="row"]').nth(1),
    main.locator('.ag-row').first(),
    main.locator('[data-row-index="0"]').first(),
    main.locator('[role="treeitem"]').first(),
    main.locator('a[href]:not([href$="/new"])').first(),
    main.locator('[class*="card"]').first(),
  ]);

  if (!locator) {
    throw new Error(`${context}: openable row, tree item, or card was not found.`);
  }

  await clickLocatorAndAssertStable(page, locator, monitor, context);
}

export async function expectDetailSurface(page: Page): Promise<void> {
  const shellPage = new AppShellPage(page);
  await shellPage.expectDetailSurface();
}

export async function expectKoreanSurface(page: Page, context: string): Promise<void> {
  await expect
    .poll(async () => {
      const bodyText = (await page.locator('body').textContent()) ?? '';
      const matches = bodyText.match(/[가-힣]/g) ?? [];
      return matches.length;
    }, { message: context })
    .toBeGreaterThan(20);
}
