const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const sources = require('./sources');

const rssParser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; TheDrop/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});

const axiosClient = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache'
  }
});

// ── Scrape full article text from URL ─────────────────────────
async function scrapeArticle(url, selector) {
  try {
    const { data } = await axiosClient.get(url);
    const $ = cheerio.load(data);

    // Remove noise elements
    $('script, style, nav, header, footer, .ad, .advertisement, .social-share, .related-stories, .newsletter, .subscribe, .paywall, .comments, aside, .sidebar').remove();

    // Try each selector
    const selectors = selector.split(',').map(s => s.trim());
    for (const sel of selectors) {
      const el = $(sel);
      if (el.length) {
        const text = el.text()
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ')
          .trim();
        if (text.length > 200) return text.slice(0, 3000); // Cap at 3000 chars
      }
    }

    // Fallback: grab all paragraph text
    const paras = [];
    $('article p, main p, .content p').each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 40) paras.push(t);
    });
    if (paras.length) return paras.join(' ').slice(0, 3000);

    return null;
  } catch {
    return null;
  }
}

// ── Fetch one RSS feed ────────────────────────────────────────
async function fetchFeed(source) {
  try {
    const feed = await rssParser.parseURL(source.url);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return feed.items
      .filter(item => {
        if (!item.title || item.title.trim().length < 8) return false;
        if (item.pubDate || item.isoDate) {
          const pub = new Date(item.pubDate || item.isoDate).getTime();
          if (!isNaN(pub) && pub < cutoff) return false;
        }
        return true;
      })
      .slice(0, 10)
      .map(item => ({
        id: Buffer.from((item.link || item.title || '').slice(0, 80))
          .toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
        title: (item.title || '').trim()
          .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
          .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
          .replace(/<[^>]*>/g, ''),
        rss_summary: (item.contentSnippet || item.summary || '')
          .replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ').trim().slice(0, 500),
        link: item.link || '',
        source: source.name,
        cat: source.cat,
        paywall: source.paywall || false,
        selector: source.selector || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        fullText: null // will be populated later for non-paywalled
      }));
  } catch {
    return [];
  }
}

// ── Deduplicate ───────────────────────────────────────────────
function deduplicate(stories) {
  const seen = new Set();
  return stories.filter(s => {
    const norm = s.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ').filter(w => w.length > 3)
      .slice(0, 7).join(' ');
    if (seen.has(norm) || norm.length < 8) return false;
    seen.add(norm);
    return true;
  });
}

// ── Group by category, sort newest first ─────────────────────
function groupByCategory(stories) {
  const groups = { world:[], india:[], tech:[], biz:[], climate:[], health:[], sports:[], pop:[] };
  for (const s of stories) {
    const cat = s.cat || 'world';
    (groups[cat] || groups.world).push(s);
  }
  for (const cat of Object.keys(groups)) {
    groups[cat].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }
  return groups;
}

// ── Full article fetch in batches (non-paywalled only) ────────
async function enrichWithFullText(stories) {
  const toEnrich = stories.filter(s => !s.paywall && s.link && s.selector);
  console.log(`📄 Fetching full articles for ${toEnrich.length} non-paywalled stories...`);

  const BATCH = 10;
  for (let i = 0; i < toEnrich.length; i += BATCH) {
    const batch = toEnrich.slice(i, i + BATCH);
    await Promise.all(batch.map(async s => {
      s.fullText = await scrapeArticle(s.link, s.selector);
    }));
    if (i + BATCH < toEnrich.length) await new Promise(r => setTimeout(r, 500));
  }

  const enriched = toEnrich.filter(s => s.fullText).length;
  console.log(`✅ Full text fetched: ${enriched}/${toEnrich.length} stories`);
  return stories;
}

// ── Main scrape ───────────────────────────────────────────────
async function scrapeAll() {
  console.log(`📡 Scraping ${sources.length} feeds...`);
  const t = Date.now();
  const results = [];

  // Fetch all RSS feeds in parallel batches
  for (let i = 0; i < sources.length; i += 15) {
    const batch = sources.slice(i, i + 15);
    const res = await Promise.all(batch.map(fetchFeed));
    results.push(...res.flat());
    if (i + 15 < sources.length) await new Promise(r => setTimeout(r, 150));
  }

  const unique = deduplicate(results);
  console.log(`📰 ${unique.length} unique stories from RSS`);

  // Enrich non-paywalled stories with full article text
  const enriched = await enrichWithFullText(unique);

  const grouped = groupByCategory(enriched);
  const total = unique.length;
  const elapsed = ((Date.now() - t) / 1000).toFixed(1);

  console.log(`🔥 Done in ${elapsed}s — ${total} stories total`);
  Object.entries(grouped).forEach(([c, a]) => { if (a.length) console.log(`   ${c}: ${a.length}`); });

  return { grouped, total };
}

module.exports = { scrapeAll };
