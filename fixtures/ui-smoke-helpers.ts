import type { BrowserContext, Locator, Page } from '@playwright/test';
import { textMatcher } from './ui-helpers.js';

const dangerousControlPatterns = [
  /비밀번호/u,
  /암호/u,
  /저장/u,
  /생성/u,
  /등록/u,
  /삭제/u,
  /배포/u,
  /실행/u,
  /시작/u,
  /중단/u,
  /종료/u,
  /업로드/u,
  /첨부/u,
  /추가/u,
  /수정/u,
  /편집/u,
  /재벡터/u,
  /파인튜닝/u,
  /적용/u,
  /확인/u,
  /승인/u,
  /로그아웃/u,
  /로그인/u,
  /제출/u,
  /전송/u,
  /보내기/u,
  /질문/u,
  /테스트/u,
  /탈퇴/u,
];

const safeControlPatterns = [
  /검색/u,
  /검색어/u,
  /찾기/u,
  /필터/u,
  /정렬/u,
  /보기/u,
  /상세/u,
  /내역/u,
  /새\s*채팅/u,
  /채팅/u,
  /이전/u,
  /다음/u,
  /목록/u,
  /전체/u,
  /열기/u,
  /옵션/u,
  /관리/u,
  /선택/u,
  /서비스/u,
  /데이터/u,
  /모델/u,
  /도구/u,
  /권한/u,
  /로그/u,
];

const benignConsolePatterns = [
  /ResizeObserver loop limit exceeded/i,
  /`DialogContent` requires a `DialogTitle`/i,
];

export type SafeControlRole = 'button' | 'tab' | 'link' | 'combobox' | 'searchbox' | 'textbox';

export type SafeControlDescriptor = {
  role: SafeControlRole;
  name: string;
  occurrence: number;
};

type UiErrorSnapshot = {
  consoleErrorCount: number;
  pageErrorCount: number;
  responseErrorCount: number;
};

export type UiErrorMonitor = {
  getErrorsSince: (snapshot: UiErrorSnapshot) => string[];
  snapshot: () => UiErrorSnapshot;
};

function normalizeControlName(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function isDangerousControlName(name: string): boolean {
  return dangerousControlPatterns.some((pattern) => pattern.test(name));
}

function isSafeControlName(role: SafeControlRole, name: string): boolean {
  if (!name || isDangerousControlName(name)) {
    return false;
  }

  if (role === 'tab' || role === 'combobox' || role === 'searchbox') {
    return true;
  }

  if (role === 'textbox') {
    return /(검색|검색어|필터|찾기|조건)/u.test(name);
  }

  return safeControlPatterns.some((pattern) => pattern.test(name));
}

async function readControlName(locator: Locator): Promise<string> {
  return normalizeControlName(
    await locator.evaluate((element) => {
      const ariaLabel = element.getAttribute('aria-label');
      const title = element.getAttribute('title');
      const placeholder = element.getAttribute('placeholder');
      const text = 'innerText' in element ? (element as HTMLElement).innerText : element.textContent;

      return ariaLabel || title || placeholder || text || '';
    }),
  );
}

function descriptorKey(descriptor: SafeControlDescriptor): string {
  return `${descriptor.role}|${descriptor.name}|${descriptor.occurrence}`;
}

function locatorForRole(page: Page, role: SafeControlRole): Locator {
  return page.getByRole(role);
}

async function resolveDescriptorLocator(page: Page, descriptor: SafeControlDescriptor): Promise<Locator> {
  const locator = page.getByRole(descriptor.role, { name: textMatcher(descriptor.name) });
  const count = Math.min(await locator.count().catch(() => 0), 40);
  let matchedOccurrence = -1;

  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    const isVisible = await candidate.isVisible().catch(() => false);
    const isEnabled = await candidate.isEnabled().catch(() => false);
    if (!isVisible || !isEnabled) {
      continue;
    }

    matchedOccurrence += 1;
    if (matchedOccurrence === descriptor.occurrence) {
      return candidate;
    }
  }

  throw new Error(`Could not resolve visible enabled control for ${descriptor.role}:${descriptor.name}#${descriptor.occurrence}`);
}

export async function collectVisibleSafeControls(page: Page): Promise<SafeControlDescriptor[]> {
  const descriptors: SafeControlDescriptor[] = [];
  const perNameCounts = new Map<string, number>();
  const roles: SafeControlRole[] = ['tab', 'button', 'link', 'combobox', 'searchbox', 'textbox'];

  for (const role of roles) {
    const locator = locatorForRole(page, role);
    const count = Math.min(await locator.count().catch(() => 0), 80);

    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
      const isVisible = await candidate.isVisible().catch(() => false);
      const isEnabled = await candidate.isEnabled().catch(() => false);
      if (!isVisible || !isEnabled) {
        continue;
      }

      const name = await readControlName(candidate).catch(() => '');
      if (!isSafeControlName(role, name)) {
        continue;
      }

      const key = `${role}|${name}`;
      const occurrence = perNameCounts.get(key) ?? 0;
      perNameCounts.set(key, occurrence + 1);

      descriptors.push({ role, name, occurrence });
    }
  }

  const unique = new Map<string, SafeControlDescriptor>();
  for (const descriptor of descriptors) {
    unique.set(descriptorKey(descriptor), descriptor);
  }

  return [...unique.values()].slice(0, 20);
}

export function installUiErrorMonitor(page: Page): UiErrorMonitor {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const responseErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return;
    }

    const text = normalizeControlName(message.text());
    if (!text || benignConsolePatterns.some((pattern) => pattern.test(text))) {
      return;
    }

    consoleErrors.push(text);
  });

  page.on('pageerror', (error) => {
    const text = normalizeControlName(error.message);
    if (text) {
      pageErrors.push(text);
    }
  });

  page.on('response', (response) => {
    if (response.status() < 500) {
      return;
    }

    responseErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  });

  return {
    snapshot() {
      return {
        consoleErrorCount: consoleErrors.length,
        pageErrorCount: pageErrors.length,
        responseErrorCount: responseErrors.length,
      };
    },
    getErrorsSince(snapshot) {
      return [
        ...consoleErrors.slice(snapshot.consoleErrorCount).map((message) => `console: ${message}`),
        ...pageErrors.slice(snapshot.pageErrorCount).map((message) => `pageerror: ${message}`),
        ...responseErrors.slice(snapshot.responseErrorCount).map((message) => `response: ${message}`),
      ];
    },
  };
}

export async function clickSafeControl(page: Page, descriptor: SafeControlDescriptor): Promise<void> {
  const locator = await resolveDescriptorLocator(page, descriptor);

  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await locator.click();
}

export async function dismissTransientUi(page: Page): Promise<void> {
  const closeCandidates = [
    page.getByRole('button', { name: /닫기/i }),
    page.getByRole('button', { name: /취소/i }),
    page.getByRole('button', { name: /close/i }),
  ];

  for (const candidate of closeCandidates) {
    const visible = await candidate.first().isVisible().catch(() => false);
    if (!visible) {
      continue;
    }

    await candidate.first().click().catch(() => {});
    await page.waitForTimeout(150);
    return;
  }

  await page.keyboard.press('Escape').catch(() => {});
}

export async function closeNewPages(context: BrowserContext, baselinePages: Page[]): Promise<number> {
  const baseline = new Set(baselinePages);
  const newPages = context.pages().filter((page) => !baseline.has(page));

  for (const page of newPages) {
    await page.close().catch(() => {});
  }

  return newPages.length;
}
