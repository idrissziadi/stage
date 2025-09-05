import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user?: {
    nom: string;
    prenom: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et navigation */}
          <nav className="flex space-x-8 rtl:space-x-reverse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-foreground">نظام إدارة التدريب</h1>
              </div>
            </div>
          </nav>

          {/* Informations utilisateur et actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {user ? (
              <>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground font-arabic">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize font-arabic">
                    {user.role === 'admin' && 'مدير'}
                    {user.role === 'enseignant' && 'أستاذ'}
                    {user.role === 'stagiaire' && 'متدرب'}
                    {user.role === 'etablissement' && 'مؤسسة'}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={onLogout}
                    className="theme-transition-colors bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 font-arabic"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-arabic"
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
