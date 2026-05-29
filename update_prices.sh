#!/bin/bash

echo "🔧 تعديل الأسعار الحية..."
echo ""

# سعر الأونصة العالمي (غيره حسب السعر الحقيقي)
echo "أدخل سعر أونصة الذهب بالدولار (حالياً: 4500):"
read gold_ounce

# سعر دولار الصاغة في مصر
echo "أدخل سعر الدولار في مصر (حالياً: 53.48):"
read dollar_egp

# تعديل السيرفر مباشرة
sed -i "s/livePrices.gold.usd = .*/livePrices.gold.usd = $gold_ounce;/" ~/wx_gold-api/server.js
sed -i "s/EGP: .*,/EGP: $dollar_egp,/" ~/wx_gold-api/server.js

# إعادة تشغيل السيرفر
pkill -f "node server"
sleep 2
cd ~/wx_gold-api
nohup node server.js > server.log 2>&1 &
echo $! > server.pid

sleep 3

echo ""
echo "✅ تم التحديث! الأسعار الجديدة:"
curl -s http://localhost:3000/api/v1/gold/EG | python3 -c "
import sys, json
data = json.load(sys.stdin)
p = data['prices']
print(f'عيار 24: شراء {p[\"gold_24\"][\"buy\"]} | بيع {p[\"gold_24\"][\"sell\"]}')
print(f'عيار 21: شراء {p[\"gold_21\"][\"buy\"]} | بيع {p[\"gold_21\"][\"sell\"]}')
print(f'عيار 18: شراء {p[\"gold_18\"][\"buy\"]} | بيع {p[\"gold_18\"][\"sell\"]}')
print(f'الجنيه الذهب: شراء {p[\"gold_pound_8g\"][\"buy\"]} | بيع {p[\"gold_pound_8g\"][\"sell\"]}')
print(f'الأونصة: \${data[\"ounce_usd\"]}')
"
