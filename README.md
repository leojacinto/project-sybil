# Travel Request App - Approach Comparison

> **Pilot / Demo only.** This repo compares how AI-assisted approaches perform when building on ServiceNow, and what platform-native tooling unlocks. The Travel Request app is intentionally simple -- it exists to benchmark tooling, not to ship. None of these approaches nor their outcomes are production-grade.

---

## The Journey

An external AI agent (Claude Opus via Cascade) tried three paths to build a Travel Request app on ServiceNow. First, raw REST API calls to create a custom UI page -- it worked, but took ~2 hours and 4 failed iterations to land on a UI pattern that ServiceNow would render. Second, the same REST approach to build a native workspace -- it could not cross the finish line; the workspace framework requires ~20 interdependent records that sit below the REST API surface. Third, the ServiceNow SDK (`now-sdk`) with Fluent TypeScript -- it deployed the entire data foundation (table, business rules, ACLs, sample data) in ~18 minutes from a single prompt, but the SDK-bundled UI page could not load data at runtime.

Then ServiceNow's own Build Agent attempted the same deliverables from inside the platform. It delivered a working custom UI from a single prompt in ~20 minutes and a full workspace in 5 prompts under 15 minutes.

**The pattern is clear: the data foundation is easy for any AI agent. The UI is the hard part.** Even with the right external tooling, delivering a cohesive working UI from outside ServiceNow requires significant iteration or hits a wall entirely. Build Agent operates natively where it matters most.

---

## Approaches

| | **1: REST Custom UI** | **2: REST Workspace** | **3: SDK Custom UI** | **4: Build Agent Custom UI** | **5: Build Agent Workspace** |
|---|---|---|---|---|---|
| **AI model** | Claude Opus | Claude Opus | Claude Opus | Build Agent (GPT Large) | Build Agent (GPT Large) |
| **Method** | REST API (via Cascade) | REST API (via Cascade) | ServiceNow SDK (`now-sdk`) | Platform-native | Platform-native |
| **Delivery** | Jelly XML UI Page | React components (no workspace) | SDK-bundled UI Page | React UI Page | Workspace |
| **Prompts** | Multiple iterations | Multiple iterations | 1 prompt, 4 build fixes, 2 deploy fixes | 1 prompt | 5 prompts |
| **Wall-clock** | ~2 hours | ~3 hours (incomplete) | ~18 minutes | ~20 minutes | < 15 minutes |
| **Status** | <span style="color:#22c55e">Working</span> | <span style="color:#ef4444">Incomplete</span> | <span style="color:#f59e0b">Partial</span> (backend only) | <span style="color:#22c55e">Working</span> | <span style="color:#22c55e">Working</span> |
| **Assets** | [approach-1-sdk-custom-ui/](approach-1-sdk-custom-ui/) | [approach-2-sdk-workspace/](approach-2-sdk-workspace/) | [approach-3-sdk/](approach-3-sdk/) | [approach-4-buildagent-custom-ui.md](approach-4-buildagent-custom-ui.md) | [approach-5-buildagent-workspace.md](approach-5-buildagent-workspace.md) |

---

## 1. Cost & Time

| | **Approach 1** | **Approach 2** | **Approach 3** | **Approach 4** | **Approach 5** |
|---|---|---|---|---|---|
| **Model** | Claude Opus | Claude Opus | Claude Opus | Build Agent | Build Agent |
| **Effort** | ~12,000 tokens total | ~15,000+ tokens total | 1 prompt + 6 fixes | 27 assists, 70+ tool calls | 5 prompts, 62 tool calls |
| **Wall-clock** | ~2 hours | ~3 hours (incomplete) | ~18 minutes | ~20 minutes | < 15 minutes |
| **Iterations** | 4 failed, then working | 3 pivots, still no workspace | 4 build fixes + 2 deploy fixes | First run worked | First run worked |
| **Outcome** | Working Jelly UI Page | Components only | Backend deployed, UI incomplete | Working React UI Page | Full workspace + dashboard |

> **Note on units.** Cascade (Approaches 1-3) is measured in tokens or prompt/fix cycles because it operates through an LLM coding assistant. Build Agent (Approaches 4-5) is measured in prompts and tool calls because it operates through a conversational UI inside ServiceNow. These are not directly comparable, but both reflect total effort to reach a working app.

**Where the time went: the UI.** Data model creation (table, fields, business rules) was fast in every approach -- minutes, not hours. The cost difference was always in the UI layer:

- **Approach 1 (REST Custom UI):** 4 failed iterations over ~2 hours. UI Pages require Jelly XML with server-side `<g:evaluate>` blocks, CSRF tokens, and form POST writes -- patterns that are not obvious from the REST API surface.
- **Approach 2 (REST Workspace):** Could not finish. The workspace framework involves ~20 interdependent records across 10+ tables with tightly coupled JSON configs. This sits below the REST API layer.
- **Approach 3 (SDK Custom UI):** The SDK deployed the entire data foundation from a single prompt in ~18 minutes (table, 4 business rules, 4 ACLs, app menu, 5 sample records). But the SDK-bundled UI page could not load records at runtime -- the client-side REST calls required additional cross-scope configuration beyond the SDK's default scaffold.
- **Approaches 4-5 (Build Agent):** Working apps in under 20 minutes each. No iterations. No auth issues. No CSRF debugging. No SDK type mismatches. Build Agent operates inside ServiceNow where UI rendering, workspace assembly, and business rule wiring are native operations.

---

## 2. Feature Matrix

| Feature | **1: REST UI** | **2: REST WS** | **3: SDK UI** | **4: BA UI** | **5: BA WS** |
|---|---|---|---|---|---|
| Custom table + fields | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> |
| Business Rules | <span style="color:#22c55e">Yes</span> | <span style="color:#ef4444">No</span> | <span style="color:#22c55e">Yes</span> (4 BRs) | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> |
| ACLs | <span style="color:#ef4444">No</span> | <span style="color:#ef4444">No</span> | <span style="color:#22c55e">Yes</span> (4 ACLs) | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> |
| Sample data | <span style="color:#22c55e">Yes</span> | <span style="color:#ef4444">No</span> | <span style="color:#22c55e">Yes</span> (5 records) | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> |
| Working UI Page | <span style="color:#22c55e">Yes</span> (Jelly) | <span style="color:#ef4444">No</span> | <span style="color:#ef4444">No</span> (renders, no data) | <span style="color:#22c55e">Yes</span> (React) | N/A |
| Workspace | N/A | <span style="color:#ef4444">Attempted</span> | N/A | N/A | <span style="color:#22c55e">Yes</span> |
| Dashboard / Stats | <span style="color:#22c55e">Yes</span> (stats row) | <span style="color:#ef4444">No</span> | <span style="color:#22c55e">Yes</span> (stats row, no data) | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> |
| List view | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> (standalone) | <span style="color:#22c55e">Yes</span> (no data) | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> (native) |
| Form / Create | <span style="color:#22c55e">Yes</span> (modal) | <span style="color:#22c55e">Yes</span> (standalone) | <span style="color:#22c55e">Yes</span> (modal) | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> (native) |
| Action buttons | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> |
| Search / Filter | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> | <span style="color:#22c55e">Yes</span> (native) |
| Polaris / Mobile / Upgrade-safe | No / No / Partial | No / No / No | No / No / Partial | No / No / Partial | Yes / Yes / Yes |

---

## 3. Iteration Paths

### Approach 1 -- REST API Custom UI (~2 hours)

4 failed iterations before the working version. See [approach-1-sdk-custom-ui/](approach-1-sdk-custom-ui/).

1. **Raw HTML** -- blank page (UI Pages require Jelly XML)
2. **Client-side XHR** -- 401 (CSRF enforcement on `direct=true` pages)
3. **GlideAjax** -- blocked (cross-scope Script Include access)
4. **Jelly XML partial** -- vars not injecting (`client_script` field not Jelly-processed)
5. **Final: Jelly XML + `<g:evaluate>` + form POST** -- working

### Approach 2 -- REST API Workspace (~3 hours, incomplete)

Cascade produced functional React components (forms, tables, state machine, validation). But the workspace framework requires ~20 interdependent records across 10+ tables (`sys_ux_app_config`, `sys_ux_page_registry`, `sys_ux_screen_type`, `sys_ux_app_route`, `sys_ux_screen`, `sys_ux_page_property`). These tightly coupled configurations sit below the REST API layer. See [approach-2-sdk-workspace/](approach-2-sdk-workspace/).

### Approach 3 -- SDK Custom UI (~18 minutes, partial)

Claude Opus scaffolded the full app from a single prompt using the ServiceNow SDK. The data foundation deployed successfully. The UI rendered but could not load data. See [approach-3-sdk/](approach-3-sdk/).

1. **Initial scaffold** -- build failed (SDK bundler expected `<script src="./app.ts">` entry point)
2. **Restructured to client app** -- build failed (15 type errors: `PriceColumn` missing, `ChoiceColumn` format wrong, `ReferenceColumn` uses `referenceTable`, `BusinessRule` uses `action` array, `Module` missing)
3. **Fixed types** -- build failed (`DecimalColumn` requires numbers, not strings)
4. **Fixed numbers** -- build succeeded
5. **First deploy** -- failed (SDK needs `sys_app` record, not `sys_scope`)
6. **Created sys_app** -- deploy succeeded
7. **UI Page loaded** -- stats and table render, but REST API calls return no data (cross-scope access)

**Deployed artifacts:** table (extends task), 8 fields, 4 business rules, 4 ACLs, application menu, 5 sample records, bundled UI page.

**Limitation:** Cross-scope REST API access requires additional configuration beyond the SDK's default scaffold. The data foundation works; the UI delivery from outside the platform requires further platform setup.

---

## 4. Platform Behaviors Encountered (External Route)

| # | Behavior | Approach | External limitation? |
|---|---|---|---|
| 1 | UI Pages require Jelly XML, not raw HTML | 1 | Yes (discoverable) |
| 2 | CSRF enforcement on `direct=true` pages | 1 | No (expected security) |
| 3 | `client_script` field not Jelly-processed | 1 | Yes (discoverable) |
| 4 | Workspace requires ~20 interdependent `sys_ux_*` records | 2 | No (platform internals) |
| 5 | `sys_ux_screen` linkage to OOB macroponents required | 2 | No (platform internals) |
| 6 | SDK Fluent API types required adjustments for v4.4.0 compatibility | 3 | Yes (discoverable) |
| 7 | SDK bundler requires `<script src>` entry point | 3 | Yes (discoverable) |
| 8 | `now-sdk install` requires `sys_app`, not `sys_scope` | 3 | Yes (discoverable) |
| 9 | SDK-bundled UI requires additional cross-scope configuration for runtime REST data access | 3 | Yes (additional configuration step) |

Items #1-3 and #6-9 are external agent limitations -- friction that Build Agent never encounters because it operates natively. Items #4-5 are platform internals that Build Agent abstracts away.

---

## 5. Bottom Line

**The data foundation is easy. The UI is the hard part.**

Every approach -- REST, SDK, or Build Agent -- created the data model (table, fields, business rules) quickly. The differentiator is delivering a **cohesive, working UI** that users actually interact with.

| | Data foundation | Working UI |
|---|---|---|
| **Approach 1** (REST Custom UI) | Minutes | ~2 hours (4 iterations) |
| **Approach 2** (REST Workspace) | Minutes | Could not finish |
| **Approach 3** (SDK Custom UI) | ~18 minutes (1 prompt) | Backend complete, UI requires additional scope configuration |
| **Approach 4** (Build Agent Custom UI) | Minutes | ~20 minutes (1 prompt, zero fixes) |
| **Approach 5** (Build Agent Workspace) | Minutes | < 15 minutes (5 prompts, zero fixes) |

The SDK (Approach 3) closed the gap significantly over raw REST (Approaches 1-2) for backend deployment, but still could not deliver a working UI from outside the platform. Build Agent delivered both custom UI and workspace on the first attempt because it operates natively where it matters most -- the UI layer.

The AI models are equally capable. The variable is what each agent can reach from where it operates.

---

## How to Reproduce

| Approach | Instructions |
|---|---|
| **1 -- REST Custom UI** | [approach-1-sdk-custom-ui/README.md](approach-1-sdk-custom-ui/README.md) |
| **2 -- REST Workspace** | [approach-2-sdk-workspace/README.md](approach-2-sdk-workspace/README.md) |
| **3 -- SDK Custom UI** | [approach-3-sdk/README.md](approach-3-sdk/README.md) |
| **4 -- Build Agent Custom UI** | [approach-4-buildagent-custom-ui.md](approach-4-buildagent-custom-ui.md) |
| **5 -- Build Agent Workspace** | [approach-5-buildagent-workspace.md](approach-5-buildagent-workspace.md) |
