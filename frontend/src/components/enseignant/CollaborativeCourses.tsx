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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import CourseMemoirePDFViewer from '@/components/ui/course-memoire-pdf-viewer';
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
  GraduationCap
} from 'lucide-react';

interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
}

interface Course {
  id_cours: number;
  id_module: number;
  code_cours: string;
  titre_fr: string;
  titre_ar: string;
  status: string;
  created_at: string;
  updatedAt?: string;
  fichierpdf?: string;
  observation?: string;
  module?: {
    designation_fr: string;
    designation_ar: string;
    code_module: string;
  };
  enseignant?: {
    nom_fr: string;
    prenom_fr: string;
  };
}

const CollaborativeCourses = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch approved courses for modules taught by this instructor
      const coursesResponse = await apiService.getCoursApprouvesByEnseignant(userProfile.id_enseignant.toString());
      setCourses(coursesResponse.data || []);
      
      // Fetch modules taught by this instructor
      const modulesResponse = await apiService.getModulesByEnseignant(userProfile.id_enseignant.toString());
      console.log('🔍 Modules Response:', modulesResponse);
      
      // Ensure modules is always an array with proper error handling
      let modulesData = [];
      if (modulesResponse && modulesResponse.data) {
        if (Array.isArray(modulesResponse.data)) {
          modulesData = modulesResponse.data;
        } else if (typeof modulesResponse.data === 'object') {
          // Handle nested data structure if it exists
          if (modulesResponse.data.modules && Array.isArray(modulesResponse.data.modules)) {
            modulesData = modulesResponse.data.modules;
          } else if (modulesResponse.data.data && Array.isArray(modulesResponse.data.data)) {
            modulesData = modulesResponse.data.data;
          }
        }
      }
      
      console.log('🎯 Final modules array:', modulesData);
      setModules(modulesData);
      
    } catch (error) {
      console.error('Error fetching collaborative courses:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الدروس التعاونية',
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

  // Helper function to generate user initials for avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'AS';
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || 'AS';
  };

  // Helper function to get time ago - using utility function
  const getTimeAgoSafe = (dateString: string) => {
    return formatRelativeDateToArabic(dateString);
  };

  // Helper function to safely format approval date - using utility function
  const formatApprovalDateSafe = (course: Course) => {
    // Use formatCourseDateToArabic to match memoires format
    const result = formatCourseDateToArabic(course);
    console.log('formatCourseDateToArabic result:', {
      courseId: course.id_cours,
      updatedAt: course.updatedAt,
      created_at: course.created_at,
      result: result
    });
    return result;
  };

  const getModuleStats = () => {
    // Safety check: ensure modules is an array
    if (!Array.isArray(modules) || modules.length === 0) {
      return [];
    }
    
    const stats = modules.map(module => {
      const moduleCourses = courses.filter(course => course.id_module === module.id_module);
      return {
        module,
        courseCount: moduleCourses.length,
        instructors: [...new Set(moduleCourses.map(course => `${course.enseignant?.prenom_fr} ${course.enseignant?.nom_fr}`))].length
      };
    });
    return stats;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code_cours?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.enseignant?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.enseignant?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Fix the module filter to work properly and handle undefined id_module
    const matchesModule = moduleFilter === 'all' || 
                         (course.id_module && course.id_module.toString() === moduleFilter);
    
    return matchesSearch && matchesModule;
  });

  const moduleStats = getModuleStats();

  // Debug information for troubleshooting
  console.log('🔍 CollaborativeCourses Debug Info:', {
    totalCourses: courses.length,
    totalModules: Array.isArray(modules) ? modules.length : 'Not an array',
    modulesType: typeof modules,
    moduleFilter,
    filteredCoursesCount: filteredCourses.length,
    searchTerm
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground dark:text-muted-foreground">جارٍ تحميل الدروس التعاونية...</p>
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
              <Users className="w-6 h-6 text-primary dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground dark:text-white font-arabic">الدروس التعاونية</h2>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                استعرض الدروس المعتمدة من الأساتذة الآخرين في المواد التي تدرسها
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-arabic">المواد المشتركة</p>
                <p className="text-2xl font-bold text-blue-700">{Array.isArray(modules) ? modules.length : 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-arabic">الدروس المتاحة</p>
                <p className="text-2xl font-bold text-green-700">{courses.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground font-arabic">الأساتذة المشاركون</p>
                <p className="text-2xl font-bold text-purple-700">
                  {[...new Set(courses.map(course => `${course.enseignant?.prenom_fr} ${course.enseignant?.nom_fr}`))].length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إحصائيات المواد</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(modules) && modules.length > 0 ? (
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
                    <span className="font-arabic">{stat.instructors} أستاذ مشارك</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2 font-arabic">لا توجد مواد متاحة</h3>
              <p className="text-muted-foreground font-arabic">
                لم يتم تعيين أي مواد لك حالياً. يرجى التواصل مع إدارة المؤسسة.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modern Search Bar */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ابحث في الدروس التعاونية... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 pl-4 py-3 bg-card dark:bg-gray-700 border-2 border-border dark:border-gray-600 rounded-xl text-right font-arabic focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
                dir="rtl"
              />
            </div>
            
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[200px] bg-card dark:bg-gray-700 border-2 border-border dark:border-gray-600 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="تصفية حسب المادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواد</SelectItem>
                {Array.isArray(modules) && modules.length > 0 ? (
                  modules.map(module => (
                    <SelectItem key={module.id_module} value={module.id_module.toString()}>
                      {module.designation_ar || module.designation_fr} ({module.code_module})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-modules" disabled>
                    لا توجد مواد متاحة
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="font-arabic">
                {Array.isArray(modules) && modules.length > 0 
                  ? 'البحث في العناوين، المواد، والأساتذة'
                  : 'لا يمكن تصفية النتائج - لا توجد مواد متاحة'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Style Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground dark:text-white font-arabic">
            الدروس التعاونية ({filteredCourses.length})
          </h2>
        </div>
        
        {filteredCourses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2 font-arabic">لا توجد دروس متاحة</h3>
              <p className="text-muted-foreground font-arabic">
                {searchTerm || moduleFilter !== 'all' 
                  ? 'لا توجد دروس تطابق معايير البحث'
                  : Array.isArray(modules) && modules.length === 0
                    ? 'لا توجد دروس متاحة - لم يتم تعيين أي مواد لك حالياً'
                    : 'لا توجد دروس معتمدة متاحة في المواد التي تدرسها حالياً'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map((course) => (
              <Card key={course.id_cours} className="bg-card dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-border dark:border-gray-700">
                <CardContent className="p-0">
                  {/* Post Header - Facebook Style */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* User Avatar */}
                        <Avatar className="w-12 h-12 border-2 border-gradient-to-r from-green-400 to-blue-500">
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold text-sm">
                            {getUserInitials(course.enseignant?.prenom_fr, course.enseignant?.nom_fr)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground dark:text-white text-base">
                              {course.enseignant?.prenom_fr} {course.enseignant?.nom_fr}
                            </h3>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              زميل
                            </Badge>
                          </div>
                                                     <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                             <Clock className="w-4 h-4" />
                             <span className="font-arabic">{getTimeAgoSafe(course.updatedAt || course.created_at)}</span>
                             <span className="mx-1">•</span>
                             <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                               <CheckCircle className="w-3 h-3 mr-1" />
                               معتمد
                             </Badge>
                           </div>
                        </div>
                      </div>
                      
                      {/* Post Options */}
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-muted-foreground">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-4">
                    {/* Course Title */}
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-foreground dark:text-white mb-2 font-arabic leading-relaxed">
                        {course.titre_ar || course.titre_fr || 'بدون عنوان'}
                      </h2>
                      
                      {/* French Title if different */}
                      {course.titre_fr && course.titre_ar && course.titre_fr !== course.titre_ar && (
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground italic">
                          {course.titre_fr}
                        </p>
                      )}
                    </div>
                    
                    {/* Course Description/Observation */}
                    {course.observation && (
                      <div className="theme-transition-colors mb-4 p-3 bg-background-secondary dark:bg-gray-700 rounded-lg border-l-4 border-green-400">
                        <p className="text-sm text-foreground dark:text-gray-300 font-arabic leading-relaxed">
                          {course.observation}
                        </p>
                      </div>
                    )}
                    
                    {/* Course Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                          <FileText className="w-4 h-4 text-primary dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground dark:text-muted-foreground font-arabic">كود الدرس:</span>
                          <p className="text-foreground dark:text-white font-medium">
                            {course.code_cours}
                          </p>
                        </div>
                      </div>
                      
                      {course.module && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-purple-100 dark:bg-purple-800 rounded-full">
                            <BookOpen className="w-4 h-4 text-secondary dark:text-purple-400" />
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground dark:text-muted-foreground font-arabic">المادة:</span>
                            <p className="text-foreground dark:text-white font-medium font-arabic">
                              {course.module.designation_ar || course.module.designation_fr} ({course.module.code_module})
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 bg-green-100 dark:bg-green-800 rounded-full">
                          <Calendar className="w-4 h-4 text-success dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground dark:text-muted-foreground font-arabic">تاريخ الاعتماد:</span>
                          <p className="text-foreground dark:text-white font-medium font-arabic">
                            {formatApprovalDateSafe(course)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Actions - Facebook Style */}
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between p-2">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        {course.fichierpdf && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPDF(course)}
                              className="flex items-center gap-2 text-primary hover:bg-background-secondary dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="font-arabic text-sm">عرض</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadPDF(course)}
                              className="flex items-center gap-2 text-success hover:bg-green-50 dark:hover:bg-green-900/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span className="font-arabic text-sm">تحميل</span>
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center gap-2 text-secondary hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="font-arabic text-sm">مشاركة</span>
                        </Button>
                      </div>
                      
                      {/* Reading Status */}
                      <div className="theme-transition-colors flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground bg-background-secondary dark:bg-gray-700 px-3 py-1 rounded-full">
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
            <GraduationCap className="w-5 h-5 text-success mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1 font-arabic">ملاحظة تعليمية</h4>
              <p className="text-sm text-green-800 font-arabic">
                {Array.isArray(modules) && modules.length > 0 
                  ? 'هذه الدروس متاحة للاطلاع والاستفادة من زملائك الأساتذة في المواد التي تدرسها. يمكنك الاستفادة منها لتطوير محتوى دروسك أو للحصول على أفكار جديدة في التدريس.'
                  : 'لا يمكن عرض الدروس التعاونية حالياً لأنك لم يتم تعيين أي مواد لك. يرجى التواصل مع إدارة المؤسسة لتعيين المواد التي ستدرسها.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      {selectedCourse && (
        <CourseMemoirePDFViewer
          isOpen={isPdfViewerOpen}
          onClose={handleClosePDF}
          item={selectedCourse}
          type="cours"
          userRole="Enseignant"
        />
      )}
    </div>
  );
};

export default CollaborativeCourses;