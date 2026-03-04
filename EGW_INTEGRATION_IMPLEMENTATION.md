# 🕊 Ellen G. White Integration - Implementation Guide

## ✅ Phase 1 MVP - IMPLEMENTED

### 🎯 Strategic Approach
Following the principle: **EGW as contextual theological companion, not quote dump**

Scripture remains primary. EGW strengthens study, never replaces it.

---

## 🏗️ Architecture

### Database Schema

**`egw_scripture_references` table**:
- Links EGW paragraphs to Bible passages
- Indexed by book, chapter, verse
- Supports both English and Spanish
- Enables instant contextual lookup

**Fields**:
```typescript
- id: uuid
- egwParagraphId: uuid (foreign key)
- book: string (e.g., "John", "Genesis")
- chapter: int
- verseStart: int (nullable)
- verseEnd: int (nullable)
- reference: string (e.g., "John 3:16")
- language: 'en' | 'es'
```

### Services

**`EGWService`** - Enhanced with:
- `getInsightsForPassage(book, chapter, verse, language)` - Returns EGW paragraphs referencing a passage
- Returns: book title, reference, excerpt (200 chars)
- Limit configurable (default: 5)

**`WorkspacesService`** - Enhanced with:
- `generateStudyReport(id, includeEGW)` - Optional EGW toggle
- `getEGWInsightsForPassage(passage, language)` - Private helper
- Formats EGW insights as separate section

---

## 📡 API Endpoints

### 1️⃣ Passage-Linked EGW Panel
```
GET /egw/insights/passage?book=John&chapter=3&verseStart=16&language=en&limit=5
```

**Response**:
```json
[
  {
    "paragraph": { /* full paragraph object */ },
    "bookTitle": "The Desire of Ages",
    "reference": "DA 123.2",
    "excerpt": "God so loved the world that He gave His only begotten Son..."
  }
]
```

**Use Case**: Display in collapsible "Spirit of Prophecy" panel when studying a passage

---

### 2️⃣ Study Report with EGW Toggle
```
POST /workspaces/:id/study-report?includeEGW=true
```

**Behavior**:
- `includeEGW=false` (default): Standard study report
- `includeEGW=true`: Adds EGW section at end

**Output Format**:
```markdown
# Study Report

[Standard Bible study content...]

---

## 🕊 Spirit of Prophecy Insights

### 1. The Desire of Ages

> "God so loved the world that He gave His only begotten Son..."

*— DA 123.2*

### 2. Steps to Christ

> "The love of God is unfathomable..."

*— SC 45.1*
```

**Key Design Principles**:
- ✅ Clearly separated section
- ✅ Labeled "Spirit of Prophecy Insights"
- ✅ Never mixed invisibly into Bible analysis
- ✅ Scripture remains primary
- ✅ Exact quotes preserved (never paraphrased)

---

## 🔧 Bible Reference Extraction

### Script: `extract-bible-references.ts`

**Purpose**: Parse EGW paragraphs and extract Bible references

**Features**:
- Regex-based extraction
- Supports both English and Spanish book names
- Handles verse ranges (e.g., "John 3:16-18")
- Handles chapter-only references (e.g., "John 3")

**Usage**:
```bash
cd scripts
npx ts-node extract-bible-references.ts
```

**Output**: `paragraphs-with-references.json`

**Statistics Tracked**:
- Total paragraphs processed
- Paragraphs with Bible references
- Total references found
- Average references per paragraph

---

## 🎨 Frontend Integration Examples

### 1️⃣ Spirit of Prophecy Panel Component

```typescript
function SpiritOfProphecyPanel({ passage, language }) {
  const [insights, setInsights] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [passage, language]);

  const fetchInsights = async () => {
    const { book, chapter, verse } = parsePassage(passage);
    const response = await fetch(
      `${API_URL}/egw/insights/passage?book=${book}&chapter=${chapter}&verseStart=${verse}&language=${language}&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    setInsights(data);
  };

  return (
    <div className="egw-panel">
      <button onClick={() => setIsOpen(!isOpen)}>
        🕊 Spirit of Prophecy ({insights.length})
      </button>
      
      {isOpen && (
        <div className="egw-insights">
          {insights.map((insight, idx) => (
            <div key={idx} className="insight-card">
              <h4>{insight.bookTitle}</h4>
              <p className="excerpt">"{insight.excerpt}"</p>
              <p className="reference">— {insight.reference}</p>
              <button onClick={() => viewFull(insight.paragraph)}>
                Expand
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2️⃣ Study Report Toggle

```typescript
function StudyReportGenerator({ workspaceId }) {
  const [includeEGW, setIncludeEGW] = useState(false);

  const generateReport = async () => {
    const response = await fetch(
      `${API_URL}/workspaces/${workspaceId}/study-report?includeEGW=${includeEGW}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const workspace = await response.json();
    setStudyReport(workspace.studyReport);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={includeEGW}
          onChange={(e) => setIncludeEGW(e.target.checked)}
        />
        Include Spirit of Prophecy Insights
      </label>
      
      <button onClick={generateReport}>
        Generate Study Report
      </button>
    </div>
  );
}
```

---

## ⚖️ Design Principles Enforced

### 1. **Hierarchy Maintained**
```
Scripture (primary)
  ↓
Study Tools
  ↓
Canonical Connections
  ↓
Spirit of Prophecy
```

### 2. **Clear Labeling**
- Always labeled "Spirit of Prophecy"
- Never mixed invisibly
- Separate section with visual divider

### 3. **Reference Integrity**
- Paragraph-level IDs stored
- Book title preserved
- Chapter preserved
- Paragraph number preserved
- Exact text preserved
- No AI paraphrasing without labeling

### 4. **User Control**
- Toggle-based inclusion
- Default: OFF
- Respects Bible-only pastors
- Supports comparative study mode
- Future-proof for interdenominational users

---

## 🚀 Next Steps (Phase 2)

### Sermon Builder Integration
- [ ] Add EGW toggle to sermon outline generation
- [ ] Add EGW toggle to manuscript generation
- [ ] Provide citation format helper
- [ ] Allow insertion into outline points
- [ ] Preserve exact wording (no rewrites)

### Interpretive Challenges Enhancement
- [ ] Add "Spirit of Prophecy Perspective" section
- [ ] Show EGW interpretation if available
- [ ] Display "No direct commentary found" if not available

### SDA-Themed Smart Boosts
- [ ] Auto-surface top 5 EGW passages for:
  - Daniel
  - Revelation
  - Hebrews (Sanctuary)
  - Sabbath passages
  - State of the dead passages

---

## 🎯 Strategic Positioning

**Result**: The only AI-assisted SDA sermon preparation environment with:
- ✅ Structured Scripture study
- ✅ Spirit of Prophecy integration
- ✅ Contextual theological companion
- ✅ Respectful of Scripture primacy
- ✅ Bilingual support (English & Spanish)

**Market**: Niche but powerful - SDA pastors worldwide

---

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| **Bible Reference Extraction** | ✅ Complete | Script ready to run |
| **EGW-Scripture Linking** | ✅ Complete | Database schema created |
| **Passage Insights Endpoint** | ✅ Complete | `/egw/insights/passage` |
| **Study Report Toggle** | ✅ Complete | `?includeEGW=true` |
| **Clear Section Separation** | ✅ Complete | Markdown formatted |
| **Reference Integrity** | ✅ Complete | Exact quotes preserved |
| **Bilingual Support** | ✅ Complete | English & Spanish |
| **Sermon Builder Toggle** | ⏳ Pending | Phase 2 |
| **Interpretive Challenges** | ⏳ Pending | Phase 2 |
| **Visual Mapping** | ⏳ Pending | Phase 3 |

---

## 🧪 Testing

### Test Passage: John 3:16

**Request**:
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/egw/insights/passage?book=John&chapter=3&verseStart=16&language=en&limit=3"
```

**Expected**: 3 EGW paragraphs referencing John 3:16

### Test Study Report with EGW

**Request**:
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/workspaces/{id}/study-report?includeEGW=true"
```

**Expected**: Study report with EGW section appended

---

## 📝 Documentation

- ✅ Implementation guide (this file)
- ✅ API documentation
- ✅ Frontend integration examples
- ✅ Design principles
- ✅ Testing guide

**The foundation is complete. EGW is now a contextual theological companion, strengthening Scripture study without replacing it.** 🕊✨
