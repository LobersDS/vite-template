# @loberds/create-vite

LobersDS project scaffolder. Bootstraps a new repo with the full LobersDS build toolchain.

## Usage

```sh
npm create @lober-ds/vite my-new-repo
```

or without a project name (interactive prompt):

```sh
npm create @lober-ds/vite
```

### What gets generated

- **Vite + Vue 3 + TypeScript** — `vue-tsc` type-checking, dual ESM/CJS builds
- **`<template lang="md">`** — `vite-plugin-vue-template-lang-markdown` pre-configured
- **Vitest** — unit and integration tests with v8 coverage
- **Playwright** — E2E tests in a `smoke-test/` npm workspace
- **wireit** — incremental task graph for build, test, lint, bench
- **ESLint + Prettier** — flat config, TypeScript + Vue rules, enforced in CI
- **GitHub Actions** — lint / build / unit / E2E / bench jobs + semantic-release
- **mise** — pinned Node version (`mise.toml`)
- **CLAUDE.md** — AI-assisted development guide for Claude Code
- **Obsidian vault** — `StaticSite-Vault/` with architecture decision doc stubs (optional)

### Prompts

```
Project name: my-new-repo
Include Obsidian vault skeleton? [Y/n]
```

CLAUDE.md and `.claude/skills/` (check-arch, docs, vault-sync) are always included.

## After scaffolding

```sh
cd my-new-repo
mise install        # pin Node version (requires mise)
npm install
npm run dev
```

## Publishing

This package is published to npm via semantic-release on every push to `main` that passes CI.
The `NPM_TOKEN` secret must be set on the GitHub repo for publishing to work.

## Template maintenance

The scaffolded project template lives in `template/`. To update what gets generated, edit files in that directory. The `bin/create.mjs` CLI copies them verbatim, replacing `{{PROJECT_NAME}}` placeholders with the actual project name.
