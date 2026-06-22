import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspaceDir = path.join(rootDir, '_workspace');
const manualDir = path.join(rootDir, 'manual');
const catalogPath = path.join(workspaceDir, 'test-catalog.json');
const outputJsonPath = path.join(workspaceDir, '12_input_range_matrix.json');
const outputMarkdownPath = path.join(workspaceDir, '12_input_range_matrix.md');

const automationOverrides = new Map([
  ['eXemble_사용자 로그인_001', { status: 'auto-ready', spec: 'tests/regression/input-range.regression.spec.ts', note: '로그인 입력창 길이와 인증 경계값 검증 가능' }],
  ['eXemble_사용자 로그인_004', { status: 'auto-ready', spec: 'tests/regression/input-range.regression.spec.ts', note: '로그인 화면에서 음수 길이 검증 가능' }],
  ['eXemble_사용자 로그인_005', { status: 'auto-ready', spec: 'tests/regression/input-range.regression.spec.ts', note: '로그인 화면에서 음수 길이 검증 가능' }],
  ['eXemble_사용자 질의_005', { status: 'auto-ready', spec: 'tests/regression/input-range.regression.spec.ts', note: '채팅 입력창에서 저장 없이 길이 검증 가능' }],
  ['eXemble_AI서비스_004', { status: 'auto-ready', spec: 'tests/regression/input-search-limits.regression.spec.ts', note: 'AI 에이전트 목록 검색창 길이 검증 가능' }],
  ['eXemble_AI서비스_036', { status: 'auto-ready', spec: 'tests/regression/input-search-limits.regression.spec.ts', note: 'AI 서비스 목록 검색창 길이 검증 가능' }],
  ['eXemble_데이터_002', { status: 'auto-ready', spec: 'tests/regression/input-search-limits.regression.spec.ts', note: '데이터 목록 검색창 길이 검증 가능' }],
  ['eXemble_모델_003', { status: 'auto-ready', spec: 'tests/regression/input-search-limits.regression.spec.ts', note: '모델 목록 검색창 길이 검증 가능' }],
  ['eXemble_도구_003', { status: 'auto-ready', spec: 'tests/regression/input-search-limits.regression.spec.ts', note: '도구 목록 검색창 길이 검증 가능' }],
  ['eXemble_권한_002', { status: 'auto-ready', spec: 'tests/regression/input-search-limits.regression.spec.ts', note: '계정 관리 검색창 길이 검증 가능' }],
  ['eXemble_AI서비스_005', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '에이전트 생성 화면에서 저장 없이 기본 속성 길이 검증 가능' }],
  ['eXemble_AI서비스_008', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '에이전트 생성 화면에서 프롬프트 길이 검증 가능' }],
  ['eXemble_AI서비스_009', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '에이전트 생성 화면에서 숫자 길이 검증 가능' }],
  ['eXemble_AI서비스_010', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '에이전트 생성 화면에서 테스트 채팅 길이 검증 가능' }],
  ['eXemble_AI서비스_038', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '서비스 생성 화면에서 저장 없이 기본정보 길이 검증 가능' }],
  ['eXemble_도구_005', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '도구 생성 화면에서 엔드포인트 길이 검증 가능' }],
  ['eXemble_도구_006', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '도구 생성 화면에서 헤더 길이 검증 가능' }],
  ['eXemble_도구_007', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '도구 생성 화면에서 Path 파라미터 길이 검증 가능' }],
  ['eXemble_도구_008', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '도구 생성 화면에서 Query 파라미터 길이 검증 가능' }],
  ['eXemble_도구_009', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '도구 생성 화면에서 요청 본문 길이 검증 가능' }],
  ['eXemble_권한_005', { status: 'auto-ready', spec: 'tests/regression/input-form-limits.regression.spec.ts', note: '계정 등록 팝업에서 저장 없이 길이 검증 가능' }],
  ['eXemble_데이터_011', { status: 'auto-with-test-data', spec: 'tests/regression/input-upload-limits.regression.spec.ts', note: '11개 이상 파일 샘플 세트 필요' }],
  ['eXemble_데이터_012', { status: 'auto-with-test-data', spec: 'tests/regression/input-upload-limits.regression.spec.ts', note: '100MB 초과 샘플 파일 필요' }],
  ['eXemble_시스템_009', { status: 'auto-with-test-data', spec: 'tests/regression/input-upload-formats.regression.spec.ts', note: '허용 일반 파일 형식 샘플 필요' }],
  ['eXemble_시스템_010', { status: 'auto-with-test-data', spec: 'tests/regression/input-upload-formats.regression.spec.ts', note: '허용 이미지 파일 형식 샘플 필요' }],
  ['eXemble_시스템_011', { status: 'auto-with-test-data', spec: 'tests/regression/input-upload-formats.regression.spec.ts', note: '허용 문서 파일 형식 샘플 필요' }],
  ['eXemble_시스템_012', { status: 'auto-with-test-data', spec: 'tests/regression/input-upload-formats.regression.spec.ts', note: '허용 음성/비디오 파일 형식 샘플 필요' }],
  ['eXemble_시스템_004', { status: 'blocked', spec: '-', note: '동시 첨부 검증용 다수 파일과 환경 제어 필요' }],
]);

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, '\n')
    .replace(/\u00a0/g, ' ')
    .trim();
}

function normalizeInlineWhitespace(value) {
  return normalizeText(value).replace(/\s+/g, ' ').trim();
}

function compactText(value) {
  return normalizeInlineWhitespace(value).replace(/\s+/g, '');
}

function splitFieldNames(raw) {
  return raw
    .split('/')
    .map((field) => field.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function cleanFieldName(field) {
  return field
    .replace(/\t+/g, ' ')
    .replace(/^(질의창에|검색창에|검색어를|현재|새로운)\s*/u, '')
    .replace(/\s*입력$/u, '')
    .replace(/\s*클릭$/u, '')
    .replace(/[|]/g, ' ')
    .replace(/[\/,]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeManualFieldName(field) {
  const normalized = cleanFieldName(field)
    .replace(/영문(?:자)?\s*숫자(?:\s*특수문자)?\s*포함/gu, '')
    .replace(/\s*자$/u, '')
    .trim();

  if (!normalized) {
    return normalized;
  }

  if (/^아이디/u.test(normalized)) {
    return '아이디';
  }

  if (/^새\s*비밀번호/u.test(normalized)) {
    return '새 비밀번호';
  }

  if (/^(현재\s*)?비밀번호/u.test(normalized)) {
    return '비밀번호';
  }

  if (/^에이전트\s*명/u.test(normalized)) {
    return '에이전트명';
  }

  if (/^에이전트\s*설명/u.test(normalized)) {
    return '에이전트 설명';
  }

  if (/^사용자\s*설명/u.test(normalized)) {
    return '사용자설명';
  }

  if (/^식별\s*설명/u.test(normalized)) {
    return '식별 설명';
  }

  if (/^질의\s*내용/u.test(normalized)) {
    return '질의내용';
  }

  if (/^파라미터\s*온도/u.test(normalized)) {
    return '파라미터 온도';
  }

  if (/^(파라미터\s*)?최대\s*토큰\s*수/u.test(normalized)) {
    return '파라미터 최대 토큰 수';
  }

  if (/^테스트\s*채팅/u.test(normalized)) {
    return '테스트 채팅';
  }

  if (/^유형\s*본문/u.test(normalized)) {
    return '유형본문';
  }

  return normalized;
}

function matchesAny(value, patterns) {
  return patterns.some((pattern) => pattern.test(value));
}

function pushRule(results, caseRow, field, limitKind, min, max, unit, qualifiers, sourceText, source, sourceContext = '') {
  results.push({
    caseId: caseRow.caseId,
    module: caseRow.module,
    featureName: caseRow.featureName,
    field: cleanFieldName(field),
    limitKind,
    min,
    max,
    unit,
    qualifiers: qualifiers || '',
    sourceText: sourceText.trim(),
    sourceIssueSummary: normalizeText(caseRow.sourceIssueSummary),
    source,
    sourceContext,
  });
}

function extractFromSegment(caseRow, segment, results) {
  const sharedPattern = /^(.+?)\s*입력\((?:최대\s*)?(\d+)\s*(MB|개|자)\)$/u;
  const rangePattern = /^(.+?)\s*입력\((\d+)\s*~\s*(\d+)\s*(MB|개|자)(?:,\s*([^)]+))?\)$/u;
  const maxPattern = /^(.+?)\s*입력\((?:최대\s*)?(\d+)\s*(MB|개|자)(?:,\s*([^)]+))?\)$/u;

  const sharedMatch = segment.match(sharedPattern);
  if (sharedMatch) {
    const [, fieldsRaw, max, unit] = sharedMatch;
    for (const field of splitFieldNames(fieldsRaw)) {
      pushRule(results, caseRow, field, 'max', null, Number(max), unit, '', segment, 'checklist');
    }
    return;
  }

  const rangeMatch = segment.match(rangePattern);
  if (rangeMatch) {
    const [, field, min, max, unit, qualifiers = ''] = rangeMatch;
    pushRule(results, caseRow, field, 'range', Number(min), Number(max), unit, qualifiers, segment, 'checklist');
    return;
  }

  const maxMatch = segment.match(maxPattern);
  if (maxMatch) {
    const [, field, max, unit, qualifiers = ''] = maxMatch;
    pushRule(results, caseRow, field, 'max', null, Number(max), unit, qualifiers, segment, 'checklist');
    return;
  }

  const inlineParts = segment
    .replace(/\s*입력$/u, '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);

  let matchedInline = false;
  for (const part of inlineParts) {
    const inlineRange = part.match(/^(.+?)\((\d+)\s*~\s*(\d+)\s*(MB|개|자)(?:,\s*([^)]+))?\)$/u);
    if (inlineRange) {
      const [, field, min, max, unit, qualifiers = ''] = inlineRange;
      pushRule(results, caseRow, field, 'range', Number(min), Number(max), unit, qualifiers, segment, 'checklist');
      matchedInline = true;
      continue;
    }

    const inlineMax = part.match(/^(.+?)\((?:최대\s*)?(\d+)\s*(MB|개|자)(?:,\s*([^)]+))?\)$/u);
    if (inlineMax) {
      const [, field, max, unit, qualifiers = ''] = inlineMax;
      pushRule(results, caseRow, field, 'max', null, Number(max), unit, qualifiers, segment, 'checklist');
      matchedInline = true;
    }
  }

  if (matchedInline) {
    return;
  }

  const fileCountMatch = segment.match(/(\d+)개\s*(?:이상|초과)\s*파일\s*(업로드|첨부)\s*시도/u);
  if (fileCountMatch) {
    const [, overValue, action] = fileCountMatch;
    pushRule(
      results,
      caseRow,
      action === '첨부' ? '첨부 파일 수' : '업로드 파일 수',
      'max',
      null,
      Number(overValue) - 1,
      '개',
      '',
      segment,
      'checklist',
    );
    return;
  }

  const fileSizeMatch = segment.match(/(\d+)MB\s*초과\s*파일\s*업로드\s*시도/u);
  if (fileSizeMatch) {
    const [, maxValue] = fileSizeMatch;
    pushRule(results, caseRow, '업로드 파일 용량', 'max', null, Number(maxValue), 'MB', '', segment, 'checklist');
    return;
  }

  const concurrentMatch = segment.match(/(\d+)명\s*이상\s*동시\s*접속\s*시도/u);
  if (concurrentMatch) {
    const [, maxValue] = concurrentMatch;
    pushRule(results, caseRow, '동시 접속 사용자', 'max', null, Number(maxValue), '명', '', segment, 'checklist');
  }
}

function extractChecklistRules(caseRow) {
  const results = [];
  const processText = normalizeText(caseRow.process);
  if (!processText) {
    return results;
  }

  const segments = processText
    .split('\n')
    .map((segment) => segment.replace(/^\d+\.\s*/u, '').trim())
    .filter(Boolean);

  for (const segment of segments) {
    extractFromSegment(caseRow, segment, results);
  }

  return results;
}

async function resolveManualPdfPath() {
  const manualFiles = await fs.readdir(manualDir);
  const manualPdfName = manualFiles.find((fileName) => fileName.toLowerCase().endsWith('.pdf') && !/check\s*list/iu.test(fileName));
  if (!manualPdfName) {
    throw new Error('manual 폴더에서 사용자 매뉴얼 PDF를 찾지 못했습니다.');
  }

  return path.join(manualDir, manualPdfName);
}

function createCaseStub(caseId, module, featureName) {
  return {
    caseId,
    module,
    featureName,
    sourceIssueSummary: '',
  };
}

function matchManualPdfContext(contextText, rowText) {
  const compactContextText = compactText(contextText);
  const normalizedRowText = normalizeInlineWhitespace(rowText);

  if (/^\s*일반\s+/u.test(normalizedRowText)) {
    return createCaseStub('eXemble_시스템_009', '시스템', '일반 파일 형식');
  }

  if (/^\s*이미지\s+/u.test(normalizedRowText)) {
    return createCaseStub('eXemble_시스템_010', '시스템', '이미지 파일 형식');
  }

  if (/^\s*문서\s+/u.test(normalizedRowText)) {
    return createCaseStub('eXemble_시스템_011', '시스템', '문서 파일 형식');
  }

  if (/^\s*음성 및 비디오\s+/u.test(normalizedRowText)) {
    return createCaseStub('eXemble_시스템_012', '시스템', '음성/비디오 파일 형식');
  }

  if (
    /비밀번호변경/u.test(compactContextText) &&
    matchesAny(normalizedRowText, [/^비밀번호/u, /^새\s*비밀번호/u, /^현재\s*비밀번호/u])
  ) {
    return createCaseStub('eXemble_환경설정_003', '환경설정', '비밀번호 변경');
  }

  if (
    /서비스편집/u.test(compactContextText) &&
    matchesAny(normalizedRowText, [/^이름/u, /^사용자\s*설명/u, /^식별\s*설명/u])
  ) {
    return createCaseStub('eXemble_AI서비스_057', 'AI서비스', '서비스 정보 편집');
  }

  if (/도구생성/u.test(compactContextText) && /요청테스트/u.test(compactContextText) && /^유형\s*본문/u.test(normalizedRowText)) {
    return createCaseStub('eXemble_도구_011', '도구', '테스트 실행');
  }

  if (/질의하기/u.test(compactContextText) && /^(질의\s*내용|내용)/u.test(normalizedRowText)) {
    return createCaseStub('eXemble_사용자 질의_005', '사용자 질의', '질의 입력');
  }

  if (/에이전트생성/u.test(compactContextText)) {
    if (matchesAny(normalizedRowText, [/^에이전트\s*명/u, /^에이전트\s*설명/u])) {
      return createCaseStub('eXemble_AI서비스_005', 'AI서비스', '에이전트 생성-기본속성');
    }

    return null;
  }

  if (
    /서비스생성/u.test(compactContextText) &&
    matchesAny(normalizedRowText, [/^이름/u, /^사용자\s*설명/u, /^식별\s*설명/u, /^설명/u])
  ) {
    return createCaseStub('eXemble_AI서비스_038', 'AI서비스', '기본정보 입력');
  }

  if (/계정등록/u.test(compactContextText) && matchesAny(normalizedRowText, [/^이름/u, /^이메일/u, /^비밀번호/u])) {
    return createCaseStub('eXemble_권한_005', '권한', '기본정보 입력');
  }

  return null;
}

function parseManualPdfFieldRule(caseRow, rowText, contextText) {
  const rules = [];
  const qualifierMatch = rowText.match(/영문(?:자)?\s*숫자\s*특수문자\s*포함/u);
  const qualifier = qualifierMatch ? '영문/숫자/특수문자 포함' : '';

  const rangeMatch = rowText.match(/^(.*?)\s+(\d+)\s*~\s*(\d+)\s*$/u);
  if (rangeMatch) {
    const [, rawField, min, max] = rangeMatch;
    const field = normalizeManualFieldName(rawField);
    pushRule(rules, caseRow, field, 'range', Number(min), Number(max), '자', qualifier, rowText, 'manual-pdf', contextText);
    return rules;
  }

  const maxMbMatch = rowText.match(/^(.*?)\s+(\d+)\s*MB$/iu);
  if (maxMbMatch && !/\.[a-z0-9]/iu.test(maxMbMatch[1])) {
    const [, rawField, max] = maxMbMatch;
    const field = normalizeManualFieldName(rawField);
    pushRule(rules, caseRow, field, 'max', null, Number(max), 'MB', qualifier, rowText, 'manual-pdf', contextText);
    return rules;
  }

  const maxCharMatch = rowText.match(/^(.*?)\s+(\d+)\s*$/u);
  if (maxCharMatch && /\s자\s/u.test(rowText)) {
    const [, rawField, max] = maxCharMatch;
    const field = normalizeManualFieldName(rawField);
    pushRule(rules, caseRow, field, 'max', null, Number(max), '자', qualifier, rowText, 'manual-pdf', contextText);
    return rules;
  }

  return rules;
}

function parseManualPdfUploadRule(caseRow, rowText, contextText) {
  const rules = [];
  const extensions = [...rowText.matchAll(/\.[a-z0-9]+/giu)].map((match) => match[0].toLowerCase());
  const sizeMatch = rowText.match(/(\d+)\s*MB/iu);

  if (extensions.length > 0) {
    pushRule(
      rules,
      caseRow,
      '허용 확장자',
      'allowed-file-types',
      null,
      null,
      '',
      extensions.join(', '),
      rowText,
      'manual-pdf',
      contextText,
    );
  }

  if (sizeMatch) {
    pushRule(
      rules,
      caseRow,
      '업로드 파일 용량',
      'max',
      null,
      Number(sizeMatch[1]),
      'MB',
      '',
      rowText,
      'manual-pdf',
      contextText,
    );
  }

  return rules;
}

async function extractManualPdfSupplementRules() {
  const manualPdfPath = await resolveManualPdfPath();
  const data = await fs.readFile(manualPdfPath);
  const parser = new PDFParse({ data });
  const parsed = await parser.getText();
  const text = typeof parsed === 'string' ? parsed : (parsed.text || '');
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rules = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/입력필드\s*명/u.test(line)) {
      const contextLines = lines.slice(Math.max(0, index - 12), index);
      const contextText = contextLines.join(' ');

      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        const rowText = lines[cursor];
        if (/^제약사항/u.test(rowText) || /^--\s*\d+/u.test(rowText) || /입력필드\s*명/u.test(rowText)) {
          break;
        }

        const caseRow = matchManualPdfContext(contextText, rowText);
        if (!caseRow) {
          continue;
        }

        rules.push(...parseManualPdfFieldRule(caseRow, rowText, contextText));
      }
    }

    if (/^구분\s+확장자\s+크기/u.test(line)) {
      const contextLines = lines.slice(Math.max(0, index - 4), index + 1);
      const contextText = contextLines.join(' ');

      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        let rowText = lines[cursor];
        if (/^제품의 기타 정보/u.test(rowText) || /^--\s*\d+/u.test(rowText)) {
          break;
        }

        if (/^\s*문서\s+/u.test(rowText) && !/MB/iu.test(rowText) && lines[cursor + 1]) {
          rowText = `${rowText} ${lines[cursor + 1]}`.replace(/\s+/g, ' ').trim();
          cursor += 1;
        }

        const caseRow = matchManualPdfContext(contextText, rowText);
        if (!caseRow) {
          continue;
        }

        rules.push(...parseManualPdfUploadRule(caseRow, rowText, contextText));
      }
    }
  }

  await parser.destroy();
  return rules;
}

function classifyRule(rule, caseById) {
  const override = automationOverrides.get(rule.caseId);
  if (override) {
    return override;
  }

  const caseRow = caseById.get(rule.caseId);
  if (rule.limitKind === 'allowed-file-types' || rule.unit === 'MB') {
    return {
      status: 'auto-with-test-data',
      spec: 'tests/regression/input-upload-formats.regression.spec.ts',
      note: '샘플 파일이 준비되면 업로드 허용 형식/용량 검증 가능',
    };
  }

  if (caseRow?.target === 'manual') {
    return {
      status: 'manual',
      spec: '-',
      note: caseRow.blockingReason || '실데이터 변경 또는 계정 상태 변경이 발생할 수 있어 수동 검증으로 둡니다.',
    };
  }

  if (caseRow?.target === 'blocked') {
    return {
      status: 'blocked',
      spec: '-',
      note: caseRow.blockingReason || '환경 또는 계정 제약으로 차단된 항목입니다.',
    };
  }

  if (caseRow?.target === 'deferred') {
    return {
      status: 'deferred',
      spec: '-',
      note: caseRow.blockingReason || '추가 데이터나 상세 UI 계약이 필요한 항목입니다.',
    };
  }

  return {
    status: 'manual',
    spec: '-',
    note: '현재 하네스에선 안전한 무상태 검증 경로를 아직 확보하지 못했습니다.',
  };
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

function compareRules(a, b) {
  return (
    a.module.localeCompare(b.module, 'ko') ||
    a.caseId.localeCompare(b.caseId, 'en') ||
    a.field.localeCompare(b.field, 'ko') ||
    a.ruleText.localeCompare(b.ruleText, 'ko')
  );
}

function dedupeRules(rules) {
  const seen = new Set();
  const result = [];

  for (const rule of rules) {
    const key = [
      rule.caseId,
      rule.featureName,
      rule.field,
      rule.limitKind,
      rule.min ?? '',
      rule.max ?? '',
      rule.unit,
      rule.qualifiers,
    ].join('|');

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(rule);
  }

  return result;
}

const raw = await fs.readFile(catalogPath, 'utf8');
const catalog = JSON.parse(raw);
const caseById = new Map((catalog.checklistCases || []).map((row) => [row.caseId, row]));

const checklistRules = (catalog.checklistCases || []).flatMap((caseRow) => extractChecklistRules(caseRow));
const manualPdfRules = await extractManualPdfSupplementRules();

const rules = dedupeRules([...checklistRules, ...manualPdfRules])
  .map((rule, index) => {
    const automation = classifyRule(rule, caseById);
    return {
      no: index + 1,
      ...rule,
      ruleText: renderRuleText(rule),
      automationStatus: automation.status,
      specPath: automation.spec,
      automationNote: automation.note,
    };
  })
  .sort(compareRules)
  .map((rule, index) => ({ ...rule, no: index + 1 }));

const summary = rules.reduce(
  (accumulator, rule) => {
    accumulator.total += 1;
    accumulator.byStatus[rule.automationStatus] = (accumulator.byStatus[rule.automationStatus] || 0) + 1;
    accumulator.bySource[rule.source] = (accumulator.bySource[rule.source] || 0) + 1;
    return accumulator;
  },
  { total: 0, byStatus: {}, bySource: {} },
);

const markdownLines = [
  '# Input Range Matrix',
  '',
  '- Source: `manual/` documents -> `_workspace/test-catalog.json` + manual PDF input tables',
  `- Total extracted field rules: **${summary.total}**`,
  `- auto-ready: **${summary.byStatus['auto-ready'] || 0}**`,
  `- auto-with-test-data: **${summary.byStatus['auto-with-test-data'] || 0}**`,
  `- manual: **${summary.byStatus.manual || 0}**`,
  `- deferred: **${summary.byStatus.deferred || 0}**`,
  `- blocked: **${summary.byStatus.blocked || 0}**`,
  `- checklist-derived: **${summary.bySource.checklist || 0}**`,
  `- manual-pdf supplement: **${summary.bySource['manual-pdf'] || 0}**`,
  '',
  '| No | TC-ID | 모듈 | 기능 | 입력 필드 | 규칙 | 분류 | Spec | Source | 비고 |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rules.map((rule) =>
    `| ${rule.no} | ${rule.caseId} | ${rule.module} | ${rule.featureName} | ${rule.field} | ${rule.ruleText} | ${rule.automationStatus} | ${rule.specPath} | ${rule.source} | ${rule.automationNote}${rule.sourceIssueSummary ? `<br>${rule.sourceIssueSummary}` : ''} |`,
  ),
];

await fs.writeFile(
  outputJsonPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: 'manual -> test-catalog.json + manual-pdf supplement',
      summary,
      rules,
    },
    null,
    2,
  ),
  'utf8',
);

await fs.writeFile(outputMarkdownPath, `${markdownLines.join('\n')}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      outputJsonPath: path.relative(rootDir, outputJsonPath),
      outputMarkdownPath: path.relative(rootDir, outputMarkdownPath),
      summary,
    },
    null,
    2,
  ),
);
