# Task Completion

No automated linter/formatter/test runner configured. To consider a change done:

- Open/reload `index.html` in a browser and visually verify (grid view, single-card flip view, era filter,
  quiz mode toggle, shuffle) — this is a hand-authored template, no compile step to catch errors.
- If a new character was added: confirm its `eraId` matches an existing `ERAS` entry, any new `jw()` book key
  was added to `SLUG` (index.html:232), and `assets/mapa-<id>.png` exists if `mapSrc` is set.
- Do not hand-edit `support.js` or `image-slot.js` — both are generated/vendored (see `mem:tech_stack`).
