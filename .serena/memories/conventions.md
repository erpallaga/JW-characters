# Conventions

- All user-facing text, identifiers in the panel/tools, comments and commit messages are in Spanish.
- Deck styling: `oklch(...)` colors inline in style strings/objects; palettes `CLAY`/`TEKHELET` via the
  `accentPalette` prop. Panel reuses the same values as CSS custom properties in `admin.html`.
- Deck template DSL (dc-runtime): `<sc-for list="{{ expr }}" as="x">`, `<sc-if value="{{ expr }}">`,
  `{{ expr }}` interpolation. Values come from `renderVals()`.
- Character record (`data/characters.json`), array order = deck order (manual, not strictly by date):
  `id, name, eraId, timeframe, place, portraitSrc, mapSrc, mapPos, map, knownFor, passages[], life, hidden?`.
  - `life: {start, end, approx?}`, negative = a.e.c. Timeline spans -4026..100.
  - `passages[]: {book, chapter, label}`; `book` must be an id in `data/books.json`; URL built at runtime.
  - `map: {lugares[], etiquetas?, ruta?, curva?, zoom?, centro?}`; `lugares` are gazetteer ids or
    `{id?, lon, lat, label}`. With `etiquetas`, only those ids get a written label; manual entries without
    id are always labelled. Every place needs an explicit verse placing the person there.
  - `eraId` must exist in `data/eras.json`. `hidden: true` keeps the card out of the deck.
- `id` follows the name until first publish, then is frozen (asset filenames depend on it).
- Maps are drawn, not sourced: edit `map` and regenerate; never hand-edit PNGs. Drawn = `mapSrc` is PNG.
  A JPG `mapSrc` is a hand-uploaded map: its `map` spec is kept (reviewed data) but does not describe
  the image; checker only warns + checks ratio, batch generator skips it.
