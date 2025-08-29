import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Star
} from 'lucide-react';

interface Memoire {
  id_memoire: string;
  titre: string;
  description: string;
  fichier_memoire?: string;
  status: string;
  created_at: string;
  stagiaire: {
    nom_fr: string;
    prenom_fr: string;
    email?: string;
  };
  observations?: string;
  note?: number;
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
  const [reviewForm, setReviewForm] = useState({
    status: '',
    observations: '',
    note: ''
  });

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchMemoires();
    }
  }, [userProfile]);

  const fetchMemoires = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getMemoiresByEnseignant(userProfile.id_enseignant);
      setMemoires(response.data || []);
      
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

    try {
      const response = await apiService.updateMemoireStatus(
        selectedMemoire.id_memoire, 
        reviewForm.status
      );
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Update memoire with observations and note if provided
      if (reviewForm.observations || reviewForm.note) {
        await apiService.updateMemoire(selectedMemoire.id_memoire, {
          observations: reviewForm.observations,
          note: reviewForm.note ? parseFloat(reviewForm.note) : undefined
        });
      }

      toast({
        title: 'نجح',
        description: 'تم تحديث حالة المذكرة بنجاح',
      });

      // Reset form and close dialog
      setReviewForm({ status: '', observations: '', note: '' });
      setIsReviewOpen(false);
      setSelectedMemoire(null);
      
      // Refresh data
      fetchMemoires();
      
    } catch (error) {
      console.error('Review error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة المذكرة',
        variant: 'destructive'
      });
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
      case 'قيد_المراجعة':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
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
      case 'قيد_المراجعة':
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'مقبول': 'مقبول',
      'في_الانتظار': 'في الانتظار',
      'مرفوض': 'مرفوض',
      'قيد_المراجعة': 'قيد المراجعة'
    };
    return statusMap[status] || status;
  };

  const filteredMemoires = memoires.filter(memoire => {
    const matchesSearch = memoire.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || memoire.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatsData = () => {
    return {
      total: memoires.length,
      approved: memoires.filter(m => m.status === 'مقبول').length,
      pending: memoires.filter(m => m.status === 'في_الانتظار').length,
      underReview: memoires.filter(m => m.status === 'قيد_المراجعة').length,
      rejected: memoires.filter(m => m.status === 'مرفوض').length
    };
  };

  const stats = getStatsData();

  const openReviewDialog = (memoire: Memoire) => {
    setSelectedMemoire(memoire);
    setReviewForm({
      status: memoire.status,
      observations: memoire.observations || '',
      note: memoire.note?.toString() || ''
    });
    setIsReviewOpen(true);
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
      <div className="grid gap-4 md:grid-cols-5">
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
                <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
                <p className="text-2xl font-bold text-blue-700">{stats.underReview}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
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
                <SelectItem value="في_الانتظار">في الانتظار</SelectItem>
                <SelectItem value="قيد_المراجعة">قيد المراجعة</SelectItem>
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
                          {memoire.titre}
                        </h3>
                        <Badge className={getStatusColor(memoire.status)}>
                          {getStatusIcon(memoire.status)}
                          <span className="mr-1">{getStatusText(memoire.status)}</span>
                        </Badge>
                        {memoire.note && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {memoire.note}/20
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span><span className="font-medium">الطالب:</span> {memoire.stagiaire.prenom_fr} {memoire.stagiaire.nom_fr}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span><span className="font-medium">تاريخ التقديم:</span> {new Date(memoire.created_at).toLocaleDateString('ar-DZ')}</span>
                        </div>
                        {memoire.stagiaire.email && (
                          <p><span className="font-medium">البريد الإلكتروني:</span> {memoire.stagiaire.email}</p>
                        )}
                      </div>
                      
                      {memoire.description && (
                        <div className="bg-gray-50 p-3 rounded-md mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">الوصف:</p>
                          <p className="text-sm text-gray-600">{memoire.description}</p>
                        </div>
                      )}
                      
                      {memoire.observations && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-800 mb-1">ملاحظات المشرف:</p>
                          <p className="text-sm text-blue-700">{memoire.observations}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {memoire.fichier_memoire && (
                        <>
                          <Button size="sm" variant="outline" title="عرض المذكرة">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="تحميل المذكرة">
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

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مراجعة وتقييم المذكرة</DialogTitle>
          </DialogHeader>
          {selectedMemoire && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedMemoire.titre}</h3>
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
                    <SelectItem value="في_الانتظار">في الانتظار</SelectItem>
                    <SelectItem value="قيد_المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="مقبول">مقبول</SelectItem>
                    <SelectItem value="مرفوض">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النقطة (من 20)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={reviewForm.note}
                  onChange={(e) => setReviewForm({...reviewForm, note: e.target.value})}
                  placeholder="أدخل النقطة"
                />
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