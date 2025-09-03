import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FloatingLogoutButtonProps {
  onLogout: () => void;
  className?: string;
  variant?: 'default' | 'floating' | 'minimal';
}

const FloatingLogoutButton: React.FC<FloatingLogoutButtonProps> = ({ 
  onLogout, 
  className = "",
  variant = 'default'
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogoutConfirm = () => {
    onLogout();
    setIsConfirmOpen(false);
  };

  if (variant === 'floating') {
    return (
      <>
        <Button
          onClick={() => setIsConfirmOpen(true)}
          variant="destructive"
          size="lg"
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 border-0 z-50 ${className}`}
        >
          <LogOut className="w-6 h-6 text-white" />
        </Button>

        {/* Dialog de confirmation */}
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent className="max-w-sm border-l-4 border-l-destructive bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-950/30 dark:via-pink-950/20 dark:to-red-950/30 shadow-2xl">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-gray-900 dark:text-white font-arabic">
                تأكيد تسجيل الخروج
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400 font-arabic text-sm">
                هل أنت متأكد من تسجيل الخروج؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2 pt-4">
              <AlertDialogCancel 
                className="font-arabic flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600"
              >
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogoutConfirm} 
                className="font-arabic flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg"
              >
                <LogOut className="w-4 h-4 ml-1" />
                خروج
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (variant === 'minimal') {
    return (
      <>
        <Button
          onClick={() => setIsConfirmOpen(true)}
          variant="ghost"
          size="sm"
          className={`hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 ${className}`}
        >
          <LogOut className="w-4 h-4 ml-1" />
          خروج
        </Button>

        {/* Dialog de confirmation minimal */}
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent className="max-w-sm border-l-4 border-l-destructive bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-3 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <AlertDialogTitle className="text-base font-bold text-gray-900 dark:text-white font-arabic">
                تسجيل الخروج
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400 font-arabic text-sm">
                هل تريد تسجيل الخروج؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2 pt-3">
              <AlertDialogCancel 
                className="font-arabic flex-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 px-3 py-1.5 rounded-md"
              >
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogoutConfirm} 
                className="font-arabic flex-1 text-sm bg-red-500 hover:bg-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-1.5 rounded-md"
              >
                خروج
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Variant par défaut
  return (
    <>
      <Button
        onClick={() => setIsConfirmOpen(true)}
        variant="destructive"
        size="lg"
        className={`font-arabic bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group ${className}`}
      >
        <LogOut className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
        تسجيل الخروج
      </Button>

      {/* Dialog de confirmation complet */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="max-w-md border-l-4 border-l-destructive bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-950/30 dark:via-pink-950/20 dark:to-red-950/30 shadow-2xl">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <LogOut className="w-10 h-10 text-white animate-bounce" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white font-arabic mb-2">
              تأكيد تسجيل الخروج
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 font-arabic leading-relaxed text-base">
              هل أنت متأكد من أنك تريد تسجيل الخروج من النظام؟ 
              <br />
              <span className="text-sm text-gray-500 dark:text-gray-500 mt-2 block">
                سيتم إغلاق جلسة العمل الخاصة بك
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-3 pt-6">
            <AlertDialogCancel 
              className="font-arabic w-full sm:w-auto order-2 sm:order-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 px-8 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 font-medium"
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutConfirm} 
              className="font-arabic w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-3 rounded-xl font-medium text-base"
            >
              <LogOut className="w-5 h-5 ml-2 animate-pulse" />
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FloatingLogoutButton;
