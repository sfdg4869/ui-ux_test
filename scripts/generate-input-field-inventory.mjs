import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspaceDir = path.join(rootDir, '_workspace');
const matrixPath = path.join(workspaceDir, '12_input_range_matrix.json');
const outputPath = path.join(workspaceDir, '13_input_field_inventory.md');

function compareRules(a, b) {
  return (
    a.module.localeCompare(b.module, 'ko') ||
    a.caseId.localeCompare(b.caseId, 'en') ||
    a.field.localeCompare(b.field, 'ko')
  );
}

function renderRuleText(rule) {
  if (rule.limitKind === 'range') {
    return `${rule.min}~${rule.max}${rule.unit}`;
  }

  if (rule.limitKind === 'allowed-file-types') {
    return `지원 형식: ${rule.qualifiers}`;
  }

  return `최대 ${rule.max}${rule.unit}`;
}

const raw = await fs.readFile(matrixPath, 'utf8');
const matrix = JSON.parse(raw);
const rules = [...(matrix.rules || [])].sort(compareRules);

const grouped = new Map();
for (const rule of rules) {
  if (!grouped.has(rule.module)) {
    grouped.set(rule.module, []);
  }
  grouped.get(rule.module).push(rule);
}

const lines = [
  '# Input Field Inventory',
  '',
  '- Source: `_workspace/12_input_range_matrix.json`',
  `- Total field rules: **${rules.length}**`,
  `- Automatable now: **${(matrix.summary?.byStatus?.['auto-ready'] || 0) + (matrix.summary?.byStatus?.['auto-with-test-data'] || 0)}**`,
  `- Manual, deferred, or blocked: **${(matrix.summary?.byStatus?.manual || 0) + (matrix.summary?.byStatus?.deferred || 0) + (matrix.summary?.byStatus?.blocked || 0)}**`,
  '',
  '이 문서는 매뉴얼/체크리스트에서 추출한 입력 필드와 유효범위를 모듈별로 정리한 인벤토리입니다.',
  '',
];

for (const [moduleName, moduleRules] of grouped.entries()) {
  lines.push(`## ${moduleName}`);
  lines.push('');
  lines.push(`- Field rules: **${moduleRules.length}**`);
  lines.push('');
  lines.push('| TC-ID | 기능 | 입력 필드 | 유효범위 | 자동화 분류 | Spec | Source | 비고 |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');

  for (const rule of moduleRules) {
    lines.push(
      `| ${rule.caseId} | ${rule.featureName} | ${rule.field} | ${renderRuleText(rule)} | ${rule.automationStatus} | ${rule.specPath} | ${rule.source} | ${rule.automationNote}${rule.sourceIssueSummary ? `<br>${rule.sourceIssueSummary}` : ''} |`,
    );
  }

  lines.push('');
}

await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      outputPath: path.relative(rootDir, outputPath),
      modules: [...grouped.keys()],
      totalRules: rules.length,
    },
    null,
    2,
  ),
);
