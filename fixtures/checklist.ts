import type { TestInfo } from '@playwright/test';

export function checklistTitle(caseIds: string[], title: string): string {
  if (caseIds.length === 0) {
    return title;
  }

  return `[${caseIds.join(', ')}] ${title}`;
}

export function annotateChecklist(testInfo: TestInfo, caseIds: string[]): void {
  for (const caseId of caseIds) {
    testInfo.annotations.push({
      type: 'TC-ID',
      description: caseId,
    });
  }
}
