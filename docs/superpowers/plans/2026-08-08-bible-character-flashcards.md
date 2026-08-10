# Bible Character Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static web app (GitHub Pages) with 17 Bible-character flashcards (flip for details) and a chronological timeline view, backed by a versioned JSON data file — no backend.

**Architecture:** Vanilla HTML/CSS/JS (no build step, ES modules loaded directly by the browser). Data lives in `data/characters.json`, fetched at runtime with the `fetch` API. Images ship inside the repo (`assets/images/`) and are served by GitHub Pages alongside the app.

**Tech Stack:** HTML5, CSS3, JavaScript (ES modules), GitHub Pages. No npm, no backend, no database.

## Global Constraints

- Frontend must be plain HTML/CSS/JS — no framework, no build step, no bundler. (spec: Arquitectura)
- Data lives in `data/characters.json`, a single JSON array committed to the repo, loaded client-side with `fetch`. No backend, no database, no API keys. (spec: Arquitectura — Supabase was tried and dropped: the user's Supabase free plan has no slot left and they don't want a third account.)
- Images are downloaded from JW.ORG and committed to `assets/images/` in the repo — not hotlinked, not in any cloud storage. (spec: Arquitectura)
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
│   ├── api.js                   # fetchCharacters() — the only data-loading point
│   ├── deck.js                  # initDeck() — flashcard deck view
│   ├── timeline.js              # initTimeline() — horizontal timeline view
│   ├── router.js                # initRouter()/navigateTo() — hash-based tab switching
│   └── main.js                  # entry point: wires api + deck + timeline + router
├── data/
│   └── characters.json          # the 17-character dataset
├── assets/
│   ├── placeholder.svg          # fallback shown when a character image fails to load
│   └── images/                  # <id>.jpg per character, e.g. david.jpg
└── docs/superpowers/             # specs and plans (this file's home)
```

---

### Task 1: Static page shell

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `assets/placeholder.svg`

**Interfaces:**
- Produces: DOM elements later tasks depend on — `#deck-view` (section, initially visible), `#timeline-view` (section, initially `hidden`), `#error-message` (p, initially `hidden`), `.tab[data-view="deck"]` and `.tab[data-view="timeline"]` (nav links), and the CSS classes `.card`, `.card-inner`, `.card-front`, `.card-back`, `.card.flipped`, `.timeline-track`, `.timeline-line`, `.timeline-point` that Tasks 3 and 4 render into.

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

### Task 2: Data file and data access layer

**Files:**
- Create: `data/characters.json`
- Create: `js/api.js`

**Interfaces:**
- Produces: `async function fetchCharacters()` (named export from `js/api.js`) — resolves to an array of objects `{ id, name, image_url, era_label, era_sort_key, lived_in, known_for, books, sources }` sorted by `era_sort_key` ascending, or throws an `Error` on failure (network error, HTTP error, or malformed JSON). Task 5's `main.js` is the only consumer.

- [ ] **Step 1: Write `data/characters.json` with one placeholder row**

Start with a single dev/test entry so the pipeline is verifiable before real content lands in Tasks 7-9:

```json
[
  {
    "id": "test",
    "name": "Personaje de prueba",
    "image_url": "assets/placeholder.svg",
    "era_label": "Época de prueba",
    "era_sort_key": 0,
    "lived_in": "Lugar de prueba",
    "known_for": "Fila insertada solo para verificar el pipeline de datos.",
    "books": ["Libro de prueba"],
    "sources": ["fuente de prueba"]
  }
]
```

- [ ] **Step 2: Write `js/api.js`**

```js
// js/api.js
export async function fetchCharacters() {
  const response = await fetch("data/characters.json");
  if (!response.ok) {
    throw new Error(`No se pudieron cargar los personajes: HTTP ${response.status}`);
  }

  let characters;
  try {
    characters = await response.json();
  } catch (err) {
    throw new Error(`No se pudieron cargar los personajes: JSON inválido (${err.message})`);
  }

  return [...characters].sort((a, b) => a.era_sort_key - b.era_sort_key);
}
```

- [ ] **Step 3: Verify**

```bash
python -m http.server 8000
```

Ask the user to open `http://localhost:8000`, open the dev console, and run:

```js
import("./js/api.js").then(m => m.fetchCharacters().then(console.log))
```

Expected: an array with exactly one object, `name: "Personaje de prueba"`.

- [ ] **Step 4: Commit**

```bash
git add data/characters.json js/api.js
git commit -m "feat: add characters.json data file and fetchCharacters loader"
```

---

### Task 3: Deck (flashcard) view

**Files:**
- Create: `js/deck.js`

**Interfaces:**
- Consumes: an array of character objects (same shape as `fetchCharacters()`'s resolved value) and a container `HTMLElement`.
- Produces: `function initDeck(characters, containerEl)` (named export) — renders the deck into `containerEl` and returns `{ goTo(id) }`, where `goTo(id)` jumps the deck to the character with that `id` and flips the card to show its back. Task 5's `main.js` calls `initDeck` and passes the returned object's `goTo` to Task 4's `onSelect` callback.

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

- [ ] **Step 2: Verify with the placeholder row**

With `python -m http.server 8000` running (`data/characters.json` still has just the `"test"` entry from Task 2), ask the user to open `http://localhost:8000`, open the dev console, and run:

```js
import("./js/api.js").then(async (api) => {
  const chars = await api.fetchCharacters();
  const { initDeck } = await import("./js/deck.js");
  const deck = initDeck(chars, document.getElementById("deck-view"));
  window.__deck = deck;
});
```

Expected in the browser: one card showing "Personaje de prueba" with a disabled "Anterior" button and a disabled "Siguiente" button (only one row). Click the card — it flips to show the back fields. Then run `window.__deck.goTo("test")` in the console — expected: card is shown flipped.

- [ ] **Step 3: Commit**

```bash
git add js/deck.js
git commit -m "feat: add flashcard deck view with flip and prev/next navigation"
```

---

### Task 4: Timeline view

**Files:**
- Create: `js/timeline.js`

**Interfaces:**
- Consumes: an array of character objects (needs at least `id`, `name`, `image_url`, `era_sort_key`), a container `HTMLElement`, and an `onSelect(id)` callback.
- Produces: `function initTimeline(characters, containerEl, onSelect)` (named export) — renders a horizontal timeline into `containerEl`; clicking a point calls `onSelect(id)`. Task 5's `main.js` passes a callback that switches to the deck tab and calls `deck.goTo(id)`.

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

- [ ] **Step 2: Verify with two temporary rows**

Temporarily add a second object to `data/characters.json` (alongside `"test"`) with a different `era_sort_key`, e.g.:

```json
{
  "id": "test-b",
  "name": "Prueba B",
  "image_url": "assets/placeholder.svg",
  "era_label": "Época de prueba B",
  "era_sort_key": 500,
  "lived_in": "Lugar B",
  "known_for": "Prueba B",
  "books": ["Libro B"],
  "sources": ["fuente B"]
}
```

Ask the user to run in the dev console (server running, page reloaded):

```js
import("./js/api.js").then(async (api) => {
  const chars = await api.fetchCharacters();
  const { initTimeline } = await import("./js/timeline.js");
  initTimeline(chars, document.getElementById("timeline-view"), (id) => console.log("selected:", id));
  document.getElementById("timeline-view").hidden = false;
});
```

Expected: two labeled points on a horizontal line, "Personaje de prueba" (era 0) left of "Prueba B" (era 500). Clicking a point logs `selected: test` or `selected: test-b`.

Remove the `"test-b"` object from `data/characters.json` afterward, leaving only `"test"`.

- [ ] **Step 3: Commit**

```bash
git add js/timeline.js
git commit -m "feat: add horizontal timeline view"
```

---

### Task 5: App wiring — router and main entry point

**Files:**
- Create: `js/router.js`
- Create: `js/main.js`

**Interfaces:**
- Consumes: `fetchCharacters` (Task 2), `initDeck` (Task 3), `initTimeline` (Task 4), and the DOM elements from Task 1 (`#deck-view`, `#timeline-view`, `#error-message`, `.tab[data-view]`).
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

- [ ] **Step 3: Verify end-to-end with the placeholder row**

With `data/characters.json` containing just the `"test"` entry, start the server (`python -m http.server 8000`) and ask the user to open `http://localhost:8000` fresh (no manual console imports this time — `main.js` runs on load) and confirm:
1. The deck tab is active by default and shows "Personaje de prueba".
2. Clicking the "Timeline" tab shows one point on a line.
3. Clicking that timeline point switches back to the Mazo tab and shows the card flipped.
4. No errors in the browser console.

- [ ] **Step 4: Verify the error path**

Temporarily rename `data/characters.json` to `data/characters.json.bak`, reload the page, and confirm the `#error-message` paragraph becomes visible with the "No se pudieron cargar los personajes." text and the console shows a 404-based error. Then rename the file back.

- [ ] **Step 5: Commit**

```bash
git add js/router.js js/main.js
git commit -m "feat: wire router and main entry point, handle load errors"
```

---

### Task 6: GitHub Pages deployment

**Files:**
- None new — configuration only.

**Interfaces:**
- Consumes: the working static site from Tasks 1–5.
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

### Task 7: Seed content — Group A (Génesis a Jueces)

Characters: Abel, Noé, Abrahán, Moisés, Rut.

**Files:**
- Modify: `data/characters.json` (replace the `"test"` placeholder with these 5 real entries)
- Create: `assets/images/abel.jpg`, `assets/images/noe.jpg`, `assets/images/abrahan.jpg`, `assets/images/moises.jpg`, `assets/images/rut.jpg`

**Interfaces:**
- Produces: 5 objects in the `data/characters.json` array that Tasks 3–5's already-built UI renders — no code changes needed, this task is pure content + data.

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
  Search jw.org for an official illustration of the character (the "Ficha bíblica" collectible series or article illustrations are good candidates). Download it and save as `assets/images/<id>.jpg` (e.g. `assets/images/abel.jpg`), where `<id>` is the lowercase, no-accent slug used in the data file (`abel`, `noe`, `abrahan`, `moises`, `rut`).

- [ ] **Step 4: Show the drafted fields to the user for approval**
  Present the `name`, `era_label`, `era_sort_key`, `lived_in`, `known_for`, `books`, `sources` values you drafted, and wait for the user to approve or correct them before adding to the JSON.

- [ ] **Step 5: Add the entry to `data/characters.json`**
  Once approved, append an object with this shape to the array (remove the `"test"` placeholder object the first time you do this):

  ```json
  {
    "id": "<id>",
    "name": "<name>",
    "image_url": "assets/images/<id>.jpg",
    "era_label": "<era_label>",
    "era_sort_key": <era_sort_key>,
    "lived_in": "<lived_in>",
    "known_for": "<known_for>",
    "books": [<books>],
    "sources": [<sources>]
  }
  ```

  Validate the file is still well-formed JSON after editing:

  ```bash
  python -c "import json; json.load(open('data/characters.json', encoding='utf-8')); print('valid JSON')"
  ```

- [ ] **Step 6: Verify**
  With the dev server running, reload the app and confirm the new character's card appears in the deck (in the correct chronological position relative to any other seeded entries) and its timeline point is positioned correctly.

- [ ] **Step 7: Commit**
  After all 5 characters in this group are added and verified:

  ```bash
  git add data/characters.json assets/images/abel.jpg assets/images/noe.jpg assets/images/abrahan.jpg assets/images/moises.jpg assets/images/rut.jpg
  git commit -m "content: seed Génesis–Jueces characters (Abel, Noé, Abrahán, Moisés, Rut)"
  ```

---

### Task 8: Seed content — Group B (Reyes al Exilio)

Characters: Ana, Samuel, Jonatán, David, Abigaíl, Elías, Jonás, Ester.

**Files:**
- Modify: `data/characters.json` (append 8 more entries)
- Create: `assets/images/ana.jpg`, `assets/images/samuel.jpg`, `assets/images/jonatan.jpg`, `assets/images/david.jpg`, `assets/images/abigail.jpg`, `assets/images/elias.jpg`, `assets/images/jonas.jpg`, `assets/images/ester.jpg`

**Interfaces:**
- Same as Task 7 — 8 more objects in `data/characters.json`, no code changes.

Follow the exact same 7-step procedure as Task 7 for each character, using these source locations for Step 1:

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
git add data/characters.json assets/images/ana.jpg assets/images/samuel.jpg assets/images/jonatan.jpg assets/images/david.jpg assets/images/abigail.jpg assets/images/elias.jpg assets/images/jonas.jpg assets/images/ester.jpg
git commit -m "content: seed Reyes–Exilio characters (Ana, Samuel, Jonatán, David, Abigaíl, Elías, Jonás, Ester)"
```

---

### Task 9: Seed content — Group C (Evangelios e iglesia primitiva)

Characters: María, José (padre de Jesús), Marta, Pedro.

**Files:**
- Modify: `data/characters.json` (append final 4 entries)
- Create: `assets/images/maria.jpg`, `assets/images/jose.jpg`, `assets/images/marta.jpg`, `assets/images/pedro.jpg`

**Interfaces:**
- Same as Task 7 — final 4 objects in `data/characters.json`, no code changes.

Follow the exact same 7-step procedure as Task 7, using these source locations for Step 1 (all in `ia_S.pdf`):

- María: pages 145–161.
- José (padre de Jesús): pages 162–171.
- Marta: pages 172–179.
- Pedro: pages 180–212.

Ids: `maria`, `jose`, `marta`, `pedro`. For José, disambiguate clearly in `known_for` that this is Joseph the earthly father of Jesus, not Joseph son of Jacob (who isn't in this seed).

- [ ] **Step 7 (final commit for this group):**

```bash
git add data/characters.json assets/images/maria.jpg assets/images/jose.jpg assets/images/marta.jpg assets/images/pedro.jpg
git commit -m "content: seed Evangelios characters (María, José, Marta, Pedro)"
```

- [ ] **Step 8: Final full verification**

With all 17 entries in `data/characters.json` and the dev server running, reload the app and confirm:
1. The deck shows all 17 cards, navigable start to end with no gaps.
2. Every card flips to show non-empty era/lived_in/known_for/books.
3. The timeline shows all 17 points, ordered left-to-right chronologically (Abel first, Pedro last).
4. Clicking any timeline point jumps to that character in the deck, flipped.

Then verify the live GitHub Pages URL from Task 6 shows the same thing.
