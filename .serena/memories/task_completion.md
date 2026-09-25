# Task Completion

No CI and no test runner. Before calling a change done:

- Data change: run `node tools/comprobar-mapas.mjs` and `node tools/comprobar-libros.mjs`; both must end
  without "cosas mal". New book ids go in `data/books.json`, new places in `data/lugares.json`.
- Map spec change: regenerate that map with `tools/generar-mapas.mjs <id>` and commit the PNG.
- `admin/mapa.js` change: regenerate all maps; `git status assets/` must stay clean unless intended.
- `admin/model.js` change: it is pure, exercise `rebasar`/`ficherosDelCommit` from node.
- UI change: serve the folder and check the deck (single, grid, era filter, quiz, shuffle, mobile width)
  or the panel. The panel can be driven against a mocked `api.github.com` so nothing is published.
- Do not hand-edit `support.js` (generated).
