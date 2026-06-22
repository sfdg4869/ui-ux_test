# Live TC Observations

## Scope

- Date: `2026-06-17`
- Method: live Playwright click verification against `https://10.10.34.114`
- Evidence:
  - `_workspace/diagnostics/live-ui-diagnostics.json`
  - `_workspace/diagnostics/02_after_login.png`
  - `_workspace/diagnostics/03_after_account_click.png`

## Confirmed Results

### Passed

- `eXemble_사용자 로그인_001`
  - normal login succeeds
  - observed destination: `/chat/new`
- `eXemble_사용자 로그인_002`
  - remembered ID persists after re-entry
  - verified by rerun of `tests/smoke/auth.smoke.spec.ts`
- `eXemble_환경설정_005`
  - logout succeeds
  - actual UI path:
    - click bottom-left account area
    - click `로그아웃`
- `eXemble_사용자 질의_001`
  - chat module entry is reachable
- `eXemble_사용자 질의_002`
  - AI service module entry is reachable
- `eXemble_사용자 질의_005`
  - chat module entry is reachable as the current default landing surface

### Skipped / Deferred

- `eXemble_사용자 로그인_003`
  - SSO button is disabled in the current environment

### Blocked For Current Account / Current Surface

- `eXemble_대시보드_001`
  - dashboard menu is not visible on the current logged-in surface
  - direct rerun of `대시보드 모듈에 진입` failed before navigation because no matching visible menu exists

## What Changed In The Diagnosis

The earlier failure batch looked like a login problem, but live clicking showed the real split:

- login itself works
- the old harness had a wrong post-login logout locator
- some TC targets are reachable on the current account
- some TC targets are not visible on the current account or current first-level menu

## Root Causes Behind The Large Failure Count

1. Shared locator issue
   - one wrong logout locator caused multiple auth and security tests to fail together
   - this has now been fixed in `pages/app-shell.page.ts`
2. Current account visibility mismatch
   - the visible left menu shows:
     - `새 채팅`
     - `AI서비스`
     - `검색`
   - it does not directly show:
     - `대시보드`
     - `데이터`
     - `모델`
     - `도구`
     - `권한`
     - `로그`
3. Overlay / click-order issue
   - clicking the account area opens an overlay menu
   - if the overlay stays open, subsequent module clicks can be blocked or misread

## Current Recommendation

- treat `대시보드`, `데이터`, `모델`, `도구`, `권한`, `로그` TC items as:
  - `blocked-current-role`
  - or `requires-service-management-path`
  until the correct account or exact navigation path is confirmed
- continue TC execution in two lanes:
  - lane 1: currently visible user-surface TC
  - lane 2: admin/service-management-only TC
