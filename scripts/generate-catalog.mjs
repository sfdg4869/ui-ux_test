import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const manualDir = path.join(rootDir, 'manual');
const workspaceDir = path.join(rootDir, '_workspace');
const testsDir = path.join(rootDir, 'tests');

const outputCatalogPath = path.join(workspaceDir, 'test-catalog.json');
const inputSummaryPath = path.join(workspaceDir, '00_input.md');
const moduleMapPath = path.join(workspaceDir, '01_manual_module_map.md');
const catalogMarkdownPath = path.join(workspaceDir, '02_test_catalog.md');
const executionReportPath = path.join(workspaceDir, '03_execution_report.md');
const excludedCasesPath = path.join(workspaceDir, '04_excluded_cases.md');

const manualModules = [
  { name: '로그인', toc: '2.1 사용자 로그인', checklistModule: '사용자 로그인', featureMajors: ['권한'] },
  { name: '환경설정', toc: '2.2 환경설정', checklistModule: '환경설정', featureMajors: ['공통 기능'] },
  { name: '사용자 화면', toc: '2.3 사용자 화면', checklistModule: '사용자 질의', featureMajors: ['채팅'] },
  { name: '대시보드', toc: '2.4 대시보드', checklistModule: '대시보드', featureMajors: ['모니터링'] },
  { name: '데이터', toc: '2.5 데이터', checklistModule: '데이터', featureMajors: ['데이터'] },
  { name: '모델', toc: '2.6 모델', checklistModule: '모델', featureMajors: ['모델'] },
  { name: '도구', toc: '2.7 도구', checklistModule: '도구', featureMajors: ['도구'] },
  { name: 'AI 서비스', toc: '2.8 AI 서비스', checklistModule: 'AI서비스', featureMajors: ['AI 서비스'] },
  { name: '권한', toc: '2.9 권한', checklistModule: '권한', featureMajors: ['권한'] },
  { name: '로그', toc: '2.10 로그', checklistModule: '로그', featureMajors: ['로그'] },
];

const featureToChecklistModules = new Map([
  ['공통 기능', ['환경설정', '시스템']],
  ['모니터링', ['대시보드']],
  ['AI 서비스', ['AI서비스']],
  ['데이터', ['데이터']],
  ['모델', ['모델']],
  ['도구', ['도구']],
  ['권한', ['권한', '사용자 로그인', '환경설정']],
  ['로그', ['로그', '시스템']],
  ['채팅', ['사용자 질의']],
]);

const targetPriority = {
  auto: 0,
  deferred: 1,
  manual: 2,
  blocked: 3,
};

const priorityRank = {
  P0: 0,
  P1: 1,
  P2: 2,
};

const destructivePatterns = [
  /비밀번호 변경/u,
  /삭제/u,
  /등록/u,
  /생성/u,
  /수정/u,
  /저장/u,
  /업로드/u,
  /추가/u,
  /잠금/u,
  /배포/u,
  /파인튜닝/u,
  /재벡터/u,
  /중단/u,
  /편집/u,
  /복구/u,
  /백업/u,
];

const blockedPatterns = [
  /SSO/u,
  /동시 접속/u,
  /폐쇄망/u,
  /wireshark/u,
  /패킷/u,
  /HA/u,
  /장애/u,
];

const deferredPatterns = [
  /그래프/u,
  /대표 서비스/u,
  /근거 파일 링크/u,
  /근거 자료/u,
  /정의되지 않은 질문/u,
  /마우스를 움직/u,
  /피드백/u,
  /여러 개 있으면/u,
  /확인 필요/u,
  /스펙이 불분명/u,
];

const readOnlyPatterns = [
  /메뉴 접근/u,
  /목록/u,
  /검색/u,
  /조회/u,
  /확인/u,
  /필터/u,
  /정렬/u,
  /상태/u,
  /기본정보/u,
  /상세/u,
  /로그아웃/u,
  /다크모드/u,
  /라이트모드/u,
  /대화내역/u,
  /질의 입력/u,
  /ID\/PW 로그인/u,
  /아이디 저장/u,
];

const safeNonMutatingAutoCaseIds = new Set([
  'eXemble_AI서비스_012',
  'eXemble_AI서비스_037',
  'eXemble_AI서비스_044',
  'eXemble_권한_004',
  'eXemble_권한_006',
  'eXemble_권한_008',
  'eXemble_권한_016',
  'eXemble_권한_022',
  'eXemble_데이터_006',
  'eXemble_데이터_007',
  'eXemble_데이터_010',
  'eXemble_데이터_029',
  'eXemble_데이터_033',
  'eXemble_데이터_034',
  'eXemble_데이터_035',
  'eXemble_데이터_036',
  'eXemble_데이터_038',
  'eXemble_데이터_039',
  'eXemble_데이터_040',
  'eXemble_데이터_041',
  'eXemble_도구_004',
  'eXemble_도구_010',
  'eXemble_도구_014',
]);

function normalizeToken(value) {
  return String(value).replace(/\r/g, ' ').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeMatchText(value) {
  return normalizeToken(value)
    .replace(/[()[\]{}.,/\\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function splitCaseTokens(block) {
  return block
    .split('\t')
    .map((part) => normalizeToken(part))
    .filter(Boolean);
}

function cleanIssueTokens(tokens) {
  return tokens
    .map((token) => token.replace(/^이미지 링크\s*/u, '').replace(/\s*이미지 링크$/u, '').trim())
    .filter((token) => token && token !== '이미지 링크');
}

function extractStatus(tokens) {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index];
    const match = token.match(/^(Pass|Fail|N\/T|N\/A)\b\s*(.*)$/u);
    if (!match) {
      continue;
    }

    const issueTokens = [];
    if (match[2]) {
      issueTokens.push(match[2]);
    }

    issueTokens.push(...tokens.slice(index + 1));
    return {
      status: match[1],
      issueTokens: cleanIssueTokens(issueTokens),
      frontTokens: tokens.slice(0, index),
    };
  }

  return {
    status: 'UNKNOWN',
    issueTokens: [],
    frontTokens: cleanIssueTokens(tokens),
  };
}

function splitFlowTokens(tokens) {
  if (tokens.length === 0) {
    return { precondition: '', processTokens: [], expectedResult: '' };
  }

  const mutableTokens = [...tokens];
  const preconditionTokens = [];
  let stepStart = -1;

  for (let index = 0; index < mutableTokens.length; index += 1) {
    const stepOffset = mutableTokens[index].search(/(?:^|\s)1\.\s*/u);
    if (stepOffset === -1) {
      preconditionTokens.push(mutableTokens[index]);
      continue;
    }

    if (stepOffset > 0) {
      const precondition = normalizeToken(mutableTokens[index].slice(0, stepOffset));
      if (precondition) {
        preconditionTokens.push(precondition);
      }
      mutableTokens[index] = normalizeToken(mutableTokens[index].slice(stepOffset));
    }

    stepStart = index;
    break;
  }

  if (stepStart === -1) {
    if (mutableTokens.length === 1) {
      return {
        precondition: mutableTokens[0],
        processTokens: [],
        expectedResult: '',
      };
    }

    return {
      precondition: mutableTokens[0],
      processTokens: mutableTokens.slice(1, -1),
      expectedResult: mutableTokens.at(-1) ?? '',
    };
  }

  const tailTokens = mutableTokens.slice(stepStart);
  return {
    precondition: preconditionTokens.join(' '),
    processTokens: tailTokens.slice(0, -1),
    expectedResult: tailTokens.at(-1) ?? '',
  };
}

function parseChecklistBlock(block) {
  const tokens = splitCaseTokens(block);
  const firstToken = tokens.shift() ?? '';
  const firstMatch = firstToken.match(/^(eXemble_.+?_\d{3})(?:\s+(.*))?$/u);

  if (!firstMatch) {
    return null;
  }

  const caseId = firstMatch[1];
  const leadingToken = normalizeToken(firstMatch[2] ?? '');
  const bodyTokens = leadingToken ? [leadingToken, ...tokens] : [...tokens];
  const { status, issueTokens, frontTokens } = extractStatus(bodyTokens);

  const parsedTokens = [...frontTokens];
  const depth1 = parsedTokens.shift() ?? inferModuleFromCaseId(caseId);
  const depth2 = parsedTokens.shift() ?? '';
  const depth3 = parsedTokens.shift() ?? '';
  const featureName = parsedTokens.shift() ?? '';
  const { precondition, processTokens, expectedResult } = splitFlowTokens(parsedTokens);

  return {
    caseId,
    module: depth1 || inferModuleFromCaseId(caseId),
    depth2,
    depth3,
    featureName,
    precondition,
    process: processTokens.join('\n'),
    expectedResult,
    sourceResult: status,
    sourceIssueSummary: issueTokens.join(' '),
  };
}

function inferModuleFromCaseId(caseId) {
  return caseId.replace(/^eXemble_/u, '').replace(/_\d{3}$/u, '');
}

function inferChecklistTarget(checklistCase) {
  const identityText = normalizeMatchText(
    [
      checklistCase.module,
      checklistCase.depth2,
      checklistCase.depth3,
      checklistCase.featureName,
    ].join(' '),
  );
  const combinedText = normalizeMatchText(
    [
      checklistCase.precondition,
      checklistCase.process,
      checklistCase.expectedResult,
      checklistCase.sourceIssueSummary,
    ].join(' '),
  );

  const caseNumber = Number(checklistCase.caseId.match(/_(\d{3})$/u)?.[1] ?? 0);
  const securityHeaderCaseIds = new Set([
    'eXemble_보안_003',
    'eXemble_보안_004',
    'eXemble_보안_005',
    'eXemble_보안_006',
  ]);

  if (checklistCase.module === '매뉴얼') {
    return {
      target: 'manual',
      priority: 'P2',
      blockingReason: '문서 검토 항목이므로 UI 자동화보다 수동 검토가 적합합니다.',
    };
  }

  if (checklistCase.caseId === 'eXemble_사용자 로그인_003') {
    return {
      target: 'blocked',
      priority: 'P1',
      blockingReason: '현재 환경에서 SSO 버튼이 비활성화되어 있어 SSO 연동 환경이 준비되어야 합니다.',
    };
  }

  if (checklistCase.module === '보안' && securityHeaderCaseIds.has(checklistCase.caseId)) {
    return {
      target: 'auto',
      priority: 'P1',
      blockingReason: '',
    };
  }

  if (
    checklistCase.module === '사용자 로그인' ||
    checklistCase.module === '사용자 질의' ||
    checklistCase.module === '대시보드' ||
    checklistCase.caseId === 'eXemble_환경설정_005'
  ) {
    return {
      target: 'auto',
      priority: 'P0',
      blockingReason: '',
    };
  }

  if (
    checklistCase.module === '환경설정' &&
    ['다크모드 전환', '라이트모드 전환'].includes(checklistCase.featureName)
  ) {
    return {
      target: 'auto',
      priority: 'P1',
      blockingReason: '',
    };
  }

  if (safeNonMutatingAutoCaseIds.has(checklistCase.caseId)) {
    return {
      target: 'auto',
      priority: 'P2',
      blockingReason: '',
    };
  }

  if (blockedPatterns.some((pattern) => pattern.test(`${identityText} ${combinedText}`))) {
    return {
      target: 'blocked',
      priority: 'P2',
      blockingReason: '전용 환경, 다중 사용자, 보안 도구, 또는 외부 인프라 검증이 필요한 항목입니다.',
    };
  }

  if (destructivePatterns.some((pattern) => pattern.test(identityText))) {
    return {
      target: 'manual',
      priority: 'P2',
      blockingReason: '실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 기본값을 수동 검증으로 둡니다.',
    };
  }

  if (
    checklistCase.sourceResult === 'N/A' ||
    checklistCase.sourceResult === 'N/T' ||
    deferredPatterns.some((pattern) => pattern.test(combinedText))
  ) {
    return {
      target: 'deferred',
      priority: checklistCase.module === '사용자 질의' ? 'P1' : 'P2',
      blockingReason: '추가 데이터, 상세 스펙, 또는 동적 UI 계약 확인이 필요한 항목입니다.',
    };
  }

  if (readOnlyPatterns.some((pattern) => pattern.test(`${identityText} ${combinedText}`))) {
    return {
      target: 'auto',
      priority: 'P1',
      blockingReason: '',
    };
  }

  return {
    target: 'deferred',
    priority: 'P2',
    blockingReason: '1차 범위 밖이거나 UI/데이터 계약이 더 필요한 항목입니다.',
  };
}

function classifyHarnessStatus(target, implementedSpecs) {
  if (implementedSpecs.length > 0) {
    return 'implemented';
  }

  if (target === 'auto') {
    return 'planned';
  }

  if (target === 'manual') {
    return 'manual';
  }

  if (target === 'blocked') {
    return 'blocked';
  }

  return 'deferred';
}

async function resolveSourceFiles() {
  const manualFiles = await fs.readdir(manualDir);

  const featureWorkbookName = manualFiles.find((fileName) => /기능리스트.*\.xlsx$/u.test(fileName));
  const manualPdfName = manualFiles.find((fileName) => /사용자취급설명서.*\.pdf$/u.test(fileName));
  const checklistPdfName = manualFiles.find((fileName) => /check\s*list.*\.pdf$/iu.test(fileName));

  if (!featureWorkbookName || !manualPdfName || !checklistPdfName) {
    throw new Error('manual 폴더에서 기능리스트, 사용자 매뉴얼 PDF, 체크리스트 PDF를 모두 찾지 못했습니다.');
  }

  return {
    featureWorkbookName,
    manualPdfName,
    checklistPdfName,
    featureWorkbookPath: path.join(manualDir, featureWorkbookName),
    manualPdfPath: path.join(manualDir, manualPdfName),
    checklistPdfPath: path.join(manualDir, checklistPdfName),
  };
}

async function loadChecklistCases(checklistPdfPath, coverageByCaseId) {
  const buffer = await fs.readFile(checklistPdfPath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();

  let text = result.text.replace(/\r/g, '').replace(/\u00a0/g, ' ');
  text = text.slice(text.indexOf('eXemble_'));
  text = text.replace(/\s+(?=eXemble_[^\t\n]+?_\d{3})/gu, '\n');

  const rawBlocks = text
    .split(/\n(?=eXemble_[^\t\n]+?_\d{3})/gu)
    .map((block) => block.trim())
    .filter(Boolean);

  return rawBlocks
    .map(parseChecklistBlock)
    .filter(Boolean)
    .map((checklistCase) => {
      const inferred = inferChecklistTarget(checklistCase);
      const implementedSpecs = coverageByCaseId.get(checklistCase.caseId) ?? [];

      return {
        ...checklistCase,
        target: inferred.target,
        priority: inferred.priority,
        blockingReason: inferred.blockingReason,
        harnessStatus: classifyHarnessStatus(inferred.target, implementedSpecs),
        implementedSpecs,
      };
    });
}

function readFeatureRows(featureWorkbookPath) {
  const workbook = XLSX.readFile(featureWorkbookPath);
  const firstSheetName = workbook.SheetNames[0];
  const sourceSheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sourceSheet, {
    header: ['no', 'major', 'middle', 'minor', 'detail'],
    range: 1,
    defval: '',
  });

  return rows
    .filter((row) => typeof row.no === 'number' || /^\d+$/u.test(String(row.no).trim()))
    .map((row) => ({
      no: Number(row.no),
      major: normalizeToken(row.major),
      middle: normalizeToken(row.middle),
      minor: normalizeToken(row.minor),
      detail: normalizeToken(row.detail),
      featureName: normalizeToken(row.detail) || normalizeToken(row.minor),
    }));
}

function scoreChecklistCase(featureRow, checklistCase) {
  const featureText = normalizeMatchText(
    [featureRow.major, featureRow.middle, featureRow.minor, featureRow.detail, featureRow.featureName].join(' '),
  );
  const caseText = normalizeMatchText(
    [
      checklistCase.module,
      checklistCase.depth2,
      checklistCase.depth3,
      checklistCase.featureName,
      checklistCase.expectedResult,
    ].join(' '),
  );

  const featureTokens = new Set(featureText.split(' ').filter(Boolean));
  const caseTokens = new Set(caseText.split(' ').filter(Boolean));
  let score = 0;

  for (const token of featureTokens) {
    if (token.length <= 1) {
      continue;
    }
    if (caseTokens.has(token)) {
      score += 2;
    }
  }

  if (caseText.includes(featureText) || featureText.includes(caseText)) {
    score += 3;
  }

  if (normalizeMatchText(featureRow.featureName) === normalizeMatchText(checklistCase.featureName)) {
    score += 4;
  }

  return score;
}

function pickFeatureCases(featureRow, checklistCases) {
  const candidateModules = featureToChecklistModules.get(featureRow.major) ?? [featureRow.major];
  const scoredCases = checklistCases
    .filter((checklistCase) => candidateModules.includes(checklistCase.module))
    .map((checklistCase) => ({
      checklistCase,
      score: scoreChecklistCase(featureRow, checklistCase),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const topScore = scoredCases[0]?.score ?? 0;
  return scoredCases
    .filter((entry) => entry.score >= Math.max(2, topScore - 1))
    .slice(0, 3)
    .map((entry) => entry.checklistCase);
}

function pickTarget(checklistCases) {
  if (checklistCases.length === 0) {
    return 'deferred';
  }

  return checklistCases
    .map((checklistCase) => checklistCase.target)
    .sort((left, right) => targetPriority[left] - targetPriority[right])[0];
}

function pickPriority(checklistCases) {
  if (checklistCases.length === 0) {
    return 'P2';
  }

  return checklistCases
    .map((checklistCase) => checklistCase.priority)
    .sort((left, right) => priorityRank[left] - priorityRank[right])[0];
}

function summarizeSourceResults(checklistCases) {
  if (checklistCases.length === 0) {
    return 'not-mapped';
  }

  const counts = checklistCases.reduce((accumulator, checklistCase) => {
    accumulator[checklistCase.sourceResult] = (accumulator[checklistCase.sourceResult] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => `${name}=${count}`)
    .join(', ');
}

function mapFeatureRows(featureRows, checklistCases) {
  return featureRows.map((featureRow) => {
    const relatedCases = pickFeatureCases(featureRow, checklistCases);
    const relatedChecklistIds = relatedCases.map((checklistCase) => checklistCase.caseId);
    const mappedSpecs = [...new Set(relatedCases.flatMap((checklistCase) => checklistCase.implementedSpecs))];
    const notes = relatedCases.map(
      (checklistCase) => `${checklistCase.caseId}: ${checklistCase.depth2}/${checklistCase.depth3}/${checklistCase.featureName}`,
    );
    const blockingReasons = [...new Set(relatedCases.map((checklistCase) => checklistCase.blockingReason).filter(Boolean))];

    return {
      ...featureRow,
      relatedChecklistIds,
      target: pickTarget(relatedCases),
      priority: pickPriority(relatedCases),
      harnessStatus: classifyHarnessStatus(pickTarget(relatedCases), mappedSpecs),
      executionResult: summarizeSourceResults(relatedCases),
      blockingReason: blockingReasons.join(' / '),
      notes,
      mappedSpecs,
    };
  });
}

function groupCounts(rows, accessor) {
  return rows.reduce((accumulator, row) => {
    const key = accessor(row);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

async function walkFiles(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return walkFiles(fullPath);
      }

      return [fullPath];
    }),
  );

  return files.flat();
}

async function discoverSpecCoverage() {
  const coverageByCaseId = new Map();
  const caseIdPattern = /eXemble_[^"'`\r\n]+?_\d{3}/gu;
  const testFiles = (await walkFiles(testsDir)).filter((filePath) => filePath.endsWith('.ts'));

  for (const filePath of testFiles) {
    const contents = await fs.readFile(filePath, 'utf8');
    const matches = [...contents.matchAll(caseIdPattern)].map((match) => normalizeToken(match[0]));
    const uniqueMatches = [...new Set(matches)];

    for (const caseId of uniqueMatches) {
      const specList = coverageByCaseId.get(caseId) ?? [];
      specList.push(path.relative(rootDir, filePath));
      coverageByCaseId.set(caseId, specList);
    }
  }

  return coverageByCaseId;
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

function buildChecklistWorkbook(checklistCases) {
  return [
    [
      'TC-ID',
      'Depth 1',
      'Depth 2',
      'Depth 3',
      '기능명',
      'Pre-condition',
      'Process',
      'Expected Result',
      '1차 Result',
      '1차 이슈요약',
      '자동화 대상',
      '우선순위',
      '현재 하네스 상태',
      '매핑 Spec',
      '차단 사유',
      '수정/보완 메모',
    ],
    ...checklistCases.map((checklistCase) => [
      checklistCase.caseId,
      checklistCase.module,
      checklistCase.depth2,
      checklistCase.depth3,
      checklistCase.featureName,
      checklistCase.precondition,
      checklistCase.process,
      checklistCase.expectedResult,
      checklistCase.sourceResult,
      checklistCase.sourceIssueSummary,
      checklistCase.target,
      checklistCase.priority,
      checklistCase.harnessStatus,
      checklistCase.implementedSpecs.join('\n'),
      checklistCase.blockingReason,
      checklistCase.sourceIssueSummary,
    ]),
  ];
}

function buildFeatureWorkbook(featureRows) {
  return [
    [
      '번호',
      '대분류',
      '중분류',
      '소분류',
      '상세분류',
      '관련 TC-ID',
      '자동화 대상',
      '우선순위',
      '현재 하네스 상태',
      '실행 결과',
      '매핑 Spec',
      '차단 사유',
      '수정/보완 메모',
    ],
    ...featureRows.map((featureRow) => [
      featureRow.no,
      featureRow.major,
      featureRow.middle,
      featureRow.minor,
      featureRow.detail,
      featureRow.relatedChecklistIds.join('\n'),
      featureRow.target,
      featureRow.priority,
      featureRow.harnessStatus,
      featureRow.executionResult,
      featureRow.mappedSpecs.join('\n'),
      featureRow.blockingReason,
      featureRow.notes.join(' / '),
    ]),
  ];
}

async function writeWorkbook(filePath, sheetName, rows, columnWidths) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols'] = columnWidths.map((width) => ({ wch: width }));
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  XLSX.writeFile(workbook, filePath);
}

async function main() {
  await fs.mkdir(workspaceDir, { recursive: true });

  const sources = await resolveSourceFiles();
  const coverageByCaseId = await discoverSpecCoverage();
  const checklistCases = await loadChecklistCases(sources.checklistPdfPath, coverageByCaseId);
  const featureRows = mapFeatureRows(readFeatureRows(sources.featureWorkbookPath), checklistCases);

  const checklistWorkbookPath = path.join(workspaceDir, `${path.parse(sources.checklistPdfName).name}.work.xlsx`);
  const featureWorkbookPath = path.join(workspaceDir, `${path.parse(sources.featureWorkbookName).name}.work.xlsx`);

  await writeWorkbook(
    checklistWorkbookPath,
    '체크리스트',
    buildChecklistWorkbook(checklistCases),
    [28, 18, 18, 18, 34, 30, 38, 30, 12, 42, 14, 10, 16, 34, 38, 42],
  );
  await writeWorkbook(
    featureWorkbookPath,
    '기능리스트',
    buildFeatureWorkbook(featureRows),
    [8, 14, 18, 28, 28, 28, 14, 10, 16, 14, 28, 40, 48],
  );

  const countsByTarget = groupCounts(checklistCases, (row) => row.target);
  const countsByPriority = groupCounts(checklistCases, (row) => row.priority);
  const countsByHarnessStatus = groupCounts(checklistCases, (row) => row.harnessStatus);
  const countsBySourceResult = groupCounts(checklistCases, (row) => row.sourceResult);

  const implementedCases = checklistCases.filter((row) => row.implementedSpecs.length > 0);
  const plannedAutoCases = checklistCases.filter((row) => row.target === 'auto' && row.implementedSpecs.length === 0);
  const excludedCases = checklistCases.filter((row) => row.target !== 'auto');
  const observedFailures = checklistCases.filter((row) => row.sourceResult === 'Fail');

  const catalog = {
    source: {
      baseUrl: 'https://10.10.34.114',
      manualPdf: `manual/${sources.manualPdfName}`,
      featureListWorkbook: `manual/${sources.featureWorkbookName}`,
      checklistPdf: `manual/${sources.checklistPdfName}`,
    },
    manualModules,
    summary: {
      totalChecklistCases: checklistCases.length,
      totalFeatureRows: featureRows.length,
      countsByTarget,
      countsByPriority,
      countsByHarnessStatus,
      countsBySourceResult,
    },
    checklistCases,
    featureRows,
  };

  await fs.writeFile(outputCatalogPath, JSON.stringify(catalog, null, 2), 'utf8');

  await fs.writeFile(
    inputSummaryPath,
    [
      '# Input Summary',
      '',
      '- Base URL: `https://10.10.34.114`',
      `- Primary checklist: \`manual/${sources.checklistPdfName}\``,
      `- Supporting feature list: \`manual/${sources.featureWorkbookName}\``,
      `- Supporting user manual: \`manual/${sources.manualPdfName}\``,
      '- The checklist PDF is now treated as the primary source of truth for TC-ID, expected result, and prior issue notes.',
      '- The feature list workbook is preserved and expanded as a mapping sheet from 기능 항목 to checklist TC-ID.',
      '- Confirmed login surface: general login is available, SSO button is disabled, and certificate bypass is required.',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    moduleMapPath,
    [
      '# Manual Module Map',
      '',
      toMarkdownTable(manualModules, [
        { label: '사용자 매뉴얼 모듈', value: (row) => row.name },
        { label: 'TOC 기준', value: (row) => row.toc },
        { label: '체크리스트 모듈', value: (row) => row.checklistModule },
        { label: '기능리스트 대분류', value: (row) => row.featureMajors.join(', ') },
      ]),
      '',
      '## 메모',
      '',
      '- `채팅` 대분류는 사용자 매뉴얼의 사용자 화면과 체크리스트의 `사용자 질의` 모듈로 묶었습니다.',
      '- `공통 기능`은 체크리스트 기준으로 `환경설정`과 `시스템` 항목에 걸쳐 있어 케이스 단위로 다시 분류했습니다.',
      '- `권한` 대분류 안의 로그인/로그아웃 기능은 체크리스트에서 `사용자 로그인`과 `환경설정`으로 분리되어 관리됩니다.',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    catalogMarkdownPath,
    [
      '# Checklist Test Catalog',
      '',
      `- Total checklist cases: **${checklistCases.length}**`,
      `- Total feature rows: **${featureRows.length}**`,
      `- Target counts: ${Object.entries(countsByTarget)
        .map(([key, value]) => `\`${key}\`=${value}`)
        .join(', ')}`,
      `- Priority counts: ${Object.entries(countsByPriority)
        .map(([key, value]) => `\`${key}\`=${value}`)
        .join(', ')}`,
      `- Harness status: ${Object.entries(countsByHarnessStatus)
        .map(([key, value]) => `\`${key}\`=${value}`)
        .join(', ')}`,
      `- Source checklist result: ${Object.entries(countsBySourceResult)
        .map(([key, value]) => `\`${key}\`=${value}`)
        .join(', ')}`,
      '',
      '## 현재 스펙에 연결된 체크리스트 케이스',
      '',
      toMarkdownTable(implementedCases, [
        { label: 'TC-ID', value: (row) => row.caseId },
        { label: '모듈', value: (row) => row.module },
        { label: '기능명', value: (row) => row.featureName },
        { label: '우선순위', value: (row) => row.priority },
        { label: '매핑 Spec', value: (row) => row.implementedSpecs.join(', ') },
      ]),
      '',
      '## 자동화 예정 P0/P1 케이스',
      '',
      toMarkdownTable(plannedAutoCases.slice(0, 40), [
        { label: 'TC-ID', value: (row) => row.caseId },
        { label: '모듈', value: (row) => row.module },
        { label: '기능명', value: (row) => row.featureName },
        { label: '우선순위', value: (row) => row.priority },
        { label: '차단 사유', value: (row) => row.blockingReason || '-' },
      ]),
      '',
      '## 원본 체크리스트에서 Fail 로 기록된 항목',
      '',
      toMarkdownTable(observedFailures, [
        { label: 'TC-ID', value: (row) => row.caseId },
        { label: '모듈', value: (row) => row.module },
        { label: '기능명', value: (row) => row.featureName },
        { label: '원본 이슈', value: (row) => row.sourceIssueSummary || '-' },
        { label: '자동화 대상', value: (row) => row.target },
      ]),
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    excludedCasesPath,
    [
      '# Excluded / Blocked Cases',
      '',
      toMarkdownTable(excludedCases, [
        { label: 'TC-ID', value: (row) => row.caseId },
        { label: '모듈', value: (row) => row.module },
        { label: '기능명', value: (row) => row.featureName },
        { label: '자동화 대상', value: (row) => row.target },
        { label: '우선순위', value: (row) => row.priority },
        { label: '차단 사유', value: (row) => row.blockingReason || '-' },
      ]),
    ].join('\n'),
    'utf8',
  );

  const hasExecutionReport = await fs
    .access(executionReportPath)
    .then(() => true)
    .catch(() => false);

  if (!hasExecutionReport) {
    await fs.writeFile(
      executionReportPath,
      [
        '# Execution Report',
        '',
        '- Status: checklist-aligned scaffolded',
        '- The harness is now keyed by TC-ID from the GS certification checklist PDF.',
        '- Authenticated scenarios require `EXEMBLE_USERNAME` and `EXEMBLE_PASSWORD`.',
        '- Security header checks can run without credentials.',
        '- Write/destructive flows stay `manual` or `blocked` until a dedicated test account and disposable data set are confirmed.',
      ].join('\n'),
      'utf8',
    );
  }

  console.log(
    JSON.stringify(
      {
        workspaceDir,
        checklistWorkbookPath,
        featureWorkbookPath,
        outputCatalogPath,
        totalChecklistCases: checklistCases.length,
        countsByTarget,
        countsByHarnessStatus,
      },
      null,
      2,
    ),
  );
}

await main();
