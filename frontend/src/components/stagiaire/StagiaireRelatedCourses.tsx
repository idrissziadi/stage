import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { 
  formatDateToArabic, 
  formatRelativeDateToArabic, 
  formatApprovalDateToArabic,
  formatCourseDateToArabic
} from '@/utils/arabicDateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import CourseMemoirePDFViewer from '@/components/ui/course-memoire-pdf-viewer';
import { 
  BookOpen, 
  FileText, 
  Eye, 
  Download, 
  Search,
  Filter,
  User,
  Calendar,
  CheckCircle,
  GraduationCap,
  Star
} from 'lucide-react';

interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
  specialite?: {
    designation_fr: string;
    designation_ar: string;
  };
}

interface Offre {
  id_offre: number;
  date_debut: string;
  date_fin: string;
  specialite?: {
    designation_fr: string;
    designation_ar: string;
  };
  etablissementFormation?: {
    nom_fr: string;
    nom_ar: string;
  };
}

interface Course {
  id_cours: number;
  id_module: number;
  code_cours: string;
  titre_fr: string;
  titre_ar: string;
  status: string;
  created_at: string;
  fichierpdf?: string;
  observation?: string;
  module?: Module;
  enseignant?: {
    nom_fr: string;
    prenom_fr: string;
  };
}

const StagiaireRelatedCourses = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [modulesByOffre, setModulesByOffre] = useState<{[key: number]: Module[]}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [offreFilter, setOffreFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.id_stagiaire) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses related to stagiaire's specializations
      const response = await apiService.getCoursByStagiaire(userProfile.id_stagiaire.toString());
      const responseData = response.data || {};
      
      // Handle both old format (array) and new format (object)
      let coursesData, modulesData, offresData, modulesByOffreData;
      
      if (Array.isArray(responseData)) {
        // Old format - backward compatibility
        coursesData = responseData;
        modulesData = responseData.reduce((acc: Module[], course: Course) => {
          if (course.module && !acc.find(m => m.id_module === course.module!.id_module)) {
            acc.push(course.module);
          }
          return acc;
        }, []);
        offresData = [];
        modulesByOffreData = {};
      } else {
        // New format
        coursesData = responseData.courses || [];
        modulesData = responseData.modules || [];
        offresData = responseData.offres || [];
        modulesByOffreData = responseData.modulesByOffre || {};
      }
      
      console.log('StagiaireRelatedCourses - Raw response data:', responseData);
      console.log('Courses:', coursesData.length, 'Modules:', modulesData.length, 'Offres:', offresData.length);
      
      setCourses(coursesData);
      setModules(modulesData);
      setOffres(offresData);
      setModulesByOffre(modulesByOffreData);
      
    } catch (error) {
      console.error('Error fetching related courses:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الدروس المرتبطة بتخصصك',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (course: Course) => {
    setSelectedCourse(course);
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

  const handleClosePDF = () => {
    setIsPdfViewerOpen(false);
    setSelectedCourse(null);
  };

  const getOffreStats = () => {
    console.log('🔍 Calculating offre stats for offres:', offres.length);
    console.log('📋 ModulesByOffre data:', modulesByOffre);
    console.log('📚 All modules:', modules.length);
    console.log('🎓 All courses:', courses.length);
    
    const offreStats = offres.map(offre => {
      // Récupérer les modules spécifiques à cette offre
      const offreModules = modulesByOffre[offre.id_offre] || [];
      console.log(`📚 Offre ${offre.id_offre} modules:`, offreModules);
      
      // Compter les cours pour les modules de cette offre
      const offreCourses = courses.filter(course => {
        return offreModules.some(module => module.id_module === course.id_module);
      });
      
      console.log(`🎓 Offre ${offre.id_offre} courses:`, offreCourses.length);
      
      const result = {
        offre,
        courseCount: offreCourses.length,
        moduleCount: offreModules.length
      };
      
      console.log('📊 Offre stat:', {
        offre: offre.specialite?.designation_ar || offre.specialite?.designation_fr || `Offre ${offre.id_offre}`,
        courseCount: result.courseCount,
        moduleCount: result.moduleCount
      });
      
      return result;
    });
    
    console.log('✅ Offre stats result:', offreStats);
    return offreStats;
  };

  const getModuleStats = () => {
    console.log('Calculating module stats for modules:', modules.length);
    const moduleStats = modules.map(module => {
      const moduleCourses = courses.filter(course => course.id_module === module.id_module);
      const instructorNames = moduleCourses
        .map(course => {
          if (course.enseignant?.prenom_fr && course.enseignant?.nom_fr) {
            return `${course.enseignant.prenom_fr} ${course.enseignant.nom_fr}`;
          }
          return null;
        })
        .filter(name => name !== null);
      
      const uniqueInstructors = [...new Set(instructorNames)];
      
      const result = {
        module,
        courseCount: moduleCourses.length,
        instructors: uniqueInstructors.length
      };
      
      console.log('Module stat:', {
        module: module.designation_ar || module.designation_fr,
        courseCount: result.courseCount,
        instructors: result.instructors
      });
      
      return result;
    });
    
    console.log('Module stats result:', moduleStats);
    return moduleStats;
  };

  // Helper function to format course dates robustly
  const formatCourseDateSafe = (course: Course) => {
    return formatCourseDateToArabic(course);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code_cours?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.enseignant?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.enseignant?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.module?.designation_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.module?.designation_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = moduleFilter === 'all' || course.id_module.toString() === moduleFilter;
    
    const matchesOffre = offreFilter === 'all' || 
                         (course.module?.specialite?.designation_ar === offreFilter) ||
                         (course.module?.specialite?.designation_fr === offreFilter);
    
    return matchesSearch && matchesModule && matchesOffre;
  });

  const offreStats = getOffreStats();
  const moduleStats = getModuleStats();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground dark:text-muted-foreground">جارٍ تحميل الدروس المرتبطة بتخصصك...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-success dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground dark:text-white font-arabic">الدروس</h2>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                دروس معتمدة في التخصصات التي أنت مسجل بها
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-arabic">العروض</p>
                <p className="text-2xl font-bold text-green-700">{offreStats.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-arabic">المواد</p>
                <p className="text-2xl font-bold text-blue-700">{modules.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-arabic">الدروس المتاحة</p>
                <p className="text-2xl font-bold text-orange-700">{courses.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offre Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إحصائيات العروض</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offreStats.map((stat, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground font-arabic">
                      {stat.offre.specialite?.designation_ar || stat.offre.specialite?.designation_fr || `عرض ${stat.offre.id_offre}`}
                    </h3>
                    {stat.offre.etablissementFormation && (
                      <p className="text-sm text-muted-foreground font-arabic">
                        {stat.offre.etablissementFormation.nom_ar || stat.offre.etablissementFormation.nom_fr}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">{stat.courseCount} دروس</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-arabic">{stat.moduleCount} مادة</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إحصائيات المواد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moduleStats.map((stat) => (
              <div key={stat.module.id_module} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground font-arabic">
                      {stat.module.designation_ar || stat.module.designation_fr}
                    </h3>
                    <p className="text-sm text-muted-foreground">({stat.module.code_module})</p>
                  </div>
                  <Badge variant="secondary">{stat.courseCount} دروس</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="font-arabic">{stat.instructors} أستاذ</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في الدروس أو أسماء الأساتذة أو المواد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={offreFilter} onValueChange={setOffreFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="تصفية حسب العرض" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع العروض</SelectItem>
                {offreStats.map((stat, index) => (
                  <SelectItem key={index} value={stat.offre.specialite?.designation_ar || stat.offre.specialite?.designation_fr || `عرض ${stat.offre.id_offre}`}>
                    {stat.offre.specialite?.designation_ar || stat.offre.specialite?.designation_fr || `عرض ${stat.offre.id_offre}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[200px]">
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
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">الدروس المتاحة ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2 font-arabic">لا توجد دروس متاحة</h3>
              <p className="text-muted-foreground font-arabic">
                {searchTerm || moduleFilter !== 'all' || offreFilter !== 'all'
                  ? 'لا توجد دروس تطابق معايير البحث'
                  : 'لا توجد دروس معتمدة متاحة في عروضك حالياً'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id_cours} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {course.titre_ar || course.titre_fr || 'بدون عنوان'}
                        </h3>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          معتمد
                        </Badge>
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">كود الدرس:</span> {course.code_cours}
                        </div>
                        {course.module && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span className="font-medium">المادة:</span> 
                            {course.module.designation_ar || course.module.designation_fr} ({course.module.code_module})
                          </div>
                        )}
                        {course.module?.specialite && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-medium">التخصص:</span> 
                            {course.module.specialite.designation_ar || course.module.specialite.designation_fr}
                          </div>
                        )}
                        {course.enseignant && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">الأستاذ:</span> 
                            {course.enseignant.prenom_fr} {course.enseignant.nom_fr}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">تاريخ الاعتماد:</span> 
                          {formatCourseDateSafe(course)}
                        </div>
                      </div>
                      
                      {course.titre_fr && course.titre_ar && (
                        <div className="theme-transition-colors bg-background-secondary p-3 rounded-lg mb-3">
                          <p className="text-sm"><span className="font-medium">العنوان بالفرنسية:</span> {course.titre_fr}</p>
                        </div>
                      )}

                      {course.observation && (
                        <div className="theme-transition-colors bg-background-secondary p-3 rounded-lg mb-3">
                          <p className="text-sm"><span className="font-medium">ملاحظات:</span> {course.observation}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {course.fichierpdf && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewPDF(course)}
                            title="عرض الملف"
                            className="text-primary border-blue-200 hover:bg-background-secondary"
                          >
                            <Eye className="w-4 h-4" />
                            عرض
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadPDF(course)}
                            title="تحميل الملف"
                            className="text-success border-green-200 hover:bg-green-50"
                          >
                            <Download className="w-4 h-4" />
                            تحميل
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      {selectedCourse && (
        <CourseMemoirePDFViewer
          isOpen={isPdfViewerOpen}
          onClose={handleClosePDF}
          item={selectedCourse}
          type="cours"
          userRole="Stagiaire"
        />
      )}
    </div>
  );
};

export default StagiaireRelatedCourses;