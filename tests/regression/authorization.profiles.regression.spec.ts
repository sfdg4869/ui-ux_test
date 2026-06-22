import { expect, test, type Page } from '@playwright/test';
import {
  closeAuthenticatedSessions,
  createAuthenticatedSession,
  type AuthenticatedSession,
} from '../../fixtures/auth-profile-helpers.js';
import { getAuthorizationExpectations, hasCredentialProfile } from '../../fixtures/env.js';
import { pickFirstVisible, textCandidates } from '../../fixtures/ui-helpers.js';

const routeHeadingHints: Record<string, string[]> = {
  '/permission/account': ['계정 관리'],
  '/permission/org': ['조직 관리'],
  '/permission/vector-database-access': ['벡터 테이블 접근 정책'],
  '/log': ['로그'],
};

function routeMatches(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function currentPathname(page: Page): string {
  return new URL(page.url()).pathname;
}

async function findVisibleHeadingForRoute(page: Page, route: string): Promise<string | null> {
  const hints = routeHeadingHints[route] ?? [];
  for (const hint of hints) {
    const locator = await pickFirstVisible(textCandidates(page, [hint]));
    if (locator) {
      return hint;
    }
  }

  return null;
}

async function expectAdminCanOpenRoute(session: AuthenticatedSession, route: string): Promise<void> {
  await session.page.goto(route);
  await session.page.waitForLoadState('domcontentloaded').catch(() => {});
  await expect(session.page).not.toHaveURL(/\/login$/);

  const pathname = currentPathname(session.page);
  expect(routeMatches(pathname, route), `관리자 계정이 ${route} 경로에 도달하지 못했습니다. 현재 경로: ${pathname}`).toBe(true);

  const heading = await findVisibleHeadingForRoute(session.page, route);
  if (routeHeadingHints[route]?.length) {
    expect(heading, `관리자 계정이 ${route} 화면의 대표 heading을 보지 못했습니다.`).not.toBeNull();
  }
}

async function expectUserBlockedFromRoute(session: AuthenticatedSession, route: string, denialMarkers: string[]): Promise<void> {
  const response = await session.page.goto(route);
  await session.page.waitForLoadState('domcontentloaded').catch(() => {});
  await session.page.waitForTimeout(350);

  const pathname = currentPathname(session.page);
  if (/\/login$/i.test(pathname)) {
    return;
  }

  if (response && [401, 403].includes(response.status())) {
    return;
  }

  if (!routeMatches(pathname, route)) {
    return;
  }

  const visibleHeading = await findVisibleHeadingForRoute(session.page, route);
  if (visibleHeading) {
    throw new Error(`사용자 계정이 ${route} 경로에 직접 접근했고 "${visibleHeading}" 화면까지 노출되었습니다.`);
  }

  for (const marker of denialMarkers) {
    const locator = await pickFirstVisible(textCandidates(session.page, [marker]));
    if (locator) {
      return;
    }
  }

  throw new Error(
    `사용자 계정의 ${route} 차단 여부를 확정할 수 없습니다. 현재 경로=${pathname}, 상태코드=${response?.status() ?? 'n/a'}`,
  );
}

test.describe('권한 프로필 분리 회귀', () => {
  test('관리자 계정은 권한/로그 관리 경로에 접근할 수 있다', async ({ browser }, testInfo) => {
    test.skip(!hasCredentialProfile('admin'), 'EXEMBLE_ADMIN_* 또는 기본 관리자 계정이 필요합니다.');

    const expectations = getAuthorizationExpectations();
    test.skip(expectations.adminAllowedRoutes.length === 0, 'EXEMBLE_AUTHZ_ADMIN_ALLOWED_ROUTES가 비어 있습니다.');

    let adminSession: AuthenticatedSession | undefined;

    try {
      adminSession = await createAuthenticatedSession(browser, 'admin');
      for (const route of expectations.adminAllowedRoutes) {
        await expectAdminCanOpenRoute(adminSession, route);
      }

      testInfo.annotations.push({
        type: 'authorization-profile',
        description: `admin=${adminSession.profile.username}`,
      });
    } finally {
      await closeAuthenticatedSessions(adminSession);
    }
  });

  test('사용자 계정은 권한/로그 관리 경로에 직접 접근할 수 없다', async ({ browser }, testInfo) => {
    test.skip(!hasCredentialProfile('user'), 'EXEMBLE_USER_USERNAME / EXEMBLE_USER_PASSWORD가 필요합니다.');

    const expectations = getAuthorizationExpectations();
    test.skip(expectations.userBlockedRoutes.length === 0, 'EXEMBLE_AUTHZ_USER_BLOCKED_ROUTES가 비어 있습니다.');

    let userSession: AuthenticatedSession | undefined;

    try {
      userSession = await createAuthenticatedSession(browser, 'user');
      for (const route of expectations.userBlockedRoutes) {
        await expectUserBlockedFromRoute(userSession, route, expectations.denialMarkers);
      }

      testInfo.annotations.push({
        type: 'authorization-profile',
        description: `user=${userSession.profile.username}`,
      });
    } finally {
      await closeAuthenticatedSessions(userSession);
    }
  });

  test('사용자 계정에는 서비스 관리 메뉴가 노출되지 않는다', async ({ browser }, testInfo) => {
    test.skip(!hasCredentialProfile('user'), 'EXEMBLE_USER_USERNAME / EXEMBLE_USER_PASSWORD가 필요합니다.');

    let userSession: AuthenticatedSession | undefined;

    try {
      userSession = await createAuthenticatedSession(browser, 'user');

      expect(
        await userSession.shellPage.hasMenu(['서비스 관리']),
        '사용자 계정에는 서비스 관리 메뉴가 보이면 안 됩니다.',
      ).toBe(false);

      testInfo.annotations.push({
        type: 'authorization-profile',
        description: `user=${userSession.profile.username}`,
      });
    } finally {
      await closeAuthenticatedSessions(userSession);
    }
  });
});
