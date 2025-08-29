import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Edit,
  FileCheck,
  Info,
  RefreshCw
} from 'lucide-react';

interface Memoire {
  id_memoire: string;
  titre_fr?: string;
  titre_ar?: string;
  fichierpdf?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  observation?: string;
  enseignant?: {
    nom_fr: string;
    prenom_fr: string;
  };
}

const MonMemoire = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [memoire, setMemoire] = useState<Memoire | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [titreAr, setTitreAr] = useState('');
  const [titreFr, setTitreFr] = useState('');
  const [observation, setObservation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userProfile?.id_stagiaire) {
      fetchMemoire();
    }
  }, [userProfile]);

  const fetchMemoire = async () => {
    try {
      setLoading(true);
      // Use the new detailed workflow API endpoint
      const response = await apiService.getMemoireByStagiaire(userProfile.id_stagiaire);
      
      if (response.data) {
        const memoireData = response.data;
        setMemoire(memoireData);
        setTitreAr(memoireData.titre_ar || '');
        setTitreFr(memoireData.titre_fr || '');
        setObservation(memoireData.observation || '');
      } else {
        setMemoire(null);
      }
    } catch (error) {
      console.error('Error fetching memoire:', error);
      // If no memoire is assigned, this is expected
      if (error.status === 404) {
        setMemoire(null);
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل في تحميل بيانات المذكرة',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'خطأ',
          description: 'يجب أن يكون الملف من نوع PDF',
          variant: 'destructive'
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'خطأ',
          description: 'حجم الملف يجب أن يكون أقل من 10 ميجابايت',
          variant: 'destructive'
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!memoire) {
      toast({
        title: 'خطأ',
        description: 'لا توجد مذكرة لحفظ التغييرات',
        variant: 'destructive'
      });
      return;
    }

    if (!titreAr.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان المذكرة بالعربية',
        variant: 'destructive'
      });
      return;
    }

    // Check if memoire can be modified
    if (memoire.status === 'مقبول' || memoire.status === 'مرفوض') {
      toast({
        title: 'خطأ',
        description: 'لا يمكن تعديل المذكرة بعد التقييم',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);

      // Use the new detailed workflow API
      const updateData = {
        titre_ar: titreAr,
        titre_fr: titreFr
      };

      if (selectedFile) {
        updateData.fichierpdf = selectedFile;
      }

      const response = await apiService.updateMemoireByStagiaire(
        userProfile.id_stagiaire,
        updateData
      );
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في حفظ المذكرة');
      }

      setMemoire(response.data.memoire);
      setSelectedFile(null);
      
      toast({
        title: 'نجح',
        description: selectedFile ? 'تم حفظ المذكرة وتحديث الملف بنجاح' : 'تم حفظ تغييرات المذكرة بنجاح',
      });

      setIsEditing(false);
      
      // Refresh data
      await fetchMemoire();
      
    } catch (error) {
      console.error('Error saving memoire:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في حفظ المذكرة',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleViewPDF = () => {
    if (memoire?.fichierpdf) {
      const pdfUrl = getFileUrl(memoire.fichierpdf, 'memoires');
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadPDF = async () => {
    if (!memoire?.fichierpdf) return;

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
      link.download = `${memoire.titre_ar || memoire.titre_fr || 'مذكرة'}.pdf`;
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'مقبول':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          description: 'تم قبول مذكرتك من قبل المشرف'
        };
      case 'مقدم':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Clock className="w-4 h-4" />,
          description: 'مذكرتك مقدمة للمراجعة من قبل المشرف'
        };
      case 'مرفوض':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertTriangle className="w-4 h-4" />,
          description: 'تم رفض مذكرتك، يرجى مراجعة الملاحظات وإعادة التقديم'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="w-4 h-4" />,
          description: 'مسودة - لم يتم تقديم المذكرة بعد'
        };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل مذكرتك...</p>
      </div>
    );
  }

  if (!memoire) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">مذكرتي</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  إدارة وتحديث مذكرة التخرج
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="font-arabic">
            <strong>لا توجد مذكرة مخصصة لك بعد</strong>
            <br />
            لم يتم تخصيص مذكرة لك من قبل مؤسسة التكوين. المذكرات يتم إنشاؤها من قبل مؤسسة التكوين مع تعيين:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>الطالب المخصص للمذكرة</li>
              <li>الأستاذ المشرف</li>
              <li>موضوع المذكرة (اختياري)</li>
            </ul>
            <br />
            سيتم إشعارك عند تخصيص مذكرة لك وستتمكن من:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>إكمال المعلومات (العنوان، الملخص...)</li>
              <li>رفع ملف PDF للمذكرة</li>
              <li>تحديث الإصدارات</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">انتظار تخصيص المذكرة</h3>
            <p className="text-gray-600 mb-4 font-arabic">
              يرجى انتظار قيام مؤسسة التكوين بإنشاء مذكرة لك وتعيين مشرف
            </p>
            <Button onClick={fetchMemoire} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(memoire.status);

  return (
    <div className="space-y-6 rtl">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">مذكرتي</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                إدارة وتحديث مذكرة التخرج
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={statusInfo.color}>
                {statusInfo.icon}
                <span className="mr-1">{memoire.status}</span>
              </Badge>
              <p className="text-sm text-gray-600 font-arabic">{statusInfo.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={memoire.status === 'مقبول'}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'إلغاء التعديل' : 'تعديل'}
              </Button>
              {memoire.fichierpdf && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewPDF}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    عرض
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status-specific alerts */}
      {memoire.status === 'مقبول' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="font-arabic">
            <strong>تهانينا!</strong> تم قبول مذكرتك من قبل المشرف. لا يمكن تعديل المذكرة بعد الآن.
          </AlertDescription>
        </Alert>
      )}

      {memoire.status === 'مرفوض' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="font-arabic">
            <strong>تم رفض المذكرة.</strong> يرجى مراجعة ملاحظات المشرف أدناه وإجراء التعديلات المطلوبة.
          </AlertDescription>
        </Alert>
      )}

      {!memoire.fichierpdf && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Upload className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="font-arabic">
            <strong>لم يتم رفع ملف المذكرة بعد.</strong> يرجى رفع ملف PDF لمذكرتك لبدء عملية المراجعة.
          </AlertDescription>
        </Alert>
      )}

      {/* Memoire Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">معلومات المذكرة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="titre-ar" className="font-arabic">العنوان بالعربية *</Label>
              <Input
                id="titre-ar"
                value={titreAr}
                onChange={(e) => setTitreAr(e.target.value)}
                disabled={!isEditing || memoire.status === 'مقبول'}
                placeholder="أدخل عنوان المذكرة بالعربية"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="titre-fr" className="font-arabic">العنوان بالفرنسية</Label>
              <Input
                id="titre-fr"
                value={titreFr}
                onChange={(e) => setTitreFr(e.target.value)}
                disabled={!isEditing || memoire.status === 'مقبول'}
                placeholder="Titre en français (optionnel)"
                className="mt-1"
              />
            </div>
          </div>

          {/* Supervisor Information */}
          {memoire.enseignant && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900 font-arabic">المشرف</span>
              </div>
              <p className="text-blue-800">
                {memoire.enseignant.prenom_fr} {memoire.enseignant.nom_fr}
              </p>
            </div>
          )}

          {/* Summary/Observation */}
          <div>
            <Label htmlFor="observation" className="font-arabic">
              الملخص أو الوصف
            </Label>
            <Textarea
              id="observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              disabled={!isEditing || memoire.status === 'مقبول'}
              placeholder="أدخل ملخص أو وصف للمذكرة..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* File Upload */}
          {isEditing && memoire.status !== 'مقبول' && (
            <div>
              <Label htmlFor="file-upload" className="font-arabic">
                {memoire.fichierpdf ? 'تحديث ملف المذكرة (PDF)' : 'رفع ملف المذكرة (PDF)'}
              </Label>
              <div className="mt-1">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1 font-arabic">
                  يجب أن يكون الملف من نوع PDF وأقل من 10 ميجابايت
                </p>
                {selectedFile && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-arabic">
                      تم اختيار الملف: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current File Info */}
          {memoire.fichierpdf && !isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 font-arabic">ملف المذكرة متوفر</p>
                    <p className="text-sm text-gray-600 font-arabic">تم رفع ملف PDF للمذكرة</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleViewPDF}>
                    <Eye className="w-4 h-4 mr-2" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    تحميل
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">تاريخ الإنشاء:</span>
              <span>{new Date(memoire.created_at).toLocaleDateString('ar-DZ')}</span>
            </div>
            {memoire.updated_at && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">آخر تحديث:</span>
                <span>{new Date(memoire.updated_at).toLocaleDateString('ar-DZ')}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && memoire.status !== 'مقبول' && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={saving || !titreAr.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setTitreAr(memoire.titre_ar || '');
                  setTitreFr(memoire.titre_fr || '');
                  setObservation(memoire.observation || '');
                  setSelectedFile(null);
                }}
              >
                إلغاء
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1 font-arabic">تعليمات مهمة</h4>
              <ul className="text-sm text-blue-800 space-y-1 font-arabic">
                <li>• تأكد من صحة العنوان قبل الحفظ</li>
                <li>• يجب أن يكون ملف المذكرة بصيغة PDF فقط</li>
                <li>• حجم الملف يجب أن يكون أقل من 10 ميجابايت</li>
                <li>• بعد قبول المذكرة لا يمكن تعديلها</li>
                <li>• في حالة الرفض، يرجى مراجعة ملاحظات المشرف وإجراء التعديلات</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonMemoire;