import { useState } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import CoursManagement from './CoursManagement';
import ProgrammeView from './ProgrammeView';

const Dashboard = () => {
  const { userProfile } = useAuthApi();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour la démonstration
  const stats = {
    totalCours: 45,
    coursApprouves: 32,
    coursEnAttente: 8,
    coursRejetes: 5,
    totalProgrammes: 12,
    specialites: 8,
    branches: 4,
    enseignants: 25,
    etudiants: 320
  };

  const etablissementInfo = {
    nom: 'مؤسسة تعليمية إقليمية',
    adresse: '123 شارع التعليم، المدينة',
    telephone: '+213 123 456 789',
    email: 'contact@etab-regional.dz',
    website: 'www.etab-regional.dz',
    dateCreation: '2020',
    directeur: 'أحمد بن علي',
    region: 'الجزائر العاصمة'
  };

  const etablissementsParticipants = [
    { nom: 'مؤسسة تعليمية 1', region: 'الجزائر العاصمة', status: 'نشط' },
    { nom: 'مؤسسة تعليمية 2', region: 'وهران', status: 'نشط' },
    { nom: 'مؤسسة تعليمية 3', region: 'قسنطينة', status: 'معلق' }
  ];

  return (
    <div className="space-y-6 rtl">
      {/* Header Principal */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Building className="w-8 h-8 text-primary dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground dark:text-white font-arabic">
                {etablissementInfo.nom}
              </h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                لوحة التحكم - إدارة المؤسسة التعليمية الإقليمية
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Navigation par Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/50 dark:data-[state=active]:text-blue-300"
          >
            <Building className="w-4 h-4" />
            <span className="font-arabic">نظرة عامة</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="cours" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/50 dark:data-[state=active]:text-green-300"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-arabic">الدروس</span>
            <Badge variant="secondary" className="ml-1">{stats.totalCours}</Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="programmes" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="font-arabic">البرامج</span>
            <Badge variant="secondary" className="ml-1">{stats.totalProgrammes}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Contenu de l'onglet "نظرة عامة" */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques Principales */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary dark:text-blue-400 font-arabic">إجمالي الدروس</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalCours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-success dark:text-green-400 font-arabic">الدروس المقبولة</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.coursApprouves}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warning dark:text-yellow-400 font-arabic">في الانتظار</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.coursEnAttente}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary dark:text-purple-400 font-arabic">البرامج</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.totalProgrammes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations de l'Établissement */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-arabic">
                  <Building className="w-5 h-5 text-primary" />
                  معلومات المؤسسة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">{etablissementInfo.adresse}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">{etablissementInfo.telephone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">{etablissementInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">{etablissementInfo.website}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                      تاريخ الإنشاء: {etablissementInfo.dateCreation}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                      المدير: {etablissementInfo.directeur}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-arabic">
                  <TrendingUp className="w-5 h-5 text-success" />
                  إحصائيات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="theme-transition-colors flex items-center justify-between p-3 bg-background-secondary dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">التخصصات</span>
                    <Badge variant="secondary">{stats.specialites}</Badge>
                  </div>
                  <div className="theme-transition-colors flex items-center justify-between p-3 bg-background-secondary dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">الفروع</span>
                    <Badge variant="secondary">{stats.branches}</Badge>
                  </div>
                  <div className="theme-transition-colors flex items-center justify-between p-3 bg-background-secondary dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">الأساتذة</span>
                    <Badge variant="secondary">{stats.enseignants}</Badge>
                  </div>
                  <div className="theme-transition-colors flex items-center justify-between p-3 bg-background-secondary dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">الطلاب</span>
                    <Badge variant="secondary">{stats.etudiants}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Établissements Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-arabic">
                <Users className="w-5 h-5 text-secondary" />
                المؤسسات المشاركة ({etablissementsParticipants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {etablissementsParticipants.map((etab, index) => (
                  <div key={index} className="border border-border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground dark:text-white font-arabic">
                        {etab.nom}
                      </h3>
                      <Badge 
                        variant={etab.status === 'نشط' ? 'default' : 'secondary'}
                        className={etab.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {etab.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                      {etab.region}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenu de l'onglet "الدروس" */}
        <TabsContent value="cours" className="space-y-6">
          <CoursManagement />
        </TabsContent>

        {/* Contenu de l'onglet "البرامج" */}
        <TabsContent value="programmes" className="space-y-6">
          <ProgrammeView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
