require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const WebSocket = require('ws');

const { countries } = require('./src/config/countries');
const { METALS, calculatePrices } = require('./src/core/calculator');
const { fetchGoldPrice, fetchAllMetals, fetchMetalPrice } = require('./src/fetchers/goldFetcher');
const { fetchForexRate } = require('./src/fetchers/forexFetcher');
const { calculateFinalPrice, getMakingFees } = require('./src/features/feesTaxes');
const { generateWidget } = require('./src/features/widgetGenerator');
const { getGemstonePrices, getAllGemstones, getGemstoneTypes } = require('./src/fetchers/gemstoneFetcher');
const logger = require('./src/utils/logger');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/', rateLimit({ windowMs: 60000, max: 60, message: { error: 'طلبات كثيرة' } }));

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'connected', message: 'WX Gold API' }));
});

// 🏠 الرئيسية
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: '🏆 WX Gold API',
    version: '4.0.0',
    countries: Object.keys(countries).length,
    metals: Object.keys(METALS),
    gemstones: true,
    status: '🚀 Live',
    endpoints: {
      gold: '/api/v1/gold/:country',
      compare: '/api/v1/metals/compare/:country',
      gemstones: '/api/v1/gemstones',
      health: '/health',
      widget: '/api/v1/widget/:country'
    }
  });
});

// ❤️ صحة
app.get('/health', (req, res) => {
  res.json({ success: true, status: '🟢', time: new Date().toISOString() });
});

// 🥇 ذهب - دولة
app.get('/api/v1/gold/:country', async (req, res) => {
  try {
    const code = req.params.country.toUpperCase();
    const country = countries[code];
    if (!country) return res.status(404).json({ success: false, error: 'دولة غير مدعومة' });

    const cacheKey = 'gold_' + code;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const [ouncePrice, forexRate] = await Promise.all([
      fetchGoldPrice(),
      fetchForexRate(country.currency)
    ]);

    const prices = calculatePrices(ouncePrice, forexRate);

    const result = {
      success: true,
      metal: 'gold',
      metal_name: 'الذهب',
      symbol: 'Au',
      country: code,
      country_name: country.name,
      currency: country.currency,
      prices,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 10000);
    res.json(result);

  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 📊 مقارنة المعادن
app.get('/api/v1/metals/compare/:country', async (req, res) => {
  try {
    const code = req.params.country.toUpperCase();
    const country = countries[code];
    if (!country) return res.status(404).json({ success: false, error: 'دولة غير مدعومة' });

    const metals = await fetchAllMetals();
    const rate = await fetchForexRate(country.currency);

    const result = { success: true, country: code, country_name: country.name, currency: country.currency, metals: {} };

    for (let [name, info] of Object.entries(METALS)) {
      const p = calculatePrices(metals[name], rate);
      result.metals[name] = {
        name: info.name,
        symbol: info.symbol,
        ounce_usd: metals[name],
        ounce_local: p.ounce_local,
        gram_24: p.gold_24
      };
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 💎 أنواع الأحجار
app.get('/api/v1/gemstones', (req, res) => {
  res.json({ success: true, gemstones: getGemstoneTypes() });
});

// 💎 سعر حجر
app.get('/api/v1/gemstones/:gemstone', (req, res) => {
  const { gemstone } = req.params;
  const { grade, size } = req.query;

  if (!grade || !size) {
    return res.json({
      success: true,
      gemstone,
      prices: getAllGemstones(parseFloat(size) || 1).filter(g => g.gemstone === gemstone)
    });
  }

  const price = getGemstonePrices(gemstone, grade, parseFloat(size));
  if (!price) {
    return res.status(404).json({ success: false, error: 'حجر أو درجة غير موجودة' });
  }

  res.json({ success: true, ...price });
});

// 💎 كل الأحجار
app.get('/api/v1/gemstones/all/:size', (req, res) => {
  const size = parseFloat(req.params.size) || 1;
  res.json({
    success: true,
    size_carat: size,
    total: getAllGemstones(size).length,
    prices: getAllGemstones(size)
  });
});

// 🎨 ويدجت
app.get('/api/v1/widget/:country', (req, res) => {
  const code = req.params.country.toUpperCase();
  const country = countries[code];
  if (!country) return res.status(404).json({ success: false, error: 'دولة غير مدعومة' });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(generateWidget(code, country.name));
});

// 404
app.use((req, res) => res.status(404).json({ error: 'المسار غير موجود' }));

// 🚀 تشغيل
server.listen(PORT, () => {
  console.log('🏆 WX Gold API v4.0.0 | http://localhost:' + PORT);
  console.log('💎 أحجار كريمة | 🥇 معادن | 🌍 43 دولة');
  logger.success('جاهز 🚀');
});
