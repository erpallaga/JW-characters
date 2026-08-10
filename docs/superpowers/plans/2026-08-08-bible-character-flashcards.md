# Bible Character Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static web app (GitHub Pages) with 17 Bible-character flashcards (flip for details) and a chronological timeline view, backed by a read-only Supabase table.

**Architecture:** Vanilla HTML/CSS/JS (no build step, ES modules loaded directly by the browser). Data lives in a single Supabase `characters` table read via `supabase-js` (anon key, public SELECT only). Images ship inside the repo (`assets/images/`) and are served by GitHub Pages alongside the app — no Supabase Storage, no backend writes from the app.

**Tech Stack:** HTML5, CSS3, JavaScript (ES modules), `@supabase/supabase-js@2` (via `esm.sh` CDN, no npm install), Supabase Postgres, GitHub Pages.

## Global Constraints

- Frontend must be plain HTML/CSS/JS — no framework, no build step, no bundler. (spec: Arquitectura)
- Data lives in Supabase table `characters`, read-only from the frontend via the `anon` key; writes only via SQL/MCP during content authoring, never from the app UI. (spec: Arquitectura, Modelo de datos)
- Images are downloaded from JW.ORG and committed to `assets/images/` in the repo — not Supabase Storage, not hotlinked. (spec: Arquitectura, decided after discovering the Supabase MCP has no Storage-upload tool)
- Row Level Security: public read policy on `characters`; no write policy for `anon` (write stays locked until a future phase-2 admin panel). (spec: Modelo de datos)
- Out of scope for this plan: admin panel, authentication, search/filters, quiz mode. (spec: Fuera de alcance)
- No automated test framework — this is a static personal-content app; verification is manual (local server + browser) as decided in the spec's "Pruebas / validación" section. Every task below still ends in a concrete, checkable verification step.
- Seed dataset is exactly these 17 characters, in this chronological order: Abel, Noé, Abrahán, Moisés, Rut, Ana, Samuel, Jonatán, David, Abigaíl, Elías, Jonás, Ester, María, José (padre de Jesús), Marta, Pedro. (spec: Lista del seed)
- Content sources: `ia_S.pdf` (*Ejemplos de fe*) and `wcg_S.pdf` (*Seamos valientes al andar con Dios*), both at the repo root (gitignored, local reference only), expanded with JW.ORG / WOL / *Perspicacia* when a field (dónde vivió, libros, fecha) isn't covered by the book chapter. (spec: Fuentes, Proceso de contenido)

---

## File Structure

```
JW-characters/
├── index.html                  # page shell: header, tabs, view containers
├── css/
│   └── styles.css              # all styling (card flip, timeline, tabs)
├── js/
│   ├── config.js                # SUPABASE_URL + SUPABASE_ANON_KEY constants
│   ├── supabaseClient.js        # creates and exports the supabase-js client
│   ├── api.js                   # fetchCharacters() — the only DB access point
│   ├── deck.js                  # initDeck() — flashcard deck view
│   ├── timeline.js              # initTimeline() — horizontal timeline view
│   ├── router.js                # initRouter()/navigateTo() — hash-based tab switching
│   └── main.js                  # entry point: wires api + deck + timeline + router
├── assets/
│   ├── placeholder.svg          # fallback shown when a character image fails to load
│   └── images/                  # <id>.jpg per character, e.g. david.jpg
├── db/
│   └── schema.sql                # characters table + RLS policy (reference copy)
└── docs/superpowers/             # specs and plans (this file's home)
```

---

### Task 1: Supabase project — schema and credentials

**Files:**
- Create: `db/schema.sql`

**Interfaces:**
- Produces: a `characters` table with columns `id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources` and a public-read RLS policy, reachable at some `SUPABASE_URL` with an `anon` key — both values are consumed by Task 3.

The Supabase MCP connected to this session only sees the "erpallaga's Org" account, which is already at its 2-active-project free-tier limit. The user is creating the project by hand in a different Supabase account that still has a free slot. This task is a human checkpoint — do not skip or fabricate the credentials.

- [ ] **Step 1: Write the schema file**

```sql
-- db/schema.sql
create table characters (
  id text primary key,           -- slug, e.g. "david"
  name text not null,
  image_url text,                -- relative path, e.g. "assets/images/david.jpg"
  era_label text,                -- human-readable, e.g. "Época de los reyes, ~1040–970 a.E.C."
  era_sort_key integer,          -- numeric year for ordering/positioning (negative = a.E.C.)
  lived_in text,
  known_for text,
  books text[],
  sources text[]
);

alter table characters enable row level security;

create policy "Public read access"
  on characters for select
  using (true);
```

- [ ] **Step 2: Hand off to the user and wait for credentials**

Tell the user: "Create a new Supabase project in your other account, open its SQL editor, and run the contents of `db/schema.sql`. Then send me the Project URL and the `anon` public key (Project Settings → API)." Do not proceed to Task 3 until both values are provided.

- [ ] **Step 3: Verify**

Once the user provides `SUPABASE_URL` and `SUPABASE_ANON_KEY`, confirm the table exists by running this query through the SQL editor (ask the user to paste back the result, or run it yourself if you gain MCP access to that project later):

```sql
select column_name, data_type from information_schema.columns where table_name = 'characters';
```

Expected: 9 rows matching the columns in Step 1.

- [ ] **Step 4: Commit**

```bash
git add db/schema.sql
git commit -m "feat: add characters table schema and RLS policy"
```

---

### Task 2: Static page shell

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `assets/placeholder.svg`

**Interfaces:**
- Produces: DOM elements later tasks depend on — `#deck-view` (section, initially visible), `#timeline-view` (section, initially `hidden`), `#error-message` (p, initially `hidden`), `.tab[data-view="deck"]` and `.tab[data-view="timeline"]` (nav links), and the CSS classes `.card`, `.card-inner`, `.card-front`, `.card-back`, `.card.flipped`, `.timeline-track`, `.timeline-line`, `.timeline-point` that Tasks 5 and 6 render into.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personajes de la Biblia</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="app-header">
    <h1>Personajes de la Biblia</h1>
    <nav class="tabs">
      <a href="#/deck" class="tab" data-view="deck">Mazo</a>
      <a href="#/timeline" class="tab" data-view="timeline">Timeline</a>
    </nav>
  </header>

  <main>
    <p id="error-message" class="error-message" hidden>No se pudieron cargar los personajes.</p>
    <section id="deck-view" class="view"></section>
    <section id="timeline-view" class="view" hidden></section>
  </main>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `assets/placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#e8dcc0"/>
  <text x="100" y="105" font-size="16" text-anchor="middle" fill="#3b2a1a" font-family="Georgia, serif">Sin imagen</text>
</svg>
```

- [ ] **Step 3: Write `css/styles.css`**

```css
:root {
  --bg: #f5ecd9;
  --text: #3b2a1a;
  --accent: #8a6d3b;
  --card-bg: #fffaf0;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  background: var(--bg);
  color: var(--text);
}

.app-header {
  padding: 16px 24px;
  text-align: center;
  border-bottom: 2px solid var(--accent);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
}

.tab {
  padding: 8px 16px;
  text-decoration: none;
  color: var(--text);
  border: 1px solid var(--accent);
  border-radius: 6px;
}

.tab.active {
  background: var(--accent);
  color: white;
}

main {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
}

.error-message {
  text-align: center;
  color: #a33;
}

/* Deck view */
.deck-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.deck-nav button {
  padding: 8px 12px;
  cursor: pointer;
}

.card {
  perspective: 1000px;
  height: 420px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--accent);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
}

.card-front img {
  max-height: 240px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.card-back {
  transform: rotateY(180deg);
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}

/* Timeline view */
.timeline-track {
  position: relative;
  height: 120px;
  margin: 60px 20px;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent);
  border-radius: 2px;
}

.timeline-point {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  width: 60px;
}

.timeline-point img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
}

.timeline-point span {
  font-size: 11px;
  margin-top: 4px;
}
```

- [ ] **Step 4: Verify the page loads**

```bash
python -m http.server 8000
```

In another terminal:

```bash
curl -s http://localhost:8000/index.html | grep -o 'id="deck-view"'
curl -s http://localhost:8000/css/styles.css | grep -o '.timeline-point'
```

Expected: both commands print a match. Then stop the server (Ctrl+C). Ask the user to open `http://localhost:8000` once and confirm the header, both tabs, and empty page render with no visible layout breakage.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css assets/placeholder.svg
git commit -m "feat: add static page shell with deck/timeline containers"
```

---

### Task 3: Supabase config and client

**Files:**
- Create: `js/config.js`
- Create: `js/supabaseClient.js`

**Interfaces:**
- Consumes: `SUPABASE_URL` and `SUPABASE_ANON_KEY` values from Task 1's human checkpoint.
- Produces: `supabase` (named export from `js/supabaseClient.js`) — a `supabase-js` client instance that Task 4's `api.js` imports.

- [ ] **Step 1: Write `js/config.js` with the real project credentials**

Replace the two string values below with the actual `SUPABASE_URL` and `SUPABASE_ANON_KEY` the user gave you in Task 1. Do not commit placeholder strings — if you don't have the real values yet, stop and go back to Task 1.

```js
// js/config.js
export const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
```

- [ ] **Step 2: Write `js/supabaseClient.js`**

```js
// js/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

- [ ] **Step 3: Verify the client connects**

```bash
python -m http.server 8000
```

Ask the user to open `http://localhost:8000`, open the browser dev console, and run:

```js
import("./js/supabaseClient.js").then(m => m.supabase.from("characters").select("*").then(console.log))
```

Expected: `{ data: [], error: null }` (empty array — no rows yet, but no error). If `error` is not `null`, the URL/key in `js/config.js` is wrong — fix and retry before moving on.

- [ ] **Step 4: Commit**

```bash
git add js/config.js js/supabaseClient.js
git commit -m "feat: add Supabase client configuration"
```

---

### Task 4: Data access layer

**Files:**
- Create: `js/api.js`

**Interfaces:**
- Consumes: `supabase` from `js/supabaseClient.js`.
- Produces: `async function fetchCharacters()` (named export) — resolves to an array of row objects `{ id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources }` sorted by `era_sort_key` ascending, or throws an `Error` on failure. Task 7's `main.js` is the only consumer.

- [ ] **Step 1: Write `js/api.js`**

```js
// js/api.js
import { supabase } from "./supabaseClient.js";

export async function fetchCharacters() {
  const { data, error } = await supabase
    .from("characters")
    .select("id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources")
    .order("era_sort_key", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar los personajes: ${error.message}`);
  }
  return data;
}
```

- [ ] **Step 2: Insert a temporary dev row so there's something to fetch**

Run through the Supabase SQL editor (or MCP `execute_sql` if you have access to the target project):

```sql
insert into characters (id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources)
values (
  'test',
  'Personaje de prueba',
  'assets/placeholder.svg',
  'Época de prueba',
  0,
  'Lugar de prueba',
  'Fila insertada solo para verificar el pipeline de datos.',
  array['Libro de prueba'],
  array['fuente de prueba']
);
```

- [ ] **Step 3: Verify `fetchCharacters()` returns it**

With `python -m http.server 8000` running, ask the user to open `http://localhost:8000`, open the dev console, and run:

```js
import("./js/api.js").then(m => m.fetchCharacters().then(console.log))
```

Expected: an array with exactly one object, `name: "Personaje de prueba"`.

- [ ] **Step 4: Remove the dev row**

```sql
delete from characters where id = 'test';
```

- [ ] **Step 5: Commit**

```bash
git add js/api.js
git commit -m "feat: add fetchCharacters data access function"
```

---

### Task 5: Deck (flashcard) view

**Files:**
- Create: `js/deck.js`

**Interfaces:**
- Consumes: an array of character objects (same shape as `fetchCharacters()`'s resolved value) and a container `HTMLElement`.
- Produces: `function initDeck(characters, containerEl)` (named export) — renders the deck into `containerEl` and returns `{ goTo(id) }`, where `goTo(id)` jumps the deck to the character with that `id` and flips the card to show its back. Task 7's `main.js` calls `initDeck` and passes the returned object's `goTo` to Task 6's `onSelect` callback.

- [ ] **Step 1: Write `js/deck.js`**

```js
// js/deck.js
export function initDeck(characters, containerEl) {
  let currentIndex = 0;

  function render(flipped = false) {
    const c = characters[currentIndex];
    containerEl.innerHTML = `
      <div class="deck-nav">
        <button id="prev-btn" ${currentIndex === 0 ? "disabled" : ""}>&larr; Anterior</button>
        <span class="deck-counter">${currentIndex + 1} / ${characters.length}</span>
        <button id="next-btn" ${currentIndex === characters.length - 1 ? "disabled" : ""}>Siguiente &rarr;</button>
      </div>
      <div class="card${flipped ? " flipped" : ""}" id="flashcard">
        <div class="card-inner">
          <div class="card-front">
            <img src="${c.image_url}" alt="${c.name}" onerror="this.onerror=null;this.src='assets/placeholder.svg';">
            <h2>${c.name}</h2>
          </div>
          <div class="card-back">
            <p><strong>Época:</strong> ${c.era_label ?? ""}</p>
            <p><strong>Dónde vivió:</strong> ${c.lived_in ?? ""}</p>
            <p><strong>Conocido por:</strong> ${c.known_for ?? ""}</p>
            <p><strong>Libros:</strong> ${(c.books ?? []).join(", ")}</p>
          </div>
        </div>
      </div>
    `;

    containerEl.querySelector("#flashcard").addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("flipped");
    });
    containerEl.querySelector("#prev-btn").addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    });
    containerEl.querySelector("#next-btn").addEventListener("click", () => {
      if (currentIndex < characters.length - 1) {
        currentIndex++;
        render();
      }
    });
  }

  function goTo(id) {
    const idx = characters.findIndex((c) => c.id === id);
    if (idx === -1) return;
    currentIndex = idx;
    render(true);
  }

  render();
  return { goTo };
}
```

- [ ] **Step 2: Verify with the dev row**

Re-insert the temporary row from Task 4 Step 2 (same SQL), then add this temporary snippet at the bottom of `index.html`'s `<script type="module">`... actually simpler: ask the user to run this in the dev console instead (no file changes needed):

```js
import("./js/api.js").then(async (api) => {
  const chars = await api.fetchCharacters();
  const { initDeck } = await import("./js/deck.js");
  const deck = initDeck(chars, document.getElementById("deck-view"));
  window.__deck = deck;
});
```

Expected in the browser: one card showing "Personaje de prueba" with a disabled "Anterior" button and a disabled "Siguiente" button (only one row). Click the card — it flips to show the back fields. Then run `window.__deck.goTo("test")` in the console — expected: card is shown flipped.

Remove the dev row again when done (`delete from characters where id = 'test';`).

- [ ] **Step 3: Commit**

```bash
git add js/deck.js
git commit -m "feat: add flashcard deck view with flip and prev/next navigation"
```

---

### Task 6: Timeline view

**Files:**
- Create: `js/timeline.js`

**Interfaces:**
- Consumes: an array of character objects (needs at least `id`, `name`, `image_url`, `era_sort_key`), a container `HTMLElement`, and an `onSelect(id)` callback.
- Produces: `function initTimeline(characters, containerEl, onSelect)` (named export) — renders a horizontal timeline into `containerEl`; clicking a point calls `onSelect(id)`. Task 7's `main.js` passes a callback that switches to the deck tab and calls `deck.goTo(id)`.

- [ ] **Step 1: Write `js/timeline.js`**

```js
// js/timeline.js
export function initTimeline(characters, containerEl, onSelect) {
  const years = characters.map((c) => c.era_sort_key);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const span = maxYear - minYear || 1;

  const points = characters
    .map((c) => {
      const pct = ((c.era_sort_key - minYear) / span) * 100;
      return `
        <button class="timeline-point" style="left: ${pct}%" data-id="${c.id}">
          <img src="${c.image_url}" alt="${c.name}" onerror="this.onerror=null;this.src='assets/placeholder.svg';">
          <span>${c.name}</span>
        </button>
      `;
    })
    .join("");

  containerEl.innerHTML = `
    <div class="timeline-track">
      <div class="timeline-line"></div>
      ${points}
    </div>
  `;

  containerEl.querySelectorAll(".timeline-point").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.id));
  });
}
```

- [ ] **Step 2: Verify with two dev rows**

Insert two temporary rows with different `era_sort_key` values:

```sql
insert into characters (id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources)
values
  ('test-a', 'Prueba A', 'assets/placeholder.svg', 'Época A', -2000, 'Lugar A', 'Prueba A', array['Libro A'], array['fuente A']),
  ('test-b', 'Prueba B', 'assets/placeholder.svg', 'Época B', -1000, 'Lugar B', 'Prueba B', array['Libro B'], array['fuente B']);
```

Ask the user to run in the dev console:

```js
import("./js/api.js").then(async (api) => {
  const chars = await api.fetchCharacters();
  const { initTimeline } = await import("./js/timeline.js");
  initTimeline(chars, document.getElementById("timeline-view"), (id) => console.log("selected:", id));
  document.getElementById("timeline-view").hidden = false;
});
```

Expected: two labeled points on a horizontal line, "Prueba A" left of "Prueba B" (older era first). Clicking a point logs `selected: test-a` or `selected: test-b`.

Remove the dev rows: `delete from characters where id in ('test-a', 'test-b');`

- [ ] **Step 3: Commit**

```bash
git add js/timeline.js
git commit -m "feat: add horizontal timeline view"
```

---

### Task 7: App wiring — router and main entry point

**Files:**
- Create: `js/router.js`
- Create: `js/main.js`

**Interfaces:**
- Consumes: `fetchCharacters` (Task 4), `initDeck` (Task 5), `initTimeline` (Task 6), and the DOM elements from Task 2 (`#deck-view`, `#timeline-view`, `#error-message`, `.tab[data-view]`).
- Produces: the running app — `js/main.js` has no exports, it's the module the browser loads directly.

- [ ] **Step 1: Write `js/router.js`**

```js
// js/router.js
export function initRouter() {
  window.addEventListener("hashchange", render);
  render();
}

export function navigateTo(view) {
  window.location.hash = `#/${view}`;
}

function currentRoute() {
  const hash = window.location.hash.replace("#/", "");
  return hash === "timeline" ? "timeline" : "deck";
}

function render() {
  const route = currentRoute();
  document.getElementById("deck-view").hidden = route !== "deck";
  document.getElementById("timeline-view").hidden = route !== "timeline";
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === route);
  });
}
```

- [ ] **Step 2: Write `js/main.js`**

```js
// js/main.js
import { fetchCharacters } from "./api.js";
import { initDeck } from "./deck.js";
import { initTimeline } from "./timeline.js";
import { initRouter, navigateTo } from "./router.js";

async function start() {
  const errorEl = document.getElementById("error-message");
  const deckEl = document.getElementById("deck-view");
  const timelineEl = document.getElementById("timeline-view");

  let characters;
  try {
    characters = await fetchCharacters();
  } catch (err) {
    console.error(err);
    errorEl.hidden = false;
    return;
  }

  if (!characters || characters.length === 0) {
    errorEl.hidden = false;
    return;
  }

  const deck = initDeck(characters, deckEl);
  initTimeline(characters, timelineEl, (id) => {
    navigateTo("deck");
    deck.goTo(id);
  });
  initRouter();
}

start();
```

- [ ] **Step 3: Verify end-to-end with the dev rows**

Re-insert the two dev rows from Task 6 Step 2. Start the server (`python -m http.server 8000`) and ask the user to open `http://localhost:8000` fresh (no manual console imports this time — `main.js` runs on load) and confirm:
1. The deck tab is active by default and shows "Prueba A" (or "Prueba B" — whichever sorts first).
2. Clicking the "Timeline" tab shows both points on a line.
3. Clicking a timeline point switches back to the Mazo tab and shows that character's card flipped.
4. No errors in the browser console.

Remove the dev rows when done: `delete from characters where id in ('test-a', 'test-b');`

- [ ] **Step 4: Verify the error path**

Temporarily edit `js/config.js` to use an invalid `SUPABASE_ANON_KEY` (e.g. append `"x"`), reload the page, and confirm the `#error-message` paragraph becomes visible with the "No se pudieron cargar los personajes." text and the console shows the thrown error. Then restore the correct key.

- [ ] **Step 5: Commit**

```bash
git add js/router.js js/main.js
git commit -m "feat: wire router and main entry point, handle load errors"
```

---

### Task 8: GitHub Pages deployment

**Files:**
- None new — configuration only.

**Interfaces:**
- Consumes: the working static site from Tasks 2–7.
- Produces: a public URL serving `index.html` from the repo root.

- [ ] **Step 1: Push the current branch**

```bash
git push -u origin main
```

- [ ] **Step 2: Enable GitHub Pages via the GitHub CLI**

```bash
gh api -X POST repos/erpallaga/JW-characters/pages -f "source[branch]=main" -f "source[path]=/"
```

If it responds that Pages is already configured, use PUT instead:

```bash
gh api -X PUT repos/erpallaga/JW-characters/pages -f "source[branch]=main" -f "source[path]=/"
```

- [ ] **Step 3: Verify**

```bash
gh api repos/erpallaga/JW-characters/pages --jq .html_url
```

Expected: a URL like `https://erpallaga.github.io/JW-characters/`. Wait a minute for the first build, then `curl -s -o /dev/null -w "%{http_code}" <that URL>` — expected `200`.

- [ ] **Step 4: Commit**

Nothing to commit (Pages config lives on GitHub, not in the repo). Skip this step.

---

### Task 9: Seed content — Group A (Génesis a Jueces)

Characters: Abel, Noé, Abrahán, Moisés, Rut.

**Files:**
- Create: `assets/images/abel.jpg`, `assets/images/noe.jpg`, `assets/images/abrahan.jpg`, `assets/images/moises.jpg`, `assets/images/rut.jpg`

**Interfaces:**
- Produces: 5 rows in the `characters` table that Tasks 5–7's already-built UI renders — no code changes needed, this task is pure content + data.

For each character, repeat this same procedure:

- [ ] **Step 1: Read the source chapter**
  - Abel: `ia_S.pdf`, pages 9–16.
  - Noé: `ia_S.pdf`, pages 17–24.
  - Abrahán: `ia_S.pdf`, pages 25–32.
  - Moisés: `wcg_S.pdf`, pages 61–66 (approx. — read until the chapter's "Investigue un poco más" section).
  - Rut: `ia_S.pdf`, pages 33–50.

  Extract: where they lived (places named in the chapter), what they're known for (2-3 sentences, faithful to the source), which Bible books their story appears in (from the citations in the text), and an approximate era (birth/main-events year).

- [ ] **Step 2: Fill any gaps with JW.ORG / WOL / Perspicacia**
  If the chapter doesn't give a specific place or a clear list of Bible books, search jw.org, wol.jw.org, or *Perspicacia para comprender las Escrituras* (`it`) for that character to fill the gap. Never invent a fact that isn't backed by one of these sources.

- [ ] **Step 3: Get the character's image**
  Search jw.org for an official illustration of the character (the "Ficha bíblica" collectible series or article illustrations are good candidates). Download it and save as `assets/images/<id>.jpg` (e.g. `assets/images/abel.jpg`), where `<id>` is the lowercase, no-accent slug used in the table (`abel`, `noe`, `abrahan`, `moises`, `rut`).

- [ ] **Step 4: Show the drafted fields to the user for approval**
  Present the `name`, `era_label`, `era_sort_key`, `lived_in`, `known_for`, `books`, `sources` values you drafted, and wait for the user to approve or correct them before inserting.

- [ ] **Step 5: Insert the row**
  Once approved, run through the Supabase SQL editor (or MCP `execute_sql` if available):

  ```sql
  insert into characters (id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources)
  values (
    '<id>',
    '<name>',
    'assets/images/<id>.jpg',
    '<era_label>',
    <era_sort_key>,
    '<lived_in>',
    '<known_for>',
    array[<books>],
    array[<sources>]
  );
  ```

- [ ] **Step 6: Verify**
  With the dev server running, reload the app and confirm the new character's card appears in the deck (in the correct chronological position relative to any other seeded rows) and its timeline point is positioned correctly.

- [ ] **Step 7: Commit**
  After all 5 characters in this group are inserted and verified:

  ```bash
  git add assets/images/abel.jpg assets/images/noe.jpg assets/images/abrahan.jpg assets/images/moises.jpg assets/images/rut.jpg
  git commit -m "content: seed Génesis–Jueces characters (Abel, Noé, Abrahán, Moisés, Rut)"
  ```

---

### Task 10: Seed content — Group B (Reyes al Exilio)

Characters: Ana, Samuel, Jonatán, David, Abigaíl, Elías, Jonás, Ester.

**Files:**
- Create: `assets/images/ana.jpg`, `assets/images/samuel.jpg`, `assets/images/jonatan.jpg`, `assets/images/david.jpg`, `assets/images/abigail.jpg`, `assets/images/elias.jpg`, `assets/images/jonas.jpg`, `assets/images/ester.jpg`

**Interfaces:**
- Same as Task 9 — 8 more rows in `characters`, no code changes.

Follow the exact same 7-step procedure as Task 9 for each character, using these source locations for Step 1:

- Ana: `ia_S.pdf`, pages 51–58.
- Samuel: `ia_S.pdf`, pages 59–75.
- Jonatán: `wcg_S.pdf`, pages 109–112.
- David: `wcg_S.pdf`, pages 113–118 (approx.).
- Abigaíl: `ia_S.pdf`, pages 76–83.
- Elías: `ia_S.pdf`, pages 84–107.
- Jonás: `ia_S.pdf`, pages 108–124.
- Ester: `ia_S.pdf`, pages 125–144.

Ids: `ana`, `samuel`, `jonatan`, `david`, `abigail`, `elias`, `jonas`, `ester`.

- [ ] **Step 7 (final commit for this group):**

```bash
git add assets/images/ana.jpg assets/images/samuel.jpg assets/images/jonatan.jpg assets/images/david.jpg assets/images/abigail.jpg assets/images/elias.jpg assets/images/jonas.jpg assets/images/ester.jpg
git commit -m "content: seed Reyes–Exilio characters (Ana, Samuel, Jonatán, David, Abigaíl, Elías, Jonás, Ester)"
```

---

### Task 11: Seed content — Group C (Evangelios e iglesia primitiva)

Characters: María, José (padre de Jesús), Marta, Pedro.

**Files:**
- Create: `assets/images/maria.jpg`, `assets/images/jose.jpg`, `assets/images/marta.jpg`, `assets/images/pedro.jpg`

**Interfaces:**
- Same as Task 9 — final 4 rows in `characters`, no code changes.

Follow the exact same 7-step procedure as Task 9, using these source locations for Step 1 (all in `ia_S.pdf`):

- María: pages 145–161.
- José (padre de Jesús): pages 162–171.
- Marta: pages 172–179.
- Pedro: pages 180–212.

Ids: `maria`, `jose`, `marta`, `pedro`. For José, disambiguate clearly in `known_for` that this is Joseph the earthly father of Jesus, not Joseph son of Jacob (who isn't in this seed).

- [ ] **Step 7 (final commit for this group):**

```bash
git add assets/images/maria.jpg assets/images/jose.jpg assets/images/marta.jpg assets/images/pedro.jpg
git commit -m "content: seed Evangelios characters (María, José, Marta, Pedro)"
```

- [ ] **Step 8: Final full verification**

With all 17 rows inserted and the dev server running, reload the app and confirm:
1. The deck shows all 17 cards, navigable start to end with no gaps.
2. Every card flips to show non-empty era/lived_in/known_for/books.
3. The timeline shows all 17 points, ordered left-to-right chronologically (Abel first, Pedro last).
4. Clicking any timeline point jumps to that character in the deck, flipped.

Then verify the live GitHub Pages URL from Task 8 shows the same thing.
