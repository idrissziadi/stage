import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Target, 
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  Bell,
  Eye,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building,
  IdCard,
  UserPlus
} from 'lucide-react';

interface EtablissementStats {
  totalEnseignants: number;
  totalStagiaires: number;
  totalOffres: number;
  totalMemoires: number;
  activeOffres: number;
  pendingInscriptions: number;
  approvedInscriptions: number;
  recentActivities: Activity[];
}

interface Activity {
  id: string;
  type: 'new_registration' | 'new_memoire' | 'offer_created' | 'inscription_approved';
  title: string;
  description: string;
  date: string;
  user?: string;
}

interface EtablissementOverviewProps {
  onTabChange: (tab: string) => void;
}

const EtablissementOverview = ({ onTabChange }: EtablissementOverviewProps) => {
  const { user, userProfile } = useAuthApi();
  const { toast } = useToast();
  const [stats, setStats] = useState<EtablissementStats>({
    totalEnseignants: 0,
    totalStagiaires: 0,
    totalOffres: 0,
    totalMemoires: 0,
    activeOffres: 0,
    pendingInscriptions: 0,
    approvedInscriptions: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set API token when component mounts
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setToken(token);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.id_etab_formation) {
      fetchOverviewData();
    }
  }, [userProfile]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      console.log('Fetching overview data for establishment:', userProfile.id_etab_formation);

      // Fetch establishment-specific data
      const promises = [
        // Get statistics for this establishment
        apiService.getEtablissementStats().catch(error => {
          console.error('Error fetching stats:', error);
          return { data: { stats: {} } };
        }),
        // Get offers for this establishment
        apiService.getOffresByEtablissement(userProfile.id_etab_formation).catch(error => {
          console.error('Error fetching offers:', error);
          return { data: [] };
        })
      ];

      const [statsResponse, offresResponse] = await Promise.all(promises);
      const statsData = statsResponse.data?.stats || {};
      
      // Properly handle the response structure - backend returns { offres: [], total: number }
      let offres = [];
      if (offresResponse.data) {
        if (Array.isArray(offresResponse.data)) {
          offres = offresResponse.data;
        } else if (offresResponse.data.offres && Array.isArray(offresResponse.data.offres)) {
          offres = offresResponse.data.offres;
        } else {
          console.warn('Unexpected offres response structure:', offresResponse.data);
          offres = [];
        }
      }

      console.log('Fetched data:', {
        stats: statsData,
        offres: offres.length,
        offresStructure: typeof offresResponse.data
      });

      // TODO: Replace with real activities from backend when API is available
      // For now, we'll use an empty array until the backend provides activities
      const recentActivities: Activity[] = [];

      // Calculate active offers - ensure offres is an array
      const activeOffres = Array.isArray(offres) ? offres.filter((o: any) => {
        if (!o.date_fin) return true;
        return new Date() < new Date(o.date_fin);
      }).length : 0;

      setStats({
        totalEnseignants: statsData.totalEnseignants || 0,
        totalStagiaires: statsData.totalStagiaires || 0,
        totalOffres: statsData.totalOffres || (Array.isArray(offres) ? offres.length : 0),
        totalMemoires: statsData.totalMemoires || 0,
        activeOffres,
        pendingInscriptions: statsData.totalInscriptions || 0,
        approvedInscriptions: 0, // Will be calculated from inscriptions data later
        recentActivities: recentActivities
      });

    } catch (error) {
      console.error('Error fetching overview data:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'فشل في تحميل بيانات لوحة التحكم. برجاء إعادة المحاولة.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleInArabic = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'مدير',
      'Stagiaire': 'متدرب',
      'Enseignant': 'أستاذ',
      'EtablissementFormation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roleMap[role] || role;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_registration':
        return <UserPlus className="w-4 h-4 text-success" />;
      case 'new_memoire':
        return <FileText className="w-4 h-4 text-primary" />;
      case 'offer_created':
        return <Target className="w-4 h-4 text-secondary" />;
      case 'inscription_approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground dark:text-muted-foreground font-arabic">جارٍ تحميل نظرة عامة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl" dir="rtl">
      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-primary dark:text-blue-400 font-arabic">الأساتذة</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 font-arabic">{stats.totalEnseignants}</p>
                <p className="text-xs text-blue-500 font-arabic">مسجل</p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800/50 rounded-full">
                <GraduationCap className="w-6 h-6 text-primary dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-success dark:text-green-400 font-arabic">المتدربين</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-arabic">{stats.totalStagiaires}</p>
                <p className="text-xs text-green-500 font-arabic">مسجل</p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800/50 rounded-full">
                <Users className="w-6 h-6 text-success dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-secondary dark:text-purple-400 font-arabic">عروض التكوين</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 font-arabic">{stats.totalOffres}</p>
                <p className="text-xs text-purple-500 font-arabic">نشط: {stats.activeOffres}</p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-800/50 rounded-full">
                <Target className="w-6 h-6 text-secondary dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 font-arabic">المذكرات</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 font-arabic">{stats.totalMemoires}</p>
                <p className="text-xs text-orange-500 font-arabic">قيد التتبع</p>
              </div>
              <div className="p-3 bg-orange-200 dark:bg-orange-800/50 rounded-full">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Institution Profile Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Building className="w-5 h-5 text-success dark:text-green-400" />
              </div>
              <span className="font-arabic">معلومات المؤسسة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">رمز المؤسسة</p>
                  <div className="flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground dark:text-white">
                      {userProfile?.code || 'غير محدد'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">اسم المؤسسة</p>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground dark:text-white font-arabic">
                      {userProfile?.nom_ar || userProfile?.nom_fr || 'غير محدد'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">البريد الإلكتروني</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground dark:text-white">
                    {userProfile?.email || 'غير محدد'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">رقم الهاتف</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground dark:text-white">
                    {userProfile?.telephone || 'غير محدد'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">العنوان</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground dark:text-white font-arabic">
                    {userProfile?.adresse_ar || userProfile?.adresse_fr || 'غير محدد'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">الدور</p>
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="secondary" className="font-arabic">
                    {getRoleInArabic(userProfile?.role)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground font-arabic">تاريخ التسجيل</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground dark:text-white font-arabic">
                    {userProfile?.created_at 
                      ? new Date(userProfile.created_at).toLocaleDateString('ar-DZ', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })
                      : 'غير محدد'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary dark:text-blue-400" />
              </div>
              <span className="font-arabic">الإجراءات السريعة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={() => onTabChange('users')}
                className="flex items-center justify-between p-4 h-auto"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div className="text-start-rtl">
                    <p className="font-medium font-arabic">إدارة المستخدمين</p>
                    <p className="text-sm text-muted-foreground font-arabic">إضافة وإدارة الأساتذة والمتدربين</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => onTabChange('offres')}
                className="flex items-center justify-between p-4 h-auto"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-secondary" />
                  <div className="text-start-rtl">
                    <p className="font-medium font-arabic">إدارة العروض</p>
                    <p className="text-sm text-muted-foreground font-arabic">إنشاء وتعديل عروض التكوين</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => onTabChange('memoires')}
                className="flex items-center justify-between p-4 h-auto"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <div className="text-start-rtl">
                    <p className="font-medium font-arabic">إدارة المذكرات</p>
                    <p className="text-sm text-muted-foreground font-arabic">تخصيص ومتابعة المذكرات</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Pending Inscriptions Alert */}
              {stats.pendingInscriptions > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="font-arabic">
                    لديك {stats.pendingInscriptions} طلبات تسجيل في انتظار الموافقة
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">النشاطات الحديثة</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2 font-arabic">لا توجد نشاطات حديثة</h3>
              <p className="text-muted-foreground font-arabic">
                ستظهر النشاطات الحديثة هنا عند توفرها
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivities.map((activity, index) => (
                <div key={index} className="theme-transition-colors flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-background-secondary transition-colors">
                  <div className="theme-transition-colors p-2 bg-muted rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground font-arabic">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground font-arabic">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(activity.date).toLocaleDateString('ar-DZ')}</span>
                      {activity.user && (
                        <>
                          <span>•</span>
                          <span className="font-arabic">{activity.user}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إحصائيات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">{stats.approvedInscriptions}</p>
              <p className="text-sm text-success font-arabic">إجمالي التسجيلات المقبولة</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-700">{stats.pendingInscriptions}</p>
              <p className="text-sm text-orange-600 font-arabic">طلبات التسجيل المعلقة</p>
            </div>
            <div className="theme-transition-colors bg-background-secondary p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{stats.activeOffres}</p>
              <p className="text-sm text-primary font-arabic">عروض التكوين النشطة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EtablissementOverview;