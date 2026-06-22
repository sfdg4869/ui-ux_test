import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspaceDir = path.join(rootDir, '_workspace');

const defaultCatalogPath = path.join(workspaceDir, 'test-catalog.json');
const defaultMatrixJsonPath = path.join(workspaceDir, '05_tc_execution_matrix.json');
const defaultMatrixMarkdownPath = path.join(workspaceDir, '05_tc_execution_matrix.md');
const defaultSummaryPath = path.join(workspaceDir, '06_tc_execution_summary.md');

function normalizeToken(value) {
  return String(value ?? '').replace(/\r/g, ' ').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractCaseIdsFromTitle(title) {
  const match = title.match(/^\[([^\]]+)\]\s*/u);
  if (!match) {
    return [];
  }

  return match[1]
    .split(',')
    .map((value) => normalizeToken(value))
    .filter((value) => /^eXemble_.+?_\d{3}$/u.test(value));
}

function extractCaseIdsFromAnnotations(annotations) {
  if (!Array.isArray(annotations)) {
    return [];
  }

  return annotations
    .filter((annotation) => annotation?.type === 'TC-ID')
    .map((annotation) => normalizeToken(annotation.description))
    .filter((value) => /^eXemble_.+?_\d{3}$/u.test(value));
}

function toExecutionState(caseRow, runEntries) {
  if (runEntries.length > 0) {
    const statuses = runEntries.map((entry) => entry.status);

    if (statuses.some((status) => status === 'failed' || status === 'timedOut' || status === 'interrupted')) {
      return 'failed';
    }

    if (statuses.some((status) => status === 'passed')) {
      return 'passed';
    }

    if (statuses.every((status) => status === 'skipped')) {
      return 'skipped';
    }

    return statuses[0];
  }

  if (caseRow.target === 'manual') {
    return 'manual';
  }

  if (caseRow.target === 'blocked') {
    return 'blocked';
  }

  if (caseRow.target === 'deferred') {
    return 'deferred';
  }

  if (caseRow.harnessStatus === 'planned') {
    return 'planned';
  }

  if (caseRow.harnessStatus === 'implemented') {
    return 'not-run';
  }

  return 'unmapped';
}

function summarizeCounts(rows, key) {
  return rows.reduce((accumulator, row) => {
    const name = row[key];
    accumulator[name] = (accumulator[name] || 0) + 1;
    return accumulator;
  }, {});
}

function toMarkdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => {
    const values = columns.map((column) => normalizeToken(column.value(row)).replace(/\|/g, '\\|'));
    return `| ${values.join(' | ')} |`;
  });

  return [header, divider, ...body].join('\n');
}

export default class TcCatalogReporter {
  constructor(options = {}) {
    this.catalogPath = options.catalogPath ? path.resolve(rootDir, options.catalogPath) : defaultCatalogPath;
    this.matrixJsonPath = options.matrixJsonPath ? path.resolve(rootDir, options.matrixJsonPath) : defaultMatrixJsonPath;
    this.matrixMarkdownPath = options.matrixMarkdownPath
      ? path.resolve(rootDir, options.matrixMarkdownPath)
      : defaultMatrixMarkdownPath;
    this.summaryPath = options.summaryPath ? path.resolve(rootDir, options.summaryPath) : defaultSummaryPath;
    this.runEntriesByCaseId = new Map();
  }

  onTestEnd(test, result) {
    const caseIds = unique([
      ...extractCaseIdsFromTitle(test.title),
      ...extractCaseIdsFromAnnotations(test.annotations),
      ...extractCaseIdsFromAnnotations(result.annotations),
    ]);

    if (caseIds.length === 0) {
      return;
    }

    const failureMessage = result.errors
      ?.map((error) => normalizeToken(error?.message || error?.value))
      .filter(Boolean)
      .join(' / ');

    const entry = {
      title: test.title,
      location: test.location?.file ? path.relative(rootDir, test.location.file) : '',
      status: result.status,
      durationMs: result.duration,
      error: failureMessage || '',
    };

    for (const caseId of caseIds) {
      const entries = this.runEntriesByCaseId.get(caseId) ?? [];
      entries.push(entry);
      this.runEntriesByCaseId.set(caseId, entries);
    }
  }

  async onEnd() {
    const catalog = JSON.parse(await fs.readFile(this.catalogPath, 'utf8'));
    const checklistCases = Array.isArray(catalog.checklistCases) ? catalog.checklistCases : [];

    const matrixRows = checklistCases.map((caseRow) => {
      const runEntries = this.runEntriesByCaseId.get(caseRow.caseId) ?? [];
      const executionState = toExecutionState(caseRow, runEntries);
      const latestError = runEntries.find((entry) => entry.error)?.error ?? '';

      return {
        caseId: caseRow.caseId,
        module: caseRow.module,
        featureName: caseRow.featureName,
        target: caseRow.target,
        priority: caseRow.priority,
        harnessStatus: caseRow.harnessStatus,
        executionState,
        mappedSpecs: caseRow.implementedSpecs ?? [],
        blockingReason: caseRow.blockingReason ?? '',
        sourceResult: caseRow.sourceResult ?? '',
        runCount: runEntries.length,
        latestError,
      };
    });

    const countsByExecutionState = summarizeCounts(matrixRows, 'executionState');
    const failedRows = matrixRows.filter((row) => row.executionState === 'failed');
    const nonAutoRows = matrixRows.filter((row) => row.target !== 'auto');
    const plannedRows = matrixRows.filter((row) => row.executionState === 'planned');

    const matrixPayload = {
      generatedAt: new Date().toISOString(),
      catalogPath: path.relative(rootDir, this.catalogPath),
      summary: {
        totalCases: matrixRows.length,
        countsByExecutionState,
        countsByTarget: summarizeCounts(matrixRows, 'target'),
        countsByHarnessStatus: summarizeCounts(matrixRows, 'harnessStatus'),
      },
      rows: matrixRows,
    };

    await fs.writeFile(this.matrixJsonPath, JSON.stringify(matrixPayload, null, 2), 'utf8');

    await fs.writeFile(
      this.summaryPath,
      [
        '# TC Execution Summary',
        '',
        `- Total TC cases: **${matrixRows.length}**`,
        `- Execution states: ${Object.entries(countsByExecutionState)
          .map(([name, count]) => `\`${name}\`=${count}`)
          .join(', ')}`,
        '',
        '## Failed Auto Cases',
        '',
        failedRows.length === 0
          ? '- none'
          : toMarkdownTable(failedRows, [
              { label: 'TC-ID', value: (row) => row.caseId },
              { label: 'Module', value: (row) => row.module },
              { label: 'Feature', value: (row) => row.featureName },
              { label: 'Error', value: (row) => row.latestError || '-' },
            ]),
        '',
        '## Planned Auto Cases',
        '',
        plannedRows.length === 0
          ? '- none'
          : toMarkdownTable(plannedRows.slice(0, 40), [
              { label: 'TC-ID', value: (row) => row.caseId },
              { label: 'Module', value: (row) => row.module },
              { label: 'Feature', value: (row) => row.featureName },
              { label: 'Mapped Specs', value: (row) => row.mappedSpecs.join(', ') || '-' },
            ]),
        '',
        '## Non-Auto Cases',
        '',
        toMarkdownTable(nonAutoRows.slice(0, 60), [
          { label: 'TC-ID', value: (row) => row.caseId },
          { label: 'Target', value: (row) => row.target },
          { label: 'Feature', value: (row) => row.featureName },
          { label: 'Reason', value: (row) => row.blockingReason || '-' },
        ]),
      ].join('\n'),
      'utf8',
    );

    await fs.writeFile(
      this.matrixMarkdownPath,
      [
        '# TC Execution Matrix',
        '',
        toMarkdownTable(matrixRows, [
          { label: 'TC-ID', value: (row) => row.caseId },
          { label: 'Module', value: (row) => row.module },
          { label: 'Feature', value: (row) => row.featureName },
          { label: 'Target', value: (row) => row.target },
          { label: 'Priority', value: (row) => row.priority },
          { label: 'Harness Status', value: (row) => row.harnessStatus },
          { label: 'Current Run', value: (row) => row.executionState },
          { label: 'Run Count', value: (row) => String(row.runCount) },
          { label: 'Mapped Specs', value: (row) => row.mappedSpecs.join(', ') || '-' },
          { label: 'Reason / Error', value: (row) => row.latestError || row.blockingReason || '-' },
        ]),
      ].join('\n'),
      'utf8',
    );
  }
}
