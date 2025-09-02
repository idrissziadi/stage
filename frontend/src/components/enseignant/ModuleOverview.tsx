import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { formatDate } from '@/utils/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Eye,
  Download,
  ExternalLink,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { Module } from '@/types';

interface Course {
  id_cours: number;
  id_module: number;
  code_cours: string;
  titre_fr: string;
  titre_ar: string;
  status: string;
  created_at?: string; // Format legacy
  createdAt?: string; // Format Sequelize
  fichierpdf?: string;
  observation?: string;
}

interface ModuleOverviewProps {
  onTabChange?: (tab: string) => void;
}

const ModuleOverview = ({ onTabChange }: ModuleOverviewProps) => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 fetchData - Starting to fetch modules for enseignant ID:', userProfile.id_enseignant);
      
      // Fetch modules
      const modulesResponse = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      
      console.log('📡 API Response for modules:', modulesResponse);
      console.log('📡 Response type:', typeof modulesResponse);
      console.log('📡 Response keys:', Object.keys(modulesResponse || {}));
      console.log('📡 Full response structure:', JSON.stringify(modulesResponse, null, 2));
      
      // Ensure modules is always an array with safety checks
      let modulesList = [];
      
      // Handle nested data structure: data.data
      if (modulesResponse && modulesResponse.data) {
        if (modulesResponse.data.data && Array.isArray(modulesResponse.data.data)) {
          // Handle nested structure: data.data
          modulesList = modulesResponse.data.data;
          console.log('✅ Using modulesResponse.data.data (nested array):', modulesList);
        } else if (Array.isArray(modulesResponse.data)) {
          // Handle direct data array
          modulesList = modulesResponse.data;
          console.log('✅ Using modulesResponse.data (array):', modulesList);
        } else if (typeof modulesResponse.data === 'object') {
          // If data is an object, try to convert it to array
          if (Array.isArray(Object.values(modulesResponse.data))) {
            modulesList = Object.values(modulesResponse.data);
            console.log('✅ Converted object values to array:', modulesList);
          } else {
            console.warn('⚠️ Data is an object but not convertible to array:', modulesResponse.data);
            modulesList = [];
          }
        } else {
          console.warn('⚠️ Data exists but is not array or object:', typeof modulesResponse.data);
          modulesList = [];
        }
      } else if (Array.isArray(modulesResponse)) {
        // Fallback: if response is directly an array
        modulesList = modulesResponse;
        console.log('✅ Using direct response (array):', modulesList);
      } else {
        console.warn('❌ Unexpected modules response format:', modulesResponse);
        modulesList = [];
      }
      
      console.log('🎯 Final modulesList to set:', modulesList);
      console.log('🎯 modulesList length:', modulesList.length);
      setModules(modulesList);
      
      // Fetch courses
      const coursesResponse = await apiService.getCoursByEnseignant(userProfile.id_enseignant);
      console.log('📡 API Response for courses:', coursesResponse);
      console.log('📡 Full courses response structure:', JSON.stringify(coursesResponse, null, 2));
      
      // Handle nested data structure for courses as well
      let coursesList = [];
      if (coursesResponse && coursesResponse.data) {
        if (coursesResponse.data.data && Array.isArray(coursesResponse.data.data)) {
          // Handle nested structure: data.data
          coursesList = coursesResponse.data.data;
          console.log('✅ Using coursesResponse.data.data (nested array):', coursesList);
        } else if (Array.isArray(coursesResponse.data)) {
          // Handle direct data array
          coursesList = coursesResponse.data;
          console.log('✅ Using coursesResponse.data (array):', coursesList);
        } else {
          coursesList = [];
          console.log('⚠️ Courses data is not an array:', coursesResponse.data);
        }
      } else {
        coursesList = [];
        console.log('⚠️ No courses data in response');
      }
      
      console.log('🎯 Final coursesList to set:', coursesList);
      console.log('🎯 coursesList length:', coursesList.length);
      setCourses(coursesList);
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل البيانات',
        variant: 'destructive'
      });
      // Set empty arrays on error to prevent crashes
      setModules([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getModuleCourses = (moduleId: number) => {
    return courses.filter(course => course.id_module === moduleId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'في_الانتظار':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'مرفوض':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseDialogOpen(true);
    setPdfUrl(null); // Reset PDF preview when opening dialog
  };

  const handleViewPDF = (course: Course) => {
    if (!course.fichierpdf) {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذا الدرس',
        variant: 'destructive'
      });
      return;
    }

    const url = getFileUrl(course.fichierpdf, 'cours');
    setPdfUrl(url);
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
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.titre_ar || course.titre_fr || 'course'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'نجح التحميل',
        description: 'تم تحميل الملف بنجاح',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الملف',
        variant: 'destructive'
      });
    }
  };

  const handleOpenInNewTab = (course: Course) => {
    if (!course.fichierpdf) {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذا الدرس',
        variant: 'destructive'
      });
      return;
    }

    const pdfUrl = getFileUrl(course.fichierpdf, 'cours');
    window.open(pdfUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل المواد...</p>
      </div>
    );
  }

  return (
    <div key="module-overview-container" className="space-y-6">
      {/* Statistics Cards */}
      <div key="statistics-grid" className="grid gap-4 md:grid-cols-3">
        <Card key="total-modules-card" className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي المواد</p>
                <p className="text-2xl font-bold text-blue-700">{modules.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card key="approved-courses-card" className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">الدروس المعتمدة</p>
                <p className="text-2xl font-bold text-green-700">
                  {courses.filter(c => c.status === 'مقبول').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card key="pending-courses-card" className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {courses.filter(c => c.status === 'في_الانتظار').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div key="main-content-grid" className="grid gap-6 lg:grid-cols-3">
        {/* Modules List */}
        <Card key="modules-list-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              المواد التي تدرسها
            </CardTitle>
          </CardHeader>
          <CardContent key="modules-content" className="p-4">
            {(() => {
              if (modules.length === 0) {
                return (
                  <div key="no-modules" className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">لا توجد مواد مُعيّّه</p>
                                         <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                       <p>Debug Info:</p>
                       <p>userProfile.id_enseignant: {userProfile?.id_enseignant || 'undefined'}</p>
                       <p>modules array length: {modules.length}</p>
                       <p>courses array length: {courses.length}</p>
                       <p>loading state: {loading ? 'true' : 'false'}</p>
                       {modules.length > 0 && (
                         <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border">
                           <p className="font-medium">First Module:</p>
                           <p>ID: {modules[0].id_module}</p>
                           <p>Code: {modules[0].code_module}</p>
                           <p>Name: {modules[0].designation_ar || modules[0].designation_fr}</p>
                         </div>
                       )}
                       {courses.length > 0 && (
                         <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border">
                           <p className="font-medium">First Course:</p>
                           <p>ID: {courses[0].id_cours}</p>
                           <p>Module ID: {courses[0].id_module}</p>
                           <p>Title: {courses[0].titre_ar || courses[0].titre_fr}</p>
                         </div>
                       )}
                     </div>
                  </div>
                );
              }
              
              return (
                <div key="modules-list" className="space-y-2">
                  {modules.map((module) => {
                    const moduleCourses = getModuleCourses(module.id_module);
                    return (
                                             <div
                         key={module.id_module}
                         className={`group relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                           selectedModule?.id_module === module.id_module
                             ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600 shadow-md'
                             : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md'
                         }`}
                         onClick={() => setSelectedModule(module)}
                       >
                         <div className="flex items-start gap-3">
                           <div className="flex-shrink-0">
                             <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                               selectedModule?.id_module === module.id_module
                                 ? 'bg-blue-100 dark:bg-blue-800'
                                 : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-800'
                             }`}>
                               <BookOpen className={`w-6 h-6 ${
                                 selectedModule?.id_module === module.id_module
                                   ? 'text-blue-600 dark:text-blue-400'
                                   : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                               }`} />
                             </div>
                           </div>
                           
                           <div className="flex-1 min-w-0">
                             <h3 className={`font-semibold text-lg mb-1 ${
                               selectedModule?.id_module === module.id_module
                                 ? 'text-blue-900 dark:text-blue-100'
                                 : 'text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-100'
                             }`}>
                               {module.designation_ar || module.designation_fr}
                             </h3>
                             <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                               {module.code_module}
                             </p>
                             
                             <div className="flex items-center gap-2">
                               <Badge 
                                 variant="secondary" 
                                 className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                               >
                                 {moduleCourses.length} درس
                               </Badge>
                               {moduleCourses.length > 0 ? (
                                 <Badge 
                                   variant="secondary" 
                                   className={`text-xs px-2 py-1 ${
                                     moduleCourses.filter(c => c.status === 'مقبول').length > 0 
                                       ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                       : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                   }`}
                                 >
                                   {moduleCourses.filter(c => c.status === 'مقبول').length} معتمد
                                 </Badge>
                               ) : (
                                 <Badge 
                                   variant="secondary" 
                                   className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                 >
                                   لا توجد دروس
                                 </Badge>
                               )}
                             </div>
                           </div>
                         </div>
                         
                         {/* Selection indicator */}
                         {selectedModule?.id_module === module.id_module && (
                           <div className="absolute top-2 right-2">
                             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                           </div>
                         )}
                       </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Module Details */}
        <Card key="module-details-card" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              {(() => {
                if (selectedModule) {
                  return <span key="selected-module-title">مادة: {selectedModule.designation_ar || selectedModule.designation_fr}</span>;
                }
                return <span key="default-title">تفاصيل المادة</span>;
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent key="module-details-content" className="p-4">
            {(() => {
              if (!selectedModule) {
                return (
                  <div key="no-selected-module" className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">اختر مادةً لعرض تفاصيلها</p>
                  </div>
                );
              }
              
              return (
                <div key="module-details" className="space-y-4">
                  {/* Module Info */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedModule.designation_ar || selectedModule.designation_fr}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      كود المادة: {selectedModule.code_module}
                    </p>
                    {selectedModule.designation_fr && selectedModule.designation_ar && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        بالفرنسية: {selectedModule.designation_fr}
                      </p>
                    )}
                  </div>

                  {/* Module Courses */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">الدروس المرتبطة</h4>
                    {(() => {
                      const moduleCourses = getModuleCourses(selectedModule.id_module);
                      if (moduleCourses.length === 0) {
                        return (
                          <div key="no-courses" className="text-center py-8">
                            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600 dark:text-gray-400">لا توجد دروس مرفوعة لهذه المادة</p>
                            <Button className="mt-4" size="sm" onClick={() => onTabChange?.('cours')}>
                              <TrendingUp className="w-4 h-4 mr-2" />
                              رفع درس جديد
                            </Button>
                          </div>
                        );
                      }
                      
                      return (
                        <div key="courses-list" className="space-y-3">
                                                     {moduleCourses.map((course) => (
                             <div key={course.id_cours} className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                               <div className="flex items-start justify-between">
                                 <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-3 mb-2">
                                     <div className="flex-shrink-0">
                                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                         <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                       </div>
                                     </div>
                                     <div className="flex-1 min-w-0">
                                       <h5 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                         {course.titre_ar || course.titre_fr}
                                       </h5>
                                       <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                         <span className="flex items-center gap-1">
                                           <span className="font-medium">الكود:</span>
                                           <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                             {course.code_cours}
                                           </span>
                                         </span>
                                         <span className="flex items-center gap-1">
                                           <span className="font-medium">التاريخ:</span>
                                           <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                             {course.created_at ? formatDate(course.created_at) : 'غير محدد'}
                                           </span>
                                         </span>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-3 ml-4">
                                   <Badge 
                                     className={`px-3 py-1 text-sm font-medium ${getStatusColor(course.status)}`}
                                   >
                                     {getStatusText(course.status)}
                                   </Badge>
                                   
                                                                       <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleViewCourse(course)}
                                      title="عرض الدرس"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      عرض
                                    </Button>
                                 </div>
                               </div>
                               
                               {/* Course actions on hover */}
                               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-50 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
                             </div>
                           ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </CardContent>
                 </Card>
       </div>

               {/* Course Details Dialog */}
        {selectedCourse && (
          <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle className="font-arabic text-right flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  عرض مستند الدرس
                </DialogTitle>
                <DialogDescription>
                  <span className="text-right font-arabic">معلومات الدرس</span>
                </DialogDescription>
              </DialogHeader>

              {/* Course Details */}
              <div className="space-y-3 text-right font-arabic mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">
                    {selectedCourse.titre_ar || selectedCourse.titre_fr || 'بدون عنوان'}
                  </h3>
                  
                  {selectedCourse.titre_fr && selectedCourse.titre_ar && selectedCourse.titre_fr !== selectedCourse.titre_ar && (
                    <p className="text-sm text-gray-600 mb-3 italic">
                      {selectedCourse.titre_fr}
                    </p>
                  )}

                  <div className="grid gap-2 text-sm">
                    {selectedCourse.code_cours && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">الكود:</span> {selectedCourse.code_cours}
                      </div>
                    )}
                    
                    {selectedModule && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-600" />
                        <span className="font-medium">المادة:</span> 
                        {selectedModule.designation_ar || selectedModule.designation_fr} ({selectedModule.code_module})
                      </div>
                    )}
                    
                    {userProfile && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">الأستاذ:</span> 
                        {userProfile.prenom_fr} {userProfile.nom_fr}
                      </div>
                    )}
                    
                    {selectedCourse.created_at && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">تاريخ الإنشاء:</span> 
                        {formatDate(selectedCourse.created_at)}
                      </div>
                    )}
                  </div>

                  {selectedCourse.observation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">ملاحظات:</span> {selectedCourse.observation}
                      </p>
                    </div>
                  )}
                </div>

                {/* PDF Actions */}
                {selectedCourse.fichierpdf ? (
                  <>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        onClick={() => handleViewPDF(selectedCourse)}
                        className="flex items-center gap-2 font-arabic"
                        variant="default"
                      >
                        <Eye className="h-4 w-4" />
                        عرض الملف
                      </Button>
                      
                      <Button
                        onClick={() => handleDownloadPDF(selectedCourse)}
                        className="flex items-center gap-2 font-arabic"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        تحميل PDF
                      </Button>
                      
                      <Button
                        onClick={() => handleOpenInNewTab(selectedCourse)}
                        className="flex items-center gap-2 font-arabic"
                        variant="outline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        فتح في علامة تبويب جديدة
                      </Button>
                    </div>

                    {/* Aperçu PDF intégré */}
                    {pdfUrl && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-arabic">معاينة المستند</span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPdfUrl(null)}
                                className="font-arabic"
                              >
                                إخفاء المعاينة
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-96 bg-gray-100 flex items-center justify-center">
                          <iframe
                            src={`${pdfUrl}?token=${encodeURIComponent(localStorage.getItem('auth_token') || '')}#toolbar=1&navpanes=1&scrollbar=1`}
                            className="w-full h-full border-0"
                            title={`PDF - ${selectedCourse.titre_ar || selectedCourse.titre_fr || 'document'}`}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-arabic">
                      لا يوجد ملف PDF متوفر لهذا الدرس
                    </AlertDescription>
                  </Alert>
                )}

                {/* Close Button */}
                <div className="flex justify-start pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCourseDialogOpen(false)}
                    className="font-arabic"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
     </div>
   );
 };

export default ModuleOverview;