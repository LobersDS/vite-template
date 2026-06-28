# Architecture Overview — @lober-ds/create-vite

## Purpose

`@lober-ds/create-vite` is the LobersDS project scaffolder. It bootstraps new repos with the proven LobersDS build toolchain so teams start from a working baseline rather than assembling it from scratch.

```sh
npm create @lober-ds/vite my-new-project
```

## Repo Structure

```
vite-template/
├── bin/
│   └── create.mjs        # CLI entry point — zero runtime deps, Node built-ins only
├── template/             # Feature slices copied into the new project
│   ├── base/             # Always included: CLAUDE.md, .claude/skills/, src/, vite.config.ts
│   ├── eslint/           # eslint.config.js
│   ├── prettier/         # prettier.config.js
│   ├── mise/             # mise.toml
│   ├── vitest/           # vitest.config.ts
│   ├── smoke-test/       # Playwright E2E workspace (smoke-test/)
│   ├── ci/               # .github/workflows/ci.yml
│   ├── release/          # .github/workflows/release.yml + .releaserc.json
│   ├── vault/            # Obsidian vault skeleton (StaticSite-Vault/ — renamed at copy time)
│   └── vault-skill/      # .claude/skills/vault-sync/ (only when vault included)
├── Vault/                # This vault — scaffolder architecture docs
├── .releaserc.json       # semantic-release → publishes @lober-ds/create-vite
└── .github/workflows/
    ├── ci.yml            # lint + validate-template + scaffold-and-build
    └── release.yml       # OIDC Trusted Publishing to npm
```

## CLI Behaviour

The CLI chains off Vite's official scaffolder for the base project, then layers LobersDS additions on top. All additions beyond the base are opt-in.

### Prompt sequence

```
Project name: <input>

Include ESLint?                 [Y/n]
Include Prettier?               [Y/n]
Include mise (Node pinning)?    [Y/n]
Include wireit (task graph)?    [Y/n]
Include Vitest (unit tests)?    [Y/n]
Include Playwright smoke tests? [Y/n]
Include GitHub CI workflows?    [Y/n]
Include semantic-release?       [y/N]
Include Obsidian vault?         [y/N]
  Vault name [my-project-vault]:    ← only shown if vault = y
```

### Execution steps

1. Validate project name (lowercase, numbers, hyphens, dots only)
2. Run `npx --yes create-vite@latest <name> --template vue-ts` via `spawnSync`
3. Delete Vite's boilerplate (src/App.vue, src/components/, src/assets/, public/)
4. Copy `template/base/` into the project (always)
5. Copy each selected optional slice into the project
6. Read Vite's generated `package.json`, merge our devDeps + scripts + wireit config, write back
7. Print next steps

### Substitutions

Two variables are replaced in all copied files:
- `{{PROJECT_NAME}}` — the project name
- `{{VAULT_NAME}}` — the vault directory name (empty string if no vault)

Conditional blocks strip or include sections based on which features were selected:
- `{{#FLAG}}...{{/FLAG}}` — included only when FLAG is true
- Flags: VAULT, ESLINT, PRETTIER, MISE, WIREIT, VITEST, SMOKETEST, CI, RELEASE

### Package.json merge strategy

Vite generates a minimal `package.json`. The CLI merges in:
- Always: `@lober-ds/vite-plugin-vue-template-lang-markdown`, `@types/node`, `@vue/tsconfig`
- Per feature: eslint/prettier/wireit/vitest/playwright/semantic-release devDeps
- Scripts: built programmatically — wireit-wrapped variants when wireit is selected
- `wireit` config object: added only when wireit is selected
- `workspaces`: `["smoke-test"]` added only when smoke-test is selected

## Template Dependencies

The scaffolded project always depends on `@lober-ds/vite-plugin-vue-template-lang-markdown` (private npm). Developers need to be authenticated to the `@lober-ds` npm org to run `npm install` in a scaffolded project.

## Always-included Features

- `base/CLAUDE.md` — AI development guide (with conditional sections stripped based on features)
- `base/.claude/skills/check-arch/` — architecture linter
- `base/.claude/skills/docs/` — docs scaffolding (internal vault mode + public .demo.vue mode)
- `base/vite.config.ts` — overrides Vite's generated config to add `vueTemplateLangMarkdown`
- `base/src/main.ts` + `base/src/App.demo.vue` — replace Vite's boilerplate entry point

## Alternatives Considered

See `Alternatives Considered.md`.
