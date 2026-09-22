# SERP Diagnosis — 2026-09-22

Question: why do pages ranking at position 6–9 earn ~0.2% CTR, while
`/minimal-pairs-practice/` earns 4.04% at position 14.8?

**Constraint on method:** Google SERPs were **not** fetched. SERP scraping of Google is prohibited
in this workflow, and the licensed alternative (DataForSEO) is not configured. Every finding below
comes from first-party Search Console data or from the live pages themselves. Where that evidence
cannot settle a hypothesis, this document says so rather than inferring.

---

## Hypothesis scoreboard

| Hypothesis | Verdict | Basis |
| --- | --- | --- |
| Weak/undifferentiated titles and snippets | **NOT SUPPORTED — lower priority, not settled** | On-page inspection only; rendered SERP untested |
| Rich-result / SERP-feature loss | **REJECTED as a cause** | GSC `searchAppearance` |
| Search intent mismatch (definitional) | **STRONGLY SUPPORTED** | Query-intent CTR analysis |
| AI Overview / zero-click capture | **STRONGLY SUPPORTED in the observed SERP context** | Manual incognito observation, 2026-09-22 (§4a) |

---

## 1. Titles and snippets — NOT SUPPORTED (lower priority, not settled)

Fetched live from production at `9324c48`:

| Page | Title | Len | Desc len | JSON-LD |
| --- | --- | ---: | ---: | ---: |
| `/man-vs-men/` | Man vs Men Pronunciation: Hear the Difference \| English Listening Practice | 74 | 126 | 3 |
| `/bad-vs-bed/` | Bad vs Bed: Learn to Hear the Difference \| Soundwise | 52 | 101 | 3 |
| `/live-vs-leave/` | Live vs Leave Pronunciation: /ɪ/ vs /iː/ Practice \| Soundwise | 61 | 141 | 3 |
| `/minimal-pairs-practice/` | Minimal Pairs Practice for English Listening \| Soundwise | 56 | 148 | 3 |

All four carry the query terms, a clear value promise, phonemic notation where relevant, and three
JSON-LD blocks. **The pair-page titles are not weaker than the hub page's** — if anything they are
more specific. `/man-vs-men/` promises exactly what a "man vs men" searcher would want and converts
1,517 impressions into 0 clicks.

On this evidence a presentation problem does not explain a 100x CTR gap, since the better-presented
pages are the ones failing.

**But this is not settled, and should not be treated as closed.** What was inspected is the HTML the
site emits — not what Google actually renders. Three things remain untested:

1. **Google frequently rewrites titles and descriptions in results.** The `<title>` above is an
   input to the SERP line, not the SERP line itself. What searchers saw is unknown.
2. **Competitive context is untested.** A title can be well-formed in isolation and still be the
   least compelling of ten results. Relative differentiation was never measured.
3. **Snippet selection is untested.** Google may draw the description from body text rather than the
   meta description.

Verdict: **not supported by available evidence, and lower priority than intent** — but it is
untested rather than disproved. The manual SERP check in section 4 is what would settle it, and
noting how Soundwise's result actually reads against its neighbours costs nothing while you are
already looking.

---

## 2. SERP features — REJECTED as a cause

GSC `searchAppearance`, whole property, 28 days:

```
PRODUCT_SNIPPETS | 0 clicks | 37 impressions | 0.0% CTR | position 25.3
```

**One row. 37 of 26,802 impressions (0.14%).** The site holds essentially no rich-result
appearances; results are plain blue links.

This rejects "lost a rich result" as the cause — there was never one to lose. It does **not** say
anything about what *competitors* or Google's own features occupy the SERP.

---

## 3. Search intent — STRONGLY SUPPORTED

All 676 queries classified by lexical pattern, then CTR computed per class:

| Intent class | Queries | Impressions | Clicks | CTR | Avg pos |
| --- | ---: | ---: | ---: | ---: | ---: |
| comparison/definitional (`vs`, `or`, `and`, `difference`) | 283 | 7,767 | 5 | **0.06%** | **8.4** |
| other/bare | 222 | 2,282 | 4 | 0.18% | 9.1 |
| pronunciation (`pronounce`, `sound`, `IPA`) | 158 | 994 | 9 | 0.91% | 11.3 |
| practice/task (`practice`, `exercise`, `listen`, `quiz`) | 13 | 64 | 4 | **6.25%** | **14.9** |

**CTR and position are inversely correlated across intent classes.** The best-ranked class converts
worst by a factor of ~100. Under any rank-driven model this is backwards; under an intent model it
is exactly as expected.

The mechanism is coherent: a searcher typing `bad or bed` wants one fact — which word carries which
vowel. That need can be satisfied without a visit. A searcher typing `minimal pairs practice` wants
a tool, and a tool cannot be delivered in a SERP line. They must click.

Page-level evidence agrees independently and on a larger sample: `/minimal-pairs-practice/` earns
**18 clicks from 446 impressions (4.04%) at position 14.8**, more clicks than any page on the site,
while `/man-vs-men/` earns 6 from 2,898 (0.21%) at 9.9.

**Sample-size caveat, stated plainly:** the practice/task class is only 13 queries, 64 impressions,
4 clicks. On its own that is far too thin to carry a conclusion. It is reported as supported because
the page-level data points the same way on a much larger base, not because 4 clicks are convincing.

---

## 4. AI Overviews / zero-click — STRONGLY SUPPORTED (observed context)

**This was unresolvable from first-party data alone, and has now been resolved by direct
observation. See §4a. The subsection below is retained because it explains why GSC could never
answer it.**

Google does not break out AI Overview appearances in Search Console; AI Overview impressions are
folded into ordinary web results and no `searchAppearance` value identifies them. Determining
whether an AI Overview sits above these results requires observing the SERP, which this workflow
does not do.

What can be said: the pattern is *consistent* with zero-click capture on definitional queries, and
also fully consistent with plain intent mismatch. Both predict the same GSC signature. They are not
distinguishable from first-party data.

Two indirect observations, neither conclusive:

- **Device split.** Mobile 18,086 impressions at 0.4% CTR; desktop 8,379 at 0.8%. Mobile SERPs give
  more vertical space to features, so results sit lower. Consistent with feature capture, but also
  with ordinary mobile behaviour.
- **India.** 3,227 impressions at 0.1% CTR, against USA 5,632 at 0.4%. Unexplained.

### How to resolve it — 10 minutes, and only you can do it

Search these in an incognito window and record what sits above the first organic result:

| Query | Page | What it tests |
| --- | --- | --- |
| `man vs men` | `/man-vs-men/` | 1,517 impressions, 0 clicks — worst case on the site |
| `bad or bed` | `/bad-vs-bed/` | 162 impressions, 0 clicks, position 8.5 |
| `live vs leave` | `/live-vs-leave/` | 249 impressions, 0 clicks, position 7.6 |
| `minimal pairs practice` | `/minimal-pairs-practice/` | The positive control — 7.1% CTR |

For each, note: is there an AI Overview? A featured snippet, and does it already state which word
has which vowel? How far down is the first organic result? Does the SERP answer the question?

**The discriminating comparison is the fourth against the first three.** If `minimal pairs practice`
shows a clean organic SERP while `man vs men` shows an answer box, that is zero-click capture. If
all four look similar, intent mismatch is the whole story.

---

## 4a. Manual SERP observation — 2026-09-22 (FACT, scope-limited)

Direct incognito observation of the four diagnostic queries. **This is the evidence that resolved
the hypothesis; everything in §4 above explains why first-party data could not.**

| Query | Intent class | AI Overview present? | What sat above organic results |
| --- | --- | --- | --- |
| `man vs men` | definitional | **Yes, large** | Directly answers the difference and usage |
| `bad or bed` | definitional | **Yes, large** | Explains the pronunciation distinction; surfaces pronunciation/video material. **Soundwise is cited in the AI Overview.** |
| `live vs leave` | definitional | **Yes, large** | Explains meaning/pronunciation; followed by prominent short-form pronunciation videos |
| `minimal pairs practice` | practice/task | **No** | Ordinary organic destinations: lists, exercises, interactive practice, videos |

**The control behaved exactly as the intent hypothesis predicted.** Three definitional queries
carry a large AI Overview; the one practice/task query carries none. The split falls precisely along
the intent boundary that the GSC CTR analysis (§3) identified independently.

### Scope limits — these matter and must not be dropped

1. **One observation, one day** (2026-09-22). No repetition, no variance measurement.
2. **Thailand-localized, Thai-language Google.** Not generalizable to other countries or devices.
3. **Not where the impressions are.** The top impression sources are USA (5,632) and India (3,227);
   Thailand is not in the top tier. The observed SERPs are therefore *not* the SERPs that produced
   most of the recorded impressions.
4. **AI Overview presence varies** by country, language, device, account and over time.

The mechanism is strongly supported **for the observed context**, and is consistent with the
device split (mobile 0.4% vs desktop 0.8% CTR) and with the global CTR-by-intent pattern. It is not
proven for USA or India traffic, which would need the same check run there.

### The most consequential single observation

**Soundwise is cited inside the `bad or bed` AI Overview.**

This reframes the problem. The content is good enough that Google's own summarizer selects it — the
failure is not quality, discoverability, or ranking. The citation is being *shown* and not
converting to a visit, because the AI Overview already delivered the answer the searcher wanted.

Being cited more often would not, on this evidence, produce more clicks on definitional queries. It
would produce more *answered* searchers.

---

## 4b. The two explanations are one mechanism, not rivals

Intent mismatch and AI Overview capture were treated as competing hypotheses. The evidence shows
they are the same phenomenon observed from two sides:

- **Definitional queries are answerable in-SERP.** "Which vowel is in *bad* versus *bed*" is one
  fact. Google's AI Overview supplies it. The searcher's need ends there. Intent mismatch is the
  cause; AI Overview capture is the mechanism that enforces it.
- **Practice/task queries are not answerable in-SERP.** A listening exercise cannot be summarized
  into a paragraph. No AI Overview appeared on the control, and the searcher must reach a
  destination. Intent requires a visit; no mechanism intercepts it.

The causal chain, consistent with every measurement taken:

```
definitional intent → answerable in one paragraph → AI Overview answers it → 0.06% CTR at position 8.4
practice/task intent → requires a tool → no AI Overview → 6.25% CTR at position 14.9
```

This is why position is uncorrelated with CTR across the site: rank determines *placement*, and
placement is irrelevant when the answer is delivered above the results.

---

## 5. What this means

**Established:** the constraint is not rank, and not lost rich results. Snippet quality is not
supported as the cause, though untested against the rendered SERP. Definitional queries — 7,767
impressions, 29% of site impressions — are intercepted by AI Overviews in the observed context and
convert at 0.06%. Soundwise is cited in at least one of those AI Overviews, so the content is
selected and still not visited. The
definitional query set — 7,767 impressions, 29% of all site impressions — converts at 0.06% and
will likely continue to, whatever its position.

**Unestablished:** whether the same interception holds in the USA and India, which supply the bulk
of impressions and were not observed. That is the remaining gap, and it changes the size of the
affected pool, not the mechanism.

**Implication either way:** ranking improvements on definitional pair queries are low-expected-value.
The demand that converts is practice/task intent, where the site currently holds 13 queries and 64
impressions — tiny exposure, best conversion. That asymmetry, not the pair-page impression volume,
is where the evidence points.
