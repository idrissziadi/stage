import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Eye, 
  Download, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Loader2,
  AlertTriangle
} from 'lucide-react';

import { formatDate } from '@/utils/formatDate';

interface Memoire {
  id_memoire: number;
  titre_fr?: string;
  titre_ar?: string;
  fichierpdf?: string;
  status: string;
  observation?: string;
  createdAt: string;
  updatedAt: string;
  stagiaire: {
    nom_fr: string;
    prenom_fr: string;
  };
  module?: {
    designation_fr: string;
    designation_ar?: string;
    code_module: string;
  };
}

const MemoireSupervision = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMemoire, setSelectedMemoire] = useState<Memoire | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isMemoireDialogOpen, setIsMemoireDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    observations: ''
  });

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchMemoires();
    }
  }, [userProfile]);

  const fetchMemoires = async () => {
    try {
      setLoading(true);
      
      // Use the API that returns all memoires for the enseignant
      const response = await apiService.getMemoiresByEnseignant(userProfile.id_enseignant.toString());
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في تحميل المذكرات');
      }

      setMemoires((response.data as Memoire[]) || []);
      
    } catch (error) {
      console.error('Error fetching memoires:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المذكرات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedMemoire || !reviewForm.status) {
      toast({
        title: 'خطأ',
        description: 'يرجى تحديد الحالة',
        variant: 'destructive'
      });
      return;
    }

    // Validate status
    if (!['مقبول', 'مرفوض'].includes(reviewForm.status)) {
      toast({
        title: 'خطأ',
        description: 'الحالة يجب أن تكون "مقبول" أو "مرفوض"',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Use the correct API for enseignant validation
      const response = await apiService.validateMemoireByEnseignant(
        selectedMemoire.id_memoire,
        {
          status: reviewForm.status as 'مقبول' | 'مرفوض',
          observation: reviewForm.observations.trim() || undefined
        }
      );
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في تقييم المذكرة');
      }

      toast({
        title: 'نجح',
        description: `تم ${reviewForm.status === 'مقبول' ? 'قبول' : 'رفض'} المذكرة بنجاح`,
      });

      // Reset form and close dialog
      setReviewForm({ status: '', observations: '' });
      setIsReviewOpen(false);
      setSelectedMemoire(null);
      
      // Refresh data
      fetchMemoires();
      
    } catch (error) {
      console.error('Review error:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تقييم المذكرة',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'مقدم':
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
      case 'مقدم':
        return <Clock className="w-4 h-4" />;
      case 'مرفوض':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'مقبول': 'مقبول',
      'مقدم': 'مقدم',
      'مرفوض': 'مرفوض'
    };
    return statusMap[status] || status;
  };

  const filteredMemoires = memoires.filter(memoire => {
    const titre = memoire.titre_ar || memoire.titre_fr || '';
    const matchesSearch = titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || memoire.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatsData = () => {
    return {
      total: memoires.length,
      approved: memoires.filter(m => m.status === 'مقبول').length,
      pending: memoires.filter(m => m.status === 'مقدم').length,
      rejected: memoires.filter(m => m.status === 'مرفوض').length
    };
  };

  const stats = getStatsData();

  const openReviewDialog = (memoire: Memoire) => {
    setSelectedMemoire(memoire);
    setReviewForm({
      status: memoire.status,
      observations: memoire.observation || ''
    });
    setIsReviewOpen(true);
  };

  const openMemoireDialog = (memoire: Memoire) => {
    setSelectedMemoire(memoire);
    setIsMemoireDialogOpen(true);
    setPdfUrl(null);
  };

  const generatePdfUrl = (fichierpdf: string) => {
    return getFileUrl(fichierpdf, 'memoires');
  };

  const handleViewPDF = () => {
    if (!selectedMemoire?.fichierpdf) {
      toast({
        title: "خطأ",
        description: "ملف PDF غير متوفر لهذه المذكرة",
        variant: "destructive"
      });
      return;
    }
    const url = generatePdfUrl(selectedMemoire.fichierpdf);
    setPdfUrl(url);
  };

  const handleDownloadPDF = async () => {
    if (!selectedMemoire?.fichierpdf) {
      toast({
        title: "خطأ",
        description: "ملف PDF غير متوفر لهذه المذكرة",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = generatePdfUrl(selectedMemoire.fichierpdf);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${selectedMemoire.titre_ar || selectedMemoire.titre_fr || 'memoire'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "نجح",
        description: "تم تحميل المذكرة بنجاح",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المذكرة",
        variant: "destructive"
      });
    }
  };

  const handleOpenInNewTab = () => {
    if (!selectedMemoire?.fichierpdf) {
      toast({
        title: "خطأ",
        description: "ملف PDF غير متوفر لهذه المذكرة",
        variant: "destructive"
      });
      return;
    }
    
    const url = generatePdfUrl(selectedMemoire.fichierpdf);
    const token = localStorage.getItem('auth_token');
    
    if (url && token) {
      const urlWithAuth = `${url}?token=${encodeURIComponent(token)}`;
      window.open(urlWithAuth, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "خطأ",
        description: "تعذر فتح الملف - غير مصرح",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل المذكرات...</p>
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
                <p className="text-sm font-medium text-gray-600">إجمالي المذكرات</p>
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
                <p className="text-sm font-medium text-gray-600">مقبول</p>
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

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في المذكرات أو أسماء الطلاب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مقدم">مقدم</SelectItem>
                <SelectItem value="مقبول">مقبول</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Memoires List */}
      <Card>
        <CardHeader>
          <CardTitle>المذكرات تحت الإشراف ({filteredMemoires.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMemoires.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مذكرات</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'لا توجد مذكرات تطابق معايير البحث'
                  : 'لا توجد مذكرات تحت إشرافك حالياً'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMemoires.map((memoire) => (
                <div key={memoire.id_memoire} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {memoire.titre_ar || memoire.titre_fr || 'بدون عنوان'}
                        </h3>
                        <Badge className={getStatusColor(memoire.status)}>
                          {getStatusIcon(memoire.status)}
                          <span className="mr-1">{getStatusText(memoire.status)}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span><span className="font-medium">الطالب:</span> {memoire.stagiaire.prenom_fr} {memoire.stagiaire.nom_fr}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span><span className="font-medium">تاريخ التقديم:</span> {formatDate(memoire.createdAt)}</span>
                        </div>
                      </div>
                      
                      {memoire.observation && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-800 mb-1">ملاحظات المشرف:</p>
                          <p className="text-sm text-blue-700">{memoire.observation}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {memoire.fichierpdf && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openMemoireDialog(memoire)}
                            title="عرض المذكرة"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setSelectedMemoire(memoire);
                              handleDownloadPDF();
                            }}
                            title="تحميل المذكرة"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => openReviewDialog(memoire)}
                        title="مراجعة وتقييم"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Memoire Details Dialog */}
      <Dialog open={isMemoireDialogOpen} onOpenChange={setIsMemoireDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic text-right flex items-center gap-2">
              <FileText className="h-5 w-5" />
              عرض مستند المذكرة
            </DialogTitle>
            <DialogDescription>
              <span className="text-right font-arabic">معلومات المذكرة</span>
            </DialogDescription>
          </DialogHeader>

          {selectedMemoire && (
            <div className="space-y-3 text-right font-arabic mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">
                  {selectedMemoire.titre_ar || selectedMemoire.titre_fr || 'بدون عنوان'}
                </h3>
                
                {selectedMemoire.titre_fr && selectedMemoire.titre_ar && selectedMemoire.titre_fr !== selectedMemoire.titre_ar && (
                  <p className="text-sm text-gray-600 mb-3 italic">
                    {selectedMemoire.titre_fr}
                  </p>
                )}

                <div className="grid gap-2 text-sm">
                  {selectedMemoire.module && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span className="font-medium">المادة:</span> 
                      {selectedMemoire.module.designation_ar || selectedMemoire.module.designation_fr} ({selectedMemoire.module.code_module})
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">المتدرب:</span> 
                    {selectedMemoire.stagiaire.prenom_fr} {selectedMemoire.stagiaire.nom_fr}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">تاريخ التقديم:</span> 
                    {formatDate(selectedMemoire.createdAt)}
                  </div>
                </div>

                {selectedMemoire.observation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">ملاحظات المشرف:</span> {selectedMemoire.observation}
                    </p>
                  </div>
                )}
              </div>

              {/* PDF Actions */}
              {selectedMemoire.fichierpdf ? (
                <>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      onClick={handleViewPDF}
                      className="flex items-center gap-2 font-arabic"
                      variant="default"
                    >
                      <Eye className="h-4 w-4" />
                      عرض الملف
                    </Button>
                    
                    <Button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 font-arabic"
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                      تحميل PDF
                    </Button>
                    
                    <Button
                      onClick={handleOpenInNewTab}
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
                          title={`PDF - ${selectedMemoire.titre_ar || selectedMemoire.titre_fr || 'memoire'}`}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    لا يوجد ملف PDF متوفر لهذه المذكرة
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions de fermeture */}
              <div className="flex justify-start pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsMemoireDialogOpen(false)}
                  className="font-arabic"
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مراجعة وتقييم المذكرة</DialogTitle>
          </DialogHeader>
          {selectedMemoire && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedMemoire.titre_ar || selectedMemoire.titre_fr || 'بدون عنوان'}</h3>
                <p className="text-sm text-gray-600">
                  الطالب: {selectedMemoire.stagiaire.prenom_fr} {selectedMemoire.stagiaire.nom_fr}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة المذكرة *
                </label>
                <Select value={reviewForm.status} onValueChange={(value) => setReviewForm({...reviewForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مقبول">مقبول</SelectItem>
                    <SelectItem value="مرفوض">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات وتعليقات
                </label>
                <Textarea
                  value={reviewForm.observations}
                  onChange={(e) => setReviewForm({...reviewForm, observations: e.target.value})}
                  placeholder="أدخل ملاحظاتك وتعليقاتك على المذكرة..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleReview} className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  حفظ التقييم
                </Button>
                <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemoireSupervision;