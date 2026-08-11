# Suggested Commands

No package manager, no build/test/lint tooling in this repo (static site, single index.html).

- Preview locally: open `index.html` directly in a browser, or serve the folder (e.g. `npx serve .` /
  `python -m http.server`) since it fetches fonts from Google CDN and reads `.image-slots.state.json` via
  relative fetch.
- Windows shell is PowerShell — standard `git`, `Get-ChildItem` (`ls`), `Select-String` (`grep` equivalent)
  differ from Unix; Bash tool (Git Bash) is also available in this environment and behaves POSIX-like.
- No test suite, no CI config found in repo root.
