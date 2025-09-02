import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  Download, 
  Eye, 
  FileText, 
  ExternalLink,
  AlertTriangle,
  Loader2,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { apiService, getFileUrl } from '@/services/api';
import { formatDate } from '@/utils/formatDate';

interface CourseMemoirePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id_cours?: number;
    id_memoire?: number;
    code_cours?: string;
    titre_fr: string;
    titre_ar?: string;
    fichierpdf?: string;
    module?: {
      designation_fr: string;
      designation_ar?: string;
      code_module: string;
    };
    enseignant?: {
      nom_fr: string;
      prenom_fr: string;
    };
    stagiaire?: {
      nom_fr: string;
      prenom_fr: string;
    };
    observation?: string;
    created_at?: string;
  };
  type: 'cours' | 'memoire';
  userRole: 'Enseignant' | 'EtablissementNationale' | 'EtablissementRegionale' | 'Stagiaire';
}

const CourseMemoirePDFViewer: React.FC<CourseMemoirePDFViewerProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  type,
  userRole 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const getRoleLabel = () => {
    const roleLabels = {
      'Enseignant': 'مُدرس',
      'EtablissementNationale': 'إدارة وطنية',
      'EtablissementRegionale': 'إدارة جهوية',
      'Stagiaire': 'متدرب'
    };
    return roleLabels[userRole] || userRole;
  };

  const getTypeLabel = () => {
    return type === 'cours' ? 'الدرس' : 'المذكرة';
  };

  const generatePdfUrl = () => {
    if (!item.fichierpdf) return null;
    
    // Utiliser la même fonction que celle qui fonctionne
    // Pour les mémoires, utiliser 'memoires' (pluriel) comme dans getFileUrl
    const fileType = type === 'cours' ? 'cours' : 'memoires';
    return getFileUrl(item.fichierpdf, fileType);
  };

  const handleViewPDF = () => {
    const url = generatePdfUrl();
    if (!url) {
      toast({
        title: "خطأ",
        description: `ملف PDF غير متوفر لهذه ${getTypeLabel()}`,
        variant: "destructive"
      });
      return;
    }

    setPdfUrl(url);
  };

  const handleDownloadPDF = async () => {
    if (!item.fichierpdf) {
      toast({
        title: "خطأ",
        description: `ملف PDF غير متوفر لهذه ${getTypeLabel()}`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const url = generatePdfUrl();
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
      link.download = `${item.titre_ar || item.titre_fr || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "نجح",
        description: `تم تحميل ${getTypeLabel()} بنجاح`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "خطأ",
        description: `فشل في تحميل ${getTypeLabel()}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInNewTab = () => {
    const url = generatePdfUrl();
    const token = localStorage.getItem('auth_token');
    
    if (url && token) {
      const urlWithAuth = `${url}?token=${encodeURIComponent(token)}`;
      window.open(urlWithAuth, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "خطأ",
        description: `تعذر فتح الملف - غير مصرح`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-arabic text-right flex items-center gap-2">
            <FileText className="h-5 w-5" />
            عرض مستند {getTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            <span className="text-right font-arabic">معلومات {getTypeLabel()}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Item Details */}
        <div className="space-y-3 text-right font-arabic mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">
              {item.titre_ar || item.titre_fr || 'بدون عنوان'}
            </h3>
            
            {item.titre_fr && item.titre_ar && item.titre_fr !== item.titre_ar && (
              <p className="text-sm text-gray-600 mb-3 italic">
                {item.titre_fr}
              </p>
            )}

            <div className="grid gap-2 text-sm">
              {item.code_cours && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">الكود:</span> {item.code_cours}
                </div>
              )}
              
              {item.module && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="font-medium">المادة:</span> 
                  {item.module.designation_ar || item.module.designation_fr} ({item.module.code_module})
                </div>
              )}
              
              {item.enseignant && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">الأستاذ:</span> 
                  {item.enseignant.prenom_fr} {item.enseignant.nom_fr}
                </div>
              )}
              
              {item.stagiaire && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">المتدرب:</span> 
                  {item.stagiaire.prenom_fr} {item.stagiaire.nom_fr}
                </div>
              )}
              
              {item.created_at && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">تاريخ الإنشاء:</span> 
                  {formatDate(item.created_at)}
                </div>
              )}
            </div>

            {item.observation && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">ملاحظات:</span> {item.observation}
                </p>
              </div>
            )}
          </div>

          {/* PDF Actions */}
          {item.fichierpdf ? (
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
                  disabled={isLoading}
                  className="flex items-center gap-2 font-arabic"
                  variant="outline"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
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
                      title={`PDF - ${item.titre_ar || item.titre_fr || 'document'}`}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-arabic">
                لا يوجد ملف PDF متوفر لهذا {getTypeLabel()}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions de fermeture */}
          <div className="flex justify-start pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-arabic"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseMemoirePDFViewer;
