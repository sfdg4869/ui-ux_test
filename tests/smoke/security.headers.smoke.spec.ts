import { expect, test } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';

function normalizeHeaders(headers: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value]),
  );
}

async function getLoginHeaders(request: Parameters<typeof test>[0]['request']) {
  const response = await request.get('/login', { failOnStatusCode: false });
  expect(response.ok()).toBeTruthy();
  return normalizeHeaders(response.headers());
}

test.describe('P1 security headers smoke', () => {
  test(
    checklistTitle(['eXemble_보안_003'], 'X-Frame-Options header is configured'),
    async ({ request }, testInfo) => {
      const caseIds = ['eXemble_보안_003'];
      annotateChecklist(testInfo, caseIds);

      const headers = await getLoginHeaders(request);
      expect(headers['x-frame-options']).toMatch(/^(DENY|SAMEORIGIN)$/i);
    },
  );

  test(
    checklistTitle(['eXemble_보안_004'], 'XSS defense headers are configured'),
    async ({ request }, testInfo) => {
      const caseIds = ['eXemble_보안_004'];
      annotateChecklist(testInfo, caseIds);

      const headers = await getLoginHeaders(request);
      expect(headers['x-xss-protection']?.replace(/\s+/g, '')).toBe('1;mode=block');
    },
  );

  test(
    checklistTitle(['eXemble_보안_006'], 'HSTS header is configured'),
    async ({ request }, testInfo) => {
      const caseIds = ['eXemble_보안_006'];
      annotateChecklist(testInfo, caseIds);

      const headers = await getLoginHeaders(request);
      expect(headers['strict-transport-security']).toMatch(/max-age=\d+/i);
      expect(headers['strict-transport-security']).toMatch(/includesubdomains/i);
    },
  );

  test('X-Content-Type-Options should be nosniff', async ({ request }) => {
    const headers = await getLoginHeaders(request);
    expect(headers['x-content-type-options']?.toLowerCase()).toBe('nosniff');
  });

  test('Content-Security-Policy should include baseline hardening directives', async ({ request }) => {
    const headers = await getLoginHeaders(request);
    const csp = headers['content-security-policy'] ?? '';

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  test('Referrer-Policy should avoid leaking full URLs cross-origin', async ({ request }) => {
    const headers = await getLoginHeaders(request);
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });
});
