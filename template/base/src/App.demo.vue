<script>
export const metadata = {
  title: '{{PROJECT_NAME}}',
  description: 'Getting started with {{PROJECT_NAME}}',
  tags: [],
  category: 'guide',
};
</script>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template lang="md">
# {{PROJECT_NAME}}

Welcome to your new LobersDS project. This page is written in markdown with live Vue components inline.

## Reactive state

Click the button — the count updates live without leaving markdown:

<button @click="count++">Count: {{ count }}</button>

## What's included

- **Vite + Vue 3 + TypeScript** — fast builds, typed everywhere
- **`<template lang="md">`** — write docs as markdown, embed live Vue components inline
{{#VITEST}}- **Vitest** — unit and integration tests
{{/VITEST}}{{#SMOKETEST}}- **Playwright** — E2E tests via the `smoke-test/` workspace
{{/SMOKETEST}}{{#WIREIT}}- **wireit** — incremental task graph: build, test, lint, bench
{{/WIREIT}}{{#ESLINT}}- **ESLint{{#PRETTIER}} + Prettier{{/PRETTIER}}** — consistent code style enforced in CI
{{/ESLINT}}{{#CI}}- **GitHub Actions** — CI pipeline
{{/CI}}{{#MISE}}- **mise** — pinned Node version for the whole team
{{/MISE}}{{#VAULT}}- **Obsidian vault** — `{{VAULT_NAME}}/` for architecture decision records
{{/VAULT}}- **CLAUDE.md** — AI-assisted development guide (Claude Code)

## Next steps

1. Update `CLAUDE.md` to describe your project's layers and architecture rules
{{#VAULT}}2. Start the vault: open `{{VAULT_NAME}}/` in Obsidian and write your first ADR
{{/VAULT}}3. Add your source code under `src/`
4. Add unit tests under `tests/`
5. Write more `.demo.vue` pages for your docs site
</template>
