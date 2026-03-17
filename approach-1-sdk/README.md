# Approach 1: Claude Opus + ServiceNow SDK

Uses Claude Opus (via Cascade) to author Fluent TypeScript, then deploys via the ServiceNow SDK (`now-sdk`). This is the officially supported external development path.

---

## What's Included

```
approach-1-sdk/
├── now.config.json                          # Scope config (update scopeId)
├── package.json                             # SDK dependencies
├── .env.example                             # Credential template
├── .gitignore
└── src/fluent/
    ├── tables/
    │   └── travel-request.now.ts            # Table: x_snc_travel_request (extends task)
    ├── business-rules/
    │   └── travel-request-rules.now.ts      # 4 BRs: default state, default traveler, date validation, cost validation
    ├── navigation/
    │   └── application-menu.now.ts          # App menu + modules
    ├── records/
    │   └── sample-data.now.ts               # 5 sample travel requests
    └── index.now.ts                         # Barrel exports
```

---

## Table Schema

**Table:** `x_snc_travel_request` (extends `task`)

| Field | Type | Required |
|---|---|---|
| `x_snc_travel_destination` | String (256) | Yes |
| `x_snc_travel_departure_date` | Date | Yes |
| `x_snc_travel_return_date` | Date | Yes |
| `x_snc_travel_purpose` | String (1000) | Yes |
| `x_snc_travel_estimated_cost` | Price | Yes |
| `x_snc_travel_travel_type` | Choice (domestic/international) | Yes |
| `x_snc_travel_traveler` | Reference (sys_user) | No |
| `x_snc_travel_state` | Choice (draft/submitted/approved/rejected/completed) | No (defaults to draft) |

---

## Business Rules

| Rule | When | What |
|---|---|---|
| Default State to Draft | Before Insert | Sets state to `draft` if empty |
| Default Traveler | Before Insert | Sets traveler to current user if empty |
| Validate Return Date | Before Insert/Update | Aborts if return date < departure date |
| Validate Cost | Before Insert/Update | Aborts if estimated cost <= 0 |

---

## Setup

1. Copy `.env.example` to `.env` and fill in your instance credentials
2. Update `now.config.json` with your app's `scopeId` (sys_id from sys_app)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate types:
   ```bash
   npm run types
   ```
5. Build:
   ```bash
   npm run build
   ```
6. Deploy:
   ```bash
   npm run deploy
   ```

---

## What This Proves

The ServiceNow SDK handles scope assignment, record relationships, and metadata compilation natively. Claude Opus authors the Fluent TypeScript; the SDK handles everything the REST API could not: correct scope headers, `sys_app` registration, and structured metadata deployment.
