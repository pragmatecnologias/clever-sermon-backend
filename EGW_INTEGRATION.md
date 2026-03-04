# 📚 Ellen G. White Books Integration - Complete Guide

## 🎯 Overview

Complete integration system for downloading, parsing, and searching Ellen G. White books from egwwritings.org.

---

## 📥 Step 1: Download All EGW Books

### Installation
```bash
cd /Users/admin/CascadeProjects/clever-sermon-backend/scripts
npm install
```

### Download Books
```bash
cd /Users/admin/CascadeProjects/clever-sermon-backend/scripts
npx ts-node download-egw-books.ts
```

**What it does**:
- Downloads 40+ EGW books as EPUB files
- Saves to `data/egw-books/` directory
- Creates metadata.json with download information
- Skips already downloaded files
- Respectful rate limiting (500ms delay between downloads)

**Books included**:
- ✅ Conflict of the Ages Series (5 books)
- ✅ Christian Living (5 books)
- ✅ Testimonies for the Church (9 volumes)
- ✅ Devotional books (3 books)
- ✅ Doctrinal works (3 books)
- ✅ Health books (2 books)
- ✅ Family books (2 books)
- ✅ Additional important works (10+ books)

---

## 📖 Step 2: Parse EPUB Files

### Parse Books
```bash
cd /Users/admin/CascadeProjects/clever-sermon-backend/scripts
npx ts-node parse-egw-books.ts
```

**What it does**:
- Extracts content from EPUB files
- Parses chapters and paragraphs
- Generates paragraph-level references (e.g., "DA 123.2")
- Creates searchable JSON files
- Saves to `data/egw-parsed/` directory

**Output files**:
- `chapters.json` - All chapters with full content
- `paragraphs.json` - Paragraph-level data with references
- `index.json` - Searchable index of all books

---

## 🗄️ Step 3: Load into Database

### Database Entities Created

**`EGWBook`**:
- Book code (e.g., "DA", "GC", "PP")
- Title
- Category
- Chapter count
- Paragraph count

**`EGWParagraph`**:
- Book code
- Chapter number
- Paragraph number
- Content
- Reference (e.g., "DA 123.2")
- Indexed for fast searching

### Load Data
```typescript
// Create a migration or seed script
import { EGWBook } from './entities/egw-book.entity';
import { EGWParagraph } from './entities/egw-paragraph.entity';
import * as fs from 'fs';

const paragraphs = JSON.parse(fs.readFileSync('data/egw-parsed/paragraphs.json', 'utf8'));
const index = JSON.parse(fs.readFileSync('data/egw-parsed/index.json', 'utf8'));

// Insert books
for (const book of index.books) {
  await bookRepository.save({
    code: book.code,
    title: book.title,
    category: book.category,
    chapterCount: book.chapters,
    paragraphCount: book.paragraphs
  });
}

// Insert paragraphs (batch insert recommended)
await paragraphRepository.save(paragraphs);
```

---

## 🔌 API Endpoints

### Get All Books
```
GET /egw/books
```

### Get Book by Code
```
GET /egw/books/DA
```

### Get Books by Category
```
GET /egw/books/category/Conflict%20of%20Ages
```

### Get Chapter
```
GET /egw/chapter/DA/12
```

### Get Paragraph by Reference
```
GET /egw/paragraph/DA%20123.2
```

### Search Content
```
GET /egw/search?q=sanctuary&limit=20
```

### Search by Topic
```
GET /egw/search/topic?topic=sabbath&limit=10
```

### Get Relevant Quotes
```
GET /egw/quotes?scripture=John%203:16&topic=salvation&limit=5
```

### Get Suggested Reading
```
GET /egw/suggested-reading?topic=prophecy
```

---

## 🎨 Frontend Integration

### Example: Display EGW Quotes in Sermon Workspace

```typescript
import { useEffect, useState } from 'react';

function EGWQuotes({ scriptureReference, topic }) {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetchQuotes();
  }, [scriptureReference, topic]);

  const fetchQuotes = async () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      scripture: scriptureReference,
      topic: topic || '',
      limit: '5'
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/egw/quotes?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    setQuotes(data);
  };

  return (
    <div className="egw-quotes">
      <h3>Ellen G. White Insights</h3>
      {quotes.map((quote, idx) => (
        <div key={idx} className="quote-card">
          <p className="quote-text">"{quote.text}"</p>
          <p className="quote-reference">
            — {quote.bookTitle}, {quote.reference}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔍 Search Features

### Content Search
- Full-text search across all paragraphs
- Relevance scoring
- Exact phrase matching
- Word proximity detection

### Topic Search
- Keyword expansion
- Topic mapping (sabbath → ["sabbath", "seventh day", "rest"])
- Intelligent relevance ranking

### Suggested Reading
- Returns relevant books and chapters
- Grouped by topic
- Sorted by relevance

---

## 📊 Book Categories

1. **Conflict of the Ages** - PP, PK, DA, AA, GC
2. **Christian Living** - SC, MB, COL, MH, Ed
3. **Testimonies** - 1T through 9T
4. **Devotional** - ML, OHC, Mar
5. **Doctrinal** - EW, GW, Ev
6. **Health** - CD, Te
7. **Family** - AH, CG
8. **Education** - CT, FE
9. **Ministry** - PM, WM
10. **Biography** - LS

---

## 🚀 Integration with Sermon Features

### 1. Study Report Enhancement
```typescript
// Add EGW quotes to study report
const egwQuotes = await egwService.getRelevantQuotes(mainPassage, theme);
studyReport.egwInsights = egwQuotes;
```

### 2. Sermon Outline Enrichment
```typescript
// Get suggested reading for sermon topic
const suggestedReading = await egwService.getSuggestedReading(theme);
outline.recommendedReading = suggestedReading;
```

### 3. Application Support
```typescript
// Find EGW quotes supporting application
const supportingQuotes = await egwService.searchByTopic(applicationTopic);
application.egwSupport = supportingQuotes;
```

---

## 📈 Performance Optimization

### Indexing
- Book code indexed
- Reference indexed (unique)
- Chapter/paragraph composite index
- Full-text search on content

### Caching
```typescript
// Cache frequently accessed books
@Cacheable('egw-books', 3600)
async getAllBooks() { ... }

// Cache search results
@Cacheable('egw-search', 1800)
async searchContent(query: string) { ... }
```

---

## 🎯 Usage Examples

### Example 1: Get Quotes for Sermon on John 3:16
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/egw/quotes?scripture=John%203:16&topic=salvation&limit=5"
```

### Example 2: Search for Sabbath Content
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/egw/search/topic?topic=sabbath&limit=10"
```

### Example 3: Get Chapter from Desire of Ages
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/egw/chapter/DA/12"
```

---

## 📦 Installation Summary

```bash
# 1. Install dependencies
cd scripts
npm install

# 2. Download books
npx ts-node download-egw-books.ts

# 3. Parse books
npx ts-node parse-egw-books.ts

# 4. Add EGW module to app.module.ts
import { EGWModule } from './modules/egw/egw.module';

@Module({
  imports: [
    // ... other modules
    EGWModule
  ]
})

# 5. Run migrations to create tables
npm run migration:run

# 6. Load data into database (create seed script)
```

---

## 🎉 Benefits

✅ **40+ EGW books** fully searchable  
✅ **Paragraph-level references** (e.g., "DA 123.2")  
✅ **Topic-based search** with keyword expansion  
✅ **Relevance scoring** for best matches  
✅ **Suggested reading** by topic  
✅ **Integration-ready** for sermon features  
✅ **Fast search** with database indexing  
✅ **Respectful downloading** with rate limiting  

---

## 📝 Next Steps

1. ✅ Download books
2. ✅ Parse EPUBs
3. ⏳ Create database migration
4. ⏳ Load data into database
5. ⏳ Add EGW module to app
6. ⏳ Create frontend components
7. ⏳ Integrate with sermon workspace

**The foundation is complete. Ready to integrate EGW wisdom into every sermon!** 📚✨
