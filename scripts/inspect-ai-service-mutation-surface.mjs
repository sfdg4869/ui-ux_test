import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const diagnosticsDir = path.join(rootDir, '_workspace', 'diagnostics', 'ai-service-mutation');
const localBrowserPath = path.join(
  rootDir,
  'node_modules',
  'playwright-core',
  '.local-browsers',
  'chromium-1228',
  'chrome-win64',
  'chrome.exe',
);

process.loadEnvFile(path.join(rootDir, '.env'));

function readOptionalEnv(name) {
  return process.env[name]?.trim() || '';
}

const baseURL = readOptionalEnv('PLAYWRIGHT_BASE_URL') || 'https://10.10.34.114';
const username = readOptionalEnv('EXEMBLE_ADMIN_USERNAME') || readOptionalEnv('EXEMBLE_USERNAME');
const password = readOptionalEnv('EXEMBLE_ADMIN_PASSWORD') || readOptionalEnv('EXEMBLE_PASSWORD');
const targetService = readOptionalEnv('EXEMBLE_AI_SERVICE_MUTATION_TARGET') || 'MaxGauge';

if (!username || !password) {
  throw new Error('EXEMBLE_ADMIN_USERNAME / EXEMBLE_ADMIN_PASSWORD or EXEMBLE_USERNAME / EXEMBLE_PASSWORD are required.');
}

await fs.mkdir(diagnosticsDir, { recursive: true });

function normalizeText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

async function collectVisibleTexts(locator, max = 60) {
  const count = Math.min(await locator.count().catch(() => 0), max);
  const texts = [];
  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    const isVisible = await candidate.isVisible().catch(() => false);
    if (!isVisible) {
      continue;
    }

    const text = normalizeText(await candidate.innerText().catch(() => ''));
    if (text) {
      texts.push(text);
    }
  }

  return texts;
}

async function collectVisibleControls(page, scope, max = 80) {
  return await scope
    .locator('a,button,[role="button"],[role="link"],[role="tab"],[role="combobox"],[role="option"]')
    .evaluateAll((nodes, limit) =>
      nodes
        .map((node) => {
          const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
          const ariaLabel = node.getAttribute('aria-label') || '';
          const title = node.getAttribute('title') || '';
          const href = node.getAttribute('href') || '';
          const role = node.getAttribute('role') || node.tagName.toLowerCase();
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
            role,
            text,
            ariaLabel,
            title,
            href,
          };
        })
        .filter(Boolean)
        .slice(0, limit),
      max,
    );
}

async function collectVisibleTextboxes(scope, max = 20) {
  const textboxes = scope.getByRole('textbox');
  const count = Math.min(await textboxes.count().catch(() => 0), max);
  const values = [];

  for (let index = 0; index < count; index += 1) {
    const textbox = textboxes.nth(index);
    const isVisible = await textbox.isVisible().catch(() => false);
    if (!isVisible) {
      continue;
    }

    values.push({
      name: normalizeText(await textbox.getAttribute('aria-label').catch(() => '')),
      placeholder: normalizeText(await textbox.getAttribute('placeholder').catch(() => '')),
      value: normalizeText(await textbox.inputValue().catch(() => '')),
    });
  }

  return values;
}

async function readOuterHtml(locator) {
  return await locator.evaluate((element) => element.outerHTML).catch(() => '');
}

async function collectMainButtons(page, max = 30) {
  return await page
    .locator('main button, main [role="button"]')
    .evaluateAll((nodes, limit) =>
      nodes
        .map((node) => {
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
            text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
            ariaLabel: node.getAttribute('aria-label') || '',
            title: node.getAttribute('title') || '',
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            outerHTML: node.outerHTML,
          };
        })
        .filter(Boolean)
        .slice(0, limit),
      max,
    );
}

async function saveStep(page, name, summary, report, extra = {}) {
  const screenshotPath = path.join(diagnosticsDir, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  report.steps.push({
    name,
    url: page.url(),
    summary,
    screenshot: path.relative(rootDir, screenshotPath),
    headings: await collectVisibleTexts(page.getByRole('heading'), 20),
    controls: await collectVisibleControls(page, page.locator('body').first(), 120),
    textboxes: await collectVisibleTextboxes(page.locator('body').first(), 24),
    ...extra,
  });
}

async function clickIfVisible(locator) {
  if (!(await locator.first().isVisible().catch(() => false))) {
    return false;
  }

  await locator.first().click();
  return true;
}

function unique(values) {
  return [...new Set(values.map((value) => normalizeText(value)).filter(Boolean))];
}

const browser = await chromium.launch({
  headless: true,
  executablePath: localBrowserPath,
});

const context = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width: 1440, height: 1000 },
});

const page = await context.newPage();
const report = {
  baseURL,
  targetService,
  steps: [],
  observations: {},
};

try {
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('textbox', { name: '아이디' }).fill(username);
  await page.getByRole('textbox', { name: '비밀번호' }).fill(password);
  await saveStep(page, '01_login', 'Before login submit', report);

  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  await saveStep(page, '02_after_login', 'After login submit', report);

  await clickIfVisible(page.getByRole('button', { name: '서비스 관리' }));
  await page.waitForTimeout(600);

  await page.goto(`${baseURL}/ai-service`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  await saveStep(page, '03_ai_service_list', 'AI service list landing', report, {
    mainTexts: unique(await collectVisibleTexts(page.locator('main *'), 200)).slice(0, 80),
  });

  const main = page.locator('main').first();
  const maxGaugeText = main.getByText(new RegExp(targetService, 'i')).first();
  const maxGaugeVisible = await maxGaugeText.isVisible().catch(() => false);
  report.observations.maxGaugeVisible = maxGaugeVisible;

  if (maxGaugeVisible) {
    const row = maxGaugeText.locator(
      'xpath=ancestor::*[self::tr or @role="row" or contains(@class,"row") or contains(@class,"card")][1]',
    );
    const rowText = normalizeText(await row.innerText().catch(() => ''));
    const rowControls = await collectVisibleControls(page, row, 40);
    report.observations.maxGaugeRow = {
      rowText,
      rowControls,
    };

    await saveStep(page, '04_maxgauge_row', 'MaxGauge row/card located', report, {
      rowText,
      rowControls,
    });

    await maxGaugeText.click().catch(async () => {
      if (await row.isVisible().catch(() => false)) {
        await row.click();
      }
    });
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(1_200);

    await saveStep(page, '05_after_open', 'After opening MaxGauge detail', report, {
      mainTexts: unique(await collectVisibleTexts(page.locator('main *'), 240)).slice(0, 120),
    });

    const editTriggers = [
      page.getByRole('button', { name: /편집/i }),
      page.getByRole('button', { name: /수정/i }),
      page.getByRole('link', { name: /편집/i }),
      page.getByRole('link', { name: /수정/i }),
      page.locator('button[aria-label*="edit" i]'),
      page.locator('[data-state] button').filter({ hasText: /편집|수정/i }),
    ];

    for (const trigger of editTriggers) {
      if (await clickIfVisible(trigger)) {
        await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
        await page.waitForTimeout(1_200);
        await saveStep(page, '06_after_edit_open', 'After opening edit surface', report, {
          mainTexts: unique(await collectVisibleTexts(page.locator('main *'), 260)).slice(0, 140),
          nameInputContainerHtml: await readOuterHtml(
            page.getByRole('textbox').nth(1).locator('xpath=ancestor::*[self::div][2]'),
          ),
          nearbyButtonHtml: await readOuterHtml(
            page.getByRole('textbox').nth(1).locator('xpath=preceding-sibling::*[1]'),
          ),
          mainButtons: await collectMainButtons(page, 40),
        });

        const iconTrigger = page.locator('main button[aria-haspopup="dialog"][data-slot="popover-trigger"]').first();
        if (await iconTrigger.isVisible().catch(() => false)) {
          await iconTrigger.click().catch(() => {});
          await page.waitForTimeout(800);
          await saveStep(page, '07_after_icon_trigger', 'After clicking the icon trigger', report, {
            mainTexts: unique(await collectVisibleTexts(page.locator('body *'), 400)).slice(0, 220),
            mainButtons: await collectMainButtons(page, 60),
          });
        }
        break;
      }
    }
  }
} finally {
  const reportPath = path.join(diagnosticsDir, 'report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
  await browser.close();
}

console.log(
  JSON.stringify(
    {
      report: path.join('_workspace', 'diagnostics', 'ai-service-mutation', 'report.json'),
      steps: report.steps.map((step) => ({
        name: step.name,
        url: step.url,
        summary: step.summary,
      })),
      observations: report.observations,
    },
    null,
    2,
  ),
);
