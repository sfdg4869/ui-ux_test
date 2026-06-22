# UI Defect Candidates From Safe Control Sweep

## Candidate 1

- Title:
  - global search dialog emits accessibility console error when `검색 Ctrl+K` is clicked
- Severity:
  - `medium`
- Type:
  - UI runtime / accessibility defect
- Affected surfaces:
  - `AI 서비스`
  - `채팅`
- Trigger:
  - click `검색 Ctrl+K`
- Observed behavior:
  - the UI emits a console error:
    - ``DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users.`
- Expected behavior:
  - opening the global search dialog should not emit runtime or accessibility console errors
- Why this looks like one shared defect:
  - the same control name appears in both surfaces
  - both failures emit the exact same message
  - the failing surface appears to be the shared search dialog rather than a module-specific panel
- Evidence:
  - AI 서비스:
    - [error-context.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-42059--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/error-context.md)
    - [test-failed-1.png](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-42059--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/test-failed-1.png)
    - [trace.zip](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-42059--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/trace.zip)
  - 채팅:
    - [error-context.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-6a7f2--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/error-context.md)
    - [test-failed-1.png](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-6a7f2--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/test-failed-1.png)
    - [trace.zip](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-6a7f2--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/trace.zip)

## Suggested Developer Check

- Search for the shared `Ctrl+K` dialog component.
- Confirm that the dialog content includes a title element compatible with the Radix dialog contract.
- If the title should remain visually hidden, wrap it in the equivalent hidden-title pattern rather than omitting it.

## Retest Condition

- After the shared search dialog is fixed, rerun:
  - `npx.cmd playwright test tests/smoke/ui-safe-controls.smoke.spec.ts --project=smoke`
- Expected result after fix:
  - `AI 서비스` pass
  - `채팅` pass
  - no console error from `검색 Ctrl+K`
