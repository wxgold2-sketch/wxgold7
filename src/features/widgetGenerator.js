function generateWidget(code, name) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>سعر الذهب - ${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#1a1a2e;display:flex;justify-content:center;align-items:center;min-height:100vh}
.widget{background:linear-gradient(145deg,#ffd700,#ffaa00);border-radius:20px;padding:25px;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(255,215,0,.3);text-align:center}
.widget h2{color:#1a1a2e;margin-bottom:20px}
.price-box{background:rgba(26,26,46,.9);border-radius:15px;padding:20px;margin:10px 0}
.price-box .value{color:#fff;font-size:36px;font-weight:bold}
.price-box .label{color:#aaa;font-size:14px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px}
.karat{background:rgba(255,255,255,.1);border-radius:10px;padding:12px}
.karat .k{color:#ffd700;font-size:14px}
.karat .p{color:#fff;font-size:16px;font-weight:bold}
.footer{margin-top:15px;color:#1a1a2e;font-size:12px}
</style></head>
<body>
<div class="widget">
<h2>🏆 الذهب في ${name}</h2>
<div class="price-box"><div class="value" id="ounce">--</div><div class="label">دولار/أوقية</div></div>
<div class="grid">
<div class="karat"><div class="k">عيار 24</div><div class="p" id="k24">--</div></div>
<div class="karat"><div class="k">عيار 21</div><div class="p" id="k21">--</div></div>
<div class="karat"><div class="k">عيار 18</div><div class="p" id="k18">--</div></div>
</div>
<div class="footer">⚡ WX Gold API | تحديث مباشر</div>
</div>
<script>
async function update(){
try{const r=await fetch('https://wx-gold-api.vercel.app/api/v1/gold/${code}');const d=await r.json();
document.getElementById('ounce').textContent='$'+d.prices.ounce_usd;
document.getElementById('k24').textContent=d.prices.gold_24;
document.getElementById('k21').textContent=d.prices.gold_21;
document.getElementById('k18').textContent=d.prices.gold_18;
}catch(e){}
}
update();setInterval(update,15000);
</script></body></html>`;
}

module.exports = { generateWidget };
