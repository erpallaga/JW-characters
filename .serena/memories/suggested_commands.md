# Suggested Commands

No package manager or build. Data is fetched, so serve over HTTP (file:// does not work):

- `npx http-server . -p 8080` — then open `/index.html` (deck) or `/admin.html` (panel).
- `node tools/comprobar-mapas.mjs` — every card has a map spec, places exist, PNG frame, markers visible.
- `node tools/comprobar-libros.mjs` — books table and passage chapters; `--red --capitulos` opens jw.org.
- `node tools/generar-mapas.mjs [--todas | id ...]` — redraw map PNGs in headless Chromium
  (`CHROMIUM` env var overrides the binary path). Output must be byte-identical unless a spec changed.
- Owner's machine is Windows (PowerShell); Git Bash is POSIX-like.
