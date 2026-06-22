import type { Locator, Page } from '@playwright/test';

export function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function textMatcher(text: string): RegExp {
  const segments = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => escapeForRegex(segment));

  return new RegExp(segments.join('\\s*'), 'i');
}

export async function pickFirstVisible(candidates: Locator[]): Promise<Locator | null> {
  for (const candidate of candidates) {
    try {
      if (await candidate.first().isVisible()) {
        return candidate.first();
      }
    } catch {
      // Ignore detached or missing locators while probing.
    }
  }

  return null;
}

export async function clickFirstVisible(candidates: Locator[]): Promise<boolean> {
  const locator = await pickFirstVisible(candidates);
  if (!locator) {
    return false;
  }

  await locator.click();
  return true;
}

export async function pickFirstActionable(candidates: Locator[]): Promise<Locator | null> {
  for (const candidate of candidates) {
    try {
      const locator = candidate.first();
      if ((await locator.isVisible()) && (await locator.isEnabled())) {
        return locator;
      }
    } catch {
      // Ignore detached or missing locators while probing.
    }
  }

  return null;
}

export async function clickFirstActionable(candidates: Locator[]): Promise<boolean> {
  const locator = await pickFirstActionable(candidates);
  if (!locator) {
    return false;
  }

  await locator.click();
  return true;
}

export async function fillFirstVisible(candidates: Locator[], value: string): Promise<boolean> {
  const locator = await pickFirstVisible(candidates);
  if (!locator) {
    return false;
  }

  await locator.fill(value);
  return true;
}

export async function readLocatorValue(locator: Locator): Promise<string> {
  return locator.evaluate((element) => {
    const editorElement = element as HTMLElement & {
      cmView?: {
        view?: {
          state?: {
            doc?: {
              toString?: () => string;
            };
          };
        };
      };
    };

    const codeMirrorView =
      editorElement.cmView?.view ??
      (editorElement.closest('.cm-editor')?.querySelector('.cm-content') as typeof editorElement | null)?.cmView?.view;
    const codeMirrorText = codeMirrorView?.state?.doc?.toString?.();
    if (typeof codeMirrorText === 'string') {
      return codeMirrorText;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value;
    }

    if (element.getAttribute('contenteditable') === 'true') {
      return element.textContent ?? '';
    }

    return element.textContent ?? '';
  });
}

export function textCandidates(page: Page, labels: string[]): Locator[] {
  return labels.flatMap((label) => [
    page.getByRole('link', { name: textMatcher(label) }),
    page.getByRole('button', { name: textMatcher(label) }),
    page.getByRole('tab', { name: textMatcher(label) }),
    page.getByRole('menuitem', { name: textMatcher(label) }),
    page.getByRole('heading', { name: textMatcher(label) }),
    page.getByText(textMatcher(label)),
  ]);
}

export function interactiveTextCandidates(page: Page, labels: string[]): Locator[] {
  return labels.flatMap((label) => [
    page.getByRole('link', { name: textMatcher(label) }),
    page.getByRole('button', { name: textMatcher(label) }),
    page.getByRole('tab', { name: textMatcher(label) }),
    page.getByRole('menuitem', { name: textMatcher(label) }),
    page.getByRole('option', { name: textMatcher(label) }),
    page.getByRole('combobox', { name: textMatcher(label) }),
    page.getByRole('treeitem', { name: textMatcher(label) }),
  ]);
}
