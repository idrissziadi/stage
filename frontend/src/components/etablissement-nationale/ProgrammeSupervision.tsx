import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  BarChart3, 
  Eye,
  Download,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiService as api } from '@/services/api';
import PDFViewer from '@/components/ui/pdf-viewer';

interface Programme {
  id_programme: number;
  code_programme: string;
  titre_fr: string;
  titre_ar: string;
  status: 'في_الانتظار' | 'مقبول' | 'مرفوض';
  observation?: string;
  fichierpdf?: string;
  module: {
    designation_fr: string;
    designation_ar: string;
    code_module: string;
  };
  etablissementRegionale: {
    nom_fr: string;
    nom_ar: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProgrammeStats {
  total: number;
  parStatut: {
    'في_الانتظار': number;
    'مقبول': number;
    'مرفوض': number;
  };
}

const ProgrammeSupervision: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [stats, setStats] = useState<ProgrammeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [observation, setObservation] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfProgramme, setPdfProgramme] = useState<Programme | null>(null);
  
  const { toast } = useToast();

  const statusLabels = {
    'في_الانتظار': 'في الانتظار',
    'مقبول': 'مقبول',
    'مرفوض': 'مرفوض'
  };

  const statusColors = {
    'في_الانتظار': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'مقبول': 'bg-green-100 text-green-800 border-green-200',
    'مرفوض': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    'في_الانتظار': Clock,
    'مقبول': CheckCircle,
    'مرفوض': XCircle
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [programmesRes, statsRes] = await Promise.all([
        api.request('/programme'),
        api.request('/programme/stats')
      ]);
      
      if (programmesRes.error) throw new Error(programmesRes.error.message || 'Erreur programmes');
      if (statsRes.error) throw new Error(statsRes.error.message || 'Erreur stats');
      
      setProgrammes((programmesRes.data as Programme[]) || []);
      setStats((statsRes.data as ProgrammeStats) || null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!selectedProgramme || !observation.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال ملاحظة",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading(true);
      const response = await api.request(`/programme/${selectedProgramme.id_programme}/validate`, {
        method: 'POST',
        body: JSON.stringify({ observation })
      });
      
      if (response.error) throw new Error(response.error.message || 'Erreur validation');
      
      toast({
        title: "نجح",
        description: "تم قبول البرنامج بنجاح"
      });
      
      setSelectedProgramme(null);
      setObservation('');
      fetchData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "تعذر قبول البرنامج",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProgramme || !observation.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال ملاحظة",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading(true);
      const response = await api.request(`/programme/${selectedProgramme.id_programme}/reject`, {
        method: 'POST',
        body: JSON.stringify({ observation })
      });
      
      if (response.error) throw new Error(response.error.message || 'Erreur rejet');
      
      toast({
        title: "نجح",
        description: "تم رفض البرنامج"
      });
      
      setSelectedProgramme(null);
      setObservation('');
      fetchData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "تعذر رفض البرنامج",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
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

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = 
      programme.code_programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.titre_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.module.designation_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.etablissementRegionale.nom_fr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || programme.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingProgrammes = programmes.filter(p => p.status === 'في_الانتظار');
  const validatedProgrammes = programmes.filter(p => p.status === 'مقبول');
  const rejectedProgrammes = programmes.filter(p => p.status === 'مرفوض');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-r-4 border-r-blue-500 bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 font-arabic">إجمالي البرامج</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 font-arabic">{stats?.total || 0}</p>
                <p className="text-xs text-blue-500 font-arabic">تم إنشاؤها</p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800/50 rounded-full">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-yellow-500 bg-gradient-to-l from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 font-arabic">في الانتظار</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 font-arabic">{stats?.parStatut?.['في_الانتظار'] || 0}</p>
                <p className="text-xs text-yellow-500 font-arabic">بانتظار المراجعة</p>
              </div>
              <div className="p-3 bg-yellow-200 dark:bg-yellow-800/50 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-green-500 bg-gradient-to-l from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 font-arabic">معتمدة</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-arabic">{stats?.parStatut?.['مقبول'] || 0}</p>
                <p className="text-xs text-green-500 font-arabic">تم اعتمادها</p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800/50 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-red-500 bg-gradient-to-l from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 font-arabic">مرفوضة</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300 font-arabic">{stats?.parStatut?.['مرفوض'] || 0}</p>
                <p className="text-xs text-red-500 font-arabic">تم رفضها</p>
              </div>
              <div className="p-3 bg-red-200 dark:bg-red-800/50 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الفلاتر والبحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic text-right">
            <Filter className="h-5 w-5" />
            فلاتر البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="font-arabic text-right block">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="البحث بالكود، العنوان، المادة أو المؤسسة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right font-arabic"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="font-arabic text-right block">الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-right font-arabic">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="في_الانتظار">في الانتظار</SelectItem>
                  <SelectItem value="مقبول">مقبول</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الألسنة */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="pending" className="flex items-center gap-2 font-arabic data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4" />
            في الانتظار ({pendingProgrammes.length})
          </TabsTrigger>
          <TabsTrigger value="validated" className="flex items-center gap-2 font-arabic data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm">
            <CheckCircle className="h-4 w-4" />
            مقبولة ({validatedProgrammes.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2 font-arabic data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">
            <XCircle className="h-4 w-4" />
            مرفوضة ({rejectedProgrammes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Alert className="border-r-4 border-r-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-arabic text-right">
              {pendingProgrammes.length} برنامج في انتظار الموافقة
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            {pendingProgrammes.map((programme) => (
              <ProgrammeCard 
                key={programme.id_programme} 
                programme={programme} 
                onAction={(programme) => setSelectedProgramme(programme)}
                showActions={true}
                statusIcons={statusIcons}
                statusColors={statusColors}
                statusLabels={statusLabels}
                onViewPDF={handleOpenPDF}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="validated" className="space-y-4">
          <div className="grid gap-4">
            {validatedProgrammes.map((programme) => (
              <ProgrammeCard 
                key={programme.id_programme} 
                programme={programme} 
                onAction={(programme) => setSelectedProgramme(programme)}
                showActions={false}
                statusIcons={statusIcons}
                statusColors={statusColors}
                statusLabels={statusLabels}
                onViewPDF={handleOpenPDF}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid gap-4">
            {rejectedProgrammes.map((programme) => (
              <ProgrammeCard 
                key={programme.id_programme} 
                programme={programme} 
                onAction={(programme) => setSelectedProgramme(programme)}
                showActions={false}
                statusIcons={statusIcons}
                statusColors={statusColors}
                statusLabels={statusLabels}
                onViewPDF={handleOpenPDF}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* حوار الإجراء */}
      <Dialog open={!!selectedProgramme} onOpenChange={() => setSelectedProgramme(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic text-right">إجراء على البرنامج</DialogTitle>
            <DialogDescription>
              {selectedProgramme && (
                <div className="space-y-2 text-right font-arabic">
                  <p><strong>الكود:</strong> {selectedProgramme.code_programme}</p>
                  <p><strong>العنوان:</strong> {selectedProgramme.titre_ar || selectedProgramme.titre_fr}</p>
                                          <p><strong>المادة:</strong> {selectedProgramme.module.designation_ar || selectedProgramme.module.designation_fr}</p>
                  <p><strong>المؤسسة:</strong> {selectedProgramme.etablissementRegionale.nom_ar || selectedProgramme.etablissementRegionale.nom_fr}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observation" className="font-arabic text-right block">الملاحظة *</Label>
              <Textarea
                id="observation"
                placeholder="أدخل ملاحظتك..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={4}
                className="text-right font-arabic"
                dir="rtl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 flex-row-reverse">
            <Button
              onClick={handleValidate}
              disabled={actionLoading || !observation.trim()}
              className="flex items-center gap-2 font-arabic"
            >
              <Check className="h-4 w-4" />
              قبول
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !observation.trim()}
              className="flex items-center gap-2 font-arabic"
            >
              <X className="h-4 w-4" />
              رفض
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProgramme(null);
                setObservation('');
              }}
              disabled={actionLoading}
              className="font-arabic"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      {pdfProgramme && (
        <PDFViewer
          isOpen={isPdfViewerOpen}
          onClose={handleClosePDF}
          programme={pdfProgramme}
          userRole="EtablissementNationale"
        />
      )}
    </div>
  );
};

interface ProgrammeCardProps {
  programme: Programme;
  onAction: (programme: Programme) => void;
  showActions: boolean;
  statusIcons: Record<string, any>;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
  onViewPDF: (programme: Programme) => void;
}

const ProgrammeCard: React.FC<ProgrammeCardProps> = ({ programme, onAction, showActions, statusIcons, statusColors, statusLabels, onViewPDF }) => {
  const StatusIcon = statusIcons[programme.status];
  
  return (
    <Card className="hover:shadow-lg transition-shadow" dir="rtl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge className={statusColors[programme.status]}>
            <StatusIcon className="h-3 w-3 ml-1" />
            {statusLabels[programme.status]}
          </Badge>
          <div className="space-y-1 flex-1 text-right">
            <CardTitle className="text-lg font-arabic">{programme.titre_ar || programme.titre_fr}</CardTitle>
            <CardDescription className="text-sm font-arabic">
              الكود: {programme.code_programme}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground font-arabic text-right block">المادة</Label>
            <p className="text-sm text-right font-arabic">{programme.module.designation_ar || programme.module.designation_fr}</p>
            <p className="text-xs text-muted-foreground text-right">الكود: {programme.module.code_module}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground font-arabic text-right block">المؤسسة</Label>
            <p className="text-sm text-right font-arabic">{programme.etablissementRegionale.nom_ar || programme.etablissementRegionale.nom_fr}</p>
          </div>
        </div>

        {programme.observation && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground font-arabic text-right block">الملاحظة</Label>
            <p className="text-sm bg-muted p-2 rounded text-right font-arabic">{programme.observation}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {showActions && (
              <Button 
                onClick={() => onAction(programme)}
                size="sm"
                className="flex items-center gap-1 font-arabic"
              >
                <Eye className="h-3 w-3" />
                فحص
              </Button>
            )}
            
            {programme.fichierpdf && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 font-arabic"
                onClick={() => onViewPDF(programme)}
              >
                <Download className="h-3 w-3" />
                عرض PDF
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground font-arabic">
            تم الإنشاء في {new Date(programme.createdAt).toLocaleDateString('ar-MA')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgrammeSupervision;
