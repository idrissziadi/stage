# 🏛️ منصة الجودة - Landing Page

## نظرة عامة

هذه الصفحة الرئيسية (Landing Page) لمنصة الجودة الوطنية لإدارة الدورات والبرامج التعليمية. تم تصميمها بتقنيات حديثة ومتطورة مع دعم كامل للغة العربية والاتجاه RTL.

## ✨ الميزات الرئيسية

### 🎨 التصميم والواجهة
- **تصميم RTL كامل**: دعم كامل للغة العربية والاتجاه من اليمين إلى اليسار
- **تصميم متجاوب**: يعمل على جميع الأجهزة والأحجام
- **ألوان وزارية**: استخدام ألوان رسمية ومهنية مناسبة للمؤسسات الحكومية
- **Typography متقدم**: خطوط عربية واضحة ومقروءة

### 🚀 الرسوم المتحركة
- **Framer Motion**: رسوم متحركة سلسة ومتقدمة
- **Scroll Animations**: تأثيرات تظهر عند التمرير
- **Hover Effects**: تأثيرات تفاعلية عند التمرير
- **Loading States**: حالات تحميل متحركة
- **Parallax Effects**: تأثيرات العمق والحركة

### 🧩 المكونات المتقدمة
- **AnimatedButton**: أزرار متحركة مع تأثيرات متقدمة
- **FeatureCard**: بطاقات الميزات مع تأثيرات Hover
- **TestimonialCarousel**: عرض آراء المستخدمين مع Carousel
- **StatsSection**: إحصائيات متحركة مع عدادات
- **ResourceCard**: بطاقات الموارد والدلائل
- **NewsSection**: قسم الأخبار والتحديثات
- **GlassCard**: بطاقات زجاجية مع تأثيرات Glassmorphism
- **GradientBackground**: خلفيات متدرجة متحركة

## 🏗️ هيكل الصفحة

### 1. شريط التنقل (Navigation)
- شعار المنصة مع أيقونة
- روابط التنقل الرئيسية
- زر تسجيل الدخول
- قائمة طعام للهواتف المحمولة

### 2. القسم الرئيسي (Hero Section)
- عنوان رئيسي كبير مع تدرج لوني
- وصف مختصر للمنصة
- أزرار دعوة للعمل (CTA)
- إحصائيات سريعة

### 3. قسم الإحصائيات (Stats Section)
- 4 إحصائيات رئيسية مع أيقونات
- عدادات متحركة
- تأثيرات عائمة في الخلفية

### 4. قسم حول المنصة (About Section)
- وصف مفصل للمنصة
- 4 ميزات رئيسية مع أيقونات
- تأثيرات Hover متقدمة

### 5. قسم المزايا (Benefits Section)
- 3 مجموعات من المزايا (للمعلمين، الطلاب، الإدارة)
- قوائم منظمة مع أيقونات
- ألوان متدرجة مختلفة

### 6. قسم العرض التوضيحي (Demo Section)
- عرض تفاعلي للمنصة
- خلفية داكنة مع تأثيرات
- زر تشغيل العرض

### 7. قسم آراء المستخدمين (Testimonials)
- Carousel تلقائي للآراء
- تقييمات بالنجوم
- معلومات المستخدمين

### 8. قسم الأسئلة الشائعة (FAQ)
- أسئلة متكررة مع إجابات
- تأثيرات ظهور عند التمرير

### 9. قسم الموارد (Resources Section)
- 6 أنواع من الموارد
- بطاقات ملونة حسب النوع
- أزرار تحميل وعرض

### 10. قسم الأخبار (News Section)
- أخبار مميزة مع تدرج لوني
- قائمة أخبار جانبية
- تحديث تلقائي كل 8 ثواني

### 11. قسم الاتصال (Contact Section)
- معلومات الاتصال مع أيقونات
- نموذج اتصال تفاعلي
- تأثيرات ظهور متدرجة

### 12. التذييل (Footer)
- معلومات المنصة
- روابط سريعة
- وسائل التواصل الاجتماعي

## 🛠️ التقنيات المستخدمة

### Frontend Framework
- **React 18**: إطار العمل الرئيسي
- **TypeScript**: لكتابة كود آمن ومنظم
- **Vite**: أداة البناء السريعة

### UI & Styling
- **Tailwind CSS**: إطار عمل CSS
- **Tailwind CSS Animate**: مكتبة الرسوم المتحركة
- **Radix UI**: مكونات UI متقدمة

### Animation & Effects
- **Framer Motion**: مكتبة الرسوم المتحركة
- **Lucide React**: مجموعة أيقونات حديثة
- **Custom Hooks**: خطافات مخصصة للرسوم المتحركة

### Routing & State
- **React Router DOM**: توجيه الصفحات
- **React Query**: إدارة حالة البيانات
- **Custom Hooks**: خطافات مخصصة

## 📱 الاستجابة والتصميم

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### RTL Support
- **Direction**: rtl
- **Spacing**: space-x-reverse
- **Text Alignment**: text-right
- **Flex Direction**: flex-row-reverse

## 🎯 كيفية الاستخدام

### 1. تشغيل المشروع
```bash
cd frontend
npm install
npm run dev
```

### 2. الوصول للصفحة
```
http://localhost:5173/landing
```

### 3. تخصيص المحتوى
- تعديل النصوص في ملف `LandingPage.tsx`
- تغيير الألوان في `tailwind.config.ts`
- إضافة مكونات جديدة في مجلد `components`

## 🔧 التخصيص

### تغيير الألوان
```typescript
// في tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
      },
      secondary: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
      }
    }
  }
}
```

### إضافة مكونات جديدة
```typescript
// إنشاء مكون جديد
import React from 'react';
import { motion } from 'framer-motion';

const NewComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* المحتوى */}
    </motion.div>
  );
};

export default NewComponent;
```

## 📊 الأداء

### تحسينات الأداء
- **Lazy Loading**: تحميل المكونات عند الحاجة
- **Image Optimization**: تحسين الصور
- **Code Splitting**: تقسيم الكود
- **Bundle Analysis**: تحليل الحزم

### مقاييس الأداء
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 الاختبار

### أنواع الاختبارات
- **Unit Tests**: اختبارات الوحدات
- **Integration Tests**: اختبارات التكامل
- **E2E Tests**: اختبارات النهاية للنهاية
- **Accessibility Tests**: اختبارات إمكانية الوصول

### تشغيل الاختبارات
```bash
npm run test
npm run test:coverage
npm run test:e2e
```

## 🚀 النشر

### بناء المشروع
```bash
npm run build
```

### النشر على الخادم
```bash
# نسخ ملفات البناء
cp -r dist/* /path/to/server/

# أو استخدام أدوات النشر
npm run deploy
```

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة وزارة التربية الوطنية والتعليم الأولي والرياضة.

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## 📞 الدعم

للمساعدة والدعم التقني:
- **البريد الإلكتروني**: support@aljawda.gov.ma
- **الهاتف**: +212 5 37 77 77 77
- **الموقع**: www.aljawda.gov.ma

---

**تم التطوير بواسطة فريق منصة الجودة** 🎓
