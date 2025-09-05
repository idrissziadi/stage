import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Building, 
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  GraduationCap,
  School,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Calendar,
  HelpCircle,
  Settings
} from 'lucide-react';
import ProgrammeSupervision from '@/components/etablissement-nationale/ProgrammeSupervision';
import MinistryFooter from '@/components/layout/MinistryFooter';
import UniversalNavbar from '@/components/layout/UniversalNavbar';
import UserGuideEtablissementNationale from '@/components/etablissement-nationale/UserGuide';

interface DashboardStats {
  totalProgrammes: number;
  programmesEnAttente: number;
  programmesValides: number;
  programmesRefuses: number;
  totalEtablissements: number;
  totalModules: number;
  institutionsWithProgrammes: number;
}



const EtablissementNationaleDashboard: React.FC = () => {
  const { userProfile, signOut, request } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalProgrammes: 0,
    programmesEnAttente: 0,
    programmesValides: 0,
    programmesRefuses: 0,
    totalEtablissements: 0,
    totalModules: 0,
    institutionsWithProgrammes: 0
  });

  const [loading, setLoading] = useState(true);
  
  // Dialog states for navbar functionality
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    nom_fr: '',
    nom_ar: '',
    code: '',
    adresse_fr: '',
    adresse_ar: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    if (userProfile) {
      console.log('🔍 UserProfile data:', userProfile);
      console.log('🔍 Code:', userProfile.code);
      console.log('🔍 Nom AR:', userProfile.nom_ar);
      console.log('🔍 Nom FR:', userProfile.nom_fr);
      console.log('🔍 Adresse AR:', userProfile.adresse_ar);
      console.log('🔍 Adresse FR:', userProfile.adresse_fr);
      console.log('🔍 Email:', userProfile.email);
      console.log('🔍 Telephone:', userProfile.telephone);
      console.log('🔍 Created At:', userProfile.created_at);
      console.log('🔍 Updated At:', userProfile.updated_at);
      console.log('🔍 Toutes les clés:', Object.keys(userProfile));
      console.log('🔍 Valeurs complètes:', JSON.stringify(userProfile, null, 2));
      
      // Mettre à jour le formulaire de modification
      setProfileForm({
        username: userProfile.username || '',
        nom_fr: userProfile.nom_fr || '',
        nom_ar: userProfile.nom_ar || '',
        code: userProfile.code || '',
        adresse_fr: userProfile.adresse_fr || '',
        adresse_ar: userProfile.adresse_ar || '',
        email: userProfile.email || '',
        telephone: userProfile.telephone || ''
      });
      
      fetchDashboardData();
    }
  }, [userProfile]);

  const handleProfileEdit = () => {
    if (userProfile) {
      console.log('🔍 Setting profile form with userProfile data:', userProfile);
      setProfileForm({
        username: userProfile.username || '',
        nom_fr: userProfile.nom_fr || '',
        nom_ar: userProfile.nom_ar || '',
        code: userProfile.code || '',
        adresse_fr: userProfile.adresse_fr || '',
        adresse_ar: userProfile.adresse_ar || '',
        email: userProfile.email || '',
        telephone: userProfile.telephone || ''
      });
    }
    setIsProfileEditOpen(true);
  };

  const handleProfileUpdate = async () => {
    try {
      setIsProfileEditOpen(false);
      setLoading(true);
      
      const response = await request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response) {
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الملف الشخصي بنجاح",
          variant: "default",
        });
        
        // Recharger les données du profil
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques des programmes
      let statsRes;
      try {
        console.log('🔄 Fetching programme stats...');
        statsRes = await request('/programme/stats');
        console.log('📊 Raw programme stats response:', statsRes);
        console.log('📊 Response type:', typeof statsRes);
        console.log('📊 Has data property:', !!statsRes?.data);
        console.log('📊 Data property content:', statsRes?.data);
        console.log('📊 Direct response content:', statsRes);
      } catch (error) {
        console.warn('⚠️ Erreur lors de la récupération des stats des programmes:', error);
        statsRes = { total: 0, parStatut: {} };
      }
      
      // Récupérer le nombre total d'établissements régionaux
      let etabRes;
      try {
        console.log('🔄 Fetching etablissements...');
        etabRes = await request('/api/etablissement-regionale');
        console.log('📊 Raw etablissements response:', etabRes);
        console.log('📊 etabRes.data:', etabRes?.data);
        console.log('📊 etabRes.data type:', typeof etabRes?.data);
        console.log('📊 etabRes.data is array:', Array.isArray(etabRes?.data));
      } catch (error) {
        console.warn('⚠️ Erreur lors de la récupération des établissements:', error);
        etabRes = { data: [] };
      }
      
      // Récupérer le nombre total de modules
      let modulesRes;
      try {
        modulesRes = await request('/module');
        console.log('Raw modules response:', modulesRes);
        
        // Vérifier si la réponse a la bonne structure
        if (modulesRes?.data && !Array.isArray(modulesRes.data)) {
          console.warn('⚠️ Modules response structure unexpected:', modulesRes);
        }
        
        // Si modulesRes est directement un tableau, on l'encapsule
        if (Array.isArray(modulesRes)) {
          console.log('⚠️ Modules response is direct array, wrapping in data property');
          modulesRes = { data: modulesRes };
        }
      } catch (error) {
        console.warn('⚠️ Erreur lors de la récupération des modules:', error);
        modulesRes = { data: [] };
      }
      
      // Récupérer المؤسسات التي لديها برامج
      let institutionsWithProgramsRes;
      try {
        institutionsWithProgramsRes = await request('/programme/institutions-count');
        console.log('Institutions with programs API response:', institutionsWithProgramsRes);
      } catch (error) {
        console.warn('⚠️ Erreur lors de la récupération du nombre d\'institutions avec programmes:', error);
        // Fallback: calculer من البيانات المتاحة
        try {
          const programmesRes = await request('/programme');
          console.log('Fallback programmes response for institutions:', programmesRes);
          
          if (programmesRes?.data && Array.isArray(programmesRes.data)) {
            const uniqueInstitutions = new Set();
            programmesRes.data.forEach((programme: any) => {
              if (programme.id_etab_regionale) {
                uniqueInstitutions.add(programme.id_etab_regionale);
              }
            });
            institutionsWithProgramsRes = { totalInstitutions: uniqueInstitutions.size };
            console.log('Unique institutions from programmes (data):', uniqueInstitutions);
          } else if (Array.isArray(programmesRes)) {
            // Si programmesRes est directement un tableau
            const uniqueInstitutions = new Set();
            programmesRes.forEach((programme: any) => {
              if (programme.id_etab_regionale) {
                uniqueInstitutions.add(programme.id_etab_regionale);
              }
            });
            institutionsWithProgramsRes = { totalInstitutions: uniqueInstitutions.size };
            console.log('Unique institutions from programmes (direct):', uniqueInstitutions);
          } else {
            institutionsWithProgramsRes = { totalInstitutions: 0 };
          }
        } catch (fallbackError) {
          console.warn('⚠️ Erreur lors du fallback pour institutions:', fallbackError);
          institutionsWithProgramsRes = { totalInstitutions: 0 };
        }
      }
      
      // Si on n'a toujours pas de données, essayer de récupérer directement
      if (!institutionsWithProgramsRes?.totalInstitutions || institutionsWithProgramsRes.totalInstitutions === 0) {
        try {
          console.log('⚠️ Tentative de récupération directe des programmes pour institutions');
          const programmesRes = await request('/programme');
          console.log('Direct programmes response for institutions:', programmesRes);
          
          if (programmesRes?.data && Array.isArray(programmesRes.data)) {
            const uniqueInstitutions = new Set();
            programmesRes.data.forEach((programme: any) => {
              if (programme.id_etab_regionale) {
                uniqueInstitutions.add(programme.id_etab_regionale);
              }
            });
            institutionsWithProgramsRes = { totalInstitutions: uniqueInstitutions.size };
            console.log('Direct unique institutions from programmes:', uniqueInstitutions);
          } else if (Array.isArray(programmesRes)) {
            const uniqueInstitutions = new Set();
            programmesRes.forEach((programme: any) => {
              if (programme.id_etab_regionale) {
                uniqueInstitutions.add(programme.id_etab_regionale);
              }
            });
            institutionsWithProgramsRes = { totalInstitutions: uniqueInstitutions.size };
            console.log('Direct unique institutions from programmes (array):', uniqueInstitutions);
          }
        } catch (directError) {
          console.warn('⚠️ Erreur lors de la récupération directe des programmes:', directError);
        }
      }
      
      // Formater les statistiques pour correspondre à l'interface
      // Handle data wrapper structure: {data: {parStatut: {...}, total: 1}}
      const programmeStats = statsRes?.data || statsRes;
      
      // Handle etablissements data wrapper structure
      let totalEtablissements = 0;
      if (etabRes?.data) {
        if (Array.isArray(etabRes.data)) {
          totalEtablissements = etabRes.data.length;
        } else if (etabRes.data.data && Array.isArray(etabRes.data.data)) {
          // Double wrapper: {data: {data: [...]}}
          totalEtablissements = etabRes.data.data.length;
        }
      } else if (Array.isArray(etabRes)) {
        // Direct array response
        totalEtablissements = etabRes.length;
      }
      
      console.log('📊 Calculated totalEtablissements:', totalEtablissements);
      console.log('📊 etabRes structure:', etabRes);
      console.log('📊 etabRes.data structure:', etabRes?.data);
      
      // Debug: Vérifier la structure des données modules
      console.log('Modules response structure:', modulesRes);
      console.log('Modules response type:', typeof modulesRes);
      console.log('Modules response is array:', Array.isArray(modulesRes));
      console.log('Modules data type:', typeof modulesRes?.data);
      console.log('Modules data length:', modulesRes?.data?.length);
      console.log('Modules data is array:', Array.isArray(modulesRes?.data));
      console.log('Direct modulesRes length:', Array.isArray(modulesRes) ? modulesRes.length : 'N/A');
      
      // Extraire le nombre de modules correctement
      let totalModules = 0;
      if (modulesRes?.data) {
        if (Array.isArray(modulesRes.data)) {
          totalModules = modulesRes.data.length;
        } else if (typeof modulesRes.data === 'object' && modulesRes.data.data) {
          // Si la structure est { data: [...] }
          totalModules = Array.isArray(modulesRes.data.data) ? modulesRes.data.data.length : 0;
        }
      } else if (Array.isArray(modulesRes)) {
        // Si modulesRes est directement un tableau
        totalModules = modulesRes.length;
      }
      
      // Calculer عدد المواد التي لها برامج من البيانات المتاحة
      let modulesWithPrograms = 0;
      if (programmeStats?.total && programmeStats.total > 0) {
        try {
          // Essayer de récupérer les programmes pour compter les modules uniques
          const programmesRes = await request('/programme');
          console.log('🔄 Programmes response for modules count:', programmesRes);
          
          // Handle data wrapper structure
          const programmesData = programmesRes?.data || programmesRes;
          console.log('📊 Extracted programmes data:', programmesData);
          
          if (Array.isArray(programmesData)) {
            const uniqueModules = new Set();
            programmesData.forEach((programme: any) => {
              if (programme.id_module) {
                uniqueModules.add(programme.id_module);
              }
            });
            modulesWithPrograms = uniqueModules.size;
            console.log('📊 Unique modules from programmes:', uniqueModules);
            console.log('📊 modulesWithPrograms count:', modulesWithPrograms);
          } else {
            console.warn('⚠️ programmesData is not an array:', programmesData);
            // Fallback: utiliser une estimation basée sur les stats
            modulesWithPrograms = Math.min(programmeStats.total, totalModules);
          }
        } catch (error) {
          console.warn('⚠️ Erreur lors de la récupération des programmes pour compter les modules:', error);
          // Fallback: utiliser une estimation basée sur les stats
          modulesWithPrograms = Math.min(programmeStats.total, totalModules);
        }
      }
      
      // Debug logging
      console.log('Etablissements response:', etabRes);
      console.log('Modules response:', modulesRes);
      console.log('Total etablissements:', totalEtablissements);
      console.log('Total modules:', totalModules);
      console.log('Modules with programs (calculated):', modulesWithPrograms);
      
      // Log final stats
      console.log('Final Stats:', {
        totalProgrammes: programmeStats?.total || 0,
        programmesEnAttente: programmeStats?.parStatut?.['في_الانتظار'] || 0,
        programmesValides: programmeStats?.parStatut?.['مقبول'] || 0,
        programmesRefuses: programmeStats?.parStatut?.['مرفوض'] || 0,
        totalEtablissements,
        totalModules: modulesWithPrograms,
        institutionsWithProgrammes: institutionsWithProgramsRes?.totalInstitutions || 0
      });
      
      // Debug: Vérifier le calcul du taux de participation
      const participationRate = totalEtablissements > 0 ? 
        ((institutionsWithProgramsRes?.totalInstitutions || 0) / totalEtablissements * 100).toFixed(1) : 0;
      console.log('Participation rate calculation:', {
        institutionsWithPrograms: institutionsWithProgramsRes?.totalInstitutions || 0,
        totalEtablissements,
        participationRate: participationRate + '%'
      });
      
      // Vérifier si on a des données valides
      if (institutionsWithProgramsRes?.totalInstitutions === 0 && programmeStats?.total > 0) {
        console.warn('⚠️ ATTENTION: 0 institutions mais des programmes existent!');
        console.warn('⚠️ Vérifier la logique de calcul des institutions');
      }
      
      // Log final data before setStats
      const finalStats = {
        totalProgrammes: programmeStats?.total || 0,
        programmesEnAttente: programmeStats?.parStatut?.['في_الانتظار'] || 0,
        programmesValides: programmeStats?.parStatut?.['مقبول'] || 0,
        programmesRefuses: programmeStats?.parStatut?.['مرفوض'] || 0,
        totalEtablissements,
        totalModules: modulesWithPrograms, // Utiliser le nombre de المواد التي لها برامج
        institutionsWithProgrammes: institutionsWithProgramsRes?.totalInstitutions || 0
      };
      
      console.log('📊 Final stats before setStats:', finalStats);
      console.log('📊 programmeStats object:', programmeStats);
      console.log('📊 programmeStats.parStatut:', programmeStats?.parStatut);
      
      setStats(finalStats);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      
      // Afficher plus de détails sur l'erreur
      if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Status:', error.response.status);
      }
      
      toast({
        title: "خطأ",
        description: "تعذر تحميل بيانات لوحة المعلومات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }



  return (
    <div className="theme-transition-colors min-h-screen bg-background-secondary dark:bg-gray-900" dir="rtl">
      {/* Universal Navbar */}
              <UniversalNavbar 
          onTabChange={setActiveTab} 
          currentRole={userProfile?.role}
          onHelpClick={() => setActiveTab('help')}
        />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 bg-muted dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2 font-arabic data-[state=active]:bg-card data-[state=active]:text-secondary data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="programmes" className="flex items-center gap-2 font-arabic data-[state=active]:bg-card data-[state=active]:text-secondary data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              إدارة البرامج
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 rtl">
              <Card className="border-r-4 border-r-blue-500 bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary dark:text-blue-400 font-arabic">إجمالي البرامج</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 font-arabic">{stats.totalProgrammes}</p>
                      <p className="text-xs text-blue-500 font-arabic">تم إنشاؤها</p>
                    </div>
                    <div className="p-3 bg-blue-200 dark:bg-blue-800/50 rounded-full">
                      <FileText className="w-6 h-6 text-primary dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-yellow-500 bg-gradient-to-l from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-sm font-medium text-warning dark:text-yellow-400 font-arabic">في الانتظار</p>
                      <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 font-arabic">{stats.programmesEnAttente}</p>
                      <p className="text-xs text-yellow-500 font-arabic">بانتظار المراجعة</p>
                    </div>
                    <div className="p-3 bg-yellow-200 dark:bg-yellow-800/50 rounded-full">
                      <Clock className="w-6 h-6 text-warning dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-green-500 bg-gradient-to-l from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-sm font-medium text-success dark:text-green-400 font-arabic">معتمدة</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-arabic">{stats.programmesValides}</p>
                      <p className="text-xs text-green-500 font-arabic">تم اعتمادها</p>
                    </div>
                    <div className="p-3 bg-green-200 dark:bg-green-800/50 rounded-full">
                      <CheckCircle className="w-6 h-6 text-success dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-red-500 bg-gradient-to-l from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-sm font-medium text-error dark:text-red-400 font-arabic">مرفوضة</p>
                      <p className="text-3xl font-bold text-red-700 dark:text-red-300 font-arabic">{stats.programmesRefuses}</p>
                      <p className="text-xs text-red-500 font-arabic">تم رفضها</p>
                    </div>
                    <div className="p-3 bg-red-200 dark:bg-red-800/50 rounded-full">
                      <XCircle className="w-6 h-6 text-error dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rtl">
              <Card className="border-r-4 border-r-indigo-500 bg-gradient-to-l from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <Building className="h-5 w-5" />
                    المؤسسات المشاركة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalEtablissements}</div>
                  <p className="text-sm text-muted-foreground mt-2 font-arabic">عدد المؤسسات التي قدمت برامج</p>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-emerald-500 bg-gradient-to-l from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <BookOpen className="h-5 w-5" />
                    المواد المغطاة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">{stats.totalModules}</div>
                  <p className="text-sm text-muted-foreground mt-2 font-arabic">عدد المواد التي لها برامج</p>
                </CardContent>
              </Card>
            </div>

            {/* New Statistics Row for Institutions with Programmes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rtl">
              <Card className="border-r-4 border-r-purple-500 bg-gradient-to-l from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <School className="h-5 w-5" />
                    المؤسسات النشطة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">{stats.institutionsWithProgrammes}</div>
                  <p className="text-sm text-muted-foreground mt-2 font-arabic">عدد المؤسسات التي قدمت برامج فعلياً</p>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-orange-500 bg-gradient-to-l from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <Users className="h-5 w-5" />
                    معدل المشاركة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.totalEtablissements > 0 
                      ? Math.round((stats.institutionsWithProgrammes / stats.totalEtablissements) * 100)
                      : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-arabic">نسبة المؤسسات النشطة من إجمالي المؤسسات</p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information Section */}
            <Card>
              <CardHeader className="bg-gradient-to-l from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="text-right" dir="rtl">
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-arabic">معلومات المؤسسة الوطنية</span>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Building className="w-5 h-5 text-secondary dark:text-purple-400" />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" dir="rtl">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground dark:text-white font-arabic border-b pb-2 text-right">المعلومات الأساسية</h3>
                    
                    <div className="space-y-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">اسم المستخدم</p>
                        <p className="text-lg font-semibold text-foreground dark:text-white text-right">{userProfile?.username || 'غير محدد'}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">اسم المؤسسة بالفرنسية</p>
                        <p className="text-lg font-semibold text-foreground dark:text-white text-right">
                          {userProfile?.nom_fr || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">اسم المؤسسة بالعربية</p>
                        <p className="text-lg font-semibold text-foreground dark:text-white font-arabic text-right">
                          {userProfile?.nom_ar || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">رمز الإدارة</p>
                        <p className="text-lg font-semibold text-foreground dark:text-white text-right">
                          {userProfile?.code || 'غير محدد'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">الدور</p>
                        <div className="flex items-center gap-2 justify-end">
                          <IdCard className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="secondary" className="font-arabic">
                            مؤسسة وطنية
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground dark:text-white font-arabic border-b pb-2 text-right">معلومات الاتصال</h3>
                    
                    <div className="space-y-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">البريد الإلكتروني</p>
                        <div className="flex items-center gap-2 justify-end">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <p className="text-lg font-semibold text-foreground dark:text-white text-right">
                            {userProfile?.email || userProfile?.email_for_auth || 'غير محدد'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">رقم الهاتف</p>
                        <div className="flex items-center gap-2 justify-end">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <p className="text-lg font-semibold text-foreground dark:text-white text-right">
                            {userProfile?.telephone || 'غير محدد'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">العنوان</p>
                        <div className="flex items-center gap-2 justify-end">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <p className="text-lg font-semibold text-foreground dark:text-white font-arabic text-right">
                            {userProfile?.adresse_ar || userProfile?.adresse_fr || 'غير محدد'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">تاريخ التسجيل</p>
                        <div className="flex items-center gap-2 justify-end">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <p className="text-lg font-semibold text-foreground dark:text-white font-arabic text-right">
                            {userProfile?.created_at 
                              ? new Date(userProfile.created_at).toLocaleDateString('ar-DZ', {
                                  year: 'numeric',
                                  month: 'long', 
                                  day: 'numeric'
                                })
                              : 'غير محدد'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </TabsContent>

          <TabsContent value="programmes" className="space-y-6">
            <ProgrammeSupervision />
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <UserGuideEtablissementNationale />
          </TabsContent>


        </Tabs>
      </div>



      {/* Profile Edit Dialog */}
      <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right font-arabic">تعديل الملف الشخصي</DialogTitle>
            <DialogDescription className="text-right font-arabic">
              قم بتحديث معلومات المؤسسة الوطنية
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-white font-arabic border-b pb-2 text-right">
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="username"
                    value={userProfile?.username || ''}
                    className="text-right font-arabic bg-muted"
                    disabled
                    placeholder="اسم المستخدم"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nom_fr" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    اسم المؤسسة بالفرنسية
                  </Label>
                  <Input
                    id="nom_fr"
                    value={profileForm.nom_fr}
                    onChange={(e) => setProfileForm({ ...profileForm, nom_fr: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="Nom de l'établissement en français"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom_ar" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    اسم المؤسسة بالعربية
                  </Label>
                  <Input
                    id="nom_ar"
                    value={profileForm.nom_ar}
                    onChange={(e) => setProfileForm({ ...profileForm, nom_ar: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="اسم المؤسسة بالعربية"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    رمز الإدارة
                  </Label>
                  <Input
                    id="code"
                    value={profileForm.code}
                    onChange={(e) => setProfileForm({ ...profileForm, code: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="رمز الإدارة"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-white font-arabic border-b pb-2 text-right">
                معلومات الاتصال
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    رقم الهاتف
                  </Label>
                  <Input
                    id="telephone"
                    value={profileForm.telephone}
                    onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="+213 XX XX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-white font-arabic border-b pb-2 text-right">
                معلومات العنوان
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adresse_fr" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    العنوان بالفرنسية
                  </Label>
                  <Input
                    id="adresse_fr"
                    value={profileForm.adresse_fr}
                    onChange={(e) => setProfileForm({ ...profileForm, adresse_fr: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="Adresse en français"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adresse_ar" className="text-sm font-medium text-foreground dark:text-gray-300 font-arabic text-right">
                    العنوان بالعربية
                  </Label>
                  <Input
                    id="adresse_ar"
                    value={profileForm.adresse_ar}
                    onChange={(e) => setProfileForm({ ...profileForm, adresse_ar: e.target.value })}
                    className="text-right font-arabic"
                    placeholder="العنوان بالعربية"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsProfileEditOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري التحديث...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <MinistryFooter />
    </div>
  );
};

export default EtablissementNationaleDashboard;
