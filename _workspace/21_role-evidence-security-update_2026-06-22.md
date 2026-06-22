# Role, Evidence, and Security Update - 2026-06-22

## Added / updated automation

- `tests/regression/authorization.profiles.regression.spec.ts`
  - added explicit regression check that the user account must not see the `서비스 관리` menu
- `tests/regression/planned-user-query-evidence.regression.spec.ts`
  - implemented `eXemble_사용자 질의_004`
  - implemented `eXemble_사용자 질의_006`
  - implemented `eXemble_사용자 질의_008`
  - implemented `eXemble_사용자 질의_009`
- `tests/regression/security.password-policy.regression.spec.ts`
  - implemented `eXemble_보안_007`

## Updated definitions

- `_workspace/automation-definitions/chat-cases.json`
  - mapped `GS인증` as the representative service
  - mapped the fixed question:
    - `안녕하세요 입사 시 제공되는 혜택에는 무엇이 있나요`
- `_workspace/automation-definitions/security-policy.json`
  - set password policy baseline to:
    - `8-20`
    - `letter + number + special`
  - recorded the disposable mutation/security account reference

## Verification

- Targeted TC report run:
  - `node .\scripts\run-tc-catalog.mjs tests/regression/planned-user-query-evidence.regression.spec.ts tests/regression/authorization.profiles.regression.spec.ts tests/regression/security.password-policy.regression.spec.ts --project=regression`
- Final result:
  - passed: `5`
  - failed: `3`

## Passed cases

- `eXemble_사용자 질의_004`
- `eXemble_보안_007`
- supplemental authz regressions:
  - admin route access
  - user blocked-route access
  - user `서비스 관리` menu hidden

## Failed cases

- `eXemble_사용자 질의_006`
  - current runtime result: no attachment/evidence label was rendered in the GS인증 answer screen
- `eXemble_사용자 질의_008`
  - current runtime result: no `근거 자료` surface was rendered in the GS인증 answer screen
- `eXemble_사용자 질의_009`
  - current runtime result: no evidence label/link surface was rendered, so link-open validation could not proceed

## Catalog status after refresh

- `implemented=149`
- `planned=3`
- remaining planned:
  - `eXemble_AI서비스_037`
  - `eXemble_AI서비스_053`
  - `eXemble_AI서비스_054`
