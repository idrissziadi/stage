import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
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
  observation?: string;
  module?: {
    designation_fr: string;
    designation_ar: string;
    code_module: string;
  };
}

const CoursManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    code_cours: '',
    titre_fr: '',
    titre_ar: '',
    id_module: '',
    file: null as File | null
  });

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesResponse = await apiService.getCoursByEnseignant(userProfile.id_enseignant);
      setCourses(coursesResponse.data || []);
      
      // Fetch modules
      const modulesResponse = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      setModules(modulesResponse.data || []);
      
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

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.code_cours || !uploadForm.id_module) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('code_cours', uploadForm.code_cours);
      formData.append('titre_fr', uploadForm.titre_fr);
      formData.append('titre_ar', uploadForm.titre_ar);
      formData.append('id_module', uploadForm.id_module);
      formData.append('id_enseignant', userProfile.id_enseignant.toString());
      formData.append('file', uploadForm.file);

      const response = await apiService.createCoursWithFile(formData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'نجح',
        description: 'تم رفع الدرس بنجاح',
      });

      // Reset form and close dialog
      setUploadForm({
        code_cours: '',
        titre_fr: '',
        titre_ar: '',
        id_module: '',
        file: null
      });
      setIsUploadOpen(false);
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في رفع الدرس',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مقبول':
        return <CheckCircle className="w-4 h-4" />;
      case 'في_الانتظار':
        return <Clock className="w-4 h-4" />;
      case 'مرفوض':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'مقبول': 'معتمد',
      'في_الانتظار': 'في الانتظار',
      'مرفوض': 'مرفوض'
    };
    return statusMap[status] || status;
  };

  const getStatsData = () => {
    return {
      total: courses.length,
      approved: courses.filter(c => c.status === 'مقبول').length,
      pending: courses.filter(c => c.status === 'في_الانتظار').length,
      rejected: courses.filter(c => c.status === 'مرفوض').length
    };
  };

  const handleViewPDF = (course: Course) => {
    if (course.fichierpdf) {
      // Debug: Log the file path and constructed URL
      console.log('View PDF - File path from database:', course.fichierpdf);
      const pdfUrl = getFileUrl(course.fichierpdf, 'cours');
      console.log('View PDF - Constructed URL:', pdfUrl);
      
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذا الدرس',
        variant: 'destructive'
      });
    }
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
      // Debug: Log the file path and constructed URL
      console.log('File path from database:', course.fichierpdf);
      const pdfUrl = getFileUrl(course.fichierpdf, 'cours');
      console.log('Constructed URL:', pdfUrl);
      
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        console.error('Response status:', response.status, response.statusText);
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

  const stats = getStatsData();

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code_cours?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل الدروس...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الدروس</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معتمد</p>
                <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مرفوض</p>
                <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الدروس..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 min-w-[200px]"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="في_الانتظار">في الانتظار</SelectItem>
                  <SelectItem value="مقبول">معتمد</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  رفع درس جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>رفع درس جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code_cours">كود الدرس *</Label>
                      <Input
                        id="code_cours"
                        value={uploadForm.code_cours}
                        onChange={(e) => setUploadForm({...uploadForm, code_cours: e.target.value})}
                        placeholder="أدخل كود الدرس"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module">المادة *</Label>
                      <Select value={uploadForm.id_module} onValueChange={(value) => setUploadForm({...uploadForm, id_module: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المادة" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map(module => (
                            <SelectItem key={module.id_module} value={module.id_module.toString()}>
                              {module.designation_ar || module.designation_fr} ({module.code_module})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="titre_ar">العنوان بالعربية</Label>
                    <Input
                      id="titre_ar"
                      value={uploadForm.titre_ar}
                      onChange={(e) => setUploadForm({...uploadForm, titre_ar: e.target.value})}
                      placeholder="أدخل عنوان الدرس بالعربية"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="titre_fr">العنوان بالفرنسية</Label>
                    <Input
                      id="titre_fr"
                      value={uploadForm.titre_fr}
                      onChange={(e) => setUploadForm({...uploadForm, titre_fr: e.target.value})}
                      placeholder="Entrez le titre du cours en français"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="file">ملف PDF *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 10 ميجابايت</p>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                      {uploading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'جارٍ الرفع...' : 'رفع الدرس'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>دروسي ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دروس</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'لا توجد دروس تطابق معايير البحث'
                  : 'لم تقم برفع أي دروس بعد'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  رفع درس جديد
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id_cours} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {course.titre_ar || course.titre_fr || 'بدون عنوان'}
                        </h3>
                        <Badge className={getStatusColor(course.status)}>
                          {getStatusIcon(course.status)}
                          <span className="mr-1">{getStatusText(course.status)}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">كود الدرس:</span> {course.code_cours}</p>
                        {course.module && (
                          <p><span className="font-medium">المادة:</span> {course.module.designation_ar || course.module.designation_fr}</p>
                        )}
                        <p><span className="font-medium">تاريخ الرفع:</span> {new Date(course.created_at).toLocaleDateString('ar-DZ')}</p>
                        {course.titre_fr && course.titre_ar && (
                          <p><span className="font-medium">بالفرنسية:</span> {course.titre_fr}</p>
                        )}
                      </div>
                      
                      {course.observation && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm font-medium text-yellow-800 mb-1">ملاحظات:</p>
                          <p className="text-sm text-yellow-700">{course.observation}</p>
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
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadPDF(course)}
                            title="تحميل الملف"
                          >
                            <Download className="w-4 h-4" />
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
    </div>
  );
};

export default CoursManagement;