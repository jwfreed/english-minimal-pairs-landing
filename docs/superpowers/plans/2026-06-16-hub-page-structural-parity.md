# Hub-Page Structural Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize the structural skeleton of both SEO hub-page families across all 13 locales without changing any localized copy.

**Architecture:** Pure static-HTML edits. Six files change: remove Thai's duplicate contrast list from `english-ear-training`, and in `minimal-pairs-practice` add the missing `id="related-guide"` to four sections and relocate Korean's section to after `#soundwise`. No build-system, routing, metadata, or copy changes.

**Tech Stack:** Static HTML, Vite (build only), Node 22, existing `scripts/validate-*.mjs` validators.

**Spec:** `docs/superpowers/specs/2026-06-16-hub-page-structural-parity-design.md`

**Note on testing:** These pages have no unit tests. "Verification" steps are exact shell commands (structural audit, build, validators, JSON-LD parse, `git diff`) with expected output.

---

### Task 1: Remove Thai ear-training duplicate contrast list

**Files:**
- Modify: `th/english-ear-training/index.html` (`#minimal-pairs-guide` section)

- [ ] **Step 1: Confirm the current state**

Run: `sed -n '/id="minimal-pairs-guide"/,/<\/section>/p' th/english-ear-training/index.html | grep -c -- '-vs-'`
Expected: `16`

- [ ] **Step 2: Remove the `<ul>` list, keeping the cross-link sentence**

Edit `th/english-ear-training/index.html`. Replace this exact block:

```html
                <p><a href="/th/minimal-pairs-practice/">ดูวิธีฝึกด้วย minimal pairs</a></p>
                <ul>
                  <li><a href="https://getsoundwise.co/bit-vs-beat/">bit vs beat</a></li>
                  <li><a href="https://getsoundwise.co/ship-vs-sheep/">ship vs sheep</a></li>
                  <li><a href="https://getsoundwise.co/sit-vs-seat/">sit vs seat</a></li>
                  <li><a href="https://getsoundwise.co/live-vs-leave/">live vs leave</a></li>
                  <li><a href="https://getsoundwise.co/fill-vs-feel/">fill vs feel</a></li>
                  <li><a href="https://getsoundwise.co/bad-vs-bed/">bad vs bed</a></li>
                  <li><a href="https://getsoundwise.co/man-vs-men/">man vs men</a></li>
                  <li><a href="https://getsoundwise.co/pan-vs-pen/">pan vs pen</a></li>
                  <li><a href="https://getsoundwise.co/thin-vs-tin/">thin vs tin</a></li>
                  <li><a href="https://getsoundwise.co/think-vs-tink/">think vs tink</a></li>
                  <li><a href="https://getsoundwise.co/vest-vs-west/">vest vs west</a></li>
                  <li><a href="https://getsoundwise.co/vine-vs-wine/">vine vs wine</a></li>
                  <li><a href="https://getsoundwise.co/right-vs-light/">right vs light</a></li>
                  <li><a href="https://getsoundwise.co/rice-vs-lice/">rice vs lice</a></li>
                  <li><a href="https://getsoundwise.co/cap-vs-cab/">cap vs cab</a></li>
                  <li><a href="https://getsoundwise.co/cat-vs-cad/">cat vs cad</a></li>
                </ul>
```

With just the cross-link sentence:

```html
                <p><a href="/th/minimal-pairs-practice/">ดูวิธีฝึกด้วย minimal pairs</a></p>
```

- [ ] **Step 3: Verify the list is gone and the cross-link remains**

Run: `sed -n '/id="minimal-pairs-guide"/,/<\/section>/p' th/english-ear-training/index.html | grep -c -- '-vs-'`
Expected: `0`

Run: `grep -c 'href="/th/minimal-pairs-practice/"' th/english-ear-training/index.html`
Expected: `1` (the cross-link sentence is preserved)

- [ ] **Step 4: Commit**

```bash
git add th/english-ear-training/index.html
git commit -m "Normalize Thai ear-training #minimal-pairs-guide to compact cross-link"
```

---

### Task 2: Add missing `id="related-guide"` to en/es/ar/pt minimal-pairs-practice

**Files:**
- Modify: `minimal-pairs-practice/index.html`
- Modify: `es/minimal-pairs-practice/index.html`
- Modify: `ar/minimal-pairs-practice/index.html`
- Modify: `pt/minimal-pairs-practice/index.html`

- [ ] **Step 1: Confirm the four sections currently lack the id**

Run:
```bash
for f in minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html; do
  echo -n "$f: "; grep -c '<section aria-labelledby="related-guide-title">' "$f"
done
```
Expected: each prints `1`.

- [ ] **Step 2: Add the id in all four files**

In each of the four files, replace the single occurrence of:

```html
              <section aria-labelledby="related-guide-title">
```

With:

```html
              <section id="related-guide" aria-labelledby="related-guide-title">
```

Change only this attribute. Do not touch the `<h2>`, `<p>`, or anchor inside.

- [ ] **Step 3: Verify the id was added and copy is unchanged**

Run:
```bash
for f in minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html; do
  echo -n "$f id: "; grep -c '<section id="related-guide" aria-labelledby="related-guide-title">' "$f"
  echo -n "$f idless: "; grep -c '<section aria-labelledby="related-guide-title">' "$f"
done
```
Expected: each `id:` line prints `1`, each `idless:` line prints `0`.

Run: `git diff --stat minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html`
Expected: each file shows `1 +1 -1` (one line changed — the section tag only).

- [ ] **Step 4: Commit**

```bash
git add minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html
git commit -m "Add missing id=related-guide to en/es/ar/pt minimal-pairs-practice sections"
```

---

### Task 3: Move Korean related-guide section to after #soundwise

**Files:**
- Modify: `ko/minimal-pairs-practice/index.html`

- [ ] **Step 1: Confirm related-guide is currently before #soundwise**

Run: `grep -nE 'id="(start-here|related-guide|soundwise|faq)"' ko/minimal-pairs-practice/index.html`
Expected order: `start-here`, then `related-guide`, then `soundwise`, then `faq` (related-guide is misplaced before soundwise).

- [ ] **Step 2: Remove the related-guide block from before #soundwise**

Replace this exact block:

```html
              </section>

              <section id="related-guide" aria-labelledby="related-guide-title">
                <h2 id="related-guide-title">관련 가이드</h2>
                <p>이 연습의 바탕에 있는 「먼저 듣기」 접근법에 대한 자세한 설명은 <a href="/ko/english-ear-training/">영어 발음 변별 훈련: 귀에 잡혀야 입으로 간다</a>를 참조하자.</p>
              </section>

              <section id="soundwise" class="seo-cta" aria-labelledby="soundwise-title">
```

With (related-guide removed, leaving start-here closing directly followed by soundwise):

```html
              </section>

              <section id="soundwise" class="seo-cta" aria-labelledby="soundwise-title">
```

- [ ] **Step 3: Re-insert the related-guide block after #soundwise, before #faq**

Replace this exact block:

```html
              </section>

              <section id="faq" class="seo-faq" aria-labelledby="faq-title">
```

With (related-guide inserted between the soundwise close and the faq open):

```html
              </section>

              <section id="related-guide" aria-labelledby="related-guide-title">
                <h2 id="related-guide-title">관련 가이드</h2>
                <p>이 연습의 바탕에 있는 「먼저 듣기」 접근법에 대한 자세한 설명은 <a href="/ko/english-ear-training/">영어 발음 변별 훈련: 귀에 잡혀야 입으로 간다</a>를 참조하자.</p>
              </section>

              <section id="faq" class="seo-faq" aria-labelledby="faq-title">
```

- [ ] **Step 4: Verify new order and that the Korean copy is byte-identical (only moved)**

Run: `grep -nE 'id="(start-here|related-guide|soundwise|faq)"' ko/minimal-pairs-practice/index.html`
Expected order: `start-here`, `soundwise`, `related-guide`, `faq`.

Run: `grep -c '관련 가이드' ko/minimal-pairs-practice/index.html`
Expected: `1` (still present exactly once — moved, not duplicated or altered).

- [ ] **Step 5: Commit**

```bash
git add ko/minimal-pairs-practice/index.html
git commit -m "Move Korean related-guide section to after #soundwise"
```

---

### Task 4: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Structural skeleton audit — both families identical per family**

Run:
```bash
echo "## english-ear-training"
for loc in . es ja zh yue ar hi-ur fa id ko pt ru th; do
  [ "$loc" = "." ] && f="english-ear-training/index.html" || f="$loc/english-ear-training/index.html"
  ids=$(grep -oE '<section id="[^"]+"' "$f" | sed 's/<section id="//;s/"//' | tr '\n' ',')
  gl=$(sed -n '/id="minimal-pairs-guide"/,/\/section>/p' "$f" | grep -c -- '-vs-')
  printf '%-6s guide-list=%s | %s\n' "$loc" "$gl" "$ids"
done
echo "## minimal-pairs-practice"
for loc in . es ja zh yue ar hi-ur fa id ko pt ru th; do
  [ "$loc" = "." ] && f="minimal-pairs-practice/index.html" || f="$loc/minimal-pairs-practice/index.html"
  ids=$(grep -oE '<section id="[^"]+"' "$f" | sed 's/<section id="//;s/"//' | tr '\n' ',')
  printf '%-6s | %s\n' "$loc" "$ids"
done
```
Expected:
- Every `english-ear-training` row: `guide-list=0` and ids
  `why-listening-first,what-ear-training-means,common-contrasts,how-to-practice,minimal-pairs-guide,soundwise,faq,`
- Every `minimal-pairs-practice` row (all 13 incl. en/es/ar/pt/ko): ids
  `what-are-minimal-pairs,why-they-help,how-to-practice,start-here,soundwise,related-guide,faq,`

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `✓ built in …`, no errors; `dist/th/english-ear-training/index.html` and the touched `dist/**/minimal-pairs-practice/index.html` emitted.

- [ ] **Step 3: Validators**

Run: `npm run validate:localized-homepages`
Expected: JSON output ending with `"status": "ok"`.

Run: `npm run validate:app-store-tracking`
Expected: exit 0, no error output.

- [ ] **Step 4: JSON-LD parse for every touched page**

Run:
```bash
for f in th/english-ear-training/index.html minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html ko/minimal-pairs-practice/index.html; do
  node -e '
    const fs=require("fs"); const h=fs.readFileSync(process.argv[1],"utf8");
    const re=/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g; let m,i=0,ok=true;
    while((m=re.exec(h))){i++; try{JSON.parse(m[1]);}catch(e){ok=false;console.log("  INVALID block "+i+": "+e.message);}}
    console.log(process.argv[1]+": "+i+" blocks, "+(ok?"all valid":"INVALID"));
  ' "$f"
done
```
Expected: each file reports `3 blocks, all valid`.

- [ ] **Step 5: Whitespace check + scoped diff**

Run: `git diff --check`
Expected: no output (no whitespace errors).

Run: `git diff --stat main`
Expected: exactly six code files plus the spec/plan docs — the six code files being
`th/english-ear-training/index.html`, `minimal-pairs-practice/index.html`,
`es/minimal-pairs-practice/index.html`, `ar/minimal-pairs-practice/index.html`,
`pt/minimal-pairs-practice/index.html`, `ko/minimal-pairs-practice/index.html`.

- [ ] **Step 6: Record existing en/es/ar/pt related-guide copy for the report**

Run:
```bash
for f in minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html; do
  echo "=== $f ==="
  sed -n '/id="related-guide"/,/<\/section>/p' "$f"
done
```
Capture this output verbatim into the final report so the user can decide on a separate copy-review pass.

---

## Self-Review

- **Spec coverage:** Task 1 = Thai list removal (spec A); Task 2 = en/es/ar/pt id (spec B); Task 3 = ko move (spec B); Task 4 = all verification items. Out-of-scope items are not touched.
- **No content edits:** Tasks 2 and 3 change only attributes/position; Task 3 re-inserts the Korean block byte-identical. Task 1 removes only the `<ul>`.
- **Type/name consistency:** section ids used (`related-guide`, `minimal-pairs-guide`, `soundwise`, `faq`) match across tasks and the audit expectations.
- **Six-file scope** asserted in Task 4 Step 5.
