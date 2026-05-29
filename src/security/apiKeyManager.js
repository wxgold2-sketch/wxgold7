const crypto = require('crypto');

class APIKeyManager {
  constructor() {
    this.keys = new Map();
    this.usage = new Map();
    
    // خطط التسعير
    this.plans = {
      free: { limit: 100, features: ['gold', 'metals', 'gemstones'], name: 'مجاني' },
      basic: { limit: 10000, features: ['gold', 'metals', 'gemstones', 'fees', 'parallel'], name: 'أساسي' },
      pro: { limit: 100000, features: ['gold', 'metals', 'gemstones', 'fees', 'parallel', 'widget', 'calculate'], name: 'برو' },
      enterprise: { limit: 999999, features: ['all'], name: 'مؤسسي' }
    };
  }

  generateKey(plan = 'free', userId = 'user') {
    if (!this.plans[plan]) {
      return { error: 'خطة غير صالحة' };
    }

    const apiKey = 'wx_' + crypto.randomBytes(16).toString('hex');
    const keyData = {
      key: apiKey,
      plan,
      userId,
      createdAt: new Date().toISOString(),
      limit: this.plans[plan].limit,
      features: this.plans[plan].features
    };

    this.keys.set(apiKey, keyData);
    this.usage.set(apiKey, { count: 0, resetAt: this.getNextReset() });

    return keyData;
  }

  validateKey(apiKey) {
    const keyData = this.keys.get(apiKey);
    if (!keyData) return { valid: false, error: 'مفتاح غير صالح' };

    // فحص الاستخدام اليومي
    const usage = this.usage.get(apiKey);
    if (usage) {
      if (Date.now() > usage.resetAt) {
        usage.count = 0;
        usage.resetAt = this.getNextReset();
      }
      if (usage.count >= keyData.limit) {
        return { valid: false, error: 'تجاوزت الحد اليومي' };
      }
      usage.count++;
    }

    return { valid: true, ...keyData };
  }

  getKeyInfo(apiKey) {
    const keyData = this.keys.get(apiKey);
    if (!keyData) return null;

    const usage = this.usage.get(apiKey);
    return {
      ...keyData,
      usage: usage ? usage.count : 0,
      remaining: usage ? keyData.limit - usage.count : keyData.limit
    };
  }

  getUserKeys(userId) {
    const userKeys = [];
    for (let [key, data] of this.keys) {
      if (data.userId === userId) {
        userKeys.push({ ...data, usage: this.usage.get(key)?.count || 0 });
      }
    }
    return userKeys;
  }

  getStats() {
    return {
      total_keys: this.keys.size,
      plans: {
        free: Array.from(this.keys.values()).filter(k => k.plan === 'free').length,
        basic: Array.from(this.keys.values()).filter(k => k.plan === 'basic').length,
        pro: Array.from(this.keys.values()).filter(k => k.plan === 'pro').length,
        enterprise: Array.from(this.keys.values()).filter(k => k.plan === 'enterprise').length
      }
    };
  }

  getNextReset() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }

  // Middleware للاستخدام في Express
  middleware(requiredFeature = 'gold') {
    return (req, res, next) => {
      const apiKey = req.headers['x-api-key'];
      
      // لو مفيش API Key، نسمح بطلبات محدودة
      if (!apiKey) {
        req.apiKey = { plan: 'free', limited: true };
        return next();
      }

      const validation = this.validateKey(apiKey);
      if (!validation.valid) {
        return res.status(403).json({
          success: false,
          error: validation.error,
          get_key: '/api/v1/keys/generate'
        });
      }

      req.apiKey = validation;
      next();
    };
  }
}

module.exports = new APIKeyManager();
