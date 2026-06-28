---
name: check-arch
description: Audit the {{PROJECT_NAME}} codebase for architecture violations — cross-layer coupling, state ownership violations, Options API usage, TypeScript safety. Reports errors, warnings, and info items with file:line references and a summary count. Run before large refactors or before opening a PR.
tools: Bash, Read, Glob, Grep
---

# Architecture Checker

Audit the {{PROJECT_NAME}} codebase for violations of the layer model and code standards defined in CLAUDE.md. Reports each violation with severity, file path, line number, and a one-line explanation.

Run all checks unless the user specifies a subset.

## Checks

### ERROR: Cross-layer imports

Each layer must be independently usable. No layer should import from another.

Identify layer directories in `src/` from the Architecture table in CLAUDE.md, then grep for imports crossing those boundaries.

### ERROR: State in non-page components

Components must not own business data. Only local UI state (hover, focus, open/closed) is acceptable in a component's own `ref()`.

```bash
grep -rn "const .* = ref\|const .* = reactive" src/ --include="*.vue" | grep -v "\.demo\.vue"
```

Review each hit: local UI state is fine; business data that belongs in the `.demo.vue` page is a violation.

### ERROR: Options API usage

```bash
grep -rn "export default {" src/ --include="*.vue"
grep -rn "methods:\s*{\|computed:\s*{\|data()" src/ --include="*.vue"
```

### WARNING: `any` types

```bash
grep -rn ": any\b\|as any\b\| any;" src/ --include="*.ts" --include="*.vue"
```

### WARNING: Missing return types on exported functions

```bash
grep -rn "^export function \|^export const .* = (" src/ --include="*.ts" | grep -v ": [A-Za-z]"
```

Flag exported functions without an explicit return type annotation.

### INFO: `.demo.vue` files without named metadata export

```bash
find . -name "*.demo.vue" | xargs grep -L "export const metadata" 2>/dev/null
```

Files not exporting `metadata` as a named constant break static introspection tooling.

## Output Format

```
## Architecture Audit

### ERRORs (must fix before merge)
- src/layer-b/index.ts:42 — imports from layer-a (cross-layer coupling)

### WARNINGs (should fix)
- src/components/Widget.vue:15 — ref() used for 'items'; should this live in the .demo.vue page?
- src/utils/helpers.ts:8 — exported function 'parseProps' has no explicit return type

### INFO
- Button.demo.vue — no `export const metadata` found; static introspection will not work

---
Summary: 1 error, 2 warnings, 1 info
```

If no violations are found, report clean with the summary line.
