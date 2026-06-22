import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, type Page } from '@playwright/test';
import { harnessEnv } from './env.js';
import { regressionModules } from './module-scenarios.js';
import { clickFirstVisible, pickFirstVisible, textCandidates } from './ui-helpers.js';
import { ListPage } from '../pages/list-page.js';

const preferredUploadExtensions = ['.txt', '.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx', '.mp4'];

export type UploadBoundaryFixtures = {
  exact100mbFile?: string;
  over101mbFile?: string;
  rootDir?: string;
  under99mbFile?: string;
};

export async function openUploadDialog(page: Page): Promise<void> {
  const listPage = new ListPage(page);
  await listPage.openScenario(regressionModules[1]);

  const opened = await clickFirstVisible(textCandidates(page, ['데이터 업로드', '업로드', '파일 업로드']));
  expect(opened).toBe(true);

  await expect
    .poll(async () => {
      const candidate = await pickFirstVisible([
        page.getByRole('dialog'),
        page.locator('input[type="file"]'),
        ...textCandidates(page, ['데이터 업로드', '업로드 파일', '파일 업로드']),
      ]);

      return Boolean(candidate);
    })
    .toBe(true);
}

export async function attachFiles(page: Page, files: string[]): Promise<void> {
  const fileInput = page.locator('input[type="file"]').first();
  if ((await fileInput.count()) > 0) {
    await fileInput.setInputFiles(files);
    return;
  }

  const chooserPromise = page.waitForEvent('filechooser');
  const opened = await clickFirstVisible(textCandidates(page, ['파일 선택', '파일 추가', '업로드 파일 선택']));
  expect(opened).toBe(true);
  const chooser = await chooserPromise;
  await chooser.setFiles(files);
}

export async function countVisibleFileNames(page: Page, fileNames: string[]): Promise<number> {
  let count = 0;

  for (const fileName of fileNames) {
    const visible = await page
      .getByText(fileName, { exact: false })
      .first()
      .isVisible()
      .catch(() => false);

    if (visible) {
      count += 1;
    }
  }

  return count;
}

export async function hasVisibleMessage(page: Page, messages: string[]): Promise<boolean> {
  const candidate = await pickFirstVisible([
    ...textCandidates(page, messages),
    ...messages.map((message) => page.getByText(message, { exact: false })),
  ]);

  return Boolean(candidate);
}

export async function collectFixtureFiles(directoryPath: string, minimumCount: number): Promise<string[]> {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(directoryPath, entry.name))
    .sort((left, right) => left.localeCompare(right, 'en'));

  if (files.length < minimumCount) {
    throw new Error(`Expected at least ${minimumCount} files in ${directoryPath}, found ${files.length}.`);
  }

  return files;
}

async function directoryExists(directoryPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function pickRepresentativeFixtureFile(directoryPath: string): Promise<string | undefined> {
  const files = await collectFixtureFiles(directoryPath, 1);

  for (const extension of preferredUploadExtensions) {
    const candidate = files.find((filePath) => path.extname(filePath).toLowerCase() === extension);
    if (candidate) {
      return candidate;
    }
  }

  return files[0];
}

export async function resolveUploadBoundaryFixtures(): Promise<UploadBoundaryFixtures> {
  const candidateRoots = [
    harnessEnv.uploadSizeFixtureRoot,
    path.resolve(process.cwd(), 'file_upload_test'),
  ].filter(Boolean) as string[];
  const uniqueRoots = [...new Set(candidateRoots)];

  for (const rootDir of uniqueRoots) {
    if (!(await directoryExists(rootDir))) {
      continue;
    }

    const underDir = path.join(rootDir, 'test_99MB');
    const exactDir = path.join(rootDir, 'test_100MB');
    const overDir = path.join(rootDir, 'test_101MB');

    const [under99mbFile, exact100mbFile, over101mbFile] = await Promise.all([
      directoryExists(underDir).then((exists) => (exists ? pickRepresentativeFixtureFile(underDir) : undefined)),
      directoryExists(exactDir).then((exists) => (exists ? pickRepresentativeFixtureFile(exactDir) : undefined)),
      directoryExists(overDir).then((exists) => (exists ? pickRepresentativeFixtureFile(overDir) : undefined)),
    ]);

    if (under99mbFile || exact100mbFile || over101mbFile) {
      return {
        under99mbFile,
        exact100mbFile,
        over101mbFile,
        rootDir,
      };
    }
  }

  return {};
}
