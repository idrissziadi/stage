import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { Module } from '@/types';
import { 
  formatSafeDate, 
  formatRelativeDate, 
  getTimeAgo,
  formatCourseDateFrench,
  formatCollaborativeCourseDate,
  isValidDate
} from '@/utils/dateHelpers';
import { formatDateToArabic } from '@/utils/arabicDateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import ProgrammePDFViewer from '@/components/ui/programme-pdf-viewer';
import { 
  Users, 
  FileText, 
  Eye, 
  Download, 
  Search,
  Filter,
  BookOpen,
  User,
  Calendar,
  CheckCircle,
  Star,
  Share2,
  Clock,
  MoreHorizontal,
  GraduationCap,
  MapPin,
  Building
} from 'lucide-react';

interface Specialite {
  id_specialite: number;
  code_specialite: string;
  designation_fr: string;
  designation_ar: string;
}

interface Programme {
  id_programme: number;
  code_programme: string;
  titre_fr: string;
  titre_ar: string;
  status: string;
  created_at: string;
  updated_at?: string;
  fichierpdf?: string;
  observation?: string;
  enseignant?: {
    nom_fr: string;
    prenom_fr: string;
    nom_ar?: string;
    prenom_ar?: string;
  };
  module?: {
    id_module: number;
    designation_fr: string;
    designation_ar: string;
    code_module: string;
    specialite?: {
      designation_fr: string;
      designation_ar: string;
      code_specialite: string;
    };
  };
  specialite?: {
    designation_fr: string;
    designation_ar: string;
    code_specialite: string;
  };
  etablissementRegionale?: {
    nom_fr: string;
    nom_ar?: string;
  };
  duree?: string;
}

const ProgrammeView = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [specialiteFilter, setSpecialiteFilter] = useState('all');
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les programmes pour l'enseignant
      const programmesResponse = await apiService.getProgrammesByEnseignant(userProfile.id_enseignant);
      console.log('Programmes response:', programmesResponse);
      
      if (programmesResponse.data) {
        // SOLUTION EXTRAORDINAIRE : Mapping des données pour corriger le problème des dates
        const programmesMapped = programmesResponse.data.map((programme: any) => {
          // Log des dates pour debug
          console.log(`Programme ${programme.id_programme} - Dates brutes:`, {
            createdAt: programme.createdAt,
            updatedAt: programme.updatedAt,
            created_at: programme.created_at,
            updated_at: programme.updated_at,
            status: programme.status
          });
          
          // Mapping intelligent des dates : backend utilise createdAt/updatedAt, frontend attend created_at/updated_at
          return {
            ...programme,
            created_at: programme.createdAt || programme.created_at,
            updated_at: programme.updatedAt || programme.updated_at,
            // Assurer la compatibilité avec les deux formats
            createdAt: programme.createdAt,
            updatedAt: programme.updatedAt
          };
        });
        
        console.log('Programmes après mapping:', programmesMapped);
        setProgrammes(programmesMapped);
      } else {
        setProgrammes([]);
      }
      
      // Récupérer les modules de l'enseignant uniquement
      const modulesResponse = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      console.log('Modules de l\'enseignant:', modulesResponse);
      
      if (modulesResponse.data && modulesResponse.data.data) {
        setModules(modulesResponse.data.data);
      } else if (modulesResponse.data && Array.isArray(modulesResponse.data)) {
        setModules(modulesResponse.data);
      } else {
        console.error('Unexpected modules response structure:', modulesResponse);
        setModules([]);
      }
      
      // Récupérer les spécialités des modules de l'enseignant uniquement
      const specialitesResponse = await apiService.getAllSpecialites();
      console.log('Specialites response:', specialitesResponse);
      
      if (specialitesResponse.data && specialitesResponse.data.data) {
        // Filtrer seulement les spécialités des modules de l'enseignant
        const specialitesEnseignant = specialitesResponse.data.data.filter((specialite: any) => {
          return modules.some(module => module.specialite?.id_specialite === specialite.id_specialite);
        });
        setSpecialites(specialitesEnseignant);
      } else if (specialitesResponse.data && Array.isArray(specialitesResponse.data)) {
        // Filtrer seulement les spécialités des modules de l'enseignant
        const specialitesEnseignant = specialitesResponse.data.filter((specialite: any) => {
          return modules.some(module => module.specialite?.id_specialite === specialite.id_specialite);
        });
        setSpecialites(specialitesEnseignant);
      } else {
        console.error('Unexpected specialites response structure:', specialitesResponse);
        setSpecialites([]);
      }
      
    } catch (error) {
      console.error('Error fetching programmes:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل البرامج',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (programme: Programme) => {
    setSelectedProgramme(programme);
    setIsPdfViewerOpen(true);
  };

  const handleDownloadPDF = async (programme: Programme) => {
    if (!programme.fichierpdf) {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذا البرنامج',
        variant: 'destructive'
      });
      return;
    }

    try {
      const pdfUrl = getFileUrl(programme.fichierpdf, 'programmes');
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${programme.titre_ar || programme.titre_fr || programme.code_programme}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'نجح',
        description: 'تم تحميل الملف بنجاح',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الملف',
        variant: 'destructive'
      });
    }
  };

  const handleClosePDF = () => {
    setIsPdfViewerOpen(false);
    setSelectedProgramme(null);
  };

  // Helper function to generate user initials for avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'AS';
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || 'AS';
  };

  // Helper function to get time ago - using utility function
  const getTimeAgoSafe = (dateString: string) => {
    // Use the same getTimeAgo function as courses
    return getTimeAgo(dateString);
  };

  // SOLUTION EXTRAORDINAIRE : Fonction robuste pour formater les dates des programmes
  const formatApprovalDateSafe = (programme: Programme) => {
    // Essayer tous les formats possibles de dates
    const possibleDates = [
      programme.updated_at,      // Format frontend
      programme.updatedAt,       // Format backend
      programme.created_at,      // Format frontend
      programme.createdAt        // Format backend
    ];
    
    // Trouver la première date valide
    let validDate = null;
    for (const date of possibleDates) {
      if (date && isValidDate(date)) {
        validDate = date;
        break;
      }
    }
    
          if (validDate) {
        // Afficher seulement la date complète en arabe (31 أوت 2025)
        const dateComplete = formatDateToArabic(validDate);
        console.log('✅ Date valide trouvée pour programme:', {
          programmeId: programme.id_programme,
          dateUtilisee: validDate,
          dateComplete: dateComplete
        });
        return dateComplete;
      } else {
      // Aucune date valide trouvée
      console.warn('❌ Aucune date valide trouvée pour programme:', {
        programmeId: programme.id_programme,
        datesTestees: possibleDates
      });
      return 'غير محدد';
    }
  };

  const getSpecialiteStats = () => {
    if (!Array.isArray(specialites) || specialites.length === 0) {
      return [];
    }
    
    const stats = specialites.map(specialite => {
      // Filtrer les programmes de cette spécialité
      const specialiteProgrammes = programmes.filter(programme => 
        programme.module?.specialite?.id_specialite === specialite.id_specialite
      );
      
      // Compter les établissements uniques pour cette spécialité
      const etablissementsUniques = [...new Set(specialiteProgrammes.map(programme => 
        programme.etablissementRegionale?.nom_fr || 'غير محدد'
      ))].filter(nom => nom !== 'غير محدد');
      
      return {
        specialite,
        programmeCount: specialiteProgrammes.length,
        etablissements: etablissementsUniques.length
      };
    });
    
    // Trier par nombre de programmes décroissant
    return stats.sort((a, b) => b.programmeCount - a.programmeCount);
  };

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.code_programme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.module?.designation_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.module?.designation_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.module?.specialite?.designation_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.module?.specialite?.designation_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.etablissementRegionale?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.etablissementRegionale?.nom_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = moduleFilter === 'all' || 
                         programme.module?.id_module.toString() === moduleFilter;
    
    const matchesSpecialite = specialiteFilter === 'all' || 
                             programme.module?.specialite?.id_specialite.toString() === specialiteFilter;
    
    return matchesSearch && matchesModule && matchesSpecialite;
  });

  const specialiteStats = getSpecialiteStats();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل البرامج...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">برامج المواد</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                استعرض البرامج التعليمية المعتمدة من المؤسسات الجهوية
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">المواد المشتركة</p>
                <p className="text-2xl font-bold text-blue-700">{modules.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">البرامج المتاحة</p>
                <p className="text-2xl font-bold text-green-700">{programmes.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">المؤسسات المشاركة</p>
                <p className="text-2xl font-bold text-purple-700">
                  {[...new Set(programmes.map(programme => 
                    programme.etablissementRegionale?.nom_fr || 'غير محدد'
                  ))].filter(nom => nom !== 'غير محدد').length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialite Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إحصائيات التخصصات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialiteStats.map((stat) => (
              <div key={stat.specialite.id_specialite} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 font-arabic">
                      {stat.specialite.designation_ar || stat.specialite.designation_fr}
                    </h3>
                    <p className="text-sm text-gray-600">({stat.specialite.code_specialite})</p>
                  </div>
                  <Badge variant="secondary">{stat.programmeCount} برامج</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span className="font-arabic">{stat.etablissements} مؤسسة مشاركة</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modern Search Bar */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ابحث في البرامج التعليمية... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 pl-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-right font-arabic focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
                dir="rtl"
              />
            </div>
            
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="تصفية حسب المادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواد</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module.id_module} value={module.id_module.toString()}>
                    {module.designation_ar || module.designation_fr} ({module.code_module})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={specialiteFilter} onValueChange={setSpecialiteFilter}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="تصفية حسب التخصص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التخصصات</SelectItem>
                {Array.isArray(specialites) && specialites.map(specialite => (
                  <SelectItem key={specialite.id_specialite} value={specialite.id_specialite.toString()}>
                    {specialite.designation_ar || specialite.designation_fr} ({specialite.code_specialite})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="font-arabic">البحث في العناوين، التخصصات، والمؤسسات</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Style Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">
            البرامج التعليمية ({filteredProgrammes.length})
          </h2>
        </div>
        
        {filteredProgrammes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد برامج متاحة</h3>
              <p className="text-gray-600 font-arabic">
                {searchTerm || specialiteFilter !== 'all' 
                  ? 'لا توجد برامج تطابق معايير البحث'
                  : 'لا توجد برامج معتمدة متاحة في التخصصات التي تدرسها حالياً'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProgrammes.map((programme) => (
              <Card key={programme.id_programme} className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  {/* Post Header - Facebook Style - EXACTEMENT comme les cours */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Programme Avatar - Style identique aux cours */}
                        <Avatar className="w-12 h-12 border-2 border-gradient-to-r from-green-400 to-blue-500">
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold text-sm">
                            {programme.enseignant ? 
                              `${programme.enseignant.prenom_fr?.charAt(0) || ''}${programme.enseignant.nom_fr?.charAt(0) || ''}` :
                              (programme.etablissementRegionale?.nom_fr?.substring(0, 2) || 'ER')
                            }
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Programme Info - Style identique aux cours */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                              {programme.enseignant ? 
                                `${programme.enseignant.prenom_fr} ${programme.enseignant.nom_fr}` :
                                (programme.etablissementRegionale?.nom_ar || programme.etablissementRegionale?.nom_fr || 'مؤسسة تعليمية')
                              }
                            </h3>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              {programme.enseignant ? 'زميل' : 'مؤسسة تعليمية'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="font-arabic">{getTimeAgoSafe(programme.created_at)}</span>
                            <span className="mx-1">•</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              معتمد
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Post Options - Style identique aux cours */}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Post Content - Style identique aux cours */}
                  <div className="p-4">
                    {/* Programme Title - Style identique aux cours */}
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-arabic leading-relaxed">
                        {programme.titre_ar || programme.titre_fr || 'بدون عنوان'}
                      </h2>
                      
                      {/* French Title if different - Style identique aux cours */}
                      {programme.titre_fr && programme.titre_ar && programme.titre_fr !== programme.titre_ar && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          {programme.titre_fr}
                        </p>
                      )}
                    </div>
                    
                    {/* Programme Description/Observation - Style identique aux cours */}
                    {programme.observation && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-400">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-arabic leading-relaxed">
                          {programme.observation}
                        </p>
                      </div>
                    )}
                    
                    {/* Programme Metadata - Style identique aux cours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">كود البرنامج:</span>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {programme.code_programme}
                          </p>
                        </div>
                      </div>
                      
                      {programme.module && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-purple-100 dark:bg-purple-800 rounded-full">
                            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">المادة:</span>
                            <p className="text-gray-900 dark:text-white font-medium font-arabic">
                              {programme.module.designation_ar || programme.module.designation_fr} ({programme.module.code_module})
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {programme.module?.specialite && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">التخصص:</span>
                            <p className="text-gray-900 dark:text-white font-medium font-arabic">
                              {programme.module.specialite.designation_ar || programme.module.specialite.designation_fr} ({programme.module.specialite.code_specialite})
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {programme.etablissementRegionale && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-orange-100 dark:bg-orange-800 rounded-full">
                            <Building className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">المؤسسة:</span>
                            <p className="text-gray-900 dark:text-white font-medium font-arabic">
                              {programme.etablissementRegionale.nom_ar || programme.etablissementRegionale.nom_fr}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {programme.enseignant && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">الأستاذ المسؤول:</span>
                            <p className="text-gray-900 dark:text-white font-medium font-arabic">
                              {programme.enseignant.prenom_ar || programme.enseignant.prenom_fr} {programme.enseignant.nom_ar || programme.enseignant.nom_fr}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {programme.duree && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-green-100 dark:bg-green-800 rounded-full">
                            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">المدة:</span>
                            <p className="text-gray-900 dark:text-white font-medium font-arabic">
                              {programme.duree}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 bg-green-100 dark:bg-green-800 rounded-full">
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ الاعتماد:</span>
                          <p className="text-gray-900 dark:text-white font-medium font-arabic">
                            {formatApprovalDateSafe(programme)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Actions - Facebook Style - EXACTEMENT comme les cours */}
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between p-2">
                      {/* Action Buttons - Style identique aux cours */}
                      <div className="flex items-center gap-1">
                        {programme.fichierpdf && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPDF(programme)}
                              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="font-arabic text-sm">عرض</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadPDF(programme)}
                              className="flex items-center gap-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span className="font-arabic text-sm">تحميل</span>
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="font-arabic text-sm">مشاركة</span>
                        </Button>
                      </div>
                      
                      {/* Reading Status - Style identique aux cours */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <BookOpen className="w-3 h-3" />
                        <span className="font-arabic">متاح للتعلم</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Educational Note */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1 font-arabic">ملاحظة تعليمية</h4>
              <p className="text-sm text-green-800 font-arabic">
                هذه البرامج متاحة للاطلاع والاستفادة في التخصصات التي تدرسها. 
                يمكنك الاستفادة منها لتطوير محتوى دروسك أو للحصول على أفكار جديدة في التدريس.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programme PDF Viewer */}
      {selectedProgramme && (
        <ProgrammePDFViewer
          isOpen={isPdfViewerOpen}
          onClose={handleClosePDF}
          programme={selectedProgramme}
          userRole="Enseignant"
        />
      )}
    </div>
  );
};

export default ProgrammeView;