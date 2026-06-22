import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type JsonRecord = Record<string, unknown>;

export type DataVectorTableFixture = {
  name?: string;
  detailOpenOnly?: boolean;
  expectedType?: string;
  expectedPolicyMode?: string;
  expectedFileCountMin?: number;
  expectedHistoryCountMin?: number;
};

export type DataDatabaseFixture = {
  name?: string;
  lenientValidation?: boolean;
  usedForCaseIds?: string[];
  expectedConnectionState?: string;
  expectedStateLabels?: string[];
  expectedBasicInfoLabels?: string[];
  expectedCatalogSamples?: string[];
  expectedSchemaSamples?: string[];
  vectorTables?: DataVectorTableFixture[];
};

export type DataFixtureDefinitions = {
  databases: DataDatabaseFixture[];
};

export type ToolExecutionExpected = {
  statusCode?: number;
  successIfAnyResponse?: boolean;
  successMarkers?: string[];
  failureMarkers?: string[];
};

export type ToolExecutionFixture = {
  caseId?: string;
  useExistingRegisteredTool?: boolean;
  registeredToolDisplayName?: string;
  toolName?: string;
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  payload?: JsonRecord;
  expected?: ToolExecutionExpected;
};

export type ToolFixtureDefinitions = {
  tools: ToolExecutionFixture[];
};

export type ChatCaseExpected = {
  genericResponseOk?: boolean;
  mustContainAny?: string[];
  mustNotContainAny?: string[];
  attachmentRequired?: boolean;
  attachmentFileNames?: string[];
  evidenceRequired?: boolean;
  evidenceLabels?: string[];
  detailOpenRequired?: boolean;
  fallbackMessage?: string;
};

export type ChatCaseFixture = {
  caseId?: string;
  title?: string;
  serviceName?: string;
  question?: string;
  expected?: ChatCaseExpected;
};

export type ChatFixtureDefinitions = {
  cases: ChatCaseFixture[];
};

export type SecurityPasswordPolicy = {
  caseId?: string;
  minLength?: number;
  maxLength?: number;
  requiredCharacterClasses?: string[];
  forbiddenPatterns?: string[];
  forbiddenSamples?: string[];
  allowedSamples?: string[];
};

export type SecurityDisposableAccount = {
  purpose?: string;
  username?: string;
  displayName?: string;
  role?: string;
  organization?: string;
  position?: string;
  notes?: string;
};

export type SecurityPolicyDefinitions = {
  passwordPolicy?: SecurityPasswordPolicy;
  disposableAccounts?: SecurityDisposableAccount[];
};

export type AiServiceMutationState = 'active' | 'inactive';

export type AiServiceIconSelectionFixture = {
  caseId?: string;
  serviceName?: string;
  allowedIconLabels?: string[];
  selectionOnlyOk?: boolean;
  saveRequired?: boolean;
  expectedPreviewMarkers?: string[];
};

export type AiServiceActivationFixture = {
  caseId?: string;
  serviceName?: string;
  startState?: AiServiceMutationState;
  restoreState?: AiServiceMutationState;
  disposable?: boolean;
};

export type AiServiceFixtureDefinitions = {
  iconSelection?: AiServiceIconSelectionFixture;
  activationTargets?: AiServiceActivationFixture[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const automationDefinitionsDir = path.resolve(__dirname, '..', '_workspace', 'automation-definitions');

let dataDefinitionsCache: DataFixtureDefinitions | null = null;
let toolDefinitionsCache: ToolFixtureDefinitions | null = null;
let chatDefinitionsCache: ChatFixtureDefinitions | null = null;
let securityDefinitionsCache: SecurityPolicyDefinitions | null = null;
let aiServiceDefinitionsCache: AiServiceFixtureDefinitions | null = null;

function readJsonFile<T>(filename: string): T {
  const filePath = path.join(automationDefinitionsDir, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => String(entry ?? '').trim())
    .filter(Boolean);
}

function normalizeToolPayload(value: unknown): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as JsonRecord;
}

function normalizeDataDefinitions(raw: DataFixtureDefinitions): DataFixtureDefinitions {
  return {
    databases: Array.isArray(raw.databases)
      ? raw.databases.map((database) => ({
          name: database.name?.trim() || undefined,
          lenientValidation: Boolean(database.lenientValidation),
          usedForCaseIds: normalizeList(database.usedForCaseIds),
          expectedConnectionState: database.expectedConnectionState?.trim() || undefined,
          expectedStateLabels: normalizeList(database.expectedStateLabels),
          expectedBasicInfoLabels: normalizeList(database.expectedBasicInfoLabels),
          expectedCatalogSamples: normalizeList(database.expectedCatalogSamples),
          expectedSchemaSamples: normalizeList(database.expectedSchemaSamples),
          vectorTables: Array.isArray(database.vectorTables)
            ? database.vectorTables.map((vectorTable) => ({
                name: vectorTable.name?.trim() || undefined,
                detailOpenOnly: Boolean(vectorTable.detailOpenOnly),
                expectedType: vectorTable.expectedType?.trim() || undefined,
                expectedPolicyMode: vectorTable.expectedPolicyMode?.trim() || undefined,
                expectedFileCountMin: Number(vectorTable.expectedFileCountMin ?? 0),
                expectedHistoryCountMin: Number(vectorTable.expectedHistoryCountMin ?? 0),
              }))
            : [],
        }))
      : [],
  };
}

function normalizeToolDefinitions(raw: ToolFixtureDefinitions): ToolFixtureDefinitions {
  return {
    tools: Array.isArray(raw.tools)
      ? raw.tools.map((tool) => ({
          caseId: tool.caseId?.trim() || undefined,
          useExistingRegisteredTool: Boolean(tool.useExistingRegisteredTool),
          registeredToolDisplayName: tool.registeredToolDisplayName?.trim() || undefined,
          toolName: tool.toolName?.trim() || undefined,
          method: tool.method?.trim() || undefined,
          url: tool.url?.trim() || undefined,
          headers:
            tool.headers && typeof tool.headers === 'object' && !Array.isArray(tool.headers)
              ? Object.fromEntries(
                  Object.entries(tool.headers).map(([key, value]) => [key, String(value ?? '')]),
                )
              : {},
          payload: normalizeToolPayload(tool.payload),
          expected: {
            statusCode: Number(tool.expected?.statusCode ?? 0) || undefined,
            successIfAnyResponse: Boolean(tool.expected?.successIfAnyResponse),
            successMarkers: normalizeList(tool.expected?.successMarkers),
            failureMarkers: normalizeList(tool.expected?.failureMarkers),
          },
        }))
      : [],
  };
}

function normalizeChatDefinitions(raw: ChatFixtureDefinitions): ChatFixtureDefinitions {
  return {
    cases: Array.isArray(raw.cases)
      ? raw.cases.map((chatCase) => ({
          caseId: chatCase.caseId?.trim() || undefined,
          title: chatCase.title?.trim() || undefined,
          serviceName: chatCase.serviceName?.trim() || undefined,
          question: chatCase.question?.trim() || undefined,
          expected: {
            genericResponseOk: Boolean(chatCase.expected?.genericResponseOk),
            mustContainAny: normalizeList(chatCase.expected?.mustContainAny),
            mustNotContainAny: normalizeList(chatCase.expected?.mustNotContainAny),
            attachmentRequired: Boolean(chatCase.expected?.attachmentRequired),
            attachmentFileNames: normalizeList(chatCase.expected?.attachmentFileNames),
            evidenceRequired: Boolean(chatCase.expected?.evidenceRequired),
            evidenceLabels: normalizeList(chatCase.expected?.evidenceLabels),
            detailOpenRequired: Boolean(chatCase.expected?.detailOpenRequired),
            fallbackMessage: chatCase.expected?.fallbackMessage?.trim() || undefined,
          },
        }))
      : [],
  };
}

function normalizeSecurityDefinitions(raw: SecurityPolicyDefinitions): SecurityPolicyDefinitions {
  return {
    passwordPolicy: raw.passwordPolicy
      ? {
          caseId: raw.passwordPolicy.caseId?.trim() || undefined,
          minLength: Number(raw.passwordPolicy.minLength ?? 0) || undefined,
          maxLength: Number(raw.passwordPolicy.maxLength ?? 0) || undefined,
          requiredCharacterClasses: normalizeList(raw.passwordPolicy.requiredCharacterClasses),
          forbiddenPatterns: normalizeList(raw.passwordPolicy.forbiddenPatterns),
          forbiddenSamples: normalizeList(raw.passwordPolicy.forbiddenSamples),
          allowedSamples: normalizeList(raw.passwordPolicy.allowedSamples),
        }
      : undefined,
    disposableAccounts: Array.isArray(raw.disposableAccounts)
      ? raw.disposableAccounts.map((account) => ({
          purpose: account.purpose?.trim() || undefined,
          username: account.username?.trim() || undefined,
          displayName: account.displayName?.trim() || undefined,
          role: account.role?.trim() || undefined,
          organization: account.organization?.trim() || undefined,
          position: account.position?.trim() || undefined,
          notes: account.notes?.trim() || undefined,
        }))
      : [],
  };
}

function normalizeMutationState(value: unknown): AiServiceMutationState | undefined {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'active' || normalized === 'inactive') {
    return normalized;
  }

  return undefined;
}

function normalizeAiServiceDefinitions(raw: AiServiceFixtureDefinitions): AiServiceFixtureDefinitions {
  return {
    iconSelection: raw.iconSelection
      ? {
          caseId: raw.iconSelection.caseId?.trim() || undefined,
          serviceName: raw.iconSelection.serviceName?.trim() || undefined,
          allowedIconLabels: normalizeList(raw.iconSelection.allowedIconLabels),
          selectionOnlyOk: Boolean(raw.iconSelection.selectionOnlyOk),
          saveRequired: Boolean(raw.iconSelection.saveRequired),
          expectedPreviewMarkers: normalizeList(raw.iconSelection.expectedPreviewMarkers),
        }
      : undefined,
    activationTargets: Array.isArray(raw.activationTargets)
      ? raw.activationTargets.map((target) => ({
          caseId: target.caseId?.trim() || undefined,
          serviceName: target.serviceName?.trim() || undefined,
          startState: normalizeMutationState(target.startState),
          restoreState: normalizeMutationState(target.restoreState),
          disposable: Boolean(target.disposable),
        }))
      : [],
  };
}

export function readDataFixtureDefinitions(): DataFixtureDefinitions {
  if (!dataDefinitionsCache) {
    dataDefinitionsCache = normalizeDataDefinitions(readJsonFile<DataFixtureDefinitions>('data-fixtures.json'));
  }

  return dataDefinitionsCache;
}

export function readToolFixtureDefinitions(): ToolFixtureDefinitions {
  if (!toolDefinitionsCache) {
    toolDefinitionsCache = normalizeToolDefinitions(readJsonFile<ToolFixtureDefinitions>('tool-fixtures.json'));
  }

  return toolDefinitionsCache;
}

export function readChatFixtureDefinitions(): ChatFixtureDefinitions {
  if (!chatDefinitionsCache) {
    chatDefinitionsCache = normalizeChatDefinitions(readJsonFile<ChatFixtureDefinitions>('chat-cases.json'));
  }

  return chatDefinitionsCache;
}

export function readSecurityPolicyDefinitions(): SecurityPolicyDefinitions {
  if (!securityDefinitionsCache) {
    securityDefinitionsCache = normalizeSecurityDefinitions(
      readJsonFile<SecurityPolicyDefinitions>('security-policy.json'),
    );
  }

  return securityDefinitionsCache;
}

export function readAiServiceFixtureDefinitions(): AiServiceFixtureDefinitions {
  if (!aiServiceDefinitionsCache) {
    aiServiceDefinitionsCache = normalizeAiServiceDefinitions(
      readJsonFile<AiServiceFixtureDefinitions>('ai-service-fixtures.json'),
    );
  }

  return aiServiceDefinitionsCache;
}

export function getPrimaryDataFixture(): DataDatabaseFixture | undefined {
  return readDataFixtureDefinitions().databases.find((database) => database.name || database.lenientValidation) ??
    readDataFixtureDefinitions().databases[0];
}

export function getToolFixtureByCaseId(caseId: string): ToolExecutionFixture | undefined {
  return readToolFixtureDefinitions().tools.find((tool) => tool.caseId === caseId);
}

export function getChatFixtureByCaseId(caseId: string): ChatCaseFixture | undefined {
  return readChatFixtureDefinitions().cases.find((chatCase) => chatCase.caseId === caseId);
}

export function getPasswordPolicyFixture(): SecurityPasswordPolicy | undefined {
  return readSecurityPolicyDefinitions().passwordPolicy;
}

export function getAiServiceIconFixture(): AiServiceIconSelectionFixture | undefined {
  return readAiServiceFixtureDefinitions().iconSelection;
}

export function getAiServiceActivationFixture(caseId: string): AiServiceActivationFixture | undefined {
  return readAiServiceFixtureDefinitions().activationTargets?.find((target) => target.caseId === caseId);
}
