const axios = require('axios');
const { fetchAllForexRates } = require('./forexFetcher');
const { calculatePrices } = require('../core/calculator');

const prices = {
    gold: 4499,
    silver: 130,
    platinum: 980,
    palladium: 1050
};

// كاش لأسعار كل الدول
let allCountriesPrices = {};
let lastCountriesUpdate = 0;

// نجيب سعر الذهب الحقيقي
async function fetchRealGoldPrice() {
    const sources = [
        async () => {
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
            try {
                const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
                    params: { symbol: 'PAXGUSDT' },
                    timeout: 5000
                });
                const price = parseFloat(res.data.price);
                if (price > 2000) return price * 1.03;
            } catch (e) {}
            return null;
        }
    ];

    for (let source of sources) {
        const price = await source();
        if (price) {
            prices.gold = price;
            return price;
        }
    }
    return prices.gold;
}

// تحديث أسعار كل الدول
async function updateAllCountriesPrices() {
    try {
        const goldPrice = await fetchRealGoldPrice();
        const forexRates = await fetchAllForexRates();
        
        for (let [currency, rate] of Object.entries(forexRates)) {
            const calculatedPrices = calculatePrices(goldPrice, rate);
            allCountriesPrices[currency] = {
                gold_price: goldPrice,
                forex_rate: rate,
                prices: calculatedPrices,
                updated_at: Date.now()
            };
        }
        
        lastCountriesUpdate = Date.now();
        console.log('🌍 تحديث أسعار', Object.keys(allCountriesPrices).length, 'دولة');
    } catch (e) {
        console.log('⚠️ فشل تحديث أسعار الدول:', e.message);
    }
}

// نجيب سعر دولة معينة
function getCountryPrices(currency) {
    if (allCountriesPrices[currency]) {
        return allCountriesPrices[currency];
    }
    // لو مش موجود، نحسبها حالاً
    const rate = 1; // fallback
    const calculatedPrices = calculatePrices(prices.gold, rate);
    return {
        gold_price: prices.gold,
        forex_rate: rate,
        prices: calculatedPrices,
        updated_at: Date.now()
    };
}

// تحديث كل 10 ثواني
async function updatePrices() {
    await updateAllCountriesPrices();
}

setInterval(updatePrices, 10000);
updatePrices();

console.log('⚡ نظام الأسعار العالمية شغال - 53 دولة');

async function fetchGoldPrice() {
    return prices.gold;
}

async function fetchMetalPrice(metal) {
    return prices[metal] || 100;
}

async function fetchAllMetals() {
    return { ...prices };
}

module.exports = { 
    fetchGoldPrice, 
    fetchMetalPrice, 
    fetchAllMetals, 
    getCountryPrices,
    updateAllCountriesPrices 
};
