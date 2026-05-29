#!/bin/bash

echo "🏆 ========== التقرير الشامل =========="
echo ""

# دول مع سوق موازي
echo "📈 دول السوق الموازي:"
for country in SY LB SD YE IQ IR; do
  response=$(curl -s "http://localhost:3000/api/v1/parallel/$country")
  if echo "$response" | grep -q '"success":true'; then
    parallel_rate=$(echo "$response" | grep -o '"parallel_rate":[0-9.]*' | cut -d: -f2)
    echo "  $country: معدل موازي $parallel_rate%"
  fi
done

echo ""
echo "💰 مصنعية وضرائب:"
for country in EG SA AE KW; do
  response=$(curl -s "http://localhost:3000/api/v1/fees/$country")
  if echo "$response" | grep -q '"success":true'; then
    making_fee=$(echo "$response" | grep -o '"making_fee":[0-9.]*' | cut -d: -f2)
    tax=$(echo "$response" | grep -o '"tax":[0-9.]*' | cut -d: -f2)
    echo "  $country: مصنعية $making_fee% | ضريبة $tax%"
  fi
done

echo ""
echo "💎 أسعار المعادن النفيسة (مصر):"
curl -s http://localhost:3000/api/v1/metals/compare/EG | grep -E '"name"|"ounce_usd"' | head -10

echo ""
echo "🔑 حالة الـ API Keys:"
curl -s http://localhost:3000/admin/stats -H "x-api-key: wx-admin-2024-secret"
