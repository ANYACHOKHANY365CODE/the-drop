# 🔥 The Drop — Final Build with Full Article Scraping

## Cost: ₹0/month. No API keys. Pure RSS + HTML scraping.

## What it does
- Scrapes RSS feeds → gets all headlines from last 24h
- For non-paywalled sources: fetches and stores the FULL article text
- For paywalled sources (Bloomberg, Economist): RSS snippet + link to site
- Tap any story → read the full article right in the app (no redirect needed)
- "full" green badge = complete article available in app
- "paywalled" badge = snippet only, tap to go to site

## Sources
**Full article scraping (free):**
Firstpost · TOI · The Hindu · Deccan Chronicle · India Today · WION ·
MoneyControl · Outlook · Economic Times · CNBC TV18 · Business Today ·
Business Standard · Financial Express · NDTV Profit · Zee Business ·
Inc42 · LiveMint · MarketWatch · Yahoo Finance · Reuters · BBC · CNN ·
Forbes · Fortune

**Snippet + link (paywalled):**
Bloomberg · The Economist

## Deploy on Render (free)
1. Push to GitHub
2. render.com → New Web Service → connect repo
3. Build: `npm install` | Start: `node server.js`
4. No env vars needed
5. Get URL → Add to Home Screen as PWA

## Note on scraping
Full article scraping works for most articles but may occasionally fail if:
- A site updates their HTML structure
- Anti-bot measures kick in temporarily
- The article is behind a soft paywall

In those cases the app falls back to the RSS snippet automatically.
