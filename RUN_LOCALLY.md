# تشغيل الموقع محلياً واختباره — Omar Ali portfolio

الملفات كلها ثابتة (HTML + CSS + JS + صور + ملفَّي PDF). مفيش أي build step، مفيش Node.js، ومفيش أي طلب
لـ API محلي. كل المسارات داخل `index.html` نسبية (`css/...`, `js/...`, `assets/...`) — عشان كده النسخة
بتشتغل من الفولدر مباشرة ومن GitHub Pages تحت `/portfolio/` من غير أي تعديل.

---

## 1) تشغيل محلي

### الطريقة أ — أسرع حاجة (بدون أي حاجة تتثبت)
1. فكّ الضغط عن `portfolio_site.zip` في أي مكان.
2. ادخل الفولدر ودوبل كليك على `index.html` → هيتفتح على `file:///.../index.html`.

> كفاية للتفرّج والتعديل. الحاجة الوحيدة اللي مش هتشتغل بالظبط زي الأونلاين: زرار **نسخ الإيميل** (المتصفح بيقفل
> `navigator.clipboard` على `file://`) — الموقع بيعمل fallback تلقائي بيحدد النص، فده طبيعي مش باج.

### الطريقة ب — سيرفر محلي (هي اللي تشبه النشر الحقيقي)
معاك Python؟ افتح Terminal / CMD داخل الفولدر:

```bash
cd مسار-الفولدر/portfolio_site
python3 -m http.server 8000        # على ويندوز غالباً: python -m http.server 8000
```

ثم افتح: <http://localhost:8000>

ولإيقاف السيرفر: `Ctrl + C`.

لو معاك Node بدل Python:

```bash
npx serve .
```

**ليه الطريقة ب أفضل للاختبار؟** لأن `localhost` بيُعتبر secure context، فزرار النسخ بيتصرف زي
ما هيحصل أونلاين بالظبط.

---

## 2) تشيك ليست الاختبار (5 دقايق)

| # | اعمل إيه | المفروض تشوف إيه |
|---|---|---|
| 1 | الصفحة الأولى | الاسم + سطر `I build …` بيتبدل، وزرار **Download CV** يفتح `assets/Omar_Ali_Frontend_Developer_CV.pdf` |
| 2 | شريط التنقل | كل رابط ينزل بالقسم الصح (About / Skills / Experience / Projects / Certificates / Contact) من غير ما الصفحة تهتز |
| 3 | Skroll | الأرقام `01…06` والـ reveal يظهروا مرة واحدة بس لكل قسم (مش بيختفوا لما ترجع فوق) |
| 4 | قسم Projects | الكروت الـ6؛ زر GitHub وزر Live Demo يفتحوا في تبويب جديد |
| 5 | قسم Certificates | دوس على أي شهادة → صورة كبيرة في نافذة. جرب: `Esc`، الدوس على الخلفية، زرار `×`، ولما تقفل النافذة التركيز يرجع للصف الأول |
| 6 | قسم Contact | زرار **Copy** → تظهر رسالة `Copied → omar65978@gmail.com`. وزرار **Open in Gmail** يفتح صفحة كتابة رسالة مسجّلها `To` و`Subject` |
| 7 | الموبايل | `F12` → أيقونة الجهاز → عرض **320** و**375**: المفروض مفيش أي scroll أفقي خالص، وكارت QUICK FACTS السطر فيه فوق والقيمة تحته |
| 8 | `prefers-reduced-motion` | فعّلها من DevTools → Rendering → *Emulate CSS media feature prefers-reduced-motion* → الأنيميشن يقف والمحتوى كله يبان |
| 9 | Console | `F12` → Console → المفروض **فاضي** (مفيش error أصفر/أحمر) |
| 10 | الشبكة | `F12` → Network → Reload → مفيش طلب راجع `404` (كل الصور والـ PDF موجودة) |

### اختبار من موبايلك على نفس الواي فاي
```bash
python3 -m http.server 8000 --bind 0.0.0.0
ipconfig                     # ويندوز | على mac/linux:  ip get  أو  ifconfig
```
افتح من الموبايل: `http://IP-بتاعك:8000` (زي `http://192.168.1.20:8000`).
الفرق الوحيد المتوقع: `http://` على IP مش context آمن → زرار النسخ هيروح على الـ fallback.

### لو حصل غريب
- **الخطوط شكلها مختلف**: `Space Grotesk` و`JetBrains Mono` بييجوا من Google Fonts → محتاجين إنترنت.
  من غير نت الموقع بيقع على fallback نظيف، وده مقصود ومش باج.
- **تعديل ومش باين**: `Ctrl + F5` (hard refresh) أو فعّل DevTools → Network → *Disable cache*.
- **`python3` مش موجود** (ويندوز): ثبت Python من python.org وعلّم خانة *Add to PATH*، أو استخدم
  `npx serve .` لو Node متثبت.

---

## 3) الرفع على GitHub Pages

### عن طريق الموقع (من غير أوامر)
1. github.com → `+` → **New repository** → الاسم `portfolio` → **Public** → **ما تعلّمش** على ✅ أي README أو .gitignore (عشان مفيش تعارض مع ملفاتك وقت الرفع).
2. في صفحة الريبو: **uploading an existing file** → اسحب كل ملفات الفولدر (بما فيهم `index.html`، `css`، `js`، `assets`، `.nojekyll`، `404.html`) → **Commit changes**.
3. **Settings** → **Pages** → تحت *Build and deployment* اختار **Source: Deploy from a branch** → **`main`** → **`/ (root)`** → **Save**.
   (لو اختارت **GitHub Actions**، الريبو فيه `.github/workflows/pages.yml` بينشر المجلد كله فأهو كفاية.)
4. استنى دقيقة–اتنين، وبعدين: **https://omar65978.github.io/portfolio/**

### أو بالأوامر
```bash
cd فولدر/portfolio_site
git init && git add -A
git commit -m "Portfolio: dark animated single-page site"
git branch -M main
git remote add origin https://github.com/omar65978/portfolio.git
git push -u origin main
```
> لو عايز ترفع النسخة الكاملة اللي فيها أدوات بناء الـ CV كمان (`tools/`)، استخدم `portfolio_no_git.zip`
> بدل `portfolio_site.zip` — الموقع نفسه مش بيتأثر، والملفات دي مش بتتنشر كصفحات.

### ملاحظات مهمة
- `.nojekyll` موجود → GitHub ما بيحاولش يعالج الملفات بـ Jekyll (وده اللي بيخلي `assets/` يوصل صح).
- `404.html` موجود → صفحة الخطأ بتترجع لموقعك مش لصفحة GitHub.
- **الريبو لازم يكون Public** عشان Pages يشتغل على الخطة المجانية.
- أي `git push` بعدها = تحديث تلقائي للموقع خلال ثواني.
- لو حطيت **Custom domain** (زي `omarali.dev`) غيّر روابط `Portfolio:` داخل الـ CV والموقع — الوقتي كل حاجة متظبطة على `/portfolio/`.

---

## 4) الرفع على Vercel

### من GitHub (الأفضل: كل push بيتنشر لوحده)
1. vercel.com → سجّل دخول بحساب GitHub (**Continue with GitHub**).
2. **Add New…** → **Project** → **Import Git Repository** واختار `portfolio` (لو أول مرة اديها صلاحية للريبو).
3. في إعدادات البناء (الموقع static، وده اللي بيقوله Vercel نفسه في الدوكيومينت):
   - **Framework Preset: Other**
   - **Build Command:** فاضي (مفيش build)
   - **Output Directory:** `.` أو سيبها فاضية لو اتحطت `.` لوحدها
   - **Install Command:** فاضي
4. **Deploy** → بعد ثواني يديك لينك زي `portfolio-xxxx.vercel.app`.
5. من **Settings → Domains** تقدر تضيف دوميانك الخاص، أو تغيّر اسم المشروع لـ `omar65978` في بقى
   `omar65978.vercel.app`.

### أو بدون GitHub (رفع الفولدر من التيرمينال)
```bash
npm i -g vercel          # أو: npx vercel
cd فولدر/portfolio_site
vercel --prod
```
بيسألك: اسم المشروع → Enter، اسم الـ scope → Enter، وبعدين يطبع رابط الـ preview ورابط الـ production.

### لو استخدمت Vercel جنب GitHub Pages
الرابطين هيشتغلوا في نفس الوقت — عادي. بس لو عايز SEO نظيف، اختار واحد basic للـ canonical وحط التاني
`noindex`. وقتيا مفيش `<link rel="canonical">` في الصفحة أصلاً، فالاتنين شغالين من غير تعارض.

---

## 5) إعادة بناء ملفَّي الـ CV (لو عدّلت بيانات)
اختياري — محتاج Python + `reportlab` و`pymupdf`:
```bash
pip install reportlab pymupdf
python3 tools/build_cv.py            # النسخة الأساسية (صفحتين)
python3 tools/build_cv_one_page.py   # نسخة الصفحة الواحدة
python3 tools/ats_audit.py           # 33 فحص ATS — المفروض "all green"
```
