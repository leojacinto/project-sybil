# Project Sybil: Travel Request App — April 2026

> **Pilot / Demo only.** This repo benchmarks AI-assisted approaches for building scoped applications on ServiceNow. The Travel Request app is intentionally feature-complete but domain-simple — it exists to benchmark tooling, not to ship. None of these approaches nor their outcomes are production-grade.
>
> This is the **April 2026 run**, using an expanded specification that covers all 32 scoped application component types. The [March 2026 run](archive/README-MAR-2026.md) used a simpler spec and is archived for reference.

---

## Specification

**[Travel Request App Specification v1](specs/travel-app-spec-v1.md)** — 32 component types, 508 lines. Covers tables, ACLs, roles, business rules, client scripts, UI policies, flows, notifications, catalog items, variables, script includes, scripted REST APIs, UI actions, UI pages, workspaces, menus, lists, views, properties, relationships, seed data, data sources, cross-scope privileges, security attributes, security data filters, JS modules, external connections, and ATF tests.

**Instance:** `demoxyz` (credentials in `.env`, gitignored)
**Scope:** `x_snc_apr_trv` (vendor prefix `x_snc_` per instance convention)

---

## Approaches

> **REST approaches (Custom UI, Workspace) have been dropped.** The March 2026 run demonstrated that vanilla REST API calls cannot reliably create records inside a scoped `sys_app` — records land in the global scope regardless of `sys_scope` field values or session preferences. This is a structural platform limitation, not a fixable bug. REST approaches are no longer pursued.
>
> **Build Agent Custom UI has been collapsed into Build Agent.** The spec includes both UI Pages and Workspaces as component types. Since Build Agent creates all 32 component types from a single prompt regardless of UI target, running separate "Custom UI" and "Workspace" variants would produce identical output. A single Build Agent run covers both.

| | **SDK Primed** | **SDK Cold** | **Build Agent** |
|---|---|---|---|
| **AI model** | Claude (via Cascade) | Claude (via Cascade) | Now Assist Build Agent |
| **Method** | ServiceNow SDK v4.5 (`@servicenow/sdk`) | ServiceNow SDK v4.5 (`@servicenow/sdk`) | Platform-native skills |
| **Prior context** | Full experiment design, March results, SDK docs pre-read | Spec file only — fresh session, no prior knowledge | Spec prompt only |
| **Scope creation** | From Windsurf (SDK) | From Windsurf (SDK) | Inside SN IDE |
| **Target** | SDK-bundled UI + Workspace | SDK-bundled UI + Workspace | Full app + Workspace with dashboard |
| **Status** | **Complete — 32/32** | **Complete — 32/32** | **Complete — 32/32** |
| **Assets** | [apr-2026-approach-3-sdk/](apr-2026-approach-3-sdk/) | [apr-2026-approach-3b-sdk/](apr-2026-approach-3b-sdk/) | [apr-2026-approach-5-buildagent-workspace/](apr-2026-approach-5-buildagent-workspace/) |

> **Context-primed vs cold spec (SDK only):**
>
> - **SDK Primed:** The AI had accumulated significant prior context before writing any code — it designed the experiment, analysed the March 2026 failures, pre-read every SDK Fluent API `.d.ts` file (~20 files), and already knew the scope mapping and project plan. This simulates a developer who has studied the framework documentation and codebase before starting.
> - **SDK Cold:** A fresh Cascade session with **no prior context**. The AI received only the spec file and SDK access — no experiment history, no pre-read documentation, no knowledge of gotchas or workarounds (except being told to copy `node_modules` from the March archive, since the private npm registry is an infrastructure blocker, not a knowledge one). This simulates a cold handoff to a new developer.
>
> Comparing SDK Primed vs SDK Cold isolates the effect of contextual priming on code-generation quality, time, and token cost.

---

## Development Cost

| Approach | Wall Clock (active) | Tokens (est.) | Sessions | Score | Notes |
|----------|-------------------:|-------------:|:--------:|:-----:|-------|
| **SDK Primed** | ~135 min | ~500k | 5 | 32/32 | Context-primed; 3 deploy iterations to perfect score |
| **SDK Cold** | ~125 min | ~450k | 3 | 32/32 | Cold spec; 3 deploy iterations to perfect score |
| **Build Agent** | ~50 min | 550 assists | 1 | 32/32 | One-shot; includes workspace dashboard; refined UI Page from Jelly to React |

**SDK Primed session breakdown** ([detailed log](docs/approach-3a-development-log.md)):

| Session | Time | Tokens | Work |
|---------|-----:|-------:|------|
| 1. Experiment setup | ~20 min | ~40k | Read spec, validate March results, create scope |
| 2. SDK doc pre-read | ~25 min | ~60k | Read 20+ Fluent API `.d.ts` files |
| 3. Code generation | ~30 min | ~150k | Write 30 `.now.ts` files (all 32 component types) |
| 4. CLI unblock + TS fixes | ~40 min | ~150k | Copy `node_modules` from March archive, fix ~15 TS errors |
| 5. Deploy + iterative fixes | ~20 min | ~100k | 3 deploys: 25/32 → 30/32 → 32/32 |

**SDK Cold session breakdown** ([detailed log](docs/approach-3b-development-log.md)):

| Session | Time | Tokens | Work |
|---------|-----:|-------:|------|
| 1. Setup + core components | ~60 min | ~200k | Read spec, discover SDK APIs on-demand, write 16 `.now.ts` files |
| 2. Remaining components + build fix | ~40 min | ~150k | Write 7 more files, fix ~18 TS errors, first successful build |
| 3. Deploy + iterative fixes | ~25 min | ~100k | 3 deploys: 31/32 → 31/32 → 32/32 |

**Build Agent session breakdown:**

| Session | Time | Assists | Work |
|---------|-----:|--------:|------|
| 1. Full build | ~50 min | 550 | All 32 component types + configurable workspace with dashboard — single prompt; includes Jelly→React refinement for UI Page |

> Token estimates are approximate — Cascade does not expose exact counts. Estimates are based on conversation complexity, tool call volume, and output size per session. See development logs for per-session details, error catalogs, and key findings: [SDK Primed](docs/approach-3a-development-log.md) | [SDK Cold](docs/approach-3b-development-log.md).

### SDK Primed vs SDK Cold: Did Context Priming Help?

| Metric | SDK Primed | SDK Cold | Delta |
|--------|:-----------:|:---------:|:-----:|
| Wall clock | ~135 min | ~125 min | Cold **10 min faster** |
| Tokens | ~500k | ~450k | Cold **50k cheaper** |
| Sessions | 5 | 3 | Cold **2 fewer** |
| First deploy score | 25/32 | 31/32 | Cold **6 more** on first try |
| Deploys to 32/32 | 3 | 3 | Tied |

**Context priming added cost without proportionally reducing downstream work.** SDK Primed spent ~100k tokens on overhead that SDK Cold skipped entirely: experiment design (~40k) and bulk pre-reading 20+ SDK `.d.ts` files (~60k). The cold-start approach discovered APIs on-demand — reading type definitions only when needed for the component it was writing — which turned out to be more token-efficient than reading everything upfront.

**SDK Cold scored higher on first deploy** (31/32 vs 25/32), suggesting that on-demand API discovery produced fewer table-mismatch errors than bulk pre-reading. However, SDK Primed pioneered the workarounds (private npm registry, Fluent compiler type conflicts, seed data install flags) that informed SDK Cold’s prompt — SDK Cold was told to copy `node_modules` from the March archive, which saved it from discovering the CLI blocker independently.

**Important caveat:** Both SDK approaches deployed to the same scope (`x_snc_apr_trv`). SDK Cold’s verification counts are exactly 2× those of SDK Primed (e.g., 26 ACLs vs 13, 44 seed records vs 22), confirming that SDK Cold’s records stacked on top of SDK Primed’s. This means SDK Cold’s seed data pass may have been aided by SDK Primed’s existing records on the instance. A clean-scope test would be needed to fully control for this.

**API discovery vs built-in knowledge:** Cascade (both SDK approaches) had to discover the SDK’s Fluent API surface by reading raw TypeScript `.d.ts` files — either upfront (Primed) or on-demand (Cold). By contrast, ServiceNow’s Build Agent has a curated internal **knowledge source** that documents every object schema (Table, Column, Flow, etc.) with property names, types, and constraints. The Build Agent activates a skill, pulls the relevant schema, and knows the exact shape of what it can create — zero discovery tokens spent. This is a structural advantage confirmed by the Build Agent results.

**Takeaway:** For this task size (~30 files, 32 component types), a well-written spec plus on-demand API discovery outperformed extensive upfront documentation study. The cold-start approach was messier but faster because it skipped the preamble and learned by doing.

### Build Agent vs SDK: Platform-Native Wins

| Metric | SDK Primed | SDK Cold | Build Agent | Delta (BA vs best SDK) |
|--------|:-----------:|:---------:|:----------:|:-----:|
| Wall clock | ~135 min | ~125 min | ~50 min | **2.5× faster** |
| Cost unit | ~500k tokens | ~450k tokens | 550 assists | Not directly comparable |
| Prompts/sessions | 5 | 3 | 1 | **One-shot** |
| Deploys to 32/32 | 3 | 3 | 1 | **No iteration** |
| Workspace dashboard | ❌ | ❌ | ✅ | Build Agent only |

**Build Agent delivered in one prompt what SDK took 3–5 sessions to achieve.** The SDK approaches required: reading the spec, discovering the Fluent API surface, writing ~30 TypeScript files, fixing compiler errors, resolving npm registry blockers, and iterating across multiple deploys. Build Agent consumed the same spec and executed directly against the platform — no intermediate code, no compilation step, no deployment pipeline.

**UI Pages remain the hardest component to land.** The spec asks for React UI Pages (Section 16). In the March run, the SDK produced UI Pages that rendered but showed no data — a partial success. In April, the SDK generated UI Page `.now.ts` files in `dist/`, but `npx now-sdk install` did not persist them to the instance — they may have existed transiently and were lost on a subsequent deploy. The verify script still shows ✅ for UI Pages based on `sys_ui_page` record existence, but the pages are not functional on the live instance. Build Agent initially generated Jelly-based pages (the traditional format) and was refined with an additional prompt to convert to React (+10 min, ~50 assists). Further SDK UI troubleshooting was skipped — the March experiment already proved it's solvable with iterative effort, and the time was better spent on components with higher signal for the SDK-vs-Build-Agent comparison.

**The workspace dashboard is the clearest qualitative gap.** SDK Fluent API cannot configure workspace dashboards — those are UI-assembled artifacts with no code representation. Build Agent created a fully functional configurable workspace with dashboard cards, list/record/dashboard pages, and navigation in the same prompt that built everything else. The SDK approaches scored 32/32 only because the verification script checks for `sys_ux_app_config` existence, not dashboard content.

**Cost metrics are not directly comparable.** SDK approaches are measured in tokens (LLM inference cost); Build Agent is measured in Now Assists (platform-metered actions). A single Now Assist can create an entire table with all columns — an operation that costs thousands of tokens in the SDK path. The 550 assists for Build Agent represent ~550 discrete platform mutations (including a Jelly→React refinement pass for UI Pages), whereas ~450k–500k tokens represent the full LLM reasoning chain including API discovery, code generation, error diagnosis, and retry logic.

**Why Build Agent is faster — structural advantages:**
1. **Zero API discovery cost** — built-in knowledge sources document every object schema
2. **No compilation step** — objects are created directly on the platform, no TypeScript → deploy pipeline
3. **No error-retry loop** — Build Agent validates against its own schema before creating; SDK approaches hit runtime TS errors and needed iterative fixes
4. **Native workspace support** — dashboards, screen types, and routes are first-class operations, not unsupported edge cases

**Caveat:** Build Agent operates inside a controlled platform environment with purpose-built skills. SDK approaches use a general-purpose LLM writing against a third-party TypeScript API — a fundamentally harder task. The comparison measures end-to-end delivery efficiency, not raw AI capability.

---

## Scope Naming

The instance `demoxyz` assigns vendor prefix `x_snc_`. The new app scope is **`x_snc_apr_trv`** to avoid collision with existing travel apps (`x_snc_travel`, `x_snc_travel_a2b`, `x_snc_travel_rl4by`, `x_snc_travel_romlk`).

All table names in the spec (e.g., `x_demo_travel_request`) map to `x_snc_apr_trv_request` etc. at implementation time.

---

## Key Differences from March 2026 Run

| | March 2026 | April 2026 |
|---|---|---|
| **Spec complexity** | ~8 component types (table, BRs, ACLs, UI page, workspace, sample data) | 32 component types (full scoped app inventory) |
| **Spec document** | Informal prompts per approach | [Formal spec](specs/travel-app-spec-v1.md) shared across all approaches |
| **Scope prefix** | `x_snc_travel` | `x_snc_apr_trv` |
| **Tables** | 1 (travel_request) | 4 (request, expense, policy, delegation) |
| **Flows** | None | 3 (approval, finance escalation, reimbursement) |
| **Scripted REST** | SDK only | All approaches |
| **ATF tests** | None | 11 tests across 4 categories |
| **Catalog** | None | Catalog item + variable sets + catalog scripts |

---

## Results

<!-- RESULTS:START - Auto-generated by scripts/verify.py -->

| Approach | Latest Run | Score | Tokens | Wall Clock | Trend |
|----------|-----------|-------|-------:|------------|-------|
| **SDK Primed** | Run 4 | **32/32** | 500,000 (500,000 total) | 2h 15m (2h 15m total) | 25/32 → 30/32 → 32/32 → 32/32 |
| **SDK Cold** | Run 4 | **32/32** | 450,000 (450,000 total) | 2h 5m (2h 5m total) | 31/32 → 31/32 → 32/32 → 32/32 |
| **Build Agent** | Run 1 | **32/32** | 550 | 50m 0s | 32/32 |

<details>
<summary><strong>SDK Primed</strong> — 32/32 | Run 4 | 500,000 tokens | 2h 15m</summary>

| Component | Status | Found | Expected |
|-----------|--------|------:|--------:|
| Tables & columns | ✅ | 4 | 4 |
| Access control lists (ACLs) | ✅ | 13 | 11 |
| Roles | ✅ | 4 | 4 |
| Business rules | ✅ | 7 | 7 |
| Client scripts | ✅ | 6 | 3 |
| UI policies | ✅ | 5 | 3 |
| Flows (Workflow Automation) | ✅ | 3 | 3 |
| Email notifications | ✅ | 5 | 5 |
| Service catalog items | ✅ | 1 | 1 |
| Variables & variable sets | ✅ | 2 | 2 |
| Catalog client scripts | ✅ | 3 | 3 |
| Catalog UI policies | ✅ | 2 | 2 |
| Script includes | ✅ | 3 | 3 |
| Scripted REST APIs | ✅ | 1 | 1 |
| UI actions | ✅ | 5 | 5 |
| UI pages (React) | ✅ | 2 | 2 |
| UI formatters (built-in) | ✅ | 2 | 2 |
| Workspaces | ✅ | 1 | 1 |
| Application menus & modules | ✅ | 1 | 1 |
| Lists | ✅ | 5 | 4 |
| List controls | ✅ | 3 | 3 |
| Views & view rules | ✅ | 3 | 3 |
| Properties | ✅ | 5 | 5 |
| Relationships | ✅ | 4 | 4 |
| Records (seed data) | ✅ | 22 | 22 |
| Data sources & import maps | ✅ | 2 | 2 |
| Cross-scope privileges | ✅ | 6 | 4 |
| Security attributes | ✅ | 1 | 1 |
| Security data filters | ✅ | 2 | 2 |
| JS modules | ✅ | 2 | 2 |
| LDAP / external connections | ✅ | 1 | 1 |
| ATF tests (11 categories) | ✅ | 11 | 11 |

</details>

<details>
<summary><strong>SDK Cold</strong> — 32/32 | Run 4 | 450,000 tokens | 2h 5m</summary>

| Component | Status | Found | Expected |
|-----------|--------|------:|--------:|
| Tables & columns | ✅ | 4 | 4 |
| Access control lists (ACLs) | ✅ | 26 | 11 |
| Roles | ✅ | 4 | 4 |
| Business rules | ✅ | 14 | 7 |
| Client scripts | ✅ | 12 | 3 |
| UI policies | ✅ | 10 | 3 |
| Flows (Workflow Automation) | ✅ | 6 | 3 |
| Email notifications | ✅ | 10 | 5 |
| Service catalog items | ✅ | 2 | 1 |
| Variables & variable sets | ✅ | 2 | 2 |
| Catalog client scripts | ✅ | 6 | 3 |
| Catalog UI policies | ✅ | 4 | 2 |
| Script includes | ✅ | 6 | 3 |
| Scripted REST APIs | ✅ | 2 | 1 |
| UI actions | ✅ | 10 | 5 |
| UI pages (React) | ✅ | 4 | 2 |
| UI formatters (built-in) | ✅ | 4 | 2 |
| Workspaces | ✅ | 2 | 1 |
| Application menus & modules | ✅ | 2 | 1 |
| Lists | ✅ | 9 | 4 |
| List controls | ✅ | 6 | 3 |
| Views & view rules | ✅ | 17 | 3 |
| Properties | ✅ | 5 | 5 |
| Relationships | ✅ | 8 | 4 |
| Records (seed data) | ✅ | 44 | 22 |
| Data sources & import maps | ✅ | 4 | 2 |
| Cross-scope privileges | ✅ | 6 | 4 |
| Security attributes | ✅ | 2 | 1 |
| Security data filters | ✅ | 2 | 2 |
| JS modules | ✅ | 4 | 2 |
| LDAP / external connections | ✅ | 2 | 1 |
| ATF tests (11 categories) | ✅ | 22 | 11 |

</details>

<details>
<summary><strong>Build Agent</strong> — 32/32 | Run 1 | 550 assists | 50m 0s</summary>

| Component | Status | Found | Expected |
|-----------|--------|------:|--------:|
| Tables & columns | ✅ | 4 | 4 |
| Access control lists (ACLs) | ✅ | 12 | 11 |
| Roles | ✅ | 4 | 4 |
| Business rules | ✅ | 7 | 7 |
| Client scripts | ✅ | 6 | 3 |
| UI policies | ✅ | 5 | 3 |
| Flows (Workflow Automation) | ✅ | 3 | 3 |
| Email notifications | ✅ | 5 | 5 |
| Service catalog items | ✅ | 1 | 1 |
| Variables & variable sets | ✅ | 2 | 2 |
| Catalog client scripts | ✅ | 3 | 3 |
| Catalog UI policies | ✅ | 2 | 2 |
| Script includes | ✅ | 3 | 3 |
| Scripted REST APIs | ✅ | 1 | 1 |
| UI actions | ✅ | 5 | 5 |
| UI pages (React) | ✅ | 2 | 2 |
| UI formatters (built-in) | ✅ | 2 | 2 |
| Workspaces | ✅ | 1 | 1 |
| Application menus & modules | ✅ | 1 | 1 |
| Lists | ✅ | 4 | 4 |
| List controls | ✅ | 3 | 3 |
| Views & view rules | ✅ | 3 | 3 |
| Properties | ✅ | 5 | 5 |
| Relationships | ✅ | 4 | 4 |
| Records (seed data) | ✅¹ | 20 | 22 |
| Data sources & import maps | ✅ | 2 | 2 |
| Cross-scope privileges | ✅ | 4 | 4 |
| Security attributes | ✅¹ | 1 | 1 |
| Security data filters | ✅¹ | 2 | 2 |
| JS modules | ✅¹ | 2 | 2 |
| LDAP / external connections | ✅ | 1 | 1 |
| ATF tests (11 categories) | ✅ | 11 | 11 |

¹ *Verify script had detection gaps for these components (naming convention or query mismatch). Confirmed present by manual inspection in the instance.*

</details>

<!-- RESULTS:END -->

---

## Archive

The March 2026 run (simple spec, 5 approaches) is preserved in [archive/](archive/):
- [archive/README-MAR-2026.md](archive/README-MAR-2026.md)
- `archive/mar-2026-approach-1-rest-custom-ui/`
- `archive/mar-2026-approach-2-rest-workspace/`
- `archive/mar-2026-approach-3-sdk/`
- `archive/mar-2026-approach-4-buildagent-custom-ui.md`
- `archive/mar-2026-approach-5-buildagent-workspace.md`

---

## Excluded Approaches

**REST Custom UI and REST Workspace** attempted to build the scoped app entirely via ServiceNow REST API calls from Windsurf. Both were tested in the March 2026 run.

**Why they failed:** The ServiceNow REST API cannot reliably create records inside a `sys_app` scope. Records created via REST land in the global scope regardless of `sys_scope` field values, session scope preferences, or `X-UserToken` headers. This was discovered empirically during the March run.

**Why they are excluded from April results:** Since REST approaches are fundamentally unsuitable for building scoped apps — a structural platform limitation, not a fixable bug — they were dropped from the April experiment. No new implementation work was done for REST approaches in April.
