import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly usernameInput = () => this.page.getByRole('textbox', { name: /아이디/i }).first();
  readonly passwordInput = () => this.page.getByRole('textbox', { name: /비밀번호/i }).first();
  readonly rememberIdCheckbox = () => this.page.getByRole('checkbox', { name: /아이디 저장/i }).first();
  readonly loginButton = () => this.page.getByRole('button', { name: '로그인', exact: true });
  readonly disabledSsoButton = () => this.page.getByRole('button', { name: 'SSO로 로그인', exact: true });

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.loginButton()).toBeVisible();
  }

  async expectLoginSurface(): Promise<void> {
    await expect(this.usernameInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.rememberIdCheckbox()).toBeVisible();
    await expect(this.disabledSsoButton()).toBeDisabled();
  }

  async login(username: string, password: string, options?: { rememberId?: boolean }): Promise<void> {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);

    if (options?.rememberId) {
      await this.rememberIdCheckbox().check();
    }

    await this.loginButton().click();
  }

  async expectFailedLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.loginButton()).toBeVisible();
  }

  async expectRememberedUsername(username: string): Promise<void> {
    await expect(this.usernameInput()).toHaveValue(username);
  }
}
