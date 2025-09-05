import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Eye, 
  Download, 
  Search,
  Filter,
  BookOpen,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { formatDateToArabic, formatRelativeDateToArabic, formatCourseDateToArabic } from '@/utils/arabicDateFormatter';
import CourseMemoirePDFViewer from '@/components/ui/course-memoire-pdf-viewer';

interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
}

interface Enseignant {
  id_enseignant: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar?: string;
  prenom_ar?: string;
}

interface Course {
  id_cours: number;
  id_module: number;
  code_cours: string;
  titre_fr: string;
  titre_ar: string;
  status: string;
  created_at: string;
  updated_at?: string;
  fichierpdf?: string;
  observation?: string;
  module?: {
    id_module: number;
    code_module: string;
    designation_fr: string;
    designation_ar: string;
  };
  enseignant?: Enseignant;
}

const CoursManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [enseignantFilter, setEnseignantFilter] = useState('all');
  
  // Modal states
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [observationText, setObservationText] = useState('');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (userProfile?.id_etab_regionale) {
      fetchData();
    } else {
      // Forcer le chargement après 2 secondes pour éviter le blocage
      setTimeout(() => {
        if (!loading) {
          fetchData();
        }
      }, 2000);
    }
  }, [userProfile]);

  const fetchData = async () => {
    // Timeout de sécurité (30 secondes)
    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast({
        title: 'خطأ',
        description: 'انتهت مهلة انتظار الخادم. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    }, 30000);

         try {
       setLoading(true);
       
       // Test 1: Fetch all courses for regional establishment
       try {
         const coursesResponse = await apiService.getAllCours();
         setCourses(coursesResponse.data || []);
       } catch (coursesError) {
         console.warn('⚠️ Erreur lors de la récupération des cours:', coursesError);
         setCourses([]);
       }
       
       // Test 2: Fetch modules
       try {
         const modulesResponse = await apiService.getModules();
         setModules(modulesResponse.data || []);
       } catch (modulesError) {
         console.warn('⚠️ Erreur lors de la récupération des modules:', modulesError);
         setModules([]);
       }
       
       // Test 3: Fetch enseignants - utiliser une méthode alternative
       if (userProfile?.id_etab_regionale) {
         try {
           // Essayer d'abord la méthode régionale
           const enseignantsResponse = await apiService.getEnseignantsByEtablissementRegional(userProfile.id_etab_regionale, '', 1000, 0);
           setEnseignants(enseignantsResponse.data || []);
         } catch (enseignantsError) {
           console.warn('⚠️ Erreur avec getEnseignantsByEtablissementRegional, essai avec getAllExistingEnseignants:', enseignantsError);
           try {
             // Fallback: utiliser la méthode générale
             const fallbackResponse = await apiService.getAllExistingEnseignants('', 1000, 0);
             setEnseignants(fallbackResponse.data || []);
           } catch (fallbackError) {
             console.warn('⚠️ Erreur avec getAllExistingEnseignants aussi:', fallbackError);
             // Continuer sans les enseignants
             setEnseignants([]);
           }
         }
       } else {
         setEnseignants([]);
       }
      
    } catch (error) {
      console.error('❌ Erreur dans fetchData:', error);
      
      // Afficher plus de détails sur l'erreur
      if (error.response) {
        console.error('❌ Response error:', error.response.data);
        console.error('❌ Status:', error.response.status);
      }
      
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل البيانات',
        variant: 'destructive'
      });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleStatusChange = async (courseId: number, newStatus: string) => {
    try {
      // Update course status using regional API
      const response = await apiService.updateCoursRegional(courseId, { status: newStatus });
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في تحديث الحالة');
      }
      
             // Update local state
       setCourses(prev => prev.map(course => {
         try {
           return course.id_cours === courseId 
             ? { ...course, status: newStatus, updated_at: new Date().toISOString() }
             : course;
         } catch (error) {
           console.warn('⚠️ Erreur lors de la mise à jour du cours:', courseId, error);
           return course;
         }
       }));
      
      toast({
        title: 'نجح',
        description: `تم تحديث حالة الدرس إلى ${getStatusText(newStatus)}`,
      });
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة الدرس',
        variant: 'destructive'
      });
    }
  };

  const handleObservationSubmit = async () => {
    if (!selectedCourse || !observationText.trim()) return;
    
    try {
      // Update course observation using regional API
      const response = await apiService.updateCoursRegional(selectedCourse.id_cours, { observation: observationText });
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في إضافة الملاحظة');
      }
      
             // Update local state
       setCourses(prev => prev.map(course => {
         try {
           return course.id_cours === selectedCourse.id_cours 
             ? { ...course, observation: observationText, updated_at: new Date().toISOString() }
             : course;
         } catch (error) {
           console.warn('⚠️ Erreur lors de la mise à jour de l\'observation:', selectedCourse.id_cours, error);
           return course;
         }
       }));
      
      toast({
        title: 'نجح',
        description: 'تم إضافة الملاحظة بنجاح',
      });
      
      setIsObservationOpen(false);
      setSelectedCourse(null);
      setObservationText('');
      
    } catch (error) {
      console.error('Error adding observation:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إضافة الملاحظة',
        variant: 'destructive'
      });
    }
  };

  const handleViewPDF = (course: Course) => {
    setViewingCourse(course);
    setIsPdfViewerOpen(true);
  };

  const handleDownloadPDF = async (course: Course) => {
    if (!course.fichierpdf) {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذا الدرس',
        variant: 'destructive'
      });
      return;
    }

    try {
      const pdfUrl = getFileUrl(course.fichierpdf, 'cours');
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course.titre_ar || course.titre_fr || course.code_cours}.pdf`;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'في_الانتظار':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg';
      case 'مرفوض':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'مقبول': 'مقبول',
      'في_الانتظار': 'في الانتظار',
      'مرفوض': 'مرفوض'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مقبول':
        return <CheckCircle className="w-4 h-4" />;
      case 'في_الانتظار':
        return <Clock className="w-4 h-4" />;
      case 'مرفوض':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredCourses = courses.filter(course => {
    try {
      const matchesSearch = course.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code_cours?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.enseignant?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.enseignant?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
      const matchesModule = moduleFilter === 'all' || course.id_module.toString() === moduleFilter;
      
      // Gestion sécurisée du filtre enseignant
      let matchesEnseignant = true;
      if (enseignantFilter !== 'all') {
        try {
          matchesEnseignant = course.enseignant?.id_enseignant?.toString() === enseignantFilter;
        } catch (enseignantError) {
          console.warn('⚠️ Erreur lors du filtrage par enseignant:', course.id_cours, enseignantError);
          matchesEnseignant = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesModule && matchesEnseignant;
    } catch (error) {
      console.warn('⚠️ Erreur lors du filtrage du cours:', course.id_cours, error);
      return false; // Exclure le cours problématique
    }
  });

  const getStats = () => {
    try {
      return {
        total: courses.length,
        approuves: courses.filter(c => c.status === 'مقبول').length,
        enAttente: courses.filter(c => c.status === 'في_الانتظار').length,
        rejetes: courses.filter(c => c.status === 'مرفوض').length
      };
    } catch (error) {
      console.warn('⚠️ Erreur lors du calcul des statistiques:', error);
      return {
        total: 0,
        approuves: 0,
        enAttente: 0,
        rejetes: 0
      };
    }
  };

  const stats = getStats();

  // Helper function to get time ago - using utility function
  const getTimeAgoSafe = (dateString: string) => {
    return formatRelativeDateToArabic(dateString);
  };

  // Helper function to safely format course date - using utility function
  const formatCourseDateSafe = (course: Course) => {
    // Use formatCourseDateToArabic to match collaborative courses format
    const result = formatCourseDateToArabic(course);
    return result;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground dark:text-muted-foreground">جارٍ تحميل الدروس...</p>
        

      </div>
    );
  }

  if (!userProfile?.id_etab_regionale) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">خطأ في البيانات</h3>
        <p className="text-muted-foreground mb-4">
          لم يتم العثور على معرف المؤسسة الإقليمية. يرجى إعادة تسجيل الدخول.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          إعادة تحميل الصفحة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">


             {/* Header with Statistics */}
       <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl overflow-hidden">
         <CardHeader className="pb-6">
                       <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary dark:text-blue-400" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 font-arabic mb-2">إدارة الدروس</h2>
                <p className="text-base text-blue-700 dark:text-blue-300 font-arabic">
                  مراجعة وإدارة جميع الدروس في المنطقة التعليمية
                </p>
              </div>
            </CardTitle>
         </CardHeader>
                 <CardContent>
           <div className="grid gap-6 md:grid-cols-4 rtl">
             <div className="flex items-center gap-4 p-4 bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
               <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                 <BookOpen className="w-8 h-8 text-primary dark:text-blue-400" />
               </div>
               <div className="text-right">
                 <p className="text-sm font-medium text-blue-700 dark:text-blue-300 font-arabic mb-1">إجمالي الدروس</p>
                 <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stats.total}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-gradient-to-l from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
               <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                 <CheckCircle className="w-8 h-8 text-success dark:text-green-400" />
               </div>
               <div className="text-right">
                 <p className="text-sm font-medium text-green-700 dark:text-green-300 font-arabic mb-1">معتمدة</p>
                 <p className="text-3xl font-bold text-green-800 dark:text-green-200">{stats.approuves}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-gradient-to-l from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
               <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                 <Clock className="w-8 h-8 text-warning dark:text-yellow-400" />
               </div>
               <div className="text-right">
                 <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 font-arabic mb-1">في الانتظار</p>
                 <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">{stats.enAttente}</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-gradient-to-l from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700">
               <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full">
                 <XCircle className="w-8 h-8 text-error dark:text-red-400" />
               </div>
               <div className="text-right">
                 <p className="text-sm font-medium text-red-700 dark:text-red-300 font-arabic mb-1">مرفوضة</p>
                 <p className="text-3xl font-bold text-red-800 dark:text-red-200">{stats.rejetes}</p>
               </div>
             </div>
           </div>
         </CardContent>
      </Card>

             {/* Advanced Search and Filters */}
       <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl">
         <CardContent className="p-6">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 rtl">
             <div className="relative">
               <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
               <Input
                 placeholder="البحث في الدروس..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pr-12 pl-4 py-4 bg-card dark:bg-gray-700 border-2 border-green-200 dark:border-green-600 rounded-xl text-right font-arabic focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all shadow-lg"
                 dir="rtl"
               />
             </div>
            
                         <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="bg-card dark:bg-gray-700 border-2 border-green-200 dark:border-green-600 rounded-xl py-4 shadow-lg">
                 <Filter className="w-4 h-4 ml-2 text-green-500" />
                 <SelectValue placeholder="حالة الدرس" className="font-arabic" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all" className="font-arabic">جميع الحالات</SelectItem>
                 <SelectItem value="مقبول" className="font-arabic">معتمدة</SelectItem>
                 <SelectItem value="في_الانتظار" className="font-arabic">في الانتظار</SelectItem>
                 <SelectItem value="مرفوض" className="font-arabic">مرفوضة</SelectItem>
               </SelectContent>
             </Select>

                           <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="bg-card dark:bg-gray-700 border-2 border-green-200 dark:border-green-600 rounded-xl py-4 shadow-lg">
                  <BookOpen className="w-4 h-4 ml-2 text-green-500" />
                  <SelectValue placeholder="المادة" className="font-arabic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-arabic">جميع المواد</SelectItem>
                  {modules.length > 0 ? (
                    modules.map(module => {
                      try {
                        return (
                          <SelectItem key={module.id_module} value={module.id_module.toString()} className="font-arabic">
                            {module.designation_ar || module.designation_fr || 'مادة بدون اسم'}
                          </SelectItem>
                        );
                      } catch (error) {
                        console.warn('⚠️ Erreur lors de l\'affichage du module:', module, error);
                        return null;
                      }
                    }).filter(Boolean)
                  ) : (
                    <SelectItem value="no-modules" disabled className="font-arabic text-muted-foreground">
                      لا توجد بيانات مواد
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

                           <Select value={enseignantFilter} onValueChange={setEnseignantFilter}>
                <SelectTrigger className="bg-card dark:bg-gray-700 border-2 border-green-200 dark:border-green-600 rounded-xl py-4 shadow-lg">
                  <User className="w-4 h-4 ml-2 text-green-500" />
                  <SelectValue placeholder="الأستاذ" className="font-arabic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-arabic">جميع الأساتذة</SelectItem>
                  {enseignants.length > 0 ? (
                    enseignants.map(enseignant => {
                      try {
                        return (
                          <SelectItem key={enseignant.id_enseignant} value={enseignant.id_enseignant.toString()} className="font-arabic">
                            {enseignant.prenom_fr || ''} {enseignant.nom_fr || ''}
                          </SelectItem>
                        );
                      } catch (error) {
                        console.warn('⚠️ Erreur lors de l\'affichage de l\'enseignant:', enseignant, error);
                        return null;
                      }
                    }).filter(Boolean)
                  ) : (
                    <SelectItem value="no-enseignants" disabled className="font-arabic text-muted-foreground">
                      لا توجد بيانات أساتذة
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

             <Button 
               onClick={fetchData} 
               variant="outline" 
               className="bg-card dark:bg-gray-700 border-2 border-green-200 dark:border-green-600 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 py-4 shadow-lg transition-all duration-200"
             >
               <RefreshCw className="w-4 h-4 ml-2 text-green-500" />
               <span className="font-arabic">تحديث</span>
             </Button>
          </div>
        </CardContent>
      </Card>

             {/* Courses List */}
       <Card className="border-2 border-border dark:border-gray-700 rounded-2xl overflow-hidden">
         <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 border-b border-blue-200 dark:border-blue-700">
                       <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <FileText className="w-6 h-6 text-primary dark:text-blue-400" />
              </div>
              <div className="text-right flex-1">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 font-arabic">قائمة الدروس</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-arabic">إجمالي الدروس: {filteredCourses.length}</p>
              </div>
            </CardTitle>
         </CardHeader>
        <CardContent>
                     {filteredCourses.length === 0 ? (
             <div className="text-center py-16">
               <div className="theme-transition-colors p-4 bg-muted dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                 <BookOpen className="w-10 h-10 text-muted-foreground" />
               </div>
               <h3 className="text-xl font-bold text-foreground dark:text-white mb-3 font-arabic">لا توجد دروس</h3>
               <p className="text-muted-foreground dark:text-muted-foreground font-arabic text-lg">
                 {searchTerm || statusFilter !== 'all' || moduleFilter !== 'all' || enseignantFilter !== 'all'
                   ? 'لا توجد دروس تطابق معايير البحث المحددة'
                   : 'لا توجد دروس مسجلة في النظام حالياً'
                 }
               </p>
               <div className="mt-6">
                 <Button 
                   onClick={fetchData} 
                   variant="outline" 
                   className="font-arabic"
                 >
                   <RefreshCw className="w-4 h-4 ml-2" />
                   تحديث البيانات
                 </Button>
               </div>
             </div>
          ) : (
                         <div className="space-y-4">
                               {filteredCourses.map((course) => (
                  <Card key={course.id_cours} className="hover:shadow-xl transition-all duration-300 border-2 border-border dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                       {/* Contenu principal */}
                       <div className="flex-1 space-y-4">
                                                   {/* En-tête avec titre et statut */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 rtl">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-foreground dark:text-white font-arabic mb-2 leading-tight">
                                {course.titre_ar || course.titre_fr || 'بدون عنوان'}
                              </h3>
                                                             <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                                 <span>•</span>
                                 <span>درس رقم: {course.id_cours}</span>
                                 <span>•</span>
                                 <span>تاريخ الإضافة: {formatCourseDateSafe(course)}</span>
                               </div>
                            </div>
                            <Badge className={`px-4 py-2 text-sm font-medium rounded-full shadow-lg ${getStatusColor(course.status)}`}>
                              {getStatusIcon(course.status)}
                              <span className="mr-2 font-arabic">{getStatusText(course.status)}</span>
                            </Badge>
                          </div>
                         
                                                   {/* Informations du cours */}
                          <div className="grid gap-4 md:grid-cols-2 rtl">
                            {/* Code du cours */}
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                              <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                                <FileText className="w-6 h-6 text-primary dark:text-blue-400" />
                              </div>
                              <div className="text-right flex-1">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 font-arabic mb-1">كود الدرس</p>
                                <p className="text-xl font-bold text-blue-900 dark:text-blue-100 font-arabic">{course.code_cours}</p>
                              </div>
                            </div>
                            
                            {/* Module */}
                            {course.module && (
                              <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
                                <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                                  <BookOpen className="w-6 h-6 text-secondary dark:text-purple-400" />
                                </div>
                                <div className="text-right flex-1">
                                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 font-arabic mb-1">المادة</p>
                                  <p className="text-xl font-bold text-purple-900 dark:text-purple-100 font-arabic">
                                    {course.module.designation_ar || course.module.designation_fr}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {/* Enseignant */}
                            {course.enseignant && (
                              <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
                                <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                                  <User className="w-6 h-6 text-success dark:text-green-400" />
                                </div>
                                <div className="text-right flex-1">
                                  <p className="text-sm font-medium text-green-700 dark:text-green-300 font-arabic mb-1">الأستاذ</p>
                                  <p className="text-xl font-bold text-green-900 dark:text-green-100 font-arabic">
                                    {course.enseignant.prenom_fr} {course.enseignant.nom_fr}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {/* Date de création */}
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700">
                              <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-full">
                                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div className="text-right flex-1">
                                <p className="text-sm font-medium text-orange-700 dark:text-orange-300 font-arabic mb-1">تاريخ الرفع</p>
                                                                 <p className="text-xl font-bold text-orange-900 dark:text-orange-100 font-arabic">
                                   {formatCourseDateSafe(course)}
                                 </p>
                              </div>
                            </div>
                          </div>
                         
                                                   {/* Observation */}
                          {course.observation && (
                            <div className="p-5 bg-gradient-to-l from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                                  <MessageSquare className="w-5 h-5 text-warning dark:text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-yellow-800 dark:text-yellow-200 font-arabic text-lg">ملاحظات المشرف</span>
                                  {course.updated_at && (
                                    <p className="text-xs text-warning dark:text-yellow-400 font-arabic mt-1">
                                      آخر تحديث: {formatDateToArabic(course.updated_at)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="theme-transition-colors bg-card dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-600">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-arabic leading-relaxed">{course.observation}</p>
                              </div>
                            </div>
                          )}
                       </div>
                       
                                               {/* Actions */}
                        <div className="flex flex-col gap-4 min-w-[240px]">
                          {/* Status Actions */}
                          {course.status === 'في_الانتظار' && (
                            <div className="space-y-3 p-4 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
                              <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 font-arabic text-center mb-3">إجراءات الحالة</h4>
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(course.id_cours, 'مقبول')}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <CheckCircle className="w-5 h-5 ml-2" />
                                اعتماد الدرس
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(course.id_cours, 'مرفوض')}
                                className="w-full border-2 border-red-300 text-error hover:bg-red-50 hover:border-red-400 font-medium py-3 rounded-xl transition-all duration-200"
                              >
                                <XCircle className="w-5 h-5 ml-2" />
                                رفض الدرس
                              </Button>
                            </div>
                          )}
                          
                          {/* Observation Button */}
                          <div className="p-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 font-arabic text-center mb-3">إدارة الملاحظات</h4>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedCourse(course);
                                setObservationText(course.observation || '');
                                setIsObservationOpen(true);
                              }}
                              className="w-full border-2 border-blue-300 text-primary hover:bg-background-secondary hover:border-blue-400 font-medium py-3 rounded-xl transition-all duration-200"
                            >
                              <MessageSquare className="w-5 h-5 ml-2" />
                              {course.observation ? 'تعديل الملاحظات' : 'إضافة ملاحظات'}
                            </Button>
                          </div>
                          
                          {/* PDF Actions */}
                          {course.fichierpdf && (
                            <div className="p-4 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
                              <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 font-arabic text-center mb-3">إدارة الملف</h4>
                              <div className="space-y-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewPDF(course)}
                                  className="w-full border-2 border-blue-300 text-primary hover:bg-background-secondary hover:border-blue-400 font-medium py-3 rounded-xl transition-all duration-200"
                                >
                                  <Eye className="w-5 h-5 ml-2" />
                                  عرض الملف
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadPDF(course)}
                                  className="w-full border-2 border-green-300 text-success hover:bg-green-50 hover:border-green-400 font-medium py-3 rounded-xl transition-all duration-200"
                                >
                                  <Download className="w-5 h-5 ml-2" />
                                  تحميل PDF
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          )}
        </CardContent>
      </Card>

      {/* Observation Modal */}
      <Dialog open={isObservationOpen} onOpenChange={setIsObservationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {selectedCourse ? `ملاحظات على درس: ${selectedCourse.titre_ar || selectedCourse.titre_fr}` : 'إضافة ملاحظات'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observation" className="font-arabic">الملاحظات</Label>
              <Textarea
                id="observation"
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="اكتب ملاحظاتك على هذا الدرس..."
                className="mt-2 min-h-[120px] font-arabic"
                dir="rtl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsObservationOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleObservationSubmit}>
                حفظ الملاحظات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Modal */}
      {viewingCourse && (
        <CourseMemoirePDFViewer
          isOpen={isPdfViewerOpen}
          onClose={() => {
            setIsPdfViewerOpen(false);
            setViewingCourse(null);
          }}
          item={viewingCourse}
          type="cours"
          userRole="EtablissementRegionale"
        />
      )}
    </div>
  );
};

export default CoursManagement;
