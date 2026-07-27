# Contrast Journey Architecture

## Purpose

Contrast Journey is a website-side, reviewed educational mapping:

```text
SEO entry pair
        ↓
learning contrast
        ↓
reviewed example sequence
```

The learning contrast is the objective. Word pairs are concrete examples used
to enter or practice that objective.

## Current Scope

**Architecture foundation complete. The `/ship-vs-sheep/` experiment is the
only runtime integration; broader learner-facing rollout remains separate
implementation work.**

Completing the foundation and first experiment does not mean the broader
Contrast Journey initiative or its learner-facing experience is complete.

Contrast Journey does not replace or extend:

- the app content inventory;
- app capability or CTA resolution;
- the pronunciation pair catalog;
- SEO pages, routes, metadata, or conversion surfaces.

Its existence is not evidence that Soundwise supports a pair or contrast in the
app. App claims must continue to pass through the existing capability resolver.

## Ownership Boundaries

| System | Owns | Does not own |
| --- | --- | --- |
| `src/contrast-journey-catalog.js` | Learning relationships, educational grouping, the flagship SEO entry pair, and reviewed example sequencing. | IPA, app support, routes, page metadata, or CTA wording. |
| `src/contrast-catalog.js` | Pair records, words, IPA, display contrast labels, and phonetic metadata used by website exercises. | Educational sequence, page routing, or app capability. |
| `src/app-capability-resolver.js` | Whether the app can honestly claim exact-pair or contrast-level support for a learner's L1. | Website teaching order or SEO route definitions. |
| SEO HTML and `vite.config.js` | Pages, routes, metadata, and conversion surfaces. | App inventory or pronunciation-domain records. |

The journey catalog references pair IDs from `CONTRAST_CATALOG`; it does not
copy their words or IPA. `flagshipPairId` identifies the SEO acquisition entry.
`practicePairIds` contains the complete reviewed sequence, including the
flagship pair. Array order is educational order, not app inventory order,
ranking, or capability evidence.

An exact journey ID or label may be used to look up a declared record. Pair
membership still comes only from `practicePairIds`; labels are never used to
infer which pairs belong together.

## Object Model

The current journey uses this relationship model:

```js
{
  id: 'short-i-vs-long-e',
  flagshipPairId: 'ship-vs-sheep',
  practicePairIds: [
    'ship-vs-sheep',
    'bit-vs-beat',
    'fill-vs-feel',
    'live-vs-leave',
    'sit-vs-seat',
  ],
}
```

`flagshipPairId` identifies the SEO entry point independently of array
position. `practicePairIds` represents the complete learning sequence,
including the flagship pair. Its ordering is reviewed educational data; it is
not automatically generated and must not be used to infer the flagship. The
order is an intentional product requirement because the renderer presents it
as the learner's reviewed example sequence; tests therefore protect both
membership and sequence.

## Current Journey

### `/ɪ/ vs /iː/`

- Journey ID: `short-i-vs-long-e`
- Primary SEO entry: `ship-vs-sheep` (ship/sheep)
- Reviewed practice sequence:
  1. ship/sheep
  2. bit/beat
  3. fill/feel
  4. live/leave
  5. sit/seat

No other Contrast Journeys are currently defined.

## Extension Rules

Future contributors may:

- add a new explicit contrast journey record;
- identify one reviewed `flagshipPairId`;
- add a reviewed `practicePairIds` sequence;
- add or update tests for the public lookup behavior and catalog integrity.

Future contributors must:

- reference existing `CONTRAST_CATALOG` pair IDs;
- include the flagship pair in the reviewed practice sequence;
- keep each pair in at most one learning contrast;
- keep the journey's display label consistent with its referenced pair records;
- treat sequence changes as educational decisions requiring review.

Do not:

- infer contrast membership from spelling, IPA similarity, display labels, or
  app group IDs;
- duplicate words or IPA in the journey catalog;
- add or modify app inventory from this website repository;
- use Contrast Journey as an app capability check;
- add routes, metadata, CTA copy, or analytics fields to journey records;
- change SEO pages or conversion behavior as a side effect of adding a journey.

If a desired example does not exist in `CONTRAST_CATALOG`, handle that as a
separate pronunciation-catalog change with its own evidence and validation.
If a page or CTA should consume a journey, make that integration a separately
scoped change and continue to use the existing capability resolver for claims.

## Contrast Journey Experiment v1

**Purpose:** Validate whether contrast-first framing improves engagement.

**Scope:** Only `/ship-vs-sheep/`.

**Hypothesis:** Framing a minimal-pair SEO page around the underlying contrast
will improve learner understanding and downstream engagement.

**Success metrics:** Existing `exercise_start`, `exercise_complete`, and
`app_store_click` events, segmented by the registered content variant. The
identifier and page assignment are governed by
`docs/analytics-and-attribution.md` and
`src/analytics-content-variants.js`.

**Non-goals:** No broader SEO migration, localization rollout, or app changes.

Review the experiment results before expanding Contrast Journey to additional
pages.

Related links are rendered only from `practicePairIds` after resolving their
records through `CONTRAST_CATALOG`. The renderer receives Vite's published SEO
route registry and fails the build if any related target is unpublished; page
HTML must not maintain a second related-pair list.
