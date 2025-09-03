import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { 
  Home, 
  Users, 
  GraduationCap, 
  FileText, 
  Target, 
  User, 
  LogOut, 
  Settings, 
  Key, 
  Bell, 
  Download, 
  HelpCircle, 
  BarChart3,
  UserPlus,
  BookOpen,
  UserCheck
} from 'lucide-react';
import EtablissementOverview from '@/components/etablissement/EtablissementOverview';
import UserManagement from '@/components/etablissement/UserManagement';
import MemoireManagement from '@/components/etablissement/MemoireManagement';
import OffreManagement from '@/components/etablissement/OffreManagement';
import NotificationCenter from '@/components/enseignant/NotificationCenter';
import UserGuide from '@/components/enseignant/UserGuide';
import MinistryFooter from '@/components/layout/MinistryFooter';


const EtablissementFormationDashboard = () => {
  const { user, userProfile, signOut } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Dialog states - following role-based UI consistency
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  // Form states - following established pattern
  const [profileForm, setProfileForm] = useState({
    code: '',
    nom_fr: '',
    nom_ar: '',
    adresse_fr: '',
    adresse_ar: '',
    email: '',
    telephone: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newRegistrations: true,
    offerUpdates: true,
    systemUpdates: false
  });

  useEffect(() => {
    // Set token for API service
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setToken(token);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.id_etab_formation) {
      initializeProfileForm();
    }
  }, [userProfile]);

  const initializeProfileForm = () => {
    if (userProfile) {
      setProfileForm({
        code: userProfile.code || '',
        nom_fr: userProfile.nom_fr || '',
        nom_ar: userProfile.nom_ar || '',
        adresse_fr: userProfile.adresse_fr || '',
        adresse_ar: userProfile.adresse_ar || '',
        email: userProfile.email || '',
        telephone: userProfile.telephone || ''
      });
    }
  };

  // Handler functions for profile management
  const handleProfileEdit = () => {
    initializeProfileForm();
    setIsProfileEditOpen(true);
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const { error } = await apiService.updateUserProfile(profileForm);
      
      if (error) throw error;
      
      toast({
        title: 'نجح',
        description: 'تم تحديث الملف الشخصي بنجاح',
      });
      
      setIsProfileEditOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الملف الشخصي',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'جميع الحقول مطلوبة',
        variant: 'destructive'
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور الجديدة غير متطابقة',
        variant: 'destructive'
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await apiService.changePassword(
        userProfile.id_compte,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (error) throw error;
      
      toast({
        title: 'نجح',
        description: 'تم تغيير كلمة المرور بنجاح',
      });
      
      setIsPasswordChangeOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تغيير كلمة المرور',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      setLoading(true);
      
      // Export establishment data
      const exportData = {
        profile: userProfile,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `etablissement-data-${userProfile.code}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'نجح',
        description: 'تم تصدير البيانات بنجاح',
      });
      
      setIsDataExportOpen(false);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تصدير البيانات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutConfirm = () => {
    signOut();
    setIsLogoutConfirmOpen(false);
  };

  const getRoleInArabic = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'مدير',
      'Stagiaire': 'متدرب',
      'Enseignant': 'أستاذ',
      'EtablissementFormation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roleMap[role] || role;
  };

  const getInitials = (code: string) => {
    return code?.substring(0, 2).toUpperCase() || 'ET';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rtl">
      {/* Modern Header with Institution Profile */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-start-rtl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">لوحة مؤسسة التكوين</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  إدارة شاملة للنشاطات التعليمية والإدارية
                </p>
              </div>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-end-rtl">
                <p className="text-sm font-medium text-gray-900 dark:text-white font-arabic">
                  {userProfile?.nom_ar || userProfile?.nom_fr || userProfile?.code}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-arabic">
                  {getRoleInArabic(userProfile?.role)}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                        {getInitials(userProfile?.code)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleProfileEdit} className="font-arabic">
                    <User className="mr-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="font-arabic">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsPasswordChangeOpen(true)} className="font-arabic">
                    <Key className="mr-2 h-4 w-4" />
                    <span>تغيير كلمة المرور</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsNotificationsOpen(true)} className="font-arabic">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>الإشعارات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDataExportOpen(true)} className="font-arabic">
                    <Download className="mr-2 h-4 w-4" />
                    <span>تصدير البيانات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('help')} className="font-arabic">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>المساعدة والدعم</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLogoutConfirmOpen(true)} className="font-arabic text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs - Following conciseness memory */}
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-arabic">
              <BarChart3 className="w-4 h-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-arabic">
              <Users className="w-4 h-4 ml-2" />
              إدارة المستخدمين
            </TabsTrigger>
            <TabsTrigger value="memoires" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-arabic">
              <FileText className="w-4 h-4 ml-2" />
              إدارة المذكرات
            </TabsTrigger>
            <TabsTrigger value="offres" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-arabic">
              <Target className="w-4 h-4 ml-2" />
              إدارة العروض
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview">
            <EtablissementOverview onTabChange={setActiveTab} />
          </TabsContent>



          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="memoires">
            <MemoireManagement />
          </TabsContent>

          <TabsContent value="offres">
            <OffreManagement />
          </TabsContent>

          <TabsContent value="help">
            <UserGuide />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <MinistryFooter />

      {/* All Dialog Components - Following established patterns */}
      
      {/* Password Change Dialog */}
      <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">تغيير كلمة المرور</DialogTitle>
            <DialogDescription className="font-arabic">
              أدخل كلمة المرور الحالية وكلمة المرور الجديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="font-arabic">كلمة المرور الحالية</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="font-arabic">كلمة المرور الجديدة</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="font-arabic">تأكيد كلمة المرور</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordChangeOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handlePasswordChange}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Export Confirmation */}
      <AlertDialog open={isDataExportOpen} onOpenChange={setIsDataExportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">تصدير البيانات</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">
              هل تريد تصدير جميع بيانات المؤسسة؟ سيتم حفظ البيانات في ملف JSON.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDataExport}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري التصدير...' : 'تصدير البيانات'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation */}
      <AlertDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
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
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
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

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-arabic">الإشعارات</DialogTitle>
          </DialogHeader>
          <NotificationCenter />
        </DialogContent>
      </Dialog>

      {/* Profile Edit Dialog - Following comprehensive pattern */}
      <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
        <DialogContent className="max-w-2xl dialog-rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-start-rtl">
            <DialogTitle className="font-arabic">تعديل الملف الشخصي</DialogTitle>
            <DialogDescription className="font-arabic">
              تحديث جميع معلومات المؤسسة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">المعلومات الأساسية</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="code" className="form-label-rtl font-arabic">رمز المؤسسة</Label>
                  <Input
                    id="code"
                    value={profileForm.code}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, code: e.target.value }))}
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="nom_fr" className="form-label-rtl font-arabic">الاسم (فرنسية)</Label>
                    <Input
                      id="nom_fr"
                      value={profileForm.nom_fr}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, nom_fr: e.target.value }))}
                      className="mt-1"
                      dir="ltr"
                      placeholder="Nom en français"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom_ar" className="form-label-rtl font-arabic">الاسم (عربية)</Label>
                    <Input
                      id="nom_ar"
                      value={profileForm.nom_ar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, nom_ar: e.target.value }))}
                      className="mt-1"
                      dir="rtl"
                      placeholder="الاسم بالعربية"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">معلومات الاتصال</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email" className="form-label-rtl font-arabic">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone" className="form-label-rtl font-arabic">رقم الهاتف</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={profileForm.telephone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, telephone: e.target.value }))}
                    className="mt-1"
                    dir="ltr"
                    placeholder="+213 XX XX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">العنوان</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="adresse_fr" className="form-label-rtl font-arabic">العنوان (فرنسية)</Label>
                  <Input
                    id="adresse_fr"
                    value={profileForm.adresse_fr}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, adresse_fr: e.target.value }))}
                    className="mt-1"
                    dir="ltr"
                    placeholder="Adresse en français"
                  />
                </div>
                <div>
                  <Label htmlFor="adresse_ar" className="form-label-rtl font-arabic">العنوان (عربية)</Label>
                  <Input
                    id="adresse_ar"
                    value={profileForm.adresse_ar}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, adresse_ar: e.target.value }))}
                    className="mt-1"
                    dir="rtl"
                    placeholder="العنوان بالعربية"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProfileEditOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleProfileUpdate}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EtablissementFormationDashboard;