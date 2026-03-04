# Feature Status vs Enhancements

This document maps the requirements in `docs/enhancements.md` to what is implemented today.

Legend:
- ✅ Implemented
- 🟡 Partial
- ❌ Missing

## Section A — Scripture Engine
- A.1 Passage Retrieval
  - FR-A1.1 Retrieve passages by reference ✅ (scripture passage endpoint)
  - FR-A1.2 Multiple translations ✅ (api.bible + local fallback; limited translations)
  - FR-A1.3 Verse-level rendering ✅ (frontend lists verses)
  - FR-A1.4 Parallel translation view ✅
  - FR-A1.5 Pericope/context expansion ✅
- A.2 Structural Analysis (AI-grounded)
  - FR-A2.1 Repeated phrases / imperatives / etc. ✅ (LLM structural analysis endpoint)
  - FR-A2.2 Chiastic structures ✅ (LLM structural analysis endpoint)
  - FR-A2.3 Verse-referenced structure 🟡 (outline in LLM output; not strict verse mapping)
- A.3 Book-Level Context
  - FR-A3.1 Book outline ✅ (sample dataset)
  - FR-A3.2 Author/audience/purpose ✅ (sample dataset)
  - FR-A3.3 Date of writing ✅ (sample dataset)

## Section B — Greek & Hebrew Word Study
- B.1 Word Lookup
  - Lemma/Transliteration/Strong’s/Part of speech/Definition ✅ (Strong’s dataset)
  - Total occurrences in Scripture ✅ (word occurrences dataset)
  - Other verses using lemma ✅ (word occurrences dataset)
- B.2 Advanced Word Study
  - Semantic range clusters 🟡 (LLM insights)
  - Distribution by book ✅ (occurrence distribution)
  - Contextual nuance differences 🟡 (LLM insights)
  - Root word exploration 🟡 (LLM insights)
- B.3 Grammar Insights
  - Tense/voice/mood, case/number/gender 🟡 (LLM insights)
  - Simplified explanations 🟡 (LLM insights)

## Section C — Historical & Cultural Context
- C.1 Historical Context Panel
  - Approximate date / political authority / geopolitical forces / religious context ✅ (sample dataset)
- C.2 Cultural Context Explanations
  - Cultural context explanations ✅ (sample dataset)
- C.3 Timeline View
  - Timeline view + major events ✅ (sample dataset)

## Section D — Geographic Context
- D.1 Map Integration
  - Map references + terrain relevance ✅ (sample dataset)

## Section E — Cross Reference Intelligence
- E.1 Cross reference retrieval ✅ (OpenBible dataset via script)
- E.2 Categorization + filtering ✅ (category dataset + UI filter)

## Section F — Structured Study Report
- Study report generation ✅ (LLM + grounding)
- Sections covered ✅ (literary, historical, structural, key words, etc.)
- Grounding rules enforced in prompt 🟡 (prompt rules exist; enforcement is LLM-dependent)

## Section G — Interpretive Challenges Mode
- G.1 Interpretive Challenges
  - Identifies debated phrases / multiple views ✅ (dedicated interpretive challenges endpoint + UI)

## Section H — Theological Lens Mode
- H.1 Lens Options
  - Lens selection (devotional/pastoral/academic/etc.) ✅ (workspace field + prompts)

## Section I — Canonical & Typological Connections
- Thematic threading / typology requests 🟡 (only via study report free-form content)

## Section J — Application Intelligence
- Category coverage (individual/family/church/etc.) 🟡 (only audience-type categories)
- Actionability requirements (reflection, next steps, heart-level) 🟡 (prompt instructs but not structured)

## Section K — Sermon Outline Builder
- Outline generation from study report ✅
- Story arc options ✅ (story arcs supported in prompts)

## Section L — Search & Knowledge Management
- L.1 Search
  - Search by verse/word/topic/tag/prior sermon content 🟡 (workspace/notes/outlines/manuscripts/knowledge)
- L.2 Saved Studies
  - Save study reports, word studies, thematic explorations 🟡 (study reports stored; word studies saved separately)
- L.3 Version sermon outlines ✅ (outlines preserved on regenerate)

## Section M — Trust & Verification
- M.1 Citation Integrity
  - Verse validation ✅ (citation validation endpoint)
  - Translation match verification ✅ (validation includes translation check)
  - Flag unsupported claims ✅ (unsupported-claim heuristic)
- No fabrication policy 🟡 (prompt rules only)

## Section N — Non-Functional
- Performance targets 🟡 (not measured)
- Autosave ✅ (client autosave for edits)
- Local-first option 🟡 (local datasets supported, but not end-to-end offline)
- No raw prompt logging by default ✅ (LOG_LLM_REQUESTS=false by default)
- Dataset attribution 🟡 (not fully surfaced)

## MVP Feature Set (Minimum to Ship)
- Real Bible retrieval ✅
- Greek word lookup with lemma + Strong’s ✅
- Historical context summary ❌
- Structured Study Report ✅
- Cross references (real dataset) ✅
- Interpretive challenges section ✅ (within study report)
- Application categorization 🟡 (audience-type only)
- Sermon outline generation ✅
- Citation validation ✅
- Saved workspace system ✅

---

## Highest Impact Gaps to Address Next
1. Historical/cultural context datasets + UI.
2. Parallel translation + pericope context display.
3. Word study occurrences + lemma verse lists.
4. Cross-reference categorization and filtering.
5. Theological lens selection + interpretive challenges mode.
6. Search + saved studies + version history.
