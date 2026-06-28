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
│   └── create.mjs      # CLI entry point — zero runtime deps, Node built-ins only
├── template/           # Files copied into the new project
│   ├── package.json    # Wireit + full script surface
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── eslint.config.js
│   ├── prettier.config.js
│   ├── mise.toml
│   ├── .github/workflows/  # CI + release workflows
│   ├── CLAUDE.md           # Always included
│   ├── .claude/skills/     # check-arch, docs, vault-sync
│   └── StaticSite-Vault/   # Optional Obsidian vault skeleton
├── Vault/              # This vault — scaffolder architecture docs
├── .releaserc.json     # semantic-release → publishes @lober-ds/create-vite
└── .github/workflows/
    ├── ci.yml          # lint + validate-template + scaffold-and-build
    └── release.yml     # OIDC Trusted Publishing to npm
```

## CLI Behaviour

1. Read project name from `argv[2]` or prompt interactively
2. Prompt: "Include Obsidian vault skeleton? [Y/n]"
3. Copy `template/` recursively, substituting `{{PROJECT_NAME}}` in all file contents
4. Print next steps

CLAUDE.md and `.claude/skills/` are always included — not optional.

## Template Dependencies

The scaffolded project depends on `@lober-ds/vite-plugin-vue-template-lang-markdown` (private npm). Developers need to be authenticated to the `@lober-ds` npm org to run `npm install` in a scaffolded project.

## Alternatives Considered

See `Alternatives Considered.md`.
