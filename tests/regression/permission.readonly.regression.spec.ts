import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { closeNewPages, dismissTransientUi, installUiErrorMonitor, type UiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { pickFirstVisible, textCandidates } from '../../fixtures/ui-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

async function login(page: Page): Promise<void> {
  const { username, password } = requireCredentials();
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await shellPage.expectAuthenticatedShell();
}

async function openPermissionRoute(page: Page, route: string, heading: string): Promise<void> {
  await page.goto(route);
  await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);
}

async function expectLabelVisible(page: Page, label: string): Promise<void> {
  await expect
    .poll(async () => {
      const locator = await pickFirstVisible(textCandidates(page, [label]));
      return Boolean(locator);
    }, { message: `"${label}" 텍스트가 표시되어야 합니다.` })
    .toBe(true);
}

async function assertNoNewUiErrors(
  page: Page,
  monitor: UiErrorMonitor,
  snapshot: ReturnType<UiErrorMonitor['snapshot']>,
  context: string,
  options?: {
    preserveTransientUi?: boolean;
  },
): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(350);
  if (!options?.preserveTransientUi) {
    await dismissTransientUi(page);
  }
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);
  expect(monitor.getErrorsSince(snapshot), context).toEqual([]);
}

test.describe('권한 읽기 전용 회귀', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await login(page);
  });

  test(
    checklistTitle(
      ['eXemble_권한_013', 'eXemble_권한_014'],
      '조직 관리 화면에서 소속/직책 목록 정보를 확인한다',
    ),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_권한_013', 'eXemble_권한_014']);
      await openPermissionRoute(page, '/permission/org', '조직 관리');

      for (const label of ['소속 목록', '직책 목록', '부여된 계정 수', '부여된 벡터 테이블 수']) {
        await expectLabelVisible(page, label);
      }

      await expect(page.getByRole('button', { name: '소속 추가' })).toBeVisible();
      await expect(page.getByRole('button', { name: '직책 추가' })).toBeVisible();
    },
  );

  test(
    checklistTitle(
      ['eXemble_권한_028', 'eXemble_권한_029', 'eXemble_권한_031', 'eXemble_권한_033', 'eXemble_권한_034'],
      '벡터 테이블 접근 정책 목록, 검색, 상세 정보를 확인한다',
    ),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, [
        'eXemble_권한_028',
        'eXemble_권한_029',
        'eXemble_권한_031',
        'eXemble_권한_033',
        'eXemble_권한_034',
      ]);

      await openPermissionRoute(page, '/permission/vector-database-access', '벡터 테이블 접근 정책');
      const monitor = installUiErrorMonitor(page);
      const shellPage = new AppShellPage(page);

      for (const label of ['벡터 테이블 목록', '백터 테이블명', '설명', '접근 정책']) {
        await expectLabelVisible(page, label);
      }

      const searchInput = await shellPage.findSearchInput();
      const searchSnapshot = monitor.snapshot();
      await searchInput.fill('intermax');
      await searchInput.press('Enter');
      await expect(searchInput).toHaveValue('intermax');
      await expect(page.getByText('intermax manual').first()).toBeVisible();
      await assertNoNewUiErrors(page, monitor, searchSnapshot, '벡터 테이블 접근 정책 검색 후 UI 오류가 없어야 합니다.');

      testInfo.annotations.push({
        type: 'search-term',
        description: 'intermax',
      });

      const baselinePages = [...page.context().pages()];
      const detailSnapshot = monitor.snapshot();
      await page.getByText('intermax manual').first().click();
      await closeNewPages(page.context(), baselinePages);
      await assertNoNewUiErrors(page, monitor, detailSnapshot, '접근 정책 상세를 열어도 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      for (const label of ['벡터 테이블 접근 정책 관리', '기본 정보', '벡터 테이블명', '설명', '접근 정책', '접근 가능한 계정']) {
        await expectLabelVisible(page, label);
      }

      await expectLabelVisible(page, '제품기술연구');
      await expectLabelVisible(page, 'QA/QS');
    },
  );

  test(
    checklistTitle(['eXemble_권한_030'], '접근 정책이 미지정된 벡터 테이블의 안내 문구를 확인한다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_권한_030']);

      await openPermissionRoute(page, '/permission/vector-database-access', '벡터 테이블 접근 정책');
      const monitor = installUiErrorMonitor(page);
      const baselinePages = [...page.context().pages()];
      const snapshot = monitor.snapshot();

      await page.getByText('XAIOps').first().click();
      await closeNewPages(page.context(), baselinePages);
      await assertNoNewUiErrors(page, monitor, snapshot, '미지정 정책 상세를 열어도 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      await expectLabelVisible(page, '벡터 테이블 접근 정책 관리');
      await expectLabelVisible(page, '접근 정책이 지정되지 않아 모든 사용자가 접근 가능합니다.');
    },
  );
});
