import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  School,
  Mail, 
  Phone, 
  MapPin, 
  IdCard, 
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  HelpCircle
} from 'lucide-react';
import { useAuthApi } from '@/hooks/useAuthApi';
import ProgrammeManagementExtraordinary from '@/components/etablissement-regionale/ProgrammeManagementExtraordinary';
import CoursManagement from '@/components/etablissement-regionale/CoursManagement';
import SimpleTreeView from '@/components/ui/simple-tree-view';
import SimpleDetailsPanel from '@/components/ui/simple-details-panel';
import StepNavigation from '@/components/ui/step-navigation';
import UniversalNavbar from '@/components/layout/UniversalNavbar';
import MinistryFooter from '@/components/layout/MinistryFooter';
import NotificationCenter from '@/components/etablissement-regionale/NotificationCenter';
import UserGuide from '@/components/etablissement-regionale/UserGuide';
import UserGuideEtablissementRegionale from '@/components/etablissement-regionale/UserGuide';

const EtablissementRegionaleDashboardPage = () => {
  const { userProfile, request } = useAuthApi();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProgrammes: 0,
    programmesApprouves: 0,
    programmesEnAttente: 0,
    programmesRefuses: 0,
    totalCours: 0,
    coursApprouves: 0,
    coursEnAttente: 0,
    coursRefuses: 0,
    totalBranches: 0,
    totalSpecialites: 0,
    totalModules: 0
  });
  const [loading, setLoading] = useState(true);
  const [infrastructureData, setInfrastructureData] = useState({
    branches: [],
    selectedBranch: null,
    selectedSpeciality: null
  });
  const [infrastructureLoading, setInfrastructureLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [currentStep, setCurrentStep] = useState<'branch' | 'speciality' | 'module' | null>(null);
  
  // Dialog states for navbar functionality
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    nom_fr: '',
    nom_ar: '',
    email: '',
    telephone: '',
    adresse_fr: '',
    adresse_ar: '',
    code: '',
    code_regionale: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    programmeUpdates: true,
    courseUpdates: true,
    infrastructureUpdates: true,
    systemUpdates: false
  });

  useEffect(() => {
    if (userProfile) {
      console.log('🔍 UserProfile data (EtablissementRegionale):', userProfile);
      console.log('🔍 Code:', userProfile.code);
      console.log('🔍 Code Regionale:', userProfile.code_regionale);
      console.log('🔍 Nom AR:', userProfile.nom_ar);
      console.log('🔍 Nom FR:', userProfile.nom_fr);
      console.log('🔍 Adresse AR:', userProfile.adresse_ar);
      console.log('🔍 Adresse FR:', userProfile.adresse_fr);
      console.log('🔍 Email:', userProfile.email);
      console.log('🔍 Telephone:', userProfile.telephone);
      console.log('🔍 Toutes les clés:', Object.keys(userProfile));
      console.log('🔍 Valeurs complètes:', JSON.stringify(userProfile, null, 2));
      
      fetchDashboardData();
    }
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === 'infrastructure' && userProfile) {
      fetchInfrastructureData();
    }
  }, [activeTab, userProfile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch programmes statistics
      const programmesRes = await request('/programme/stats');
      
      // Fetch courses statistics
      const coursRes = await request('/cours/stats');
      
      // Fetch branches, specialites and modules count
      const branchesRes = await request('/branche/count');
      const specialitesRes = await request('/specialite/count');
      const modulesRes = await request('/module/count');
      
      // Handle double data wrapper structure: {data: {data: {...}}}
      const programmes = programmesRes?.data?.data || programmesRes?.data || programmesRes;
      const cours = coursRes?.data?.data || coursRes?.data || coursRes;
      const branches = branchesRes?.data?.data || branchesRes?.data || branchesRes;
      const specialites = specialitesRes?.data?.data || specialitesRes?.data || specialitesRes;
      const modules = modulesRes?.data?.data || modulesRes?.data || modulesRes;
      
      console.log('📊 Raw programmes response:', programmesRes);
      console.log('📊 Raw cours response:', coursRes);
      console.log('📊 Raw branches response:', branchesRes);
      console.log('📊 Raw specialites response:', specialitesRes);
      console.log('📊 Raw modules response:', modulesRes);
      
      console.log('📊 Processed programmes data:', programmes);
      console.log('📊 Processed cours data:', cours);
      console.log('📊 Processed branches data:', branches);
      console.log('📊 Processed specialites data:', specialites);
      console.log('📊 Processed modules data:', modules);
      
      console.log('📊 programmes object:', programmes);
      console.log('📊 cours object:', cours);
      console.log('📊 branches object:', branches);
      console.log('📊 specialites object:', specialites);
      console.log('📊 modules object:', modules);
      
      console.log('🔍 Checking if programmes and cours exist:', { 
        programmes: !!programmes, 
        cours: !!cours,
        programmesType: typeof programmes,
        coursType: typeof cours
      });
      
      if (programmes && cours) {
        // Handle programmes with parStatut structure
        const programmesStats = {
          total: programmes.total || 0,
          approuves: programmes.parStatut?.مقبول || 0,
          enAttente: programmes.parStatut?.في_الانتظار || 0,
          refuses: programmes.parStatut?.مرفوض || 0
        };
        
        console.log('📊 programmesStats:', programmesStats);
        
        // Handle cours with parStatut structure
        const coursStats = {
          total: cours.total || 0,
          approuves: cours.parStatut?.مقبول || 0,
          enAttente: cours.parStatut?.في_الانتظار || 0,
          refuses: cours.parStatut?.مرفوض || 0
        };
        
        console.log('📊 coursStats:', coursStats);
        
        const newStats = {
          totalProgrammes: programmesStats.total,
          programmesApprouves: programmesStats.approuves,
          programmesEnAttente: programmesStats.enAttente,
          programmesRefuses: programmesStats.refuses,
          totalCours: coursStats.total,
          coursApprouves: coursStats.approuves,
          coursEnAttente: coursStats.enAttente,
          coursRefuses: coursStats.refuses,
          totalBranches: branches?.count || 0,
          totalSpecialites: specialites?.count || 0,
          totalModules: modules?.count || 0
        };
        
        console.log('📊 Setting new stats:', newStats);
        console.log('📊 Current stats before setStats:', stats);
        setStats(newStats);
        console.log('📊 Stats should be updated now');
      } else {
        console.warn('⚠️ programmes or cours is missing:', { programmes, cours });
        console.warn('⚠️ programmes type:', typeof programmes);
        console.warn('⚠️ cours type:', typeof cours);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInfrastructureData = async () => {
    try {
      setInfrastructureLoading(true);
      const branchesRes = await request('/branche/with-details');
      console.log('🌳 Branches with details response:', branchesRes);
      console.log('🌳 Type of branchesRes:', typeof branchesRes);
      console.log('🌳 Is branchesRes an array?', Array.isArray(branchesRes));
      console.log('🌳 branchesRes.data:', branchesRes?.data);
      console.log('🌳 Is branchesRes.data an array?', Array.isArray(branchesRes?.data));
      
      // Handle double data wrapper: {data: {data: [...]}}
      let branches = null;
      if (branchesRes && branchesRes.data) {
        if (Array.isArray(branchesRes.data)) {
          // Direct array: {data: [...]}
          branches = branchesRes.data;
        } else if (branchesRes.data.data && Array.isArray(branchesRes.data.data)) {
          // Double wrapper: {data: {data: [...]}}
          branches = branchesRes.data.data;
        }
      }
      
      if (branches && Array.isArray(branches)) {
        console.log('🌳 Extracted branches:', branches);
        console.log('🌳 Number of branches:', branches.length);
        
        setInfrastructureData(prev => ({
          ...prev,
          branches: branches
        }));
        
        // Transformer les données en structure arborescente
        const treeDataTransformed = transformToTreeData(branches);
        console.log('🌳 Transformed tree data:', treeDataTransformed);
        setTreeData(treeDataTransformed);
      } else {
        console.warn('⚠️ No branches data found or invalid format:', branchesRes);
        console.warn('⚠️ branchesRes:', branchesRes);
        console.warn('⚠️ branchesRes.data:', branchesRes?.data);
        setTreeData([]);
        setInfrastructureData(prev => ({
          ...prev,
          branches: []
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'infrastructure:', error);
      setTreeData([]);
      setInfrastructureData(prev => ({
        ...prev,
        branches: []
      }));
    } finally {
      setInfrastructureLoading(false);
    }
  };

  const handleBranchSelect = (branch) => {
    setInfrastructureData(prev => ({
      ...prev,
      selectedBranch: branch,
      selectedSpeciality: null
    }));
  };

  const handleSpecialitySelect = (speciality) => {
    setInfrastructureData(prev => ({
      ...prev,
      selectedSpeciality: speciality
    }));
  };

  const transformToTreeData = (branches) => {
    return branches.map(branch => ({
      id: branch.id_branche,
      label: branch.designation_fr,
      labelAr: branch.designation_ar,
      labelFr: branch.designation_fr,
      code: branch.code_branche,
      count: branch.specialitesCount,
      type: 'branch' as const,
      children: branch.specialites?.map(speciality => ({
        id: speciality.id_specialite,
        label: speciality.designation_fr,
        labelAr: speciality.designation_ar,
        labelFr: speciality.designation_fr,
        code: speciality.code_specialite,
        count: speciality.modulesCount,
        type: 'speciality' as const,
        children: speciality.modules?.map(module => ({
          id: module.id_module,
          label: module.designation_fr,
          labelAr: module.designation_ar,
          labelFr: module.designation_fr,
          code: module.code_module,
          type: 'module' as const
        })) || []
      })) || []
    }));
  };

  const handleTreeNodeSelect = (node) => {
    setSelectedTreeNode(node);
    
    // Mettre à jour l'étape actuelle
    if (node.type === 'branch') {
      setCurrentStep('branch');
    } else if (node.type === 'speciality') {
      setCurrentStep('speciality');
    } else if (node.type === 'module') {
      setCurrentStep('module');
    }
  };

  const handleStepClick = (step: 'branch' | 'speciality' | 'module') => {
    setCurrentStep(step);
    
    // Filtrer les données selon l'étape
    if (step === 'branch') {
      setSelectedTreeNode(null);
    } else if (step === 'speciality' && infrastructureData.selectedBranch) {
      setSelectedTreeNode(infrastructureData.selectedBranch);
    } else if (step === 'module' && infrastructureData.selectedSpeciality) {
      setSelectedTreeNode(infrastructureData.selectedSpeciality);
    }
  };

  const handleHomeClick = () => {
    setCurrentStep(null);
    setSelectedTreeNode(null);
    setInfrastructureData(prev => ({
      ...prev,
      selectedBranch: null,
      selectedSpeciality: null
    }));
  };

  // Handler functions for navbar functionality
  const handleProfileEdit = () => {
    if (userProfile) {
      console.log('🔍 Setting profile form with userProfile data (EtablissementRegionale):', userProfile);
      setProfileForm({
        username: userProfile.username || '',
        nom_fr: userProfile.nom_fr || '',
        nom_ar: userProfile.nom_ar || '',
        email: userProfile.email || '',
        telephone: userProfile.telephone || '',
        adresse_fr: userProfile.adresse_fr || '',
        adresse_ar: userProfile.adresse_ar || '',
        code: userProfile.code || '',
        code_regionale: userProfile.code_regionale || ''
      });
      console.log('🔍 Profile form set to:', profileForm);
    }
    setIsProfileEditOpen(true);
  };

  const handleProfileSave = async () => {
    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just close the dialog
      setIsProfileEditOpen(false);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        // Show error toast
        return;
      }
      // Here you would typically make an API call to change the password
      setIsPasswordChangeOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // You could add a success toast here
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleDataExport = async () => {
    try {
      // Create data object for export
      const exportData = {
        profile: userProfile,
        stats: stats,
        infrastructure: infrastructureData,
        exportDate: new Date().toISOString()
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `etablissement-regionale-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDataExportOpen(false);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleLogoutConfirm = () => {
    // This would typically call the signOut function from useAuthApi
    setIsLogoutConfirmOpen(false);
    // You could add the actual logout logic here
  };

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Universal Navbar */}
                             <UniversalNavbar 
           onTabChange={setActiveTab} 
           currentRole={userProfile?.role}
           onHelpClick={() => setActiveTab('help')}
         />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                           <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2 space-x-reverse">
                <BarChart3 className="w-4 h-4" />
                <span>نظرة عامة</span>
              </TabsTrigger>
              <TabsTrigger value="cours" className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="w-4 h-4" />
                <span>الدروس</span>
              </TabsTrigger>
              <TabsTrigger value="programmes" className="flex items-center space-x-2 space-x-reverse">
                <GraduationCap className="w-4 h-4" />
                <span>البرامج</span>
              </TabsTrigger>
              <TabsTrigger value="infrastructure" className="flex items-center space-x-2 space-x-reverse">
                <Building className="w-4 h-4" />
                <span>البنية التحتية</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-arabic">جارٍ تحميل الإحصائيات...</p>
              </div>
            ) : (
              <>
                {/* Infrastructure Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 rtl">
                  <Card className="border-r-4 border-r-teal-500 bg-gradient-to-l from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <p className="text-sm font-medium text-teal-600 dark:text-teal-400 font-arabic">إجمالي الفروع</p>
                          <p className="text-3xl font-bold text-teal-700 dark:text-teal-300 font-arabic">{stats.totalBranches}</p>
                          <p className="text-xs text-teal-500 font-arabic">فرع</p>
                        </div>
                        <div className="p-3 bg-teal-200 dark:bg-teal-800/50 rounded-full">
                          <Building className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-r-4 border-r-cyan-500 bg-gradient-to-l from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 font-arabic">إجمالي التخصصات</p>
                          <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 font-arabic">{stats.totalSpecialites}</p>
                          <p className="text-xs text-cyan-500 font-arabic">تخصص</p>
                        </div>
                        <div className="p-3 bg-cyan-200 dark:bg-cyan-800/50 rounded-full">
                          <GraduationCap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-r-4 border-r-amber-500 bg-gradient-to-l from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <p className="text-sm font-medium text-amber-600 dark:text-amber-400 font-arabic">إجمالي المواد</p>
                          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 font-arabic">{stats.totalModules}</p>
                          <p className="text-xs text-amber-500 font-arabic">مادة</p>
                        </div>
                        <div className="p-3 bg-amber-200 dark:bg-amber-800/50 rounded-full">
                          <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Information Section */}
                <Card className="rtl">
                  <CardHeader className="bg-gradient-to-l from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <CardTitle className="flex items-center gap-3 justify-start rtl">
                      <span className="font-arabic text-right">معلومات المؤسسة الإقليمية</span>
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 rtl">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2 text-right">المعلومات الأساسية</h3>
                        
                        <div className="space-y-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المستخدم</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">{userProfile?.username || 'غير محدد'}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المؤسسة بالفرنسية</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                              {userProfile?.nom_fr || 'غير محدد'}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المؤسسة بالعربية</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                              {userProfile?.nom_ar || 'غير محدد'}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الدور</p>
                            <div className="flex items-center gap-2 justify-end">
                              <Badge variant="secondary" className="font-arabic">
                                مؤسسة إقليمية
                              </Badge>
                              <IdCard className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2 text-right">معلومات الاتصال</h3>
                        
                        <div className="space-y-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">البريد الإلكتروني</p>
                            <div className="flex items-center gap-2 justify-end">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                                {userProfile?.email || 'غير محدد'}
                              </p>
                              <Mail className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">رقم الهاتف</p>
                            <div className="flex items-center gap-2 justify-end">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                                {userProfile?.telephone || 'غير محدد'}
                              </p>
                              <Phone className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">العنوان</p>
                            <div className="flex items-center gap-2 justify-end">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                                {userProfile?.adresse_ar || userProfile?.adresse_fr || 'غير محدد'}
                              </p>
                              <MapPin className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ التسجيل</p>
                            <div className="flex items-center gap-2 justify-end">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                                {userProfile?.created_at 
                                  ? new Date(userProfile.created_at).toLocaleDateString('ar-DZ', {
                                      year: 'numeric',
                                      month: 'long', 
                                      day: 'numeric'
                                    })
                                  : 'غير محدد'
                                }
                              </p>
                              <Calendar className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="cours" className="space-y-6">
            <CoursManagement />
          </TabsContent>

          <TabsContent value="programmes" className="space-y-6">
            <ProgrammeManagementExtraordinary />
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            {infrastructureLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-arabic">جارٍ تحميل بيانات البنية التحتية...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Infrastructure Overview - Statistiques principales */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Building className="w-8 h-8 text-blue-600" />
                      </div>
                      <span className="font-arabic text-blue-900">نظرة عامة على البنية التحتية</span>
                    </CardTitle>
                    <p className="text-blue-700 font-arabic">إحصائيات شاملة للفروع والتخصصات والمواد</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3 rtl">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalBranches}</div>
                        <p className="text-lg font-semibold text-blue-800 font-arabic">إجمالي الفروع</p>
                        <p className="text-sm text-blue-600 font-arabic">تقسيمات رئيسية</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
                        <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalSpecialites}</div>
                        <p className="text-lg font-semibold text-green-800 font-arabic">إجمالي التخصصات</p>
                        <p className="text-sm text-green-600 font-arabic">مجالات تعليمية</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-orange-100">
                        <div className="text-4xl font-bold text-orange-600 mb-2">{stats.totalModules}</div>
                        <p className="text-lg font-semibold text-orange-800 font-arabic">إجمالي المواد</p>
                        <p className="text-sm text-orange-600 font-arabic">وحدات تعليمية</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation par étapes */}
                <StepNavigation
                  currentStep={currentStep}
                  selectedBranch={infrastructureData.selectedBranch}
                  selectedSpeciality={infrastructureData.selectedSpeciality}
                  onStepClick={handleStepClick}
                  onHomeClick={handleHomeClick}
                  className="mb-6"
                />

                {/* Interface principale améliorée */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Navigation arborescente simplifiée */}
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg border-0">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardTitle className="flex items-center gap-2 font-arabic text-lg">
                          <Building className="w-5 h-5" />
                          استكشاف البنية التحتية
                        </CardTitle>
                        <p className="text-blue-100 text-sm font-arabic">
                          انقر على العناصر للتنقل والاستكشاف
                        </p>
                      </CardHeader>
                      <CardContent className="p-4">
                        <SimpleTreeView
                          data={treeData}
                          onNodeSelect={handleTreeNodeSelect}
                          selectedNode={selectedTreeNode}
                          className="max-h-96 overflow-y-auto"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Panneau de détails amélioré */}
                  <div className="lg:col-span-2">
                    <SimpleDetailsPanel
                      selectedNode={selectedTreeNode}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Guide d'utilisation amélioré */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Building className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-green-900 font-arabic">
                          دليل الاستخدام - واجهة محسنة
                        </h4>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-2 font-arabic">1. التنقل السهل</h5>
                          <p className="text-green-700 font-arabic">استخدم الشجرة على اليسار للتنقل بين المستويات</p>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-2 font-arabic">2. التفاصيل الكاملة</h5>
                          <p className="text-green-700 font-arabic">عرض معلومات مفصلة في اللوحة اليمنى</p>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-2 font-arabic">3. الاستشارة والمراجعة</h5>
                          <p className="text-green-700 font-arabic">عرض المعلومات للاستشارة والمراجعة فقط</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <UserGuideEtablissementRegionale />
          </TabsContent>

        </Tabs>
      </div>

             {/* Footer */}
       <MinistryFooter />

       {/* All Dialog Components for Navbar Functionality */}
       
       {/* Profile Edit Dialog */}
       <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle className="font-arabic">تعديل الملف الشخصي</DialogTitle>
             <DialogDescription className="font-arabic">
               تحديث معلومات المؤسسة الجهوية
             </DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="username" className="font-arabic">اسم المستخدم</Label>
                 <Input
                   id="username"
                   value={profileForm.username}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="code" className="font-arabic">رمز الإدارة</Label>
                 <Input
                   id="code"
                   value={profileForm.code || ''}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, code: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="nom_fr" className="font-arabic">اسم المؤسسة (فرنسية)</Label>
                 <Input
                   id="nom_fr"
                   value={profileForm.nom_fr}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, nom_fr: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="nom_ar" className="font-arabic">اسم المؤسسة (عربية)</Label>
                 <Input
                   id="nom_ar"
                   value={profileForm.nom_ar}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, nom_ar: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="email" className="font-arabic">البريد الإلكتروني</Label>
                 <Input
                   id="email"
                   type="email"
                   value={profileForm.email}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="telephone" className="font-arabic">رقم الهاتف</Label>
                 <Input
                   id="telephone"
                   value={profileForm.telephone}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, telephone: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="adresse_fr" className="font-arabic">العنوان (فرنسية)</Label>
                 <Input
                   id="adresse_fr"
                   value={profileForm.adresse_fr}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, adresse_fr: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="adresse_ar" className="font-arabic">العنوان (عربية)</Label>
                 <Input
                   id="adresse_ar"
                   value={profileForm.adresse_ar}
                   onChange={(e) => setProfileForm(prev => ({ ...prev, adresse_ar: e.target.value }))}
                   className="font-arabic"
                 />
               </div>
             </div>
           </div>
           <DialogFooter>
             <Button variant="outline" onClick={() => setIsProfileEditOpen(false)} className="font-arabic">
               إلغاء
             </Button>
             <Button onClick={handleProfileSave} className="font-arabic">
               حفظ التغييرات
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Password Change Dialog */}
       <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="font-arabic">تغيير كلمة المرور</DialogTitle>
             <DialogDescription className="font-arabic">
               أدخل كلمة المرور الحالية وكلمة المرور الجديدة
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label htmlFor="currentPassword" className="font-arabic">كلمة المرور الحالية</Label>
               <Input
                 id="currentPassword"
                 type="password"
                 value={passwordForm.currentPassword}
                 onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                 className="font-arabic"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="newPassword" className="font-arabic">كلمة المرور الجديدة</Label>
               <Input
                 id="newPassword"
                 type="password"
                 value={passwordForm.newPassword}
                 onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                 className="font-arabic"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="confirmPassword" className="font-arabic">تأكيد كلمة المرور الجديدة</Label>
               <Input
                 id="confirmPassword"
                 type="password"
                 value={passwordForm.confirmPassword}
                 onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                 className="font-arabic"
               />
             </div>
           </div>
           <DialogFooter>
             <Button variant="outline" onClick={() => setIsPasswordChangeOpen(false)} className="font-arabic">
               إلغاء
             </Button>
             <Button onClick={handlePasswordChange} className="font-arabic">
               تغيير كلمة المرور
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Notification Settings Dialog */}
       <Dialog open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="font-arabic">إعدادات الإشعارات</DialogTitle>
             <DialogDescription className="font-arabic">
               تخصيص إعدادات الإشعارات حسب احتياجاتك
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4 py-4">
             <div className="flex items-center justify-between">
               <Label htmlFor="emailNotifications" className="font-arabic">إشعارات البريد الإلكتروني</Label>
               <Switch
                 id="emailNotifications"
                 checked={notificationSettings.emailNotifications}
                 onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
               />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="programmeUpdates" className="font-arabic">تحديثات البرامج</Label>
               <Switch
                 id="programmeUpdates"
                 checked={notificationSettings.programmeUpdates}
                 onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, programmeUpdates: checked }))}
               />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="courseUpdates" className="font-arabic">تحديثات الدروس</Label>
               <Switch
                 id="courseUpdates"
                 checked={notificationSettings.courseUpdates}
                 onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, courseUpdates: checked }))}
               />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="infrastructureUpdates" className="font-arabic">تحديثات البنية التحتية</Label>
               <Switch
                 id="infrastructureUpdates"
                 checked={notificationSettings.infrastructureUpdates}
                 onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, infrastructureUpdates: checked }))}
               />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="systemUpdates" className="font-arabic">تحديثات النظام</Label>
               <Switch
                 id="systemUpdates"
                 checked={notificationSettings.systemUpdates}
                 onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))}
               />
             </div>
           </div>
           <DialogFooter>
             <Button variant="outline" onClick={() => setIsNotificationSettingsOpen(false)} className="font-arabic">
               إلغاء
             </Button>
             <Button onClick={() => setIsNotificationSettingsOpen(false)} className="font-arabic">
               حفظ الإعدادات
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Notifications Dialog */}
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

               

        {/* Data Export Dialog */}
        <AlertDialog open={isDataExportOpen} onOpenChange={setIsDataExportOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-arabic">تصدير البيانات</AlertDialogTitle>
              <AlertDialogDescription className="font-arabic">
                سيتم تحميل جميع بيانات المؤسسة والبرامج والإحصائيات في ملف JSON.
                هل أنت متأكد من المتابعة؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDataExport}
                className="bg-purple-600 hover:bg-purple-700 font-arabic"
              >
                تصدير البيانات
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-arabic">تأكيد تسجيل الخروج</AlertDialogTitle>
              <AlertDialogDescription className="font-arabic">
                هل أنت متأكد من رغبتك في تسجيل الخروج من النظام؟
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
      </div>
    );
  };
  
  export default EtablissementRegionaleDashboardPage;
