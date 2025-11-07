# Talbiya - Forum v7.1 (Production)
- واجهة متجاوبة + روابط مناطق خاصة (?region=ID).
- بيانات كل منطقة في `data/` (JSON منفصل لكل منطقة).
- fallback لشعار الإمارة مع شعارات افتراضية لكل المناطق.
- لوحة إدارة `admin.html` لتصدير/معاينة/استبدال بيانات JSON.
- Service Worker للتخزين المؤقت الأساسي.
- تحسينات وصول وSEO مختصرة.

## النشر
1) ارفع المجلد على GitHub Pages.
2) استبدل شعارات الإمارات داخل `assets/emirates/` بنفس الأسماء.
3) عدّل بيانات أي منطقة عبر `data/<region>.json`.
4) رابط خاص لأي منطقة: `index.html?region=riyadh`.

## هيكل JSON
{ "meta":{"id":"riyadh","name":"منطقة الرياض"}, "date":"...", "venue":"...", "about":"...", "topics":[...], "speakers":[...], "partners":[...] }
