import { expect, type Locator, type TestInfo } from '@playwright/test';
import { readLocatorValue } from './ui-helpers.js';

export function repeatedText(length: number, seed = 'x'): string {
  return seed.repeat(Math.max(0, length));
}

function padBetween(prefix: string, suffix: string, length: number, seed = 'x'): string {
  const padding = Math.max(0, length - prefix.length - suffix.length);
  return `${prefix}${seed.repeat(padding)}${suffix}`.slice(0, length);
}

export function emailOfLength(length: number): string {
  return padBetween('', '@ex.com', length, 'a');
}

export function urlOfLength(length: number): string {
  return padBetween('https://', '.com', length, 'u');
}

export function jsonOfLength(length: number): string {
  const prefix = '{"value":"';
  const suffix = '"}';
  if (length <= prefix.length + suffix.length) {
    return repeatedText(length, 'j');
  }

  return `${prefix}${repeatedText(length - prefix.length - suffix.length, 'j')}${suffix}`;
}

export async function observeInputLength(locator: Locator): Promise<number> {
  const value = await readLocatorValue(locator);
  return value.length;
}

export async function assertFieldRespectsMaxLength(options: {
  fieldName: string;
  locator: Locator;
  limit: number;
  testInfo: TestInfo;
  valueFactory?: (length: number) => string;
}): Promise<void> {
  const { fieldName, locator, limit, testInfo, valueFactory = repeatedText } = options;

  await expect(locator).toBeVisible();

  await locator.fill(valueFactory(limit));
  await expect
    .poll(async () => observeInputLength(locator), {
      message: `${fieldName} should accept exactly ${limit} characters`,
    })
    .toBe(limit);

  await locator.fill(valueFactory(limit + 1));
  const observedLength = await observeInputLength(locator);
  const maxLength = await locator.getAttribute('maxlength');

  testInfo.annotations.push({
    type: 'observed',
    description: `${fieldName}: observed=${observedLength}, manual=${limit}, maxlength=${maxLength ?? 'none'}`,
  });

  expect(observedLength).toBeLessThanOrEqual(limit);
}
