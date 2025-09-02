import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DialogHeader, 
  DialogTitle 
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  FileText, 
  User, 
  LogOut, 
  Upload, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Key,
  Bell,
  Home,
  TrendingUp,
  Activity,
  Calendar,
  Download,
  Eye,
  HelpCircle,
  Link,
  Mail,
  Share2,
  Users
} from 'lucide-react';
// Component imports
import ProgrammeView from '@/components/enseignant/ProgrammeView';
import ProgrammeConsultation from '@/components/enseignant/ProgrammeConsultation';
import CoursManagement from '@/components/enseignant/CoursManagement';
import ModuleOverview from '@/components/enseignant/ModuleOverview';
import MemoireSupervision from '@/components/enseignant/MemoireSupervision';
import NotificationCenter from '@/components/enseignant/NotificationCenter';
import UserGuide from '@/components/enseignant/UserGuide';
import CollaborativeCourses from '@/components/enseignant/CollaborativeCourses';
import MinistryFooter from '@/components/layout/MinistryFooter';

interface DashboardStats {
  totalCours: number;
  coursValides: number;
  coursEnAttente: number;
  totalMemoires: number;
  modulesEnseignes: number;
}

interface RecentActivity {
  id: string;
  type: 'course_upload' | 'course_validated' | 'course_rejected' | 'memoire_submitted';
  title: string;
  description: string;
  date: string;
  status?: string;
}

const EnseignantDashboard = () => {
  const { user, userProfile, signOut } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dialog states
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    nom_fr: '',
    prenom_fr: '',
    nom_ar: '',
    prenom_ar: '',
    email: '',
    telephone: '',
    date_naissance: '',
    grade: '',
    etablissement_formation: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseValidation: true,
    newSubmissions: true,
    systemUpdates: false
  });
  
  const [loading, setLoading] = useState(false);
  
  // Dashboard data states
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCours: 0,
    coursValides: 0,
    coursEnAttente: 0,
    totalMemoires: 0,
    modulesEnseignes: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchDashboardData();
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
        grade: userProfile.grade || '',
        etablissement_formation: userProfile.etablissement_formation || ''
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
      
      const coursData = await apiService.getCoursByEnseignant(userProfile.id_enseignant);
      const modulesData = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      
      const exportData = {
        profile: userProfile,
        courses: coursData.data || [],
        modules: modulesData.data || [],
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-data-${userProfile.username}-${new Date().toISOString().split('T')[0]}.json`;
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

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      
      // Fetch courses statistics
      const coursResponse = await apiService.getCoursByEnseignant(userProfile.id_enseignant);
      const cours = coursResponse.data || [];
      
      // Fetch modules
      const modulesResponse = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      console.log('🔍 Modules Response:', modulesResponse);
      console.log('🔍 Modules Response Type:', typeof modulesResponse);
      console.log('🔍 Modules Response Keys:', Object.keys(modulesResponse || {}));
      console.log('🔍 Full Modules Response:', JSON.stringify(modulesResponse, null, 2));
      
      // Ensure modules is always an array
      let modules = [];
      if (modulesResponse && modulesResponse.data) {
        if (Array.isArray(modulesResponse.data)) {
          modules = modulesResponse.data;
        } else if (typeof modulesResponse.data === 'object') {
          // If data is an object, try to extract modules from it
          console.log('🔍 modulesResponse.data is object, checking for modules property');
          if (modulesResponse.data.modules && Array.isArray(modulesResponse.data.modules)) {
            modules = modulesResponse.data.modules;
          } else if (modulesResponse.data.data && Array.isArray(modulesResponse.data.data)) {
            modules = modulesResponse.data.data;
          }
        }
      }
      
      console.log('🔍 Final modules array:', modules);
      console.log('🔍 Modules Length:', modules.length);
      console.log('🔍 Is Array:', Array.isArray(modules));
      
      // Fetch memoires (if available)
      let memoires = [];
      try {
        const memoireResponse = await apiService.getMemoiresByEnseignant(userProfile.id_enseignant);
        memoires = memoireResponse.data || [];
      } catch (error) {
        console.log('Memoire endpoint not available yet');
      }
      
      // Calculate statistics
      const newStats = {
        totalCours: cours.length,
        coursValides: cours.filter((c: any) => c.status === 'مقبول').length,
        coursEnAttente: cours.filter((c: any) => c.status === 'في_الانتظار').length,
        totalMemoires: memoires.length,
        modulesEnseignes: modules.length
      };
      
      console.log('🔍 Calculated Stats:', newStats);
      console.log('🔍 Modules count for stats:', modules.length);
      setStats(newStats);
      
      // Generate recent activities from courses
      const activities: RecentActivity[] = cours
        .slice(-5)
        .map((course: any, index: number) => ({
          id: course.id_cours || index.toString(),
          type: course.status === 'مقبول' ? 'course_validated' : 'course_upload',
          title: course.titre_ar || course.titre_fr || 'درس جديد',
          description: `تم رفع الدرس ${course.status === 'مقبول' ? 'وتم قبوله' : 'وهو في انتظار المراجعة'}`,
          date: course.created_at || new Date().toISOString(),
          status: course.status
        }));
      
      setRecentActivities(activities);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات لوحة التحكم',
        variant: 'destructive'
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  const getInitials = (username: string) => {
    return username?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleInArabic = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'مدير',
      'stagiaire': 'متدرب',
      'enseignant': 'أستاذ',
      'Enseignant': 'أستاذ',
      'etablissement_formation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مقر جهوي',
      'etablissement_nationale': 'مقر وطني'
    };
    return roleMap[role] || role;
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">لوحة تحكم الأستاذ</h1>
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
                  <DropdownMenuItem onClick={handleProfileEdit} className="font-arabic">
                    <User className="ml-2 h-4 w-4" />
                    <span>تعديل الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="font-arabic">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>إعدادات الحساب</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsPasswordChangeOpen(true)} className="font-arabic">
                    <Key className="ml-2 h-4 w-4" />
                    <span>تغيير كلمة المرور</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsNotificationSettingsOpen(true)} className="font-arabic">
                    <Bell className="ml-2 h-4 w-4" />
                    <span>إعدادات الإشعارات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDataExportOpen(true)} className="font-arabic">
                    <Download className="ml-2 h-4 w-4" />
                    <span>تحميل بيانات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab('notifications')} className="font-arabic">
                    <Bell className="ml-2 h-4 w-4" />
                    <span>الإشعارات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('help')} className="font-arabic">
                    <HelpCircle className="ml-2 h-4 w-4" />
                    <span>المساعدة والدعم</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 font-arabic"
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
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <BarChart3 className="w-4 h-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="cours" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <Upload className="w-4 h-4" />
              الدروس
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <Users className="w-4 h-4" />
              دروس تعاونية
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <BookOpen className="w-4 h-4" />
              المواد
            </TabsTrigger>
            <TabsTrigger value="programmes" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <FileText className="w-4 h-4" />
              البرامج
            </TabsTrigger>
            <TabsTrigger value="memoires" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-arabic">
              <FileText className="w-4 h-4" />
              المذكرات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-s-rtl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-start-rtl">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 font-arabic">إجمالي الدروس</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 font-arabic">{loading ? '-' : stats.totalCours}</p>
                    </div>
                    <div className="p-3 bg-blue-200 dark:bg-blue-800/50 rounded-full">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-s-rtl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-start-rtl">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 font-arabic">دروس معتمدة</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-arabic">{loading ? '-' : stats.coursValides}</p>
                    </div>
                    <div className="p-3 bg-green-200 dark:bg-green-800/50 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-s-rtl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-start-rtl">
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 font-arabic">في الانتظار</p>
                      <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 font-arabic">{loading ? '-' : stats.coursEnAttente}</p>
                    </div>
                    <div className="p-3 bg-yellow-200 dark:bg-yellow-800/50 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-s-rtl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-start-rtl">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400 font-arabic">المواد</p>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 font-arabic">{loading ? '-' : stats.modulesEnseignes}</p>
                    </div>
                    <div className="p-3 bg-purple-200 dark:bg-purple-800/50 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* User Profile Card */}
              <Card className="lg:col-span-2">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-arabic">معلومات الملف الشخصي</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">المعلومات الأساسية</h3>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المستخدم</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userProfile?.username || 'غير محدد'}</p>
                      </div>
                      
                      <div className="grid gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الاسم الكامل بالفرنسية</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {userProfile?.prenom_fr && userProfile?.nom_fr 
                              ? `${userProfile.prenom_fr} ${userProfile.nom_fr}`
                              : 'غير محدد'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الاسم الكامل بالعربية</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                            {userProfile?.prenom_ar && userProfile?.nom_ar 
                              ? `${userProfile.prenom_ar} ${userProfile.nom_ar}`
                              : 'غير محدد'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ الميلاد</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                          {userProfile?.date_naissance 
                            ? formatDate(userProfile.date_naissance)
                            : 'غير محدد'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {/* Contact & Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">معلومات الاتصال والعمل</h3>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">البريد الإلكتروني</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white" dir="ltr">
                          {userProfile?.email || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">رقم الهاتف</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white" dir="ltr">
                          {userProfile?.telephone || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الدرجة العلمية</p>
                        <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 font-arabic">
                          {userProfile?.grade || 'غير محدد'}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">مؤسسة التكوين</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                          {userProfile?.etablissement_formation || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الدور</p>
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 font-arabic">
                          {getRoleInArabic(userProfile?.role)}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ إنشاء الحساب</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                          {userProfile?.created_at 
                            ? formatDate(userProfile.created_at)
                            : 'غير محدد'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary Statistics */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4">إحصائيات سريعة</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCours}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-arabic">إجمالي الدروس</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.coursValides}</p>
                        <p className="text-sm text-green-600 dark:text-green-400 font-arabic">دروس معتمدة</p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.coursEnAttente}</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-arabic">في الانتظار</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.modulesEnseignes}</p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-arabic">المواد</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button 
                    onClick={() => setActiveTab('cours')}
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    إدارة الدروس
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('collaborative')}
                    variant="outline" 
                    className="w-full justify-start hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-900/20"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    الدروس التعاونية
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('modules')}
                    variant="outline" 
                    className="w-full justify-start hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    عرض المواد
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('memoires')}
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    إدارة المذكرات
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  الأنشطة الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل الأنشطة...</p>
                  </div>
                ) : recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'course_validated' ? 'bg-green-100 dark:bg-green-900/50' :
                          activity.type === 'course_rejected' ? 'bg-red-100 dark:bg-red-900/50' :
                          'bg-blue-100 dark:bg-blue-900/50'
                        }`}>
                          {activity.type === 'course_validated' ? <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                           activity.type === 'course_rejected' ? <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> :
                           <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                        {formatDate(activity.date)}
                          </p>
                        </div>
                        {activity.status && (
                          <Badge 
                            variant={activity.status === 'مقبول' ? 'default' : 'secondary'}
                            className={activity.status === 'مقبول' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {activity.status === 'مقبول' ? 'معتمد' : 'في الانتظار'}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">لا توجد أنشطة حديثة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cours">
            <CoursManagement />
          </TabsContent>

          <TabsContent value="collaborative">
            <CollaborativeCourses />
          </TabsContent>

          <TabsContent value="modules">
            <ModuleOverview />
          </TabsContent>

          <TabsContent value="programmes">
            <ProgrammeView />
          </TabsContent>

          <TabsContent value="memoires">
            <MemoireSupervision />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-arabic">معلومات الملف الشخصي المفصلة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">المعلومات الشخصية</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المستخدم</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userProfile?.username || 'غير محدد'}</p>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الاسم بالفرنسية</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{userProfile?.prenom_fr || 'غير محدد'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اللقب بالفرنسية</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{userProfile?.nom_fr || 'غير محدد'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الاسم بالعربية</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">{userProfile?.prenom_ar || 'غير محدد'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اللقب بالعربية</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">{userProfile?.nom_ar || 'غير محدد'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ الميلاد</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                          {userProfile?.date_naissance 
                            ? formatDate(userProfile.date_naissance)
                            : 'غير محدد'
                          }
                          {userProfile?.date_naissance && (
                            <span className="text-sm text-gray-500 mr-2">
                              ({new Date().getFullYear() - new Date(userProfile.date_naissance).getFullYear()} سنة)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">معلومات الاتصال</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">البريد الإلكتروني</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white" dir="ltr">
                          {userProfile?.email || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">رقم الهاتف</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white" dir="ltr">
                          {userProfile?.telephone || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleProfileEdit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-arabic"
                  >
                    <Settings className="w-4 h-4 ml-2" />
                    تعديل الملف الشخصي
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-arabic">المعلومات المهنية وإعدادات الحساب</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Professional Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">المعلومات المهنية</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الدرجة العلمية</label>
                          <div className="mt-1">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 font-arabic">
                              {userProfile?.grade || 'غير محدد'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">مؤسسة التكوين</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                            {userProfile?.etablissement_formation || 'غير محدد'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الدور في النظام</label>
                          <div className="mt-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 font-arabic">
                              {getRoleInArabic(userProfile?.role)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ إنشاء الحساب</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                                                      {userProfile?.created_at 
                            ? formatDate(userProfile.created_at)
                            : 'غير محدد'
                          }
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">آخر تحديث</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                                                      {userProfile?.updated_at 
                            ? formatDate(userProfile.updated_at)
                            : 'غير محدد'
                          }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Account Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">إجراءات الحساب</h3>
                      <div className="space-y-4">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start font-arabic"
                          onClick={() => setIsPasswordChangeOpen(true)}
                        >
                          <Key className="w-4 h-4 ml-2" />
                          تغيير كلمة المرور
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start font-arabic"
                          onClick={() => setIsNotificationSettingsOpen(true)}
                        >
                          <Bell className="w-4 h-4 ml-2" />
                          إعدادات الإشعارات
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start font-arabic"
                          onClick={() => setIsDataExportOpen(true)}
                        >
                          <Download className="w-4 h-4 ml-2" />
                          تحميل بياناتي
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => setIsLogoutConfirmOpen(true)}
                          className="w-full justify-start font-arabic"
                        >
                          <LogOut className="w-4 h-4 ml-2" />
                          تسجيل الخروج
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="help">
            <UserGuide />
          </TabsContent>
        </Tabs>
      </div>

      {/* Ministry Footer - Full Width */}
      <MinistryFooter onHelpClick={() => setActiveTab('help')} />

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
        <DialogContent className="max-w-2xl dialog-rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-start-rtl">
            <DialogTitle className="font-arabic">تعديل الملف الشخصي</DialogTitle>
            <DialogDescription className="font-arabic">
              تحديث جميع معلومات ملفك الشخصي والمهني
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Account Information Section */}
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

            {/* Personal Information Section */}
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

            {/* Professional Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic mb-4 border-b pb-2">المعلومات المهنية</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="grade" className="form-label-rtl font-arabic">الدرجة العلمية</Label>
                  <Input
                    id="grade"
                    value={profileForm.grade}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, grade: e.target.value }))}
                    className="mt-1"
                    dir="rtl"
                    placeholder="مثال: أستاذ محاضر - أستاذ مساعد"
                  />
                </div>
                <div>
                  <Label htmlFor="etablissement_formation" className="form-label-rtl font-arabic">مؤسسة التكوين</Label>
                  <Input
                    id="etablissement_formation"
                    value={profileForm.etablissement_formation}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, etablissement_formation: e.target.value }))}
                    className="mt-1"
                    dir="rtl"
                    placeholder="اسم مؤسسة التكوين"
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

      {/* Password Change Dialog */}
      <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور</DialogTitle>
            <DialogDescription>
              أدخل كلمة المرور الحالية والجديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsPasswordChangeOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handlePasswordChange} disabled={loading}>
                {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Settings Dialog */}
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

      {/* Notification Settings Dialog */}
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
                <label htmlFor="courseValidation" className="text-sm font-medium">
                  إشعارات قبول الدروس
                </label>
                <Switch
                  id="courseValidation"
                  checked={notificationSettings.courseValidation}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, courseValidation: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="newSubmissions" className="text-sm font-medium">
                  إشعارات التقديمات الجديدة
                </label>
                <Switch
                  id="newSubmissions"
                  checked={notificationSettings.newSubmissions}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, newSubmissions: checked }))
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

      {/* Data Export Dialog */}
      <AlertDialog open={isDataExportOpen} onOpenChange={setIsDataExportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تحميل بياناتي</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم تحميل جميع بياناتك الشخصية والدروس والمواد في ملف JSON.
              هل أنت متأكد من المتابعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDataExport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'جاري التحميل...' : 'تحميل البيانات'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد تسجيل الخروج من النظام؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnseignantDashboard;