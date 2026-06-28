# {{PROJECT_NAME}}

<!-- Replace this section with your project's description and purpose. -->

**Multi-repo:** update this if {{PROJECT_NAME}} is part of a multi-repo setup (e.g., this repo = build tooling; a sibling repo = UI components).

## Reading the Vault First

`StaticSite-Vault/Static Site Generator/` is an Obsidian vault and the authoritative source of truth for all design decisions. This file links to it rather than duplicating it.

Before starting any feature, read:

1. `Architecture Overview.md` — start here every time; layer model, build order
2. The doc for the specific layer you're working on
3. `Alternatives Considered.md` — before proposing a design change (likely already considered)

## Commands

Read `CONTRIBUTING.md` before running any commands — it lists every `npm run` script, when to use each, and how to set up the toolchain with mise.

Never run test runners or other tools directly (e.g. `npx vitest`, `npx playwright`). Always use the `npm run` scripts defined in `package.json`.

**Before every commit:** run `npm run lint:fix && npm run format` and stage any resulting changes. CI lint and format:check jobs fail consistently when this is skipped.

## Architecture

<!-- Define your project's layers here. Each layer should be independently usable. -->

| # | Layer | Type | Vault Doc |
|---|-------|------|-----------|
| 1 | _your first layer_ | _e.g., Vite Plugin_ | _Layer Name.md_ |

### Architecture Rules

- **Independent layers** — no layer imports from another. Each must be usable standalone.
- **Page owns state** — components are stateless projections of page state. Never put business data in a component's own `ref()`.
- **Named ES exports, not frontmatter** — `.demo.vue` files use `export const metadata = {}` for static introspection.

## TypeScript Standards

- `strict: true` always — no exceptions
- No `any` — use `unknown` and narrow it, or use proper generics
- Explicit return types on all exported functions
- Discriminated unions over boolean flags for state variants
- No barrel exports — import directly from source files

## Vue Standards

- `<script setup>` always — Composition API only, no Options API
- `defineProps<{ prop: Type }>()` — typed interfaces, not runtime validators
- `defineEmits<{ (e: 'event', payload: Type): void }>()` — typed emits
- `defineModel()` for two-way binding (Vue 3.4+)

## Testing

- **Vitest**: unit tests for all pure TS functions; performance benchmarks; bundle size assertions
- **Playwright**: E2E interaction tests via the `smoke-test/` workspace
- Test names describe behavior: `'generates v-bind syntax for string props'` not `'calls generateProp()'`

## Git

Conventional Commits with layer scope:

```
feat(layer-name): ...
fix(layer-name): ...
chore(deps): ...
docs(vault): ...
test(layer-name): ...
refactor(layer-name): ...
```

PRs scope to one layer where possible. Never `--no-verify` — fix the underlying hook issue.

## Skills

| Skill | When to use |
|-------|-------------|
| `/commit` | All commits — enforces Conventional Commits + layer scope |
| `/commit-push-pr` | Opening a PR |
| `/code-review` | Before every PR — checks arch compliance, TS safety |
| `/simplify` | After implementing a logical chunk of a layer |
| `/vault-sync` | After updating vault docs with new design decisions |
| `/check-arch` | Before large refactors — reports layer coupling violations |
| `/docs internal` | Scaffold a new architecture decision doc in the vault |
