import { expect, test, type Locator, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { getPrimaryDataFixture, getToolFixtureByCaseId } from '../../fixtures/automation-definitions.js';
import { hasCredentials } from '../../fixtures/env.js';
import {
  assertNoUiErrorsSince,
  clickLocatorAndAssertStable,
  clickNamedControl,
  expectDetailSurface,
  expectListLikeSurface,
  expectVisibleLabels,
  loginWithDefaultCredentials,
  openFirstContentItem,
  openScenario,
  searchCurrentPage,
  startUiMonitor,
} from '../../fixtures/planned-readonly-helpers.js';
import { regressionModules } from '../../fixtures/module-scenarios.js';
import { pickFirstActionable, pickFirstVisible, textCandidates, textMatcher } from '../../fixtures/ui-helpers.js';

const dataSourceScenario = regressionModules[1];
const toolScenario = regressionModules[3];

const defaultConnectionLabels = ['연결 상태', '상태', '정상', '비정상', '성공', '실패', '활성', '비활성'];
const defaultBasicInfoLabels = ['기본 정보', 'DB', '유형', '호스트', '포트', '드라이브', '스키마', '카탈로그'];
const defaultSchemaLabels = ['카탈로그', '스키마', 'schema', 'catalog', 'public'];
const defaultVectorLabels = ['벡터 테이블', '테이블', '목록'];
const responseButtonLabels = ['응답 테스트', '테스트', '실행'];
const ignorableDataDetailErrors = [/status of 409/i];

function detailText(page: Page): Locator {
  return page.locator('main, [role="main"], [role="dialog"]').first();
}

async function openDataSourceList(page: Page): Promise<void> {
  await openScenario(page, dataSourceScenario);
  await expectListLikeSurface(page, '데이터 소스 목록 화면이 열려야 합니다.');
}

async function trySearch(page: Page, term: string | undefined): Promise<void> {
  if (!term) {
    return;
  }

  await searchCurrentPage(page, term).catch(() => {});
}

async function openPreferredOrFirstEntry(page: Page, preferredName: string | undefined, context: string): Promise<void> {
  const main = page.locator('main, [role="main"]').first();

  if (preferredName) {
    await trySearch(page, preferredName);

    const namedEntry = await pickFirstActionable([
      main.getByRole('row', { name: textMatcher(preferredName) }).first(),
      main.getByRole('treeitem', { name: textMatcher(preferredName) }).first(),
      main.getByRole('link', { name: textMatcher(preferredName) }).first(),
      main.locator('tbody tr').filter({ hasText: preferredName }).first(),
      main.locator('[class*="card"]').filter({ hasText: preferredName }).first(),
    ]);

    if (namedEntry) {
      const monitor = startUiMonitor(page);
      await clickLocatorAndAssertStable(page, namedEntry, monitor, context);
      return;
    }
  }

  const monitor = startUiMonitor(page);
  await openFirstContentItem(page, monitor, context);
}

async function openDataSourceDetail(page: Page): Promise<void> {
  const dataFixture = getPrimaryDataFixture();
  await openDataSourceList(page);
  const main = page.locator('main, [role="main"]').first();
  const preferredName = dataFixture?.name;
  const monitor = startUiMonitor(page);
  const connectedDbRoot = await pickFirstActionable([
    main.getByRole('treeitem', { name: textMatcher('연결된 DB') }).first(),
  ]);

  if (connectedDbRoot) {
    const expanded = (await connectedDbRoot.getAttribute('aria-expanded').catch(() => '')) === 'true';
    if (!expanded) {
      await clickLocatorAndAssertStable(page, connectedDbRoot, monitor, '연결된 DB 루트를 펼쳤을 때 UI 오류가 없어야 합니다.');
    }
  }

  if (preferredName) {
    await trySearch(page, preferredName);
    const preferredNode = await pickFirstActionable([
      main.getByRole('treeitem', { name: textMatcher(preferredName) }).first(),
      main.locator('[role="treeitem"]').filter({ hasText: preferredName }).first(),
    ]);

    if (!preferredNode) {
      test.skip(true, `Preferred data source "${preferredName}" is not visible in the current environment.`);
    }

    await activateDataSourceNode(page, preferredNode!, monitor);
  } else {
    const treeItems = main.getByRole('treeitem');
    const treeItemCount = Math.min(await treeItems.count().catch(() => 0), 20);
    let databaseNode: Locator | null = null;

    for (let index = 0; index < treeItemCount; index += 1) {
      const candidate = treeItems.nth(index);
      const isVisible = await candidate.isVisible().catch(() => false);
      const isEnabled = await candidate.isEnabled().catch(() => false);
      if (!isVisible || !isEnabled) {
        continue;
      }

      const name = ((await candidate.textContent().catch(() => '')) ?? '').replace(/\s+/g, ' ').trim();
      if (!name) {
        continue;
      }

      if (/^(연결된 DB|자동 수집 문서|업로드한 문서)$/u.test(name)) {
        continue;
      }

      databaseNode = candidate;
      break;
    }

    if (!databaseNode) {
      test.skip(true, '상세를 열 수 있는 데이터 소스 DB 노드를 현재 화면에서 찾지 못했습니다.');
    }

    await activateDataSourceNode(page, databaseNode!, monitor);
  }

  await expectDetailSurface(page);
}

async function expectAnyVisibleLabel(page: Page, labels: string[], fallbackLocators: Locator[], message: string): Promise<void> {
  await expect
    .poll(async () => {
      const foundLabel = await pickFirstVisible(labels.flatMap((label) => textCandidates(page, [label])));
      if (foundLabel) {
        return true;
      }

      const fallback = await pickFirstVisible(fallbackLocators);
      return Boolean(fallback);
    }, { message })
    .toBe(true);
}

async function expectSchemaOrCatalogSurface(page: Page): Promise<void> {
  const surface = detailText(page);
  const foundLabel = await pickFirstVisible(defaultSchemaLabels.flatMap((label) => textCandidates(page, [label])));
  if (foundLabel) {
    return;
  }

  const treeLike = await pickFirstVisible([
    surface.getByRole('tree').first(),
    surface.getByRole('treeitem').first(),
    surface.locator('[class*="tree"]').first(),
    surface.locator('table tbody tr').first(),
    surface.locator('[role="row"]').nth(1),
  ]);

  if (!treeLike) {
    test.skip(true, '카탈로그/스키마 구조를 표시하는 데이터가 현재 화면에 없습니다.');
  }

  expect(treeLike, '카탈로그/스키마 구조가 보여야 합니다.').not.toBeNull();
}

async function expectVectorTableSurface(page: Page): Promise<void> {
  const dataFixture = getPrimaryDataFixture();
  const vectorNames = dataFixture?.vectorTables?.map((vectorTable) => vectorTable.name).filter(Boolean) ?? [];
  const surface = detailText(page);
  const monitor = startUiMonitor(page);

  if (vectorNames.length > 0) {
    await expectVisibleLabels(page, vectorNames, 1, '기대 벡터 테이블 이름이 보여야 합니다.');
    return;
  }

  const schemaNode = await pickFirstActionable([
    surface.getByRole('treeitem', { name: textMatcher('public') }).first(),
    surface.getByRole('treeitem').nth(1),
  ]);

  if (schemaNode) {
    const snapshot = monitor.snapshot();
    await schemaNode.click();
    const remainingErrors = monitor
      .getErrorsSince(snapshot)
      .filter((message) => !ignorableDataDetailErrors.some((pattern) => pattern.test(message)));
    expect(remainingErrors, '스키마 노드를 연 뒤에는 409 외 추가 UI 오류가 없어야 합니다.').toEqual([]);
  } else {
    const openedSection = await clickNamedControl(
      page,
      defaultVectorLabels,
      monitor,
      '벡터 테이블 관련 섹션을 열었을 때 UI 오류가 없어야 합니다.',
    ).catch(() => false);

    void openedSection;
  }

  const vectorSurface = await pickFirstVisible([
    surface.locator('table tbody tr').nth(1),
    surface.locator('[role="row"]').nth(2),
    surface.locator('[class*="table"]').first(),
    surface.locator('[class*="list"]').first(),
  ]);

  if (!vectorSurface) {
    test.skip(true, '벡터 테이블 목록을 검증할 데이터가 현재 화면에 없습니다.');
  }

  expect(vectorSurface, '벡터 테이블 목록 또는 테이블 표면이 보여야 합니다.').not.toBeNull();
}

async function openToolList(page: Page): Promise<void> {
  await openScenario(page, toolScenario);
  await expectListLikeSurface(page, '도구 목록 화면이 열려야 합니다.');
}

async function openToolTarget(page: Page, displayName: string | undefined): Promise<void> {
  await openToolList(page);
  await trySearch(page, displayName);
  await openPreferredOrFirstEntry(page, displayName, '도구 상세 또는 테스트 가능한 항목을 열었을 때 UI 오류가 없어야 합니다.');
}

async function hasDataSourceDetailPanel(page: Page): Promise<boolean> {
  for (const label of ['기본 정보', '연결 상태', '데이터베이스 제품', '소유자']) {
    const locator = await pickFirstVisible(textCandidates(page, [label]));
    if (locator) {
      return true;
    }
  }

  return false;
}

async function activateDataSourceNode(page: Page, locator: Locator, monitor: ReturnType<typeof startUiMonitor>): Promise<void> {
  const snapshot = monitor.snapshot();
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await locator.click();
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(300);

  const stillOnInstruction = await page.getByText(textMatcher('요소를 선택하세요')).first().isVisible().catch(() => false);
  if (stillOnInstruction && !(await hasDataSourceDetailPanel(page))) {
    await locator.click().catch(() => {});
    await page.waitForTimeout(300);
  }

  await expect(page.locator('body')).toBeVisible();
  const remainingErrors = monitor
    .getErrorsSince(snapshot)
    .filter((message) => !ignorableDataDetailErrors.some((pattern) => pattern.test(message)));
  expect(remainingErrors, 'DB 노드를 연 뒤에는 409 외 추가 UI 오류가 없어야 합니다.').toEqual([]);
}

async function openToolResponseAction(page: Page): Promise<void> {
  const monitor = startUiMonitor(page);
  const responseAction = await pickFirstActionable(responseButtonLabels.flatMap((label) => textCandidates(page, [label])));

  if (!responseAction) {
    test.skip(true, '응답 테스트를 시작할 수 있는 버튼을 현재 화면에서 찾지 못했습니다.');
  }

  await clickLocatorAndAssertStable(page, responseAction!, monitor, '응답 테스트를 시작했을 때 UI 오류가 없어야 합니다.');
}

async function expectToolResponseSurface(page: Page): Promise<void> {
  const toolFixture = getToolFixtureByCaseId('eXemble_도구_010');
  const successMarkers = toolFixture?.expected?.successMarkers ?? [];
  const failureMarkers = toolFixture?.expected?.failureMarkers ?? [];

  if (failureMarkers.length > 0) {
    const bodyText = (await page.locator('body').textContent()) ?? '';
    for (const marker of failureMarkers) {
      expect(bodyText).not.toContain(marker);
    }
  }

  if (successMarkers.length > 0) {
    await expectVisibleLabels(page, successMarkers, 1, '정의된 성공 마커가 보여야 합니다.');
    return;
  }

  await expect
    .poll(async () => {
      const responseSurface = await pickFirstVisible([
        page.getByRole('dialog').locator('pre, code, textarea').first(),
        detailText(page).locator('[class*="response"]').first(),
        detailText(page).locator('[class*="result"]').first(),
        detailText(page).locator('pre').first(),
        detailText(page).locator('code').first(),
        detailText(page).locator('textarea').first(),
        page.getByText(/\b200\b|\bsuccess\b|\bok\b/i).first(),
      ]);

      return Boolean(responseSurface);
    }, { message: '응답 테스트 결과를 표시하는 표면이 보여야 합니다.', timeout: 15_000 })
    .toBe(true);
}

test.describe('추가 planned 자동화 확장', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginWithDefaultCredentials(page);
  });

  test(
    checklistTitle(['eXemble_데이터_019'], 'DB 연결 상태를 확인할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_019']);
      const dataFixture = getPrimaryDataFixture();
      await openDataSourceDetail(page);

      const labels = dataFixture?.expectedStateLabels?.length ? dataFixture.expectedStateLabels : defaultConnectionLabels;
      await expectAnyVisibleLabel(
        page,
        labels,
        [
          detailText(page).locator('[data-status]').first(),
          detailText(page).locator('[class*="status"]').first(),
          detailText(page).locator('[class*="badge"]').first(),
        ],
        '연결 상태를 표시하는 라벨 또는 배지가 보여야 합니다.',
      );

      if (dataFixture?.expectedConnectionState) {
        await expect(detailText(page).getByText(textMatcher(dataFixture.expectedConnectionState))).toBeVisible();
      }
    },
  );

  test(
    checklistTitle(['eXemble_데이터_020'], 'DB 기본정보를 확인할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_020']);
      const dataFixture = getPrimaryDataFixture();
      await openDataSourceDetail(page);

      const labels = dataFixture?.expectedBasicInfoLabels?.length ? dataFixture.expectedBasicInfoLabels : defaultBasicInfoLabels;
      await expectVisibleLabels(
        page,
        labels,
        dataFixture?.lenientValidation ? 1 : Math.min(2, labels.length),
        'DB 기본정보 라벨이 보여야 합니다.',
      );
    },
  );

  test(
    checklistTitle(['eXemble_데이터_021'], '카탈로그와 스키마를 확인할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_021']);
      const dataFixture = getPrimaryDataFixture();
      await openDataSourceDetail(page);

      const expectedSamples = [...(dataFixture?.expectedCatalogSamples ?? []), ...(dataFixture?.expectedSchemaSamples ?? [])];
      if (expectedSamples.length > 0) {
        await expectVisibleLabels(page, expectedSamples, 1, '기대 카탈로그/스키마 샘플이 보여야 합니다.');
        return;
      }

      await expectSchemaOrCatalogSurface(page);
    },
  );

  test(
    checklistTitle(['eXemble_데이터_022'], '벡터 테이블 목록을 조회할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_022']);
      await openDataSourceDetail(page);
      await expectVectorTableSurface(page);
    },
  );

  test(
    checklistTitle(['eXemble_도구_010'], '도구 응답 테스트를 실행할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_도구_010']);
      const toolFixture = getToolFixtureByCaseId('eXemble_도구_010');
      const hasExplicitResponseRule = Boolean(
        toolFixture?.expected?.successMarkers?.length ||
          toolFixture?.expected?.failureMarkers?.length ||
          toolFixture?.url ||
          (toolFixture?.payload && Object.keys(toolFixture.payload).length > 0),
      );

      test.skip(!hasExplicitResponseRule, '응답 테스트 성공 기준 또는 고정 payload/url 정의가 더 필요합니다.');
      await openToolTarget(page, toolFixture?.registeredToolDisplayName ?? toolFixture?.toolName);
      await openToolResponseAction(page);
      await expectToolResponseSurface(page);
    },
  );
});
