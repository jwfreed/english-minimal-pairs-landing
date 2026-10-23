# Brag Plan: Soundwise English

## Planning rubric
1. **App:** Soundwise English helps English learners hear minimal pairs, choose the word they heard, and learn from immediate feedback.
2. **Strongest claim:** “Train your ear.” Small sound differences are the whole product; no microphone is needed.
3. **Visual hook:** Oversized **ship / sheep**, with the differing vowels in Soundwise orange.
4. **Actual UI:** Recreate the Practice card's contrast title, Play Word control, answer tiles with IPA, and correct-answer panel from source. This is an illustrative demo, not a recording.
5. **Shortest satisfying length:** 20 seconds.
6. **Tone:** Polished; precise, tactile, warm, and focused on listening.
7. **Audio:** Warm vol-12 music bed with three sparse, motion-matched effects. No narration.
8. **Caption:** I built Soundwise English to help learners hear the difference between words like ship and sheep. Listen, choose, and get immediate feedback—no microphone needed.
9. **Flow:** Enter Practice → play a word and choose sheep → see the sound-specific correct feedback and compare the two words.

## The angle
One sound. Two meanings. Let the audience see the tiny difference, then demonstrate how the product trains it. The working practice interaction occupies most of the film.

## Hook
“ship / sheep” fills the frame. The vowels land in orange. “Can you hear the difference?” holds beneath.

## Key moments
- The real Play Word control and the question “Which word did you hear?”
- Source-grounded sheep /ʃiːp/ and ship /ʃɪp/ answer tiles.
- A simulated choice resolves to “Correct — you heard /iː/ in sheep.” and the comparison panel.

## Outro
Soundwise English. “Train your ear.” “No microphone needed.”

## Tone and format
- Preset: polished.
- Creative direction: a precise listening exercise becomes a warm product film.
- Landscape, 1920×1080, 30 fps, 20 seconds.
- Voice disabled; music and SFX enabled.

## Visual identity
- Ground: #ECEEF1; card: #FFFFFF.
- Ink: #1F2329; secondary: #565D67.
- Orange text: #9C420B; primary control: #A8470C; non-text accent: #C4580F.
- Answer tint: #FBEDE2; correct: #1B7F45.
- Display and body: Public Sans; copy existing bundled font files.
- Large answer words, rounded source-style cards, restrained line work.
- Use the existing app icon; no personal data, real learner records, credentials, internal URLs, or customer data. The demo has no learner statistics.

## Audio direction
- Music: happy-beats-business-moves-vol-12-by-ende-dot-app.mp3, warm steady bed, gain 0.32, 0.4s in / 1.2s out.
- Music cue guidance: bundled vol-12 preset read; strong accents at 8.74s and 17.47s. Useful secondary beats 3.27s, 6.00s, 10.93s, 13.11s.
- Keep two major cue locks. Text reading time wins over beats; the full answer pair remains visible after its stagger.
- Audio-reactive treatment: a very slight music-energy response on the source-style Play Word control shadow, using the installed Hyperframes extraction workflow if available. Never move readable type with the music.
- SFX: sparse; warm reveal, selection click, quiet final logo accent. Use the bundled analysis to choose low high-frequency-risk effects.
- No spoken demonstration or narration; the film illustrates the visual interaction and stays readable muted.

## Storyboard

### Scene 1 — One sound — 3s (0–3)
Giant ship / sheep with the contrasting vowel letters colored orange. “Can you hear the difference?” holds for over two seconds after its quick reveal.
Sequential/interaction: the two words arrive a fraction apart, then hold together.
Audio intent: clean opening pulse; music begins gently.
Transition: direct cut into the product, preserving the word-pair motif.

### Scene 2 — Listen and choose — 7s (3–10)
Headline at left: “Listen. Choose.” Source-style Practice card at right with “Train /iː/ vs /ɪ/”, “Listen for the sound difference.”, Play Word, “Which word did you hear?”, sheep /ʃiːp/ and ship /ʃɪp/.
Sequential/interaction: a tap indicator presses Play Word, a brief “Listening…” state appears, the two answers hold, then a tap chooses sheep at 8.74s. Keep the viewer's eye on the control and the chosen tile. This is a simulated source-grounded interaction, with no fabricated app capability.
Audio intent: one quiet reveal accent and a selection click. Music stays supportive.
Transition: match cut on the selected answer into feedback.

### Scene 3 — Hear the difference — 6s (10–16)
Headline: “Hear the difference.” The same Practice card displays the exact feedback format: “Correct — you heard /iː/ in sheep.”, “Compare the two words”, sheep /ʃiːp/ and ship /ʃɪp/, with source-style replay controls. The phoneme distinction is enlarged at left.
Sequential/interaction: feedback lands as a group, then compare rows arrive together and hold for more than three seconds.
Audio intent: let the music carry the learning payoff; avoid another loud effect.
Transition: crisp cut to the brand.

### Scene 4 — Soundwise — 4s (16–20)
The existing app icon and “Soundwise English” resolve into a large wordmark. “Train your ear.” lands; “No microphone needed.” follows at 17.47s and holds until the end.
Sequential/interaction: one short brand reveal and a second text beat; no floating loops.
Audio intent: soft final accent; music fades over the last 1.2 seconds.

Durations: 3 + 7 + 6 + 4 = **20 seconds**.

## Source grounding
README.md; app.json; src/constants/Colors.ts; src/constants/typography.ts; src/constants/styles.ts; src/constants/alternateLanguages.ts (English copy); src/constants/minimalPairs/japanese.ts (sheep/ship); src/components/AnswerButtons.tsx; src/components/practice/ListenControls.tsx; utils/practiceFeedback.ts.
