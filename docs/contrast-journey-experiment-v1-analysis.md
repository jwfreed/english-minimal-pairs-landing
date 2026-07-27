# Contrast Journey Experiment v1 Analysis

## Experiment

| Field | Value |
| --- | --- |
| Page | `/ship-vs-sheep/` |
| Variant | `contrast_journey_v1` |
| Status | collecting data |

**Purpose:** Validate whether contrast-first framing improves learner
progression and downstream app intent.

This document defines how to evaluate the experiment. It does not report
results or imply that the hypothesis has been confirmed.

## Hypothesis

> Framing a minimal-pair SEO page around the underlying sound contrast will
> improve learner understanding and increase meaningful engagement compared
> with treating the pair as an isolated exercise.

This is a hypothesis, not a conclusion.

## Primary Metrics

The experiment follows this funnel:

```text
Traffic
  ↓
Exercise start
  ↓
Exercise completion
  ↓
App Store click
```

Use page sessions for `/ship-vs-sheep/` as the traffic denominator. Apply one
consistent GA4 counting method and date boundary to every compared period.

### Exercise start rate

**Question:** Are visitors more likely to begin practice?

```text
exercise_start / page sessions
```

### Exercise completion rate

**Question:** Do learners who start continue through the exercise?

```text
exercise_complete / exercise_start
```

### App intent rate

**Question:** Does the experience increase downstream product interest?

```text
app_store_click / page sessions
```

An App Store click is a web-observable intent signal. It does not prove an
install, app use, or purchase.

## Guardrail Metrics

Review these alongside the primary funnel:

- organic traffic;
- search impressions;
- search ranking position;
- page engagement;
- bounce or exit behavior, if available;
- technical SEO health.

Improved conversion is not sufficient if the page harms acquisition. Use
Google Search Console for search visibility and query context, GA4 for on-page
behavior, and the repository's production SEO validators for technical health.

## Data Source

### GA4

| Field | Value |
| --- | --- |
| Event-scoped dimension | Content Variant |
| Parameter | `content_variant` |
| Experiment value | `contrast_journey_v1` |

Relevant events:

- `exercise_start`;
- `exercise_complete`;
- `app_store_click`.

The custom dimension applies only from its creation date forward. It must not
be interpreted as historical data. Validate that incoming production events
contain the expected value before treating a reporting window as usable.

For the pre-experiment period, identify `/ship-vs-sheep/` by page path and an
explicit date window; historical events will not gain
`content_variant: contrast_journey_v1` retroactively.

## Comparison Framework

Record the exact comparison windows, included traffic channels, and counting
method with every analysis. Prefer comparable durations and weekday coverage,
and call out material campaigns, ranking changes, or outages.

### Primary analysis

Compare `/ship-vs-sheep/` before and after the experiment.

**Strength:** Controls for the page's search intent and topic.

**Risks:** Seasonality, traffic-source changes, search-ranking movement, and
other time-based changes can affect the result. The pre-experiment period also
lacks the content-variant dimension and must be selected by page path and date.

### Secondary analysis

Compare the trend with similar minimal-pair pages that did not receive the
experiment.

**Strength:** Provides broader context for site-wide or market-wide movement.

**Risks:** Pages may differ in:

- search volume;
- ranking position;
- difficulty;
- backlinks;
- user intent.

Treat this comparison as context, not as a randomized control group. Do not
pool unrelated pages into a synthetic baseline without recording which pages
were included and why.

## Decision Framework

Expand Contrast Journey only when the evidence, considered together, shows:

- no meaningful SEO degradation;
- exercise start rate improves or remains stable;
- exercise completion rate improves or remains stable;
- app intent rate improves or remains stable.

Investigate before expanding when:

- traffic or search visibility declines;
- visitors start the exercise less frequently;
- exercise completion drops;
- CTA engagement declines;
- technical SEO health regresses.

Do not expand based on one metric alone. Confirm that the observation window
contains enough sessions and funnel events to distinguish a durable pattern
from small-sample noise, and document uncertainty rather than forcing a
positive or negative conclusion.

## Future Expansion Rules

If Experiment v1 shows positive evidence:

- select the next candidates deliberately;
- expand in small, reviewable batches;
- preserve explicit Contrast Journey relationships and capability-controlled
  CTA claims;
- measure each expansion before widening it further.

Do not migrate all SEO pages immediately.

## Current Non-Goals

This experiment does not test:

- localization;
- new app capabilities;
- new contrast groups;
- new analytics events;
- full SEO migration;
- app UX redesign.
