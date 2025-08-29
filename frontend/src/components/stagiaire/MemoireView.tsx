import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Memoire {
  id_memoire: string;
  titre_fr: string;
  titre_ar: string;
  fichierpdf: string;
  status: string;
  observation: string;
  stagiaire: {
    nom_fr: string;
    prenom_fr: string;
  };
  enseignant: {
    nom_fr: string;
    prenom_fr: string;
  };
}

const MemoireView = () => {
  const [monMemoire, setMonMemoire] = useState<Memoire | null>(null);
  const [autresMemoires, setAutresMemoires] = useState<Memoire[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && userProfile) {
      fetchMemoires();
    }
  }, [user, userProfile]);

  const fetchMemoires = async () => {
    try {
      // Récupérer mon mémoire
      const { data: monMemoireData, error: monMemoireError } = await supabase
        .from('memoire')
        .select(`
          id_memoire,
          titre_fr,
          titre_ar,
          fichierpdf,
          status,
          observation,
          stagiaire:id_stagiaire(
            nom_fr,
            prenom_fr
          ),
          enseignant:id_enseignant(
            nom_fr,
            prenom_fr
          )
        `)
        .eq('id_stagiaire', user?.id)
        .maybeSingle();

      if (monMemoireError && monMemoireError.code !== 'PGRST116') throw monMemoireError;
      setMonMemoire(monMemoireData);

      // Récupérer les mémoires d'autres stagiaires de même spécialité
      const { data: autresMemoiresData, error: autresMemoiresError } = await supabase
        .from('memoire')
        .select(`
          id_memoire,
          titre_fr,
          titre_ar,
          fichierpdf,
          status,
          observation,
          stagiaire:id_stagiaire(
            nom_fr,
            prenom_fr
          ),
          enseignant:id_enseignant(
            nom_fr,
            prenom_fr
          )
        `)
        .neq('id_stagiaire', user?.id)
        .eq('status', 'مقبول');

      if (autresMemoiresError) throw autresMemoiresError;
      setAutresMemoires(autresMemoiresData || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل المذكرات",
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
      case 'مقدم':
        return 'bg-info text-white';
      case 'قيد المراجعة':
        return 'bg-warning text-white';
      case 'مرفوض':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted';
    }
  };

  const renderMemoireCard = (memoire: Memoire, isOwn: boolean = false) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {memoire.titre_ar || memoire.titre_fr}
          </CardTitle>
          <Badge className={getStatusColor(memoire.status)}>
            {memoire.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          الطالب: {memoire.stagiaire?.nom_fr} {memoire.stagiaire?.prenom_fr}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {memoire.enseignant && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>المشرف: {memoire.enseignant.nom_fr} {memoire.enseignant.prenom_fr}</span>
          </div>
        )}

        {memoire.observation && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>ملاحظات:</strong> {memoire.observation}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {memoire.fichierpdf && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              عرض PDF
            </Button>
          )}
          <Button 
            size="sm" 
            variant="secondary"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
        <h1 className="text-3xl font-bold text-foreground">المذكرات</h1>
      </div>

      <Tabs defaultValue="my-memoire" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-memoire">مذكرتي</TabsTrigger>
          <TabsTrigger value="other-memoires">مذكرات أخرى</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-memoire" className="space-y-6 mt-6">
          {monMemoire ? (
            <div className="grid gap-6">
              {renderMemoireCard(monMemoire, true)}
            </div>
          ) : (
            <Card className="text-center p-12">
              <div className="space-y-4">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">لا توجد مذكرة</h3>
                  <p className="text-muted-foreground">
                    لم يتم إنشاء مذكرة لك بعد. يجب أن تنتظر حتى تقوم مؤسسة التكوين بإنشاء مذكرة لك وتعيين مشرف.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="other-memoires" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">مذكرات الطلاب الآخرين</h2>
            <Badge variant="secondary" className="px-4 py-2">
              {autresMemoires.length} مذكرة متاحة
            </Badge>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {autresMemoires.map((memoireItem) => (
              <div key={memoireItem.id_memoire}>
                {renderMemoireCard(memoireItem)}
              </div>
            ))}
          </div>

          {autresMemoires.length === 0 && (
            <Card className="text-center p-12">
              <div className="space-y-4">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">لا توجد مذكرات أخرى</h3>
                  <p className="text-muted-foreground">
                    لم يتم العثور على مذكرات أخرى من نفس التخصص
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemoireView;