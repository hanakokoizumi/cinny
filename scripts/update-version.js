import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const requested = process.argv[2];
if (!requested || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(requested)) {
  console.error('Usage: pnpm bump <version>, for example pnpm bump 4.13.0');
  process.exit(1);
}

const version = requested.endsWith('-nightcord') ? requested : `${requested}-nightcord`;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagePath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.version = version;
fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

// Keep the upstream npm lock metadata compatible; pnpm manages dependencies.
const legacyLockPath = path.join(root, 'package-lock.json');
if (fs.existsSync(legacyLockPath)) {
  const lock = JSON.parse(fs.readFileSync(legacyLockPath, 'utf8'));
  lock.version = version;
  lock.packages[''].version = version;
  fs.writeFileSync(legacyLockPath, `${JSON.stringify(lock, null, 2)}\n`);
}

// Visible versions come from package.json through src/nightcord/brand.ts.
console.log(`Updated Nightcord to v${version}`);
