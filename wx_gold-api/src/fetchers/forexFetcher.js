const axios = require('axios');
const cache = {};

async function fetchForexRate(currency) {
  if (currency === 'USD') return 1;
  
  const now = Date.now();
  if (cache[currency] && (now - cache[currency].time) < 60000) {
    return cache[currency].rate;
  }
  
  try {
    const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', { timeout: 5000 });
    const rate = res.data.rates[currency];
    if (rate && rate > 0) {
      cache[currency] = { rate, time: now };
      return rate;
    }
  } catch (e) {
    console.log('⚠️ فشل جلب ' + currency);
  }
  
  return cache[currency]?.rate || 1;
}

module.exports = { fetchForexRate };
