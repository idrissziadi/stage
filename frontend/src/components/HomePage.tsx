import React from 'react';
import { APP_CONFIG } from '../config/app';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8">
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
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                تسجيل الدخول
              </a>
              <a
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                تعرف علينا
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              مميزات المنصة
            </h2>
            <p className="text-lg text-gray-600">
              اكتشف كيف يمكن لـ {APP_CONFIG.name.ar} أن يحسن من إدارة التكوين المهني
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gestion des programmes */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                إدارة البرامج
              </h3>
              <p className="text-gray-600">
                إنشاء وإدارة البرامج التعليمية والتدريبية بكفاءة عالية
              </p>
            </div>

            {/* Gestion des utilisateurs */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                إدارة المستخدمين
              </h3>
              <p className="text-gray-600">
                إدارة شاملة للمتدربين والأساتذة والإداريين
              </p>
            </div>

            {/* Gestion des établissements */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                إدارة المؤسسات
              </h3>
              <p className="text-gray-600">
                تنسيق بين المؤسسات الوطنية والإقليمية
              </p>
            </div>

            {/* Rapports et analyses */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                التقارير والتحليلات
              </h3>
              <p className="text-gray-600">
                تقارير مفصلة وإحصائيات لاتخاذ قرارات مدروسة
              </p>
            </div>

            {/* Gestion des fichiers */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl">📁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                إدارة الملفات
              </h3>
              <p className="text-gray-600">
                رفع وإدارة الملفات والوثائق التعليمية
              </p>
            </div>

            {/* Sécurité */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-indigo-600 text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                الأمان والحماية
              </h3>
              <p className="text-gray-600">
                حماية البيانات والوصول الآمن للمنصة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ministry Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            تحت إشراف
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              {APP_CONFIG.ministry.ar}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {APP_CONFIG.ministry.fr}
            </p>
            <p className="text-lg text-gray-600">
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
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
              <p className="text-gray-400">
                منصة شاملة لإدارة التكوين المهني
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">الخدمات</h4>
              <ul className="space-y-2 text-gray-400">
                <li>إدارة البرامج</li>
                <li>إدارة المستخدمين</li>
                <li>إدارة المؤسسات</li>
                <li>التقارير</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li>الدليل المستخدم</li>
                <li>الأسئلة الشائعة</li>
                <li>اتصل بنا</li>
                <li>المساعدة</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">معلومات</h4>
              <ul className="space-y-2 text-gray-400">
                <li>الإصدار: {APP_CONFIG.version}</li>
                <li>تاريخ البناء: {APP_CONFIG.buildDate}</li>
                <li>الشروط والأحكام</li>
                <li>سياسة الخصوصية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {APP_CONFIG.ministry.ar}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
