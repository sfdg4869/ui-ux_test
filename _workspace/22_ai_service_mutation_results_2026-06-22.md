# AI Service Mutation Results (2026-06-22)

## Scope

- Target service: `MaxGauge`
- Target cases:
  - `eXemble_AI서비스_037`
  - `eXemble_AI서비스_053`
  - `eXemble_AI서비스_054`
- Spec: `tests/regression/ai-service-mutation.regression.spec.ts`

## Harness changes

- Added `tests/regression/ai-service-mutation.regression.spec.ts`
- Added AI service fixture readers in `fixtures/automation-definitions.ts`
- Filled `MaxGauge` mutation targets in:
  - `_workspace/automation-definitions/ai-service-fixtures.json`
  - `_workspace/automation-definitions/mutation-scope.json`

## Result summary

| TC-ID | Result | Observed behavior |
| --- | --- | --- |
| `eXemble_AI서비스_037` | failed | A different icon can be selected on the edit screen, but after `저장` and reopening the edit page, the original icon is still selected. |
| `eXemble_AI서비스_053` | failed | `활성화` dialog opens for `MaxGauge`, but after confirmation the service state remains `비활성`. |
| `eXemble_AI서비스_054` | failed | The case could not establish the required active precondition because the service remained `비활성` after the activation attempt. |

## Detailed observations

### `eXemble_AI서비스_037`

- Confirmed path:
  - service list -> `MaxGauge` detail -> `편집`
  - icon picker opens from the button left of the service name input
  - a different icon can be chosen before save
- Failure point:
  - save completes, but reopening the edit page shows the original icon path again
- Meaning:
  - the harness reached the intended UI and performed a real save attempt
  - persistence did not match the expected TC result

### `eXemble_AI서비스_053`

- Confirmed path:
  - service detail page exposes `활성화`
  - confirmation modal opens
  - confirm action is clickable
- Failure point:
  - `서비스 정보 > 활성 상태` stays `비활성`
  - the harness waited 20 seconds for the state change and did not observe it
- Meaning:
  - this is not a locator failure
  - the activation action did not produce the expected state transition for `MaxGauge`

### `eXemble_AI서비스_054`

- Confirmed path:
  - the harness tried to establish the active precondition first
- Failure point:
  - the precondition activation never moved `MaxGauge` to `활성`
- Meaning:
  - the deactivation TC is implemented, but the product state never reached the required active baseline in this environment

## Evidence files

- Diagnostic screenshots and DOM capture:
  - `_workspace/diagnostics/ai-service-mutation/`
- Playwright run artifacts:
  - `test-results/ai-service-mutation.regres-e5c4f-r-reopening-the-edit-screen-regression/`
  - `test-results/ai-service-mutation.regres-99324--to-the-disposable-baseline-regression/`
  - `test-results/ai-service-mutation.regres-9006b--at-the-disposable-baseline-regression/`

## Next options

1. Keep the current result as product failures for `MaxGauge`.
2. Re-run `053/054` with another disposable service that already has a valid deployable version.
3. If activation is supposed to require a prior deploy step, split that requirement into a separate fixture rule and gate the activation case on it.
