# Alternatives Considered

## Chain off Vite's scaffolder vs. maintain our own template

**Decision:** Chain off `npx create-vite@latest --template vue-ts`, then layer our additions.

| Alternative | Why rejected |
|-------------|-------------|
| Maintain a full Vite template (index.html, tsconfig triple, vite.config) | We end up duplicating what Vite already generates and maintaining it across Vite version bumps |
| Use a Vite plugin to customise an existing scaffold | Vite plugins run at build time, not scaffold time |

**Constraint:** We lock in to the `vue-ts` template because our skills (check-arch, docs, vault-sync) and CLAUDE.md Vue Standards section are Vue-specific. Supporting React/Vanilla would require framework-aware skills — deferred to later.

---

## Opt-in vs. opt-out for optional features

**Decision:** Default yes (`[Y/n]`) for tools most projects want (ESLint, Prettier, mise, wireit, Vitest, Playwright, CI); default no (`[y/N]`) for specialised tools (semantic-release, Obsidian vault).

| Alternative | Why rejected |
|-------------|-------------|
| All features opt-out (original behaviour) | Forces users to know to say N; surprising when not using Obsidian |
| All features opt-in | Too many prompts to get a working project; most teams want ESLint/Prettier/CI |
| Single "minimal" vs. "full" preset | Loses the per-feature granularity users asked for |

---

## Vault name: substitution variable vs. post-scaffold rename

**Decision:** Add `{{VAULT_NAME}}` as a substitution variable alongside `{{PROJECT_NAME}}`, and rename the `StaticSite-Vault/` directory in the destination path at copy time.

| Alternative | Why rejected |
|-------------|-------------|
| Hardcode `StaticSite-Vault` and let users rename manually | Every .gitignore entry, skill, and CLAUDE.md reference breaks; error-prone |
| Rename only the directory, not file contents | Skills and CLAUDE.md would still reference the wrong name |
| Use a post-scaffold `find \| sed` pass | Fragile on macOS vs. Linux; harder to reason about |

---

## Conditional template sections: marker blocks vs. multiple template variants

**Decision:** Use `{{#FLAG}}...{{/FLAG}}` inline markers in template files, stripped by the CLI's `interpolate()` function.

| Alternative | Why rejected |
|-------------|-------------|
| Multiple template files per feature (e.g. CLAUDE.vault.md, CLAUDE.no-vault.md) | Duplicates content; easy to forget to update both |
| Post-process files with a full template engine (Handlebars, EJS) | Adds a runtime dependency; the CLI must stay zero-deps |
| Always include all content, document "skip if feature not installed" | Misleading — e.g. the "Reading the Vault First" section in CLAUDE.md links to a directory that doesn't exist |

---

## Package.json merge: in-code vs. template JSON files

**Decision:** Build the merged `package.json` in code (`mergePackageJson()` in `bin/create.mjs`), reading Vite's generated file and adding our entries programmatically.

| Alternative | Why rejected |
|-------------|-------------|
| Template package.json with `{{#ESLINT}}` markers | JSON doesn't have comments; marker blocks produce invalid JSON until processed |
| Separate `pkg/eslint.json`, `pkg/prettier.json` data files in template/ | Another layer of indirection; still need code to merge them |
| Single opinionated package.json (original approach) | Can't express optional features cleanly |

---

## Skipping vault-sync skill when vault not included

**Decision:** Skip `template/vault-skill/` entirely when vault is not selected.

| Alternative | Why rejected |
|-------------|-------------|
| Always include vault-sync, add a guard at the top of the skill | Skill would still appear in CLAUDE.md and confuse users who have no vault |
| Include vault-sync but with no-op behaviour | A skill that silently does nothing is harder to debug than one that isn't there |
