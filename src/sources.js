module.exports = [

  // ── FIRSTPOST (updated to new feed URLs) ──────────────────
  { name:'Firstpost',               url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/home.xml',          cat:'india',   paywall:false, selector:'div.article-full-content, div.story-box, div.article-body, div.post-content' },
  { name:'Firstpost World',         url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/world.xml',         cat:'world',   paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },
  { name:'Firstpost Politics',      url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/politics.xml',      cat:'india',   paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },
  { name:'Firstpost Tech',          url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/tech.xml',          cat:'tech',    paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },
  { name:'Firstpost Business',      url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/business.xml',      cat:'biz',     paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },
  { name:'Firstpost Sports',        url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/sports.xml',        cat:'sports',  paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },
  { name:'Firstpost Entertainment', url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/entertainment.xml', cat:'pop',     paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },
  { name:'Firstpost Health',        url:'https://www.firstpost.com/commonfeeds/v1/eng/rss/health.xml',        cat:'health',  paywall:false, selector:'div.article-full-content, div.story-box, div.article-body' },

  // ── THE HINDU (verified working) ──────────────────────────
  { name:'The Hindu',               url:'https://www.thehindu.com/feeder/default.rss',                        cat:'india',   paywall:false, selector:'div.article, div[itemprop="articleBody"], div.articlebodycontent' },
  { name:'The Hindu National',      url:'https://www.thehindu.com/news/national/feeder/default.rss',          cat:'india',   paywall:false, selector:'div.article, div[itemprop="articleBody"]' },
  { name:'The Hindu International', url:'https://www.thehindu.com/news/international/feeder/default.rss',     cat:'world',   paywall:false, selector:'div.article, div[itemprop="articleBody"]' },
  { name:'The Hindu Business',      url:'https://www.thehindu.com/business/feeder/default.rss',               cat:'biz',     paywall:false, selector:'div.article, div[itemprop="articleBody"]' },
  { name:'The Hindu Sport',         url:'https://www.thehindu.com/sport/feeder/default.rss',                  cat:'sports',  paywall:false, selector:'div.article, div[itemprop="articleBody"]' },
  { name:'The Hindu Science',       url:'https://www.thehindu.com/sci-tech/science/feeder/default.rss',       cat:'tech',    paywall:false, selector:'div.article, div[itemprop="articleBody"]' },

  // ── INDIA TODAY (verified working) ────────────────────────
  { name:'India Today',             url:'https://www.indiatoday.in/rss/home',              cat:'india',   paywall:false, selector:'div.jsx-story-content, div.story-description, div[itemprop="articleBody"]' },
  { name:'India Today World',       url:'https://www.indiatoday.in/rss/world-news',        cat:'world',   paywall:false, selector:'div.jsx-story-content, div.story-description' },
  { name:'India Today Business',    url:'https://www.indiatoday.in/rss/business',          cat:'biz',     paywall:false, selector:'div.jsx-story-content, div.story-description' },
  { name:'India Today Tech',        url:'https://www.indiatoday.in/rss/technology',        cat:'tech',    paywall:false, selector:'div.jsx-story-content, div.story-description' },
  { name:'India Today Sports',      url:'https://www.indiatoday.in/rss/sports',            cat:'sports',  paywall:false, selector:'div.jsx-story-content, div.story-description' },

  // ── DECCAN CHRONICLE (verified working) ───────────────────
  { name:'Deccan Chronicle',        url:'https://www.deccanchronicle.com/rss_feed/',          cat:'india',   paywall:false, selector:'div.story-details, div.article-content, div#content-details' },
  { name:'DC National',             url:'https://www.deccanchronicle.com/nation/rss_feed/',   cat:'india',   paywall:false, selector:'div.story-details, div.article-content' },
  { name:'DC World',                url:'https://www.deccanchronicle.com/world/rss_feed/',    cat:'world',   paywall:false, selector:'div.story-details, div.article-content' },
  { name:'DC Business',             url:'https://www.deccanchronicle.com/business/rss_feed/', cat:'biz',     paywall:false, selector:'div.story-details, div.article-content' },
  { name:'DC Sports',               url:'https://www.deccanchronicle.com/sports/rss_feed/',   cat:'sports',  paywall:false, selector:'div.story-details, div.article-content' },

  // ── NDTV (verified working via feedburner) ────────────────
  { name:'NDTV',                    url:'https://feeds.feedburner.com/ndtvnews-top-stories', cat:'india',   paywall:false, selector:'div.article__content, div.sp-cn, div[itemprop="articleBody"]' },
  { name:'NDTV India',              url:'https://feeds.feedburner.com/ndtvnews-india-news',  cat:'india',   paywall:false, selector:'div.article__content, div.sp-cn' },
  { name:'NDTV World',              url:'https://feeds.feedburner.com/ndtvnews-world-news',  cat:'world',   paywall:false, selector:'div.article__content, div.sp-cn' },
  { name:'NDTV Sports',             url:'https://feeds.feedburner.com/ndtvsports-latest',    cat:'sports',  paywall:false, selector:'div.article__content, div.sp-cn' },
  { name:'NDTV Tech',               url:'https://feeds.feedburner.com/ndtvgadgets-latest',   cat:'tech',    paywall:false, selector:'div.article__content, div.sp-cn' },

  // ── MONEYCONTROL (verified working) ───────────────────────
  { name:'MoneyControl',            url:'https://www.moneycontrol.com/rss/latestnews.xml',    cat:'biz',   paywall:false, selector:'div.article_wrapper, div#article-main-content, div.arti-flow' },
  { name:'MC Markets',              url:'https://www.moneycontrol.com/rss/marketreports.xml', cat:'biz',   paywall:false, selector:'div.article_wrapper, div#article-main-content' },
  { name:'MC Economy',              url:'https://www.moneycontrol.com/rss/economy.xml',       cat:'biz',   paywall:false, selector:'div.article_wrapper, div#article-main-content' },

  // ── OUTLOOK (verified working) ────────────────────────────
  { name:'Outlook India',           url:'https://www.outlookindia.com/rss/main/magazine',     cat:'india', paywall:false, selector:'div.story-description, div.article-content, div[itemprop="articleBody"]' },
  { name:'Outlook Business',        url:'https://www.outlookindia.com/rss/business/magazine', cat:'biz',   paywall:false, selector:'div.story-description, div.article-content' },
  { name:'Outlook Politics',        url:'https://www.outlookindia.com/rss/national/magazine', cat:'india', paywall:false, selector:'div.story-description, div.article-content' },

  // ── ECONOMIC TIMES (verified working) ─────────────────────
  { name:'Economic Times',          url:'https://economictimes.indiatimes.com/rssfeedstopstories.cms',                           cat:'biz',   paywall:false, selector:'div.artText, div[itemprop="articleBody"], div.article_content' },
  { name:'ET Markets',              url:'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',                   cat:'biz',   paywall:false, selector:'div.artText, div[itemprop="articleBody"]' },
  { name:'ET Economy',              url:'https://economictimes.indiatimes.com/news/economy/rssfeeds/20472687.cms',               cat:'biz',   paywall:false, selector:'div.artText, div[itemprop="articleBody"]' },
  { name:'ET Tech',                 url:'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms',                       cat:'tech',  paywall:false, selector:'div.artText, div[itemprop="articleBody"]' },
  { name:'ET Politics',             url:'https://economictimes.indiatimes.com/news/politics-and-nation/rssfeeds/1052732854.cms', cat:'india', paywall:false, selector:'div.artText, div[itemprop="articleBody"]' },
  { name:'ET Startups',             url:'https://economictimes.indiatimes.com/small-biz/startups/rssfeeds/7771250.cms',          cat:'biz',   paywall:false, selector:'div.artText, div[itemprop="articleBody"]' },

  // ── BUSINESS TODAY (verified working) ─────────────────────
  { name:'Business Today',          url:'https://www.businesstoday.in/rss/home',     cat:'biz', paywall:false, selector:'div.storyContent, div.story-with-summary, div[itemprop="articleBody"]' },
  { name:'BT Markets',              url:'https://www.businesstoday.in/rss/markets',  cat:'biz', paywall:false, selector:'div.storyContent, div.story-with-summary' },
  { name:'BT Economy',              url:'https://www.businesstoday.in/rss/economy',  cat:'biz', paywall:false, selector:'div.storyContent, div.story-with-summary' },

  // ── BUSINESS STANDARD (verified working) ──────────────────
  { name:'Business Standard',       url:'https://www.business-standard.com/rss/home_page_top_stories.rss', cat:'biz', paywall:false, selector:'div#storycontent, div.storyPage, div[itemprop="articleBody"]' },
  { name:'BS Markets',              url:'https://www.business-standard.com/rss/markets-106.rss',           cat:'biz', paywall:false, selector:'div#storycontent, div.storyPage' },
  { name:'BS Economy',              url:'https://www.business-standard.com/rss/economy-policy-101.rss',    cat:'biz', paywall:false, selector:'div#storycontent, div.storyPage' },

  // ── REUTERS (feeds.reuters.com DEAD since Mar 2026 — using Google News proxy) ──
  { name:'Reuters',           url:'https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com&ceid=IN:en&hl=en-IN&gl=IN',          cat:'world', paywall:false, selector:'div.article-body__content, div[data-testid="paragraph"]' },
  { name:'Reuters Business',  url:'https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com+business&ceid=IN:en&hl=en-IN&gl=IN', cat:'biz',   paywall:false, selector:'div.article-body__content' },
  { name:'Reuters Tech',      url:'https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com+technology&ceid=IN:en&hl=en-IN&gl=IN',cat:'tech',  paywall:false, selector:'div.article-body__content' },
  { name:'Reuters Health',    url:'https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com+health&ceid=IN:en&hl=en-IN&gl=IN',   cat:'health',paywall:false, selector:'div.article-body__content' },

  // ── BBC (verified working) ─────────────────────────────────
  { name:'BBC News',          url:'https://feeds.bbci.co.uk/news/rss.xml',                          cat:'world',  paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC World',         url:'https://feeds.bbci.co.uk/news/world/rss.xml',                    cat:'world',  paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Asia',          url:'https://feeds.bbci.co.uk/news/world/asia/rss.xml',               cat:'world',  paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Business',      url:'https://feeds.bbci.co.uk/news/business/rss.xml',                 cat:'biz',    paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Tech',          url:'https://feeds.bbci.co.uk/news/technology/rss.xml',               cat:'tech',   paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Health',        url:'https://feeds.bbci.co.uk/news/health/rss.xml',                   cat:'health', paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Science',       url:'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',  cat:'tech',   paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Sport',         url:'https://feeds.bbci.co.uk/sport/rss.xml',                         cat:'sports', paywall:false, selector:'div[data-component="text-block"], article' },
  { name:'BBC Entertainment', url:'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',   cat:'pop',    paywall:false, selector:'div[data-component="text-block"], article' },

  // ── FORBES (verified working, some soft paywall) ──────────
  { name:'Forbes',            url:'https://www.forbes.com/real-time/feed2/',      cat:'biz',   paywall:false, selector:'div.article-body, div.body-container, div[class*="body"]' },
  { name:'Forbes Tech',       url:'https://www.forbes.com/technology/feed/',      cat:'tech',  paywall:false, selector:'div.article-body, div.body-container' },
  { name:'Forbes Asia',       url:'https://www.forbes.com/asia/feed/',            cat:'world', paywall:false, selector:'div.article-body, div.body-container' },

  // ── FORTUNE (verified working, some soft paywall) ─────────
  { name:'Fortune',           url:'https://fortune.com/feed/',                    cat:'biz',  paywall:false, selector:'div.article-body, div[class*="content"]' },
  { name:'Fortune Tech',      url:'https://fortune.com/section/technology/feed/', cat:'tech', paywall:false, selector:'div.article-body, div[class*="content"]' },
];
