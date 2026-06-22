import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadHarnessEnv } from './fixtures/load-env.js';

loadHarnessEnv();

process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://10.10.34.114';
const storageState = process.env.EXEMBLE_STORAGE_STATE?.trim() || undefined;
const workerCount = Number(process.env.PLAYWRIGHT_WORKERS ?? '1');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const traceMode = readTraceMode(process.env.PLAYWRIGHT_TRACE_MODE);
const screenshotMode = readScreenshotMode(process.env.PLAYWRIGHT_SCREENSHOT_MODE);
const videoMode = readVideoMode(process.env.PLAYWRIGHT_VIDEO_MODE);
const reporters = [
  ['list'],
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
];

if (process.env.TC_CATALOG_REPORT === '1') {
  reporters.push(['./reporters/tc-catalog-reporter.mjs']);
}

function readTraceMode(value: string | undefined): 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' {
  switch (value?.trim()) {
    case 'off':
    case 'on':
    case 'retain-on-failure':
    case 'on-first-retry':
      return value;
    default:
      return 'retain-on-failure';
  }
}

function readScreenshotMode(value: string | undefined): 'off' | 'on' | 'only-on-failure' | 'on-first-failure' {
  switch (value?.trim()) {
    case 'off':
    case 'on':
    case 'only-on-failure':
    case 'on-first-failure':
      return value;
    default:
      return 'only-on-failure';
  }
}

function readVideoMode(value: string | undefined): 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' | 'retain-on-first-failure' {
  switch (value?.trim()) {
    case 'off':
    case 'on':
    case 'retain-on-failure':
    case 'on-first-retry':
    case 'retain-on-first-failure':
      return value;
    default:
      return 'off';
  }
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: Number.isFinite(workerCount) && workerCount > 0 ? workerCount : 1,
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  reporter: reporters,
  outputDir: 'test-results',
  retries: process.env.CI ? 2 : 0,
  use: {
    ...devices['Desktop Chrome'],
    browserName: 'chromium',
    baseURL,
    ignoreHTTPSErrors: true,
    trace: traceMode,
    screenshot: screenshotMode,
    storageState,
    video: videoMode,
  },
  projects: [
    {
      name: 'smoke',
      testDir: path.join(__dirname, 'tests', 'smoke'),
    },
    {
      name: 'regression',
      testDir: path.join(__dirname, 'tests', 'regression'),
    },
  ],
});
