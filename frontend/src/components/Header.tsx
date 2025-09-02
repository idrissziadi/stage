import React from 'react';
import { APP_CONFIG } from '../config/app';

interface HeaderProps {
  user?: {
    nom: string;
    prenom: string;
    role: string;
  };
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom de l'application */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">ج</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">
                {APP_CONFIG.name.ar}
              </h1>
              <p className="text-sm text-gray-500">
                نظام إدارة التكوين المهني
              </p>
            </div>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <a
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              الرئيسية
            </a>
            <a
              href="/programs"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              البرامج
            </a>
            <a
              href="/users"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              المستخدمون
            </a>
            <a
              href="/establishments"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              المؤسسات
            </a>
            <a
              href="/reports"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              التقارير
            </a>
          </nav>

          {/* Informations utilisateur et actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {user ? (
              <>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role === 'admin' && 'مدير'}
                    {user.role === 'enseignant' && 'أستاذ'}
                    {user.role === 'stagiaire' && 'متدرب'}
                    {user.role === 'etablissement' && 'مؤسسة'}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={onLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                تسجيل الدخول
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
