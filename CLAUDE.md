# vite-template (@lober-ds/create-vite)

LobersDS project scaffolder. Bootstraps new repos with the proven LobersDS build toolchain via:

```sh
npm create @lober-ds/vite my-new-project
```

## Repository and Package Visibility

Everything in LobersDS is **private**:
- GitHub repos are private (org: `LobersDS`)
- npm packages are private/restricted (org: `@lober-ds`, paid npm org plan)
- `publishConfig.access` must always be `"restricted"` — never `"public"`
- Never use `npm publish --access public` or `--access public` flags

## Reading the Vault First

`Scaffolder-Architecture/Scaffolder/` is the Obsidian vault for this repo. Read before making design changes:

1. `Architecture Overview.md` — repo structure, CLI behaviour, template dependency chain
2. `Alternatives Considered.md` — before proposing a design change

## Commands

Never run tools directly. Always use `npm run` scripts.

**Before every commit — mandatory, no exceptions:**

```sh
npm run lint:fix && npm run format
```

Stage any changes these produce before committing. CI runs `lint` and `format:check` on every push and will fail if this was skipped. Never commit with lint errors or unformatted files.

| Script | What it does |
|--------|-------------|
| `npm test` | Validates template structure (self-test) |
| `npm run lint` | ESLint on `bin/` |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |

## Architecture

Two moving parts:

- **`bin/create.mjs`** — the CLI. Zero runtime deps, Node built-ins only. Reads stdin or prompts interactively, copies `template/`, substitutes `{{PROJECT_NAME}}`.
- **`template/`** — the scaffolded project. Contains a full Vite+Vue3+TS+wireit build, CLAUDE.md, skills, and an optional Obsidian vault skeleton.

### Rules

- `bin/create.mjs` must have zero runtime dependencies — Node built-ins only
- `template/` is the source of truth for what scaffolded projects look like; keep it in sync with `vite-plugin-vue-template-lang-markdown` patterns
- CLAUDE.md and `.claude/skills/` are always included in the scaffold — never make them optional

## Git

Conventional Commits:

```
feat(cli): ...
feat(template): ...
fix(cli): ...
fix(template): ...
chore(deps): ...
docs(vault): ...
```

## Skills

| Skill | When to use |
|-------|-------------|
| `/commit` | All commits — enforces Conventional Commits |
| `/commit-push-pr` | Opening a PR |
| `/code-review` | Before every PR |
| `/vault-sync` | After updating vault docs |
