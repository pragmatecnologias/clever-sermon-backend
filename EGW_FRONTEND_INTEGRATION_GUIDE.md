# 🎨 EGW Frontend Integration Guide

## 📋 Overview

This guide provides exact specifications for integrating EGW (Ellen G. White) features into the frontend. All backend services are complete and ready.

---

## 🔌 API Endpoints Available

### **1. Passage-Linked EGW Panel**

**Endpoint**: `GET /egw/passage-panel`

**Query Parameters**:
- `book` (required): Bible book name (e.g., "John")
- `chapter` (required): Chapter number
- `verseStart` (optional): Starting verse
- `verseEnd` (optional): Ending verse
- `limit` (optional): Number of results (default: 5)

**Example Request**:
```typescript
const response = await fetch(
  `${API_URL}/egw/passage-panel?book=John&chapter=3&verseStart=16&limit=5`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
const data = await response.json();
```

**Response Structure**:
```typescript
interface EGWPanelData {
  passage: string; // "John 3:16"
  insights: PassageEGWInsight[];
  totalAvailable: number;
  hasMore: boolean;
}

interface PassageEGWInsight {
  paragraphId: string;
  bookCode: string; // "DA"
  bookTitle: string; // "The Desire of Ages"
  chapterTitle: string;
  reference: string; // "DA 19.2"
  content: string; // Full verbatim paragraph
  preview: string; // 2-4 line preview
  scriptureReference: string; // "John 3:16"
  rankingScore: number; // 100, 75, 50, 90
  rankingReason: 'exact_verse' | 'same_chapter' | 'thematic' | 'doctrinal';
}
```

---

### **2. SDA Smart Boost Check**

**Endpoint**: `GET /egw/sda-smart-boost-check`

**Query Parameters**:
- `passage` (required): Full passage reference (e.g., "Daniel 8:14")

**Example Request**:
```typescript
const response = await fetch(
  `${API_URL}/egw/sda-smart-boost-check?passage=Daniel 8:14`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
const data = await response.json();
```

**Response Structure**:
```typescript
interface SDASmartBoost {
  isDoctrinalPassage: boolean;
  theme?: string; // "Sanctuary - Investigative Judgment"
  frequentlyCited?: PassageEGWInsight[];
}
```

---

### **3. Existing EGW Endpoints (Enhanced)**

```typescript
// Get insights for passage
GET /egw/insights/passage?book=John&chapter=3&verseStart=16&language=en&limit=5

// Get sermon suggestions
GET /egw/sermon-suggestions?passage=John 3:16&theme=salvation&language=en&limit=3

// Get interpretive perspective
GET /egw/interpretive-perspective?passage=John 3:16&language=en

// Get smart boosts for topic
GET /egw/smart-boosts?topic=sanctuary&language=en

// Search content
GET /egw/search?query=sanctuary&limit=20&language=en

// Search by topic
GET /egw/search/topic?topic=sabbath&limit=10
```

---

## 🎨 UI Components to Build

### **Component 1: EGW Passage Panel**

**Location**: Below Cross References section in passage study view

**Design Specifications**:

```tsx
interface EGWPanelProps {
  passage: string; // "John 3:16"
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export function EGWPassagePanel({ passage, book, chapter, verseStart, verseEnd }: EGWPanelProps) {
  const [insights, setInsights] = useState<PassageEGWInsight[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch insights on mount
  useEffect(() => {
    fetchInsights();
  }, [passage]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">
          🕊 Spirit of Prophecy
        </h3>
        <span className="ml-auto text-xs text-gray-400">
          {insights.length} insights
        </span>
      </div>

      {/* Insights List */}
      {insights.map(insight => (
        <InsightCard
          key={insight.paragraphId}
          insight={insight}
          expanded={expanded.has(insight.paragraphId)}
          onToggle={() => toggleExpand(insight.paragraphId)}
        />
      ))}

      {/* View More Button */}
      {hasMore && (
        <button onClick={loadMore} className="...">
          View More Insights
        </button>
      )}
    </div>
  );
}
```

**Insight Card Design**:
```tsx
function InsightCard({ insight, expanded, onToggle }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-3 bg-black/30">
      {/* Header with ranking badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-blue-300">
              {insight.bookTitle}
            </span>
            <span className="text-xs text-gray-400">
              {insight.reference}
            </span>
          </div>
          <RankingBadge reason={insight.rankingReason} />
        </div>
      </div>

      {/* Preview or Full Content */}
      <p className="text-sm text-gray-300 leading-relaxed">
        {expanded ? insight.content : insight.preview}
      </p>

      {/* Expand/Collapse Button */}
      <button
        onClick={onToggle}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300"
      >
        {expanded ? 'Show Less' : 'Read Full Quote'}
      </button>
    </div>
  );
}
```

**Ranking Badge**:
```tsx
function RankingBadge({ reason }: { reason: string }) {
  const badges = {
    exact_verse: {
      label: 'Directly comments on this verse',
      color: 'bg-green-500/20 text-green-200 border-green-400/40'
    },
    same_chapter: {
      label: 'Relates to this chapter',
      color: 'bg-blue-500/20 text-blue-200 border-blue-400/40'
    },
    thematic: {
      label: 'Thematically connected',
      color: 'bg-purple-500/20 text-purple-200 border-purple-400/40'
    },
    doctrinal: {
      label: 'Key doctrinal theme',
      color: 'bg-amber-500/20 text-amber-200 border-amber-400/40'
    }
  };

  const badge = badges[reason];

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${badge.color}`}>
      {badge.label}
    </span>
  );
}
```

---

### **Component 2: SDA Smart Boost Banner**

**Location**: Top of passage study view (when detected)

```tsx
export function SDASmartBoostBanner({ passage }: { passage: string }) {
  const [boost, setBoost] = useState<SDASmartBoost | null>(null);

  useEffect(() => {
    checkSmartBoost();
  }, [passage]);

  if (!boost?.isDoctrinalPassage) return null;

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-blue-900/30 border border-amber-400/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-200">
            Frequently Cited in Spirit of Prophecy
          </h4>
          <p className="text-xs text-gray-300 mt-1">
            This passage is central to SDA theology: <strong>{boost.theme}</strong>
          </p>
        </div>
      </div>

      {/* Show top cited references */}
      {boost.frequentlyCited && boost.frequentlyCited.length > 0 && (
        <div className="mt-3 space-y-2">
          {boost.frequentlyCited.slice(0, 3).map(insight => (
            <div key={insight.paragraphId} className="text-xs text-gray-300">
              • {insight.bookTitle}, {insight.reference}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### **Component 3: Study Report EGW Section**

**Location**: Within study report display, after Scripture sections

```tsx
interface EGWStudySection {
  thematicEmphasis?: string;
  devotionalInsight?: string;
  practicalCounsel?: string;
  propheticExpansion?: string;
  quotes: Array<{
    reference: string;
    bookTitle: string;
    text: string;
    category: 'thematic' | 'devotional' | 'practical' | 'prophetic';
  }>;
}

export function StudyReportEGWSection({ section }: { section: EGWStudySection | null }) {
  if (!section) return null;

  return (
    <div className="mt-8 border-t border-gray-700 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">
          🕊 Spirit of Prophecy Insight
        </h3>
      </div>

      <p className="text-sm text-gray-400 mb-6 italic">
        The following insights from Ellen G. White's writings relate to this passage:
      </p>

      {/* Thematic Emphasis */}
      {section.thematicEmphasis && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-blue-300 mb-2">
            Thematic Emphasis
          </h4>
          <div className="text-sm text-gray-300 leading-relaxed">
            {section.thematicEmphasis}
          </div>
        </div>
      )}

      {/* Devotional Insight */}
      {section.devotionalInsight && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-blue-300 mb-2">
            Devotional Insight
          </h4>
          <div className="text-sm text-gray-300 leading-relaxed">
            {section.devotionalInsight}
          </div>
        </div>
      )}

      {/* Practical Counsel */}
      {section.practicalCounsel && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-blue-300 mb-2">
            Practical Counsel
          </h4>
          <div className="text-sm text-gray-300 leading-relaxed">
            {section.practicalCounsel}
          </div>
        </div>
      )}

      {/* Prophetic Expansion */}
      {section.propheticExpansion && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-blue-300 mb-2">
            Prophetic Expansion
          </h4>
          <div className="text-sm text-gray-300 leading-relaxed">
            {section.propheticExpansion}
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 italic">
          Note: All quotes are preserved verbatim from original sources. 
          Spirit of Prophecy insights complement but do not replace Scripture study.
        </p>
      </div>
    </div>
  );
}
```

---

### **Component 4: Sermon Builder EGW Toggle**

**Location**: Sermon builder settings panel

```tsx
export function SermonBuilderSettings({ workspace, onUpdate }) {
  const [includeEGW, setIncludeEGW] = useState(workspace.includeEGW ?? true);

  const handleToggle = async (checked: boolean) => {
    setIncludeEGW(checked);
    await onUpdate({ includeEGW: checked });
  };

  return (
    <div className="space-y-4">
      {/* Other settings... */}

      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex-1">
          <label className="text-sm font-medium text-white">
            Include Spirit of Prophecy References
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Add relevant Ellen G. White quotes to sermon outline and manuscript
          </p>
        </div>
        <input
          type="checkbox"
          checked={includeEGW}
          onChange={(e) => handleToggle(e.target.checked)}
          className="..."
        />
      </div>
    </div>
  );
}
```

---

### **Component 5: Sermon Point EGW Support Display**

**Location**: Within sermon outline editor, for each point

```tsx
interface SermonPointSupport {
  point: string;
  scriptureSupport: string[];
  egwSupport?: Array<{
    reference: string;
    bookTitle: string;
    quote: string;
    citationFormat: string;
    relevance: string;
  }>;
}

export function SermonPointSupportCard({ support }: { support: SermonPointSupport }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black/30">
      <h4 className="text-sm font-semibold text-white mb-3">
        {support.point}
      </h4>

      {/* Scripture Support */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-blue-300">
            Scripture Support
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {support.scriptureSupport.map(ref => (
            <span key={ref} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-200 rounded">
              {ref}
            </span>
          ))}
        </div>
      </div>

      {/* EGW Support (if enabled) */}
      {support.egwSupport && support.egwSupport.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Book className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">
              Spirit of Prophecy Support
            </span>
          </div>
          <div className="space-y-2">
            {support.egwSupport.map((egw, idx) => (
              <div key={idx} className="text-xs text-gray-300 pl-3 border-l-2 border-purple-400/30">
                <p className="italic mb-1">"{egw.quote}"</p>
                <p className="text-gray-400">
                  — {egw.bookTitle}, {egw.reference}
                </p>
                <p className="text-purple-300 text-[10px] mt-1">
                  {egw.relevance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### **Component 6: Interpretive Challenge EGW Perspective**

**Location**: Within interpretive challenges panel, expandable section

```tsx
export function InterpretiveChallengeEGWPerspective({ passage }: { passage: string }) {
  const [perspective, setPerspective] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchPerspective();
  }, [passage]);

  if (!perspective) return null;

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-blue-200"
      >
        <Book className="w-4 h-4" />
        <span>🕊 Spirit of Prophecy Perspective</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-3 pl-6">
          {perspective.hasCommentary ? (
            <div className="space-y-3">
              {perspective.quotes?.map((quote: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-300">
                  <p className="italic mb-1">"{quote.text}"</p>
                  <p className="text-xs text-gray-400">— {quote.reference}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No direct Spirit of Prophecy commentary found for this verse.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Integration Checklist

### **Phase 1: Core Components**
- [ ] Create `EGWPassagePanel` component
- [ ] Create `InsightCard` sub-component
- [ ] Create `RankingBadge` sub-component
- [ ] Add panel to passage study view (below cross-references)
- [ ] Implement expand/collapse functionality
- [ ] Implement "View More" pagination

### **Phase 2: Smart Features**
- [ ] Create `SDASmartBoostBanner` component
- [ ] Add banner to passage study view (conditional)
- [ ] Fetch smart boost data on passage change
- [ ] Display doctrinal theme and top citations

### **Phase 3: Study Report Integration**
- [ ] Create `StudyReportEGWSection` component
- [ ] Add to study report display
- [ ] Fetch EGW section data from backend
- [ ] Display all subsections (thematic, devotional, practical, prophetic)

### **Phase 4: Sermon Builder Integration**
- [ ] Add EGW toggle to workspace settings
- [ ] Create `SermonPointSupportCard` component
- [ ] Display Scripture + EGW support for each point
- [ ] Implement quote insertion into manuscript

### **Phase 5: Interpretive Challenges**
- [ ] Create `InterpretiveChallengeEGWPerspective` component
- [ ] Add expandable section to challenges panel
- [ ] Fetch perspective data
- [ ] Display quotes or "not available" message

---

## 🎨 Design Tokens

```typescript
// Colors
const EGW_COLORS = {
  primary: 'text-blue-400',
  secondary: 'text-purple-400',
  background: 'bg-gray-800/50',
  border: 'border-gray-700',
  accent: 'bg-blue-500/20',
};

// Icons
import { Book, BookOpen, Sparkles, ChevronDown } from 'lucide-react';

// Ranking Badge Colors
const RANKING_COLORS = {
  exact_verse: 'bg-green-500/20 text-green-200 border-green-400/40',
  same_chapter: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
  thematic: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
  doctrinal: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
};
```

---

## 📊 State Management

```typescript
// Workspace context enhancement
interface Workspace {
  // ... existing fields
  includeEGW?: boolean; // Default: true for SDA lens
}

// EGW panel state
interface EGWPanelState {
  insights: PassageEGWInsight[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalAvailable: number;
  expandedIds: Set<string>;
}

// Smart boost state
interface SmartBoostState {
  boost: SDASmartBoost | null;
  loading: boolean;
}
```

---

## 🔧 Utility Functions

```typescript
// Format EGW reference for display
export function formatEGWReference(reference: string): string {
  // "DA 19.2" → "The Desire of Ages, p. 19, para. 2"
  const [bookCode, pageAndPara] = reference.split(' ');
  const [page, para] = pageAndPara.split('.');
  const bookNames = {
    DA: 'The Desire of Ages',
    GC: 'The Great Controversy',
    SC: 'Steps to Christ',
    // ... add more
  };
  return `${bookNames[bookCode] || bookCode}, p. ${page}, para. ${para}`;
}

// Truncate quote for preview
export function createPreview(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastPeriod = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('?'),
    truncated.lastIndexOf('!')
  );
  return lastPeriod > 100 
    ? text.substring(0, lastPeriod + 1)
    : truncated + '...';
}
```

---

## ✅ Testing Checklist

### **Unit Tests**
- [ ] EGWPassagePanel renders correctly
- [ ] InsightCard expands/collapses
- [ ] RankingBadge displays correct color/label
- [ ] Smart boost banner shows/hides correctly
- [ ] Study report section renders all subsections

### **Integration Tests**
- [ ] Passage panel fetches data on mount
- [ ] "View More" loads additional insights
- [ ] Smart boost checks passage on change
- [ ] EGW toggle updates workspace settings
- [ ] Sermon points display EGW support when enabled

### **E2E Tests**
- [ ] User studies John 3:16, sees EGW panel
- [ ] User expands insight, sees full quote
- [ ] User studies Daniel 8:14, sees smart boost banner
- [ ] User generates study report with EGW section
- [ ] User builds sermon with EGW quotes

---

## 🚀 Deployment Notes

1. **Backend is ready** - All services deployed and functional
2. **API endpoints live** - Test with Postman/curl first
3. **Database populated** - 3,361 paragraphs, 9,285 references
4. **No breaking changes** - All new features are additive
5. **Backward compatible** - Existing features unaffected

---

## 📞 Support

**Backend Services**: All implemented and tested
**API Documentation**: See `API_ENDPOINTS_STUDY_FIRST.md`
**Integration Issues**: Check network tab for API responses
**Data Issues**: Verify passage format matches expected pattern

**The backend is complete. Frontend integration can proceed immediately.**
