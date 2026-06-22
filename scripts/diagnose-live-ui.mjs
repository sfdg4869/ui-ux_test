import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, '_workspace', 'diagnostics');

process.loadEnvFile(path.join(rootDir, '.env'));

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://10.10.34.114';
const username = process.env.EXEMBLE_USERNAME ?? '';
const password = process.env.EXEMBLE_PASSWORD ?? '';

if (!username || !password) {
  throw new Error('EXEMBLE_USERNAME and EXEMBLE_PASSWORD are required.');
}

await fs.mkdir(outDir, { recursive: true });

function visibleText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

async function collectVisibleControls(page) {
  return await page.locator('a,button,[role="button"],[role="link"]').evaluateAll((nodes) =>
    nodes
      .map((node) => {
        const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
        const aria = node.getAttribute('aria-label') || '';
        const title = node.getAttribute('title') || '';
        const href = node.getAttribute('href') || '';
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          !node.hasAttribute('hidden');

        if (!visible) {
          return null;
        }

        return {
          tag: node.tagName.toLowerCase(),
          text,
          aria,
          title,
          href,
        };
      })
      .filter(Boolean),
  );
}

async function saveStep(page, name, summary, diagnostics) {
  const screenshotPath = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  diagnostics.steps.push({
    name,
    url: page.url(),
    summary,
    screenshot: path.relative(rootDir, screenshotPath),
    controls: await collectVisibleControls(page),
  });
}

const browser = await chromium.launch({
  headless: true,
  executablePath: path.join(
    rootDir,
    'node_modules',
    'playwright-core',
    '.local-browsers',
    'chromium-1228',
    'chrome-win64',
    'chrome.exe',
  ),
});

const context = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width: 1280, height: 720 },
});

const page = await context.newPage();
const diagnostics = {
  baseURL,
  steps: [],
  tcHints: [],
};

try {
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' });
  await saveStep(page, '01_login_page', 'Initial login page', diagnostics);

  await page.locator('input[type="email"]').fill(username);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await saveStep(page, '02_after_login', 'After login submit', diagnostics);

  diagnostics.tcHints.push({
    tcId: 'eXemble_사용자 로그인_001',
    observed: page.url().includes('/login') ? 'failed-login' : 'logged-in',
  });

  const accountPanel = page.getByText(/admin@ex-em\.com/i).first();
  if (await accountPanel.isVisible().catch(() => false)) {
    await accountPanel.click();
    await page.waitForTimeout(1000);
    await saveStep(page, '03_after_account_click', 'After clicking account info area', diagnostics);
  }

  const serviceManage = page.getByRole('button', { name: /서비스 관리/i }).first();
  if (await serviceManage.isVisible().catch(() => false)) {
    await serviceManage.click({ force: true });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await saveStep(page, '04_after_service_manage_click', 'After clicking service management', diagnostics);
  }

  const aiService = page.locator('a[href*="/chat/all-services"]').first();
  if (await aiService.isVisible().catch(() => false)) {
    try {
      await aiService.click({ force: true });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await saveStep(page, '05_after_ai_service_click', 'After clicking AI service menu', diagnostics);
      diagnostics.tcHints.push({
        tcId: 'eXemble_사용자 질의_002',
        observed: page.url(),
      });
    } catch (error) {
      diagnostics.tcHints.push({
        tcId: 'eXemble_사용자 질의_002',
        observed: `click-blocked:${error instanceof Error ? error.name : 'unknown'}`,
      });
    }
  }

  const newChat = page.locator('a[href="/chat/new"]').nth(1);
  if (await newChat.isVisible().catch(() => false)) {
    try {
      await newChat.click({ force: true });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await saveStep(page, '06_after_new_chat_click', 'After clicking new chat menu', diagnostics);
      diagnostics.tcHints.push({
        tcId: 'eXemble_사용자 질의_001',
        observed: page.url(),
      });
    } catch (error) {
      diagnostics.tcHints.push({
        tcId: 'eXemble_사용자 질의_001',
        observed: `click-blocked:${error instanceof Error ? error.name : 'unknown'}`,
      });
    }
  }

  const composer = page.locator('textarea, [contenteditable="true"]').first();
  if (await composer.isVisible().catch(() => false)) {
    await composer.fill('자동 진단 메시지입니다.');
    await page.waitForTimeout(500);
    await saveStep(page, '07_after_composer_fill', 'After filling chat composer', diagnostics);
  }
} finally {
  const reportPath = path.join(outDir, 'live-ui-diagnostics.json');
  await fs.writeFile(reportPath, JSON.stringify(diagnostics, null, 2), 'utf8');
  await browser.close();
}

console.log(JSON.stringify({
  report: path.join('_workspace', 'diagnostics', 'live-ui-diagnostics.json'),
  steps: diagnostics.steps.map((step) => ({ name: step.name, url: step.url })),
  tcHints: diagnostics.tcHints,
}, null, 2));
