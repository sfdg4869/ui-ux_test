import { expect, test, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { hasCredentials } from '../../fixtures/env.js';
import {
  assertNoNewUiErrors,
  expectExitedCreateFlow,
  expectLabelVisible,
  knownCspConsolePatterns,
  loginForRegression,
} from '../../fixtures/regression-flow-helpers.js';
import { installUiErrorMonitor } from '../../fixtures/ui-smoke-helpers.js';
import { openUploadDialog } from '../../fixtures/upload-test-helpers.js';

async function openVectorCreate(page: Page): Promise<void> {
  await page.goto('/vector-db/create');
  await expect(page.getByRole('heading', { name: '벡터 테이블 생성' })).toBeVisible();
}

test.describe('데이터 비영속 생성 회귀', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD가 필요합니다.');
    await loginForRegression(page);
  });

  test(
    checklistTitle(['eXemble_데이터_006', 'eXemble_데이터_007', 'eXemble_데이터_010'], '데이터 업로드 팝업에서 위치를 선택하고 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_006', 'eXemble_데이터_007', 'eXemble_데이터_010']);
      const monitor = installUiErrorMonitor(page);

      await openUploadDialog(page);
      const dialog = page.getByRole('dialog', { name: '데이터 업로드' });
      await expect(dialog).toBeVisible();

      for (const label of ['업로드 파일', '파일 위치 설정', '업로드한 문서']) {
        await expectLabelVisible(page, label);
      }

      const selectSnapshot = monitor.snapshot();
      await dialog.getByText('엑셈 사규', { exact: true }).first().click();
      await expect(dialog.getByText('1. 취업규칙.md', { exact: true })).toBeVisible();
      await assertNoNewUiErrors(page, monitor, selectSnapshot, '업로드 위치를 선택해도 UI 오류가 없어야 합니다.', {
        preserveTransientUi: true,
      });

      const cancelSnapshot = monitor.snapshot();
      await dialog.getByRole('button', { name: '취소' }).click();
      await expect(dialog).toBeHidden();
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '데이터 업로드 취소 후 UI 오류가 없어야 합니다.');
    },
  );

  test(
    checklistTitle(['eXemble_데이터_029', 'eXemble_데이터_033'], '파일 유형을 확인하고 벡터 테이블 생성을 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_029', 'eXemble_데이터_033']);
      const monitor = installUiErrorMonitor(page);

      await openVectorCreate(page);
      await expect(page.getByRole('tab', { name: '파일' })).toBeVisible();
      await expectLabelVisible(page, '파일 추가');
      await expectLabelVisible(page, '벡터화할 파일을 추가하세요');

      const cancelSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '취소' }).click();
      await expectExitedCreateFlow(page, /\/vector-db\/create$/);
      testInfo.annotations.push({ type: 'observed', description: `cancel-url=${new URL(page.url()).pathname}` });
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '파일 벡터 테이블 생성 취소 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
      });
    },
  );

  test(
    checklistTitle(['eXemble_데이터_034', 'eXemble_데이터_036'], '폴더 유형을 선택하고 폴더 선택 팝업을 취소할 수 있다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_034', 'eXemble_데이터_036']);
      const monitor = installUiErrorMonitor(page);

      await openVectorCreate(page);
      const typeSnapshot = monitor.snapshot();
      await page.getByRole('tab', { name: '폴더' }).click();
      await expectLabelVisible(page, '폴더 선택');
      await assertNoNewUiErrors(page, monitor, typeSnapshot, '폴더 유형 전환 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });

      const popupSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '폴더 선택' }).click();
      await expectLabelVisible(page, '데이터셋');
      await expectLabelVisible(page, '자동 수집 문서');
      await expectLabelVisible(page, '업로드한 문서');
      await assertNoNewUiErrors(page, monitor, popupSnapshot, '폴더 선택 팝업을 열어도 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });

      const cancelSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '취소' }).click();
      await expect(page.getByRole('button', { name: '폴더 선택' })).toBeVisible();
      await assertNoNewUiErrors(page, monitor, cancelSnapshot, '폴더 선택 팝업 취소 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });
    },
  );

  test(
    checklistTitle(['eXemble_데이터_035'], '폴더를 선택하면 선택된 파일 수와 목록이 표시된다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_035']);
      const monitor = installUiErrorMonitor(page);

      await openVectorCreate(page);
      await page.getByRole('tab', { name: '폴더' }).click();
      await page.getByRole('button', { name: '폴더 선택' }).click();
      await page.getByText('업로드한 문서', { exact: true }).last().click();
      await page.getByText('엑셈 사규', { exact: true }).last().click();

      const confirmSnapshot = monitor.snapshot();
      await page.getByRole('button', { name: '확인' }).click();
      await expectLabelVisible(page, '27개의 파일');
      await expectLabelVisible(page, '1. 취업규칙.md');
      await assertNoNewUiErrors(page, monitor, confirmSnapshot, '폴더 선택 확인 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });
    },
  );

  test(
    checklistTitle(['eXemble_데이터_038', 'eXemble_데이터_039', 'eXemble_데이터_040', 'eXemble_데이터_041'], '데이터베이스 유형에서 드라이브 검색과 미리보기를 확인한다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_038', 'eXemble_데이터_039', 'eXemble_데이터_040', 'eXemble_데이터_041']);
      const monitor = installUiErrorMonitor(page);

      await openVectorCreate(page);
      const typeSnapshot = monitor.snapshot();
      await page.getByRole('tab', { name: '데이터베이스' }).click();
      await expectLabelVisible(page, '드라이브');
      await expectLabelVisible(page, '데이터 미리보기');
      await expectLabelVisible(page, '쿼리 에디터');
      await assertNoNewUiErrors(page, monitor, typeSnapshot, '데이터베이스 유형 전환 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });

      const driveSearch = page.getByPlaceholder('검색어를 입력하세요').last();
      const searchSnapshot = monitor.snapshot();
      await driveSearch.fill('pgtest');
      await expect(driveSearch).toHaveValue('pgtest');
      await assertNoNewUiErrors(page, monitor, searchSnapshot, '드라이브 검색 입력 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });
      await driveSearch.fill('');
      await expect(driveSearch).toHaveValue('');

      const selectSnapshot = monitor.snapshot();
      const pgtestNode = page.getByRole('treeitem', { name: 'pgtest' });
      await pgtestNode.click();
      await page.waitForTimeout(250);
      if (!(await page.getByText('public', { exact: true }).first().isVisible().catch(() => false))) {
        await pgtestNode.locator('img, svg').first().click().catch(() => {});
        await page.waitForTimeout(250);
      }
      if (!(await page.getByText('public', { exact: true }).first().isVisible().catch(() => false))) {
        await pgtestNode.press('ArrowRight').catch(() => {});
        await page.waitForTimeout(250);
      }
      if (!(await page.getByText('public', { exact: true }).first().isVisible().catch(() => false))) {
        await pgtestNode.dblclick().catch(() => {});
      }
      await expectLabelVisible(page, 'public');
      await assertNoNewUiErrors(page, monitor, selectSnapshot, '드라이브 선택 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });

      const previewSnapshot = monitor.snapshot();
      await page.getByRole('treeitem', { name: 'public' }).click();
      await page.waitForTimeout(250);
      if (!(await page.getByText('ai_services', { exact: true }).first().isVisible().catch(() => false))) {
        await page.getByRole('treeitem', { name: 'public' }).press('ArrowRight').catch(() => {});
        await page.waitForTimeout(250);
      }
      await page.getByText('ai_services', { exact: true }).click();
      await expectLabelVisible(page, 'service_id');
      await expectLabelVisible(page, 'service_name');
      await assertNoNewUiErrors(page, monitor, previewSnapshot, '데이터 미리보기 확인 후 UI 오류가 없어야 합니다.', {
        ignoreErrorsMatching: knownCspConsolePatterns,
        preserveTransientUi: true,
      });
    },
  );
});
