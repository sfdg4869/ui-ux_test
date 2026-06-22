import { expect, test, type Locator, type Page } from '@playwright/test';
import { annotateChecklist, checklistTitle } from '../../fixtures/checklist.js';
import { getChatFixtureByCaseId } from '../../fixtures/automation-definitions.js';
import { hasCredentialProfile, requireCredentialProfile } from '../../fixtures/env.js';
import { pickFirstActionable, pickFirstVisible, textCandidates, textMatcher } from '../../fixtures/ui-helpers.js';
import { AppShellPage } from '../../pages/app-shell.page.js';
import { ChatPage } from '../../pages/chat.page.js';
import { LoginPage } from '../../pages/login.page.js';

type UserQueryEvidenceCase = {
  caseId: string;
  title: string;
};

const representativeServiceCase: UserQueryEvidenceCase = {
  caseId: 'eXemble_사용자 질의_004',
  title: '사용자 계정의 대표 서비스로 GS인증이 노출된다',
};

const evidenceCases: UserQueryEvidenceCase[] = [
  {
    caseId: 'eXemble_사용자 질의_006',
    title: 'GS인증 답변 화면에서 첨부 또는 출처 표면을 확인할 수 있다',
  },
  {
    caseId: 'eXemble_사용자 질의_008',
    title: 'GS인증 답변 화면에서 근거 자료를 확인할 수 있다',
  },
  {
    caseId: 'eXemble_사용자 질의_009',
    title: 'GS인증 답변 화면의 근거 링크를 열 수 있다',
  },
];

function mainSurface(page: Page): Locator {
  return page.locator('main, [role="main"]').first();
}

async function loginWithUserProfile(page: Page): Promise<void> {
  const profile = requireCredentialProfile('user');
  const loginPage = new LoginPage(page);
  const shellPage = new AppShellPage(page);

  await loginPage.goto();
  await loginPage.login(profile.username, profile.password);
  await shellPage.expectAuthenticatedShell();
}

async function findRepresentativeService(page: Page, serviceName: string): Promise<Locator | null> {
  const main = mainSurface(page);
  return pickFirstVisible([
    main.locator('a[href^="/chat/new/"]').filter({ hasText: serviceName }).first(),
    page.getByRole('link', { name: textMatcher(serviceName) }).first(),
    main.getByText(textMatcher(serviceName)).first(),
  ]);
}

async function openRepresentativeService(page: Page, serviceName: string): Promise<void> {
  await page.goto('/chat/new');
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(500);

  const main = mainSurface(page);
  const serviceLink = await pickFirstActionable([
    main.locator('a[href^="/chat/new/"]').filter({ hasText: serviceName }).first(),
    page.getByRole('link', { name: textMatcher(serviceName) }).first(),
  ]);

  if (serviceLink) {
    const href = await serviceLink.getAttribute('href');
    if (href) {
      await page.goto(href);
    } else {
      await serviceLink.click();
    }
  } else if (serviceName === 'GS인증') {
    await page.goto('/chat/new/6');
  } else {
    throw new Error(`${serviceName} 대표 서비스 링크를 찾지 못했습니다.`);
  }

  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(800);
  await expect(page).not.toHaveURL(/\/login$/);
}

async function waitForChatOutcome(page: Page, question: string): Promise<'answered' | 'evidence' | 'backend-error'> {
  let outcome = '';

  await expect
    .poll(async () => {
      const bodyText = (await page.locator('body').textContent()) ?? '';

      if (bodyText.includes('Client error') || bodyText.includes('400 Bad Request')) {
        outcome = 'backend-error';
        return outcome;
      }

      if (bodyText.includes('근거 자료') || bodyText.includes('첨부문서') || bodyText.includes('첨부 문서')) {
        outcome = 'evidence';
        return outcome;
      }

      const occurrenceCount = bodyText.split(question).length - 1;
      if (occurrenceCount >= 2 && bodyText.length > question.length + 120) {
        outcome = 'answered';
        return outcome;
      }

      return '';
    }, {
      timeout: 45_000,
      message: '질문 전송 후 답변 또는 오류 상태가 식별되어야 합니다.',
    })
    .not.toBe('');

  return outcome as 'answered' | 'evidence' | 'backend-error';
}

async function collectBodyText(page: Page): Promise<string> {
  return ((await page.locator('body').textContent()) ?? '').replace(/\s+/g, ' ').trim();
}

async function findEvidenceLabel(page: Page): Promise<Locator | null> {
  return pickFirstVisible([
    ...textCandidates(page, ['근거 자료', '근거자료', '첨부문서', '첨부 문서']),
    mainSurface(page).getByText(textMatcher('근거 자료')).first(),
    mainSurface(page).getByText(textMatcher('첨부문서')).first(),
  ]);
}

async function findEvidenceControl(page: Page): Promise<Locator | null> {
  const main = mainSurface(page);

  return pickFirstActionable([
    main.locator('a[href]:not([href^="/chat/new"])').first(),
    main.getByRole('link').filter({ hasText: /취업규칙|근거|자료|문서|pdf|hwp|doc|txt/i }).first(),
    main.getByRole('button').filter({ hasText: /취업규칙|근거|자료|문서|pdf|hwp|doc|txt/i }).first(),
    main.locator('button').filter({ hasText: /취업규칙|근거|자료|문서|pdf|hwp|doc|txt/i }).first(),
  ]);
}

async function openGsChatAndAsk(page: Page, caseId: string): Promise<{ question: string; outcome: 'answered' | 'evidence' | 'backend-error'; bodyText: string; }> {
  const fixture = getChatFixtureByCaseId(caseId);
  const serviceName = fixture?.serviceName || 'GS인증';
  const question = fixture?.question || '안녕하세요 입사 시 제공되는 혜택에는 무엇이 있나요';

  await openRepresentativeService(page, serviceName);

  const chatPage = new ChatPage(page);
  await chatPage.sendMessage(question);

  const outcome = await waitForChatOutcome(page, question);
  const bodyText = await collectBodyText(page);
  return { question, outcome, bodyText };
}

test.describe('Planned user-query service and evidence automation expansion', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentialProfile('user'), 'EXEMBLE_USER_USERNAME / EXEMBLE_USER_PASSWORD가 필요합니다.');
    await loginWithUserProfile(page);
  });

  test(checklistTitle([representativeServiceCase.caseId], representativeServiceCase.title), async ({ page }, testInfo) => {
    annotateChecklist(testInfo, [representativeServiceCase.caseId]);
    const fixture = getChatFixtureByCaseId(representativeServiceCase.caseId);
    const serviceName = fixture?.serviceName || 'GS인증';
    const shellPage = new AppShellPage(page);

    await page.goto('/chat/new');
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    const resetToNewChat = await pickFirstActionable(textCandidates(page, ['새 채팅']));
    if (resetToNewChat) {
      await resetToNewChat.click().catch(() => {});
      await page.waitForTimeout(600);
    }

    expect(await shellPage.hasMenu(['서비스 관리']), '사용자 계정에는 서비스 관리 메뉴가 보이면 안 됩니다.').toBe(false);

    const serviceCard = await findRepresentativeService(page, serviceName);
    expect(serviceCard, `기본 화면에 ${serviceName} 대표 서비스가 보여야 합니다.`).not.toBeNull();

    const serviceText = ((await serviceCard!.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    testInfo.annotations.push({ type: 'representative-service', description: serviceText || serviceName });
  });

  for (const plannedCase of evidenceCases) {
    test(checklistTitle([plannedCase.caseId], plannedCase.title), async ({ page }, testInfo) => {
      annotateChecklist(testInfo, [plannedCase.caseId]);
      const fixture = getChatFixtureByCaseId(plannedCase.caseId);
      const { question, outcome, bodyText } = await openGsChatAndAsk(page, plannedCase.caseId);

      testInfo.annotations.push({ type: 'observed', description: `service=${fixture?.serviceName || 'GS인증'}` });
      testInfo.annotations.push({ type: 'observed', description: `prompt=${question}` });
      testInfo.annotations.push({ type: 'observed', description: `outcome=${outcome}` });

      if (outcome === 'backend-error') {
        throw new Error(`GS인증 서비스 응답이 근거 자료 검증 전 단계에서 실패했습니다: ${bodyText.slice(0, 600)}`);
      }

      if (fixture?.expected?.mustContainAny?.length) {
        const hasExpectedMarker = fixture.expected.mustContainAny.some((marker) => bodyText.includes(marker));
        expect(hasExpectedMarker, `${plannedCase.caseId} 답변에 기대 마커가 포함되어야 합니다.`).toBe(true);
      }

      const evidenceLabel = await findEvidenceLabel(page);
      expect(evidenceLabel, `${plannedCase.caseId} 답변 화면에 첨부/근거 자료 라벨이 보여야 합니다.`).not.toBeNull();

      const evidenceControl = await findEvidenceControl(page);

      if (plannedCase.caseId === 'eXemble_사용자 질의_009') {
        expect(evidenceControl, '근거 파일 링크 또는 문서 열기 제어를 찾지 못했습니다.').not.toBeNull();

        const beforePageCount = page.context().pages().length;
        const beforeUrl = page.url();
        const beforeText = await collectBodyText(page);

        await evidenceControl!.click();
        await page.waitForLoadState('domcontentloaded').catch(() => {});
        await page.waitForTimeout(1200);

        const afterPageCount = page.context().pages().length;
        const afterUrl = page.url();
        const afterText = await collectBodyText(page);
        const hasDialog = (await page.getByRole('dialog').count().catch(() => 0)) > 0;

        expect(
          afterPageCount > beforePageCount || afterUrl !== beforeUrl || hasDialog || afterText !== beforeText,
          '근거 링크 클릭 후에는 새 페이지, URL 변경, 대화상자, 또는 문서 표면 변화가 있어야 합니다.',
        ).toBe(true);
      } else {
        expect(evidenceControl, `${plannedCase.caseId} 답변 화면에 첨부/근거 자료 항목이 하나 이상 있어야 합니다.`).not.toBeNull();
      }
    });
  }
});
