# UI Safe Controls Smoke Report

- Run date: `2026-06-17`
- Command used for verified run:
  - `npx.cmd playwright test tests/smoke/ui-safe-controls.smoke.spec.ts --project=smoke`
- Scope:
  - safe UI controls only
  - excludes destructive controls such as `저장`, `생성`, `삭제`, `배포`, `업로드`, `실행`
- Target:
  - module-level UI stability after safe control clicks
  - console error
  - page error
  - `5xx` response
  - unexpected return to `/login`

## Summary

- Total tests: `8`
- Passed: `6`
- Failed: `2`

## Passed Modules

1. `대시보드`
   - Result: pass
   - Meaning: safe controls collected and clicked without detected UI error
2. `데이터`
   - Result: pass
   - Meaning: safe controls collected and clicked without detected UI error
3. `모델`
   - Result: pass
   - Meaning: safe controls collected and clicked without detected UI error
4. `도구`
   - Result: pass
   - Meaning: initial control-detection issue was fixed and the screen now completes the safe-click sweep
5. `권한`
   - Result: pass
   - Meaning: direct route opening stabilized the screen and safe controls completed without detected UI error
6. `로그`
   - Result: pass
   - Meaning: safe controls completed without detected UI error

## Failed Modules

1. `AI 서비스`
   - Failing control: `button:검색 Ctrl+K`
   - Observed issue:
     - console error:
       - ``DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users.`
   - Interpretation:
     - the global search dialog opens, but the dialog surface is missing an accessible title contract
   - Evidence:
     - [error-context.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-42059--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/error-context.md)
     - [test-failed-1.png](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-42059--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/test-failed-1.png)
     - [trace.zip](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-42059--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/trace.zip)

2. `채팅`
   - Failing control: `button:검색 Ctrl+K`
   - Observed issue:
     - console error:
       - ``DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users.`
   - Interpretation:
     - the same global search dialog surface is reused here and exposes the same UI/accessibility defect
   - Evidence:
     - [error-context.md](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-6a7f2--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/error-context.md)
     - [test-failed-1.png](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-6a7f2--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/test-failed-1.png)
     - [trace.zip](/c:/Users/jungkyungsoo/Desktop/jks/개발/exemble/test-results/ui-safe-controls.smoke-안전한-6a7f2--컨트롤을-순회-클릭해도-UI-오류가-없어야-한다-smoke/trace.zip)

## What This Run Actually Verifies

- It does **not** prove every button in the product is safe.
- It does prove that the currently allowlisted safe controls can be traversed across `8` module surfaces.
- It also proves that the harness can now distinguish:
  - control-detection issues in the harness
  - real UI/runtime issues in the product

## Current Harness Status

- The earlier `안전한 버튼/탭을 찾지 못했습니다` issue was a harness-side selector problem and has been fixed.
- Remaining failures in this report are product-side runtime/accessibility issues, not missing-control detection failures.

## Recommended Follow-up

1. Fix the shared `검색 Ctrl+K` dialog so it renders a valid dialog title structure.
2. Re-run:
   - `npx.cmd playwright test tests/smoke/ui-safe-controls.smoke.spec.ts --project=smoke`
3. If the dialog issue is fixed, the current expectation is that all `8` module-safe smoke cases should pass.
