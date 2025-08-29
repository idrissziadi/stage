import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Eye, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Memoire {
  id_memoire: number;
  titre_fr?: string;
  titre_ar?: string;
  fichierpdf?: string;
  status: 'مقدم' | 'مقبول' | 'مرفوض';
  observation?: string;
  stagiaire: {
    id_stagiaire: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const MemoireValidation = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [validating, setValidating] = useState(false);
  
  // Validation dialog state
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);
  const [selectedMemoire, setSelectedMemoire] = useState<Memoire | null>(null);
  const [validationStatus, setValidationStatus] = useState<'مقبول' | 'مرفوض'>('مقبول');
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchMemoiresToValidate();
    }
  }, [userProfile]);

  const fetchMemoiresToValidate = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMemoiresToValidateByEnseignant(userProfile.id_enseignant);
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في تحميل المذكرات');
      }

      setMemoires(response.data || []);
    } catch (error) {
      console.error('Error fetching memoires to validate:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المذكرات للمراجعة',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenValidationDialog = (memoire: Memoire) => {
    setSelectedMemoire(memoire);
    setValidationStatus('مقبول');
    setObservation('');
    setIsValidationDialogOpen(true);
  };

  const handleValidateMemoire = async () => {
    if (!selectedMemoire) return;

    // Require observation for rejected memoires
    if (validationStatus === 'مرفوض' && !observation.trim()) {
      toast({
        title: 'خطأ',
        description: 'يجب إدخال ملاحظة عند رفض المذكرة',
        variant: 'destructive'
      });
      return;
    }

    try {
      setValidating(true);
      
      const response = await apiService.validateMemoireByEnseignant(
        selectedMemoire.id_memoire,
        {
          status: validationStatus,
          observation: observation.trim() || undefined
        }
      );
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في تقييم المذكرة');
      }

      toast({
        title: 'نجح',
        description: `تم ${validationStatus === 'مقبول' ? 'قبول' : 'رفض'} المذكرة بنجاح`,
      });

      setIsValidationDialogOpen(false);
      setSelectedMemoire(null);
      
      // Refresh the list
      await fetchMemoiresToValidate();
      
    } catch (error) {
      console.error('Error validating memoire:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تقييم المذكرة',
        variant: 'destructive'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleViewPDF = (memoire: Memoire) => {
    if (memoire.fichierpdf) {
      const pdfUrl = getFileUrl(memoire.fichierpdf, 'memoires');
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadPDF = async (memoire: Memoire) => {
    if (!memoire.fichierpdf) return;

    try {
      const pdfUrl = getFileUrl(memoire.fichierpdf, 'memoires');
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${memoire.titre_ar || memoire.titre_fr || 'مذكرة'}_${memoire.stagiaire.prenom_fr}_${memoire.stagiaire.nom_fr}.pdf`;
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

  const canValidateMemoire = (memoire: Memoire) => {
    return memoire.status === 'مقدم' && 
           (memoire.titre_ar || memoire.titre_fr) && 
           memoire.fichierpdf;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">تقييم المذكرات</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                مراجعة وتقييم مذكرات المتدربين المخصصين لك
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-arabic">قيد المراجعة</p>
                <p className="text-2xl font-bold">{memoires.filter(m => m.status === 'مقدم').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-arabic">جاهزة للتقييم</p>
                <p className="text-2xl font-bold">
                  {memoires.filter(m => canValidateMemoire(m)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-arabic">غير مكتملة</p>
                <p className="text-2xl font-bold">
                  {memoires.filter(m => !canValidateMemoire(m) && m.status === 'مقدم').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="font-arabic">
          <strong>معلومات هامة:</strong> يمكن تقييم المذكرة فقط بعد أن يقوم المتدرب بإدخال العنوان ورفع ملف PDF. 
          المذكرات المرفوضة يمكن للمتدرب تعديلها وإعادة تقديمها.
        </AlertDescription>
      </Alert>

      {/* Memoires List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">المذكرات المخصصة للمراجعة ({memoires.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : memoires.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد مذكرات للمراجعة</h3>
              <p className="text-gray-600 font-arabic">لم يتم تخصيص أي مذكرات لك للمراجعة حتى الآن</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-arabic">المتدرب</TableHead>
                    <TableHead className="font-arabic">العنوان</TableHead>
                    <TableHead className="font-arabic">الحالة</TableHead>
                    <TableHead className="font-arabic">الملف</TableHead>
                    <TableHead className="font-arabic">تاريخ التخصيص</TableHead>
                    <TableHead className="font-arabic">آخر تحديث</TableHead>
                    <TableHead className="font-arabic">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memoires.map((memoire) => (
                    <TableRow key={memoire.id_memoire}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{memoire.stagiaire.prenom_fr} {memoire.stagiaire.nom_fr}</p>
                            <p className="text-sm text-gray-600 font-arabic">{memoire.stagiaire.prenom_ar} {memoire.stagiaire.nom_ar}</p>
                            {memoire.stagiaire.email && (
                              <p className="text-xs text-gray-500">{memoire.stagiaire.email}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {memoire.titre_fr || memoire.titre_ar ? (
                          <div>
                            {memoire.titre_fr && <p className="font-semibold">{memoire.titre_fr}</p>}
                            {memoire.titre_ar && <p className="text-sm text-gray-600 font-arabic">{memoire.titre_ar}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic font-arabic">لم يتم إدخال العنوان بعد</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          <span className="font-arabic">مقدم للمراجعة</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {memoire.fichierpdf ? (
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleViewPDF(memoire)}
                            >
                              <Eye className="w-3 h-3" />
                              <span className="font-arabic">عرض</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleDownloadPDF(memoire)}
                            >
                              <Download className="w-3 h-3" />
                              <span className="font-arabic">تحميل</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm font-arabic">لا يوجد ملف</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(memoire.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(memoire.updatedAt).toLocaleDateString('ar-SA')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {canValidateMemoire(memoire) ? (
                          <Button
                            size="sm"
                            onClick={() => handleOpenValidationDialog(memoire)}
                            className="gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span className="font-arabic">تقييم</span>
                          </Button>
                        ) : (
                          <span className="text-gray-500 text-sm font-arabic">غير جاهزة للتقييم</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Dialog */}
      <Dialog open={isValidationDialogOpen} onOpenChange={setIsValidationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">تقييم المذكرة</DialogTitle>
            <DialogDescription className="font-arabic">
              {selectedMemoire && (
                <>تقييم مذكرة المتدرب: {selectedMemoire.stagiaire.prenom_fr} {selectedMemoire.stagiaire.nom_fr}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMemoire && (
            <div className="space-y-4">
              {/* Memoire Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold font-arabic mb-2">معلومات المذكرة:</h4>
                <div className="space-y-1 text-sm">
                  {selectedMemoire.titre_fr && <p><strong>العنوان (فرنسي):</strong> {selectedMemoire.titre_fr}</p>}
                  {selectedMemoire.titre_ar && <p className="font-arabic"><strong>العنوان (عربي):</strong> {selectedMemoire.titre_ar}</p>}
                  <p className="font-arabic"><strong>حالة الملف:</strong> {selectedMemoire.fichierpdf ? 'مرفوع' : 'غير مرفوع'}</p>
                </div>
              </div>

              {/* Validation Status */}
              <div>
                <Label className="font-arabic">القرار</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={validationStatus === 'مقبول' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setValidationStatus('مقبول')}
                    className="gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-arabic">قبول</span>
                  </Button>
                  <Button
                    variant={validationStatus === 'مرفوض' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setValidationStatus('مرفوض')}
                    className="gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="font-arabic">رفض</span>
                  </Button>
                </div>
              </div>

              {/* Observation */}
              <div>
                <Label htmlFor="observation" className="font-arabic">
                  الملاحظات {validationStatus === 'مرفوض' && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="observation"
                  placeholder={validationStatus === 'مقبول' 
                    ? 'ملاحظات إضافية (اختيارية)...' 
                    : 'يرجى توضيح أسباب الرفض وما يجب تحسينه...'
                  }
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="text-right"
                  dir="rtl"
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={handleValidateMemoire}
              disabled={validating || (validationStatus === 'مرفوض' && !observation.trim())}
              className={validationStatus === 'مرفوض' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {validating ? 'جاري التقييم...' : `${validationStatus === 'مقبول' ? 'قبول' : 'رفض'} المذكرة`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemoireValidation;