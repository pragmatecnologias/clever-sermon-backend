# Scripture Dataset Scripts

These scripts help normalize and convert datasets to the formats expected by the scripture service.

## Download book metadata (public domain)

```bash
npx ts-node scripts/download-book-metadata.ts data/book-metadata.json
```

## Download geography (OpenBible, CC-BY)

```bash
npx ts-node scripts/download-geography.ts data/geography.json
```

## Download historical context (BradyStephenson BibleData-Book)

```bash
npx ts-node scripts/download-historical-context.ts data/historical-context.json
```

## Download cultural context (BradyStephenson BibleData-Book + Place)

```bash
npx ts-node scripts/download-cultural-context.ts data/cultural-context.json
```

## Download timeline events (BradyStephenson BibleData-Event)

```bash
npx ts-node scripts/download-timeline.ts data/timeline.json
```

## Download word occurrences (KJV JSON)

```bash
npx ts-node scripts/download-word-occurrences.ts data/word-occurrences.json
```

## Generate cross-reference categories

```bash
npx ts-node scripts/download-cross-reference-categories.ts data/openbible-cross-references.txt data/cross-reference-categories.json
```

## Convert word occurrences TSV to JSON

```bash
npx ts-node scripts/convert-word-occurrences.ts <input.tsv> <output.json>
```

## Convert word study TSV to JSON

```bash
npx ts-node scripts/convert-word-study.ts <input.tsv> <output.json>
```

## Download Strong's word study data (Greek + Hebrew)

```bash
npx ts-node scripts/download-word-study.ts <output.json>
```

## Convert cross references to line-delimited format

```bash
npx ts-node scripts/convert-cross-references.ts <input.txt> <output.txt>
```

## Download OpenBible cross references

```bash
npx ts-node scripts/download-cross-references.ts <output.txt>
```
