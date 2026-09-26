# Tech Stack

Static site on GitHub Pages. No build step, no package.json, no framework in the panel.

- `index.html` — the deck: a Claude Design `.dc` component. Template inside `<x-dc>`, logic in
  `<script type="text/x-dc" data-dc-script data-props="...">` (React-class-like: `state`, `setState`,
  `renderVals()`). Read-only: fetches `data/characters.json`, `data/eras.json`, `data/books.json`.
- `support.js` — GENERATED dc-runtime (upstream `dc-runtime` project, not in repo). Never hand-edit.
  Loads React from unpkg only if `window.React` is missing; `index.html` preloads it from `vendor/`
  (same files, same SRI). `tools/comprobar-vendor.mjs` keeps runtime, files and tags in sync.
- `admin.html` + `admin/*.js` — admin panel, plain ES modules loaded directly by the browser:
  - `app.js` screens (login, token, list, editor, eras, publish) and state; `ui.js` `h()` DOM helper + icons.
  - `model.js` pure logic: diff draft vs published, `rebasar` (3-way merge of the stored draft onto the
    latest published data), commit file list (`ficherosDelCommit`: uploads only referenced images, deletes
    published images no card uses). Unit-testable in node.
  - `github.js` GitHub REST client: one commit per publish via Git Data API (blobs → tree → commit → ref).
  - `store.js` IndexedDB: draft (full dataset), snapshot of published (base for the merge), pending images.
  - `auth.js` password gate (SHA-256 in `config.js`, only hides UI); the GitHub token is the real auth.
  - `images.js`/`encuadre.js` crop+resize uploads to 3:4 portrait / 5:3 map; `png.js` indexed PNG encoder.
  - `mapa.js` map renderer (Mercator over `data/geo/`), shared by `editor-mapa.js` and `tools/render.html`.
- `data/` — `characters.json`, `eras.json`, `books.json` (66 books, jw.org slugs), `lugares.json`
  (gazetteer), `geo/` (Natural Earth clips).
- `assets/` — `portrait-<id>.jpg`, `mapa-<id>.png` (909×540 indexed PNG).
- `tools/` — node scripts: `generar-mapas.mjs` (headless Chromium via CDP), `comprobar-mapas.mjs`,
  `comprobar-libros.mjs`, `comprobar-vendor.mjs`, `probar-modelo.mjs` (model.js tests); python helpers
  `preparar-geo.py`, `wol.py`.
- `.github/workflows/comprobaciones.yml` — CI: the four node checks on push to main / PR; jw.org links
  weekly (`--red --capitulos --exigir-red`).
- `docs/` — panel manual (`panel.md`), design sources, fact-check reports, original specs/plans.
- Reference PDFs are gitignored.

See `mem:conventions` for data schema and styling rules.
