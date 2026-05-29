module.exports = {
  success: (m) => console.log('✅ ' + m),
  error: (m) => console.error('❌ ' + m),
  warn: (m) => console.warn('⚠️ ' + m),
  info: (m) => console.log('ℹ️ ' + m)
};
