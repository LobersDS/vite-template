#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = join(__dirname, '..', 'template');

// Self-test mode: validate that the template directory exists and has the expected structure.
if (process.argv[2] === '--self-test') {
  const required = [
    'package.json',
    'vite.config.ts',
    'vitest.config.ts',
    'eslint.config.js',
    'tsconfig.json',
    'src/main.ts',
    '.github/workflows/ci.yml',
    'CLAUDE.md',
  ];
  let ok = true;
  for (const f of required) {
    if (!existsSync(join(templateDir, f))) {
      console.error(`FAIL: template/${f} missing`);
      ok = false;
    }
  }
  if (ok) {
    console.log('Self-test passed: all required template files present.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

function isValidPackageName(name) {
  return /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/.test(name);
}

function interpolate(content, projectName) {
  return content.replaceAll('{{PROJECT_NAME}}', projectName);
}

function copyTemplate(src, dest, projectName, skip = []) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const relPath = relative(templateDir, srcPath);

    if (skip.some((s) => relPath === s || relPath.startsWith(s + '/'))) continue;

    if (statSync(srcPath).isDirectory()) {
      copyTemplate(srcPath, destPath, projectName, skip);
    } else {
      const raw = readFileSync(srcPath, 'utf8');
      writeFileSync(destPath, interpolate(raw, projectName), 'utf8');
    }
  }
}

// Read all lines from stdin upfront, then answer prompts from the queue.
// This avoids the readline race where buffered lines are emitted before
// the second question() is registered.
async function readStdinLines() {
  if (process.stdin.isTTY) return null; // interactive — let readline handle it
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (buf += chunk));
    process.stdin.on('end', () =>
      resolve(
        buf
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
      )
    );
  });
}

async function prompt(message, lineQueue, rl) {
  if (lineQueue) {
    const answer = lineQueue.shift() ?? '';
    process.stdout.write(message + answer + '\n');
    return answer;
  }
  return new Promise((resolve) => rl.question(message, resolve));
}

async function main() {
  const lineQueue = await readStdinLines();
  const rl = lineQueue
    ? null
    : createInterface({ input: process.stdin, output: process.stdout });

  try {
    let projectName = process.argv[2];

    if (!projectName) {
      projectName = (await prompt('Project name: ', lineQueue, rl)).trim();
    }

    if (!isValidPackageName(projectName)) {
      console.error(
        `Error: "${projectName}" is not a valid package name.\n` +
          'Use lowercase letters, numbers, hyphens, and dots only.'
      );
      process.exit(1);
    }

    const destDir = resolve(process.cwd(), projectName);

    if (existsSync(destDir)) {
      console.error(`Error: directory "${projectName}" already exists.`);
      process.exit(1);
    }

    const vaultAnswer = await prompt('Include Obsidian vault skeleton? [Y/n] ', lineQueue, rl);
    const includeVault = vaultAnswer.trim().toLowerCase() !== 'n';

    const skip = includeVault ? [] : ['StaticSite-Vault'];

    console.log(`\nScaffolding ${projectName}...`);
    copyTemplate(templateDir, destDir, projectName, skip);

    console.log(`
✓ Created ${projectName}/

Next steps:
  cd ${projectName}
  mise install        # pin Node version
  npm install
  npm run dev
`);
  } finally {
    rl?.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
