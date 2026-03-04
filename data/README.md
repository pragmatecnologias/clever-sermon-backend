# Scripture Dataset Samples

This folder contains minimal sample datasets you can use for local testing.

## Files

- `sample-cross-references.txt`
  - Line-delimited: `SOURCE_VERSE TARGET_VERSE`
  - Verse format: `BOOK.CHAPTER.VERSE`
- `sample-word-study.tsv`
  - Tab-separated values (TSV) source format.
- `sample-word-study.json`
  - JSON format consumed by `WORD_STUDY_DATA_PATH`.

## Quick Start

```bash
# Update .env
CROSS_REFERENCES_PATH=./data/sample-cross-references.txt
WORD_STUDY_DATA_PATH=./data/sample-word-study.json
```

## Conversion Scripts

```bash
# Cross references: normalize a txt file into SOURCE TARGET lines
npx ts-node scripts/convert-cross-references.ts <input.txt> <output.txt>

# Word study: convert TSV to JSON
npx ts-node scripts/convert-word-study.ts <input.tsv> <output.json>
```
