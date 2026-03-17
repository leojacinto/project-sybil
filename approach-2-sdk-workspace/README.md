# Approach 2 — SDK Workspace

**Framework:** React + Vite (proxied to ServiceNow via `@servicenow/sdk` pattern)
**Pattern:** Build Agent generates UI from JSON schema — zero hand-coded component logic

## What This Is

The **Build Agent** pattern. Instead of hand-coding every form field, table column, and action button, you define the entire app in `build-agent/schema.json`. The React components read the schema and auto-generate:

- **SchemaForm** — renders form fields from `fields[]`
- **SchemaTable** — renders columns from `listConfig.columns`
- **ActionButtons** — renders per-row actions from `actions[]` + `states.transitions`
- **StateBadge** — styled from `states.values[].color`
- **Validation** — enforced from `validation[]` rules

## The Key Difference

| SDK Pure (Approach 1) | Build Agent (Approach 2) |
|---|---|
| Hand-code every field | Define in schema.json |
| Edit JSX to add a column | Add entry to `listConfig.columns` |
| Write validation logic | Add rule to `validation[]` |
| Code state transitions | Update `states.transitions` |

**To add a new field**: Add one object to `schema.json → fields[]`. Done. The form, table, and validation auto-update.

## Run

```bash
npm install
npm run dev
# Opens at http://localhost:3002
```

## Schema Analysis

```bash
npm run generate
```

## Features

- ✅ Schema-driven form generation
- ✅ Schema-driven table/list rendering
- ✅ Schema-driven state machine + action buttons
- ✅ Schema-driven validation rules
- ✅ Search & filter (configured via schema)
- ✅ Stats dashboard (auto-computed from states)
- ✅ Full CRUD against ServiceNow Table API

## Limitations

- Requires Vite proxy for CORS (or deploy behind instance)
- Schema changes require page reload (no hot schema swap yet)
- Complex field types (reference lookups) need custom renderers
