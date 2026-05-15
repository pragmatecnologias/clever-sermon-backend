# Clever Sermon Backend

AI-powered sermon generation and Bible study platform backend API.

## Features

- **Authentication**: JWT-based authentication with admin role
- **Sermon Workspaces**: Create and manage sermon projects
- **AI-Powered Generation**: 
  - Multiple sermon outline options
  - Full manuscript generation
  - Audience-specific applications
  - Discussion questions
- **Scripture Tools**:
  - Multiple Bible translations
  - Cross-references
  - Word studies
  - Scripture search
- **Knowledge Management**: Notes, highlights, and content library
- **Local & Cloud LLM Support**: Configurable AI provider routing

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport JWT
- **Queue**: Bull (Redis)
- **AI**: Local LLM (LM Studio) + OpenAI support

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `LM_STUDIO_URL`: Local LLM endpoint (optional)
- `OPENAI_API_KEY`: OpenAI API key (optional)

Scripture datasets (optional but recommended for full features):
- `BIBLE_API_URL`: API endpoint for api.bible (optional, fallback uses bible-api.com)
- `BIBLE_API_KEY`: API key for api.bible (required if `BIBLE_API_URL` is set)
- `CROSS_REFERENCES_PATH`: Path to a cross-reference dataset (line-delimited)
- `WORD_STUDY_DATA_PATH`: Path to a word study JSON dataset

Dataset file formats:
- `CROSS_REFERENCES_PATH` (line-delimited text):
  ```txt
  JOHN.3.16 ROM.5.8
  JOHN.3.16 1JOHN.4.9
  ROM.8.1 ROM.8.2
  ```
  Each line is `SOURCE_VERSE TARGET_VERSE` with verses in `BOOK.CHAPTER.VERSE` format.
- `WORD_STUDY_DATA_PATH` (JSON):
  ```json
  {
    "agape": {
      "word": "agape",
      "language": "greek",
      "lemma": "ἀγάπη",
      "strongs": "G26",
      "transliteration": "agapē",
      "definition": "self-giving love",
      "examples": ["John 3:16", "1 Corinthians 13:4-7"]
    }
  }
  ```
  The JSON is keyed by the lookup word. Fields may be omitted if unavailable.

Sample datasets and scripts:
- Sample files live in `./data`:
  - `data/sample-cross-references.txt`
  - `data/sample-word-study.json`
  - `data/sample-word-study.tsv`
- Conversion scripts live in `./scripts`:
  ```bash
  npx ts-node scripts/convert-cross-references.ts <input.txt> <output.txt>
  npx ts-node scripts/convert-word-study.ts <input.tsv> <output.json>
  ```
  Download scripts:
  ```bash
  npx ts-node scripts/download-cross-references.ts data/openbible-cross-references.txt
  npx ts-node scripts/download-word-study.ts data/strongs-word-study.json
  ```

## Database Setup

```bash
# Create database schema
npm run schema:create

# Run seed data
npm run seed
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `password123`

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

API will be available at `http://localhost:4001/api/v1`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Workspaces
- `GET /api/v1/workspaces` - List all workspaces
- `POST /api/v1/workspaces` - Create workspace
- `GET /api/v1/workspaces/:id` - Get workspace details
- `PATCH /api/v1/workspaces/:id` - Update workspace
- `DELETE /api/v1/workspaces/:id` - Delete workspace
- `POST /api/v1/workspaces/:id/outlines` - Generate sermon outlines
- `POST /api/v1/workspaces/:id/manuscript` - Generate manuscript
- `POST /api/v1/workspaces/:id/applications` - Generate applications
- `POST /api/v1/workspaces/:id/discussion-questions` - Generate questions

### Scripture
- `GET /api/v1/scripture/passage` - Get Bible passage
- `GET /api/v1/scripture/cross-references` - Get cross-references
- `GET /api/v1/scripture/word-study` - Get word study
- `GET /api/v1/scripture/search` - Search scripture
- `GET /api/v1/scripture/translations` - List translations

## Database Management

```bash
# Drop all tables
npm run schema:drop

# Recreate schema
npm run schema:create

# Reseed data
npm run seed
```

## Development

```bash
# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## Pending Enhancements

- Add automated tests for scripture lookup, cross references, word study, study reports, and citation validation.
- Provide ingestion scripts or sample datasets for cross references and word studies.
- Confirm end-to-end UI flows once datasets and API keys are configured.

## License

MIT
