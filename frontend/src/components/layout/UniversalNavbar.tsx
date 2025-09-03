import React, { useState } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  User, 
  LogOut, 
  Settings, 
  Key, 
  Bell, 
  Download, 
  HelpCircle, 
  Home,
  Building,
  GraduationCap,
  School,
  Crown
} from 'lucide-react';
import { apiService } from '@/services/api';

// Import des composants UserGuide spécifiques
import UserGuideStagiaire from '@/components/stagiaire/UserGuide';
import UserGuideEnseignant from '@/components/enseignant/UserGuide';
import UserGuideEtablissementFormation from '@/components/etablissement-formation/UserGuide';
import UserGuideEtablissementRegionale from '@/components/etablissement-regionale/UserGuide';
import UserGuideEtablissementNationale from '@/components/etablissement-nationale/UserGuide';

interface UniversalNavbarProps {
  onTabChange?: (tab: string) => void;
  currentRole?: string;
  onHelpClick?: () => void;
}

const UniversalNavbar: React.FC<UniversalNavbarProps> = ({ onTabChange, currentRole, onHelpClick }) => {
  const { userProfile, signOut } = useAuthApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
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
    niveau_formation: '',
    etablissement_origine: '',
    code: '',
    code_regionale: '',
    adresse_fr: '',
    adresse_ar: '',
    type_formation: '',
    capacite_accueil: '',
    grade: '',
    specialite: '',
    etablissement_affectation: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    updates: true,
    systemUpdates: false
  });

  // Initialize profile form when component mounts
  React.useEffect(() => {
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
  }, [userProfile]);

  // Handler functions
  const handleProfileEdit = () => {
    if (userProfile) {
      console.log('🔍 Setting profile form with userProfile data (UniversalNavbar):', userProfile);
      
      // Mettre à jour le formulaire selon le rôle
      const updatedForm = { ...profileForm };
      
      // Champs communs
      updatedForm.username = userProfile.username || '';
      updatedForm.email = userProfile.email || '';
      updatedForm.telephone = userProfile.telephone || '';
      
      // Champs spécifiques au rôle
      if (userProfile.role === 'EtablissementRegionale' || userProfile.role === 'EtablissementNationale') {
        updatedForm.nom_fr = userProfile.nom_fr || '';
        updatedForm.nom_ar = userProfile.nom_ar || '';
        updatedForm.code = userProfile.code || '';
        updatedForm.code_regionale = userProfile.code_regionale || '';
        updatedForm.adresse_fr = userProfile.adresse_fr || '';
        updatedForm.adresse_ar = userProfile.adresse_ar || '';
      } else if (userProfile.role === 'Stagiaire' || userProfile.role === 'Enseignant') {
        updatedForm.nom_fr = userProfile.nom_fr || '';
        updatedForm.prenom_fr = userProfile.prenom_fr || '';
        updatedForm.nom_ar = userProfile.nom_ar || '';
        updatedForm.prenom_ar = userProfile.prenom_ar || '';
        updatedForm.date_naissance = userProfile.date_naissance || '';
        updatedForm.niveau_formation = userProfile.niveau_formation || '';
        updatedForm.etablissement_origine = userProfile.etablissement_origine || '';
      } else if (userProfile.role === 'EtablissementFormation') {
        updatedForm.nom_fr = userProfile.nom_fr || '';
        updatedForm.nom_ar = userProfile.nom_ar || '';
        updatedForm.code = userProfile.code || '';
        updatedForm.adresse_fr = userProfile.adresse_fr || '';
        updatedForm.adresse_ar = userProfile.adresse_ar || '';
        updatedForm.type_formation = userProfile.type_formation || '';
        updatedForm.capacite_accueil = userProfile.capacite_accueil || '';
      }
      
      setProfileForm(updatedForm);
      console.log('🔍 Profile form updated to:', updatedForm);
    }
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
      
      // Export user profile data
      const exportData = {
        profile: userProfile,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${userProfile.username}-${new Date().toISOString().split('T')[0]}.json`;
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
      'EtablissementRegionale': 'مؤسسة جهوية',
      'EtablissementNationale': 'مؤسسة وطنية'
    };
    return roleMap[role] || role;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return <GraduationCap className="w-6 h-6 text-white" />;
      case 'Enseignant':
        return <User className="w-6 h-6 text-white" />;
      case 'EtablissementFormation':
        return <School className="w-6 h-6 text-white" />;
      case 'EtablissementRegionale':
        return <Building className="w-6 h-6 text-white" />;
      case 'EtablissementNationale':
        return <Crown className="w-6 h-6 text-white" />;
      default:
        return <Home className="w-6 h-6 text-white" />;
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return 'لوحة تحكم المتدرب';
      case 'Enseignant':
        return 'لوحة تحكم الأستاذ';
      case 'EtablissementFormation':
        return 'لوحة تحكم مؤسسة التكوين';
      case 'EtablissementRegionale':
        return 'لوحة تحكم الإدارة الجهوية';
      case 'EtablissementNationale':
        return 'لوحة تحكم الإدارة الوطنية';
      default:
        return 'لوحة التحكم';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return 'مرحباً بك في نظام إدارة التدريب';
      case 'Enseignant':
        return 'مرحباً بك في نظام إدارة التدريس';
      case 'EtablissementFormation':
        return 'مرحباً بك في نظام إدارة مؤسسة التكوين';
      case 'EtablissementRegionale':
        return 'مرحباً بك في نظام إدارة الإدارة الجهوية';
      case 'EtablissementNationale':
        return 'مرحباً بك في نظام إدارة الإدارة الوطنية';
      default:
        return 'مرحباً بك في نظام الإدارة';
    }
  };

  // Déterminer les champs de profil selon le rôle
  const getProfileFields = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return [
          { id: 'username', label: 'اسم المستخدم', type: 'text' },
          { id: 'nom_fr', label: 'الاسم العائلي (فرنسية)', type: 'text' },
          { id: 'prenom_fr', label: 'الاسم الشخصي (فرنسية)', type: 'text' },
          { id: 'nom_ar', label: 'الاسم العائلي (عربية)', type: 'text' },
          { id: 'prenom_ar', label: 'الاسم الشخصي (عربية)', type: 'text' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email' },
          { id: 'telephone', label: 'رقم الهاتف', type: 'text' },
          { id: 'date_naissance', label: 'تاريخ الميلاد', type: 'date' },
          { id: 'niveau_formation', label: 'مستوى التكوين', type: 'text' },
          { id: 'etablissement_origine', label: 'مؤسسة المنشأ', type: 'text' }
        ];
      
      case 'Enseignant':
        return [
          { id: 'username', label: 'اسم المستخدم', type: 'text' },
          { id: 'nom_fr', label: 'الاسم العائلي (فرنسية)', type: 'text' },
          { id: 'prenom_fr', label: 'الاسم الشخصي (فرنسية)', type: 'text' },
          { id: 'nom_ar', label: 'الاسم العائلي (عربية)', type: 'text' },
          { id: 'prenom_ar', label: 'الاسم الشخصي (عربية)', type: 'text' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email' },
          { id: 'telephone', label: 'رقم الهاتف', type: 'text' },
          { id: 'grade', label: 'الرتبة', type: 'text' },
          { id: 'specialite', label: 'التخصص', type: 'text' },
          { id: 'etablissement_affectation', label: 'مؤسسة الإلحاق', type: 'text' }
        ];
      
      case 'EtablissementFormation':
        return [
          { id: 'username', label: 'اسم المستخدم', type: 'text' },
          { id: 'nom_fr', label: 'اسم المؤسسة (فرنسية)', type: 'text' },
          { id: 'nom_ar', label: 'اسم المؤسسة (عربية)', type: 'text' },
          { id: 'code', label: 'رمز المؤسسة', type: 'text' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email' },
          { id: 'telephone', label: 'رقم الهاتف', type: 'text' },
          { id: 'adresse_fr', label: 'العنوان (فرنسية)', type: 'text' },
          { id: 'adresse_ar', label: 'العنوان (عربية)', type: 'text' },
          { id: 'type_formation', label: 'نوع التكوين', type: 'text' },
          { id: 'capacite_accueil', label: 'قدرة الاستقبال', type: 'number' }
        ];
      
      case 'EtablissementRegionale':
        return [
          { id: 'username', label: 'اسم المستخدم', type: 'text' },
          { id: 'nom_fr', label: 'اسم الإدارة (فرنسية)', type: 'text' },
          { id: 'nom_ar', label: 'اسم الإدارة (عربية)', type: 'text' },
          { id: 'code', label: 'رمز الإدارة', type: 'text' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email' },
          { id: 'telephone', label: 'رقم الهاتف', type: 'text' },
          { id: 'adresse_fr', label: 'العنوان (فرنسية)', type: 'text' },
          { id: 'adresse_ar', label: 'العنوان (عربية)', type: 'text' }
        ];
      
      case 'EtablissementNationale':
        return [
          { id: 'username', label: 'اسم المستخدم', type: 'text' },
          { id: 'nom_fr', label: 'اسم الإدارة (فرنسية)', type: 'text' },
          { id: 'nom_ar', label: 'اسم الإدارة (عربية)', type: 'text' },
          { id: 'code', label: 'رمز الإدارة', type: 'text' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email' },
          { id: 'telephone', label: 'رقم الهاتف', type: 'text' },
          { id: 'adresse_fr', label: 'العنوان (فرنسية)', type: 'text' },
          { id: 'adresse_ar', label: 'العنوان (عربية)', type: 'text' }
        ];
      
      default:
        return [
          { id: 'username', label: 'اسم المستخدم', type: 'text' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email' }
        ];
    }
  };

  // Déterminer le contenu d'aide selon le rôle
  const getHelpContent = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return {
          title: 'دليل المتدرب',
          sections: [
            {
              title: 'كيفية التسجيل في البرامج',
              content: 'تعلم كيفية التسجيل في البرامج التدريبية المتاحة'
            },
            {
              title: 'متابعة التقدم',
              content: 'كيفية متابعة تقدمك في البرامج المسجلة'
            },
            {
              title: 'إدارة الملف الشخصي',
              content: 'تحديث معلوماتك الشخصية والاتصال'
            },
            {
              title: 'التواصل مع الأساتذة',
              content: 'طرق التواصل مع الأساتذة المشرفين'
            }
          ]
        };
      
      case 'Enseignant':
        return {
          title: 'دليل الأستاذ',
          sections: [
            {
              title: 'إنشاء وإدارة البرامج',
              content: 'كيفية إنشاء وإدارة البرامج التدريبية'
            },
            {
              title: 'رفع المواد التعليمية',
              content: 'إرشادات رفع المواد التعليمية والملفات'
            },
            {
              title: 'متابعة المتدربين',
              content: 'كيفية متابعة تقدم المتدربين'
            },
            {
              title: 'إدارة الجدول الزمني',
              content: 'تنظيم الجدول الزمني للدروس'
            }
          ]
        };
      
      case 'EtablissementFormation':
        return {
          title: 'دليل مؤسسة التكوين',
          sections: [
            {
              title: 'إدارة البرامج',
              content: 'كيفية إدارة البرامج التدريبية'
            },
            {
              title: 'إدارة الأساتذة',
              content: 'إدارة قائمة الأساتذة والمشرفين'
            },
            {
              title: 'إدارة المتدربين',
              content: 'متابعة وتسجيل المتدربين'
            },
            {
              title: 'التقارير والإحصائيات',
              content: 'استخراج التقارير والإحصائيات'
            }
          ]
        };
      
      case 'EtablissementRegionale':
        return {
          title: 'دليل الإدارة الجهوية',
          sections: [
            {
              title: 'الإشراف على المؤسسات',
              content: 'كيفية الإشراف على المؤسسات التابعة'
            },
            {
              title: 'إدارة البرامج الجهوية',
              content: 'إنشاء وإدارة البرامج على المستوى الجهوي'
            },
            {
              title: 'التنسيق مع الإدارة الوطنية',
              content: 'آليات التنسيق مع الإدارة الوطنية'
            },
            {
              title: 'التقارير الجهوية',
              content: 'إعداد التقارير والإحصائيات الجهوية'
            }
          ]
        };
      
      case 'EtablissementNationale':
        return {
          title: 'دليل الإدارة الوطنية',
          sections: [
            {
              title: 'الإشراف العام',
              content: 'الإشراف العام على النظام التعليمي'
            },
            {
              title: 'إدارة السياسات',
              content: 'وضع وتطبيق السياسات التعليمية'
            },
            {
              title: 'التنسيق الوطني',
              content: 'التنسيق مع جميع الإدارات الجهوية'
            },
            {
              title: 'التقارير الوطنية',
              content: 'إعداد التقارير والإحصائيات الوطنية'
            }
          ]
        };
      
      default:
        return {
          title: 'الدليل العام',
          sections: [
            {
              title: 'الاستخدام الأساسي',
              content: 'الدليل الأساسي لاستخدام النظام'
            }
          ]
        };
    }
  };

  const getInitials = (username: string) => {
    return username?.charAt(0).toUpperCase() || 'U';
  };

  const getGradientColors = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return 'from-blue-500 to-purple-600';
      case 'Enseignant':
        return 'from-green-500 to-blue-600';
      case 'EtablissementFormation':
        return 'from-orange-500 to-red-600';
      case 'EtablissementRegionale':
        return 'from-indigo-500 to-purple-600';
      case 'EtablissementNationale':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      {/* Modern Header with User Profile */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${getGradientColors(userProfile?.role || '')} rounded-full flex items-center justify-center`}>
                {getRoleIcon(userProfile?.role || '')}
              </div>
              <div className="text-start-rtl">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
                  {getRoleTitle(userProfile?.role || '')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  {getRoleDescription(userProfile?.role || '')}
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
                      <AvatarFallback className={`bg-gradient-to-r ${getGradientColors(userProfile?.role || '')} text-white font-semibold`}>
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
                  <DropdownMenuItem onClick={() => onHelpClick ? onHelpClick() : setIsHelpOpen(true)} className="font-arabic cursor-pointer">
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

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-arabic">تعديل الملف الشخصي</DialogTitle>
            <DialogDescription className="font-arabic">
              قم بتحديث معلوماتك الشخصية
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {getProfileFields(userProfile?.role || '').map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="font-arabic">{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={profileForm[field.id as keyof typeof profileForm] || ''}
                  onChange={(e) => setProfileForm({ 
                    ...profileForm, 
                    [field.id]: e.target.value 
                  })}
                  className="font-arabic"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileEditOpen(false)} className="font-arabic">
              إلغاء
            </Button>
            <Button onClick={handleProfileUpdate} disabled={loading} className="font-arabic">
              {loading ? 'جاري التحديث...' : 'تحديث'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">تغيير كلمة المرور</DialogTitle>
            <DialogDescription className="font-arabic">
              قم بإدخال كلمة المرور الحالية والجديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="font-arabic">كلمة المرور الحالية</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="font-arabic"
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="font-arabic">كلمة المرور الجديدة</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="font-arabic"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="font-arabic">تأكيد كلمة المرور الجديدة</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="font-arabic"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordChangeOpen(false)} className="font-arabic">
              إلغاء
            </Button>
            <Button onClick={handlePasswordChange} disabled={loading} className="font-arabic">
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">إعدادات الحساب</DialogTitle>
            <DialogDescription className="font-arabic">
              قم بتخصيص إعدادات حسابك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="font-arabic">إشعارات البريد الإلكتروني</Label>
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates" className="font-arabic">إشعارات التحديثات</Label>
              <Switch
                id="updates"
                checked={notificationSettings.updates}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, updates: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="systemUpdates" className="font-arabic">تحديثات النظام</Label>
              <Switch
                id="systemUpdates"
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemUpdates: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)} className="font-arabic">
              حفظ الإعدادات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">إعدادات الإشعارات</DialogTitle>
            <DialogDescription className="font-arabic">
              قم بتخصيص إعدادات الإشعارات الخاصة بك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="font-arabic">إشعارات البريد الإلكتروني</Label>
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates" className="font-arabic">إشعارات التحديثات</Label>
              <Switch
                id="updates"
                checked={notificationSettings.updates}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, updates: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="systemUpdates" className="font-arabic">تحديثات النظام</Label>
              <Switch
                id="systemUpdates"
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemUpdates: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsNotificationSettingsOpen(false)} className="font-arabic">
              حفظ الإعدادات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Export Dialog */}
      <Dialog open={isDataExportOpen} onOpenChange={setIsDataExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">تحميل بيانات</DialogTitle>
            <DialogDescription className="font-arabic">
              قم بتحميل بياناتك الشخصية بصيغة JSON
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-arabic">
              سيتم تحميل ملف يحتوي على جميع بياناتك الشخصية والمعلومات المرتبطة بحسابك.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDataExportOpen(false)} className="font-arabic">
              إلغاء
            </Button>
            <Button onClick={handleDataExport} disabled={loading} className="font-arabic">
              {loading ? 'جاري التحميل...' : 'تحميل البيانات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-arabic text-2xl">
              المساعدة والدعم
            </DialogTitle>
            <DialogDescription className="font-arabic">
              دليل شامل لاستخدام النظام حسب دورك
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto">
            {(() => {
              switch (userProfile?.role) {
                case 'Stagiaire':
                  return <UserGuideStagiaire />;
                case 'Enseignant':
                  return <UserGuideEnseignant />;
                case 'EtablissementFormation':
                  return <UserGuideEtablissementFormation />;
                case 'EtablissementRegionale':
                  return <UserGuideEtablissementRegionale />;
                case 'EtablissementNationale':
                  return <UserGuideEtablissementNationale />;
                default:
                  return (
                    <div className="space-y-6">
                      {getHelpContent(userProfile?.role || '').sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-arabic">
                            {section.title}
                          </h3>
                          <p className="text-gray-600 font-arabic">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
              }
            })()}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHelpOpen(false)} className="font-arabic">
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
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

export default UniversalNavbar;
