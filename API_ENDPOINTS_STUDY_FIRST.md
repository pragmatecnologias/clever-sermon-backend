# 📚 Study-First API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 🎯 Citation & Validation

### Validate Single Citation
```http
POST /scripture/validate-citation
Content-Type: application/json

{
  "statement": "God loved the world and gave His Son",
  "verseReference": "John 3:16",
  "translation": "KJV"
}
```

**Response**:
```json
{
  "verseReference": "John 3:16",
  "statement": "God loved the world and gave His Son",
  "verseText": "For God so loved the world...",
  "supportLevel": "supported",
  "phraseOverlap": ["loved the world", "gave his son"],
  "matchScore": 0.85,
  "explanation": "Strong textual support with clear phrase overlap"
}
```

### Validate Multiple Citations
```http
POST /scripture/validate-citations-bulk
Content-Type: application/json

{
  "citations": [
    {
      "statement": "God is love",
      "verseReferences": ["1 John 4:8", "1 John 4:16"]
    }
  ],
  "translation": "KJV"
}
```

---

## 📖 Structural Analysis

### Get Structural Analysis
```http
GET /scripture/structural-analysis?passage=Psalm 23
```

**Response**:
```json
{
  "passage": "Psalm 23",
  "literaryGenre": "Psalm of Trust",
  "structure": [
    {
      "verses": "1-3",
      "type": "introduction",
      "description": "The Lord as Shepherd (third person)"
    }
  ],
  "chiasm": {
    "pattern": "A-B-C-B'-A'",
    "elements": [...]
  },
  "dataSource": "curated"
}
```

**Available Passages**: Psalm 23, Romans 3:21-26, John 1:1-18, Hebrews 8, Matthew 5, Daniel 2, Revelation 12, Exodus 20

---

## 🤔 Interpretive Challenges

### Get Interpretive Challenge
```http
GET /scripture/interpretive-challenge?passage=Romans 9:13
```

**Response**:
```json
{
  "passage": "Romans 9:13",
  "challenge": "Does 'Jacob I loved, but Esau I hated' mean God arbitrarily chose...",
  "views": [
    {
      "viewName": "Corporate Election View",
      "summary": "God chose Israel for a specific role...",
      "keyArguments": [...]
    }
  ],
  "sdaPerspective": {
    "position": "Corporate election for mission...",
    "reasoning": "...",
    "supportingTexts": ["1 John 4:8", "Ezekiel 33:11"]
  },
  "dataSource": "curated"
}
```

**Available Passages**: Romans 9:13, Matthew 24:34, 1 Corinthians 15:29, Hebrews 6:4-6, Daniel 8:14, Genesis 1

---

## 📝 Word Study

### Get Enhanced Word Study
```http
GET /scripture/word-study-enhanced?strongs=G25
```

**Response**:
```json
{
  "word": "ἀγαπάω",
  "language": "greek",
  "strongs": "G25",
  "lemma": "ἀγαπάω",
  "transliteration": "agapaō",
  "gloss": "to love",
  "morphology": {
    "partOfSpeech": "Verb",
    "parsing": {
      "tense": "Present/Aorist",
      "voice": "Active",
      "mood": "Indicative/Infinitive/Participle"
    }
  },
  "occurrenceDistribution": {
    "totalOccurrences": 143,
    "byBook": [
      { "book": "John", "count": 37 },
      { "book": "1 John", "count": 28 }
    ],
    "byTestament": { "ot": 0, "nt": 143 }
  },
  "contextualExamples": [...],
  "semanticRange": [...],
  "dataSource": "lexical_database"
}
```

### Search Word by Lemma
```http
GET /scripture/word-study-by-lemma?lemma=ἀγαπάω&language=greek
```

**Available Words**:
- Greek: G25 (ἀγαπάω), G4100 (πιστεύω), G3056 (λόγος)
- Hebrew: H2142 (זָכַר), H7676 (שַׁבָּת), H6663 (צָדַק)

---

## 🌍 Per-Verse Context

### Get Verse Context
```http
GET /scripture/verse-context?reference=John 4:9
```

**Response**:
```json
{
  "reference": "John 4:9",
  "historical": [
    {
      "note": "Jews and Samaritans had been in conflict since 722 BC...",
      "period": "Intertestamental Period",
      "source": "2 Kings 17:24-41"
    }
  ],
  "cultural": [
    {
      "note": "Jewish men typically did not speak to women in public...",
      "category": "social"
    }
  ],
  "geographical": [
    {
      "place": "Sychar",
      "description": "Samaritan town near Jacob's well",
      "significance": "Located near ancient Shechem...",
      "modernLocation": "Near modern Nablus, West Bank"
    }
  ],
  "dataSource": "curated"
}
```

**Available Verses**: John 4:9, Matthew 27:46, Daniel 8:14, Exodus 20:8, Acts 2:38, Revelation 14:7

---

## 📚 Translation Comparison

### Get Enhanced Translation Comparison
```http
GET /scripture/translation-comparison-enhanced?reference=Hebrews 4:9
```

**Response**:
```json
{
  "reference": "Hebrews 4:9",
  "translations": [
    {
      "code": "KJV",
      "name": "King James Version",
      "text": "There remaineth therefore a rest...",
      "type": "formal"
    },
    {
      "code": "NIV",
      "name": "New International Version",
      "text": "There remains, then, a Sabbath-rest...",
      "type": "dynamic"
    }
  ],
  "keyDifferences": [
    {
      "category": "theological_term",
      "translations": ["KJV: rest", "NIV: Sabbath-rest"],
      "difference": "Greek 'sabbatismos' vs. generic 'rest'",
      "explanation": "KJV obscures the Sabbath connection...",
      "significance": "high"
    }
  ],
  "analysis": {
    "verbDifferences": [],
    "theologicalTermDifferences": [...],
    "literalVsDynamic": [...],
    "overallAssessment": "Significant difference..."
  }
}
```

**Available Comparisons**: John 3:16, Romans 3:23, Hebrews 4:9, Daniel 8:14

---

## 📖 Verse Commentary

### Get Verse Commentary
```http
GET /scripture/verse-commentary?reference=John 3:16
```

**Response**:
```json
{
  "verseReference": "John 3:16",
  "notes": [
    {
      "type": "context",
      "content": "Part of Jesus' conversation with Nicodemus...",
      "source": "Contextual Analysis"
    },
    {
      "type": "word",
      "content": "The Greek word 'agape' emphasizes...",
      "source": "Lexical Study"
    }
  ]
}
```

---

## 🔗 Canonical Themes

### Get All Canonical Themes
```http
GET /scripture/canonical-themes
```

### Get Themes for Passage
```http
GET /scripture/canonical-themes?reference=Hebrews 8
```

### Get Specific Theme
```http
GET /scripture/canonical-theme?theme=sanctuary
```

**Response**:
```json
{
  "theme": "Sanctuary",
  "description": "The sanctuary system revealing God's plan of salvation",
  "category": "sanctuary",
  "verses": [
    {
      "reference": "Exodus 25:8-9",
      "snippet": "Earthly sanctuary commanded",
      "role": "foundation"
    },
    {
      "reference": "Hebrews 8:1-2",
      "snippet": "Christ in heavenly sanctuary",
      "role": "fulfillment"
    }
  ]
}
```

**Available Themes**: Covenant, Sanctuary, Kingdom, Sacrifice, Sabbath, Remnant, Prophecy, Gospel

---

## 🏛️ Sanctuary & Prophecy Mapping

### Get Sanctuary Connections
```http
GET /scripture/sanctuary-connections?passage=Hebrews 8
```

### Get Prophecy Connections
```http
GET /scripture/prophecy-connections?passage=Daniel 8
```

### Get All Sanctuary Threads
```http
GET /scripture/sanctuary-threads
```

### Get All Prophecy Threads
```http
GET /scripture/prophecy-threads
```

**Response**:
```json
{
  "sourcePassage": "Hebrews 8:1-5",
  "targetPassages": [
    "Exodus 25:8-9",
    "Leviticus 16:2",
    "Revelation 11:19"
  ],
  "connectionType": "type_antitype",
  "description": "Heavenly sanctuary as the true tabernacle..."
}
```

---

## 🔍 Morphology Data

### Get Morphology Data
```http
GET /scripture/morphology-data?word=ἀγαπάω&language=greek
```

**Response**:
```json
[
  {
    "word": "ἀγαπάω",
    "lemma": "ἀγαπάω",
    "strongs": "G25",
    "parsing": {
      "partOfSpeech": "Verb",
      "tense": "Aorist",
      "voice": "Active",
      "mood": "Indicative",
      "person": "3rd",
      "number": "Singular"
    },
    "transliteration": "agapaō",
    "gloss": "to love",
    "verseReference": "John 3:16"
  }
]
```

---

## 🛡️ Sermon Integrity

### Check Sermon Integrity
```http
POST /workspaces/:id/integrity-check
```

**Response**:
```json
{
  "overallScore": 85,
  "balanced": true,
  "issues": [
    {
      "severity": "warning",
      "category": "textual_support",
      "message": "Weak textual support for point...",
      "affectedItem": "Point 2"
    }
  ],
  "strengths": [
    "3 outline points have strong textual support",
    "5 citations are well-supported by Scripture"
  ],
  "recommendations": [
    "Verify all Scripture citations..."
  ],
  "pointAnalysis": [...],
  "applicationAnalysis": [...],
  "citationAnalysis": [...]
}
```

---

## 📊 EGW Integration

### Get EGW Insights for Passage
```http
GET /egw/insights/passage?book=John&chapter=3&verseStart=16&language=en&limit=5
```

### Get EGW Sermon Suggestions
```http
GET /egw/sermon-suggestions?passage=John 3:16&theme=salvation&language=en&limit=3
```

### Get SDA Smart Boosts
```http
GET /egw/smart-boosts?topic=sanctuary&language=en
```

---

## 📈 Data Availability

### Curated Data Coverage

**Structural Analysis**: 8 passages  
**Interpretive Challenges**: 6 passages  
**Word Study**: 6 key words  
**Per-Verse Context**: 6 verses  
**Translation Comparison**: 4 passages  
**Canonical Themes**: 8 themes fully mapped  
**Sanctuary/Prophecy Mapping**: Comprehensive coverage  

### Honest Responses

When data is not available, services return:
```json
{
  "dataSource": "unavailable"
}
```

**No fabrication. Trust over completeness.**

---

## 🔐 Authentication

All endpoints require JWT token:
```http
Authorization: Bearer <your_jwt_token>
```

Get token via:
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```
