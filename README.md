# نظام إدارة التدريب والتكوين المهني

## نظرة عامة
منصة شاملة لإدارة التكوين والتعليم المهني، تهدف إلى تطوير المهارات وتحسين جودة التعليم المهني في الجزائر.

## الميزات الرئيسية

### 🎓 إدارة المتدربين
- تسجيل وإدارة بيانات المتدربين
- تتبع التقدم الأكاديمي
- إدارة الشهادات والدبلومات

### 👨‍🏫 إدارة الأساتذة
- إدارة ملفات الأساتذة
- توزيع المهام والدروس
- تتبع الأداء والإنجازات

### 🏢 إدارة المؤسسات
- إدارة مؤسسات التكوين
- المؤسسات الإقليمية
- المؤسسة الوطنية

### 📚 إدارة المحتوى
- إدارة البرامج والدروس
- رفع وتنظيم الملفات
- إدارة الذاكرة والمشاريع

## التقنيات المستخدمة

### Frontend
- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - إطار عمل CSS
- **Shadcn/ui** - مكونات واجهة المستخدم
- **Framer Motion** - مكتبة الرسوم المتحركة
- **Vite** - أداة البناء

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الويب
- **Sequelize** - ORM لقاعدة البيانات
- **MySQL** - قاعدة البيانات
- **JWT** - المصادقة
- **Nodemailer** - إرسال الإيميلات

## التثبيت والتشغيل

### متطلبات النظام
- Node.js 18+
- MySQL 8.0+
- npm أو yarn

### تثبيت التبعيات
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### إعداد قاعدة البيانات
1. إنشاء قاعدة بيانات MySQL
2. تحديث إعدادات الاتصال في `backend/.env`
3. تشغيل migrations

### إعداد متغيرات البيئة
إنشاء ملف `.env` في مجلد `backend`:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=formation_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.esi.dz
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@esi.dz
EMAIL_PASS=your_password
EMAIL_TO=recipient@gmail.com

# Server
PORT=3000
NODE_ENV=development
```

### تشغيل المشروع
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## هيكل المشروع

```
stage/
├── backend/                 # خادم Node.js
│   ├── controllers/         # منطق العمل
│   ├── models/             # نماذج قاعدة البيانات
│   ├── routes/             # مسارات API
│   ├── middlewares/        # وسائط
│   └── upload/             # ملفات مرفوعة
├── frontend/               # تطبيق React
│   ├── src/
│   │   ├── components/     # مكونات قابلة لإعادة الاستخدام
│   │   │   ├── landing-page/  # مكونات الصفحة الرئيسية
│   │   │   ├── ui/           # مكونات واجهة المستخدم
│   │   │   └── ...           # مكونات أخرى
│   │   ├── pages/          # صفحات التطبيق
│   │   ├── hooks/          # React Hooks
│   │   └── services/       # خدمات API
│   └── public/             # ملفات عامة
└── README.md              # هذا الملف
```

## الأدوار والصلاحيات

### المتدرب (Stagiaire)
- عرض البرامج والدروس
- رفع الذاكرة والمشاريع
- تتبع التقدم الأكاديمي

### الأستاذ (Enseignant)
- إدارة الدروس والبرامج
- تقييم المتدربين
- رفع المحتوى التعليمي

### مؤسسة التكوين (EtablissementFormation)
- إدارة المتدربين والأساتذة
- إدارة البرامج والعروض
- تقارير وإحصائيات

### المؤسسة الإقليمية (EtablissementRegionale)
- إدارة مؤسسات التكوين
- تنسيق البرامج الإقليمية
- تقارير شاملة

### المؤسسة الوطنية (EtablissementNationale)
- إدارة النظام بالكامل
- إعداد السياسات العامة
- تقارير وطنية

## API Documentation
يمكن الوصول إلى وثائق API على: `http://localhost:3000/api-docs`

## المساهمة
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الدعم
للمساعدة والدعم التقني:
- **البريد الإلكتروني**: idriss.ziadi47@gmail.com
- **الهاتف**: +213 21 60 55 55
- **الموقع**: https://mfp.gov.dz/

## الترخيص
هذا المشروع مرخص تحت رخصة MIT.

---

**تم التطوير بواسطة فريق منصة الجودة** 🎓