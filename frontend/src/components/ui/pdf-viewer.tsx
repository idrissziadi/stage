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
  Loader2
} from 'lucide-react';
import { apiService } from '@/services/api';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  programme: {
    id_programme: number;
    code_programme: string;
    titre_fr: string;
    titre_ar?: string;
    fichierpdf?: string;
    module?: {
      designation_fr: string;
      designation_ar?: string;
    };
    etablissementRegionale?: {
      nom_fr: string;
      nom_ar?: string;
    };
  };
  userRole: 'Enseignant' | 'EtablissementNationale' | 'EtablissementRegionale';
}

const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose, programme, userRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const getRoleLabel = () => {
    const roleLabels = {
      'Enseignant': 'مُدرس',
      'EtablissementNationale': 'إدارة وطنية',
      'EtablissementRegionale': 'إدارة جهوية'
    };
    return roleLabels[userRole] || userRole;
  };

  const generatePdfUrl = () => {
    if (!programme.fichierpdf) return null;
    
    // Utiliser la route de service de fichiers PDF
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/programme/pdf/${programme.fichierpdf}`;
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
    
    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPDF = async () => {
    const url = generatePdfUrl();
    if (!url) {
      toast({
        title: "خطأ",
        description: "ملف PDF غير متوفر لهذا البرنامج",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Non authentifié');
      }
      
      // Télécharger le fichier avec authentification
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fichier non trouvé');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${programme.code_programme}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "نجح التحميل",
        description: "تم تحميل ملف PDF بنجاح"
      });
      
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      toast({
        title: "خطأ في التحميل",
        description: "تعذر تحميل ملف PDF",
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
      // Pour l'ouverture dans un nouvel onglet, nous utilisons l'URL avec le token en paramètre
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
            عرض مستند البرنامج
          </DialogTitle>
          <DialogDescription>
            <span className="text-right font-arabic">معلومات البرنامج</span>
          </DialogDescription>
        </DialogHeader>

        {/* Programme Details */}
        <div className="space-y-3 text-right font-arabic mb-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-arabic">
              {getRoleLabel()}
            </Badge>
            <h3 className="font-semibold text-lg">
              {programme.titre_ar || programme.titre_fr}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>كود البرنامج:</strong> {programme.code_programme}
            </div>
            {programme.module && (
              <div>
                <strong>المادة:</strong> {programme.module.designation_ar || programme.module.designation_fr}
              </div>
            )}
            {programme.etablissementRegionale && (
              <div className="md:col-span-2">
                <strong>المؤسسة:</strong> {programme.etablissementRegionale.nom_ar || programme.etablissementRegionale.nom_fr}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!programme.fichierpdf ? (
            <Alert className="border-r-4 border-r-orange-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-arabic text-right">
                لا يتوفر ملف PDF لهذا البرنامج حاليًا
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Options d'action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  disabled={isLoading}
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
                  variant="secondary"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح في علامة تبويب جديدة
                </Button>
              </div>

              {/* Aperçu PDF intégré (optionnel) */}
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
                      title={`PDF - ${programme.code_programme}`}
                    />
                  </div>
                </div>
              )}
            </>
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

export default PDFViewer;
