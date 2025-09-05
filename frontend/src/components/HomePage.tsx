import React from 'react';
import { APP_CONFIG } from '../config/app';

const HomePage: React.FC = () => {
  return (
    <div className="theme-transition-colors min-h-screen bg-background-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="theme-transition-colors mx-auto w-24 h-24 bg-card bg-opacity-20 rounded-full flex items-center justify-center mb-8">
              <span className="text-4xl font-bold">ج</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {APP_CONFIG.name.ar}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              منصة شاملة لإدارة التكوين المهني والتدريب والمتدربين والأساتذة والبرامج التعليمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="bg-card text-primary px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                تسجيل الدخول
              </a>
              <a
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-card hover:text-primary transition-colors"
              >
                تعرف علينا
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="theme-transition-colors py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              مميزات المنصة
            </h2>
            <p className="text-lg text-muted-foreground">
              اكتشف كيف يمكن لـ {APP_CONFIG.name.ar} أن يحسن من إدارة التكوين المهني
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gestion des programmes */}
            <div className="theme-transition-colors bg-background-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary text-xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                إدارة البرامج
              </h3>
              <p className="text-muted-foreground">
                إنشاء وإدارة البرامج التعليمية والتدريبية بكفاءة عالية
              </p>
            </div>

            {/* Gestion des utilisateurs */}
            <div className="theme-transition-colors bg-background-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-success text-xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                إدارة المستخدمين
              </h3>
              <p className="text-muted-foreground">
                إدارة شاملة للمتدربين والأساتذة والإداريين
              </p>
            </div>

            {/* Gestion des établissements */}
            <div className="theme-transition-colors bg-background-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary text-xl">🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                إدارة المؤسسات
              </h3>
              <p className="text-muted-foreground">
                تنسيق بين المؤسسات الوطنية والإقليمية
              </p>
            </div>

            {/* Rapports et analyses */}
            <div className="theme-transition-colors bg-background-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                التقارير والتحليلات
              </h3>
              <p className="text-muted-foreground">
                تقارير مفصلة وإحصائيات لاتخاذ قرارات مدروسة
              </p>
            </div>

            {/* Gestion des fichiers */}
            <div className="theme-transition-colors bg-background-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-error text-xl">📁</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                إدارة الملفات
              </h3>
              <p className="text-muted-foreground">
                رفع وإدارة الملفات والوثائق التعليمية
              </p>
            </div>

            {/* Sécurité */}
            <div className="theme-transition-colors bg-background-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                الأمان والحماية
              </h3>
              <p className="text-muted-foreground">
                حماية البيانات والوصول الآمن للمنصة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ministry Section */}
      <div className="theme-transition-colors py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            تحت إشراف
          </h2>
          <div className="theme-transition-colors bg-card p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-primary mb-4">
              {APP_CONFIG.ministry.ar}
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              {APP_CONFIG.ministry.fr}
            </p>
            <p className="text-lg text-muted-foreground">
              {APP_CONFIG.ministry.en}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ابدأ رحلتك مع {APP_CONFIG.name.ar}
          </h2>
          <p className="text-xl mb-8">
            انضم إلى منصة التكوين المهني الرائدة في المغرب
          </p>
          <a
            href="/register"
            className="bg-card text-primary px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            إنشاء حساب جديد
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{APP_CONFIG.name.ar}</h3>
              <p className="text-muted-foreground">
                منصة شاملة لإدارة التكوين المهني
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">الخدمات</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>إدارة البرامج</li>
                <li>إدارة المستخدمين</li>
                <li>إدارة المؤسسات</li>
                <li>التقارير</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>الدليل المستخدم</li>
                <li>الأسئلة الشائعة</li>
                <li>اتصل بنا</li>
                <li>المساعدة</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">معلومات</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>الإصدار: {APP_CONFIG.version}</li>
                <li>تاريخ البناء: {APP_CONFIG.buildDate}</li>
                <li>الشروط والأحكام</li>
                <li>سياسة الخصوصية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 {APP_CONFIG.ministry.ar}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
