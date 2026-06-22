import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspaceDir = path.join(rootDir, '_workspace');

const catalogPath = path.join(workspaceDir, 'test-catalog.json');
const matrixPath = path.join(workspaceDir, '05_tc_execution_matrix.json');
const detailReportPath = path.join(workspaceDir, '10_stepwise_progress_report.md');

function normalizeCell(value) {
  return String(value ?? '').replace(/\r/g, ' ').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function ensureColumnIndex(headerRow, label) {
  const existingIndex = headerRow.findIndex((cell) => normalizeCell(cell) === label);
  if (existingIndex >= 0) {
    return existingIndex;
  }

  headerRow.push(label);
  return headerRow.length - 1;
}

function setCell(rows, rowIndex, columnIndex, value) {
  while (rows.length <= rowIndex) {
    rows.push([]);
  }

  const row = rows[rowIndex];
  while (row.length <= columnIndex) {
    row.push('');
  }

  row[columnIndex] = value;
}

function countBy(values) {
  return values.reduce((accumulator, value) => {
    accumulator[value] = (accumulator[value] || 0) + 1;
    return accumulator;
  }, {});
}

function formatCounts(values) {
  const counts = countBy(values);
  return Object.entries(counts)
    .map(([name, count]) => `${name}=${count}`)
    .join(', ');
}

function loadWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  return { workbook, sheetName, sheet, rows };
}

function saveWorkbook(filePath, workbook, sheetName, rows, originalSheet) {
  const nextSheet = XLSX.utils.aoa_to_sheet(rows);
  if (originalSheet['!cols']) {
    nextSheet['!cols'] = originalSheet['!cols'];
  }
  if (originalSheet['!rows']) {
    nextSheet['!rows'] = originalSheet['!rows'];
  }

  workbook.Sheets[sheetName] = nextSheet;
  XLSX.writeFile(workbook, filePath);
}

function summarizeRows(rows) {
  const executionStates = rows.map((row) => row.executionState);
  const targetStates = rows.map((row) => row.target);
  const reasons = unique(rows.map((row) => row.blockingReason).filter(Boolean));

  return {
    executionSummary: formatCounts(executionStates),
    targetSummary: formatCounts(targetStates),
    reasonSummary: reasons.join(' / '),
  };
}

async function main() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
  const matrix = JSON.parse(await fs.readFile(matrixPath, 'utf8'));

  const matrixRows = Array.isArray(matrix.rows) ? matrix.rows : [];
  const matrixByCaseId = new Map(matrixRows.map((row) => [row.caseId, row]));

  const checklistWorkbookPath = path.join(
    workspaceDir,
    `${path.parse(catalog.source.checklistPdf).name}.work.xlsx`,
  );
  const featureWorkbookPath = path.join(
    workspaceDir,
    `${path.parse(catalog.source.featureListWorkbook).name}.work.xlsx`,
  );

  const checklistWorkbookState = loadWorkbook(checklistWorkbookPath);
  const checklistHeader = checklistWorkbookState.rows[0] ?? [];
  const checklistCaseIdIndex = ensureColumnIndex(checklistHeader, 'TC-ID');
  const checklistHarnessStatusIndex = ensureColumnIndex(checklistHeader, '현재 하네스 상태');
  const checklistBlockingReasonIndex = ensureColumnIndex(checklistHeader, '차단 사유');
  const checklistExecutionIndex = ensureColumnIndex(checklistHeader, '실행 결과');
  const checklistMemoIndex = ensureColumnIndex(checklistHeader, '실행 메모');

  for (let rowIndex = 1; rowIndex < checklistWorkbookState.rows.length; rowIndex += 1) {
    const row = checklistWorkbookState.rows[rowIndex];
    const caseId = normalizeCell(row[checklistCaseIdIndex]);
    if (!caseId) {
      continue;
    }

    const matrixRow = matrixByCaseId.get(caseId);
    if (!matrixRow) {
      continue;
    }

    setCell(checklistWorkbookState.rows, rowIndex, checklistHarnessStatusIndex, matrixRow.harnessStatus);
    setCell(checklistWorkbookState.rows, rowIndex, checklistBlockingReasonIndex, matrixRow.blockingReason || '');
    setCell(checklistWorkbookState.rows, rowIndex, checklistExecutionIndex, matrixRow.executionState);

    const memo =
      matrixRow.latestError ||
      (matrixRow.executionState === 'skipped' ? matrixRow.blockingReason : '') ||
      (['manual', 'blocked', 'deferred'].includes(matrixRow.executionState) ? matrixRow.blockingReason : '');
    setCell(checklistWorkbookState.rows, rowIndex, checklistMemoIndex, memo || '');
  }

  saveWorkbook(
    checklistWorkbookPath,
    checklistWorkbookState.workbook,
    checklistWorkbookState.sheetName,
    checklistWorkbookState.rows,
    checklistWorkbookState.sheet,
  );

  const featureWorkbookState = loadWorkbook(featureWorkbookPath);
  const featureHeader = featureWorkbookState.rows[0] ?? [];
  const relatedTcIndex = ensureColumnIndex(featureHeader, '관련 TC-ID');
  const featureExecutionIndex = ensureColumnIndex(featureHeader, '실행 결과');
  const featureBlockingReasonIndex = ensureColumnIndex(featureHeader, '차단 사유');
  const featureMemoIndex = ensureColumnIndex(featureHeader, '수정/보완 메모');

  for (let rowIndex = 1; rowIndex < featureWorkbookState.rows.length; rowIndex += 1) {
    const row = featureWorkbookState.rows[rowIndex];
    const tcIds = String(row[relatedTcIndex] ?? '')
      .split(/\n|,/u)
      .map((value) => normalizeCell(value))
      .filter(Boolean);

    if (tcIds.length === 0) {
      continue;
    }

    const relatedRows = tcIds.map((caseId) => matrixByCaseId.get(caseId)).filter(Boolean);
    if (relatedRows.length === 0) {
      continue;
    }

    const summary = summarizeRows(relatedRows);
    setCell(featureWorkbookState.rows, rowIndex, featureExecutionIndex, summary.executionSummary);
    setCell(featureWorkbookState.rows, rowIndex, featureBlockingReasonIndex, summary.reasonSummary);

    const existingMemoParts = String(row[featureMemoIndex] ?? '')
      .split(' / ')
      .map((value) => normalizeCell(value))
      .filter(Boolean);
    const memoParts = unique([
      ...existingMemoParts,
      summary.reasonSummary,
      summary.targetSummary ? `target: ${summary.targetSummary}` : '',
    ]);
    setCell(featureWorkbookState.rows, rowIndex, featureMemoIndex, memoParts.join(' / '));
  }

  saveWorkbook(
    featureWorkbookPath,
    featureWorkbookState.workbook,
    featureWorkbookState.sheetName,
    featureWorkbookState.rows,
    featureWorkbookState.sheet,
  );

  const passedRows = matrixRows.filter((row) => row.executionState === 'passed');
  const skippedRows = matrixRows.filter((row) => row.executionState === 'skipped');
  const plannedRows = matrixRows.filter((row) => row.executionState === 'planned');
  const manualRows = matrixRows.filter((row) => row.executionState === 'manual');
  const blockedRows = matrixRows.filter((row) => row.executionState === 'blocked');
  const deferredRows = matrixRows.filter((row) => row.executionState === 'deferred');

  const keyPassedCaseIds = [
    'eXemble_사용자 로그인_001',
    'eXemble_사용자 로그인_002',
    'eXemble_사용자 로그인_004',
    'eXemble_사용자 로그인_005',
    'eXemble_환경설정_005',
    'eXemble_사용자 질의_001',
    'eXemble_사용자 질의_002',
    'eXemble_사용자 질의_003',
    'eXemble_사용자 질의_005',
    'eXemble_대시보드_001',
    'eXemble_AI서비스_001',
    'eXemble_AI서비스_003',
    'eXemble_AI서비스_004',
    'eXemble_데이터_001',
    'eXemble_데이터_002',
    'eXemble_데이터_003',
    'eXemble_모델_001',
    'eXemble_모델_002',
    'eXemble_모델_003',
    'eXemble_모델_004',
    'eXemble_도구_001',
    'eXemble_도구_002',
    'eXemble_도구_003',
    'eXemble_권한_001',
    'eXemble_권한_002',
    'eXemble_로그_001',
    'eXemble_로그_002',
    'eXemble_로그_003',
    'eXemble_로그_005',
    'eXemble_보안_003',
    'eXemble_보안_004',
    'eXemble_보안_005',
    'eXemble_보안_006',
  ];

  const reportLines = [
    '# Stepwise Progress Report',
    '',
    '## 1. 현재 계정 기준 TC 접근 경로 정리',
    '',
    '- 일반 사용자 진입 후 `admin@ex-em.com` 계정 패널에서 `서비스 관리`를 눌러야 관리자성 메뉴가 노출됨',
    '- 직접 접근 가능한 P0 화면: 로그인, 로그아웃, 새 채팅, AI 서비스',
    '- 서비스 관리 경유 확인 화면: 대시보드, 데이터, 모델, 도구, 권한, 로그',
    '',
    '## 2. blocked / manual / deferred 정리',
    '',
    `- blocked: ${blockedRows.length}건`,
    `- manual: ${manualRows.length}건`,
    `- deferred: ${deferredRows.length}건`,
    `- skipped: ${skippedRows.length}건`,
    '- 대표 blocked:',
    `  - ${skippedRows.map((row) => row.caseId).join(', ') || '없음'}`,
    '',
    '## 3. 최신 자동화 실행 반영',
    '',
    `- passed: ${passedRows.length}건`,
    `- planned: ${plannedRows.length}건`,
    '- 대표 pass TC:',
    ...keyPassedCaseIds.map((caseId) => `  - ${caseId}`),
    '',
    '## 4. 서비스 관리 하위 모듈 순차 검증 결과',
    '',
    '- 대시보드: 서비스 관리 경유 후 진입 확인',
    '- 데이터: `데이터 -> 데이터 소스` 경로 확인',
    '- 모델: 목록/검색 진입 확인',
    '- 도구: 목록/검색 진입 확인',
    '- 권한: `권한 -> 계정 관리` 경로로 보정 후 목록/검색 확인',
    '- 로그: 검색 화면이 아니라 목록/필터/정렬 TC로 분리 보정 후 확인',
    '',
    '## 산출물',
    '',
    `- checklist workbook updated: ${path.relative(rootDir, checklistWorkbookPath)}`,
    `- feature workbook updated: ${path.relative(rootDir, featureWorkbookPath)}`,
    `- matrix json: ${path.relative(rootDir, matrixPath)}`,
    '',
  ];

  await fs.writeFile(detailReportPath, reportLines.join('\n'), 'utf8');

  console.log(
    JSON.stringify(
      {
        checklistWorkbookPath,
        featureWorkbookPath,
        detailReportPath,
        passed: passedRows.length,
        skipped: skippedRows.length,
        planned: plannedRows.length,
        manual: manualRows.length,
        blocked: blockedRows.length,
        deferred: deferredRows.length,
      },
      null,
      2,
    ),
  );
}

await main();
