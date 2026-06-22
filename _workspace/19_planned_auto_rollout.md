# Planned Auto Rollout

- Updated on: `2026-06-18`
- Scope: first-pass automation for the 34 previously `planned` read-only / visibility cases
- Reporting mode: the original 34 TC-IDs are now emitted as 34 separate Playwright `test()` entries

## Added specs

- `tests/regression/planned-readonly-expansion.regression.spec.ts`
  - `eXemble_AI서비스_033, 034, 035, 045, 046, 047, 048, 049`
  - `eXemble_데이터_023, 024, 025, 026, 027, 044, 045, 046, 054, 055, 056, 057, 058`
  - `eXemble_모델_007, 008, 009`
- `tests/regression/planned-chat-dashboard-system.regression.spec.ts`
  - `eXemble_사용자 질의_010, 011`
  - `eXemble_대시보드_014`
  - `eXemble_시스템_005, 006, 013, 021, 022, 023, 026`
- `fixtures/planned-readonly-helpers.ts`
  - shared login, scenario open, visible-label assertions, list open, search, and UI-stability helpers

## Catalog status

- `npm.cmd run catalog:build` rerun completed
- Harness status counts after refresh:
  - `implemented=137`
  - `planned=15`
  - `manual=98`
  - `deferred=38`
  - `blocked=5`

## Playwright test count

- Command:
  - `npx.cmd playwright test tests/regression/planned-readonly-expansion.regression.spec.ts tests/regression/planned-chat-dashboard-system.regression.spec.ts --project=regression --list`
- Result:
  - `Total: 34 tests in 2 files`

## Live verification

- Command:
  - `npx.cmd playwright test tests/regression/planned-readonly-expansion.regression.spec.ts tests/regression/planned-chat-dashboard-system.regression.spec.ts --project=regression`
- Result:
  - `23 passed`
  - `8 skipped`
  - `3 failed`

### Passed TC-IDs

- `eXemble_사용자 질의_010`
- `eXemble_대시보드_014`
- `eXemble_시스템_005, 006, 013, 021, 022, 023, 026`
- `eXemble_AI서비스_033, 034, 045, 046, 047, 048`
- `eXemble_데이터_023, 024, 025, 026, 027`
- `eXemble_모델_007, 008, 009`

### Skipped TC-IDs

- `eXemble_데이터_044, 045, 046, 054, 055, 056, 057, 058`
  - Runtime reason: the current `벡터화 관리` environment shows `No data found.`, so the harness marks vector-detail dependent cases as skipped instead of product failures.

### Current failing TC-IDs

- `eXemble_사용자 질의_011`
  - Current blocker: after opening the history search flow, the current UI still does not expose a stable clickable search-result entry for the harness.
- `eXemble_AI서비스_035`
  - Current blocker: the current AI service surface did not expose a visible status-filter combobox during the run.
- `eXemble_AI서비스_049`
  - Current blocker: the current AI service surface intermittently lands on a page that shows only the title and `서비스 생성`, without a selectable service row/card to open detail.

## Remaining 15 auto cases and what is needed

| TC-ID | Needed to implement/run |
| --- | --- |
| `eXemble_사용자 질의_004` | Admin/user role matrix and the expected representative service list for each role |
| `eXemble_사용자 질의_006` | A fixed question that always returns attachment documents, plus expected document names or count |
| `eXemble_사용자 질의_007` | Expected answer/summary rule or at least minimum expected phrases for a fixed question |
| `eXemble_사용자 질의_008` | A fixed question that always exposes evidence references, plus expected evidence layout |
| `eXemble_사용자 질의_009` | A fixed evidence link that should open preview/download/new tab, and the exact success rule |
| `eXemble_사용자 질의_014` | The predefined fallback message for an undefined question |
| `eXemble_데이터_019` | Test DB names and the expected color/status meaning for healthy/unhealthy connections |
| `eXemble_데이터_020` | Expected DB basic-info fields and at least one stable DB/table sample |
| `eXemble_데이터_021` | Expected catalog/schema samples or a pattern the environment should always expose |
| `eXemble_데이터_022` | At least one stable vector-table fixture so the list is not empty |
| `eXemble_도구_010` | A safe test endpoint/payload and the exact popup/success behavior definition |
| `eXemble_AI서비스_037` | Which icon set is valid and whether the check is “selection only” or “save reflected” |
| `eXemble_AI서비스_053` | A disposable inactive service plus restore rule after activation |
| `eXemble_AI서비스_054` | A disposable active service plus restore rule after deactivation |
| `eXemble_보안_007` | Password policy table, prohibited samples, and a disposable account for policy validation |
