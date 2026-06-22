import { expect, type Locator, type Page } from '@playwright/test';
import { clickFirstVisible, pickFirstVisible, readLocatorValue, textCandidates } from '../fixtures/ui-helpers.js';

export class ChatPage {
  constructor(private readonly page: Page) {}

  async openChatWorkspace(): Promise<void> {
    const opened = await clickFirstVisible(textCandidates(this.page, ['채팅', '새 채팅', '질의응답']));
    if (!opened) {
      await clickFirstVisible(textCandidates(this.page, ['AI서비스', 'AI 서비스']));
    }

    await expect
      .poll(async () => {
        const candidate = await pickFirstVisible(textCandidates(this.page, ['채팅', '새 채팅', '질의응답']));
        return Boolean(candidate);
      })
      .toBe(true);
  }

  async startNewChatIfAvailable(): Promise<void> {
    await clickFirstVisible(textCandidates(this.page, ['새 채팅', '대화 시작', '채팅 시작']));
  }

  async composer(): Promise<Locator> {
    const locator = await pickFirstVisible([
      this.page.getByPlaceholder(/메시지|질문|입력/i),
      this.page.getByRole('textbox', { name: /메시지|질문|입력/i }),
      this.page.locator('textarea'),
      this.page.locator('[contenteditable="true"]'),
      this.page.getByRole('textbox').last(),
    ]);

    if (!locator) {
      throw new Error('Could not find the chat composer.');
    }

    return locator;
  }

  async fillComposerText(message: string): Promise<void> {
    const composer = await this.composer();
    await composer.fill(message);
  }

  async composerTextLength(): Promise<number> {
    const composer = await this.composer();
    const value = await readLocatorValue(composer);
    return value.length;
  }

  async composerMaxLength(): Promise<number | null> {
    const composer = await this.composer();
    const raw = await composer.getAttribute('maxlength');
    if (!raw) {
      return null;
    }

    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  async sendMessage(message: string): Promise<void> {
    const composer = await this.composer();
    await composer.fill(message);

    const sent = await clickFirstVisible(textCandidates(this.page, ['전송', '보내기', '질문']));
    if (!sent) {
      await composer.press('Enter');
    }
  }

  async expectResponseToAppear(): Promise<void> {
    await expect
      .poll(async () => {
        const candidate = await pickFirstVisible(
          [
            textCandidates(this.page, ['응답', '답변', '생성 중', '완료']),
            this.page.locator('[class*="message"]').nth(1),
            this.page.locator('[class*="bubble"]').nth(1),
          ].flat(),
        );

        return Boolean(candidate);
      })
      .toBe(true);
  }

  async openHistory(): Promise<void> {
    await clickFirstVisible(textCandidates(this.page, ['대화 내역', '대화 목록', '히스토리']));
  }

  async expectHistoryVisible(): Promise<void> {
    await expect
      .poll(async () => {
        const section = await pickFirstVisible(textCandidates(this.page, ['대화 내역', '대화 목록', '히스토리']));
        return Boolean(section);
      })
      .toBe(true);
  }
}
