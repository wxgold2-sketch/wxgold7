const express = require('express');
const router = express.Router();

const ADMIN_KEY = 'wx-admin-2024-secret';

// Middleware للتحقق
router.use((req, res, next) => {
  if (req.headers['x-api-key'] !== ADMIN_KEY) {
    return res.status(403).json({ error: 'غير مصرح' });
  }
  next();
});

// إحصائيات
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      countries: 43,
      totalKeys: 0,
      totalRequests: 0,
      uptime: Math.floor(process.uptime())
    }
  });
});

// عرض المفاتيح
router.get('/keys', (req, res) => {
  res.json({ success: true, keys: [] });
});

// إنشاء مفتاح
router.post('/keys/create', (req, res) => {
  const { plan = 'pro', name = 'مستخدم' } = req.body;
  const key = 'wx-' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  res.json({
    success: true,
    key: { key, plan, name, createdAt: new Date().toISOString() }
  });
});

module.exports = router;
