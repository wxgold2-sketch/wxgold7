const METALS = {
    gold: { name: 'الذهب', symbol: 'Au' },
    silver: { name: 'الفضة', symbol: 'Ag' },
    platinum: { name: 'البلاتين', symbol: 'Pt' },
    palladium: { name: 'البلاديوم', symbol: 'Pd' }
};

function calculatePrices(ounceUSD, forexRate) {
    const ounceLocal = ounceUSD * forexRate;
    const gram = ounceLocal / 31.1035;  // سعر جرام عيار 24
    
    return {
        ounce_usd: +ounceUSD.toFixed(2),
        ounce_local: +ounceLocal.toFixed(2),
        gold_24: +gram.toFixed(2),                          // 24 قيراط (100% ذهب)
        gold_22: +(gram * 0.9167).toFixed(2),               // 22 قيراط (91.67%)
        gold_21: +(gram * 0.875).toFixed(2),                // 21 قيراط (87.5%)
        gold_18: +(gram * 0.75).toFixed(2),                 // 18 قيراط (75%)
        gold_14: +(gram * 0.5833).toFixed(2),               // 14 قيراط (58.33%)
        gold_10: +(gram * 0.4167).toFixed(2),               // 10 قيراط (41.67%)
        gold_pound_8g: +(gram * 0.875 * 8).toFixed(2),      // ✅ الجنيه الذهب = 8 جرام عيار 21
        gold_kilo: +(gram * 1000).toFixed(2)                // كيلو الذهب (عيار 24)
    };
}

module.exports = { METALS, calculatePrices };
