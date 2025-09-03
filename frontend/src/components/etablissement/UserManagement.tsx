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
  Eye,
  User
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

  // États pour la recherche وتسجيل المتدربين الموجودين
  const [stagiaireSearchForm, setStagiaireSearchForm] = useState({
    id_compte: '',
    nom_fr: '',
    prenom_fr: '',
    email: '',
    telephone: '',
    searchType: 'id_compte', // 'id_compte', 'nom_fr', 'prenom_fr', 'email', 'telephone'
    searchValue: ''
  });
  const [searchResults, setSearchResults] = useState<Stagiaire[]>([]);
  const [selectedExistingStagiaire, setSelectedExistingStagiaire] = useState<Stagiaire | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dialogActiveTab, setDialogActiveTab] = useState('create'); // 'create' or 'existing'

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
        const response = await apiService.getAllExistingStagiaires(
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
    setDialogActiveTab('create');
  };

  const resetStagiaireSearchForm = () => {
    setStagiaireSearchForm({
      id_compte: '',
      nom_fr: '',
      prenom_fr: '',
      email: '',
      telephone: '',
      searchType: 'id_compte',
      searchValue: ''
    });
    setSearchResults([]);
    setSelectedExistingStagiaire(null);
  };

  const searchExistingStagiaires = async () => {
    try {
      setIsSearching(true);
      setSearchResults([]);
      
      // Validation des paramètres
      if (!stagiaireSearchForm.searchType || !stagiaireSearchForm.searchValue) {
        toast({
          title: 'خطأ في البحث',
          description: 'يرجى اختيار نوع البحث وإدخال قيمة البحث',
          variant: 'destructive'
        });
        return;
      }
      
      // Construire les paramètres de recherche
      const searchParams = new URLSearchParams();
      if (stagiaireSearchForm.searchType === 'id_compte' && stagiaireSearchForm.searchValue) {
        searchParams.append('id_stagiaire', stagiaireSearchForm.searchValue);
      } else if (stagiaireSearchForm.searchType === 'nom_fr' && stagiaireSearchForm.searchValue) {
        searchParams.append('nom_fr', stagiaireSearchForm.searchValue);
      } else if (stagiaireSearchForm.searchType === 'prenom_fr' && stagiaireSearchForm.searchValue) {
        searchParams.append('prenom_fr', stagiaireSearchForm.searchValue);
      } else if (stagiaireSearchForm.searchType === 'email' && stagiaireSearchForm.searchValue) {
        searchParams.append('email', stagiaireSearchForm.searchValue);
      } else if (stagiaireSearchForm.searchType === 'telephone' && stagiaireSearchForm.searchValue) {
        searchParams.append('telephone', stagiaireSearchForm.searchValue);
      }
      
      console.log('🔍 Search params:', searchParams.toString());
      console.log('🔍 Search type:', stagiaireSearchForm.searchType);
      console.log('🔍 Search value:', stagiaireSearchForm.searchValue);
      
      const response = await apiService.searchStagiaires(searchParams.toString());
      
      console.log('🔍 API response:', response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors de la recherche');
      }
      
      setSearchResults(response.data?.stagiaires || []);
      
      if (response.data?.stagiaires?.length === 0) {
        toast({
          title: 'لا توجد نتائج',
          description: 'لم يتم العثور على متدربين بهذه المعايير',
        });
      } else {
        toast({
          title: 'تم العثور على نتائج',
          description: `تم العثور على ${response.data.stagiaires.length} متدرب`,
        });
      }
      
    } catch (error: any) {
      console.error('Error searching stagiaires:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      toast({
        title: 'خطأ في البحث',
        description: error.message || 'فشل في البحث عن المتدربين',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const assignExistingStagiaireToOffre = async (stagiaire: Stagiaire, idOffre: string) => {
    try {
      setLoading(true);
      
      if (!idOffre) {
        toast({
          title: 'خطأ',
          description: 'يرجى اختيار عرض للتسجيل',
          variant: 'destructive'
        });
        return;
      }

      const response = await apiService.inscrireStagiaire(stagiaire.id_stagiaire, parseInt(idOffre));

      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors de l\'inscription');
      }

      toast({
        title: 'نجح',
        description: 'تم تسجيل المتدرب في العرض بنجاح',
      });

      // Fermer الديالوج وإعادة تعيين
      setIsCreateStagiaireOpen(false);
      resetStagiaireSearchForm();
      setDialogActiveTab('create');
      await fetchAllUsers();

    } catch (error: any) {
      console.error('Error assigning stagiaire to offre:', error);
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل في تسجيل المتدرب في العرض',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
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
      setDialogActiveTab('create');
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
                          {activeTab === 'stagiaires' && expandedRows.has(user.id_stagiaire) && user.inscriptions && user.inscriptions.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="bg-gray-50 dark:bg-gray-800 p-0">
                                <div className="p-4">
                                  <div className="text-center mb-6" dir="rtl">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                      <FileText className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h4 className="text-xl font-bold font-arabic text-gray-900 mb-2">
                                      تسجيلات المتدرب: {user.prenom_ar} {user.nom_ar}
                                    </h4>
                                    <p className="text-gray-600 font-arabic">
                                      إجمالي التسجيلات: {user.inscriptions?.length || 0} تسجيل
                                    </p>
                                  </div>
                                  
                                  
                                  
                                  <div className="space-y-3">
                                    {user.inscriptions.map((inscription: any, idx: number) => (
                                      <div key={inscription.id_inscription || idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-4 py-3 rounded-t-lg border-b border-gray-200 dark:border-gray-600" dir="rtl">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">#{inscription.id_inscription}</span>
                                              </div>
                                              <div className="text-right">
                                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 font-arabic">
                                                  تسجيل في عرض رقم {inscription.id_offre}
                                                </h5>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                                                  {formatDate(inscription.createdAt)}
                                                </p>
                                              </div>
                                            </div>
                                            <div>
                                              {inscription.statut === 'acceptee' ? (
                                                <Badge variant="default" className="font-arabic bg-green-500 text-white">
                                                  ✅ مقبول
                                                </Badge>
                                              ) : inscription.statut === 'en_attente' ? (
                                                <Badge variant="outline" className="font-arabic text-yellow-600 border-yellow-400">
                                                  ⏳ في الانتظار
                                                </Badge>
                                              ) : inscription.statut === 'refusee' ? (
                                                <Badge variant="destructive" className="font-arabic">
                                                  ❌ مرفوض
                                                </Badge>
                                              ) : inscription.statut === 'annulee' ? (
                                                <Badge variant="secondary" className="font-arabic">
                                                  🚫 ملغي
                                                </Badge>
                                              ) : (
                                                <Badge variant="secondary" className="font-arabic">
                                                  {inscription.statut || 'غير محدد'}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-4" dir="rtl">
                                          {inscription.offre && (
                                            <div className="space-y-4">
                                              {/* معلومات العرض */}
                                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                                  <span className="font-semibold text-gray-700 dark:text-gray-300 font-arabic">معلومات العرض</span>
                                                </div>
                                                <div className="space-y-2 text-right">
                                                  {inscription.offre.specialite && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                                                      <span className="font-medium">التخصص:</span> {inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr}
                                                    </div>
                                                  )}
                                                  {inscription.offre.diplome && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                                                      <span className="font-medium">الدبلوم:</span> {inscription.offre.diplome.designation_ar || inscription.offre.diplome.designation_fr}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              
                                              {/* التفاصيل */}
                                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <Calendar className="w-4 h-4 text-green-600" />
                                                  <span className="font-semibold text-gray-700 dark:text-gray-300 font-arabic">التفاصيل</span>
                                                </div>
                                                <div className="space-y-2 text-right">
                                                  {inscription.offre.etablissementFormation && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                                                      <span className="font-medium">المؤسسة:</span> {inscription.offre.etablissementFormation.nom_ar || inscription.offre.etablissementFormation.nom_fr}
                                                    </div>
                                                  )}
                                                  {inscription.offre.date_debut && inscription.offre.date_fin && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                                                      <span className="font-medium">الفترة:</span> {inscription.offre.date_debut} - {inscription.offre.date_fin}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic text-right">
              إدارة المتدربين
            </DialogTitle>
            <DialogDescription className="font-arabic text-right">
              إنشاء متدرب جديد أو البحث عن متدرب موجود وتسجيله في عرض
            </DialogDescription>
          </DialogHeader>

          <Tabs value={dialogActiveTab} onValueChange={setDialogActiveTab} className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-xl border border-blue-200 shadow-sm">
              <TabsTrigger 
                value="create" 
                className={`font-arabic transition-all duration-300 rounded-lg ${
                  dialogActiveTab === 'create' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
                }`}
              >
                <UserPlus className="w-4 h-4 ml-2" />
                إنشاء متدرب جديد
              </TabsTrigger>
              <TabsTrigger 
                value="existing" 
                className={`font-arabic transition-all duration-300 rounded-lg ${
                  dialogActiveTab === 'existing' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Search className="w-4 h-4 ml-2" />
                البحث عن متدرب موجود
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6" dir="rtl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <UserPlus className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold font-arabic text-gray-900 mb-3">إنشاء متدرب جديد</h3>
                <p className="text-gray-600 font-arabic text-lg leading-relaxed max-w-2xl mx-auto">
                  أدخل معلومات المتدرب وإنشاء حساب له (اختياري) وتسجيله في عرض (اختياري)
                </p>
              </div>
              
              <div className="grid gap-6">
                {/* Informations de base */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300" dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h4 className="text-xl font-bold font-arabic text-gray-900 text-right">المعلومات الأساسية</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-arabic text-gray-700">الاسم بالفرنسية *</Label>
                      <Input
                        value={stagiaireForm.nom_fr}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, nom_fr: e.target.value }))}
                        dir="ltr"
                        placeholder="Nom en français"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="font-arabic text-gray-700">اللقب بالفرنسية *</Label>
                      <Input
                        value={stagiaireForm.prenom_fr}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, prenom_fr: e.target.value }))}
                        dir="ltr"
                        placeholder="Prénom en français"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="font-arabic text-gray-600">الاسم بالعربية</Label>
                      <Input
                        value={stagiaireForm.nom_ar}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, nom_ar: e.target.value }))}
                        dir="rtl"
                        placeholder="اسم العائلة"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="font-arabic text-gray-600">اللقب بالعربية</Label>
                      <Input
                        value={stagiaireForm.prenom_ar}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, prenom_ar: e.target.value }))}
                        dir="rtl"
                        placeholder="الاسم الأول"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300" dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h4 className="text-xl font-bold font-arabic text-gray-900 text-right">معلومات الاتصال</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-arabic text-gray-700">البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={stagiaireForm.email}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, email: e.target.value }))}
                        dir="ltr"
                        placeholder="email@exemple.com"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="font-arabic text-gray-700">رقم الهاتف</Label>
                      <Input
                        value={stagiaireForm.telephone}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, telephone: e.target.value }))}
                        dir="ltr"
                        placeholder="+212-6-1234-5678"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="font-arabic text-gray-600">تاريخ الميلاد</Label>
                      <Input
                        type="date"
                        value={stagiaireForm.date_naissance}
                        onChange={(e) => setStagiaireForm(prev => ({ ...prev, date_naissance: e.target.value }))}
                        dir="ltr"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                

                {/* Options avancées */}
                <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300" dir="rtl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h4 className="text-xl font-bold font-arabic text-gray-900 text-right">الخيارات المتقدمة</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="create-account"
                        checked={createAccountForStagiaire}
                        onChange={(e) => setCreateAccountForStagiaire(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="create-account" className="font-arabic text-gray-700 cursor-pointer">
                        إنشاء حساب مستخدم للمتدرب
                      </Label>
                    </div>

                    {createAccountForStagiaire && (
                      <div className="pl-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-arabic text-gray-700">اسم المستخدم *</Label>
                            <Input
                              value={stagiaireForm.username}
                              onChange={(e) => setStagiaireForm(prev => ({ ...prev, username: e.target.value }))}
                              dir="ltr"
                              placeholder="nom.prenom"
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="font-arabic text-gray-700">كلمة المرور *</Label>
                            <Input
                              type="password"
                              value={stagiaireForm.password}
                              onChange={(e) => setStagiaireForm(prev => ({ ...prev, password: e.target.value }))}
                              dir="ltr"
                              placeholder="كلمة مرور آمنة"
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="auto-inscription"
                        checked={autoInscription}
                        onChange={(e) => setAutoInscription(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="auto-inscription" className="font-arabic text-gray-700 cursor-pointer">
                        التسجيل التلقائي في عرض
                      </Label>
                    </div>

                    {autoInscription && (
                      <div className="pl-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <Label className="font-arabic text-gray-700">اختيار العرض</Label>
                        <Select
                          value={stagiaireForm.id_offre}
                          onValueChange={(value) => setStagiaireForm(prev => ({ ...prev, id_offre: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="اختيار عرض من القائمة" />
                          </SelectTrigger>
                          <SelectContent>
                            {offres.map((offre) => (
                              <SelectItem key={offre.id_offre} value={offre.id_offre.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{offre.designation_fr}</span>
                                  {offre.specialite && (
                                    <span className="text-sm text-gray-500">
                                      {offre.specialite.designation_fr}
                                    </span>
                                  )}
                                  {offre.diplome && (
                                    <span className="text-xs text-gray-400">
                                      {offre.diplome.designation_fr}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter dir="rtl">
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
            </TabsContent>

            <TabsContent value="existing" className="space-y-6" dir="rtl">
              {/* Formulaire de recherche */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold font-arabic text-gray-900 mb-3">البحث عن متدرب موجود</h3>
                <p className="text-gray-600 font-arabic text-lg leading-relaxed max-w-2xl mx-auto">
                  ابحث عن متدرب موجود بواسطة معايير مختلفة وقم بتسجيله في عرض
                </p>
              </div>
              
              <div className="space-y-6" dir="rtl">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-arabic">نوع البحث</Label>
                    <Select
                      value={stagiaireSearchForm.searchType || 'id_compte'}
                      onValueChange={(value) => setStagiaireSearchForm(prev => ({ 
                        ...prev, 
                        searchType: value,
                        searchValue: '' // Reset search value when changing type
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختيار نوع البحث" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id_compte">رقم الحساب (رقم الضمان الاجتماعي)</SelectItem>
                        <SelectItem value="nom_fr">الاسم بالفرنسية</SelectItem>
                        <SelectItem value="prenom_fr">اللقب بالفرنسية</SelectItem>
                        <SelectItem value="email">البريد الإلكتروني</SelectItem>
                        <SelectItem value="telephone">رقم الهاتف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="font-arabic">قيمة البحث</Label>
                    <Input
                      value={stagiaireSearchForm.searchValue}
                      onChange={(e) => setStagiaireSearchForm(prev => ({ ...prev, searchValue: e.target.value }))}
                      dir="ltr"
                      placeholder={
                        stagiaireSearchForm.searchType === 'id_compte' ? '123456789' :
                        stagiaireSearchForm.searchType === 'nom_fr' ? 'Nom en français' :
                        stagiaireSearchForm.searchType === 'prenom_fr' ? 'Prénom en français' :
                        stagiaireSearchForm.searchType === 'email' ? 'email@exemple.com' :
                        stagiaireSearchForm.searchType === 'telephone' ? '+212-6-1234-5678' :
                        'أدخل قيمة البحث'
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={searchExistingStagiaires}
                    disabled={isSearching || !stagiaireSearchForm.searchValue || !stagiaireSearchForm.searchType}
                    className="font-arabic"
                  >
                    {isSearching ? 'جاري البحث...' : 'البحث'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetStagiaireSearchForm}
                    className="font-arabic"
                  >
                    إعادة تعيين
                  </Button>
                </div>
              </div>

              {/* Résultats de recherche */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-semibold font-arabic">نتائج البحث</h4>
                  
                  <div className="space-y-3">
                    {searchResults.map((stagiaire) => (
                      <div
                        key={stagiaire.id_stagiaire}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedExistingStagiaire?.id_stagiaire === stagiaire.id_stagiaire
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedExistingStagiaire(stagiaire)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold font-arabic text-lg mb-2">
                              {stagiaire.prenom_fr} {stagiaire.nom_fr}
                            </h5>
                            {stagiaire.nom_ar && stagiaire.prenom_ar && (
                              <p className="text-sm text-gray-600 font-arabic mb-1">
                                {stagiaire.prenom_ar} {stagiaire.nom_ar}
                              </p>
                            )}
                            <div className="space-y-1">
                              {stagiaire.email && (
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {stagiaire.email}
                                </p>
                              )}
                              {stagiaire.telephone && (
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {stagiaire.telephone}
                                </p>
                              )}
                              {stagiaire.Compte && (
                                <p className="text-sm text-blue-600 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  حساب: {stagiaire.Compte.username}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <Badge variant="outline" className="font-arabic text-sm">
                              {stagiaire.inscriptions?.length || 0} تسجيل
                            </Badge>
                          </div>
                        </div>

                        {/* عرض التسجيلات الموجودة */}
                        {stagiaire.inscriptions && stagiaire.inscriptions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h6 className="text-sm font-medium text-gray-700 mb-2 font-arabic">
                              التسجيلات الموجودة:
                            </h6>
                            <div className="space-y-2">
                              {stagiaire.inscriptions.map((inscription) => (
                                <div key={inscription.id_inscription} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      {inscription.offre?.specialite?.designation_fr || 'تخصص غير محدد'}
                                    </span>
                                    <span className="text-blue-600 font-medium">
                                      {inscription.offre?.etablissementFormation?.nom_fr || 'مؤسسة غير محدد'}
                                    </span>
                                  </div>
                                  {inscription.offre?.diplome && (
                                    <div className="text-gray-500 mt-1">
                                      {inscription.offre.diplome.designation_fr}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sélection de l'offre pour l'inscription */}
                  {selectedExistingStagiaire && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h5 className="font-semibold font-arabic mb-3">
                        تسجيل {selectedExistingStagiaire.prenom_fr} {selectedExistingStagiaire.nom_fr} في عرض
                      </h5>
                      
                      <div className="space-y-3">
                        <div>
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

                        <Button
                          onClick={() => assignExistingStagiaireToOffre(selectedExistingStagiaire, stagiaireForm.id_offre)}
                          disabled={loading || !stagiaireForm.id_offre}
                          className="font-arabic"
                        >
                          {loading ? 'جاري التسجيل...' : 'تسجيل المتدرب في العرض'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateStagiaireOpen(false);
                    resetStagiaireSearchForm();
                    setDialogActiveTab('create');
                  }}
                  className="font-arabic"
                >
                  إغلاق
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
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