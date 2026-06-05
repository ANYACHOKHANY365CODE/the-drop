const axios = require('axios');

const client = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; TheDrop/1.0)',
    'Accept': 'application/json, text/html, */*'
  }
});

// ── USD/INR — open.er-api.com (free, no key needed) ──────────
async function fetchForex() {
  try {
    const r = await client.get('https://open.er-api.com/v6/latest/USD');
    if (r.data.result !== 'success') throw new Error('bad response');
    return { usd_inr: r.data.rates.INR?.toFixed(2) };
  } catch { return null; }
}

// ── Sensex, Nifty 50, Nifty Bank — Yahoo Finance (free, no key) ─
async function fetchIndices() {
  try {
    const [bse, nse, bank] = await Promise.all([
      client.get('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d&range=1d'),
      client.get('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=1d'),
      client.get('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEBANK?interval=1d&range=1d'),
    ]);
    const sp = bse.data.chart.result[0].meta.regularMarketPrice;
    const sc = bse.data.chart.result[0].meta.previousClose;
    const np = nse.data.chart.result[0].meta.regularMarketPrice;
    const nc = nse.data.chart.result[0].meta.previousClose;
    const bp = bank.data.chart.result[0].meta.regularMarketPrice;
    const sd = ((sp-sc)/sc*100).toFixed(2);
    const nd = ((np-nc)/nc*100).toFixed(2);
    return {
      sensex: Math.round(sp).toLocaleString('en-IN'), sensex_change: sd, sensex_up: parseFloat(sd)>=0,
      nifty50: Math.round(np).toLocaleString('en-IN'), nifty_change: nd, nifty_up: parseFloat(nd)>=0,
      nifty_bank: Math.round(bp).toLocaleString('en-IN'),
    };
  } catch { return null; }
}

// ── Gold 24K/22K per gram in INR — Yahoo Finance GC=F (free) ──
// GC=F = Gold futures USD/troy oz. 1 troy oz = 31.1035 grams
async function fetchGold(usdInr) {
  try {
    const r = await client.get('https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1d');
    const oz = r.data.chart.result[0].meta.regularMarketPrice;
    const rate = usdInr ? parseFloat(usdInr) : 84;
    const g24 = (oz / 31.1035) * rate;
    return { gold_24k_g: Math.round(g24), gold_22k_g: Math.round(g24 * 0.916) };
  } catch { return null; }
}

// ── Crude Oil WTI — Yahoo Finance CL=F (free, no key) ────────
async function fetchCrude() {
  try {
    const r = await client.get('https://query1.finance.yahoo.com/v8/finance/chart/CL%3DF?interval=1d&range=1d');
    const p = r.data.chart.result[0].meta.regularMarketPrice;
    const c = r.data.chart.result[0].meta.previousClose;
    const chg = ((p-c)/c*100).toFixed(2);
    return { crude_usd: p.toFixed(2), crude_change: chg, crude_up: parseFloat(chg)>=0 };
  } catch { return null; }
}

// ── RBI Policy Rates (static — updated at MPC meetings ~every 2 months) ──
// Source: rbi.org.in — last MPC meeting: June 2026
function getRBIRates() {
  return {
    repo_rate: '6.25%', reverse_repo: '6.00%',
    bank_rate: '6.50%', crr: '4.00%', slr: '18.00%',
    repo_date: 'Jun 2026',
  };
}

// ── Master fetch — called only on user refresh ────────────────
async function fetchAllRates() {
  console.log('💰 Fetching market rates on demand...');
  const forex = await fetchForex().catch(()=>null);
  const [indices, gold, crude] = await Promise.allSettled([
    fetchIndices(),
    fetchGold(forex?.usd_inr),
    fetchCrude(),
  ]);
  const rates = {
    ...getRBIRates(),
    fetchedAt: new Date().toISOString(),
    forex,
    indices: indices.status==='fulfilled' ? indices.value : null,
    metals:  gold.status==='fulfilled'    ? gold.value    : null,
    crude:   crude.status==='fulfilled'   ? crude.value   : null,
  };
  console.log('💰 Rates done');
  return rates;
}

module.exports = { fetchAllRates };
