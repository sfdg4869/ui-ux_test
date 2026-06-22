import { expect, test, type Page, type Request } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';

const sampleUsername = 'abcde@example.com';
const samplePassword = 'Password1!';

function isAuthLikeStorageKey(key: string): boolean {
  return /(token|auth|jwt|access|refresh|session)/i.test(key);
}

function parseLoginPayload(rawPostData: string | null): { user_id?: string; password?: string } {
  if (!rawPostData) {
    return {};
  }

  return JSON.parse(rawPostData) as { user_id?: string; password?: string };
}

async function captureLoginRequest(page: Page): Promise<Request> {
  const loginRequestPromise = page.waitForRequest(
    (pendingRequest) =>
      new URL(pendingRequest.url()).pathname === '/api/v1/login' && pendingRequest.method() === 'POST',
  );

  await page.goto('/login');
  await page.locator('input[type="email"]').fill(sampleUsername);
  await page.locator('input[type="password"]').fill(samplePassword);
  await page.locator('button[type="submit"]').click();

  return await loginRequestPromise;
}

test.describe('P1 security auth surface smoke', () => {
  test(
    checklistTitle(['eXemble_보안_005'], 'CSRF mitigation is verified for cookie and non-cookie auth flows'),
    async ({ page, request }, testInfo) => {
      const caseIds = ['eXemble_보안_005'];
      annotateChecklist(testInfo, caseIds);

      const loginResponse = await request.get('/login', { failOnStatusCode: false });
      expect(loginResponse.ok()).toBeTruthy();

      const setCookies = loginResponse
        .headersArray()
        .filter((header) => header.name.toLowerCase() === 'set-cookie')
        .map((header) => header.value);

      if (setCookies.length > 0) {
        expect(setCookies.join('\n')).toMatch(/SameSite=(Lax|Strict)/i);
        return;
      }

      const loginRequest = await captureLoginRequest(page);
      const requestUrl = new URL(loginRequest.url());
      const requestHeaders = loginRequest.headers();
      const rawPostData = loginRequest.postData();
      const payload = parseLoginPayload(rawPostData);

      expect(requestUrl.protocol).toBe('https:');
      expect(requestUrl.search).toBe('');
      expect(requestHeaders['content-type']).toBe('application/json');
      expect(rawPostData).toBeTruthy();
      expect(rawPostData).not.toContain(samplePassword);
      expect(payload.user_id).toBe(sampleUsername);
      expect(payload.password).toMatch(/^[a-f0-9]{64}$/i);
      expect(payload.password).not.toBe(samplePassword);
    },
  );

  test('The login page masks the password field and submits through a submit button', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    expect(await passwordInput.getAttribute('type')).toBe('password');
    expect(await submitButton.getAttribute('type')).toBe('submit');
  });

  test('No auth-like storage keys should exist before login', async ({ page }) => {
    await page.goto('/login');

    const storage = await page.evaluate(() => ({
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
    }));

    for (const key of [...storage.localStorageKeys, ...storage.sessionStorageKeys]) {
      expect(isAuthLikeStorageKey(key)).toBe(false);
    }
  });

  test('The login API sends an HTTPS JSON POST without exposing the raw password in the URL', async ({ page }) => {
    const loginRequest = await captureLoginRequest(page);
    const requestUrl = new URL(loginRequest.url());
    const requestHeaders = loginRequest.headers();
    const rawPostData = loginRequest.postData();
    const payload = parseLoginPayload(rawPostData);

    expect(requestUrl.protocol).toBe('https:');
    expect(requestUrl.pathname).toBe('/api/v1/login');
    expect(requestUrl.search).toBe('');
    expect(loginRequest.method()).toBe('POST');
    expect(requestHeaders['content-type']).toBe('application/json');
    expect(rawPostData).toBeTruthy();
    expect(rawPostData).not.toContain(samplePassword);
    expect(payload.user_id).toBe(sampleUsername);
    expect(payload.password).toMatch(/^[a-f0-9]{64}$/i);
  });
});
