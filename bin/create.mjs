#!/usr/bin/env node
import { spawnSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = join(__dirname, '..', 'template');

// Self-test mode: validate that the template directory has the expected slice structure.
if (process.argv[2] === '--self-test') {
  const required = [
    'base/CLAUDE.md',
    'base/src/main.ts',
    'base/vite.config.ts',
    'base/.claude/skills/check-arch/SKILL.md',
    'eslint/eslint.config.js',
    'prettier/prettier.config.js',
    'mise/mise.toml',
    'vitest/vitest.config.ts',
    'ci/.github/workflows/ci.yml',
    'release/.releaserc.json',
    'vault/StaticSite-Vault/.obsidian/core-plugins.json',
    'vault-skill/.claude/skills/vault-sync/SKILL.md',
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

function interpolate(content, vars, flags) {
  // Loop until stable: nested blocks (e.g. {{#WIREIT}} inside {{#ESLINT}}) require
  // multiple passes because the regex engine doesn't re-scan replacement text.
  let prev;
  do {
    prev = content;
    content = content.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, flag, inner) =>
      flags[flag] ? inner : ''
    );
  } while (content !== prev);

  // Strip trailing whitespace per line (orphan indent left by removed blocks) and
  // collapse runs of 3+ newlines to 2 (one blank line). Ensure exactly one final newline.
  content = content
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n*$/, '\n');

  return content
    .replaceAll('{{PROJECT_NAME}}', vars.projectName)
    .replaceAll('{{VAULT_NAME}}', vars.vaultName ?? '');
}

function copySlice(sliceDir, destDir, vars, flags) {
  if (!existsSync(sliceDir)) return;
  copyDir(sliceDir, destDir, vars, flags);
}

function copyDir(src, dest, vars, flags) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    // Rename the vault skeleton directory to the user's chosen vault name.
    const destEntry = vars.vaultName ? entry.replace(/^StaticSite-Vault$/, vars.vaultName) : entry;
    const destPath = join(dest, destEntry);

    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath, vars, flags);
    } else {
      const raw = readFileSync(srcPath, 'utf8');
      writeFileSync(destPath, interpolate(raw, vars, flags), 'utf8');
    }
  }
}

// devDependencies grouped by feature
const DEPS = {
  always: {
    '@lober-ds/vite-plugin-vue-template-lang-markdown': '^1.0.0',
    '@types/node': '^24.0.0',
    '@vue/tsconfig': '^0.9.0',
  },
  eslint: {
    '@eslint/js': '^10.0.0',
    eslint: '^10.0.0',
    'eslint-config-prettier': '^10.0.0',
    'eslint-plugin-vue': '^10.0.0',
    'typescript-eslint': '^8.0.0',
  },
  prettier: {
    prettier: '^3.0.0',
  },
  wireit: {
    wireit: '^0.14.0',
  },
  vitest: {
    vitest: '^4.0.0',
    '@vitest/coverage-v8': '^4.0.0',
  },
  smoketest: {
    '@playwright/test': '^1.61.0',
  },
  release: {
    '@semantic-release/changelog': '^6.0.3',
    '@semantic-release/commit-analyzer': '^13.0.1',
    '@semantic-release/git': '^10.0.1',
    '@semantic-release/github': '^12.0.0',
    '@semantic-release/npm': '^13.1.5',
    '@semantic-release/release-notes-generator': '^14.1.1',
    'semantic-release': '^25.0.0',
  },
};

function buildScripts(f) {
  const scripts = {
    dev: 'vite',
    build: f.wireit ? 'wireit' : 'vue-tsc -b && vite build',
    preview: 'vite preview',
  };

  if (f.vitest) {
    scripts.test = f.wireit ? 'wireit' : 'vitest run';
    scripts['test:watch'] = 'vitest';
    scripts.bench = f.wireit ? 'wireit' : 'vitest bench';
    scripts.coverage = 'vitest run --coverage';
  }

  if (f.eslint) {
    scripts.lint = f.wireit ? 'wireit' : 'eslint .';
    scripts['lint:fix'] = 'eslint . --fix';
  }

  if (f.prettier) {
    scripts.format = 'prettier --write .';
    scripts['format:check'] = f.wireit ? 'wireit' : 'prettier --check .';
  }

  if (f.smoketest) {
    scripts['test:e2e'] = 'npm run test:e2e --workspace=smoke-test';
    scripts['smoke-test:dev'] = 'npm run dev --workspace=smoke-test';
    if (f.wireit) scripts['smoke-test:build'] = 'wireit';
  }

  const cleanPaths = ['dist'];
  if (f.smoketest) cleanPaths.push('smoke-test/dist');
  if (f.wireit) cleanPaths.push('.wireit');
  if (f.vitest) cleanPaths.push('coverage');
  scripts.clean = `rm -rf ${cleanPaths.join(' ')}`;

  return scripts;
}

function buildWireitConfig(f) {
  const wireit = {
    build: {
      command: 'vue-tsc -b && vite build',
      files: ['src/**', 'tsconfig*.json', 'vite.config.ts', 'package.json'],
      output: ['dist/**'],
    },
  };

  if (f.vitest) {
    wireit.test = {
      command: 'vitest run',
      dependencies: ['build'],
      files: ['tests/**', 'vitest.config.ts'],
      output: [],
    };
    wireit.bench = {
      command: 'vitest bench',
      files: ['tests/perf/**', 'vitest.config.ts'],
      output: [],
    };
  }

  if (f.eslint) {
    const lintFiles = ['src/**', 'tests/**', '*.config.*', 'eslint.config.js'];
    if (f.smoketest) lintFiles.push('smoke-test/src/**');
    wireit.lint = { command: 'eslint .', files: lintFiles, output: [] };
  }

  if (f.prettier) {
    wireit['format:check'] = {
      command: 'prettier --check .',
      files: ['src/**', 'tests/**', '*.config.*', '.prettierrc*', '*.json', '*.md'],
      output: [],
    };
  }

  if (f.smoketest) {
    wireit['smoke-test:build'] = {
      command: 'npm run build --workspace=smoke-test',
      dependencies: ['build'],
      files: ['smoke-test/src/**', 'smoke-test/vite.config.ts', 'smoke-test/tsconfig*.json'],
      output: ['smoke-test/dist/**'],
    };
  }

  return wireit;
}

function mergePackageJson(basePkg, projectName, f) {
  const devDependencies = {
    ...basePkg.devDependencies,
    ...DEPS.always,
    ...(f.eslint ? DEPS.eslint : {}),
    ...(f.prettier ? DEPS.prettier : {}),
    ...(f.wireit ? DEPS.wireit : {}),
    ...(f.vitest ? DEPS.vitest : {}),
    ...(f.smoketest ? DEPS.smoketest : {}),
    ...(f.release ? DEPS.release : {}),
  };

  const pkg = {
    name: projectName,
    private: basePkg.private,
    version: basePkg.version,
    type: basePkg.type,
    ...(f.smoketest ? { workspaces: ['smoke-test'] } : {}),
    scripts: buildScripts(f),
    dependencies: basePkg.dependencies,
    devDependencies: Object.fromEntries(
      Object.entries(devDependencies).sort(([a], [b]) => a.localeCompare(b))
    ),
    ...(f.wireit ? { wireit: buildWireitConfig(f) } : {}),
  };

  return pkg;
}

// Read all lines from stdin upfront, then answer prompts from the queue.
// This avoids the readline race where buffered lines are emitted before
// the second question() is registered.
async function readStdinLines() {
  if (process.stdin.isTTY) return null;
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

function yn(answer, defaultYes = true) {
  const s = answer.trim().toLowerCase();
  return defaultYes ? s !== 'n' : s === 'y';
}

async function main() {
  const lineQueue = await readStdinLines();
  const rl = lineQueue ? null : createInterface({ input: process.stdin, output: process.stdout });

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

    console.log('');
    const eslint = yn(await prompt('Include ESLint?                 [Y/n] ', lineQueue, rl));
    const prettier = yn(await prompt('Include Prettier?               [Y/n] ', lineQueue, rl));
    const mise = yn(await prompt('Include mise (Node pinning)?    [Y/n] ', lineQueue, rl));
    const wireit = yn(await prompt('Include wireit (task graph)?    [Y/n] ', lineQueue, rl));
    const vitest = yn(await prompt('Include Vitest (unit tests)?    [Y/n] ', lineQueue, rl));
    const smoketest = yn(await prompt('Include Playwright smoke tests? [Y/n] ', lineQueue, rl));
    const ci = yn(await prompt('Include GitHub CI workflows?    [Y/n] ', lineQueue, rl));
    const release = yn(
      await prompt('Include semantic-release?       [y/N] ', lineQueue, rl),
      false
    );
    const vault = yn(await prompt('Include Obsidian vault?         [y/N] ', lineQueue, rl), false);

    let vaultName = '';
    if (vault) {
      const defaultVaultName = `${projectName}-vault`;
      const ans = (await prompt(`Vault name [${defaultVaultName}]: `, lineQueue, rl)).trim();
      vaultName = ans || defaultVaultName;
    }

    const features = { eslint, prettier, mise, wireit, vitest, smoketest, ci, release, vault };
    const flags = {
      ESLINT: eslint,
      PRETTIER: prettier,
      MISE: mise,
      WIREIT: wireit,
      VITEST: vitest,
      SMOKETEST: smoketest,
      CI: ci,
      RELEASE: release,
      VAULT: vault,
    };
    const vars = { projectName, vaultName };

    console.log(`\nScaffolding ${projectName} with Vite (vue-ts)…\n`);
    const result = spawnSync(
      'npx',
      ['--yes', 'create-vite@latest', projectName, '--template', 'vue-ts'],
      { stdio: 'inherit' }
    );
    if (result.status !== 0) process.exit(result.status ?? 1);

    // Remove Vite's boilerplate that we replace with our own.
    for (const p of [
      join(destDir, 'src', 'App.vue'),
      join(destDir, 'src', 'components'),
      join(destDir, 'src', 'assets'),
      join(destDir, 'public'),
    ]) {
      if (existsSync(p)) rmSync(p, { recursive: true });
    }

    // Copy base slice (always required).
    copySlice(join(templateDir, 'base'), destDir, vars, flags);

    // Copy optional feature slices.
    if (eslint) copySlice(join(templateDir, 'eslint'), destDir, vars, flags);
    if (prettier) copySlice(join(templateDir, 'prettier'), destDir, vars, flags);
    if (mise) copySlice(join(templateDir, 'mise'), destDir, vars, flags);
    if (vitest) copySlice(join(templateDir, 'vitest'), destDir, vars, flags);
    if (smoketest) copySlice(join(templateDir, 'smoke-test'), destDir, vars, flags);
    if (ci) copySlice(join(templateDir, 'ci'), destDir, vars, flags);
    if (release) copySlice(join(templateDir, 'release'), destDir, vars, flags);
    if (vault) {
      copySlice(join(templateDir, 'vault'), destDir, vars, flags);
      copySlice(join(templateDir, 'vault-skill'), destDir, vars, flags);
    }

    // Merge our additions into Vite's generated package.json.
    const pkgPath = join(destDir, 'package.json');
    const basePkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    writeFileSync(
      pkgPath,
      JSON.stringify(mergePackageJson(basePkg, projectName, features), null, 2) + '\n',
      'utf8'
    );

    console.log(`
✓ Created ${projectName}/

Next steps:
  cd ${projectName}
${mise ? '  mise install        # pin Node version\n' : ''}  npm install
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
