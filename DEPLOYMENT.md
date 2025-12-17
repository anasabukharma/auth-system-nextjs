# دليل النشر - Deployment Guide

## 📦 ما تم إنجازه

✅ **تحويل كامل من EJS إلى Next.js + Express**
- Frontend: Next.js 14 مع TypeScript و TailwindCSS
- Backend: Express.js مع Firebase Admin SDK
- جميع الصفحات محولة إلى React Components
- API integration كامل
- Admin Dashboard مع تحديثات فورية
- دعم كامل للعربية (RTL)

## 🔗 الروابط

- **GitHub Repository**: https://github.com/anasabukharma/auth-system-nextjs
- **Frontend**: لم يتم النشر بعد (انظر التعليمات أدناه)
- **Backend**: لم يتم النشر بعد (انظر التعليمات أدناه)

## 🚀 خطوات النشر

### 1. نشر Backend على Render

#### الخطوات:

1. **افتح Render**: https://render.com
2. **سجل دخول / إنشاء حساب**
3. **New → Web Service**
4. **اربط GitHub** واختر `auth-system-nextjs`
5. **الإعدادات**:
   - **Name**: `auth-system-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Environment Variables** - أضف:
   ```
   FIREBASE_PROJECT_ID=twtheeq-3398b
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@twtheeq-3398b.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=<انسخ من ملف JSON>
   FRONTEND_URL=<سيتم إضافته لاحقاً>
   ```

7. **Create Web Service**

8. **انتظر حتى ينتهي Deploy** (2-3 دقائق)

9. **انسخ الـ URL** (مثال: `https://auth-system-backend.onrender.com`)

---

### 2. نشر Frontend على Vercel

#### الخطوات:

1. **افتح Vercel**: https://vercel.com
2. **سجل دخول / إنشاء حساب**
3. **Add New → Project**
4. **Import Git Repository** → `auth-system-nextjs`
5. **Configure Project**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm build` (أو اتركه فاضي)
   - **Output Directory**: (اتركه فاضي)

6. **Environment Variables** - أضف:
   ```
   NEXT_PUBLIC_API_URL=<URL من Render>
   ```
   مثال: `https://auth-system-backend.onrender.com`

7. **Deploy**

8. **انتظر حتى ينتهي Deploy** (1-2 دقيقة)

9. **انسخ الـ URL** (مثال: `https://auth-system-nextjs.vercel.app`)

---

### 3. تحديث CORS في Backend

1. **ارجع إلى Render**
2. **Dashboard → auth-system-backend → Environment**
3. **أضف/عدّل**:
   ```
   FRONTEND_URL=<URL من Vercel>
   ```
   مثال: `https://auth-system-nextjs.vercel.app`

4. **Save Changes** → سيعيد Deploy تلقائياً

---

## ✅ التحقق من النشر

### اختبار Backend:

```bash
curl https://your-backend-url.onrender.com/api/health
```

يجب أن يرجع:
```json
{"status":"ok","message":"Backend is running"}
```

### اختبار Frontend:

1. افتح `https://your-frontend-url.vercel.app`
2. يجب أن تظهر الصفحة الرئيسية
3. جرب الانتقال بين الصفحات
4. جرب `/admin` للوحة التحكم

---

## 🔧 إعدادات Firebase

### إذا لم يكن Firebase معداً بعد:

1. **افتح Firebase Console**: https://console.firebase.google.com
2. **أنشئ مشروع جديد** أو استخدم `twtheeq-3398b`
3. **Firestore Database**:
   - Build → Firestore Database
   - Create Database
   - Start in **Production mode**
   - اختر Location

4. **Service Account**:
   - Project Settings → Service Accounts
   - Generate New Private Key
   - احفظ ملف JSON

5. **انسخ المعلومات إلى Environment Variables**

---

## 📱 الصفحات المتاحة

### Public Pages:
- `/` - الصفحة الرئيسية
- `/login` - تسجيل الدخول
- `/update-notice` - تنبيه
- `/step1` - الخطوة 1 (معلومات شخصية)
- `/step3` - الخطوة 3 (معلومات إضافية)
- `/step4` - الخطوة 4 (البطاقة البنكية)
- `/step5` - الخطوة 5 (OTP والتفعيل)
- `/step6` - الخطوة 6 (ATM PIN)
- `/success` - صفحة النجاح

### Admin Pages:
- `/admin` - لوحة التحكم

---

## 🐛 استكشاف الأخطاء

### Frontend لا يتصل بـ Backend:

1. تحقق من `NEXT_PUBLIC_API_URL` في Vercel
2. تحقق من CORS في Backend
3. افتح Console في المتصفح للأخطاء

### Backend يعطي خطأ 500:

1. تحقق من Firebase Environment Variables
2. تحقق من Logs في Render:
   - Dashboard → Logs

### Firebase لا يعمل:

1. تحقق من `FIREBASE_PRIVATE_KEY` - يجب أن يحتوي على `\n`
2. تحقق من Firestore Rules
3. تحقق من Service Account Permissions

---

## 📝 ملاحظات مهمة

### Render Free Tier:
- ⚠️ **ينام بعد 15 دقيقة من عدم النشاط**
- أول request بعد النوم يأخذ 30-60 ثانية
- للحل: استخدم Render Paid Plan أو Railway

### Vercel:
- ✅ لا ينام
- ✅ CDN عالمي
- ✅ Auto-deploy من GitHub

### Firebase:
- ✅ Free tier سخي
- ✅ 50K reads/day
- ✅ 20K writes/day

---

## 🎯 الخطوات التالية

1. ✅ نشر Backend على Render
2. ✅ نشر Frontend على Vercel
3. ✅ تحديث CORS
4. ✅ اختبار النظام
5. 🔄 إضافة Domain مخصص (اختياري)
6. 🔄 إعداد Monitoring (اختياري)

---

## 💡 نصائح

- استخدم Render Paid Plan لتجنب النوم
- أو استخدم Railway (أفضل من Render Free)
- راقب Firebase Usage في Console
- فعّل Firestore Indexes للأداء الأفضل

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Logs (Render + Vercel)
2. تحقق من Firebase Console
3. تحقق من Browser Console
4. راجع README.md للتفاصيل

---

**تم بنجاح! 🎉**
