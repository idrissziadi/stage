import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService as api } from '@/services/api';
import { Module } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Eye,
  Download,
  CheckCircle,
  FileText,
  Building,
  Calendar,
  Clock,
  Target,
  Users,
  GraduationCap,
  Star,
  TrendingUp
} from 'lucide-react';
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
    id_module: number;
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

const ProgrammeConsultation: React.FC = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfProgramme, setPdfProgramme] = useState<Programme | null>(null);

  useEffect(() => {
    if (userProfile?.id_enseignant) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [programmesRes, modulesRes] = await Promise.all([
        api.request(`/programme/enseignant/${userProfile.id_enseignant}`),
        api.request('/module')
      ]);
      
      if (programmesRes.error) throw new Error(programmesRes.error.message || 'Erreur programmes');
      if (modulesRes.error) throw new Error(modulesRes.error.message || 'Erreur modules');
      
      setProgrammes(programmesRes.data || []);
      setModules(modulesRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les programmes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
    
    const matchesModule = moduleFilter === 'all' || programme.module.id_module.toString() === moduleFilter;
    
    return matchesSearch && matchesModule;
  });

  const uniqueModules = modules.filter(module => 
    programmes.some(programme => programme.module.id_module === module.id_module)
  );

  const stats = {
    totalProgrammes: programmes.length,
    modulesEnseignes: uniqueModules.length,
    etablissements: new Set(programmes.map(p => p.etablissementRegionale.nom_fr)).size
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-l from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              البرامج المعتمدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalProgrammes}</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-l from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              المواد المدرسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.modulesEnseignes}</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-l from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Building className="h-4 w-4" />
              المؤسسات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.etablissements}</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            استكشاف البرامج
          </CardTitle>
          <CardDescription>
            استعرض البرامج المعتمدة للمواد التي تدرسها
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="البحث بالرمز، العنوان، المادة أو المؤسسة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="module">المادة</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المواد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المواد</SelectItem>
                  {uniqueModules.map((module) => (
                    <SelectItem key={module.id_module} value={module.id_module.toString()}>
                      {module.designation_fr} ({module.code_module})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets par module */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            الكل ({programmes.length})
          </TabsTrigger>
          {uniqueModules.map((module) => (
            <TabsTrigger 
              key={module.id_module} 
              value={module.id_module.toString()} 
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {module.code_module}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredProgrammes.map((programme) => (
              <ProgrammeCard 
                key={programme.id_programme} 
                programme={programme} 
                onView={(programme) => setSelectedProgramme(programme)}
                onViewPDF={handleOpenPDF}
              />
            ))}
          </div>
        </TabsContent>

        {uniqueModules.map((module) => (
          <TabsContent key={module.id_module} value={module.id_module.toString()} className="space-y-4">
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                {programmes.filter(p => p.module.id_module === module.id_module).length} برنامج للمادة {module.designation_fr}
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-4">
              {filteredProgrammes
                .filter(programme => programme.module.id_module === module.id_module)
                .map((programme) => (
                  <ProgrammeCard 
                    key={programme.id_programme} 
                    programme={programme} 
                    onView={(programme) => setSelectedProgramme(programme)}
                    onViewPDF={handleOpenPDF}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog de détails */}
      <Dialog open={!!selectedProgramme} onOpenChange={() => setSelectedProgramme(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل البرنامج</DialogTitle>
            <DialogDescription>
              معلومات شاملة عن البرنامج التربوي
            </DialogDescription>
          </DialogHeader>
          
          {selectedProgramme && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    المعلومات العامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">رمز البرنامج</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">{selectedProgramme.code_programme}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">الحالة</Label>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 ml-1" />
                        معتمد
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">العنوان (بالفرنسية)</Label>
                    <p className="text-lg font-semibold">{selectedProgramme.titre_fr}</p>
                  </div>
                  
                  {selectedProgramme.titre_ar && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">العنوان (بالعربية)</Label>
                      <p className="text-lg font-semibold" dir="rtl">{selectedProgramme.titre_ar}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Module */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    المادة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">التسمية</Label>
                      <p className="text-sm">{selectedProgramme.module.designation_fr}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">رمز المادة</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">{selectedProgramme.module.code_module}</p>
                    </div>
                  </div>
                  
                  {selectedProgramme.module.designation_ar && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">التسمية (بالعربية)</Label>
                      <p className="text-sm" dir="rtl">{selectedProgramme.module.designation_ar}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Établissement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    المؤسسة الجهوية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">الاسم</Label>
                    <p className="text-sm">{selectedProgramme.etablissementRegionale.nom_fr}</p>
                  </div>
                  
                  {selectedProgramme.etablissementRegionale.nom_ar && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">الاسم (بالعربية)</Label>
                      <p className="text-sm" dir="rtl">{selectedProgramme.etablissementRegionale.nom_ar}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Observation */}
              {selectedProgramme.observation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      ملاحظة الاعتماد
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-muted p-3 rounded">{selectedProgramme.observation}</p>
                  </CardContent>
                </Card>
              )}

              {/* Métadonnées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    البيانات الوصفية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</Label>
                      <p className="text-sm">{formatDate(selectedProgramme.createdAt)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">آخر تعديل</Label>
                      <p className="text-sm">{formatDate(selectedProgramme.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                {selectedProgramme.fichierpdf && (
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    تحميل PDF
                  </Button>
                )}
              </div>
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
          userRole="Enseignant"
        />
      )}
    </div>
  );
};

interface ProgrammeCardProps {
  programme: Programme;
  onView: (programme: Programme) => void;
  onViewPDF: (programme: Programme) => void;
}

const ProgrammeCard: React.FC<ProgrammeCardProps> = ({ programme, onView, onViewPDF }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{programme.titre_fr}</CardTitle>
            <CardDescription className="text-sm">
              الرمز: {programme.code_programme}
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 ml-1" />
            معتمد
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">المادة</Label>
            <p className="text-sm">{programme.module.designation_fr}</p>
            <p className="text-xs text-muted-foreground">الرمز: {programme.module.code_module}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">المؤسسة</Label>
            <p className="text-sm">{programme.etablissementRegionale.nom_fr}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
                            أنشئ في {formatDate(programme.createdAt)}
          </div>
          
          <div className="flex items-center gap-2">
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
            
            <Button 
              onClick={() => onView(programme)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgrammeConsultation;
