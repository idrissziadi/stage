import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Eye 
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
  fichierpdf?: string;
}

const ModuleOverview = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch modules
      const modulesResponse = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      const modulesList = modulesResponse.data || [];
      setModules(modulesList);
      
      // Fetch courses
      const coursesResponse = await apiService.getCoursByEnseignant(userProfile.id_enseignant);
      const coursesList = coursesResponse.data || [];
      setCourses(coursesList);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل البيانات',
        variant: 'destructive'
      });
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

  const handleViewPDF = (course: Course) => {
    if (course.fichierpdf) {
      // Open PDF in new tab for viewing
      const pdfUrl = getFileUrl(course.fichierpdf, 'cours');
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذا الدرس',
        variant: 'destructive'
      });
    }
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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
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
        
        <Card className="border-l-4 border-l-green-500">
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
        
        <Card className="border-l-4 border-l-yellow-500">
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Modules List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              المواد التي تدرسها
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {modules.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">لا توجد مواد مُعيّّه</p>
              </div>
            ) : (
              <div className="space-y-2">
                {modules.map((module) => {
                  const moduleCourses = getModuleCourses(module.id_module);
                  return (
                    <div
                      key={module.id_module}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedModule?.id_module === module.id_module
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedModule(module)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {module.designation_ar || module.designation_fr}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {module.code_module}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {moduleCourses.length} درس
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            moduleCourses.filter(c => c.status === 'مقبول').length > 0 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {moduleCourses.filter(c => c.status === 'مقبول').length} معتمد
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              {selectedModule ? (
                <span>مادة: {selectedModule.designation_ar || selectedModule.designation_fr}</span>
              ) : (
                <span>تفاصيل المادة</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {!selectedModule ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">اختر مادةً لعرض تفاصيلها</p>
              </div>
            ) : (
              <div className="space-y-4">
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
                  {getModuleCourses(selectedModule.id_module).length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">لا توجد دروس مرفوعة لهذه المادة</p>
                      <Button className="mt-4" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        رفع درس جديد
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getModuleCourses(selectedModule.id_module).map((course) => (
                        <div key={course.id_cours} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {course.titre_ar || course.titre_fr}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {course.code_cours} • {new Date(course.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(course.status)}>
                              {getStatusText(course.status)}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewPDF(course)}
                              title="عرض الدرس"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleOverview;