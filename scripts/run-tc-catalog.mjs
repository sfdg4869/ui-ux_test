import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function resolvePlaywrightCli() {
  return path.join(rootDir, 'node_modules', 'playwright', 'cli.js');
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      env: options.env ?? process.env,
    });

    child.on('error', reject);
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

const forwardedArgs = process.argv.slice(2);

const buildExitCode = await runCommand(process.execPath, [path.join(rootDir, 'scripts', 'generate-catalog.mjs')]);
if (buildExitCode !== 0) {
  process.exit(buildExitCode);
}

const playwrightExitCode = await runCommand(process.execPath, [resolvePlaywrightCli(), 'test', ...forwardedArgs], {
  env: {
    ...process.env,
    TC_CATALOG_REPORT: '1',
  },
});

process.exit(playwrightExitCode);
