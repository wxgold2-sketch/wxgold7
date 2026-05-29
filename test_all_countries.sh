#!/bin/bash

echo "🌍 ========== أسعار الذهب في جميع الدول =========="
echo ""

# قائمة جميع الدول
COUNTRIES=(
  "EG:مصر" "SA:السعودية" "AE:الإمارات" "KW:الكويت" 
  "QA:قطر" "BH:البحرين" "OM:عمان" "JO:الأردن"
  "IQ:العراق" "SY:سوريا" "LB:لبنان" "PS:فلسطين"
  "YE:اليمن" "MA:المغرب" "DZ:الجزائر" "TN:تونس"
  "LY:ليبيا" "SD:السودان" "TR:تركيا" "IR:إيران"
  "IN:الهند" "PK:باكستان" "BD:بنغلاديش" "ID:إندونيسيا"
  "MY:ماليزيا" "CN:الصين" "JP:اليابان" "KR:كوريا الجنوبية"
  "GB:بريطانيا" "DE:ألمانيا" "FR:فرنسا" "IT:إيطاليا"
  "ES:إسبانيا" "RU:روسيا" "US:أمريكا" "CA:كندا"
  "BR:البرازيل" "ZA:جنوب أفريقيا" "NG:نيجيريا" "AU:أستراليا"
  "SG:سنغافورة" "TH:تايلاند" "PH:الفلبين"
)

for country_info in "${COUNTRIES[@]}"; do
  IFS=':' read -r code name <<< "$country_info"
  
  # جلب البيانات
  response=$(curl -s "http://localhost:3000/api/v1/gold/$code")
  
  # استخراج السعر
  if echo "$response" | grep -q '"success":true'; then
    gram_24=$(echo "$response" | grep -o '"gram_24":{"buy":[^,]*' | head -1 | cut -d: -f2)
    currency=$(echo "$response" | grep -o '"currency":"[^"]*"' | cut -d: -f2 | tr -d '"')
    
    if [ ! -z "$gram_24" ]; then
      printf "🇧🇭 %-15s %-10s جرام 24: %s %s\n" "$name" "($code)" "$gram_24" "$currency"
    else
      printf "⏳ %-15s %-10s جاري التحميل...\n" "$name" "($code)"
    fi
  else
    printf "❌ %-15s %-10s فشل\n" "$name" "($code)"
  fi
done

echo ""
echo "📊 ========== ملخص =========="
echo "✅ الدول الناجحة: $(curl -s http://localhost:3000/ | grep -o '"countries":[0-9]*' | cut -d: -f2)"
echo "🕐 وقت التحديث: $(date)"
