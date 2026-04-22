#!/usr/bin/env node
/**
 * One-time / repeat setup: install dependencies and show how to run the stack
 * in multiple terminals. Usage:
 *   node scripts/setup-dev.mjs
 *   node scripts/setup-dev.mjs --skip-install   # only print the dev workflow
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(msg, c = 'reset') {
  console.log(`${colors[c] || ''}${msg}${colors.reset}`);
}

function runNpmInstall(cwd, label) {
  log(`\n→ ${label}: npm install`, 'cyan');
  execSync('npm install', { cwd, stdio: 'inherit' });
}

function minNodeVersionOk() {
  const m = /^v(\d+)/.exec(process.version);
  if (!m) return true;
  const major = parseInt(m[1], 10);
  if (major < 18) {
    log(`\n⚠ Node ${process.version} detected. Use Node 18+ (20 recommended).`, 'yellow');
    return false;
  }
  return true;
}

function printWorkflow() {
  log('\n' + '═'.repeat(64), 'dim');
  log('  Local development — use ' + '4 terminals' + ' (or stagger as you like)', 'bold');
  log('═'.repeat(64), 'dim');

  log('\n  Terminal 1 — DynamoDB (from repo root)', 'green');
  log('  npm run docker:dynamodb', 'dim');
  log('  Wait until the dynamodb container is up (a few seconds).', 'dim');

  log('\n  Terminal 2 — API (from repo root)', 'green');
  log('  cd backend && npm run dev', 'dim');
  log('  Wait until the server is listening (e.g. http://localhost:3000).', 'dim');

  log('\n  Terminal 1 (again) or any terminal — seed data (API must be running)', 'green');
  log('  npm run seed:database', 'dim');
  log('  Run from the ' + 'repository root' + ' so the npm script resolves.', 'dim');

  log('\n  Terminal 3 — Web UI (from repo root)', 'green');
  log('  cd frontend && npm run dev', 'dim');
  log('  Open http://localhost:5173', 'dim');

  log('\n' + '─'.repeat(64), 'dim');
  log('  Health:  curl http://localhost:3000/health', 'dim');
  log('  API:     http://localhost:3000/api  (Vite proxies /api from :5173)', 'dim');
  log('═'.repeat(64) + '\n', 'dim');
}

const skipInstall = process.argv.includes('--skip-install');

function main() {
  log('\n  Bot Admin Control — dev setup\n', 'bold');
  minNodeVersionOk();

  if (!skipInstall) {
    for (const [rel, label] of [
      ['.', 'Repository root'],
      ['backend', 'Backend'],
      ['frontend', 'Frontend'],
    ]) {
      const cwd = path.join(root, rel);
      const pkg = path.join(cwd, 'package.json');
      if (!fs.existsSync(pkg)) {
        log(`Missing ${pkg} — aborting.`, 'yellow');
        process.exit(1);
      }
      runNpmInstall(cwd, label);
    }
    log('\n✓ Dependencies installed.\n', 'green');
  } else {
    log('(Skipped npm install: --skip-install)\n', 'dim');
  }

  printWorkflow();
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
