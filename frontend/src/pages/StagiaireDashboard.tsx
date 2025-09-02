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
import { BookOpen, FileText, User, LogOut, Users, GraduationCap, Upload, Home, Settings, Key, Bell, Download, HelpCircle, BarChart3 } from 'lucide-react';
import StagiaireOverview from '@/components/stagiaire/StagiaireOverview';
import StagiaireRelatedCourses from '@/components/stagiaire/StagiaireRelatedCourses';
import CollaborativeMemoires from '@/components/stagiaire/CollaborativeMemoires';
import MonMemoire from '@/components/stagiaire/MonMemoire';
import NotificationCenter from '@/components/enseignant/NotificationCenter';
import UserGuide from '@/components/enseignant/UserGuide';
import MinistryFooter from '@/components/layout/MinistryFooter';

const StagiaireDashboard = () => {
  const { user, userProfile, signOut } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Dialog states - exactly like enseignant
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  // Form states - exactly like enseignant
  const [profileForm, setProfileForm] = useState({
    username: '',
    nom_fr: '',
    prenom_fr: '',
    nom_ar: '',
    prenom_ar: '',
    email: '',
    telephone: '',
    date_naissance: '',
    niveau_formation: '',
    etablissement_origine: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    memoireUpdates: true,
    newCourses: true,
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
    if (userProfile?.id_stagiaire) {
      initializeProfileForm();
    }
  }, [userProfile]);

  const initializeProfileForm = () => {
    if (userProfile) {
      setProfileForm({
        username: userProfile.username || '',
        nom_fr: userProfile.nom_fr || '',
        prenom_fr: userProfile.prenom_fr || '',
        nom_ar: userProfile.nom_ar || '',
        prenom_ar: userProfile.prenom_ar || '',
        email: userProfile.email || '',
        telephone: userProfile.telephone || '',
        date_naissance: userProfile.date_naissance || '',
        niveau_formation: userProfile.niveau_formation || '',
        etablissement_origine: userProfile.etablissement_origine || ''
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
      
      const coursData = await apiService.getCoursByStagiaire(userProfile.id_stagiaire.toString());
      const inscriptionsData = await apiService.getInscriptionsByStagiaire(userProfile.id_stagiaire.toString());
      const myMemoireData = await apiService.getMemoiresByStagiaire(userProfile.id_stagiaire.toString());
      
      const exportData = {
        profile: userProfile,
        courses: coursData.data || [],
        inscriptions: inscriptionsData.data || [],
        memoires: myMemoireData.data || [],
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stagiaire-data-${userProfile.username}-${new Date().toISOString().split('T')[0]}.json`;
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
      'enseignant': 'أستاذ',
      'etablissement_formation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roleMap[role] || role;
  };

  const getInitials = (username: string) => {
    return username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 rtl">
      {/* Modern Header with User Profile */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-start-rtl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">لوحة تحكم المتدرب</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  مرحباً بك في نظام إدارة التدريب
                </p>
              </div>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-end-rtl">
                <p className="text-sm font-medium text-gray-900 dark:text-white font-arabic">
                  {userProfile?.nom_fr && userProfile?.prenom_fr 
                    ? `${userProfile.prenom_fr} ${userProfile.nom_fr}`
                    : userProfile?.username
                  }
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-arabic">
                  {getRoleInArabic(userProfile?.role)}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {getInitials(userProfile?.username || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 dropdown-rtl" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2 text-start-rtl">
                    <p className="text-sm font-medium font-arabic">{userProfile?.username}</p>
                    <p className="text-xs text-muted-foreground font-arabic">{userProfile?.email || 'غير محدد'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileEdit} className="font-arabic cursor-pointer">
                    <User className="ml-2 h-4 w-4" />
                    <span>تعديل الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="font-arabic cursor-pointer">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>إعدادات الحساب</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsPasswordChangeOpen(true)} className="font-arabic cursor-pointer">
                    <Key className="ml-2 h-4 w-4" />
                    <span>تغيير كلمة المرور</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsNotificationSettingsOpen(true)} className="font-arabic cursor-pointer">
                    <Bell className="ml-2 h-4 w-4" />
                    <span>إعدادات الإشعارات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDataExportOpen(true)} className="font-arabic cursor-pointer">
                    <Download className="ml-2 h-4 w-4" />
                    <span>تحميل بيانات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsNotificationsOpen(true)} className="font-arabic cursor-pointer">
                    <Bell className="ml-2 h-4 w-4" />
                    <span>الإشعارات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('help')} className="font-arabic cursor-pointer">
                    <HelpCircle className="ml-2 h-4 w-4" />
                    <span>المساعدة والدعم</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 font-arabic cursor-pointer"
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rtl">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <BarChart3 className="w-4 h-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <BookOpen className="w-4 h-4" />
              الدروس
            </TabsTrigger>
            <TabsTrigger value="memoires-collaboratives" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <Users className="w-4 h-4" />
              مذكرات الزملاء
            </TabsTrigger>
            <TabsTrigger value="memoire" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <FileText className="w-4 h-4" />
              مذكرتي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <StagiaireOverview onTabChange={setActiveTab} />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-6">
            <StagiaireRelatedCourses />
          </TabsContent>

          <TabsContent value="memoires-collaboratives" className="space-y-6 mt-6">
            <CollaborativeMemoires />
          </TabsContent>

          <TabsContent value="memoire" className="space-y-6 mt-6">
            <MonMemoire />
          </TabsContent>

          <TabsContent value="help">
            <UserGuide />
          </TabsContent>
        </Tabs>


      </div>

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
              هل تريد تصدير جميع بياناتك الشخصية وأعمالك الأكاديمية؟ سيتم حفظ البيانات في ملف JSON.
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">تأكيد تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">
              هل أنت متأكد من أنك تريد تسجيل الخروج من حسابك؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 font-arabic"
            >
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Edit Dialog - Exactly like enseignant */}
      <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
        <DialogContent className="max-w-2xl dialog-rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-start-rtl">
            <DialogTitle className="font-arabic">تعديل الملف الشخصي</DialogTitle>
            <DialogDescription className="font-arabic">
              تحديث جميع معلومات ملفك الشخصي والتعليمي
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">معلومات الحساب</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="username" className="form-label-rtl font-arabic">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1"
                    dir="rtl"
                  />
                </div>
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

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">المعلومات الشخصية</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="prenom_fr" className="form-label-rtl font-arabic">الاسم (فرنسية)</Label>
                    <Input
                      id="prenom_fr"
                      value={profileForm.prenom_fr}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, prenom_fr: e.target.value }))}
                      className="mt-1"
                      dir="ltr"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom_fr" className="form-label-rtl font-arabic">اللقب (فرنسية)</Label>
                    <Input
                      id="nom_fr"
                      value={profileForm.nom_fr}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, nom_fr: e.target.value }))}
                      className="mt-1"
                      dir="ltr"
                      placeholder="Nom"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="prenom_ar" className="form-label-rtl font-arabic">الاسم (عربية)</Label>
                    <Input
                      id="prenom_ar"
                      value={profileForm.prenom_ar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, prenom_ar: e.target.value }))}
                      className="mt-1"
                      dir="rtl"
                      placeholder="الاسم"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom_ar" className="form-label-rtl font-arabic">اللقب (عربية)</Label>
                    <Input
                      id="nom_ar"
                      value={profileForm.nom_ar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, nom_ar: e.target.value }))}
                      className="mt-1"
                      dir="rtl"
                      placeholder="اللقب"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="date_naissance" className="form-label-rtl font-arabic">تاريخ الميلاد</Label>
                  <Input
                    id="date_naissance"
                    type="date"
                    value={profileForm.date_naissance}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, date_naissance: e.target.value }))}
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end flex-row-reverse pt-4 border-t">
              <Button onClick={handleProfileUpdate} disabled={loading} className="font-arabic">
                {loading ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
              </Button>
              <Button variant="outline" onClick={() => setIsProfileEditOpen(false)} className="font-arabic">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Settings Dialog - Exactly like enseignant */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إعدادات الحساب</DialogTitle>
            <DialogDescription>
              إدارة إعدادات حسابك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleProfileEdit}
              >
                <User className="w-4 h-4 mr-2" />
                تعديل المعلومات الشخصية
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsPasswordChangeOpen(true);
                }}
              >
                <Key className="w-4 h-4 mr-2" />
                تغيير كلمة المرور
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsNotificationSettingsOpen(true);
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                إعدادات الإشعارات
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsDataExportOpen(true);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                تحميل بياناتي
              </Button>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog - Exactly like enseignant with switches */}
      <Dialog open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إعدادات الإشعارات</DialogTitle>
            <DialogDescription>
              اختر نوع الإشعارات التي تريد تلقيها
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="emailNotifications" className="text-sm font-medium">
                  إشعارات بريد إلكتروني
                </label>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="memoireUpdates" className="text-sm font-medium">
                  إشعارات تحديثات المذكرة
                </label>
                <Switch
                  id="memoireUpdates"
                  checked={notificationSettings.memoireUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, memoireUpdates: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="newCourses" className="text-sm font-medium">
                  إشعارات الدروس الجديدة
                </label>
                <Switch
                  id="newCourses"
                  checked={notificationSettings.newCourses}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, newCourses: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="systemUpdates" className="text-sm font-medium">
                  إشعارات تحديثات النظام
                </label>
                <Switch
                  id="systemUpdates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsNotificationSettingsOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                toast({
                  title: 'نجح',
                  description: 'تم حفظ إعدادات الإشعارات بنجاح',
                });
                setIsNotificationSettingsOpen(false);
              }}>
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog - For viewing notifications from navbar */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-arabic">مركز الإشعارات</DialogTitle>
            <DialogDescription className="font-arabic">
              عرض وإدارة جميع إشعاراتك
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto">
            <NotificationCenter />
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Export Dialog - Updated like enseignant */}
      <AlertDialog open={isDataExportOpen} onOpenChange={setIsDataExportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">تحميل بياناتي</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">
              سيتم تحميل جميع بياناتك الشخصية والدروس والمذكرات في ملف JSON.
              هل أنت متأكد من المتابعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDataExport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 font-arabic"
            >
              {loading ? 'جاري التحميل...' : 'تحميل البيانات'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <MinistryFooter />
    </div>
  );
};

export default StagiaireDashboard;