import type { Browser, BrowserContext, Page } from '@playwright/test';
import { harnessEnv, requireCredentialProfile, type CompleteCredentialProfile, type CredentialProfileName } from './env.js';
import { LoginPage } from '../pages/login.page.js';
import { AppShellPage } from '../pages/app-shell.page.js';

export type AuthenticatedSession = {
  context: BrowserContext;
  page: Page;
  profile: CompleteCredentialProfile;
  shellPage: AppShellPage;
};

export async function loginAsProfile(page: Page, profileName: CredentialProfileName): Promise<CompleteCredentialProfile> {
  const profile = requireCredentialProfile(profileName);
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(profile.username, profile.password);
  await shellPage.expectAuthenticatedShell();

  return profile;
}

export async function createAuthenticatedSession(
  browser: Browser,
  profileName: CredentialProfileName,
): Promise<AuthenticatedSession> {
  const profile = requireCredentialProfile(profileName);
  const context = await browser.newContext({
    baseURL: harnessEnv.baseURL,
    ignoreHTTPSErrors: true,
    storageState: profile.storageState,
  });

  const page = await context.newPage();
  const shellPage = new AppShellPage(page);

  try {
    await page.goto('/');
    if (!(await shellPage.isAuthenticatedShell())) {
      await loginAsProfile(page, profileName);
    }

    return {
      context,
      page,
      profile,
      shellPage,
    };
  } catch (error) {
    await context.close().catch(() => {});
    throw error;
  }
}

export async function closeAuthenticatedSessions(...sessions: Array<AuthenticatedSession | undefined>): Promise<void> {
  await Promise.all(
    sessions
      .filter((session): session is AuthenticatedSession => Boolean(session))
      .map((session) => session.context.close().catch(() => {})),
  );
}
