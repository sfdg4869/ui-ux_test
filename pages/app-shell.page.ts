import { expect, type Locator, type Page } from '@playwright/test';
import { clickFirstVisible, pickFirstVisible, readLocatorValue, textCandidates, textMatcher } from '../fixtures/ui-helpers.js';

const serviceManagementModuleAliases = ['대시보드', '데이터', '모델', '도구', '권한', '로그'];
const serviceManagementEntryAliases = ['서비스 관리'];
const logoutAliases = ['로그아웃'];
const accountMenuAliases = ['계정', '사용자', '프로필', '내 정보', '관리자'];

export class AppShellPage {
  constructor(private readonly page: Page) {}

  private async hasServiceManagementNav(): Promise<boolean> {
    const locator = await pickFirstVisible(textCandidates(this.page, serviceManagementModuleAliases));
    return Boolean(locator);
  }

  async isAuthenticatedShell(): Promise<boolean> {
    if (/\/login$/i.test(this.page.url())) {
      return false;
    }

    const locator = await pickFirstVisible([
      this.page.locator('a[href="/chat/new"]'),
      this.page.locator('a[href$="/chat/new"]'),
      this.page.locator('a[href*="/chat/all-services"]'),
      this.page.getByRole('link', { name: /Ctrl\+Shift\+O/i }),
      this.page.getByRole('link', { name: /Ctrl\+Shift\+F/i }),
      this.page.getByRole('button', { name: /Ctrl\+K/i }),
    ]);

    return Boolean(locator);
  }

  async expectAuthenticatedShell(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login$/);
    await expect.poll(async () => this.isAuthenticatedShell()).toBe(true);
  }

  async openMenu(menuAliases: string[]): Promise<void> {
    const clicked = await clickFirstVisible(textCandidates(this.page, menuAliases));
    expect(clicked).toBe(true);
  }

  async hasMenu(menuAliases: string[]): Promise<boolean> {
    const locator = await pickFirstVisible(textCandidates(this.page, menuAliases));
    return Boolean(locator);
  }

  async openAccountMenu(preferredLabels: string[] = []): Promise<boolean> {
    const locator = await pickFirstVisible([
      ...textCandidates(this.page, preferredLabels),
      this.page.getByRole('button', { name: /.+@.+/ }),
      this.page.getByRole('link', { name: /.+@.+/ }),
      this.page.getByText(/.+@.+/),
      ...textCandidates(this.page, accountMenuAliases),
    ]);

    if (!locator) {
      return false;
    }

    await locator.click();
    await this.page.waitForTimeout(300);
    return true;
  }

  async enterServiceManagement(): Promise<void> {
    if (await this.hasServiceManagementNav()) {
      return;
    }

    const directEntry = [
      ...textCandidates(this.page, serviceManagementEntryAliases),
      this.page.getByRole('button', { name: textMatcher('서비스 관리') }),
    ];

    if (!(await clickFirstVisible(directEntry))) {
      if (await this.hasServiceManagementNav()) {
        return;
      }

      if (!(await this.openAccountMenu())) {
        if (await this.hasServiceManagementNav()) {
          return;
        }

        throw new Error('Could not find a service-management entry point from the authenticated shell.');
      }

      const clickedAfterMenu = await clickFirstVisible(directEntry);
      expect(clickedAfterMenu).toBe(true);
    }

    await expect.poll(async () => this.hasServiceManagementNav()).toBe(true);
  }

  async expectLandingKeywords(keywords: string[]): Promise<void> {
    await expect
      .poll(async () => {
        for (const keyword of keywords) {
          const locator = await pickFirstVisible(textCandidates(this.page, [keyword]));
          if (locator) {
            return keyword;
          }
        }

        return '';
      })
      .not.toBe('');
  }

  async triggerLogout(): Promise<void> {
    const directLogout = [
      ...textCandidates(this.page, logoutAliases),
      this.page.getByRole('button', { name: textMatcher('로그아웃') }),
    ];

    if (await clickFirstVisible(directLogout)) {
      return;
    }

    if (await this.openAccountMenu()) {
      const afterMenuOpen = await clickFirstVisible(directLogout);
      expect(afterMenuOpen).toBe(true);
      return;
    }

    throw new Error('Could not find a logout control in the authenticated shell.');
  }

  async findSearchInput(): Promise<Locator> {
    const candidates = [
      this.page.getByPlaceholder(/검색/i),
      this.page.getByRole('searchbox'),
      this.page.getByRole('textbox', { name: /검색/i }),
      this.page.locator('input[type="search"]'),
      this.page.locator('input:not([type="password"])'),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count().catch(() => 0);
      for (let index = 0; index < Math.min(count, 5); index += 1) {
        const locator = candidate.nth(index);
        const isVisible = await locator.isVisible().catch(() => false);
        const isEnabled = await locator.isEnabled().catch(() => false);
        if (isVisible && isEnabled) {
          return locator;
        }
      }
    }

    throw new Error('Could not find an enabled visible search input on the current page.');
  }

  async search(term: string): Promise<void> {
    const input = await this.findSearchInput();
    await input.fill(term);
    await input.press('Enter');
    await expect(input).toHaveValue(term);
  }

  async fillSearchTerm(term: string): Promise<void> {
    const input = await this.findSearchInput();
    await input.fill(term);
  }

  async searchTermLength(): Promise<number> {
    const input = await this.findSearchInput();
    const value = await readLocatorValue(input);
    return value.length;
  }

  async searchMaxLength(): Promise<number | null> {
    const input = await this.findSearchInput();
    const raw = await input.getAttribute('maxlength');
    if (!raw) {
      return null;
    }

    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  async openFirstResult(): Promise<void> {
    const candidate = await pickFirstVisible([
      this.page.locator('tbody tr').nth(0),
      this.page.locator('[role="row"]').nth(1),
      this.page.locator('.ag-row').nth(0),
      this.page.locator('[data-row-index="0"]'),
      this.page.locator('table tr').nth(1),
    ]);

    if (!candidate) {
      throw new Error('Could not find a visible list row to open.');
    }

    await candidate.click();
  }

  async expectDetailSurface(): Promise<void> {
    await expect
      .poll(async () => {
        const candidate = await pickFirstVisible([
          this.page.getByRole('dialog'),
          this.page.locator('[class*="drawer"]'),
          this.page.locator('[class*="detail"]'),
          this.page.locator('[aria-label*="상세"]'),
          this.page.getByText(textMatcher('상세')),
          this.page.getByRole('heading', { name: textMatcher('기본 정보') }),
          this.page.getByText(textMatcher('대화 로그')),
          this.page.getByText(textMatcher('응답 상태')),
        ]);

        return Boolean(candidate);
      })
      .toBe(true);
  }
}
