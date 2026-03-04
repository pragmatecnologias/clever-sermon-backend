# API.Bible Integration Setup

## Step 1: Add Your API Key

Your `.env` file is currently open. Please update line 17 with your actual API key from https://scripture.api.bible/admin

```bash
BIBLE_API_KEY=your_actual_api_key_here
```

## Step 2: Verify the API URL

Make sure line 18 has the correct API.Bible endpoint:

```bash
BIBLE_API_URL=https://rest.api.bible/v1
```

## Step 3: Test the Integration

Once you've added your API key, run:

```bash
node test-api-bible.js
```

This will:
- Fetch your authorized Bibles (NKJV, NASB 2020, NBLA)
- Get their Bible IDs for database configuration
- Test passage retrieval
- Test search functionality

## Expected Output

You should see:
```
✓ Found X Bibles
Your authorized Bibles:
  ✓ NKJV: New King James Version (ID: ...)
  ✓ NASB: New American Standard Bible 2020 (ID: ...)
  ✓ NBLA: Nueva Biblia de las Américas (ID: ...)
```

## Next Steps

After successful testing, I will:
1. Update the backend to use the correct API.Bible endpoints
2. Add your three Bibles to the database
3. Update the frontend to show NKJV, NASB2020, and NBLA options
4. Implement API.Bible features like search and cross-references

## API.Bible Documentation

- Base URL: `https://rest.api.bible/v1`
- Authentication: Header `api-key: YOUR_KEY`
- Endpoints:
  - `/bibles` - List available Bibles
  - `/bibles/{bibleId}/passages/{passageId}` - Get passage
  - `/bibles/{bibleId}/search?query=...` - Search
  - `/bibles/{bibleId}/verses/{verseId}` - Get specific verse

## Rate Limits

- Free tier: 5,000 requests/day
- Max 500 consecutive verses per request
