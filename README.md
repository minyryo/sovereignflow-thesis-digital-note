# SovereignFlow - thesis digital note

A static site: thesis title → scroll for the week-by-week record → click the title for the
mindmap. No build step, no dependencies, no framework. Deploys to GitHub Pages as-is.

```
index.html
assets/css/style.css
assets/js/{app,mindmap,scenes,timeline}.js  router · mindmap · 2 scenes · timeline
data/refs.js                             bibliography  (edit by hand)
data/mindmap.js                          mindmap content  (edit by hand)
data/timeline-manual.json                your weekly findings  (edit by hand)
data/timeline.js                         GENERATED from git history
data/methods.generated.js                GENERATED from the research-method-guide.md
tools/build_timeline.py                  regenerates data/timeline.js
tools/build_methods.py                   regenerates data/methods.generated.js
.nojekyll                                stops GitHub from running Jekyll
```

Data lives in `.js` files that assign to `window.*` rather than `.json` fetched at runtime.
That is deliberate: `fetch()` is blocked by CORS on `file://`, so JSON would make
double-clicking `index.html` show a blank page. This way local preview just works.

## Preview locally

Open `index.html` in a browser. That is all.

A local server also works if you prefer one:

```bash
python3 -m http.server 8000      # then visit http://localhost:8000
```

## Add a weekly finding

1. Edit `data/timeline-manual.json` - add an entry to `events`:

   ```json
   { "week": 4,
     "summary": "One sentence: the new finding.",
     "detail": "Optional second line with the why.",
     "proof": {} }
   ```

2. Regenerate:

   ```bash
   python3 tools/build_timeline.py
   ```

**The fallback.** Any week *not* listed in `timeline-manual.json` is filled in automatically
from that week's **latest commit** in `thesis-artifacts`: the commit subject becomes the
summary, the commit URL becomes the proof link. Those entries show an `auto` chip; hand-written
ones show `noted`. Leaving `"proof": {}` on a hand-written entry inherits that week's commit
link, so you get a real proof link without pasting URLs.

Plan weeks follow the master plan - **W1 = Monday 2026-09-07**.

Options:

```bash
python3 tools/build_timeline.py --repo /path/to/thesis-artifacts   # non-default location
python3 tools/build_timeline.py --all-branches                      # scan every branch
```

## Two explanatory scenes

Toolbar buttons in the mindmap (also reachable from the *Decomposition criteria* and
*Three axes* nodes):

- **Title breakdown** - the full thesis title with its phrases highlighted, re-annotated
  by each of the four criteria (completeness · orthogonality · boundaries · scope). Each
  tab shows what that criterion says about the breakdown, and which defect it caught.
- **3 axes in 3D** - the three axes as an actual rotatable cube. Axis A (scope) on x,
  Axis B (design ↔ knowledge) on y, Axis C (criticality) on z. Every deliverable and RQ
  is a point positioned by all three at once. Drag to rotate; arrow keys work; hover a
  point for its coordinates.

## Research-methods mode comes from markdown

That mode is **generated**, not hand-edited. Its source is the `site:methods` block at
the bottom of:

```
../thesis-artifacts/personal/research-method-guide.md
```

Edit the markdown, then:

```bash
python3 tools/build_methods.py            # -> data/methods.generated.js
python3 tools/build_methods.py --check    # parse and report; writes nothing
```

The generated file overrides `THESIS_MINDMAP.methods` at load time, so `data/mindmap.js`
keeps a working hand-written fallback. Block format and the key list are documented in
Part F of that markdown file.

Guard rails: a missing block, or a block that parses to zero branches, leaves the existing
generated file untouched and exits non-zero - a typo cannot blank the mindmap. Unknown
`ref:` keys are reported against `data/refs.js` rather than failing silently. **Both
markers must sit alone on their own line**; that is what lets the prose above the block
discuss the markers without the parser swallowing the document.

To change any *other* mode - questions, findings, traceability, deliverables - edit
`data/mindmap.js` directly. They have no markdown source yet; the generator is written so
adding a second block is a small change.

## Edit the mindmap

`data/mindmap.js` holds one tree per mode. Node schema:

```js
{
  id: "m-ortho",
  label: "Orthogonality",          // text on the node
  badge: "C-2",                    // small code above the label
  takeaway: "…",                   // "My takeaway" - your words, your claim
  refs: [{ key: "parnas1972modules", quote: "…", page: "p. 1056" }],
  fields: [{ k: "Argued from", v: "…", tag: "warn" }],
  children: [ … ]
}
```

`refs[].key` points into `data/refs.js`. A `quote`/`page` on the node overrides the one on the
reference, so the same source can carry a different quotation at each node that uses it.

Modes present: **research methods**, **questions ↔ gaps**, **findings**, plus two suggested
extras marked ★ - **traceability** (title phrase → gap → RQ → criterion) and **deliverables**
(O1-O7 with acceptance thresholds). Add a mode by adding a key to `THESIS_MINDMAP` and listing
it in `THESIS_MODE_ORDER`.

### On quotations

Every `quote` field in `data/refs.js` ships **empty**, and the panel shows a "quote pending"
flag instead. Nothing is quoted that has not been read and transcribed by hand. A fabricated
quotation attributed to a real paper is the one error that cannot be walked back at a defence,
so fill these in as you read. Same for the `verify` arrays - they list fields not yet confirmed
against the PDF, and the panel surfaces them.

## Deploy to GitHub Pages

Deployment is automated. `.github/workflows/deploy.yml` runs on every push to `main`:
a **verify** job, then a **deploy** job that publishes the repo as-is.

The verify job fails the build before anything ships if:

- any file in `assets/js/` or `data/` does not parse (`node --check`)
- `data/timeline-manual.json` is not valid JSON
- a required file is missing or empty
- a data file stops defining its global (`THESIS_REFS`, `THESIS_MINDMAP`, `THESIS_TIMELINE`, `THESIS_MINDMAP.methods`)
- `index.html` gains a root-relative path like `src="/assets/..."`, which works locally but 404s on a project site served from `/<repo>/`

### First-time setup

```bash
cd thesis-digital-note
git init
git add -A
git commit -m "thesis digital note: initial site"
git branch -M main
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

Then, once only: **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
Not "Deploy from a branch". The workflow needs the Actions source or it cannot publish.

The first push triggers the workflow. Watch it under the repo's **Actions** tab; the URL
appears on the `deploy` job when it finishes.

### After that

```bash
git add -A && git commit -m "what changed" && git push
```

Pages redeploys on its own. All paths are relative, so the site works at both
`https://<you>.github.io/` (name the repo `<you>.github.io`) and
`https://<you>.github.io/<repo>/` with no config change.

### What CI cannot do

`tools/build_methods.py` and `tools/build_timeline.py` read from `../thesis-artifacts`,
which is a **separate and private** repo. The CI runner has no access to it, so it cannot
regenerate `data/methods.generated.js` or `data/timeline.js`.

That is why both generated files are committed. Run the generators on your Mac, commit the
result, then push:

```bash
python3 tools/build_methods.py
python3 tools/build_timeline.py
git add data/ && git commit -m "refresh generated data" && git push
```

If you forget, the site still deploys; it just shows the previous week's data. CI checks
that the files exist and parse, not that they are current, because it has nothing to
compare them against.

## Reading it on a phone or iPad

- **Pinch to zoom, drag to pan, double-tap empty canvas to refit.** Pinch matters: there is
  no scroll wheel on a touch screen, so without it you could pan but never zoom.
- **The mindmap opens zoomed to a readable level, not fitted.** Fitting a 24-node tree into
  a phone screen renders 13px labels at about 6px. `fit()` clamps to a minimum scale of 0.8
  (labels about 10px) and opens centred on the root. On a desktop wide enough to show the
  whole tree at that scale, nothing changes.
- **Tap a node to open the detail sheet** from the bottom; tap the X or the empty canvas to
  dismiss it. On desktop the same panel is docked to the right instead.
- **Add to Home Screen** works: there is a theme colour and an apple-mobile-web-app title,
  so it opens without browser chrome.
- Safe-area insets are handled, so nothing hides behind the notch or the home indicator.

## Two things to know

**Proof links point at a private repo.** `sovereignflow-thesis-artifacts` is private, so commit
links resolve only for people with access. If the note is meant for a public audience, either
make the artifacts repo public or point `proof.url` at something public (a release, a gist, a
PDF in this repo).

**`--all-branches` currently fails.** The artifacts repo has three stray iCloud conflict-copy
ref files, which makes `git log --all` abort with `fatal: bad object`:

```
.git/refs/heads/p1-o7-dacn-report-demo/hieu-w02 2
.git/refs/remotes/origin/main 2
.git/refs/remotes/origin/p1-o7-dacn-report-demo/hieu-w03-w04 2
```

They are junk duplicates (note the trailing ` 2`), not real refs. Deleting those three files
fixes `--all`. Single-branch mode is unaffected and is what the default uses.
