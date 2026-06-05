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

// ── Scrape full article text — universal approach ─────────────
// Tries site-specific selector first, falls back to smart paragraph extraction
async function scrapeArticle(url, selector) {
  try {
    const { data } = await axiosClient.get(url);
    const $ = cheerio.load(data);

    // Remove all noise
    $('script, style, nav, header, footer, .ad, .advertisement, .ads, .adsbygoogle, ' +
      '.social-share, .social-media, .share-buttons, .related, .related-stories, ' +
      '.newsletter, .subscribe, .subscription, .paywall, .comments, .comment-section, ' +
      'aside, .sidebar, .widget, .promo, .banner, .popup, .modal, ' +
      '.breadcrumb, .tags, .author-bio, .read-more, .more-stories, ' +
      'figure, figcaption, .image-caption, .photo-caption, ' +
      'noscript, iframe, [class*="ad-"], [id*="ad-"], [class*="promo"]').remove();

    // Step 1 — try provided selector
    if (selector) {
      const selectors = selector.split(',').map(s => s.trim());
      for (const sel of selectors) {
        const el = $(sel).first();
        if (el.length) {
          const text = el.text().replace(/\s+/g, ' ').trim();
          if (text.length > 300) return text.slice(0, 4000);
        }
      }
    }

    // Step 2 — try common universal selectors used by most news sites
    const universalSelectors = [
      'article .content', 'article .body', '.article-body', '.article-content',
      '.story-body', '.story-content', '.story-detail', '.story-details',
      '.post-content', '.post-body', '.entry-content',
      '[itemprop="articleBody"]', '[data-module="ArticleBody"]',
      '.content-area', '.main-content', '.news-content',
      '.detail-content', '.article__body', '.article__content',
      '.text-content', '.body-content', '.page-content',
      // NDTV specific
      '.sp-cn', '.ins_storybody', '.article__content',
      // The Hindu specific
      '.articlebodycontent', '._s30J',
      // India Today specific
      '.jsx-story-content', '.storyDetails',
      // Firstpost specific
      '.article-full-content', '.story-box',
      // MoneyControl specific
      '.arti-flow', '.article_wrapper',
      // Economic Times specific
      '.artText', '.article_content',
      // Business Standard specific
      '#storycontent', '.storyPage',
      // Business Today specific
      '.storyContent', '.story-with-summary',
      // Deccan Chronicle specific
      '.story-details', '#content-details',
      // Outlook specific
      '.story-description', '.article-description',
      // Generic fallbacks
      'main article', '.main article', '#main article',
      'article', '.content p'
    ];

    for (const sel of universalSelectors) {
      try {
        const el = $(sel).first();
        if (el.length) {
          const text = el.text().replace(/\s+/g, ' ').trim();
          if (text.length > 300) return text.slice(0, 4000);
        }
      } catch { continue; }
    }

    // Step 3 — universal paragraph harvest (works on almost any site)
    // Collect all <p> tags with substantial text, score them by location
    const paragraphs = [];
    $('p').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      // Only keep paragraphs that look like article content
      if (text.length > 60 &&
          !text.toLowerCase().includes('cookie') &&
          !text.toLowerCase().includes('subscribe') &&
          !text.toLowerCase().includes('sign up') &&
          !text.toLowerCase().includes('advertisement') &&
          !text.toLowerCase().includes('follow us')) {
        paragraphs.push(text);
      }
    });

    if (paragraphs.length >= 3) {
      return paragraphs.slice(0, 20).join(' ').slice(0, 4000);
    }

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
