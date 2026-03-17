# Travel Request App - Approach Comparison

> **Pilot / Demo only.** This repo compares how AI-assisted approaches perform when building on ServiceNow, and what platform-native tooling unlocks. The Travel Request app is intentionally simple, it exists to benchmark tooling. None of these approaches nor their outcomes are production-grade.

---

## The Journey

An external AI agent (Claude Opus via Cascade) tried two paths to build a ServiceNow app through REST APIs: a custom UI page and a native workspace. Both produced working components, but the workspace route could not cross the finish line from outside the platform. Then ServiceNow's own Build Agent attempted the same deliverables from within ServiceNow, and completed both. The comparison is not about which AI model is better (Claude Opus is state-of-the-art either way), it is about what platform-native tooling uniquely enables.

---

## Approaches

| | **Approach 1: Claude Opus Custom UI** | **Approach 2: Claude Opus Workspace** | **Approach 3: Build Agent Custom UI** | **Approach 4: Build Agent Workspace** |
|---|---|---|---|---|
| **AI model** | Claude Opus (via Cascade) | Claude Opus (via Cascade) | Build Agent (GPT Large) | Build Agent (GPT Large) |
| **Method** | Cascade (REST API) | Cascade (REST API) | Build Agent (platform-native) | Build Agent (platform-native) |
| **Delivery** | Jelly UI Page | React components (no workspace) | React UI Page | Workspace |
| **Prompts** | Multiple iterations | Multiple iterations | 1 prompt | 5 prompts |
| **Status** | <span style="color:#22c55e">✓ Working</span> | <span style="color:#ef4444">✗ Incomplete</span> | <span style="color:#22c55e">✓ Working</span> | <span style="color:#22c55e">✓ Working</span> |
| **Assets** | [approach-1-sdk-custom-ui/](approach-1-sdk-custom-ui/) | [approach-2-sdk-workspace/](approach-2-sdk-workspace/) | [approach-3-buildagent-custom-ui.md](approach-3-buildagent-custom-ui.md) | [approach-4-buildagent-workspace.md](approach-4-buildagent-workspace.md) |

---

## 1. Cost & Time

| | **Approach 1** | **Approach 2** | **Approach 3** | **Approach 4** |
|---|---|---|---|---|
| **Model** | Claude Opus | Claude Opus | Build Agent (GPT Large) | Build Agent (GPT Large) |
| **Effort** | ~2,000 tokens (clean) / ~12,000 total | ~8,900 tokens (clean) / ~15,000+ total | 27 assists, 70+ tool calls | 5 prompts, 62 tool calls |
| **Wall-clock time** | ~2 hours | ~3 hours (incomplete) | ~20 minutes | < 15 minutes |
| **Iterations to working UI** | 4 failed → 1 working | 3 pivots → still no workspace | First run worked, iterations to fine-tune UI | First run worked, iterations to fine-tune UI |
| **Outcome** | <span style="color:#22c55e">✓</span> Working UI Page | <span style="color:#ef4444">✗</span> Components built, no cohesive app | <span style="color:#22c55e">✓</span> Working React UI Page | <span style="color:#22c55e">✓</span> Full workspace + dashboard |

> **Note on units.** Cascade (Approaches 1-2) is measured in tokens because it operates through an LLM API. Build Agent (Approaches 3-4) is measured in prompts and tool calls because it operates through a conversational UI inside ServiceNow. These are not directly comparable units, but both reflect the total effort required to reach a working app.

**Where the time went: UI.** Data model creation was fast in every approach. The cost difference was in the UI layer. Approach 1 took 4 iterations to land on a working UI pattern. UI Pages have specific rendering requirements (Jelly XML, server-side evaluation) that aren't obvious from the REST API surface. Approach 2 produced strong individual components but couldn't assemble a native workspace. The workspace framework involves ~20 interdependent records across 10+ tables, tightly integrated configuration that Build Agent navigates natively but that sits below the REST API layer.

Build Agent (Approaches 3-4) produced working apps in under 20 minutes each. No iterations to get a functional first run. No auth issues. No CSRF debugging. This is what platform-native tooling unlocks: Build Agent operates inside ServiceNow where workspace assembly, business rule wiring, and UI action registration are native operations rather than external API calls.

---

## 2. Feature Matrix

| Feature | **Approach 1** | **Approach 2** | **Approach 3** | **Approach 4** |
|---|---|---|---|---|
| Workspace | N/A | <span style="color:#ef4444">✗</span> attempted | N/A (UI Page) | <span style="color:#22c55e">✓</span> |
| Dashboard + Charts | <span style="color:#ef4444">✗</span> stats row only | <span style="color:#ef4444">✗</span> | <span style="color:#22c55e">✓</span> React dashboard | <span style="color:#22c55e">✓</span> |
| List view | <span style="color:#22c55e">✓</span> custom table | <span style="color:#22c55e">✓</span> React (standalone) | <span style="color:#22c55e">✓</span> React list | <span style="color:#22c55e">✓</span> native |
| Form / Create | <span style="color:#22c55e">✓</span> modal form | <span style="color:#22c55e">✓</span> schema-driven (standalone) | <span style="color:#22c55e">✓</span> React form | <span style="color:#22c55e">✓</span> native |
| Action buttons | <span style="color:#22c55e">✓</span> | <span style="color:#22c55e">✓</span> | <span style="color:#22c55e">✓</span> | <span style="color:#22c55e">✓</span> |
| Server-side logic | <span style="color:#22c55e">✓</span> g:evaluate | <span style="color:#ef4444">✗</span> client-side only | <span style="color:#22c55e">✓</span> Business Rules | <span style="color:#22c55e">✓</span> Business Rules |
| Search + Filter | <span style="color:#22c55e">✓</span> client-side | <span style="color:#22c55e">✓</span> client-side | <span style="color:#22c55e">✓</span> client-side | <span style="color:#22c55e">✓</span> native |
| Polaris / Mobile / Upgrade-safe | <span style="color:#ef4444">✗</span> / <span style="color:#ef4444">✗</span> / <span style="color:#f59e0b">⚠</span> | <span style="color:#ef4444">✗</span> / <span style="color:#ef4444">✗</span> / <span style="color:#ef4444">✗</span> | <span style="color:#ef4444">✗</span> / <span style="color:#ef4444">✗</span> / <span style="color:#f59e0b">⚠</span> | <span style="color:#22c55e">✓</span> / <span style="color:#22c55e">✓</span> / <span style="color:#22c55e">✓</span> |

---

## 3. Approach 1 - Iteration Path

4 iterations before the working version. See [approach-1-sdk-custom-ui/](approach-1-sdk-custom-ui/) for all iteration artifacts.

1. **Raw HTML** → blank page (UI Pages require Jelly XML)
2. **Client-side XHR** → 401 (CSRF enforcement on `direct=true` pages)
3. **GlideAjax** → blocked (cross-scope Script Include access)
4. **Jelly XML partial** → vars not injecting (`client_script` field not Jelly-processed)
5. **<span style="color:#22c55e">✓</span> Final: Jelly XML + `<g:evaluate>` + form POST** → working

Key files: [`a1-final-html.xml`](approach-1-sdk-custom-ui/a1-final-html.xml) · [`a1-final-client.js`](approach-1-sdk-custom-ui/a1-final-client.js)

---

## 4. Approach 2 - Components Without a Workspace

Cascade produced functional UI components, a schema-driven React app with auto-generated forms, tables, state machine, validation, and action buttons. Individually, each piece worked. But the workspace framework is deeply integrated: ~20 interdependent records across 10+ tables, tightly coupled JSON configurations, and specific record relationships (`sys_app`, screen type linkages to OOB macroponents) that sit below the REST API layer. This is the complexity that Build Agent abstracts away. The framework was designed to be authored by platform-native tools, and Build Agent is exactly that.

Key files: [`App.jsx`](approach-2-sdk-workspace/src/App.jsx) · [`schema.json`](approach-2-sdk-workspace/build-agent/schema.json) · [`ui-page.html`](approach-2-sdk-workspace/ui-page.html)

---

## 5. Platform Behaviors Encountered (External Route)

| # | Behavior | Approach | External agent limitation? |
|---|---|---|---|
| 1 | UI Pages require Jelly XML, not raw HTML | 1 | **Yes** (discoverable) |
| 2 | CSRF enforcement applies to `direct=true` pages (expected platform security) | 1 | No |
| 3 | `gs.getSessionToken()` scoped to app context | 1 | No |
| 4 | `client_script` field not Jelly-processed | 1 | No |
| 5 | REST API defaults records to caller scope context; explicit scope headers required | 1+2 | **Partial** (Cascade did not send `x-sn-app-scope` headers) |
| 6 | Workspace registration requires `sys_app` record (created natively by ServiceNow tooling) | 2 | No |
| 7 | `sys_ux_screen` records required to link screen types to macroponents | 2 | No |
| 8 | `sys_ux_page_property` records with tightly coupled JSON configs | 2 | No |
| 9 | `sys_ux_app_route` requires specific field relationships | 2 | No |

\#5 is partly a tooling gap: Cascade did not send `x-sn-app-scope` headers on REST calls, so records landed in the wrong scope context. \#6 is expected behavior, `sys_app` records are created natively by ServiceNow tooling. Items #7-9 reflect platform internals that Build Agent handles natively, below the REST API surface.

---

## 6. Bottom Line

The UI is the differentiator. Data models are straightforward to create from any agent. But delivering a **cohesive, working UI**, the thing users actually interact with, is where platform-native tooling shows its value. The AI models are equally capable; the variable is what each agent can reach from where it operates.

Claude Opus (Approach 1) took 4 iterations and 2 hours to land on a traditional UI pattern (Jelly XML). Claude Opus (Approach 2) produced strong components but couldn't assemble a workspace from outside the platform. Build Agent (Approach 3) delivered a working custom UI from a single prompt in 20 minutes. Build Agent (Approach 4) delivered a full workspace in 5 prompts under 15 minutes. Same app, same spec, dramatically different outcomes, because Build Agent operates natively where it matters most.

---

## How to Reproduce

| Approach | Instructions |
|---|---|
| **1 - Claude Opus Custom UI** | [approach-1-sdk-custom-ui/README.md](approach-1-sdk-custom-ui/README.md) |
| **2 - Claude Opus Workspace** | [approach-2-sdk-workspace/README.md](approach-2-sdk-workspace/README.md) |
| **3 - Build Agent Custom UI** | [approach-3-buildagent-custom-ui.md](approach-3-buildagent-custom-ui.md) |
| **4 - Build Agent Workspace** | [approach-4-buildagent-workspace.md](approach-4-buildagent-workspace.md) |
