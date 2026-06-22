# Immediate Planned Expansion - 2026-06-19

## Summary

- Immediate automation added in this pass: **6 TC cases**
- Newly implemented cases:
  - `eXemble_데이터_019`
  - `eXemble_데이터_020`
  - `eXemble_데이터_021`
  - `eXemble_데이터_022`
  - `eXemble_사용자 질의_007`
  - `eXemble_사용자 질의_014`
- Newly scaffolded but still waiting on explicit run criteria:
  - `eXemble_도구_010`

## Added Specs

- `tests/regression/planned-data-tool-expansion.regression.spec.ts`
  - `eXemble_데이터_019, 020, 021, 022`
  - `eXemble_도구_010` safe response-test scaffold with skip guard
- `tests/regression/planned-chat-generic.regression.spec.ts`
  - `eXemble_사용자 질의_007, 014`

## Live Verification

### Data and tool expansion

- Command:
  - `npx.cmd playwright test tests/regression/planned-data-tool-expansion.regression.spec.ts --project=regression`
- Result:
  - `4 passed`
  - `1 skipped`

### Generic chat expansion

- Command:
  - `npx.cmd playwright test tests/regression/planned-chat-generic.regression.spec.ts --project=regression`
- Result:
  - `2 passed`

## Catalog Status After Refresh

- Command:
  - `node .\scripts\generate-catalog.mjs`
- Result:
  - `implemented=144`
  - `planned=8`
  - `manual=98`
  - `deferred=38`
  - `blocked=5`

## Remaining Planned Cases And Required Inputs

| TC-ID | Module | What is still needed |
| --- | --- | --- |
| `eXemble_사용자 질의_004` | 사용자 질의 | Admin/user role matrix and which representative service should be visible for each account |
| `eXemble_사용자 질의_006` | 사용자 질의 | One fixed question that reliably returns attachment documents, plus expected attachment names or minimum count |
| `eXemble_사용자 질의_008` | 사용자 질의 | One fixed question that reliably exposes evidence references, plus expected evidence surface |
| `eXemble_사용자 질의_009` | 사용자 질의 | One fixed question with a clickable evidence/file link and the exact success rule after click |
| `eXemble_AI서비스_037` | AI서비스 | Clear icon-selection rule: which icon is acceptable and whether selection-only is enough or save reflection is required |
| `eXemble_AI서비스_053` | AI서비스 | Disposable inactive service name and restore rule after activation |
| `eXemble_AI서비스_054` | AI서비스 | Disposable active service name and restore rule after deactivation |
| `eXemble_보안_007` | 보안 | Password policy table plus a disposable policy-test account |

## Notes

- `eXemble_도구_010` is intentionally **skipped**, not failed.
  - Current reason: the harness can open the response-test action, but there is still no explicit success contract in `_workspace/automation-definitions/tool-fixtures.json`.
- Chat cases `007` and `014` were promoted using the agreed rule:
  - if the question is sent successfully and a response surface appears, the case is treated as automatable
- Data source detail opening was stabilized for the current environment:
  - the harness now re-activates the selected DB node when the right detail panel does not populate on the first click
