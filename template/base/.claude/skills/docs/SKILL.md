---
name: docs
description: Documentation scaffolding for {{PROJECT_NAME}}. Two modes — `internal` scaffolds a new vault architecture decision doc; `public` scaffolds a .demo.vue consumer-facing doc page or audits coverage across a layer.
tools: Read, Write, Bash, Glob
---

# {{PROJECT_NAME}} Docs

Generate documentation. Two modes:

- **`/docs internal`** — scaffold a new architecture decision doc in the vault
- **`/docs public`** — scaffold a `.demo.vue` consumer-facing doc page, or audit coverage for a layer

If the user doesn't specify a mode, ask which they want.

---

## Mode: `internal` — Vault Architecture Doc

Scaffold a new doc in `{{VAULT_NAME}}/Static Site Generator/`. Check that a doc for this topic doesn't already exist before creating one.

Ask the user for the topic and decision summary before writing.

### Template

```markdown
# [Topic]

> Status: Draft

## Problem

[What question does this document answer? What constraint or need prompted this decision?]

## Decision

[The chosen approach, stated plainly.]

## Rationale

[Why this approach over the alternatives?]

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| ... | ... |

## Constraints

[What must remain true for this decision to hold? What would cause us to revisit it?]
```

After writing, remind the user to run `/vault-sync` to pull the new decision into CLAUDE.md if it affects the layer model or architecture rules.

---

## Mode: `public` — Consumer-Facing Doc Page

Public docs are `.demo.vue` files. They run through `vite-plugin-vue-template-lang-markdown` and become the live docs site.

### Sub-commands

- **`/docs public new [Name]`** — scaffold a `.demo.vue` doc page for a specific exported component or function
- **`/docs public audit [layer]`** — check coverage: every public export in the layer should have a `.demo.vue` doc page

### `new` — Scaffold a Doc Page

Ask the user for the component or function name and which layer it belongs to. Read the source file before writing the doc page so the template values are accurate.

**File location:** `src/docs/[layer-name]/[ComponentName].demo.vue`

### `.demo.vue` Doc Page Template

```vue
<script>
export const metadata = {
  title: '[Component or Function Name]',
  description: '[One sentence: what it does and when to use it]',
  tags: ['[layer-name]'],
  category: 'api',  // 'api' | 'guide' | 'example'
}
</script>

<script setup>
import { ref } from 'vue'
// Import the thing being documented

const controls = ref({
  // one key per interactive prop
})
</script>

<template lang="md">
# [Name]

[One paragraph: what it does, why it exists, when to use it.]

## Usage

\`\`\`ts
// Minimal import + usage example
\`\`\`

## Live Demo

<!-- Embed the live component or interactive function demo here -->

## Props / Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Examples

[Additional examples for common patterns or edge cases]
</template>
```

### Doc Page Standards

Every public doc page must have:
- `metadata.tags` including the layer name
- At least one live demo (not just a code snippet)
- A props/params table if the export has parameters
- No hardcoded demo state — interactive props use `ref()`
- Prose in `<template lang="md">`, not a separate `.md` file

### `audit` — Coverage Check

```bash
# Find exports in the layer
grep -rn "^export function \|^export const \|^export class \|^export type \|^export interface " src/[layer]/ --include="*.ts"

# Find existing doc pages
find . -name "*.demo.vue"
```

Report format:
```
## Doc Coverage: [layer]

✓ myFunction — MyFunction.demo.vue
✗ helperUtil — no doc page (run `/docs public new helperUtil`)

Coverage: 1/2 exports documented
```
