# 🚀 Quick Start Guide: Product Transformation Features

## Overview
Your Clever Sermon tool has been transformed from a neutral assistant into an **opinionated preaching mentor**. This guide shows you how to use the new features.

---

## 🔧 Setup & Database Migration

### 1. Update Database Schema
```bash
cd /Users/admin/CascadeProjects/clever-sermon-backend

# Drop and recreate database with new tables
npm run schema:drop
npm run schema:create
npm run seed
```

### 2. Start Backend Server
```bash
npm run start:dev
```

### 3. Start Frontend
```bash
cd /Users/admin/CascadeProjects/clever-sermon-frontend
npm run dev
```

---

## 📊 New Features Available

### 1️⃣ **Theological Center Analysis**
**What it does:** Identifies if your sermon orbits the passage's dominant theological center

**How to use:**
```typescript
// API Endpoint
POST /analysis/theological-center/:workspaceId
GET /analysis/theological-center/:workspaceId

// Frontend Component
import TheologicalCenterPanel from '@/components/TheologicalCenterPanel'

<TheologicalCenterPanel workspaceId={id} token={token} />
```

**What you get:**
- Dominant theological center identified
- Textual warrant from the passage
- Alignment score (0-100)
- Deviations with severity levels (minor/moderate/major)
- Secondary themes to suppress
- **Decisive feedback:** "This is weak", "This deviates from the center"

---

### 2️⃣ **Tension Mapping**
**What it does:** Maps paradoxes and theological friction, ensures you preserve tension before resolving

**How to use:**
```typescript
POST /analysis/tension-mapping/:workspaceId
GET /analysis/tension-mapping/:workspaceId

import TensionMappingPanel from '@/components/TensionMappingPanel'
```

**What you get:**
- Textual tensions identified (paradoxes, unresolved phrases, theological friction)
- Preservation strategies for each tension
- Analysis of how your sermon handles tension
- Resolution timing assessment (too_early/appropriate/unresolved)
- Tension preservation score

---

### 3️⃣ **Doctrinal Precision Check**
**What it does:** Guards SDA doctrinal consistency across 8 categories

**How to use:**
```typescript
POST /analysis/doctrinal-precision/:workspaceId
GET /analysis/doctrinal-precision/:workspaceId

import DoctrinalPrecisionPanel from '@/components/DoctrinalPrecisionPanel'
```

**Categories checked:**
- Grace (forensic vs transformative)
- Sanctification (moral effort vs Spirit-empowered)
- Sabbath (covenant sign vs obligation)
- State of the Dead
- Sanctuary doctrine
- Second Coming
- Covenant relationship
- Law and Gospel

**What you get:**
- Consistency check for each category
- Severity levels (info/warning/critical)
- Specific concerns and recommendations
- Overall consistency score

---

### 4️⃣ **Blind Spot Detection**
**What it does:** Reveals what your sermon is NOT saying

**How to use:**
```typescript
POST /analysis/blind-spots/:workspaceId
GET /analysis/blind-spots/:workspaceId

import BlindSpotPanel from '@/components/BlindSpotPanel'
```

**What you get:**
- Themes present in passage but missing from sermon
- Hard verses being avoided
- Doctrinal tensions being minimized
- Application category imbalance
- Overall assessment

---

### 5️⃣ **Preaching Strategy Selector**
**What it does:** Recommends optimal genre, arc, and approach

**How to use:**
```typescript
POST /analysis/preaching-strategy/:workspaceId
GET /analysis/preaching-strategy/:workspaceId

import PreachingStrategyPanel from '@/components/PreachingStrategyPanel'
```

**What you get:**
- Recommended genre (expository, narrative, prophetic, apologetic, revivalist, teaching, pastoral, evangelistic)
- Emotional arc (conviction→hope, crisis→resolution, question→discovery, comfort→challenge, lament→praise)
- Tone recommendation
- Target length in minutes
- Tension level (0-100)
- Application density (0-100)
- Invitation-driven flag
- Structural guidance for intro/body/conclusion

---

### 6️⃣ **Historical Context Enhanced**
**What it does:** Provides specific social realities, not generic summaries

**How to use:**
```typescript
POST /analysis/historical-context/:workspaceId
GET /analysis/historical-context/:workspaceId

import HistoricalContextPanel from '@/components/HistoricalContextPanel'
```

**What you get:**
- Specific social realities (not "Christians in Ephesus" but "Artemis worship dominance, imperial cult pressure")
- Power structures and dynamics
- Economic context
- Religious climate
- Audience pressures and pastoral responses
- Synthesis statement

---

### 7️⃣ **Sermon Pattern Tracker**
**What it does:** Tracks your preaching patterns across sermons for growth insights

**How to use:**
```typescript
GET /analysis/sermon-patterns
POST /analysis/sermon-patterns/analyze

import SermonPatternDashboard from '@/components/SermonPatternDashboard'
```

**What you get:**
- Total sermons tracked
- Style frequency analysis
- Theme patterns
- Application category balance
- Average Christ-centrality score
- Average application depth
- Texts you avoid
- Overused illustrations
- Growth insights (strengths/weaknesses/recommendations)

**Note:** Requires at least 3 sermons for growth analysis

---

### 8️⃣ **Cross-Reference Narratives**
**What it does:** Converts cross-reference lists into thematic narrative chains

**How to use:**
```typescript
POST /analysis/cross-reference-narrative/:verse
GET /analysis/cross-reference-narrative/:verse

import CrossReferenceNarrativeDisplay from '@/components/CrossReferenceNarrativeDisplay'
```

**What you get:**
- 2-3 narrative threads per verse
- Thematic chains ordered chronologically/thematically
- Each reference's contribution to the narrative
- Redemptive movement identification
- Story arc instead of database list

---

## 🎯 Master Dashboard

### Run All Analyses at Once
```typescript
POST /analysis/run-all/:workspaceId

// Returns all 6 workspace-specific analyses in parallel:
{
  theologicalCenter: {...},
  tensions: {...},
  doctrinalCheck: {...},
  blindSpots: {...},
  strategy: {...},
  historicalContext: {...}
}
```

### Use the Master Dashboard Component
```typescript
import SermonMentorDashboard from '@/components/SermonMentorDashboard'

<SermonMentorDashboard workspaceId={id} token={token} />
```

**Features:**
- Collapsible sections for each analysis type
- "Run All Analyses" button for parallel execution
- Color-coded sections
- Expandable/collapsible interface

---

## 🎨 Updated Visualizations

All 3D visualizations now answer theological questions:

### Canonical Constellation
**Question:** Where does this passage sit in redemptive history?
- Visual theological question header added
- Focus on redemptive-historical placement

### Prophecy Web
**Question:** What covenant movement is unfolding?
- Highlights covenant progression
- Shows prophetic fulfillment patterns

### Sermon Flow Sculptor
**Question:** Does the weight of the text match the weight of the sermon?
- Analyzes sermon structure alignment
- Identifies weak connections

---

## 💡 Integration Example

### Add to Workspace Page

```typescript
// In /src/app/workspace/[id]/page.tsx

import SermonMentorDashboard from '@/components/SermonMentorDashboard'
import SermonPatternDashboard from '@/components/SermonPatternDashboard'
import CrossReferenceNarrativeDisplay from '@/components/CrossReferenceNarrativeDisplay'

// Inside your component:
<div className="space-y-6">
  {/* Existing content */}
  
  {/* Add Sermon Mentor Section */}
  <section>
    <h2 className="text-2xl font-bold mb-4">Sermon Mentor</h2>
    <SermonMentorDashboard workspaceId={id} token={token} />
  </section>
  
  {/* Add Pattern Tracking */}
  <section>
    <h2 className="text-2xl font-bold mb-4">Your Preaching Patterns</h2>
    <SermonPatternDashboard token={token} />
  </section>
  
  {/* Add Cross-Reference Narratives */}
  <section>
    <h2 className="text-2xl font-bold mb-4">Cross-Reference Stories</h2>
    <CrossReferenceNarrativeDisplay 
      verse={workspace?.mainPassage} 
      token={token} 
    />
  </section>
</div>
```

---

## 🔑 Key Differences

### Before vs After

| Before | After |
|--------|-------|
| Generates content | Prunes weak content |
| Presents options | Says "This is weak" |
| Expands ideas | Challenges assumptions |
| Supports choices | Forces clarity |
| Validates work | Exposes blind spots |
| One-time tool | Long-term formation |

---

## 📈 Workflow Recommendation

### For Each Sermon:

1. **Create workspace** with passage and theme
2. **Run All Analyses** using the master dashboard
3. **Review Theological Center** - Is your sermon aligned?
4. **Check Tension Mapping** - Are you preserving tension?
5. **Verify Doctrinal Precision** - Any consistency issues?
6. **Address Blind Spots** - What are you NOT saying?
7. **Apply Strategy** - Does the genre fit?
8. **Deepen Context** - Add specific historical details
9. **Build Cross-Reference Narratives** - Tell stories, not lists

### Periodically:

10. **Review Sermon Patterns** - Track your growth over time
11. **Analyze Growth Insights** - Identify strengths and weaknesses
12. **Adjust Preaching** - Address avoided texts and imbalances

---

## 🎓 Philosophy

This tool now operates as a **preaching mentor**, not just a content generator:

- **Opinionated:** It tells you what's weak, what deviates, what to cut
- **Decisive:** Clear recommendations, not vague suggestions
- **Pruning-focused:** Depth comes from removing, not adding
- **Growth-oriented:** Tracks patterns for long-term formation
- **Theologically grounded:** Guards doctrine, preserves tension, centers on Christ

**Remember:** The goal is not to generate more content, but to sharpen what you have.

---

## 🐛 Troubleshooting

### Database Issues
```bash
# If you see "table does not exist" errors:
npm run schema:drop
npm run schema:create
npm run seed
```

### API Connection Issues
- Verify backend is running on port 4001
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Ensure JWT token is valid

### Analysis Not Running
- Check browser console for errors
- Verify workspace ID is valid
- Ensure LLM service is configured (LM_STUDIO_URL or OPENAI_API_KEY)

---

## 📚 Additional Resources

- **Full Implementation Details:** `/docs/PRODUCT_TRANSFORMATION_IMPLEMENTATION.md`
- **API Endpoints:** All endpoints documented in implementation guide
- **Component Props:** TypeScript interfaces in each component file

---

## 🎉 You're Ready!

Your tool is now an opinionated preaching mentor. Start using it to:
- Identify theological centers
- Preserve tension
- Guard doctrine
- Expose blind spots
- Track growth
- Sharpen sermons

**Depth comes from pruning, not adding.**
