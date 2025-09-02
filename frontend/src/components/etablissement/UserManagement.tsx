import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { formatDate } from '@/utils/formatDate';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap, 
  Users, 
  Mail, 
  Phone,
  Calendar,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';

interface Enseignant {
  id_enseignant: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
  email: string;
  telephone: string;
  date_naissance: string;
  grade?: {
    id_grade: number;
    designation_fr: string;
    designation_ar: string;
    code_grade: string;
  };
  Compte?: {
    id_compte: number;
    username: string;
    role: string;
    createdAt: string;
  };
  modules?: any[]; // Modules will be added if needed
  specialites?: any[]; // Specialties will be added if needed
}

interface Stagiaire {
  id_stagiaire: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
  email: string;
  telephone: string;
  date_naissance: string;
  Compte?: {
    id_compte: number;
    username: string;
    role: string;
    createdAt: string;
  };
  inscriptions?: Array<{
    id_inscription: number;
    statut: string;
    createdAt: string;
    offre: {
      id_offre: number;
      description: string;
      specialite?: {
        designation_fr: string;
        designation_ar: string;
      };
      diplome?: {
        designation_fr: string;
        designation_ar: string;
      };
      etablissementFormation?: {
        nom_fr: string;
        nom_ar: string;
      };
    };
  }>;
}

interface Grade {
  id_grade: number;
  designation_fr: string;
  designation_ar: string;
  code_grade: string;
}

const UserManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('enseignants');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isCreateStagiaireOpen, setIsCreateStagiaireOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [accountForm, setAccountForm] = useState({
    username: '',
    password: ''
  });

  const [stagiaireForm, setStagiaireForm] = useState({
    nom_fr: '',
    prenom_fr: '',
    nom_ar: '',
    prenom_ar: '',
    email: '',
    telephone: '',
    date_naissance: '',
    username: '',
    password: '',
    id_offre: ''
  });

  const [offres, setOffres] = useState<any[]>([]);
  const [createAccountForStagiaire, setCreateAccountForStagiaire] = useState(false);
  const [autoInscription, setAutoInscription] = useState(false);

  // États pour l'assignation des modules
  const [isModuleAssignmentOpen, setIsModuleAssignmentOpen] = useState(false);
  const [selectedEnseignantForModules, setSelectedEnseignantForModules] = useState<Enseignant | null>(null);
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [assignedModules, setAssignedModules] = useState<any>({});
  const [moduleAssignmentForm, setModuleAssignmentForm] = useState({
    modules: [] as number[],
    annee_scolaire: '',
    semestre: ''
  });

  useEffect(() => {
    if (userProfile?.id_etab_formation) {
      fetchAllUsers();
      fetchGrades();
      if (activeTab === 'stagiaires') {
        fetchOffres();
      }
    }
  }, [userProfile, activeTab]);

  const fetchGrades = async () => {
    try {
      const response = await apiService.getAllGrades();
      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors du chargement des grades');
      }
      setGrades(response.data?.grades || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الدرجات العلمية',
        variant: 'destructive'
      });
    }
  };

  const fetchOffres = async () => {
    try {
      if (!userProfile?.id_etab_formation) return;
      
      const response = await apiService.getOffresByEtablissement(userProfile.id_etab_formation);
      
      if (response.error) {
        console.error('Error fetching offres:', response.error);
        toast({
          title: 'خطأ',
          description: 'فشل في تحميل العروض',
          variant: 'destructive'
        });
        setOffres([]);
      } else {
        // Handle response structure - could be { offres: [] } or direct array
        let offresData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            offresData = response.data;
          } else if (response.data.offres && Array.isArray(response.data.offres)) {
            offresData = response.data.offres;
          }
        }
        setOffres(offresData);
      }
    } catch (error) {
      console.error('Error fetching offres:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل العروض',
        variant: 'destructive'
      });
      setOffres([]);
    }
  };

  const fetchAllUsers = async () => {
    if (!userProfile?.id_etab_formation) return;
    
    try {
      setLoading(true);
      
      if (activeTab === 'enseignants') {
        const response = await apiService.getEnseignantsByEtablissement(
          userProfile.id_etab_formation,
          searchTerm,
          50,
          0
        );
        
        if (response.error) {
          throw new Error(response.error.message || 'Erreur lors du chargement des enseignants');
        }
        
        setEnseignants(response.data?.enseignants || []);
      } else {
        const response = await apiService.getStagiairesByEtablissement(
          userProfile.id_etab_formation,
          searchTerm,
          50,
          0
        );
        
        if (response.error) {
          console.error('Error response:', response.error);
          throw new Error(response.error.message || 'Erreur serveur lors de la récupération des stagiaires');
        }
        
        setStagiaires(response.data?.stagiaires || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تحميل بيانات المستخدمين',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAccountForm = () => {
    setAccountForm({
      username: '',
      password: ''
    });
  };

  const resetStagiaireForm = () => {
    setStagiaireForm({
      nom_fr: '',
      prenom_fr: '',
      nom_ar: '',
      prenom_ar: '',
      email: '',
      telephone: '',
      date_naissance: '',
      username: '',
      password: '',
      id_offre: ''
    });
    setCreateAccountForStagiaire(false);
    setAutoInscription(false);
  };

  const handleCreateStagiaire = async () => {
    try {
      setLoading(true);
      
      if (!stagiaireForm.nom_fr || !stagiaireForm.prenom_fr) {
        toast({
          title: 'خطأ',
          description: 'الاسم واللقب بالفرنسية مطلوبان',
          variant: 'destructive'
        });
        return;
      }

      if (createAccountForStagiaire && (!stagiaireForm.username || !stagiaireForm.password)) {
        toast({
          title: 'خطأ',
          description: 'اسم المستخدم وكلمة المرور مطلوبان لإنشاء الحساب',
          variant: 'destructive'
        });
        return;
      }

      if (autoInscription && !stagiaireForm.id_offre) {
        toast({
          title: 'خطأ',
          description: 'يرجى اختيار عرض للتسجيل التلقائي',
          variant: 'destructive'
        });
        return;
      }

      const payload = {
        nom_fr: stagiaireForm.nom_fr,
        prenom_fr: stagiaireForm.prenom_fr,
        nom_ar: stagiaireForm.nom_ar || undefined,
        prenom_ar: stagiaireForm.prenom_ar || undefined,
        email: stagiaireForm.email || undefined,
        telephone: stagiaireForm.telephone || undefined,
        date_naissance: stagiaireForm.date_naissance || undefined,
        ...(createAccountForStagiaire && {
          username: stagiaireForm.username,
          password: stagiaireForm.password
        }),
        ...(autoInscription && stagiaireForm.id_offre && {
          id_offre: parseInt(stagiaireForm.id_offre)
        })
      };

      const response = await apiService.createStagiaireByEtablissement(payload);

      toast({
        title: 'نجح',
        description: response.data.message,
      });

      setIsCreateStagiaireOpen(false);
      resetStagiaireForm();
      await fetchAllUsers();

    } catch (error: any) {
      console.error('Error creating stagiaire:', error);
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل في إنشاء المتدرب',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour l'assignation des modules
  const openModuleAssignment = async (enseignant: Enseignant) => {
    try {
      setSelectedEnseignantForModules(enseignant);
      setIsModuleAssignmentOpen(true);
      
      // Récupérer les modules disponibles
      const modulesResponse = await apiService.getAvailableModulesForEnseignant(enseignant.id_enseignant);
      if (modulesResponse.error) {
        throw new Error(modulesResponse.error.message || 'Erreur lors de la récupération des modules');
      }
      setAvailableModules(modulesResponse.data?.modules || []);
      
      // Récupérer les modules déjà assignés
      const assignedResponse = await apiService.getModulesByEnseignant(enseignant.id_enseignant);
      console.log('🔍 Assigned modules response:', assignedResponse);
      
      if (assignedResponse.error) {
        throw new Error(assignedResponse.error.message || 'Erreur lors de la récupération des modules assignés');
      }
      
      // Handle different response structures
      let assignedModulesData = {};
      console.log('🔍 Raw assignedResponse.data:', assignedResponse.data);
      
      if (assignedResponse.data && assignedResponse.data.modules_by_year) {
        // Structure: {data: {modules_by_year: {...}}}
        assignedModulesData = assignedResponse.data.modules_by_year;
      } else if (assignedResponse.data && assignedResponse.data.data && Array.isArray(assignedResponse.data.data)) {
        // Structure: {data: {data: [...]}}
        const modules = assignedResponse.data.data;
        const modulesByYear = {};
        modules.forEach(module => {
          const year = module.annee_scolaire || '2025-09-01';
          if (!modulesByYear[year]) {
            modulesByYear[year] = [];
          }
          modulesByYear[year].push(module);
        });
        assignedModulesData = modulesByYear;
      } else if (assignedResponse.data && Array.isArray(assignedResponse.data)) {
        // Structure: {data: [...]}
        const modules = assignedResponse.data;
        const modulesByYear = {};
        modules.forEach(module => {
          const year = module.annee_scolaire || '2025-09-01';
          if (!modulesByYear[year]) {
            modulesByYear[year] = [];
          }
          modulesByYear[year].push(module);
        });
        assignedModulesData = modulesByYear;
      }
      
      console.log('🔍 Processed assigned modules:', assignedModulesData);
      setAssignedModules(assignedModulesData);
      
      // Initialiser le formulaire avec l'année scolaire actuelle
      const currentYear = new Date().getFullYear();
      setModuleAssignmentForm({
        modules: [],
        annee_scolaire: `${currentYear}-09-01`,
        semestre: 'S1'
      });
      
    } catch (error: any) {
      console.error('Error opening module assignment:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في فتح نافذة تعيين الوحدات',
        variant: 'destructive'
      });
    }
  };

  const handleModuleAssignment = async () => {
    try {
      if (!selectedEnseignantForModules) return;
      
      if (moduleAssignmentForm.modules.length === 0) {
        toast({
          title: 'خطأ',
          description: 'يرجى اختيار وحدة واحدة على الأقل',
          variant: 'destructive'
        });
        return;
      }

      if (!moduleAssignmentForm.annee_scolaire) {
        toast({
          title: 'خطأ',
          description: 'يرجى تحديد السنة الدراسية',
          variant: 'destructive'
        });
        return;
      }

      setLoading(true);

      const response = await apiService.assignModulesToEnseignant(
        selectedEnseignantForModules.id_enseignant,
        {
          modules: moduleAssignmentForm.modules,
          annee_scolaire: moduleAssignmentForm.annee_scolaire,
          semestre: moduleAssignmentForm.semestre || undefined
        }
      );

      toast({
        title: 'تم تعيين الوحدات بنجاح',
        description: `تم تعيين ${moduleAssignmentForm.modules.length} وحدة للاستاذ ${selectedEnseignantForModules.prenom_fr} ${selectedEnseignantForModules.nom_fr}`,
      });

      // Rafraîchir les modules assignés
      const assignedResponse = await apiService.getModulesByEnseignant(selectedEnseignantForModules.id_enseignant);
      console.log('🔍 Refresh assigned modules response:', assignedResponse);
      
      if (!assignedResponse.error) {
        // Handle different response structures
        let assignedModulesData = {};
        console.log('🔍 Refresh - Raw assignedResponse.data:', assignedResponse.data);
        
        if (assignedResponse.data && assignedResponse.data.modules_by_year) {
          // Structure: {data: {modules_by_year: {...}}}
          assignedModulesData = assignedResponse.data.modules_by_year;
        } else if (assignedResponse.data && assignedResponse.data.data && Array.isArray(assignedResponse.data.data)) {
          // Structure: {data: {data: [...]}}
          const modules = assignedResponse.data.data;
          const modulesByYear = {};
          modules.forEach(module => {
            const year = module.annee_scolaire || '2025-09-01';
            if (!modulesByYear[year]) {
              modulesByYear[year] = [];
            }
            modulesByYear[year].push(module);
          });
          assignedModulesData = modulesByYear;
        } else if (assignedResponse.data && Array.isArray(assignedResponse.data)) {
          // Structure: {data: [...]}
          const modules = assignedResponse.data;
          const modulesByYear = {};
          modules.forEach(module => {
            const year = module.annee_scolaire || '2025-09-01';
            if (!modulesByYear[year]) {
              modulesByYear[year] = [];
            }
            modulesByYear[year].push(module);
          });
          assignedModulesData = modulesByYear;
        }
        
        console.log('🔍 Refresh processed assigned modules:', assignedModulesData);
        setAssignedModules(assignedModulesData);
      }

      // Réinitialiser le formulaire
      setModuleAssignmentForm({
        modules: [],
        annee_scolaire: moduleAssignmentForm.annee_scolaire,
        semestre: moduleAssignmentForm.semestre
      });

    } catch (error: any) {
      console.error('Error assigning modules:', error);
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل في تعيين الوحدات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeModuleAssignment = async (id_module: number, annee_scolaire: string) => {
    try {
      if (!selectedEnseignantForModules) return;

      setLoading(true);

      const response = await apiService.removeModuleFromEnseignant(
        selectedEnseignantForModules.id_enseignant,
        id_module,
        annee_scolaire
      );

      toast({
        title: 'تم إزالة الوحدة بنجاح',
        description: 'تم إزالة الوحدة من قائمة الوحدات المخصصة للاستاذ',
      });

      // Rafraîchir les modules assignés
      const assignedResponse = await apiService.getModulesByEnseignant(selectedEnseignantForModules.id_enseignant);
      console.log('🔍 Remove module - refresh assigned modules response:', assignedResponse);
      
      if (!assignedResponse.error) {
        // Handle different response structures
        let assignedModulesData = {};
        console.log('🔍 Remove module - Raw assignedResponse.data:', assignedResponse.data);
        
        if (assignedResponse.data && assignedResponse.data.modules_by_year) {
          // Structure: {data: {modules_by_year: {...}}}
          assignedModulesData = assignedResponse.data.modules_by_year;
        } else if (assignedResponse.data && assignedResponse.data.data && Array.isArray(assignedResponse.data.data)) {
          // Structure: {data: {data: [...]}}
          const modules = assignedResponse.data.data;
          const modulesByYear = {};
          modules.forEach(module => {
            const year = module.annee_scolaire || '2025-09-01';
            if (!modulesByYear[year]) {
              modulesByYear[year] = [];
            }
            modulesByYear[year].push(module);
          });
          assignedModulesData = modulesByYear;
        } else if (assignedResponse.data && Array.isArray(assignedResponse.data)) {
          // Structure: {data: [...]}
          const modules = assignedResponse.data;
          const modulesByYear = {};
          modules.forEach(module => {
            const year = module.annee_scolaire || '2025-09-01';
            if (!modulesByYear[year]) {
              modulesByYear[year] = [];
            }
            modulesByYear[year].push(module);
          });
          assignedModulesData = modulesByYear;
        }
        
        console.log('🔍 Remove module - processed assigned modules:', assignedModulesData);
        setAssignedModules(assignedModulesData);
      }

    } catch (error: any) {
      console.error('Error removing module assignment:', error);
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل في إزالة الوحدة',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModuleAssignmentForm = () => {
    setModuleAssignmentForm({
      modules: [],
      annee_scolaire: new Date().getFullYear() + '-09-01',
      semestre: 'S1'
    });
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      
      if (!accountForm.username || !accountForm.password) {
        toast({
          title: 'خطأ',
          description: 'جميع الحقول المطلوبة يجب ملؤها',
          variant: 'destructive'
        });
        return;
      }

      let response;
      if (activeTab === 'enseignants') {
        response = await apiService.createAccountForEnseignant(
          selectedUser.id_enseignant,
          accountForm.username,
          accountForm.password
        );
      } else {
        response = await apiService.createAccountForStagiaire(
          selectedUser.id_stagiaire,
          accountForm.username,
          accountForm.password
        );
      }
      
      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors de la création du compte');
      }

      toast({
        title: 'نجح',
        description: `تم إنشاء الحساب بنجاح`,
      });

      setIsCreateAccountOpen(false);
      resetAccountForm();
      setSelectedUser(null);
      // Refresh the user list
      await fetchAllUsers();
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في إنشاء الحساب',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateAccount = (user: any) => {
    setSelectedUser(user);
    resetAccountForm();
    setIsCreateAccountOpen(true);
  };

  const toggleRowExpansion = (userId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  const currentUsers = activeTab === 'enseignants' ? enseignants : stagiaires;
  const filteredUsers = currentUsers.filter(user => {
    const nomFr = user.nom_fr || '';
    const prenomFr = user.prenom_fr || '';
    const email = user.email || '';
    const searchLower = searchTerm.toLowerCase();
    
    return nomFr.toLowerCase().includes(searchLower) ||
           prenomFr.toLowerCase().includes(searchLower) ||
           email.toLowerCase().includes(searchLower);
  });

  return (
    <div className="space-y-6 rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">إدارة المستخدمين</h2>
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            عرض المستخدمين الموجودين وإنشاء الحسابات لهم
          </p>
        </div>
        {activeTab === 'stagiaires' && (
          <Button
            onClick={() => setIsCreateStagiaireOpen(true)}
            className="font-arabic"
          >
            <UserPlus className="w-4 h-4 ml-2" />
            إنشاء متدرب جديد
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enseignants" className="font-arabic">
            <GraduationCap className="w-4 h-4 ml-2" />
            الأساتذة ({enseignants.length})
          </TabsTrigger>
          <TabsTrigger value="stagiaires" className="font-arabic">
            <Users className="w-4 h-4 ml-2" />
            المتدربين ({stagiaires.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">
                قائمة {activeTab === 'enseignants' ? 'الأساتذة' : 'المتدربين'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا يوجد مستخدمين</h3>
                  <p className="text-gray-600 font-arabic">لم يتم العثور على أي مستخدمين</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* Colonne pour le bouton d'expansion - toujours présente pour maintenir l'alignement */}
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-arabic">الاسم</TableHead>
                      <TableHead className="font-arabic">البريد</TableHead>
                      <TableHead className="font-arabic">الهاتف</TableHead>
                      {activeTab === 'enseignants' ? (
                        <TableHead className="font-arabic">الدرجة</TableHead>
                      ) : (
                        <TableHead className="font-arabic">عدد التسجيلات</TableHead>
                      )}
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: any) => {
                      const userId = user.id_enseignant || user.id_stagiaire;
                      const isExpanded = expandedRows.has(userId);
                      const hasInscriptions = activeTab === 'stagiaires' && user.inscriptions && user.inscriptions.length > 0;
                      
                      return (
                        <React.Fragment key={userId}>
                          <TableRow>
                            {/* Colonne pour le bouton d'expansion */}
                            <TableCell className="w-12">
                              {hasInscriptions && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRowExpansion(userId)}
                                  className="p-1"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </TableCell>
                            
                            {/* Nom */}
                            <TableCell>
                              <div>
                                <p className="font-semibold">{(user.prenom_fr || '') + ' ' + (user.nom_fr || '')}</p>
                                <p className="text-sm text-gray-600 font-arabic">{(user.prenom_ar || '') + ' ' + (user.nom_ar || '')}</p>
                              </div>
                            </TableCell>
                            
                            {/* Email */}
                            <TableCell>{user.email || 'غير محدد'}</TableCell>
                            
                            {/* Téléphone */}
                            <TableCell>{user.telephone || 'غير محدد'}</TableCell>
                            
                            {/* Grade ou Inscriptions */}
                            <TableCell>
                              {activeTab === 'enseignants' ? (
                                <Badge variant="secondary" className="font-arabic">
                                  {user.grade?.designation_ar || user.grade?.designation_fr || 'غير محدد'}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="font-arabic">
                                  {user.inscriptions?.length || 0} تسجيل
                                </Badge>
                              )}
                            </TableCell>
                            
                            {/* Statut du compte */}
                            <TableCell>
                              {user.Compte ? (
                                <Badge variant="default" className="font-arabic">
                                  لديه حساب
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="font-arabic">
                                  بدون حساب
                                </Badge>
                              )}
                            </TableCell>
                            
                            {/* Actions */}
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {activeTab === 'enseignants' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openModuleAssignment(user)}
                                    className="font-arabic"
                                  >
                                    <BookOpen className="w-4 h-4 ml-1" />
                                    تعيين الوحدات
                                  </Button>
                                )}
                                {!user.Compte && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenCreateAccount(user)}
                                    className="font-arabic"
                                  >
                                    <UserPlus className="w-4 h-4 ml-1" />
                                    إنشاء حساب
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded row for trainee inscriptions */}
                          {activeTab === 'stagiaires' && isExpanded && user.inscriptions && user.inscriptions.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="bg-gray-50 dark:bg-gray-800 p-0">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-3 font-arabic text-right">تسجيلات المتدرب:</h4>
                                  <div className="grid gap-3">
                                    {user.inscriptions.map((inscription: any) => (
                                      <div key={inscription.id_inscription} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                          {/* Row 1: Basic Info */}
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">التخصص:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.specialite?.designation_ar || inscription.offre?.specialite?.designation_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">الشهادة:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.diplome?.designation_ar || inscription.offre?.diplome?.designation_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">طريقة التكوين:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.modeFormation?.designation_ar || inscription.offre?.modeFormation?.designation_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          
                                          {/* Row 2: Dates and Institution */}
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">تاريخ البداية:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.date_debut ? formatDate(inscription.offre.date_debut) : 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">تاريخ النهاية:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.date_fin ? formatDate(inscription.offre.date_fin) : 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">المؤسسة:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.etablissementFormation?.nom_ar || inscription.offre?.etablissementFormation?.nom_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          
                                          {/* Row 3: Registration Info */}
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">تاريخ التسجيل:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {formatDate(inscription.createdAt)}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">رقم العرض:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.id_offre || 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">رقم التسجيل:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.id_inscription || 'غير محدد'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Account Dialog */}
      <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">
              إنشاء حساب لـ {selectedUser?.prenom_fr} {selectedUser?.nom_fr}
            </DialogTitle>
            <DialogDescription className="font-arabic">
              إنشاء اسم مستخدم وكلمة مرور للمستخدم
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label className="font-arabic">اسم المستخدم *</Label>
              <Input
                value={accountForm.username}
                onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                dir="ltr"
                placeholder="اسم المستخدم"
              />
            </div>
            <div>
              <Label className="font-arabic">كلمة المرور *</Label>
              <Input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm(prev => ({ ...prev, password: e.target.value }))}
                dir="ltr"
                placeholder="كلمة المرور"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateAccountOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateAccount}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Stagiaire Dialog */}
      <Dialog open={isCreateStagiaireOpen} onOpenChange={setIsCreateStagiaireOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-arabic">
              إنشاء متدرب جديد
            </DialogTitle>
            <DialogDescription className="font-arabic">
              إدخال معلومات المتدرب وإنشاء حساب له (اختياري) وتسجيله في عرض (اختياري)
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-arabic">الاسم بالفرنسية *</Label>
                <Input
                  value={stagiaireForm.nom_fr}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, nom_fr: e.target.value }))}
                  dir="ltr"
                  placeholder="Nom en français"
                />
              </div>
              <div>
                <Label className="font-arabic">اللقب بالفرنسية *</Label>
                <Input
                  value={stagiaireForm.prenom_fr}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, prenom_fr: e.target.value }))}
                  dir="ltr"
                  placeholder="Prénom en français"
                />
              </div>
              <div>
                <Label className="font-arabic">الاسم بالعربية</Label>
                <Input
                  value={stagiaireForm.nom_ar}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, nom_ar: e.target.value }))}
                  dir="rtl"
                  placeholder="اسم العائلة"
                />
              </div>
              <div>
                <Label className="font-arabic">اللقب بالعربية</Label>
                <Input
                  value={stagiaireForm.prenom_ar}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, prenom_ar: e.target.value }))}
                  dir="rtl"
                  placeholder="الاسم الأول"
                />
              </div>
            </div>

            {/* Informations de contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-arabic">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={stagiaireForm.email}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, email: e.target.value }))}
                  dir="ltr"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <Label className="font-arabic">رقم الهاتف</Label>
                <Input
                  value={stagiaireForm.telephone}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, telephone: e.target.value }))}
                  dir="ltr"
                  placeholder="+212-6-1234-5678"
                />
              </div>
              <div>
                <Label className="font-arabic">تاريخ الميلاد</Label>
                <Input
                  type="date"
                  value={stagiaireForm.date_naissance}
                  onChange={(e) => setStagiaireForm(prev => ({ ...prev, date_naissance: e.target.value }))}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Options avancées */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-account"
                  checked={createAccountForStagiaire}
                  onChange={(e) => setCreateAccountForStagiaire(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="create-account" className="font-arabic">إنشاء حساب مستخدم</Label>
              </div>

              {createAccountForStagiaire && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label className="font-arabic">اسم المستخدم *</Label>
                    <Input
                      value={stagiaireForm.username}
                      onChange={(e) => setStagiaireForm(prev => ({ ...prev, username: e.target.value }))}
                      dir="ltr"
                      placeholder="nom.prenom"
                    />
                  </div>
                  <div>
                    <Label className="font-arabic">كلمة المرور *</Label>
                    <Input
                      type="password"
                      value={stagiaireForm.password}
                      onChange={(e) => setStagiaireForm(prev => ({ ...prev, password: e.target.value }))}
                      dir="ltr"
                      placeholder="كلمة مرور آمنة"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-inscription"
                  checked={autoInscription}
                  onChange={(e) => setAutoInscription(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="auto-inscription" className="font-arabic">التسجيل التلقائي في عرض</Label>
              </div>

              {autoInscription && (
                <div className="pl-6">
                  <Label className="font-arabic">اختيار العرض</Label>
                  <Select
                    value={stagiaireForm.id_offre}
                    onValueChange={(value) => setStagiaireForm(prev => ({ ...prev, id_offre: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختيار عرض" />
                    </SelectTrigger>
                    <SelectContent>
                      {offres.map((offre) => (
                        <SelectItem key={offre.id_offre} value={offre.id_offre.toString()}>
                          {offre.designation_fr}
                          {offre.specialite && ` - ${offre.specialite.designation_fr}`}
                          {offre.diplome && ` (${offre.diplome.designation_fr})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateStagiaireOpen(false);
                resetStagiaireForm();
              }}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateStagiaire}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء المتدرب'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Assignment Dialog */}
      <Dialog open={isModuleAssignmentOpen} onOpenChange={setIsModuleAssignmentOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic text-right">
              تعيين الوحدات للاستاذ: {selectedEnseignantForModules?.prenom_fr} {selectedEnseignantForModules?.nom_fr}
            </DialogTitle>
            <DialogDescription className="font-arabic text-right">
              إدارة الوحدات المخصصة لهذا الاستاذ حسب التخصصات المتاحة في مؤسستك
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Formulaire d'assignation */}
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold mb-4 font-arabic text-right">تعيين وحدات جديدة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="font-arabic text-right block">السنة الدراسية *</Label>
                  <Input
                    type="date"
                    value={moduleAssignmentForm.annee_scolaire}
                    onChange={(e) => setModuleAssignmentForm(prev => ({ ...prev, annee_scolaire: e.target.value }))}
                    dir="ltr"
                    className="text-right"
                  />
                </div>
                
                <div>
                  <Label className="font-arabic text-right block">الفصل الدراسي</Label>
                  <Select
                    value={moduleAssignmentForm.semestre}
                    onValueChange={(value) => setModuleAssignmentForm(prev => ({ ...prev, semestre: value }))}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختيار الفصل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1">الفصل الأول</SelectItem>
                      <SelectItem value="S2">الفصل الثاني</SelectItem>
                      <SelectItem value="S3">الفصل الثالث</SelectItem>
                      <SelectItem value="S4">الفصل الرابع</SelectItem>
                      <SelectItem value="Premier">الأول</SelectItem>
                      <SelectItem value="Deuxième">الثاني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={handleModuleAssignment}
                    disabled={loading || moduleAssignmentForm.modules.length === 0}
                    className="font-arabic w-full"
                  >
                    {loading ? 'جاري التعيين...' : 'تعيين الوحدات المختارة'}
                  </Button>
                </div>
              </div>

              {/* Sélection des modules */}
              <div className="mt-4">
                <Label className="font-arabic mb-2 block text-right">اختيار الوحدات *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto border rounded p-3">
                  {availableModules.map((module) => (
                    <div key={module.id_module} className="flex items-center space-x-reverse space-x-2">
                      <input
                        type="checkbox"
                        id={`module-${module.id_module}`}
                        checked={moduleAssignmentForm.modules.includes(module.id_module)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setModuleAssignmentForm(prev => ({
                              ...prev,
                              modules: [...prev.modules, module.id_module]
                            }));
                          } else {
                            setModuleAssignmentForm(prev => ({
                              ...prev,
                              modules: prev.modules.filter(id => id !== module.id_module)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`module-${module.id_module}`} className="text-sm cursor-pointer text-right">
                        <div className="font-medium">{module.code_module}</div>
                        <div className="text-gray-600">{module.designation_fr}</div>
                        <div className="text-xs text-gray-500">{module.specialite?.designation_fr}</div>
                      </Label>
                    </div>
                  ))}
                </div>
                {availableModules.length === 0 && (
                  <p className="text-gray-500 text-center py-4 font-arabic">
                    لا توجد وحدات متاحة لهذا الاستاذ
                  </p>
                )}
              </div>
            </div>

            {/* Modules déjà assignés */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4 font-arabic text-right">الوحدات المخصصة حالياً</h3>
              
              {Object.keys(assignedModules).length === 0 ? (
                <p className="text-gray-500 text-center py-4 font-arabic">
                  لا توجد وحدات مخصصة لهذا الاستاذ
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(assignedModules).map(([annee, modules]: [string, any]) => (
                    <div key={annee} className="border rounded p-3">
                      <h4 className="font-medium mb-2 font-arabic text-right">
                        السنة الدراسية: {new Date(annee).getFullYear()}
                      </h4>
                      <div className="grid gap-2">
                        {modules.map((module: any) => (
                          <div key={`${module.id_module}-${annee}`} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded border">
                            <div className="flex-1 text-right">
                              <div className="font-medium">{module.code_module}</div>
                              <div className="text-sm text-gray-600">{module.designation_fr}</div>
                              <div className="text-xs text-gray-500">
                                {module.specialite?.designation_fr} - {module.semestre || 'غير محدد'}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeModuleAssignment(module.id_module, annee)}
                              disabled={loading}
                              className="font-arabic text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 ml-1" />
                              إزالة
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModuleAssignmentOpen(false);
                setSelectedEnseignantForModules(null);
                resetModuleAssignmentForm();
              }}
              className="font-arabic"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;