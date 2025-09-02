import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
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
  GraduationCap,
  Calendar,
  MapPin
} from 'lucide-react';
import { apiService, getFileUrl } from '@/services/api';

interface ProgrammePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  programme: {
    id_programme?: number;
    code_programme?: string;
    titre_fr: string;
    titre_ar?: string;
    fichierpdf?: string;
    specialite?: {
      designation_fr: string;
      designation_ar?: string;
      code_specialite: string;
    };
    etablissement?: {
      nom_fr: string;
      nom_ar?: string;
      ville?: string;
    };
    duree?: string;
    observation?: string;
    created_at?: string;
    status?: string;
  };
  userRole: 'Enseignant' | 'EtablissementNationale' | 'EtablissementRegionale' | 'Stagiaire';
}

const ProgrammePDFViewer: React.FC<ProgrammePDFViewerProps> = ({ 
  isOpen, 
  onClose, 
  programme, 
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

  const generatePdfUrl = () => {
    if (!programme.fichierpdf) return null;
    
    // Utiliser la même fonction que celle qui fonctionne
    return getFileUrl(programme.fichierpdf, 'programmes');
  };

  const handleViewPDF = () => {
    const url = generatePdfUrl();
    if (!url) {
      toast({
        title: "خطأ",
        description: "ملف PDF غير متوفر لهذا البرنامج",
        variant: "destructive"
      });
      return;
    }

    setPdfUrl(url);
  };

  const handleDownloadPDF = async () => {
    if (!programme.fichierpdf) {
      toast({
        title: "خطأ",
        description: "ملف PDF غير متوفر لهذا البرنامج",
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
      link.download = `${programme.titre_ar || programme.titre_fr || 'programme'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "نجح",
        description: "تم تحميل البرنامج بنجاح",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البرنامج",
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
        description: "تعذر فتح الملف - غير مصرح",
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
            عرض برنامج تعليمي
          </DialogTitle>
          <DialogDescription>
            <span className="text-right font-arabic">معلومات البرنامج</span>
          </DialogDescription>
        </DialogHeader>

        {/* Programme Details */}
        <div className="space-y-3 text-right font-arabic mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">
              {programme.titre_ar || programme.titre_fr || 'بدون عنوان'}
            </h3>
            
            {programme.titre_fr && programme.titre_ar && programme.titre_fr !== programme.titre_ar && (
              <p className="text-sm text-gray-600 mb-3 italic">
                {programme.titre_fr}
              </p>
            )}

            <div className="grid gap-2 text-sm">
              {programme.code_programme && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">الكود:</span> {programme.code_programme}
                </div>
              )}
              
              {programme.specialite && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="font-medium">التخصص:</span> 
                  {programme.specialite.designation_ar || programme.specialite.designation_fr} ({programme.specialite.code_specialite})
                </div>
              )}
              
              {programme.etablissement && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">المؤسسة:</span> 
                  {programme.etablissement.nom_ar || programme.etablissement.nom_fr}
                  {programme.etablissement.ville && (
                    <span className="text-gray-600"> - {programme.etablissement.ville}</span>
                  )}
                </div>
              )}
              
              {programme.duree && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">المدة:</span> {programme.duree}
                </div>
              )}
              
              {programme.status && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={programme.status === 'مقبول' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {programme.status}
                  </Badge>
                </div>
              )}
              
              {programme.created_at && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">تاريخ الإنشاء:</span> 
                  {formatDate(programme.created_at)}
                </div>
              )}
            </div>

            {programme.observation && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">ملاحظات:</span> {programme.observation}
                </p>
              </div>
            )}
          </div>

          {/* PDF Actions */}
          {programme.fichierpdf ? (
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
                      title={`PDF - ${programme.titre_ar || programme.titre_fr || 'programme'}`}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-arabic">
                لا يوجد ملف PDF متوفر لهذا البرنامج
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

export default ProgrammePDFViewer;
