import { expect, type Locator, type Page, test } from '@playwright/test';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import {
  assertFieldRespectsMaxLength,
  emailOfLength,
  jsonOfLength,
  repeatedText,
  urlOfLength,
} from '../../fixtures/input-limit-helpers.js';

type FieldScenario = {
  title: string;
  caseIds: string[];
  limit: number;
  open: (page: Page) => Promise<void>;
  locator: (page: Page) => Promise<Locator>;
  valueFactory?: (length: number) => string;
};

async function openServiceCreate(page: Page): Promise<void> {
  await page.goto('/ai-service/new');
  await expect(page.getByRole('heading', { name: '서비스 생성' })).toBeVisible();
}

async function openAgentCreate(page: Page): Promise<void> {
  await page.goto('/ai-agent/create');
  await expect(page.getByRole('heading', { name: 'AI 에이전트 생성' })).toBeVisible();
}

async function openToolCreate(page: Page): Promise<void> {
  await page.goto('/tool/create');
  await expect(page.getByRole('heading', { name: '도구 생성' })).toBeVisible();
}

async function openAccountRegister(page: Page): Promise<void> {
  await page.goto('/permission/account');
  await page.getByRole('button', { name: '계정 등록' }).click();
  await expect(page.getByRole('dialog', { name: '계정 등록' })).toBeVisible();
}

async function ensureToolHeaderRow(page: Page): Promise<void> {
  if ((await page.getByPlaceholder('헤더명을 입력하세요').count()) === 0) {
    await page.getByRole('button', { name: '추가하기', exact: true }).click();
  }
}

async function ensureToolPathRow(page: Page): Promise<void> {
  if ((await page.getByPlaceholder('파라미터명을 입력하세요').count()) === 0) {
    await page.getByRole('button', { name: 'Path 추가하기' }).click();
  }
}

async function ensureToolQueryRow(page: Page): Promise<void> {
  if ((await page.getByPlaceholder('파라미터명을 입력하세요').count()) === 0) {
    await page.getByRole('button', { name: 'Query 추가하기' }).click();
  }
}

const fieldScenarios: FieldScenario[] = [
  {
    title: 'AI 서비스 이름',
    caseIds: ['eXemble_AI서비스_038'],
    limit: 200,
    open: openServiceCreate,
    locator: async (page) => page.getByPlaceholder('서비스의 이름을 입력해 주세요.'),
  },
  {
    title: 'AI 서비스 사용자 설명',
    caseIds: ['eXemble_AI서비스_038'],
    limit: 100,
    open: openServiceCreate,
    locator: async (page) => page.getByRole('textbox', { name: '사용자 설명' }),
  },
  {
    title: 'AI 서비스 식별 설명',
    caseIds: ['eXemble_AI서비스_038'],
    limit: 100,
    open: openServiceCreate,
    locator: async (page) => page.getByRole('textbox', { name: '식별 설명' }),
  },
  {
    title: 'AI 에이전트 이름',
    caseIds: ['eXemble_AI서비스_005'],
    limit: 200,
    open: openAgentCreate,
    locator: async (page) => page.getByRole('textbox', { name: '이름' }).first(),
  },
  {
    title: 'AI 에이전트 설명',
    caseIds: ['eXemble_AI서비스_005'],
    limit: 200,
    open: openAgentCreate,
    locator: async (page) => page.getByRole('textbox', { name: '설명' }).first(),
  },
  {
    title: 'AI 에이전트 프롬프트',
    caseIds: ['eXemble_AI서비스_008'],
    limit: 5000,
    open: openAgentCreate,
    locator: async (page) => page.getByPlaceholder('프롬프트를 입력하세요'),
  },
  {
    title: 'AI 에이전트 온도',
    caseIds: ['eXemble_AI서비스_009'],
    limit: 2,
    open: openAgentCreate,
    locator: async (page) => page.getByRole('spinbutton', { name: '온도' }),
    valueFactory: (length) => repeatedText(length, '9'),
  },
  {
    title: 'AI 에이전트 최대 토큰 수',
    caseIds: ['eXemble_AI서비스_009'],
    limit: 10,
    open: openAgentCreate,
    locator: async (page) => page.getByRole('spinbutton', { name: '최대 토큰 수' }),
    valueFactory: (length) => repeatedText(length, '9'),
  },
  {
    title: 'AI 에이전트 테스트 채팅',
    caseIds: ['eXemble_AI서비스_010'],
    limit: 5000,
    open: openAgentCreate,
    locator: async (page) => page.getByRole('textbox', { name: 'eXemble에게 물어보세요' }),
  },
  {
    title: '도구 엔드포인트 URL',
    caseIds: ['eXemble_도구_005'],
    limit: 200,
    open: openToolCreate,
    locator: async (page) => page.getByRole('textbox', { name: '엔드포인트 URL*' }),
    valueFactory: urlOfLength,
  },
  {
    title: '도구 헤더명',
    caseIds: ['eXemble_도구_006'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolHeaderRow(page);
    },
    locator: async (page) => page.getByPlaceholder('헤더명을 입력하세요').first(),
  },
  {
    title: '도구 헤더값',
    caseIds: ['eXemble_도구_006'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolHeaderRow(page);
    },
    locator: async (page) => page.getByPlaceholder('값을 입력하세요').first(),
  },
  {
    title: '도구 Path 파라미터명',
    caseIds: ['eXemble_도구_007'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolPathRow(page);
    },
    locator: async (page) => page.getByPlaceholder('파라미터명을 입력하세요').first(),
  },
  {
    title: '도구 Path 파라미터값',
    caseIds: ['eXemble_도구_007'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolPathRow(page);
    },
    locator: async (page) => page.getByPlaceholder('값을 입력하세요').first(),
  },
  {
    title: '도구 Path 설명',
    caseIds: ['eXemble_도구_007'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolPathRow(page);
    },
    locator: async (page) => page.getByPlaceholder('AI 에이전트가 기준으로 사용할 키워드나 기능 중심 설명을 입력하세요').first(),
  },
  {
    title: '도구 Query 파라미터명',
    caseIds: ['eXemble_도구_008'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolQueryRow(page);
    },
    locator: async (page) => page.getByPlaceholder('파라미터명을 입력하세요').first(),
  },
  {
    title: '도구 Query 파라미터값',
    caseIds: ['eXemble_도구_008'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolQueryRow(page);
    },
    locator: async (page) => page.getByPlaceholder('값을 입력하세요').first(),
  },
  {
    title: '도구 Query 설명',
    caseIds: ['eXemble_도구_008'],
    limit: 200,
    open: async (page) => {
      await openToolCreate(page);
      await ensureToolQueryRow(page);
    },
    locator: async (page) => page.getByPlaceholder('AI 에이전트가 기준으로 사용할 키워드나 기능 중심 설명을 입력하세요').first(),
  },
  {
    title: '도구 요청 본문',
    caseIds: ['eXemble_도구_009'],
    limit: 5000,
    open: openToolCreate,
    locator: async (page) => page.getByRole('textbox').last(),
    valueFactory: jsonOfLength,
  },
  {
    title: '계정 등록 이름',
    caseIds: ['eXemble_권한_005'],
    limit: 200,
    open: openAccountRegister,
    locator: async (page) => page.getByRole('dialog', { name: '계정 등록' }).getByRole('textbox', { name: '이름*' }),
  },
  {
    title: '계정 등록 이메일',
    caseIds: ['eXemble_권한_005'],
    limit: 200,
    open: openAccountRegister,
    locator: async (page) => page.getByRole('dialog', { name: '계정 등록' }).getByRole('textbox', { name: '이메일*' }),
    valueFactory: emailOfLength,
  },
  {
    title: '계정 등록 비밀번호',
    caseIds: ['eXemble_권한_005'],
    limit: 20,
    open: openAccountRegister,
    locator: async (page) => page.getByRole('dialog', { name: '계정 등록' }).getByRole('textbox', { name: '비밀번호*' }),
  },
];

test.describe('Input form field limits', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD are required.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();
  });

  for (const scenario of fieldScenarios) {
    test(
      checklistTitle(scenario.caseIds, `${scenario.title}은 메뉴얼 기준 길이 제한을 지킨다`),
      async ({ page }, testInfo) => {
        annotateChecklist(testInfo, scenario.caseIds);
        await scenario.open(page);
        const locator = await scenario.locator(page);

        await assertFieldRespectsMaxLength({
          fieldName: scenario.title,
          locator,
          limit: scenario.limit,
          testInfo,
          valueFactory: scenario.valueFactory,
        });
      },
    );
  }
});
