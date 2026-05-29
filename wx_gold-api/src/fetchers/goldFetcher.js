const axios = require('axios');

const prices = {
  gold: 4456,
  silver: 74.60,
  platinum: 980,
  palladium: 1050
};

// نجيب سعر الذهب الحقيقي من كذا مصدر
async function fetchRealGoldPrice() {
  // المصادر الحقيقية للذهب (XAU/USD)
  const sources = [
    async () => {
      // GoldPrice.org
      try {
        const res = await axios.get('https://data-asg.goldprice.org/dbXRates/USD', {
          timeout: 5000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10)' }
        });
        const price = res.data?.items?.[0]?.xauPrice;
        if (price > 2000) return parseFloat(price);
      } catch (e) {}
      return null;
    },
    async () => {
      // PAXG من Binance (احتياطي)
      try {
        const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
          params: { symbol: 'PAXGUSDT' },
          timeout: 5000
        });
        const price = parseFloat(res.data.price);
        if (price > 2000) return price * 1.03; // تصحيح 3% للذهب الحقيقي
      } catch (e) {}
      return null;
    }
  ];

  for (let source of sources) {
    const price = await source();
    if (price) {
      prices.gold = price;
      console.log('🥇 ذهب حقيقي:', price);
      return price;
    }
  }
  
  return prices.gold;
}

// نجيب الفضة من Binance
async function fetchSilverPrice() {
  try {
    const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
      params: { symbol: 'XAGUSDT' },
      timeout: 5000
    });
    const price = parseFloat(res.data.price);
    if (price > 10) {
      prices.silver = price;
      console.log('🥈 فضة:', price);
    }
  } catch (e) {}
}

// تحديث كل 10 ثواني
async function updatePrices() {
  await Promise.all([
    fetchRealGoldPrice(),
    fetchSilverPrice()
  ]);
}

setInterval(updatePrices, 10000);
updatePrices();

console.log('⚡ نظام الأسعار الحية شغال (ذهب حقيقي + فضة)');

async function fetchGoldPrice() {
  return prices.gold;
}

async function fetchMetalPrice(metal) {
  return prices[metal] || 100;
}

async function fetchAllMetals() {
  return { ...prices };
}

module.exports = { fetchGoldPrice, fetchMetalPrice, fetchAllMetals };
