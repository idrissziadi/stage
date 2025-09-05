import { useAuthApi } from '@/hooks/useAuthApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Shield, Activity, GraduationCap } from 'lucide-react';
import { useState } from 'react';
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
import { LogoutCard, FloatingLogoutButton } from '@/components/ui/logout';

const Dashboard = () => {
  const { user, userProfile, signOut } = useAuthApi();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const getRoleInArabic = (role: string) => {
    const roles: { [key: string]: string } = {
      'admin': 'مدير',
      'stagiaire': 'متدرب',
      'enseignant': 'أستاذ',
      'etablissement_formation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roles[role] || role;
  };

  const handleLogoutConfirm = () => {
    signOut();
    setIsLogoutConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header amélioré avec bouton de déconnexion */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 font-arabic mb-2">
              لوحة التحكم
            </h1>
            <p className="text-muted-foreground font-arabic text-lg">
              مرحباً <span className="font-semibold text-primary">{userProfile?.username || user?.username}</span>
            </p>
            <p className="text-sm text-muted-foreground font-arabic mt-1">
              دورك: <span className="font-medium">{userProfile?.role ? getRoleInArabic(userProfile.role) : 'غير محدد'}</span>
            </p>
          </div>
          
          {/* Bouton de déconnexion amélioré */}
          <Button 
            onClick={() => setIsLogoutConfirmOpen(true)} 
            variant="destructive" 
            size="lg"
            className="font-arabic shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
          >
            <LogOut className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-200" />
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Carte d'information utilisateur améliorée */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="flex items-center gap-2 font-arabic">
                <User className="w-5 h-5 text-primary" />
                معلومات المستخدم
              </CardTitle>
              <CardDescription className="font-arabic">تفاصيل حسابك الشخصي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المستخدم:</span>
                <span className="font-semibold">{user?.username || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المستخدم:</span>
                <span className="font-semibold">{userProfile?.username || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">الدور:</span>
                <span className="font-semibold text-primary">{userProfile?.role ? getRoleInArabic(userProfile.role) : 'غير محدد'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ الإنشاء:</span>
                <span className="font-semibold">{user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-DZ') : 'غير متاح'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Carte de statistiques améliorée */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-secondary">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardTitle className="flex items-center gap-2 font-arabic">
                <Activity className="w-5 h-5 text-secondary" />
                الإحصائيات
              </CardTitle>
              <CardDescription className="font-arabic">ملخص سريع للنظام</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-2xl font-bold text-primary font-arabic">مرحباً بك</p>
                <p className="text-muted-foreground font-arabic">في نظام إدارة التدريب المتطور</p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">100%</p>
                    <p className="text-xs text-muted-foreground font-arabic">أمان</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-secondary">24/7</p>
                    <p className="text-xs text-muted-foreground font-arabic">متاح</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section admin améliorée */}
        {userProfile?.role === 'admin' && (
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-warning">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardTitle className="flex items-center gap-2 font-arabic">
                <Shield className="w-5 h-5 text-warning" />
                إدارة النظام
              </CardTitle>
              <CardDescription className="font-arabic">أدوات المدير المتقدمة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-24 flex-col hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 group">
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">👥</span>
                  <span className="font-arabic">إدارة المستخدمين</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors duration-200 group">
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">🏢</span>
                  <span className="font-arabic">إدارة المؤسسات</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors duration-200 group">
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">📚</span>
                  <span className="font-arabic">إدارة التخصصات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section stagiaire améliorée */}
        {userProfile?.role === 'stagiaire' && (
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-success">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardTitle className="flex items-center gap-2 font-arabic">
                <GraduationCap className="w-5 h-5 text-success" />
                لوحة المتدرب
              </CardTitle>
              <CardDescription className="font-arabic">أدوات المتدرب المتقدمة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">📝</span>
                  <span className="font-arabic text-sm">تسجيل البرامج</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors duration-200 group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">📊</span>
                  <span className="font-arabic text-sm">متابعة التقدم</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors duration-200 group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">📚</span>
                  <span className="font-arabic text-sm">المواد التعليمية</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section enseignant améliorée */}
        {userProfile?.role === 'enseignant' && (
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-info">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
              <CardTitle className="flex items-center gap-2 font-arabic">
                <User className="w-5 h-5 text-info" />
                لوحة الأستاذ
              </CardTitle>
              <CardDescription className="font-arabic">أدوات التدريس المتقدمة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">📚</span>
                  <span className="font-arabic text-sm">إدارة البرامج</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors duration-200 group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">📤</span>
                  <span className="font-arabic text-sm">رفع المواد</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors duration-200 group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">👥</span>
                  <span className="font-arabic text-sm">متابعة المتدربين</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Section de démonstration des composants de déconnexion */}
      <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic mb-6 text-center">
          مكونات تسجيل الخروج المحسنة
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Carte de déconnexion */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-arabic text-center">
              بطاقة تسجيل الخروج
            </h3>
            <LogoutCard 
              onLogout={() => setIsLogoutConfirmOpen(true)}
              username={userProfile?.username || user?.username}
              role={userProfile?.role}
            />
          </div>

          {/* Bouton flottant */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-arabic text-center">
              زر عائم
            </h3>
            <div className="flex justify-center">
              <FloatingLogoutButton 
                onLogout={() => setIsLogoutConfirmOpen(true)}
                variant="floating"
              />
            </div>
          </div>

          {/* Bouton minimal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-arabic text-center">
              زر بسيط
            </h3>
            <div className="flex justify-center">
              <FloatingLogoutButton 
                onLogout={() => setIsLogoutConfirmOpen(true)}
                variant="minimal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Boîte de dialogue de confirmation de déconnexion */}
      <AlertDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <AlertDialogContent className="max-w-md border-l-4 border-l-destructive bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <LogOut className="w-8 h-8 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white font-arabic">
              تأكيد تسجيل الخروج
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 font-arabic leading-relaxed">
              هل أنت متأكد من أنك تريد تسجيل الخروج من النظام؟ 
              <br />
              <span className="text-sm text-gray-500 dark:text-gray-500">
                سيتم إغلاق جلسة العمل الخاصة بك
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-3 pt-4">
            <AlertDialogCancel 
              className="font-arabic w-full sm:w-auto order-2 sm:order-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 px-6 py-2.5 rounded-lg border-gray-300 dark:border-gray-600"
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutConfirm} 
              className="font-arabic w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-2.5 rounded-lg"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;