import { expect, type Page } from '@playwright/test';
import type { ModuleScenario } from '../fixtures/module-scenarios.js';
import { AppShellPage } from './app-shell.page.js';

export class ListPage {
  private readonly shell: AppShellPage;

  constructor(private readonly page: Page) {
    this.shell = new AppShellPage(page);
  }

  async openScenario(scenario: ModuleScenario): Promise<void> {
    if (scenario.requiresServiceManagement) {
      await this.shell.enterServiceManagement();
    }

    await this.shell.openMenu(scenario.menuAliases);
    if (scenario.submenuAliases?.length) {
      await this.shell.openMenu(scenario.submenuAliases);
    }
    await this.shell.expectLandingKeywords(scenario.landingKeywords);
  }

  async runSearch(term: string): Promise<void> {
    await this.shell.search(term);
  }

  async expectModuleReady(scenario: ModuleScenario): Promise<void> {
    await this.shell.expectLandingKeywords(scenario.landingKeywords);
    await expect(this.page).not.toHaveURL(/\/login$/);
  }

  async openFirstRowAndExpectDetail(): Promise<void> {
    await this.shell.openFirstResult();
    await this.shell.expectDetailSurface();
  }
}
