import path from 'node:path';
import { expect, test } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { harnessEnv, hasCredentials, requireCredentials } from '../../fixtures/env.js';
import {
  attachFiles,
  collectFixtureFiles,
  countVisibleFileNames,
  hasVisibleMessage,
  openUploadDialog,
  resolveUploadBoundaryFixtures,
} from '../../fixtures/upload-test-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

test.describe('Input upload limits', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD are required.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();
  });

  test('99MB fixture can be selected within the upload size limit', async ({ page }, testInfo) => {
    const boundaryFixtures = await resolveUploadBoundaryFixtures();
    test.skip(
      !boundaryFixtures.under99mbFile,
      'Put size fixtures under file_upload_test/test_99MB or set EXEMBLE_UPLOAD_SIZE_FIXTURE_ROOT.',
    );

    const filePath = boundaryFixtures.under99mbFile!;
    const fileName = path.basename(filePath);
    testInfo.annotations.push({ type: 'fixture', description: filePath });

    await openUploadDialog(page);
    await attachFiles(page, [filePath]);
    await expect(page.getByText(fileName, { exact: false }).first()).toBeVisible();
  });

  test('100MB fixture can be selected at the documented limit boundary', async ({ page }, testInfo) => {
    const boundaryFixtures = await resolveUploadBoundaryFixtures();
    test.skip(
      !boundaryFixtures.exact100mbFile,
      'Put size fixtures under file_upload_test/test_100MB or set EXEMBLE_UPLOAD_SIZE_FIXTURE_ROOT.',
    );

    const filePath = boundaryFixtures.exact100mbFile!;
    const fileName = path.basename(filePath);
    testInfo.annotations.push({ type: 'fixture', description: filePath });

    await openUploadDialog(page);
    await attachFiles(page, [filePath]);
    await expect(page.getByText(fileName, { exact: false }).first()).toBeVisible();
  });

  test(
    checklistTitle(['eXemble_데이터_011'], '데이터 업로드는 메뉴얼 기준 최대 10개 파일만 허용한다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_011']);
      test.skip(
        !harnessEnv.uploadLimitElevenFilesDir,
        'Set EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR to activate the 11-file upload limit case.',
      );

      const files = await collectFixtureFiles(harnessEnv.uploadLimitElevenFilesDir!, 11);
      const attemptFiles = files.slice(0, 11);
      const fileNames = attemptFiles.map((filePath) => path.basename(filePath));

      await openUploadDialog(page);
      await attachFiles(page, attemptFiles);

      await expect
        .poll(async () => {
          const limitMessage = await hasVisibleMessage(page, [
            '최대 10개',
            '10개까지',
            '10개 이하',
            '파일 개수 제한',
            '업로드 실패',
          ]);
          const visibleFileCount = await countVisibleFileNames(page, fileNames);

          return limitMessage || visibleFileCount <= 10;
        })
        .toBe(true);
    },
  );

  test(
    checklistTitle(['eXemble_데이터_012'], '데이터 업로드는 메뉴얼 기준 100MB 초과 파일을 허용하지 않는다'),
    async ({ page }, testInfo) => {
      annotateChecklist(testInfo, ['eXemble_데이터_012']);
      const boundaryFixtures = await resolveUploadBoundaryFixtures();
      const filePath = harnessEnv.uploadLimitOver100mbFile ?? boundaryFixtures.over101mbFile;
      test.skip(
        !filePath,
        'Set EXEMBLE_UPLOAD_LIMIT_100MB_FILE or provide file_upload_test/test_101MB to activate the over-100MB upload limit case.',
      );

      const fileName = path.basename(filePath!);
      testInfo.annotations.push({ type: 'fixture', description: filePath! });

      await openUploadDialog(page);
      await attachFiles(page, [filePath!]);

      await expect
        .poll(async () => {
          const limitMessage = await hasVisibleMessage(page, [
            '100MB',
            '100 MB',
            '용량 초과',
            '파일 용량 제한',
            '업로드 실패',
          ]);
          const fileVisible = await page
            .getByText(fileName, { exact: false })
            .first()
            .isVisible()
            .catch(() => false);

          return limitMessage || !fileVisible;
        })
        .toBe(true);
    },
  );
});
