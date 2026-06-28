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
- **Vitest** — unit and integration tests
- **Playwright** — E2E tests via the `smoke-test/` workspace
- **wireit** — incremental task graph: build, test, lint, bench
- **ESLint + Prettier** — consistent formatting enforced in CI
- **GitHub Actions** — lint, build, test, E2E, benchmarks, and semantic-release
- **mise** — pinned Node version for the whole team
- **CLAUDE.md** — AI-assisted development guide (Claude Code)
- **Obsidian vault** — `StaticSite-Vault/` for architecture decision records

## Next steps

1. Update `CLAUDE.md` to describe your project's layers and architecture rules
2. Start the vault: open `StaticSite-Vault/` in Obsidian and write your first ADR
3. Add your source code under `src/`
4. Add unit tests under `tests/`
5. Write more `.demo.vue` pages for your docs site
</template>
