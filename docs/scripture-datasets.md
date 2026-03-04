# Scripture Datasets & Ingestion Guide

This document explains what the scripture datasets are, why they exist, how the backend uses them, and how to create or import your own data.

## What are these datasets?

The backend supports **local datasets** for two features:

1. **Cross References**: A list of related verses for a given verse.
2. **Word Studies**: Definitions and metadata for original-language words (Greek/Hebrew).

When these datasets are provided, the API can return richer data **without** relying on external services. If they are missing, the API still works, but returns **empty** results for cross references and word studies.

## Where the backend uses them

The datasets are loaded by `ScriptureService`:

- `CROSS_REFERENCES_PATH` → `getCrossReferences()`
- `WORD_STUDY_DATA_PATH` → `getWordStudy()`

These endpoints are used by the frontend study tools:

- `GET /api/v1/scripture/cross-references?verse=...`
- `GET /api/v1/scripture/word-study?word=...&language=...`

## Required environment variables

Add these to `.env`:

```bash
CROSS_REFERENCES_PATH=./data/sample-cross-references.txt
WORD_STUDY_DATA_PATH=./data/sample-word-study.json
```

Paths are resolved from the backend project root.

## Dataset formats

### 1) Cross References (line-delimited)

A text file with **one relationship per line**:

```txt
JOHN.3.16 ROM.5.8
JOHN.3.16 1JOHN.4.9
ROM.8.1 ROM.8.2
```

Format per line:

```
SOURCE_VERSE TARGET_VERSE
```

Both verses use the `BOOK.CHAPTER.VERSE` format. The service builds an in-memory map from this list.

### 2) Word Studies (JSON)

A JSON object keyed by word:

```json
{
  "agape": {
    "word": "agape",
    "language": "greek",
    "lemma": "agape",
    "strongs": "G26",
    "transliteration": "agapē",
    "definition": "self-giving love",
    "examples": ["John 3:16", "1 Corinthians 13:4-7"],
    "usageCount": 116,
    "partOfSpeech": "noun"
  }
}
```

Only `word` and `language` are required. Other fields are optional.

## Sample files included

These are provided for local testing:

- `data/sample-cross-references.txt`
- `data/sample-word-study.json`
- `data/sample-word-study.tsv` (source format for conversion)

## Automated downloads (recommended)

You can pull real public-domain datasets with the scripts below. These produce
files that match the formats expected by the backend.

```bash
# Download OpenBible cross references
npx ts-node scripts/download-cross-references.ts data/openbible-cross-references.txt

# Download Strong's dictionary data (Greek + Hebrew) and convert to JSON
npx ts-node scripts/download-word-study.ts data/strongs-word-study.json

# Download public-domain book metadata
npx ts-node scripts/download-book-metadata.ts data/book-metadata.json

# Download geography (OpenBible, CC-BY)
npx ts-node scripts/download-geography.ts data/geography.json
```

Then point your `.env` to the generated files:

```bash
CROSS_REFERENCES_PATH=./data/openbible-cross-references.txt
WORD_STUDY_DATA_PATH=./data/strongs-word-study.json
BOOK_METADATA_PATH=./data/book-metadata.json
GEOGRAPHY_PATH=./data/geography.json
```

## How to import your own data

### Cross references

If your data is already in `SOURCE TARGET` per line format, you can point `CROSS_REFERENCES_PATH` directly to it.

If you need to normalize your input, use the converter script:

```bash
npx ts-node scripts/convert-cross-references.ts <input.txt> <output.txt>
```

This script:
- trims whitespace
- normalizes commas/semicolons to spaces
- keeps the first two verse tokens per line

### Word studies

If you have data in TSV format, use the converter:

```bash
npx ts-node scripts/convert-word-study.ts <input.tsv> <output.json>
```

The TSV columns should include:

```
word	language	lemma	strongs	transliteration	definition	examples	usageCount	partOfSpeech
```

`examples` should be a semicolon-separated list (e.g. `John 3:16;Hebrews 4:12`).

### Word occurrences

We expect a JSON map keyed by word, with total counts and verse lists:

```json
{
  "agape": { "count": 116, "verses": ["John 3:16", "1 Corinthians 13:4"] }
}
```

If you have TSV data, convert it with:

```bash
npx ts-node scripts/convert-word-occurrences.ts <input.tsv> <output.json>
```

### Cross reference categories

We expect a JSON map keyed by `SOURCE|TARGET` with a category slug:

```json
{
  "John.3.16|Rom.5.8": "thematic_echo",
  "John.3.16|1John.4.9": "direct_quotation"
}
```

Categories supported in the UI:
`parallel_narrative`, `prophetic_fulfillment`, `thematic_echo`, `law_gospel`, `typology`, `direct_quotation`.

## Data sources + licensing

| Dataset | Source | License | Notes |
| --- | --- | --- | --- |
| Cross references | OpenBible (cross-references.txt / zip) | CC-BY | Download script included |
| Strong’s dictionary | Open Scriptures (strongsgreek.dat / strongshebrew.dat) | Public domain + GPL3 | Download script included |
| Book metadata | jpoehls/bible-metadata Books.csv | Public domain | Download script included |
| Geography | openbible.info geo merged.txt | CC-BY | Download script included |
| Historical/Cultural/Timeline | (no public dataset bundled) | — | Needs curated data |
| Word occurrences | (no public dataset bundled) | — | Provide TSV/JSON |
| Cross-reference categories | (no public dataset bundled) | — | Provide JSON mapping |

## Gaps that need curated data

Historical context, cultural context, and timeline datasets are not publicly packaged in a single authoritative source. If you have a preferred dataset, I can add a converter. Otherwise we can:

1. **Curate a starter dataset** for all 66 books (manual or AI-assisted).
2. **Integrate third-party data** (if licensed) and normalize it into the JSON formats above.
3. **Use data.world or Airtable datasets** (requires account + API access).

## Notes on Strong's data

The Strong's dictionary files are public domain (1890) and provided by
Open Scriptures. The downloader script keeps the basic word/definition
content but does not include usage examples (those can be added later).

## Common questions

### Do I need these datasets?

Only if you want **local** word study and cross-reference results. Without them, the endpoints return empty lists but the rest of the system still works.

### Why not use a remote API for these?

Many cross-reference and lexicon datasets are licensed or rate-limited. The local approach keeps you in control and works offline.

### Can I change the formats?

Yes, but then you’ll need to update `ScriptureService.loadCrossReferences()` or `loadWordStudyIndex()` to match the new format.

## Quick start checklist

1. Copy the sample files or add your own.
2. Set `CROSS_REFERENCES_PATH` and `WORD_STUDY_DATA_PATH` in `.env`.
3. Restart the backend.
4. Use the workspace UI → Scripture tools to verify results.
