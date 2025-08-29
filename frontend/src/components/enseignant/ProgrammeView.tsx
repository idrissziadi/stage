import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Programme {
  id_programme: number;
  code_programme: string;
  titre_fr: string;
  titre_ar: string;
  fichierpdf: string;
  status: string;
  observation: string;
  module: {
    designation_fr: string;
    designation_ar: string;
    code_module: string;
  };
  etablissementregionale: {
    nom_fr: string;
    nom_ar: string;
  };
}

const ProgrammeView = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuthApi();
  const { toast } = useToast();

  useEffect(() => {
    if (user && userProfile) {
      fetchProgrammes();
    }
  }, [user, userProfile]);

  const fetchProgrammes = async () => {
    try {
      // Récupérer les programmes pour l'enseignant via l'API backend
      const { data, error } = await apiService.getProgrammesByEnseignant(userProfile.id_enseignant);

      if (error) throw error;
      setProgrammes(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل البرامج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'موافق عليه':
        return 'bg-success text-white';
      case 'في_الانتظار':
        return 'bg-warning text-white';
      case 'مرفوض':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse-custom">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">برامج المقاييس</h1>
        <Badge variant="secondary" className="px-4 py-2">
          {programmes.length} برنامج متاح
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programmes.map((programme) => (
          <Card 
            key={programme.id_programme} 
            className="group hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {programme.titre_ar || programme.titre_fr}
                </CardTitle>
                <Badge className={getStatusColor(programme.status)}>
                  {programme.status}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                كود البرنامج: {programme.code_programme}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {programme.module?.designation_ar || programme.module?.designation_fr}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  كود المقياس: {programme.module?.code_module}
                </p>
                {programme.etablissementregionale && (
                  <p className="text-sm text-muted-foreground">
                    المؤسسة: {programme.etablissementregionale.nom_ar || programme.etablissementregionale.nom_fr}
                  </p>
                )}
              </div>

              {programme.observation && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>ملاحظات:</strong> {programme.observation}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {programme.fichierpdf && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => window.open(getFileUrl(programme.fichierpdf, 'programmes'), '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل PDF
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  عرض التفاصيل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programmes.length === 0 && (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">لا توجد برامج متاحة</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على أي برامج للمقاييس التي تدرسها
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProgrammeView;