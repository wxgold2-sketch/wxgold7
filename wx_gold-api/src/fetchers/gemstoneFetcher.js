const gemstones = require('../../data/gemstones.json');

function getGemstonePrices(gemstone, grade, size) {
  const gem = gemstones[gemstone];
  if (!gem) return null;

  const gradeInfo = gem.grades[grade];
  if (!gradeInfo) return null;

  const basePrice = gradeInfo.price_per_carat;
  const totalPrice = basePrice * size;

  return {
    gemstone: gem.name,
    gemstone_arabic: gem.name,
    grade: grade,
    grade_name: gradeInfo.name,
    size_carat: size,
    unit: gem.unit,
    price_per_carat_usd: basePrice,
    total_price_usd: totalPrice
  };
}

function getAllGemstones(size = 1) {
  const result = [];
  for (let [key, gem] of Object.entries(gemstones)) {
    for (let [grade, info] of Object.entries(gem.grades)) {
      result.push({
        gemstone: key,
        name: gem.name,
        grade,
        grade_name: info.name,
        size_carat: size,
        price_per_carat_usd: info.price_per_carat,
        total_price_usd: info.price_per_carat * size
      });
    }
  }
  return result;
}

function getGemstoneTypes() {
  return Object.entries(gemstones).map(([key, val]) => ({
    id: key,
    name: val.name,
    unit: val.unit,
    available_grades: Object.keys(val.grades),
    available_sizes: val.sizes
  }));
}

module.exports = { getGemstonePrices, getAllGemstones, getGemstoneTypes };
