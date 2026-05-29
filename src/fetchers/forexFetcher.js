const axios = require('axios');

// كل العملات المدعومة
const SUPPORTED_CURRENCIES = {
    'EGP': 53.48, 'SAR': 3.75, 'AED': 3.67, 'KWD': 0.31, 'QAR': 3.64,
    'BHD': 0.376, 'OMR': 0.385, 'JOD': 0.709, 'IQD': 1310, 'SYP': 13000,
    'LBP': 89500, 'ILS': 3.65, 'YER': 250, 'LYD': 4.85, 'TND': 3.05,
    'DZD': 134, 'MAD': 9.85, 'SDG': 600, 'MRO': 360, 'SOS': 570,
    'TRY': 30.5, 'IRR': 42000, 'PKR': 278, 'INR': 83, 'BDT': 110,
    'IDR': 15700, 'MYR': 4.65, 'CNY': 7.25, 'JPY': 150, 'KRW': 1320,
    'THB': 35.5, 'VND': 24500, 'PHP': 56, 'SGD': 1.33, 'HKD': 7.82,
    'TWD': 31.5, 'USD': 1, 'GBP': 0.78, 'EUR': 0.92, 'CHF': 0.88,
    'SEK': 10.5, 'NOK': 10.7, 'RUB': 90, 'BRL': 5.1, 'ZAR': 18.5,
    'NGN': 800, 'KES': 130, 'GHS': 12, 'ETB': 56, 'AUD': 1.5, 'CAD': 1.35
};

let cachedRates = { ...SUPPORTED_CURRENCIES };
let lastUpdate = 0;

async function fetchAllForexRates() {
    const now = Date.now();
    if (now - lastUpdate < 300000) return cachedRates; // 5 دقائق كاش
    
    const sources = [
        async () => {
            try {
                const res = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 5000 });
                if (res.data?.rates) return res.data.rates;
            } catch (e) {}
            return null;
        },
        async () => {
            try {
                const res = await axios.get('https://www.floatrates.com/daily/usd.json', { timeout: 5000 });
                const rates = {};
                for (let [key, val] of Object.entries(res.data)) {
                    rates[key.toUpperCase()] = val.rate;
                }
                rates['USD'] = 1;
                if (Object.keys(rates).length > 10) return rates;
            } catch (e) {}
            return null;
        }
    ];
    
    for (let source of sources) {
        const rates = await source();
        if (rates && rates['EGP']) {
            // تحديث كل العملات المدعومة
            for (let currency of Object.keys(SUPPORTED_CURRENCIES)) {
                if (rates[currency]) {
                    cachedRates[currency] = rates[currency];
                }
            }
            lastUpdate = now;
            console.log('💱 تحديث أسعار صرف', Object.keys(cachedRates).length, 'عملة');
            break;
        }
    }
    
    return cachedRates;
}

async function fetchForexRate(currency = 'EGP') {
    const rates = await fetchAllForexRates();
    return rates[currency] || SUPPORTED_CURRENCIES[currency] || 1;
}

// تحديث كل 5 دقائق
setInterval(fetchAllForexRates, 300000);
fetchAllForexRates();

module.exports = { fetchForexRate, fetchAllForexRates, SUPPORTED_CURRENCIES };
