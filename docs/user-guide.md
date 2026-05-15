# Clever Sermon — Pastor User Guide (Step-by-Step)

This guide walks a pastor from **first-time setup** through a full sermon workflow.

## 1) First-Time Setup (One-Time)

### 1. Install dependencies

Backend:
```bash
cd clever-sermon-backend
npm install
```

Frontend:
```bash
cd clever-sermon-frontend
npm install
```

### 2. Configure environment

Backend `.env`:
```bash
cp .env.example .env
```

Make sure these are set:
```bash
DATABASE_URL=postgres://admin@localhost:5432
DATABASE_NAME=clever_sermon
JWT_SECRET=your-secret

# Scripture data (recommended)
CROSS_REFERENCES_PATH=./data/openbible-cross-references.txt
WORD_STUDY_DATA_PATH=./data/strongs-word-study.json
WORD_OCCURRENCES_PATH=./data/sample-word-occurrences.json
CROSS_REFERENCE_CATEGORIES_PATH=./data/sample-cross-reference-categories.json
BOOK_METADATA_PATH=./data/book-metadata.json
HISTORICAL_CONTEXT_PATH=./data/historical-context.json
CULTURAL_CONTEXT_PATH=./data/cultural-context.json
TIMELINE_PATH=./data/timeline.json
GEOGRAPHY_PATH=./data/geography.json

# Bible API (optional but improves translation support)
BIBLE_API_KEY=
BIBLE_API_URL=https://api.scripture.api.bible/v1
```

Frontend `.env.local`:
```bash
cp .env.local.example .env.local
```

```bash
NEXT_PUBLIC_API_URL=http://localhost:4001/api/v1
```

### 3. Download scripture datasets (recommended)

```bash
# Cross references (OpenBible)
npx ts-node scripts/download-cross-references.ts data/openbible-cross-references.txt

# Word study (Strong’s Greek + Hebrew)
npx ts-node scripts/download-word-study.ts data/strongs-word-study.json
```

### 4. Create database + seed default user

```bash
npm run schema:create
npm run seed
```

Default admin login:
- **Email**: admin@example.com
- **Password**: password123

### 5. Start the apps

Backend:
```bash
npm run start:dev
```

Frontend:
```bash
npm run dev
```

Open: http://localhost:3000

---

## 2) Workflow: From Scratch to Sermon

### Step 1 — Login
- Go to `/login`
- Use the admin credentials above (or create a new user).

### Step 2 — Create a Workspace
- Dashboard → **Create Workspace**.
- Fill in:
  - Title
  - Main Passage (e.g., `John 3:16`)
  - Theme / Audience / Goals (optional but improves results)

### Step 3 — Study the Passage (Scripture Tools)
In the Workspace, open the left rail and use:

1. **Scripture**
   - Enter a reference and translation (e.g., `KJV`).
   - The passage renders verse-by-verse.

2. **Word Study**
   - Enter a Greek/Hebrew word (e.g., `agape`).
   - You’ll see lemma, Strong’s number, definition, and metadata.

3. **Cross References**
   - Enter a verse (e.g., `John 3:16`).
   - Related references will list from the OpenBible dataset.
   - Use the category filter to narrow results.

4. **Search**
   - Search across workspaces, notes, outlines, manuscripts, and knowledge content.

### Step 4 — Generate the Study Report
- Navigate to **Study Report** → **Generate**.
- The report includes:
  - Literary + Historical context
  - Structural breakdown
  - Key words
  - Theological themes
  - Interpretive challenges
  - Canonical connections
  - Practical implications

### Step 5 — Generate the Sermon Outline
- Go to **Outlines** → **Generate**.
- You’ll get 3 options; select or edit one.
- The outline uses the **Study Report** as grounding.

### Step 5b — Use Parallel Translations + Context
- In **Scripture**, set **Context Range** to expand around a verse.
- Add multiple translations (e.g., `KJV,WEB`) for side-by-side comparison.
- Book/History/Culture/Timeline panels render from local datasets.

### Step 6 — Generate Supporting Content
Use the remaining tabs as needed:

- **Manuscript**: Full sermon manuscript from the selected outline.
- **Applications**: Practical applications by audience type.
- **Questions**: Discussion questions for groups.
- **Illustrations**: Story/illustration ideas.
- **Citations**: Verse-backed claims; validate with **Validate**.

### Step 7 — Theological Lens
- Set the lens in the workspace (e.g., Devotional, Pastoral, Academic).
- This influences the tone of study reports and outlines.

### Step 7 — Validate Citations
- Go to **Citations** → **Validate**.
- Any verses that can’t be verified are flagged.

### Step 8 — Export / Copy
- Copy sermon text from **Manuscript** or **Outline** sections.
- Save the workspace for future reference.

---

## 3) What’s Implemented vs Pending

For a detailed gap list vs the enhancements spec, see:
- `docs/feature-status.md`

---

## 4) Tips for Best Results

- Use **specific main passages** (e.g., `John 3:16-18`).
- Add **sermon goals** to improve applications.
- Generate the **Study Report first**, then outlines, then manuscript.
- Keep cross references + word study datasets installed for richer study tools.
