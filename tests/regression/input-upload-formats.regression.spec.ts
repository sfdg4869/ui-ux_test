import path from 'node:path';
import { expect, test } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { harnessEnv, hasCredentials, requireCredentials } from '../../fixtures/env.js';
import { attachFiles, openUploadDialog } from '../../fixtures/upload-test-helpers.js';
import { LoginPage } from '../../pages/login.page.js';
import { AppShellPage } from '../../pages/app-shell.page.js';

type UploadFormatScenario = {
  title: string;
  caseIds: string[];
  envPath?: string;
};

const uploadFormatScenarios: UploadFormatScenario[] = [
  {
    title: '일반 파일 형식은 메뉴얼 기준 허용 목록을 수용한다',
    caseIds: ['eXemble_시스템_009'],
    envPath: harnessEnv.uploadSampleTextFile,
  },
  {
    title: '이미지 파일 형식은 메뉴얼 기준 허용 목록을 수용한다',
    caseIds: ['eXemble_시스템_010'],
    envPath: harnessEnv.uploadSampleImageFile,
  },
  {
    title: '문서 파일 형식은 메뉴얼 기준 허용 목록을 수용한다',
    caseIds: ['eXemble_시스템_011'],
    envPath: harnessEnv.uploadSampleDocumentFile,
  },
  {
    title: '음성/비디오 파일 형식은 메뉴얼 기준 허용 목록을 수용한다',
    caseIds: ['eXemble_시스템_012'],
    envPath: harnessEnv.uploadSampleMediaFile,
  },
];

test.describe('Input upload format validation', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials(), 'EXEMBLE_USERNAME / EXEMBLE_PASSWORD are required.');

    const { username, password } = requireCredentials();
    const loginPage = new LoginPage(page);
    const shellPage = new AppShellPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await shellPage.expectAuthenticatedShell();
  });

  for (const scenario of uploadFormatScenarios) {
    test(checklistTitle(scenario.caseIds, scenario.title), async ({ page }, testInfo) => {
      annotateChecklist(testInfo, scenario.caseIds);
      test.skip(
        !scenario.envPath,
        'Set the corresponding EXEMBLE_UPLOAD_SAMPLE_* env var to activate this upload format case.',
      );

      const filePath = scenario.envPath!;
      const fileName = path.basename(filePath);

      await openUploadDialog(page);
      await attachFiles(page, [filePath]);

      await expect
        .poll(async () => {
          return await page
            .getByText(fileName, { exact: false })
            .first()
            .isVisible()
            .catch(() => false);
        })
        .toBe(true);
    });
  }
});
