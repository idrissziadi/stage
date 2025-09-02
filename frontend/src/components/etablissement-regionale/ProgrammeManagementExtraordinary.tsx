import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Plus,
  Edit,
  Trash2,
  Eye, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Calendar,
  Hash,
  Target,
  Building,
  Save,
  X,
  FileText,
  Award,
  TrendingUp,
  Users,
  Lightbulb,
  Zap,
  Star,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Download,
  Upload,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';
// Removed imports for deleted components
import PDFViewer from '@/components/ui/pdf-viewer';
import { Module } from '@/types';
import ProgrammeCreationForm from './ProgrammeCreationForm';

interface Programme {
  id_programme: number;
  code_programme: string;
  titre_fr: string;
  titre_ar: string;
  fichierpdf?: string;
  status: string;
  observation?: string;
  id_etab_regionale: number;
  id_module: number;
  module?: {
    id_module: number;
    designation_fr: string;
    designation_ar: string;
    code_module: string;
  };
  etablissementRegionale?: {
    nom_fr: string;
    nom_ar: string;
  };
}

const ProgrammeManagementExtraordinary = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfProgramme, setPdfProgramme] = useState<Programme | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    limit: 12,
    offset: 0
  });

  const { request } = useAuthApi();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'list') {
      fetchProgrammes();
      fetchModules();
    }
  }, [filters, activeTab]);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const response = await request('/api/etablissement-regionale/programmes', {
        method: 'GET',
        params: filters
      });
      setProgrammes(response?.programmes || []);
      setTotal(response?.total || 0);
    } catch (error: any) {
      console.error('Error fetching programmes:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البرامج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await request('/api/etablissement-regionale/modules');
      setModules(response || []);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleDeleteProgramme = async (programmeId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا البرنامج؟')) return;

    try {
      await request(`/api/etablissement-regionale/programmes/${programmeId}`, {
        method: 'DELETE'
      });
      
      toast({
        title: "نجح",
        description: "تم حذف البرنامج بنجاح",
        variant: "default"
      });
      
      fetchProgrammes();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل في حذف البرنامج",
        variant: "destructive"
      });
    }
  };

  const handleOpenPDF = (programme: Programme) => {
    setPdfProgramme(programme);
    setIsPdfViewerOpen(true);
  };

  const handleClosePDF = () => {
    setIsPdfViewerOpen(false);
    setPdfProgramme(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'في_الانتظار':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3" />
            في الانتظار
          </Badge>
        );
      case 'مقبول':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3" />
            مقبول
          </Badge>
        );
      case 'مرفوض':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300">
            <XCircle className="w-3 h-3" />
            مرفوض
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'في_الانتظار': return 50;
      case 'مقبول': return 100;
      case 'مرفوض': return 25;
      default: return 0;
    }
  };

  const handlePageChange = (newOffset: number) => {
    setFilters(prev => ({ ...prev, offset: newOffset }));
  };

  const getStats = () => {
    const total = programmes.length;
    const pending = programmes.filter(p => p.status === 'في_الانتظار').length;
    const approved = programmes.filter(p => p.status === 'مقبول').length;
    const rejected = programmes.filter(p => p.status === 'مرفوض').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  const onProgrammeCreated = () => {
    setActiveTab('list');
    fetchProgrammes();
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Extraordinary Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">إدارة البرامج</h1>
                  <p className="text-blue-100 text-lg">منصة شاملة لإنشاء وإدارة البرامج التعليمية</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-blue-100 text-sm">إجمالي البرامج</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">{stats.approved}</div>
                <div className="text-blue-100 text-sm">مقبولة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extraordinary Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1 h-14">
          <TabsTrigger 
            value="create" 
            className="rounded-xl text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            إنشاء برنامج جديد
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="rounded-xl text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <Layers className="w-5 h-5 mr-2" />
            قائمة البرامج
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <ProgrammeCreationForm />
        </TabsContent>

        <TabsContent value="list" className="mt-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">إجمالي البرامج</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                    <p className="text-xs text-blue-500 mt-1">+12% من الشهر الماضي</p>
                  </div>
                  <div className="p-3 bg-blue-200/50 rounded-2xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">في الانتظار</p>
                    <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
                    <p className="text-xs text-yellow-500 mt-1">قيد المراجعة</p>
                  </div>
                  <div className="p-3 bg-yellow-200/50 rounded-2xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">مقبولة</p>
                    <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
                    <p className="text-xs text-green-500 mt-1">نشطة ومعتمدة</p>
                  </div>
                  <div className="p-3 bg-green-200/50 rounded-2xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">مرفوضة</p>
                    <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
                    <p className="text-xs text-red-500 mt-1">تحتاج مراجعة</p>
                  </div>
                  <div className="p-3 bg-red-200/50 rounded-2xl">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="البحث في البرامج..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, offset: 0 }))}
                      className="pr-12 h-12 text-lg border-0 bg-gray-100 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, offset: 0 }))}>
                  <SelectTrigger className="w-64 h-12 border-0 bg-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="في_الانتظار">في الانتظار</SelectItem>
                    <SelectItem value="مقبول">مقبول</SelectItem>
                    <SelectItem value="مرفوض">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Programmes Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">جارٍ تحميل البرامج...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programmes.map((programme) => (
                <Card key={programme.id_programme} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {programme.code_programme}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {programme.titre_ar || programme.titre_fr}
                          </h3>
                        </div>
                        {getStatusBadge(programme.status)}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>حالة البرنامج</span>
                          <span>{getStatusProgress(programme.status)}%</span>
                        </div>
                        <Progress 
                          value={getStatusProgress(programme.status)} 
                          className="h-2 bg-gray-200"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Hash className="w-4 h-4 text-blue-500" />
                          <span>{programme.module?.designation_ar || 'غير محدد'}</span>
                        </div>
                        
                        {programme.etablissementRegionale && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building className="w-4 h-4 text-green-500" />
                            <span>{programme.etablissementRegionale.nom_ar}</span>
                          </div>
                        )}

                        {programme.fichierpdf && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="w-4 h-4 text-purple-500" />
                            <span className="text-xs">ملف PDF مرفق</span>
                          </div>
                        )}
                      </div>

                      {/* Observation */}
                      {programme.observation && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-amber-800 mb-1">ملاحظة:</p>
                              <p className="text-xs text-amber-700">{programme.observation}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProgramme(programme);
                            setIsViewDialogOpen(true);
                          }}
                          className="flex-1 group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          عرض
                        </Button>
                        {programme.fichierpdf && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPDF(programme)}
                            className="text-purple-600 hover:text-purple-700 hover:border-purple-300"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProgramme(programme.id_programme)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > filters.limit && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                disabled={filters.offset === 0}
                onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                className="bg-white shadow-md hover:shadow-lg"
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                السابق
              </Button>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {filters.offset + 1} - {Math.min(filters.offset + filters.limit, total)} من {total}
                </span>
              </div>
              <Button
                variant="outline"
                disabled={filters.offset + filters.limit >= total}
                onClick={() => handlePageChange(filters.offset + filters.limit)}
                className="bg-white shadow-md hover:shadow-lg"
              >
                التالي
                <ChevronLeft className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {programmes.length === 0 && !loading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">لا توجد برامج</h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {filters.search || filters.status !== 'all' 
                      ? 'لا توجد برامج تطابق معايير البحث.'
                      : 'ابدأ بإنشاء برنامج تعليمي جديد.'
                    }
                  </p>
                  {(!filters.search && filters.status === 'all') && (
                    <Button 
                      onClick={() => setActiveTab('create')} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      إنشاء أول برنامج
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* View Programme Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              تفاصيل البرنامج
            </DialogTitle>
            <DialogDescription>
              عرض معلومات مفصلة عن البرنامج التدريبي
            </DialogDescription>
          </DialogHeader>
          {selectedProgramme && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      معلومات أساسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">رمز البرنامج</Label>
                      <p className="text-lg font-semibold">{selectedProgramme.code_programme}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">العنوان (عربية)</Label>
                      <p className="text-lg">{selectedProgramme.titre_ar}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">العنوان (فرنسية)</Label>
                      <p className="text-lg">{selectedProgramme.titre_fr}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">الحالة</Label>
                      <div className="mt-1">{getStatusBadge(selectedProgramme.status)}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                                          <CardTitle className="text-lg flex items-center">
                        <Hash className="w-5 h-5 mr-2 text-green-600" />
                        معلومات المادة
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                                          <div>
                        <Label className="text-sm font-medium text-gray-500">اسم المادة</Label>
                        <p className="text-lg">{selectedProgramme.module?.designation_ar}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">رمز المادة</Label>
                        <p className="text-lg font-mono">{selectedProgramme.module?.code_module}</p>
                      </div>
                    {selectedProgramme.fichierpdf && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">ملف PDF</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{selectedProgramme.fichierpdf}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {selectedProgramme.observation && (
                <Card className="border-0 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                      ملاحظات المؤسسة الوطنية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">{selectedProgramme.observation}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      {pdfProgramme && (
        <PDFViewer
          isOpen={isPdfViewerOpen}
          onClose={handleClosePDF}
          programme={pdfProgramme}
          userRole="EtablissementRegionale"
        />
      )}
    </div>
  );
};

export default ProgrammeManagementExtraordinary;
