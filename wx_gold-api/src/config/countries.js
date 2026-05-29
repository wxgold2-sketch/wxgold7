const countries = {
  EG: { name: 'مصر', currency: 'EGP', continent: 'MIDDLE_EAST' },
  SA: { name: 'السعودية', currency: 'SAR', continent: 'MIDDLE_EAST' },
  AE: { name: 'الإمارات', currency: 'AED', continent: 'MIDDLE_EAST' },
  KW: { name: 'الكويت', currency: 'KWD', continent: 'MIDDLE_EAST' },
  QA: { name: 'قطر', currency: 'QAR', continent: 'MIDDLE_EAST' },
  BH: { name: 'البحرين', currency: 'BHD', continent: 'MIDDLE_EAST' },
  OM: { name: 'عمان', currency: 'OMR', continent: 'MIDDLE_EAST' },
  JO: { name: 'الأردن', currency: 'JOD', continent: 'MIDDLE_EAST' },
  IQ: { name: 'العراق', currency: 'IQD', continent: 'MIDDLE_EAST' },
  LB: { name: 'لبنان', currency: 'LBP', continent: 'MIDDLE_EAST' },
  SY: { name: 'سوريا', currency: 'SYP', continent: 'MIDDLE_EAST' },
  PS: { name: 'فلسطين', currency: 'ILS', continent: 'MIDDLE_EAST' },
  TR: { name: 'تركيا', currency: 'TRY', continent: 'MIDDLE_EAST' },
  IR: { name: 'إيران', currency: 'IRR', continent: 'MIDDLE_EAST' },
  DZ: { name: 'الجزائر', currency: 'DZD', continent: 'AFRICA' },
  MA: { name: 'المغرب', currency: 'MAD', continent: 'AFRICA' },
  TN: { name: 'تونس', currency: 'TND', continent: 'AFRICA' },
  LY: { name: 'ليبيا', currency: 'LYD', continent: 'AFRICA' },
  SD: { name: 'السودان', currency: 'SDG', continent: 'AFRICA' },
  NG: { name: 'نيجيريا', currency: 'NGN', continent: 'AFRICA' },
  ZA: { name: 'جنوب أفريقيا', currency: 'ZAR', continent: 'AFRICA' },
  KE: { name: 'كينيا', currency: 'KES', continent: 'AFRICA' },
  GH: { name: 'غانا', currency: 'GHS', continent: 'AFRICA' },
  ET: { name: 'إثيوبيا', currency: 'ETB', continent: 'AFRICA' },
  GB: { name: 'بريطانيا', currency: 'GBP', continent: 'EUROPE' },
  DE: { name: 'ألمانيا', currency: 'EUR', continent: 'EUROPE' },
  FR: { name: 'فرنسا', currency: 'EUR', continent: 'EUROPE' },
  IT: { name: 'إيطاليا', currency: 'EUR', continent: 'EUROPE' },
  ES: { name: 'إسبانيا', currency: 'EUR', continent: 'EUROPE' },
  CH: { name: 'سويسرا', currency: 'CHF', continent: 'EUROPE' },
  RU: { name: 'روسيا', currency: 'RUB', continent: 'EUROPE' },
  UA: { name: 'أوكرانيا', currency: 'UAH', continent: 'EUROPE' },
  US: { name: 'أمريكا', currency: 'USD', continent: 'AMERICAS' },
  CA: { name: 'كندا', currency: 'CAD', continent: 'AMERICAS' },
  MX: { name: 'المكسيك', currency: 'MXN', continent: 'AMERICAS' },
  BR: { name: 'البرازيل', currency: 'BRL', continent: 'AMERICAS' },
  AR: { name: 'الأرجنتين', currency: 'ARS', continent: 'AMERICAS' },
  CN: { name: 'الصين', currency: 'CNY', continent: 'ASIA' },
  JP: { name: 'اليابان', currency: 'JPY', continent: 'ASIA' },
  KR: { name: 'كوريا الجنوبية', currency: 'KRW', continent: 'ASIA' },
  IN: { name: 'الهند', currency: 'INR', continent: 'ASIA' },
  PK: { name: 'باكستان', currency: 'PKR', continent: 'ASIA' },
  AU: { name: 'أستراليا', currency: 'AUD', continent: 'ASIA' }
};

function getContinentCountries(continent) {
  const result = {};
  for (let [code, c] of Object.entries(countries)) {
    if (c.continent === continent) result[code] = c;
  }
  return result;
}

function getTotalCountries() {
  return Object.keys(countries).length;
}

module.exports = { countries, getContinentCountries, getTotalCountries };
