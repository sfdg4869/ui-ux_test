import { loadHarnessEnv } from './load-env.js';

loadHarnessEnv();

export type HarnessEnv = {
  baseURL: string;
  username?: string;
  password?: string;
  storageState?: string;
  credentialProfiles: Record<CredentialProfileName, CredentialProfile>;
  authorization: AuthorizationExpectations;
  allowMutationTests: boolean;
  mutationUsername?: string;
  mutationPassword?: string;
  mutationStorageState?: string;
  uploadSizeFixtureRoot?: string;
  uploadLimitElevenFilesDir?: string;
  uploadLimitOver100mbFile?: string;
  uploadSampleTextFile?: string;
  uploadSampleImageFile?: string;
  uploadSampleDocumentFile?: string;
  uploadSampleMediaFile?: string;
};

export type CredentialProfileName = 'default' | 'admin' | 'user' | 'mutation';

export type CredentialProfile = {
  name: CredentialProfileName;
  username?: string;
  password?: string;
  storageState?: string;
};

export type CompleteCredentialProfile = {
  name: CredentialProfileName;
  username: string;
  password: string;
  storageState?: string;
};

export type AuthorizationExpectations = {
  adminVisibleMenus: string[];
  userHiddenMenus: string[];
  adminAllowedRoutes: string[];
  userBlockedRoutes: string[];
  denialMarkers: string[];
};

function readBooleanEnv(name: string): boolean {
  return ['1', 'true', 'yes', 'on'].includes((process.env[name] ?? '').trim().toLowerCase());
}

function readOptionalEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function readListEnv(name: string, fallback: string[] = []): string[] {
  const raw = process.env[name];
  if (!raw?.trim()) {
    return [...fallback];
  }

  return raw
    .split(/[,\r\n]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

const defaultCredentialProfile: CredentialProfile = {
  name: 'default',
  username: readOptionalEnv('EXEMBLE_USERNAME'),
  password: readOptionalEnv('EXEMBLE_PASSWORD'),
  storageState: readOptionalEnv('EXEMBLE_STORAGE_STATE'),
};

const adminCredentialProfile: CredentialProfile = {
  name: 'admin',
  username: readOptionalEnv('EXEMBLE_ADMIN_USERNAME') ?? defaultCredentialProfile.username,
  password: readOptionalEnv('EXEMBLE_ADMIN_PASSWORD') ?? defaultCredentialProfile.password,
  storageState: readOptionalEnv('EXEMBLE_ADMIN_STORAGE_STATE') ?? defaultCredentialProfile.storageState,
};

const userCredentialProfile: CredentialProfile = {
  name: 'user',
  username: readOptionalEnv('EXEMBLE_USER_USERNAME'),
  password: readOptionalEnv('EXEMBLE_USER_PASSWORD'),
  storageState: readOptionalEnv('EXEMBLE_USER_STORAGE_STATE'),
};

const mutationCredentialProfile: CredentialProfile = {
  name: 'mutation',
  username: readOptionalEnv('EXEMBLE_MUTATION_USERNAME'),
  password: readOptionalEnv('EXEMBLE_MUTATION_PASSWORD'),
  storageState: readOptionalEnv('EXEMBLE_MUTATION_STORAGE_STATE'),
};

export const harnessEnv: HarnessEnv = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://10.10.34.114',
  username: defaultCredentialProfile.username,
  password: defaultCredentialProfile.password,
  storageState: defaultCredentialProfile.storageState,
  credentialProfiles: {
    default: defaultCredentialProfile,
    admin: adminCredentialProfile,
    user: userCredentialProfile,
    mutation: mutationCredentialProfile,
  },
  authorization: {
    adminVisibleMenus: readListEnv('EXEMBLE_AUTHZ_ADMIN_VISIBLE_MENUS', ['권한', '로그']),
    userHiddenMenus: readListEnv('EXEMBLE_AUTHZ_USER_HIDDEN_MENUS', ['권한', '로그']),
    adminAllowedRoutes: readListEnv('EXEMBLE_AUTHZ_ADMIN_ALLOWED_ROUTES', [
      '/permission/account',
      '/permission/org',
      '/permission/vector-database-access',
      '/log',
    ]),
    userBlockedRoutes: readListEnv('EXEMBLE_AUTHZ_USER_BLOCKED_ROUTES', [
      '/permission/account',
      '/permission/org',
      '/permission/vector-database-access',
      '/log',
    ]),
    denialMarkers: readListEnv('EXEMBLE_AUTHZ_DENIAL_MARKERS', [
      '권한이 없습니다',
      '접근 권한이 없습니다',
      'Unauthorized',
      'Forbidden',
      '403',
    ]),
  },
  allowMutationTests: readBooleanEnv('EXEMBLE_ALLOW_MUTATION_TESTS'),
  mutationUsername: mutationCredentialProfile.username,
  mutationPassword: mutationCredentialProfile.password,
  mutationStorageState: mutationCredentialProfile.storageState,
  uploadSizeFixtureRoot: readOptionalEnv('EXEMBLE_UPLOAD_SIZE_FIXTURE_ROOT'),
  uploadLimitElevenFilesDir: readOptionalEnv('EXEMBLE_UPLOAD_LIMIT_11_FILES_DIR'),
  uploadLimitOver100mbFile: readOptionalEnv('EXEMBLE_UPLOAD_LIMIT_100MB_FILE'),
  uploadSampleTextFile: readOptionalEnv('EXEMBLE_UPLOAD_SAMPLE_TEXT_FILE'),
  uploadSampleImageFile: readOptionalEnv('EXEMBLE_UPLOAD_SAMPLE_IMAGE_FILE'),
  uploadSampleDocumentFile: readOptionalEnv('EXEMBLE_UPLOAD_SAMPLE_DOCUMENT_FILE'),
  uploadSampleMediaFile: readOptionalEnv('EXEMBLE_UPLOAD_SAMPLE_MEDIA_FILE'),
};

export function hasCredentials(): boolean {
  return hasCredentialProfile('default');
}

export function requireCredentials(): { username: string; password: string } {
  const profile = requireCredentialProfile('default');
  return { username: profile.username, password: profile.password };
}

export function hasUploadLimitFixtures(): boolean {
  return Boolean(harnessEnv.uploadLimitElevenFilesDir && harnessEnv.uploadLimitOver100mbFile);
}

export function getCredentialProfile(name: CredentialProfileName): CredentialProfile {
  return harnessEnv.credentialProfiles[name];
}

export function hasCredentialProfile(name: CredentialProfileName): boolean {
  const profile = getCredentialProfile(name);
  return Boolean(profile.username && profile.password);
}

export function requireCredentialProfile(name: CredentialProfileName): CompleteCredentialProfile {
  const profile = getCredentialProfile(name);
  if (!profile.username || !profile.password) {
    const labels: Record<CredentialProfileName, string> = {
      default: 'EXEMBLE_USERNAME and EXEMBLE_PASSWORD',
      admin: 'EXEMBLE_ADMIN_USERNAME / EXEMBLE_ADMIN_PASSWORD (or EXEMBLE_USERNAME / EXEMBLE_PASSWORD fallback)',
      user: 'EXEMBLE_USER_USERNAME and EXEMBLE_USER_PASSWORD',
      mutation: 'EXEMBLE_MUTATION_USERNAME and EXEMBLE_MUTATION_PASSWORD',
    };

    throw new Error(`${labels[name]} are required for the ${name} credential profile.`);
  }

  return {
    name,
    username: profile.username,
    password: profile.password,
    storageState: profile.storageState,
  };
}

export function hasRoleComparisonProfiles(): boolean {
  return hasCredentialProfile('admin') && hasCredentialProfile('user');
}

export function requireRoleComparisonProfiles(): {
  admin: CompleteCredentialProfile;
  user: CompleteCredentialProfile;
} {
  return {
    admin: requireCredentialProfile('admin'),
    user: requireCredentialProfile('user'),
  };
}

export function getAuthorizationExpectations(): AuthorizationExpectations {
  return harnessEnv.authorization;
}

export function mutationTestsEnabled(): boolean {
  return harnessEnv.allowMutationTests;
}

export function requireDisposableMutationAccount(scope: string): { username: string } {
  if (!mutationTestsEnabled()) {
    throw new Error(
      `${scope} is blocked. Mutation tests are disabled by default to protect the active account. ` +
        'Set EXEMBLE_ALLOW_MUTATION_TESTS=1 only for a disposable test account.',
    );
  }

  if (!hasCredentialProfile('mutation')) {
    throw new Error(
      `${scope} is blocked. EXEMBLE_MUTATION_USERNAME and EXEMBLE_MUTATION_PASSWORD must be set for the dedicated disposable account before any write flow can run.`,
    );
  }

  return {
    username: requireCredentialProfile('mutation').username,
  };
}
