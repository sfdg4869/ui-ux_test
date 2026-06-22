import { fileURLToPath } from 'node:url';
import path from 'node:path';

let envLoaded = false;

export function loadHarnessEnv(): void {
  if (envLoaded) {
    return;
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, '..', '.env');

  try {
    process.loadEnvFile(envPath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== 'ENOENT') {
      throw error;
    }
  }

  envLoaded = true;
}
