const METALS = {
  gold: { name: 'الذهب', symbol: 'Au' },
  silver: { name: 'الفضة', symbol: 'Ag' },
  platinum: { name: 'البلاتين', symbol: 'Pt' },
  palladium: { name: 'البلاديوم', symbol: 'Pd' }
};

function calculatePrices(ounceUSD, forexRate) {
  const ounceLocal = ounceUSD * forexRate;
  const gram = ounceLocal / 31.1035;
  
  return {
    ounce_usd: +ounceUSD.toFixed(2),
    ounce_local: +ounceLocal.toFixed(2),
    gold_24: +gram.toFixed(2),
    gold_22: +(gram * 0.9167).toFixed(2),
    gold_21: +(gram * 0.875).toFixed(2),
    gold_18: +(gram * 0.75).toFixed(2),
    gold_14: +(gram * 0.5833).toFixed(2),
    gold_10: +(gram * 0.4167).toFixed(2),
    gold_pound_8g: +(gram * 8).toFixed(2),
    gold_kilo: +(gram * 1000).toFixed(2)
  };
}

module.exports = { METALS, calculatePrices };
