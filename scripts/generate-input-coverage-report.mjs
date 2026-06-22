import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspaceDir = path.join(rootDir, '_workspace');
const matrixPath = path.join(workspaceDir, '12_input_range_matrix.json');
const outputPath = path.join(workspaceDir, '16_manual_input_coverage_report.md');

function renderRuleText(rule) {
  if (rule.limitKind === 'range') {
    return `${rule.min}~${rule.max}${rule.unit}`;
  }

  if (rule.limitKind === 'allowed-file-types') {
    return `지원 형식: ${rule.qualifiers}`;
  }

  return `최대 ${rule.max}${rule.unit}`;
}

function groupByStatus(rules) {
  return rules.reduce((accumulator, rule) => {
    if (!accumulator.has(rule.automationStatus)) {
      accumulator.set(rule.automationStatus, []);
    }

    accumulator.get(rule.automationStatus).push(rule);
    return accumulator;
  }, new Map());
}

const raw = await fs.readFile(matrixPath, 'utf8');
const matrix = JSON.parse(raw);
const rules = [...(matrix.rules || [])];
const manualPdfRules = rules.filter((rule) => rule.source === 'manual-pdf');
const groupedByStatus = groupByStatus(rules);

const lines = [
  '# Manual Input Coverage Report',
  '',
  `- Generated from: \`${path.relative(rootDir, matrixPath)}\``,
  `- Total extracted rules: **${matrix.summary?.total || rules.length}**`,
  `- Auto-ready: **${matrix.summary?.byStatus?.['auto-ready'] || 0}**`,
  `- Auto with sample data: **${matrix.summary?.byStatus?.['auto-with-test-data'] || 0}**`,
  `- Manual: **${matrix.summary?.byStatus?.manual || 0}**`,
  `- Deferred: **${matrix.summary?.byStatus?.deferred || 0}**`,
  `- Blocked: **${matrix.summary?.byStatus?.blocked || 0}**`,
  `- Manual PDF supplement rows kept: **${manualPdfRules.length}**`,
  '',
  '## Status Meaning',
  '',
  '| Status | Meaning |',
  '| --- | --- |',
  '| `auto-ready` | 지금 바로 Playwright spec로 실행 가능한 입력 범위 규칙 |',
  '| `auto-with-test-data` | 샘플 파일이나 추가 fixture가 있으면 자동 실행 가능한 규칙 |',
  '| `manual` | 쓰기 위험, 상태 의존성, 또는 안전한 경로 미확보로 수동 검증 권장 |',
  '| `deferred` | 상세 UI 계약이나 테스트 데이터가 더 필요해 다음 단계로 미룬 규칙 |',
  '| `blocked` | 현 환경만으로는 검증이 어려운 규칙 |',
  '',
  '## Manual PDF Additions',
  '',
  '체크리스트만으로는 빠졌던 매뉴얼 기반 입력 규칙 중 현재 매트릭스에 유지된 항목입니다.',
  '',
  '| TC-ID | 필드 | 규칙 | 상태 | Spec |',
  '| --- | --- | --- | --- | --- |',
  ...manualPdfRules.map(
    (rule) => `| ${rule.caseId} | ${rule.field} | ${renderRuleText(rule)} | ${rule.automationStatus} | ${rule.specPath} |`,
  ),
  '',
  '## Remaining Non-Automated Rules',
  '',
  '| TC-ID | 필드 | 규칙 | 상태 | 사유 |',
  '| --- | --- | --- | --- | --- |',
  ...['manual', 'deferred', 'blocked'].flatMap((status) =>
    (groupedByStatus.get(status) || []).map(
      (rule) => `| ${rule.caseId} | ${rule.field} | ${renderRuleText(rule)} | ${status} | ${rule.automationNote} |`,
    ),
  ),
  '',
  '## How To Use',
  '',
  '1. `npm.cmd run input-range:build`를 실행하면 입력 범위 매트릭스와 이 보고서가 다시 생성됩니다.',
  '2. `npm.cmd run test:input-range`를 실행하면 자동화 가능한 입력 범위 spec만 회귀로 실행됩니다.',
  '3. 실패가 나오면 Playwright 리포트의 `observed=` annotation과 `_workspace/15_input_range_failure_triage.md`를 같이 보면 됩니다.',
];

await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      outputPath: path.relative(rootDir, outputPath),
      manualPdfRules: manualPdfRules.length,
      totalRules: rules.length,
    },
    null,
    2,
  ),
);
