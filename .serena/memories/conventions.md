# Conventions

- App content/UI language is Spanish (labels, character bios, era names) — keep new user-facing strings in Spanish.
- Colors use `oklch(...)` exclusively (light/paper "clay" theme), inline in `style="..."` attribute strings —
  no CSS classes, no stylesheet file. Two accent palettes exist: `CLAY`/`CLAY_SOFT` (default) and
  `TEKHELET`/`TEKHELET_SOFT`, switched via the `accentPalette` prop declared in the `data-props` block
  (index.html:215-220).
- Template uses custom pseudo-JSX tags handled by `support.js`'s dc-runtime: `<sc-for list="{{ expr }}" as="item">`
  for loops, `<sc-if value="{{ expr }}" hint-placeholder-val="{{ default }}">` for conditionals, `{{ expr }}`
  interpolation in attributes/text. Treat these as the templating language, not literal custom elements.
- Character records live in the `CHARACTERS` array (index.html, starts ~line 243), one object per person:
  `id, name, eraId, timeframe, place, mapSrc, mapPos, life:{start,end} (negative=BCE), knownFor, passages:[{label,href}]`.
  `passages[].href` built via `jw(book, chapter)` helper (index.html:239) — links to jw.org NWT Bible reader;
  `book` must be a key already present in the `SLUG` map (index.html:232), add new entries there before using
  a new book.
- Eras are a fixed ordered list `ERAS` (index.html:221-230) with `id/label/range`; character `eraId` must match
  one of these ids — this drives era filter chips and the timeline segments.
- `hasImageSlot` is derived from `!!c.mapSrc` — every character with a map image gets an `<image-slot>` portrait
  placeholder; characters without `mapSrc` fall back to the inverse placeholder state.
