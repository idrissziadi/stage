# 🔧 Solution - البرامج للأساتذة لا تظهر

## 🎯 المشكلة

البرامج المقبولة لا تظهر للأساتذة في قسم "البرامج".

## 🔍 الأسباب المحتملة

### **1. عدم وجود ربط بين الأستاذ والوحدات**
- الأستاذ لا يدرّس أي وحدة (EnsModule فارغة)

### **2. عدم وجود برامج مقبولة**
- لا توجد برامج بحالة "مقبول" للوحدات التي يدرّسها

### **3. مشكلة في الـ API**
- خطأ في `/programme/enseignant/:id`

## 🚀 الحلول

### **الحل 1: إنشاء بيانات اختبار**

```bash
# في terminal backend
cd backend
node seed-enseignant-programmes.js
```

هذا سيقوم بـ:
- ✅ ربط الأستاذ بوحدات
- ✅ إنشاء برامج مقبولة لتلك الوحدات
- ✅ اختبار العلاقات

### **الحل 2: تشخيص المشكلة**

```bash
# في terminal backend  
cd backend
node debug-enseignant-programmes.js
```

هذا سيفحص:
- ✅ وجود الأستاذ
- ✅ الوحدات المرتبطة
- ✅ البرامج المتاحة
- ✅ البرامج المقبولة

### **الحل 3: اختبار الـ API**

```bash
# في terminal backend
cd backend  
node test-enseignant-api.js
```

هذا سيختبر:
- ✅ تسجيل الدخول
- ✅ API `/programme/enseignant/:id`
- ✅ البيانات المُرجعة

## 📋 خطوات التحقق

### **1. تشغيل Backend**
```bash
cd backend
npm start
```

### **2. إنشاء البيانات**
```bash
cd backend
node seed-enseignant-programmes.js
```

### **3. اختبار Frontend**
1. تسجيل الدخول كأستاذ
2. الذهاب لقسم "البرامج"  
3. يجب أن تظهر البرامج المقبولة

## 🔄 البيانات المطلوبة

### **جدول EnsModule**
```sql
-- ربط أستاذ بوحدة
INSERT INTO EnsModule (id_enseignant, id_module) 
VALUES (2, 1), (2, 2);
```

### **جدول Programme** 
```sql
-- برامج مقبولة
INSERT INTO Programme (code_programme, titre_fr, titre_ar, status, id_module, id_etab_regionale)
VALUES 
('PROG-001', 'Programme Web', 'برنامج الويب', 'مقبول', 1, 1),
('PROG-002', 'Programme Mobile', 'برنامج الجوال', 'مقبول', 2, 1);
```

## 🎯 التحقق من النجاح

بعد تطبيق الحل، يجب أن:

1. ✅ **API يعمل**: `GET /programme/enseignant/2` يرجع برامج
2. ✅ **Frontend يظهر**: قائمة البرامج المقبولة 
3. ✅ **Filtrage يعمل**: تصفية حسب الوحدة
4. ✅ **التفاصيل صحيحة**: الكود، العنوان، الوحدة، المؤسسة

## 🧪 اختبار سريع

```javascript
// Console Frontend (F12)
fetch('/api/programme/enseignant/2')
  .then(r => r.json())
  .then(data => console.log('Programmes:', data));
```

## 📞 إذا استمرت المشكلة

1. **فحص Logs Backend** للأخطاء
2. **فحص Console Frontend** للأخطاء JavaScript  
3. **التحقق من Bearer Token** في الطلبات
4. **فحص Database** للبيانات المطلوبة

---

**💡 نصيحة**: ابدأ بـ `seed-enseignant-programmes.js` لإنشاء بيانات اختبار كاملة.
