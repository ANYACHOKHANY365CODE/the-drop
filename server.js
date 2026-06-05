require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const path = require('path');
const { scrapeAll } = require('./src/scraper');
const { fetchAllRates } = require('./src/rates');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── News cache ────────────────────────────────────────────────
const newsCache = { grouped: null, generatedAt: null, total: 0, isRefreshing: false };

// ── Rates cache — only refreshed on user request ──────────────
const ratesCache = { data: null, fetchedAt: null };

// ── Refresh news ──────────────────────────────────────────────
async function refreshNews() {
  if (newsCache.isRefreshing) return;
  newsCache.isRefreshing = true;
  try {
    const { grouped, total } = await scrapeAll();
    newsCache.grouped = grouped;
    newsCache.total = total;
    newsCache.generatedAt = new Date();
    console.log(`✅ News cache updated — ${total} stories at ${newsCache.generatedAt.toLocaleTimeString('en-IN')}`);
  } catch (err) {
    console.error('News refresh error:', err.message);
    throw err;
  } finally {
    newsCache.isRefreshing = false;
  }
}

// ── Refresh rates ─────────────────────────────────────────────
async function refreshRates() {
  try {
    ratesCache.data = await fetchAllRates();
    ratesCache.fetchedAt = new Date();
  } catch (err) {
    console.error('Rates refresh error:', err.message);
  }
}

// ── API: News ─────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  const force = req.query.refresh === 'true';
  const ageHours = newsCache.generatedAt
    ? (Date.now() - newsCache.generatedAt.getTime()) / 3600000 : 999;
  try {
    if (newsCache.grouped && !force && ageHours < 12) {
      return res.json({ success:true, grouped:newsCache.grouped, total:newsCache.total, generatedAt:newsCache.generatedAt, fromCache:true });
    }
    await refreshNews();
    res.json({ success:true, grouped:newsCache.grouped, total:newsCache.total, generatedAt:newsCache.generatedAt, fromCache:false });
  } catch (err) {
    if (newsCache.grouped) {
      return res.json({ success:true, grouped:newsCache.grouped, total:newsCache.total, generatedAt:newsCache.generatedAt, fromCache:true, warning:`Couldn't refresh — showing last edition` });
    }
    res.status(500).json({ success:false, error:err.message });
  }
});

// ── API: Rates — fetch fresh on every request ─────────────────
app.get('/api/rates', async (req, res) => {
  try {
    await refreshRates();
    res.json({ success:true, rates:ratesCache.data, fetchedAt:ratesCache.fetchedAt });
  } catch (err) {
    // Serve stale cache if available
    if (ratesCache.data) {
      return res.json({ success:true, rates:ratesCache.data, fetchedAt:ratesCache.fetchedAt, warning:'Using last known rates' });
    }
    res.status(500).json({ success:false, error:err.message });
  }
});

// ── API: Health ───────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  news: { total: newsCache.total, ageMin: newsCache.generatedAt ? Math.round((Date.now()-newsCache.generatedAt.getTime())/60000) : null },
  rates: { fetchedAt: ratesCache.fetchedAt }
}));

// ── Cron: 7am IST (01:30 UTC) — news only ────────────────────
cron.schedule('30 1 * * *', () => {
  console.log('⏰ 7am IST — morning news refresh');
  refreshNews().catch(console.error);
}, { timezone: 'Asia/Kolkata' });

// ── Frontend ──────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🔥 The Drop on :${PORT}`);
  console.log(`📡 Sources: Firstpost, The Hindu, India Today, Deccan Chronicle, NDTV, MoneyControl, Outlook, Economic Times, Business Today, Business Standard, Reuters, BBC, Forbes, Fortune`);
  console.log(`💰 Rates: Yahoo Finance (Sensex, Nifty, Gold, Crude) + ExchangeRate-API (USD/INR) — fetched on demand only`);
  // Load both on startup
  await refreshNews().catch(e => console.error('Startup news failed:', e.message));
  await refreshRates().catch(e => console.error('Startup rates failed:', e.message));
});
