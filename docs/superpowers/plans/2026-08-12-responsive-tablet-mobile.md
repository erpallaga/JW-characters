# Responsive Tablet/Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `index.html` (the only source file) usable and visually correct at phone (375px), tablet (768px), and desktop (1280px) widths, in both view modes (Una por una / Cuadrícula) and both quiz-mode states, without changing data, behavior, or desktop appearance.

**Architecture:** CSS-only change inside the existing `<style>` block in the `<helmet>` (fluid values via `clamp()`/`min()` edited directly into style strings) plus a small number of static `class` attributes added to template `div`s so `@media` rules can override JS-set inline styles (`!important`) for the two row→column structural switches (single-card front face, single-card back face). No JS state, no resize listener, no new files.

**Tech Stack:** Plain HTML/CSS, `dc-runtime` template engine already in the repo (`support.js`) — confirmed `class="..."` on a plain `div` compiles to `className` normally, so static classes work without engine changes.

## Global Constraints

- Single file: all changes land in `index.html`. Do not modify `support.js`.
- Desktop behavior (≥900px) must be visually unchanged after the work — verify by comparing before/after at 1280px.
- No new dependencies, no build step.
- Breakpoints: mobile `<640px`, tablet `640–899px`, desktop `≥900px` (per spec `docs/superpowers/specs/2026-08-12-responsive-tablet-mobile-design.md`).
- Touch targets on mobile should be ~32–44px; on tablet/desktop keep existing ~44px.
- No automated test suite exists in this repo (static content app) — validation is manual, via a local static server and viewport resizing, as specified in the design doc's "Pruebas / validación" section.

---

### Task 1: Fluid header, era chips, and timeline row

**Files:**
- Modify: `index.html` (header block, lines ~25–62 in current file — search for `Personajes de la Biblia` and the era chips/timeline `sc-for` blocks)

**Interfaces:**
- Consumes: nothing (pure literal template edits, no JS state).
- Produces: nothing consumed by later tasks — purely visual, independent of Tasks 2–4.

- [ ] **Step 1: Reduce header padding and title size on narrow screens**

Find the header container div (currently `padding:48px 32px 20px`) and the `<h1>` (currently `font-size:44px`). Change to fluid values so they shrink automatically instead of forcing horizontal scroll or overflow on a 375px viewport:

```html
<div style="max-width:1180px;margin:0 auto;padding:clamp(24px,6vw,48px) clamp(16px,4vw,32px) 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap;">
```

```html
<h1 style="font-family:'Amiri',serif;font-size:clamp(28px,7vw,44px);font-weight:700;color:oklch(0.26 0.03 50);margin:0;line-height:1.1;">Personajes de la Biblia</h1>
```

- [ ] **Step 2: Reduce padding on the chips row and timeline row containers**

The two sibling containers right below the header (era chips row, timeline row) use `padding:8px 32px 0` and `padding:6px 32px 28px`. Change the horizontal `32px` in both to `clamp(16px,4vw,32px)`:

```html
<div style="max-width:1180px;margin:0 auto;padding:8px clamp(16px,4vw,32px) 0;">
```

```html
<div style="max-width:1180px;margin:0 auto;padding:6px clamp(16px,4vw,32px) 28px;">
```

- [ ] **Step 3: Manual check — header at 375px width**

Serve the app locally:

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && python -m http.server 8000
```

Open `http://localhost:8000/index.html`, use browser devtools responsive mode at 375×812 (iPhone-ish). Confirm:
- No horizontal scrollbar on the page.
- Title wraps/shrinks but stays on one or two lines, not clipped.
- Toggle buttons (Una por una / Cuadrícula), Barajar, and Modo repaso still fit and wrap sanely (they already have `flex-wrap`).

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && git add index.html && git commit -m "style: fluid header/chip padding for narrow viewports

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Single-card view wrapper and arrow buttons

**Files:**
- Modify: `index.html`, literal template around lines ~65–150 (the `isSingleView` block: perspective wrapper, arrow buttons)
- Modify: `index.html`, `arrowBtnStyle` object inside `renderVals()` (search `arrowBtnStyle:`)

**Interfaces:**
- Consumes: nothing new.
- Produces: `.jw-single-wrap` class name and `.jw-arrow` class name, referenced by the `@media` rule added in this task — later tasks (3, 4) add their own independent classes and don't depend on these.

- [ ] **Step 1: Add classes and make the perspective wrapper fluid-width**

Find this line (the `perspective` wrapper around the flip card):

```html
<div style="perspective:1800px;width:720px;max-width:100%;height:460px;">
```

Replace with (adds a class for the media-query height override, and makes width fill available space instead of a hard 720px):

```html
<div class="jw-single-wrap" style="perspective:1800px;width:min(720px,100%);height:460px;">
```

- [ ] **Step 2: Make the Prev/Next buttons not push the card off-screen**

Find the two arrow buttons:

```html
<button onClick="{{ onPrev }}" style="{{ arrowBtnStyle }}">‹</button>
```
```html
<button onClick="{{ onNext }}" style="{{ arrowBtnStyle }}">›</button>
```

Add `class="jw-arrow"` to both:

```html
<button onClick="{{ onPrev }}" class="jw-arrow" style="{{ arrowBtnStyle }}">‹</button>
```
```html
<button onClick="{{ onNext }}" class="jw-arrow" style="{{ arrowBtnStyle }}">›</button>
```

- [ ] **Step 3: Give the arrow buttons `flex-shrink:0` in their JS style object**

In `renderVals()`, find `arrowBtnStyle:` (a plain object, not per-item):

```js
      arrowBtnStyle: {
        width: '44px', height: '44px', borderRadius: '50%', border: '1px solid oklch(0.82 0.02 70)',
        background: 'oklch(0.97 0.01 80)', color: 'oklch(0.26 0.03 50)', fontSize: '18px', fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      },
```

Confirm `flexShrink: 0` is present (it already is in the current file) — no change needed here, just verify while editing Step 2 so the CSS override in Step 4 has a stable base to shrink from.

- [ ] **Step 4: Add the `@media` rules**

In the `<style>` block inside `<helmet>` (top of file, right after the `::-webkit-scrollbar-thumb` rule), add:

```css
@media (max-width: 899px) {
  .jw-single-wrap{height:520px;}
}
@media (max-width: 639px) {
  .jw-single-wrap{height:640px;}
  .jw-arrow{width:32px !important;height:32px !important;font-size:15px !important;}
}
```

- [ ] **Step 5: Manual check — single view at 768px and 375px**

With the local server still running (from Task 1), reload at 768×1024 (tablet) and 375×812 (phone) in "Una por una" view. Confirm:
- No horizontal scrollbar.
- Prev/Next buttons visible and tappable, card doesn't get squeezed to near-zero width.
- Card height doesn't clip content (content overflow inside the card is fine — it already scrolls internally — but the whole card must fit vertically in the viewport with room to scroll the page if needed).

(Card content itself will still look wrong at this point — front/back faces are still row-based until Tasks 3–4. That's expected here; this task only fixes the outer wrapper and nav buttons.)

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && git add index.html && git commit -m "style: responsive single-card wrapper and nav buttons

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Single-card front face — stack portrait above text on mobile

**Files:**
- Modify: `index.html`, literal template lines ~72–85 (`singleCard.frontFaceInnerStyle` div and the portrait div inside it)
- Modify: `index.html`, `SINGLE_FRONT_FACE_INNER_STYLE` constant and `frontPortraitStyle` inside `singleCard` builder in `renderVals()`

**Interfaces:**
- Consumes: `.jw-single-wrap` height values from Task 2 (front face must fit inside that height).
- Produces: `.jw-front-inner` and `.jw-front-portrait` classes, independent of Task 4's back-face classes.

- [ ] **Step 1: Add classes to the front-face inner row and the portrait block**

Find:

```html
<div style="{{ singleCard.frontFaceInnerStyle }}">
  <div style="{{ singleCard.frontPortraitStyle }}" onClick="{{ stopBubble }}" onPointerDown="{{ singleCard.onPortraitDown }}" onDoubleClick="{{ singleCard.onPortraitReset }}">
```

Replace with:

```html
<div class="jw-front-inner" style="{{ singleCard.frontFaceInnerStyle }}">
  <div class="jw-front-portrait" style="{{ singleCard.frontPortraitStyle }}" onClick="{{ stopBubble }}" onPointerDown="{{ singleCard.onPortraitDown }}" onDoubleClick="{{ singleCard.onPortraitReset }}">
```

- [ ] **Step 2: Add responsive width to `frontPortraitStyle` (tablet: narrower fixed width instead of 380px)**

In `renderVals()`, inside the `singleCard` builder, find:

```js
        frontPortraitStyle: {
          position: 'relative', width: '380px', flexShrink: 0, borderRadius: '18px 0 0 18px', overflow: 'hidden',
          backgroundColor: 'oklch(0.88 0.02 75)', backgroundImage: single.portraitSrc ? `url(${single.portraitSrc})` : 'none',
          backgroundSize: 'cover', backgroundPosition: this.getPortraitPos(single.id),
          cursor: this.state.draggingPortrait === single.id ? 'grabbing' : 'grab', touchAction: 'none',
        },
```

Change `width: '380px'` to `width: 'min(380px, 42%)'` so it scales down on tablet widths without JS branching (the `@media` rule in Step 3 fully overrides it on mobile anyway):

```js
        frontPortraitStyle: {
          position: 'relative', width: 'min(380px, 42%)', flexShrink: 0, borderRadius: '18px 0 0 18px', overflow: 'hidden',
          backgroundColor: 'oklch(0.88 0.02 75)', backgroundImage: single.portraitSrc ? `url(${single.portraitSrc})` : 'none',
          backgroundSize: 'cover', backgroundPosition: this.getPortraitPos(single.id),
          cursor: this.state.draggingPortrait === single.id ? 'grabbing' : 'grab', touchAction: 'none',
        },
```

- [ ] **Step 3: Add the `@media` rule for mobile stacking**

In the `<style>` block, extend the `max-width: 639px` block added in Task 2:

```css
@media (max-width: 639px) {
  .jw-single-wrap{height:640px;}
  .jw-arrow{width:32px !important;height:32px !important;font-size:15px !important;}
  .jw-front-inner{flex-direction:column !important;}
  .jw-front-portrait{width:100% !important;height:190px !important;border-radius:18px 18px 0 0 !important;}
}
```

- [ ] **Step 4: Manual check — front face at 375px and 768px**

Reload "Una por una" view (front of card, not flipped) at 375px: portrait should be a full-width band on top (~190px tall), name and era pill below it, both fully visible, no horizontal scroll. At 768px: portrait and text should sit side by side, narrower than desktop but not overlapping or clipped.

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && git add index.html && git commit -m "style: stack single-card front face on mobile

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Single-card back face — stack sidebar above content on mobile

**Files:**
- Modify: `index.html`, literal template lines ~87–143 (back face: quiz sidebar, non-quiz sidebar, content column)
- Modify: `index.html`, `singleCard.mapStyle` inside `renderVals()`

**Interfaces:**
- Consumes: `.jw-single-wrap` height values from Task 2.
- Produces: `.jw-back-inner`, `.jw-back-sidebar` classes. Independent of Task 3.

- [ ] **Step 1: Add a class to the back-face inner row**

Find:

```html
<div style="{{ singleCard.backFaceInnerStyle }}">
```

(there is exactly one occurrence, inside the single-card back face — do not touch the grid-view one, which has a different variable name `ch.backFaceInnerStyle`). Replace with:

```html
<div class="jw-back-inner" style="{{ singleCard.backFaceInnerStyle }}">
```

- [ ] **Step 2: Add a class to both sidebar variants (quiz and non-quiz)**

Find the quiz-mode sidebar:

```html
<div style="width:230px;flex-shrink:0;padding-right:20px;">
```

Replace with:

```html
<div class="jw-back-sidebar" style="width:230px;flex-shrink:0;padding-right:20px;">
```

Find the non-quiz sidebar right after it:

```html
<div style="width:230px;flex-shrink:0;display:flex;flex-direction:column;gap:14px;border-right:1px solid oklch(0.82 0.02 70);padding-right:20px;">
```

Replace with:

```html
<div class="jw-back-sidebar" style="width:230px;flex-shrink:0;display:flex;flex-direction:column;gap:14px;border-right:1px solid oklch(0.82 0.02 70);padding-right:20px;">
```

- [ ] **Step 3: Reduce the map's `minHeight` on mobile via the JS style object**

In `renderVals()`, find `mapStyle:` inside the `singleCard` builder:

```js
        mapStyle: {
          position: 'relative', flex: 1, minHeight: '220px', borderRadius: '10px', border: '1px solid oklch(0.82 0.02 70)', overflow: 'hidden',
          background: 'repeating-linear-gradient(60deg, oklch(0.9 0.018 75), oklch(0.9 0.018 75) 5px, oklch(0.94 0.014 78) 5px, oklch(0.94 0.014 78) 10px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
        },
```

Leave this object as-is (the `@media` rule in Step 4 will override `minHeight` with `!important` on mobile — no JS branching needed since there's no class hook required here, the override targets `.jw-back-sidebar .jw-map` — add a class to the map div itself first). Find the map wrapper div in the template:

```html
<div style="{{ singleCard.mapStyle }}">
```

Replace with:

```html
<div class="jw-map" style="{{ singleCard.mapStyle }}">
```

- [ ] **Step 4: Add the `@media` rule for mobile stacking**

Extend the `max-width: 639px` block again:

```css
@media (max-width: 639px) {
  .jw-single-wrap{height:640px;}
  .jw-arrow{width:32px !important;height:32px !important;font-size:15px !important;}
  .jw-front-inner{flex-direction:column !important;}
  .jw-front-portrait{width:100% !important;height:190px !important;border-radius:18px 18px 0 0 !important;}
  .jw-back-inner{flex-direction:column !important;gap:14px !important;}
  .jw-back-sidebar{width:100% !important;border-right:none !important;padding-right:0 !important;border-bottom:1px solid oklch(0.82 0.02 70) !important;padding-bottom:14px !important;}
  .jw-map{min-height:140px !important;}
}
```

- [ ] **Step 5: Manual check — back face (flipped card) at 375px, quiz mode off and on**

Reload, tap the card to flip it, at 375px width:
- Non-quiz: name + map + "Dónde vivió" block stacks above the "Por qué se le conoce" / passages / timeline content, no horizontal scroll, map still shows the schematic pattern or image.
- Toggle "Modo repaso" on: quiz sidebar (portrait-only) stacks above the reveal button / "¿Quién es?" content the same way.
- At 768px: sidebar and content should sit side by side, narrower than desktop.

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && git add index.html && git commit -m "style: stack single-card back face on mobile

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Grid view — 2 columns on phone, fluid card height

**Files:**
- Modify: `index.html`, literal template line ~154 (grid container)
- Modify: `index.html`, per-item `portraitStyle`/card sizing inside `renderVals()` is not touched — the grid card height (`height:340px` at line ~156, in the literal template) is what changes.

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (leaf task).

- [ ] **Step 1: Lower the grid's minimum column width**

Find:

```html
<div style="max-width:1180px;margin:0 auto;padding:8px 32px 72px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:26px;">
```

Replace with:

```html
<div style="max-width:1180px;margin:0 auto;padding:8px clamp(16px,4vw,32px) 72px;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(230px,42vw),1fr));gap:clamp(14px,3vw,26px);">
```

(`min(230px,42vw)` means: on a 375px phone the effective minimum column is `42vw ≈ 157px`, so two columns fit with the gap; on desktop it stays 230px since `42vw` there is much larger than 230px and `min()` picks 230px.)

- [ ] **Step 2: Make the per-card height fluid**

Find:

```html
<div style="perspective:1400px;height:340px;">
```

Replace with:

```html
<div style="perspective:1400px;height:clamp(260px,72vw,340px);">
```

(On a narrow 2-column phone layout each card is roughly half the viewport width; `72vw` keeps the card proportionally shorter there while `clamp` caps it at the original 340px on desktop.)

- [ ] **Step 3: Manual check — grid view at 375px, 768px, 1280px**

Switch to "Cuadrícula" view. Confirm:
- 375px: 2 columns, cards not so short that the portrait+name+era pill get cramped or overlap.
- 768px: 3–4 columns depending on width, matching the existing `auto-fill` behavior.
- 1280px: unchanged from before this task (same column count/card size as the current deployed version).
- Flip a few cards (click) to confirm the back-face content (place/knownFor/passages) still fits without clipping at 375px.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && git add index.html && git commit -m "style: responsive grid columns and card height

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Full cross-check and drag-to-reposition regression check

**Files:**
- None modified (validation-only task). May produce small follow-up fixes to `index.html` if issues are found — if so, treat as an inline fix + commit, not a new task.

**Interfaces:**
- Consumes: everything from Tasks 1–5.
- Produces: final confirmation the feature is done.

- [ ] **Step 1: Full matrix pass**

With the local server running, go through this matrix in the browser, resizing devtools to each width (375px, 768px, 1280px) and toggling each mode:

| Width | View | Quiz mode | Check |
|---|---|---|---|
| 375 | Una por una | off | front + back face readable, no horiz scroll |
| 375 | Una por una | on | quiz portrait sidebar stacks correctly, reveal button works |
| 375 | Cuadrícula | off | 2-column grid, flip works |
| 768 | Una por una | off | row layout, narrower than desktop, no overlap |
| 768 | Cuadrícula | off | multi-column grid |
| 1280 | Una por una | off | identical to pre-change desktop layout |
| 1280 | Cuadrícula | off | identical to pre-change desktop layout |

- [ ] **Step 2: Drag-to-reposition regression check on mobile viewport**

At 375px, in "Una por una" view (front face), use devtools touch-emulation (or mouse, since `onPointerDown` handles both) to drag the portrait. Confirm the image position updates and persists (double-click/tap resets it, per existing `onPortraitReset` behavior). Repeat in "Cuadrícula" view on one card's portrait.

- [ ] **Step 3: Compare desktop (1280px) screenshot before/after**

If any visual difference from the pre-Task-1 desktop layout is found, fix it in `index.html` now (the `clamp()`/`min()` values should all resolve to their original fixed values at ≥900px — if they don't, the clamp bounds are wrong).

- [ ] **Step 4: Final commit (only if Step 3 required a fix)**

```bash
cd "C:\Users\PaEr760\Documents\GitHub\JW-characters" && git add index.html && git commit -m "fix: correct desktop regression from responsive pass

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```
