# Yakfik — Full Implementation Plan (All 3 Apps, Phased)

**To the AI helping build this:** this file covers all three apps — Talabat (mock), Snoonu (mock), and Yakfik (the assistant). Follow the phases in order within each part. Do not skip ahead to a later phase until the human confirms the current phase's test passed. Part 3 / Phase 3 (Yakfik's first tool-call test) is the highest-risk step in the whole project — flag it clearly if it fails.

**Recommended order of operations:**
1. Start Talabat Part 1 and Snoonu Part 2 in parallel (they don't depend on anything else) — get both through their Phase 4 deploy.
2. Yakfik Part 3, Phases 1–2 can also start immediately in parallel — they don't need the mock apps yet.
3. Yakfik Part 3, Phase 3 onward needs the two mock apps' deployed MCP URLs from step 1 — don't start it until those exist.

---

## Shared reference — used by all three apps

**Stack:** Next.js (App Router, TypeScript), Supabase (Postgres), deployed to Vercel, MCP via `@modelcontextprotocol/sdk`, AI via OpenRouter (`moonshotai/kimi-k2.6`, routing mode Exacto).

**Note on names:** Talabat and Snoonu are real, active delivery companies. Using their names for pitch narrative is fine; the apps built here should have their own original visual identity (own logo, own palette) rather than cloning the real companies' branding, since these get deployed to public URLs.

**Shared DB schema** (one Supabase project, tables scoped by `app_id`):
```sql
restaurants ( id, app_id text, name, cuisine, rating )
menu_items  ( id, restaurant_id -> restaurants, name, price numeric, eta_minutes int )
deals       ( id, restaurant_id -> restaurants, description, discount_pct numeric, active boolean )
orders      ( id, session_id text, restaurant_id -> restaurants, item_id -> menu_items,
              total_price numeric, source_app text, status text, created_at timestamp )
```

---

# PART 1 — Talabat (Mock App)

Uses `app_id = 'talabat'` and `source_app = 'talabat'` everywhere. Runs on port 3001.

### Phase 1 — Scaffold + static UI (no backend)
- `npx create-next-app@latest talabat --typescript --app`
- Build `/app/page.tsx`: 3–4 hardcoded restaurants, 2–3 hardcoded menu items each (name, price, eta), one item with a "Deal" badge. Mobile-first.
- `npm run dev -- -p 3001`

**✅ Test:** open `localhost:3001`, confirm the menu renders with hardcoded items and the deal badge is visible.

### Phase 2 — Supabase integration
- Create/connect to the shared Supabase project, create the tables above if not already done.
- Seed 3–4 restaurants, 2–3 items each, 1–2 active deals, all `app_id = 'talabat'`.
- Replace hardcoded arrays with a Supabase query joining menu items to restaurants.

**✅ Test:** edit a price in the Supabase table editor, refresh the page, confirm it updates with no code change.

### Phase 3 — MCP server
- Install `@modelcontextprotocol/sdk`.
- Create `/app/api/mcp/route.ts`, an MCP server (Streamable HTTP) exposing:
  - `search_menu({ query })` → matching items + restaurant name
  - `get_deals()` → active deals with item/restaurant info
  - `place_order({ item_id, restaurant_id })` → inserts into `orders` (`source_app: 'talabat'`), returns confirmation

**✅ Test:** use the MCP Inspector (`npx @modelcontextprotocol/inspector`) or a raw `curl` to call `search_menu` directly and confirm real Supabase data comes back — before Yakfik ever touches it.

### Phase 4 — Deploy
- `vercel deploy` or connect the repo to Vercel for auto-deploy.
- Set Supabase env vars in Vercel project settings.

**✅ Test:** `curl` the deployed `/api/mcp` URL, confirm it responds. This is the URL Yakfik Part 3 needs.

---

# PART 2 — Snoonu (Mock App)

Same structure as Talabat, `app_id = 'snoonu'` and `source_app = 'snoonu'`. Runs on port 3002. **Deliberately vary prices/etas/deals from Talabat's equivalent items** — that difference is what makes Yakfik's "found the better deal" moment real instead of scripted.

### Phase 1 — Scaffold + static UI (no backend)
- `npx create-next-app@latest snoonu --typescript --app`
- Build `/app/page.tsx`: 3–4 hardcoded restaurants, 2–3 items each. Include at least one item overlapping in *type* with a Talabat item (e.g. both have a shawarma wrap) at a different price/eta, plus one "Deal" badge. Mobile-first.
- `npm run dev -- -p 3002`

**✅ Test:** open `localhost:3002`, confirm the menu renders correctly.

### Phase 2 — Supabase integration
- Connect to the same shared Supabase project.
- Seed 3–4 restaurants, 2–3 items each, 1–2 active deals, all `app_id = 'snoonu'`.
- Replace hardcoded arrays with a live Supabase query.

**✅ Test:** edit a price in Supabase, refresh, confirm it updates.

### Phase 3 — MCP server
- Same tool shape as Talabat's `/app/api/mcp/route.ts`: `search_menu`, `get_deals`, `place_order` (with `source_app: 'snoonu'`).

**✅ Test:** call `search_menu` directly via MCP Inspector or `curl`, confirm real data comes back.

### Phase 4 — Deploy
- Deploy to Vercel, set env vars.

**✅ Test:** `curl` the deployed `/api/mcp` URL, confirm it responds. Hand this URL to whoever's building Yakfik.

---

# PART 3 — Yakfik (Assistant App)

Runs on port 3000. Chat UI + reasoning across both mock apps + mascot.

**Env vars** (`.env.local`, server-side only):
```
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=moonshotai/kimi-k2.6   # env var, not hardcoded — easy to swap if needed
TALABAT_MCP_URL=...   # from Part 1, Phase 4
SNOONU_MCP_URL=...    # from Part 2, Phase 4
```

### Phase 1 — Scaffold + static chat shell
- `npx create-next-app@latest yakfik --typescript --app`
- Simple chat UI: message list + input. On submit, append the message + a hardcoded fake reply (no AI yet).

**✅ Test:** type a message, see it plus the hardcoded echo reply.

### Phase 2 — Real AI, no tools yet
- Build `/app/api/chat/route.ts`, POST to `https://openrouter.ai/api/v1/chat/completions` with `model: process.env.OPENROUTER_MODEL`, no `tools` param yet.
- Wire the chat UI to this route.

**✅ Test:** ask something generic ("what's the capital of Qatar"), confirm a real AI answer appears.

### Phase 3 — MCP client + first tool-call test ⚠️ highest risk phase
- Connect an MCP client to `TALABAT_MCP_URL` and `SNOONU_MCP_URL`, fetch both tool lists.
- Convert to OpenAI-style `tools`, pass in the OpenRouter request with `tool_choice: "auto"`.
- Log the raw response, don't act on it yet.

**✅ Test:** ask "what's on the menu at Talabat?" and confirm `tool_calls` actually comes back populated. **If the model just answers in plain text instead of calling the tool, stop** — swap `OPENROUTER_MODEL` to a different variant and re-test this phase before building anything on top of it.

### Phase 4 — Full agent loop
- On `tool_calls`, execute each against the real MCP server, append the result as a `tool` message, call OpenRouter again, repeat until plain text.
- Let the model call `place_order` for real on the winning app.

**✅ Test:** ask "get me the cheapest shawarma and order it" end-to-end. Confirm the final answer names a specific restaurant/price, and a new row appears in Supabase's `orders` table.

### Phase 5 — UI polish for the demo
- Chat bubble styling, sand cat mascot during the "thinking" state, a live "Checking Talabat... Checking Snoonu... Found it!" indicator built from the tool-call log, order confirmation card.

**✅ Test:** full run-through with someone unfamiliar with the project watching — confirm the "checking apps" moment reads clearly without explanation.

### Phase 6 — Deploy
- Deploy to Vercel, set all four env vars.

**✅ Test:** full flow on the deployed URL, ideally from a phone on a different network than your laptop.
