# GA4 Direct Measurement Plan — middle-funnel events
2026-09-22 · measurement tooling only · no production surface

Goal: read `exercise_start` and `exercise_complete` from GA4 property **536565930**, segmented
finely enough to measure `/man-vs-men/`, **without** making them key events and **without** any GA4
configuration change.

---

## 1. Why not reuse OpenSEO's existing authorization

You asked to prefer the existing grant if technically possible. It is technically possible and it is
the wrong choice:

- OpenSEO stores the OAuth tokens **encrypted at rest** (Better Auth `account` table, encrypted with
  `BETTER_AUTH_SECRET`) inside its D1 SQLite volume. Using them means decrypting another
  application's credential store.
- **OpenSEO owns that token's lifecycle.** It refreshes and may rotate the stored value. A second
  consumer of the same grant risks invalidating the GSC/GA4 integration we just established — the
  failure would appear as a silent data outage, not an error.
- The table schema and encryption are internal implementation details. An OpenSEO upgrade could
  break extraction with no warning.
- It widens the surface on which a refresh token exists in plaintext.

An automated read-only attempt at that store was also correctly refused by this environment's
credential-access guard. Not worked around.

**Recommendation: a separate token for a separate consumer — but no new credentials and no new
scopes.**

---

## 2. Proposed path

Reuse the **existing OAuth client** (same `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` already in
`.seo-god/secrets.env`) and the **existing scope** `analytics.readonly`. Obtain our own token via a
one-time local authorization, then call the GA4 Data API directly over HTTPS.

| Constraint | Status |
| --- | --- |
| No new credentials | **Met** — same client ID/secret |
| No new scopes | **Met** — `analytics.readonly`, already granted |
| No GA4 configuration change | **Met** |
| No production-site change | **Met** |
| Events stay non-key | **Met** — Data API reads any event regardless of key status |
| Existing property 536565930 | **Met** |
| No new packages | **Met** — stdlib + `requests` only |

### The one change required — your decision

The OAuth client needs **one additional redirect URI** so a local script can complete the flow:

```
http://127.0.0.1:8765/
```

This is a **Google Cloud OAuth client** change, not a GA4 change, and not a production change. It is
additive and reversible, and does not affect the four OpenSEO URIs or the Apps Script client.

**Alternative if you would rather not touch the client:** install the `gcloud` CLI and use
`gcloud auth application-default login --scopes=https://www.googleapis.com/auth/analytics.readonly`.
That needs no redirect URI, but adds a large dependency and a second credential store. I recommend
the redirect URI.

---

## 3. What can and cannot be segmented — important

The GA4 Data API reads **standard** dimensions freely. Custom event *parameters* are only queryable
once registered as **custom dimensions**, which is a GA4 configuration change and therefore out of
scope.

| Dimension | Available? | Use |
| --- | --- | --- |
| `eventName` | **Yes** — standard | Select `exercise_start` / `exercise_complete` |
| `pagePath` | **Yes** — standard | Where the event fired. Primary segmentation for `/man-vs-men/` |
| `landingPagePlusQueryString` | **Yes** — standard | Session-level landing attribution |
| `sessionDefaultChannelGroup` | **Yes** — standard | Isolate Organic Search |
| `exercise_id`, `pair_name`, `sound_contrast`, `page_slug`, `cta_position`, `exercise_completed`, `content_variant` | **No** — custom parameters | Would require registering custom dimensions in GA4 (config change, excluded) |

**Consequence to accept explicitly:** the experiment can measure exercise starts and completions
**per page**, which is sufficient for `/man-vs-men/`. It cannot segment by contrast id, CTA position
or exercise-completion flag without a GA4 config change. For a single-page experiment `pagePath` is
sufficient; if per-contrast analysis is later wanted, that is a separate decision.

Note also `landingPagePlusQueryString` is session-scoped while events are event-scoped: it yields
"events in sessions that landed on X", whereas `pagePath` yields "events fired on X". Both will be
collected; `pagePath` is primary.

---

## 4. Consistent collection during the run

A single script, `.seo-god/ga4-report.py` (gitignored), run on a fixed cadence, writing dated JSON
to `seo/snapshots/ga4/<YYYY-MM-DD>.json`.

**Fixed query contract — identical every run, so figures stay comparable:**

```
property : properties/536565930
dateRange: explicit startDate/endDate (never "last N days" — a relative window
           silently changes what is being compared)
metrics  : eventCount, totalUsers, sessions
dimensions: date, pagePath, eventName
filter   : eventName IN (exercise_start, exercise_complete, app_store_click)
         : AND sessionDefaultChannelGroup = "Organic Search"
```

Rules, to keep the series honest:

1. **Explicit absolute date ranges only.**
2. **Exclude the last 48h** of any window — GA4 data is not final; late-arriving hits would make
   yesterday's numbers drift after the fact.
3. **Record the query alongside the result** in each snapshot, so a later change in method is
   visible rather than silent.
4. **A failed or empty API call is recorded as `null`, never 0** — same rule the MEASURE phase uses.
5. **Token refresh failures are surfaced**, not retried silently.
6. Refresh token stored in `.seo-god/secrets.env` (`chmod 600`, gitignored). Never printed, never
   committed, never passed on a command line.

---

## 5. Verification before proceeding

Once the redirect URI is added and authorization completes, retrieval will be proved with **real
historical data** before any experiment step:

1. `exercise_start` / `exercise_complete` totals for 2026-08-24→09-20 — the same window as the
   MEASURE baseline.
2. The same, broken out by `pagePath`, confirming `/man-vs-men/` is individually addressable.
3. Cross-check: `app_store_click` via this path must reconcile with OpenSEO's reported **26 events /
   22 users**. If the two disagree, the discrepancy is investigated and reported before proceeding —
   a number that cannot be reconciled is not a baseline.

If step 3 fails to reconcile, the experiment does not start.
