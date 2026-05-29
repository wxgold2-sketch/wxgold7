#!/bin/bash

echo "🌍 ========== أسعار الذهب العالمية =========="
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "%-4s %-15s %-15s %-10s\n" "كود" "الدولة" "جرام 24" "عملة"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# دول الخليج
for code in SA AE KW QA BH OM; do
  data=$(curl -s "http://localhost:3000/api/v1/gold/$code")
  name=$(echo "$data" | grep -o '"country_name":"[^"]*"' | cut -d'"' -f4)
  price=$(echo "$data" | grep -o '"gram_24":{"buy":[0-9.]*' | grep -o '[0-9.]*$')
  currency=$(echo "$data" | grep -o '"currency":"[^"]*"' | cut -d'"' -f4)
  printf "%-4s %-15s %-15s %-10s\n" "$code" "$name" "$price" "$currency"
done

echo ""
echo "🌍 دول الشام والعراق:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for code in SY LB JO IQ PS; do
  data=$(curl -s "http://localhost:3000/api/v1/gold/$code")
  name=$(echo "$data" | grep -o '"country_name":"[^"]*"' | cut -d'"' -f4)
  price=$(echo "$data" | grep -o '"gram_24":{"buy":[0-9.]*' | grep -o '[0-9.]*$')
  currency=$(echo "$data" | grep -o '"currency":"[^"]*"' | cut -d'"' -f4)
  printf "%-4s %-15s %-15s %-10s\n" "$code" "$name" "$price" "$currency"
done

echo ""
echo "🌍 شمال أفريقيا:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for code in EG MA DZ TN LY SD; do
  data=$(curl -s "http://localhost:3000/api/v1/gold/$code")
  name=$(echo "$data" | grep -o '"country_name":"[^"]*"' | cut -d'"' -f4)
  price=$(echo "$data" | grep -o '"gram_24":{"buy":[0-9.]*' | grep -o '[0-9.]*$')
  currency=$(echo "$data" | grep -o '"currency":"[^"]*"' | cut -d'"' -f4)
  printf "%-4s %-15s %-15s %-10s\n" "$code" "$name" "$price" "$currency"
done

echo ""
echo "🌍 أسيا والمحيط الهادئ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for code in TR IN PK CN JP KR AU SG TH; do
  data=$(curl -s "http://localhost:3000/api/v1/gold/$code")
  name=$(echo "$data" | grep -o '"country_name":"[^"]*"' | cut -d'"' -f4)
  price=$(echo "$data" | grep -o '"gram_24":{"buy":[0-9.]*' | grep -o '[0-9.]*$')
  currency=$(echo "$data" | grep -o '"currency":"[^"]*"' | cut -d'"' -f4)
  printf "%-4s %-15s %-15s %-10s\n" "$code" "$name" "$price" "$currency"
done

echo ""
echo "🌍 أوروبا وأمريكا:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for code in GB DE FR IT ES RU US CA BR; do
  data=$(curl -s "http://localhost:3000/api/v1/gold/$code")
  name=$(echo "$data" | grep -o '"country_name":"[^"]*"' | cut -d'"' -f4)
  price=$(echo "$data" | grep -o '"gram_24":{"buy":[0-9.]*' | grep -o '[0-9.]*$')
  currency=$(echo "$data" | grep -o '"currency":"[^"]*"' | cut -d'"' -f4)
  printf "%-4s %-15s %-15s %-10s\n" "$code" "$name" "$price" "$currency"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 آخر تحديث: $(date)"
echo "✅ السيرفر: $(curl -s http://localhost:3000/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
