---
name: vault-sync
description: Sync StaticSite-Vault architecture decisions into CLAUDE.md. Use when vault docs have been updated with new design decisions and CLAUDE.md should reflect them. Prompt-driven — lists available docs, previews changes, confirms before writing. Never auto-applies.
tools: Read, Write, Edit, Bash, Glob
---

# Vault Sync

Keep CLAUDE.md in sync with `StaticSite-Vault/Static Site Generator/` as architecture decisions evolve.

CLAUDE.md links to vault docs rather than duplicating them. This skill updates those links and the short summaries alongside them when vault content changes. The vault is always the source of truth — this skill pulls from it, never pushes to it.

## Workflow

### Step 1: List available vault documents

```bash
ls "StaticSite-Vault/Static Site Generator/"
```

Present the list to the user. Ask which documents to pull from. Let them select all or a subset.

### Step 2: Read selected documents

Read each selected vault doc in full. Note:
- New or changed layer descriptions
- New architecture rules or constraints
- Changes to the `.demo.vue` format or named export contract
- New design decisions or revised alternatives

### Step 3: Read current CLAUDE.md

Read `CLAUDE.md` in full. Identify which sections correspond to the selected vault docs.

### Step 4: Preview proposed changes

Show the user exactly what would change — additions, removals, and updates. Format as a diff or clear before/after blocks.

**What to update:**
- Vault links in the Architecture table
- One-line summaries next to each layer
- Architecture rules list (when a new rule is documented or an existing one changes)

**What to never touch:**
- Git workflow section
- Testing section
- TypeScript/Vue standards
- Skills table
- Commands section

Goal: always a vault link + short summary. Never copy full vault content into CLAUDE.md.

### Step 5: Confirm before writing

Present the preview. Ask the user to confirm before applying any changes. Do not auto-apply.

### Step 6: Apply changes

Use Edit to make targeted updates to the relevant CLAUDE.md sections only. Preserve all other content.
