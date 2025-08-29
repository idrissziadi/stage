import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Cours {
  id_cours: number;
  code_cours: string;
  titre_fr: string;
  titre_ar: string;
  fichierpdf: string;
  status: string;
  observation: string;
  module: {
    designation_fr: string;
    designation_ar: string;
  };
  enseignant: {
    nom_fr: string;
    prenom_fr: string;
  };
}

const CoursView = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCours();
    }
  }, [user]);

  const fetchCours = async () => {
    try {
      // Récupérer les cours pour les modules auxquels le stagiaire est inscrit
      const { data, error } = await supabase
        .from('cours')
        .select(`
          id_cours,
          code_cours,
          titre_fr,
          titre_ar,
          fichierpdf,
          status,
          observation,
          module:id_module(
            designation_fr,
            designation_ar
          ),
          enseignant:id_enseignant(
            nom_fr,
            prenom_fr
          )
        `)
        .eq('status', 'مقبول');

      if (error) throw error;
      setCours(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الدروس",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول':
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
        <h1 className="text-3xl font-bold text-foreground">دروسي</h1>
        <Badge variant="secondary" className="px-4 py-2">
          {cours.length} درس متاح
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cours.map((coursItem) => (
          <Card 
            key={coursItem.id_cours} 
            className="group hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {coursItem.titre_ar || coursItem.titre_fr}
                </CardTitle>
                <Badge className={getStatusColor(coursItem.status)}>
                  {coursItem.status}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                كود الدرس: {coursItem.code_cours}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  المقياس: {coursItem.module?.designation_ar || coursItem.module?.designation_fr}
                </p>
                {coursItem.enseignant && (
                  <p className="text-sm text-muted-foreground">
                    الأستاذ: {coursItem.enseignant.nom_fr} {coursItem.enseignant.prenom_fr}
                  </p>
                )}
              </div>

              {coursItem.observation && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>ملاحظات:</strong> {coursItem.observation}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {coursItem.fichierpdf && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
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

      {cours.length === 0 && (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">لا توجد دروس متاحة</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على أي دروس للمقاييس المسجل بها
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CoursView;