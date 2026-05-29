const https = require('https');

class TelegramBot {
  constructor(token) {
    this.token = token || process.env.TELEGRAM_BOT_TOKEN;
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    this.subscribers = new Set();
  }

  // إرسال رسالة
  async sendMessage(chatId, text) {
    if (!this.token) return null;
    
    const data = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    return new Promise((resolve, reject) => {
      const req = https.request(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  // تنسيق رسالة الذهب
  formatGoldMessage(countryName, prices, currency) {
    return `🏆 <b>سعر الذهب في ${countryName}</b>\n\n` +
      `🥇 أوقية: <b>$${prices.ounce_usd}</b>\n` +
      `💰 عيار 24: <b>${prices.gold_24} ${currency}</b>\n` +
      `💰 عيار 21: <b>${prices.gold_21} ${currency}</b>\n` +
      `💰 عيار 18: <b>${prices.gold_18} ${currency}</b>\n\n` +
      `🕐 ${new Date().toLocaleTimeString('ar-EG')}\n` +
      `⚡ WX Gold API`;
  }

  // تنسيق رسالة المصنعية
  formatFeesMessage(country, fees) {
    let msg = `🏪 <b>المصنعية والضرائب - ${fees.country}</b>\n\n`;
    msg += `📊 <b>المصنعية لكل جرام:</b>\n`;
    for (let [k, v] of Object.entries(fees.making_fee_per_gram)) {
      msg += `  • ${k}: ${v}\n`;
    }
    msg += `\n💸 <b>الضريبة:</b> ${(fees.tax_rate * 100).toFixed(0)}%\n`;
    return msg;
  }

  // إرسال تنبيه سعر
  async sendPriceAlert(chatId, metal, price, targetPrice, condition) {
    const emoji = condition === 'above' ? '🔺' : '🔻';
    const text = `${emoji} <b>تنبيه سعر!</b>\n\n` +
      `سعر ${metal} وصل إلى <b>${price}</b>\n` +
      `الهدف: ${targetPrice} (${condition === 'above' ? 'فوق' : 'تحت'})\n` +
      `🕐 ${new Date().toLocaleTimeString('ar-EG')}`;
    
    return this.sendMessage(chatId, text);
  }

  // إرسال تقرير يومي
  async sendDailyReport(chatId, data) {
    const text = `📊 <b>التقرير اليومي للذهب</b>\n\n` +
      `📅 ${new Date().toLocaleDateString('ar-EG')}\n` +
      `🥇 أعلى سعر: $${data.high}\n` +
      `📉 أقل سعر: $${data.low}\n` +
      `📊 متوسط: $${data.avg}\n` +
      `🔄 عدد التحديثات: ${data.updates}\n\n` +
      `⚡ WX Gold API`;
    
    return this.sendMessage(chatId, text);
  }
}

module.exports = TelegramBot;
