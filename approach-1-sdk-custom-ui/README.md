# Approach 1 — SDK Custom UI

**Framework:** `@servicenow/sdk` v4.4.0 (Now Experience Framework)
**Pattern:** Hand-coded Now Experience custom component

## What This Is

A **pure SDK** implementation of the Travel Request app. The UI is built entirely using ServiceNow's Now Experience framework (`createCustomElement`, `snabbdom` renderer, `ui-effect-http`). This is the developer-centric approach — all UI code is written by hand.

## Component

- **Tag:** `<x-snc-travel-request-app>`
- **Source:** `src/x-snc-travel-request-app/index.js`
- **Styles:** `src/x-snc-travel-request-app/styles.scss`
- **Config:** `now-ui.json`

## Prerequisites

```bash
npm install -g @servicenow/sdk @servicenow/cli
```

## Run (SDK)

```bash
npm install
snc ui-component develop --instance-url https://YOUR_INSTANCE.service-now.com
```

## Run (Standalone Preview)

If `snc` CLI is not available, open `standalone-preview.html` in a browser and enter instance credentials in the connection bar. Note: CORS must be enabled on the instance.

## Deploy to Instance

```bash
snc ui-component deploy --instance-url https://YOUR_INSTANCE.service-now.com
```

## Features

- ✅ Create travel request (draft)
- ✅ Submit for approval
- ✅ Approve / Reject with reason
- ✅ Delete draft requests
- ✅ Search & filter
- ✅ Stats dashboard
- ✅ Client-side validation

## Limitations

- Requires `snc` CLI for full dev experience (local dev server with HMR)
- CORS restrictions when using standalone preview
- No server-side business rules (those are in Approach 3)
