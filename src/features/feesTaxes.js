const feesData = require('../../data/fees_taxes.json');
const { fetchGoldPrice } = require('../fetchers/goldFetcher');
const { fetchForexRate } = require('../fetchers/forexFetcher');
const { calculatePrices } = require('../core/calculator');

function calculateFinalPrice(countryCode, karat, gramPrice, weightGrams = 1) {
    const data = feesData[countryCode] || feesData['DEFAULT'];
    
    const makingFeePerGram = data.making_fee_per_gram[karat] || 50;
    const taxRate = data.tax_rate || 0.10;
    const additionalFees = data.additional_fees || {};
    const parallel = data.parallel_market || { active: false, premium_percent: 0 };
    
    // سعر الذهب الخام
    const rawGoldPrice = gramPrice * weightGrams;
    
    // المصنعية
    const makingFee = makingFeePerGram * weightGrams;
    
    // المجموع قبل الضريبة
    const subtotal = rawGoldPrice + makingFee;
    
    // الضريبة
    const tax = subtotal * taxRate;
    
    // رسوم إضافية
    const extraFees = Object.values(additionalFees).reduce((sum, fee) => sum + fee, 0);
    
    // السعر الرسمي
    const officialPrice = subtotal + tax + extraFees;
    
    // السوق الموازي
    let parallelPrice = null;
    let parallelDetails = null;
    
    if (parallel.active) {
        const premium = parallel.premium_percent / 100;
        const parallelGramPrice = gramPrice * (1 + premium);
        const parallelRawGold = parallelGramPrice * weightGrams;
        const parallelSubtotal = parallelRawGold + makingFee;
        const parallelTax = parallelSubtotal * taxRate;
        parallelPrice = parallelSubtotal + parallelTax + extraFees;
        parallelDetails = {
            active: true,
            premium_percent: parallel.premium_percent,
            description: parallel.description,
            parallel_gram_price: +parallelGramPrice.toFixed(2),
            parallel_final_price: +parallelPrice.toFixed(2),
            difference: +(parallelPrice - officialPrice).toFixed(2),
            difference_percent: +((parallelPrice - officialPrice) / officialPrice * 100).toFixed(1)
        };
    }
    
    const result = {
        country: data.country,
        karat,
        weight_grams: weightGrams,
        raw_gold_price: +rawGoldPrice.toFixed(2),
        making_fee: +makingFee.toFixed(2),
        making_fee_per_gram: makingFeePerGram,
        subtotal: +subtotal.toFixed(2),
        tax_rate: taxRate,
        tax_amount: +tax.toFixed(2),
        additional_fees: additionalFees,
        extra_fees_total: extraFees,
        official_price: +officialPrice.toFixed(2),
        currency: 'local'
    };
    
    if (parallelDetails) {
        result.parallel_market = parallelDetails;
    }
    
    return result;
}

function getMakingFees(countryCode) {
    const data = feesData[countryCode] || feesData['DEFAULT'];
    return {
        country: data.country,
        making_fee_per_gram: data.making_fee_per_gram,
        tax_rate: data.tax_rate,
        additional_fees: data.additional_fees,
        parallel_market: data.parallel_market || { active: false, premium_percent: 0 }
    };
}

function getParallelMarket(countryCode) {
    const data = feesData[countryCode] || feesData['DEFAULT'];
    const parallel = data.parallel_market || { active: false, premium_percent: 0 };
    
    return {
        country: data.country,
        active: parallel.active,
        premium_percent: parallel.premium_percent,
        description: parallel.description || `فارق ${parallel.premium_percent}% بين الرسمي والموازي`,
        gram_price: parallel.gram_price || "يُحسب تلقائياً مع سعر الذهب الحالي",
        official_price_reference: parallel.official_price_reference || "استخدم /api/v1/gold/" + countryCode
    };
}

module.exports = { calculateFinalPrice, getMakingFees, getParallelMarket };
