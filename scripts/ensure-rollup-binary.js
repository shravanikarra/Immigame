import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Ensure Rollup's native binary is present on Linux builders where npm sometimes skips optional deps.
const platform = process.platform;
const arch = process.arch;

if (platform !== 'linux' || (arch !== 'x64' && arch !== 'arm64')) {
  process.exit(0);
}

const report = typeof process.report?.getReport === 'function' ? process.report.getReport() : null;
const hasGlibc = Boolean(report?.header?.glibcVersionRuntime);

const pkgName = (() => {
  if (arch === 'x64') {
    return hasGlibc ? '@rollup/rollup-linux-x64-gnu' : '@rollup/rollup-linux-x64-musl';
  }
  return hasGlibc ? '@rollup/rollup-linux-arm64-gnu' : '@rollup/rollup-linux-arm64-musl';
})();

const pkgPath = path.join(process.cwd(), 'node_modules', ...pkgName.split('/'));

if (existsSync(pkgPath)) {
  process.exit(0);
}

console.log(`Installing ${pkgName} because the optional Rollup binary was missing...`);

try {
  execSync(
    `npm install ${pkgName}@^4.53.3 --no-save --ignore-scripts --package-lock=false`,
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error(`Failed to install ${pkgName}.`, error);
  process.exit(1);
}
