import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  BookOpen, 
  FileText, 
  Users, 
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  Bell,
  Eye,
  Download,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building,
  IdCard
} from 'lucide-react';

interface OverviewStats {
  totalCourses: number;
  totalMemoires: number;
  myMemoire: any | null;
  specializations: number;
  collaborativeMemoires: number;
  inscriptions: any[];
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface StagiaireOverviewProps {
  onTabChange: (tab: string) => void;
}

const StagiaireOverview = ({ onTabChange }: StagiaireOverviewProps) => {
  const { user, userProfile } = useAuthApi();
  const { toast } = useToast();
  const [stats, setStats] = useState<OverviewStats>({
    totalCourses: 0,
    totalMemoires: 0,
    myMemoire: null,
    specializations: 0,
    collaborativeMemoires: 0,
    inscriptions: []
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set API token when component mounts
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setToken(token);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.id_stagiaire) {
      fetchOverviewData();
    }
  }, [userProfile]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      console.log('Fetching overview data for stagiaire:', userProfile.id_stagiaire);

      // Fetch all data in parallel with error handling for each
      const promises = [
        apiService.getCoursByStagiaire(userProfile.id_stagiaire.toString()).catch(error => {
          console.error('Error fetching courses:', error);
          return { data: [] };
        }),
        apiService.getMemoiresCollaboratifsByStagiaire(userProfile.id_stagiaire.toString()).catch(error => {
          console.error('Error fetching collaborative memoires:', error);
          return { data: [] };
        }),
        apiService.getMemoiresByStagiaire(userProfile.id_stagiaire.toString()).catch(error => {
          console.error('Error fetching my memoires:', error);
          return { data: [] };
        }),
        apiService.getInscriptionsByStagiaire(userProfile.id_stagiaire.toString()).catch(error => {
          console.error('Error fetching inscriptions:', error);
          return { data: [] };
        })
      ];

      const [
        coursesResponse,
        collaborativeMemoiresResponse,
        myMemoireResponse,
        inscriptionsResponse
      ] = await Promise.all(promises);

      // Handle both old format (array) and new format (object)
      let courses;
      if (Array.isArray(coursesResponse.data)) {
        // Old format - backward compatibility
        courses = coursesResponse.data;
      } else {
        // New format
        courses = coursesResponse.data?.courses || [];
      }
      const collaborativeMemoires = collaborativeMemoiresResponse.data || [];
      const myMemoires = myMemoireResponse.data || [];
      const inscriptions = inscriptionsResponse.data || [];

      console.log('Raw courses response:', coursesResponse.data);
      console.log('Processed courses:', courses);
      console.log('Fetched data:', {
        courses: courses.length,
        collaborativeMemoires: collaborativeMemoires.length,
        myMemoires: myMemoires.length,
        inscriptions: inscriptions.length
      });

      // Get unique specializations
      const uniqueSpecializations = new Set();
      inscriptions.forEach((inscription: any) => {
        if (inscription.offre?.specialite) {
          uniqueSpecializations.add(inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr);
        }
      });

      const newStats = {
        totalCourses: courses.length,
        totalMemoires: collaborativeMemoires.length,
        myMemoire: myMemoires.length > 0 ? myMemoires[0] : null,
        specializations: uniqueSpecializations.size,
        collaborativeMemoires: collaborativeMemoires.length,
        inscriptions
      };
      
      console.log('Setting stats with totalCourses:', newStats.totalCourses);
      setStats(newStats);

      // Generate notifications
      generateNotifications(myMemoires, courses, inscriptions);

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

  const generateNotifications = (myMemoires: any[], courses: any[], inscriptions: any[]) => {
    const newNotifications: Notification[] = [];

    // Check memoire status
    if (myMemoires.length === 0) {
      newNotifications.push({
        id: 'no-memoire',
        type: 'info',
        title: 'لا توجد مذكرة مخصصة',
        message: 'لم يتم تخصيص مذكرة لك بعد من قبل مؤسسة التكوين',
        date: new Date().toISOString(),
        action: {
          label: 'عرض التفاصيل',
          onClick: () => onTabChange('memoire')
        }
      });
    } else {
      const memoire = myMemoires[0];
      if (memoire.status === 'قيد المراجعة') {
        newNotifications.push({
          id: 'memoire-review',
          type: 'warning',
          title: 'مذكرتك قيد المراجعة',
          message: 'مذكرتك حاليا قيد المراجعة من قبل المشرف',
          date: memoire.updated_at || memoire.created_at,
          action: {
            label: 'عرض المذكرة',
            onClick: () => onTabChange('memoire')
          }
        });
      } else if (memoire.status === 'مقبول') {
        newNotifications.push({
          id: 'memoire-approved',
          type: 'success',
          title: 'تم قبول مذكرتك',
          message: 'تهانينا! تم قبول مذكرتك من قبل المشرف',
          date: memoire.updated_at || memoire.created_at,
          action: {
            label: 'عرض المذكرة',
            onClick: () => onTabChange('memoire')
          }
        });
      } else if (!memoire.fichierpdf) {
        newNotifications.push({
          id: 'memoire-upload',
          type: 'warning',
          title: 'لم يتم رفع ملف المذكرة',
          message: 'يرجى رفع ملف PDF لمذكرتك لبدء عملية المراجعة',
          date: memoire.created_at,
          action: {
            label: 'رفع الملف',
            onClick: () => onTabChange('memoire')
          }
        });
      }
    }

    // Check if there are new courses available
    if (courses.length > 0) {
      const recentCourses = courses.filter((course: any) => {
        const courseDate = new Date(course.created_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return courseDate > oneWeekAgo;
      });

      if (recentCourses.length > 0) {
        newNotifications.push({
          id: 'new-courses',
          type: 'info',
          title: 'دروس جديدة متاحة',
          message: `تم إضافة ${recentCourses.length} دروس جديدة لدروس المتاحة`,
          date: new Date().toISOString(),
          action: {
            label: 'عرض الدروس',
            onClick: () => onTabChange('courses')
          }
        });
      }
    }

    setNotifications(newNotifications);
  };

  const getRoleInArabic = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'مدير',
      'Stagiaire': 'متدرب',
      'enseignant': 'أستاذ',
      'etablissement_formation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل نظرة عامة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 font-arabic">التخصصات</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 font-arabic">{stats.specializations}</p>
                <p className="text-xs text-blue-500 font-arabic">المسجل بها</p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800/50 rounded-full">
                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 font-arabic">الدروس المتاحة</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-arabic">
                  {stats.totalCourses !== undefined ? stats.totalCourses : '...'}
                </p>
                <p className="text-xs text-green-500 font-arabic">لدروس المتاحة</p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800/50 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 font-arabic">مذكرات الزملاء</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 font-arabic">{stats.collaborativeMemoires}</p>
                <p className="text-xs text-purple-500 font-arabic">متاحة للاطلاع</p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-800/50 rounded-full">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-s-rtl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-start-rtl">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 font-arabic">مذكرتي</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 font-arabic">
                    {stats.myMemoire ? '1' : '0'}
                  </p>
                  {stats.myMemoire && (
                    <Badge 
                      variant={stats.myMemoire.status === 'مقبول' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {stats.myMemoire.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-orange-500 font-arabic">
                  {stats.myMemoire ? 'مخصصة' : 'غير مخصصة'}
                </p>
              </div>
              <div className="p-3 bg-orange-200 dark:bg-orange-800/50 rounded-full">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-arabic">معلومات الملف الشخصي</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">المعلومات الأساسية</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">اسم المستخدم</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{userProfile?.username || 'غير محدد'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الاسم الكامل بالفرنسية</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userProfile?.prenom_fr && userProfile?.nom_fr 
                      ? `${userProfile.prenom_fr} ${userProfile.nom_fr}`
                      : 'غير محدد'
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الاسم الكامل بالعربية</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                    {userProfile?.prenom_ar && userProfile?.nom_ar 
                      ? `${userProfile.prenom_ar} ${userProfile.nom_ar}`
                      : 'غير محدد'
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ الميلاد</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
                      {userProfile?.date_naissance 
                        ? new Date(userProfile.date_naissance).toLocaleDateString('ar-DZ', {
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
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">معلومات الاتصال</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">البريد الإلكتروني</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userProfile?.email || 'غير محدد'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">رقم الهاتف</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userProfile?.telephone || 'غير محدد'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">الدور</p>
                  <div className="flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-gray-500" />
                    <Badge variant="secondary" className="font-arabic">
                      {getRoleInArabic(userProfile?.role)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ التسجيل</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white font-arabic">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Registration Information */}
      <Card>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-arabic">معلومات التسجيل</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {stats.inscriptions.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد تسجيلات</h3>
                <p className="text-gray-600 font-arabic">
                  لم يتم العثور على أي تسجيلات في عروض التكوين
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header with total count */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">معلومات عروض التكوين</h3>
                  <Badge variant="outline" className="font-arabic">
                    {stats.inscriptions.length} {stats.inscriptions.length === 1 ? 'تسجيل' : 'تسجيلات'}
                  </Badge>
                </div>
                
                {/* Multiple Inscriptions Display */}
                <div className="space-y-4">
                  {stats.inscriptions.map((inscription: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                      {/* Inscription Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 font-arabic mb-1">
                              {inscription.offre?.designation_ar || inscription.offre?.designation_fr || 'عرض تكوين'}
                            </h4>
                            {inscription.offre?.designation_fr && inscription.offre?.designation_ar && (
                              <p className="text-sm text-gray-600">{inscription.offre.designation_fr}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={inscription.statut === 'acceptee' ? 'default' : 'secondary'} className="font-arabic">
                              {inscription.statut === 'acceptee' ? 'مقبول' : 
                               inscription.statut === 'en_attente' ? 'في الانتظار' :
                               inscription.statut === 'refusee' ? 'مرفوض' : 'ملغى'}
                            </Badge>
                            <Badge variant="outline" className="font-arabic">
                              تسجيل #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Inscription Content */}
                      <div className="p-4 space-y-3">

                        {/* Specialization Information */}
                        {inscription.offre?.specialite && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <GraduationCap className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-800 font-arabic">التخصص:</span>
                            </div>
                            <p className="text-blue-800 font-arabic">
                              {inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr}
                            </p>
                            {inscription.offre.specialite.designation_fr && inscription.offre.specialite.designation_ar && (
                              <p className="text-sm text-blue-600 mt-1">{inscription.offre.specialite.designation_fr}</p>
                            )}
                          </div>
                        )}

                        {/* Training Institution */}
                        {inscription.offre?.etablissementFormation && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-800 font-arabic">مؤسسة التكوين:</span>
                            </div>
                            <p className="text-green-800 font-arabic">
                              {inscription.offre.etablissementFormation.nom_ar || inscription.offre.etablissementFormation.nom_fr}
                            </p>
                            {inscription.offre.etablissementFormation.nom_fr && inscription.offre.etablissementFormation.nom_ar && (
                              <p className="text-sm text-green-600 mt-1">{inscription.offre.etablissementFormation.nom_fr}</p>
                            )}
                          </div>
                        )}

                        {/* Formation Mode and Diploma */}
                        <div className="grid gap-3 md:grid-cols-2">
                          {inscription.offre?.modeFormation && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <GraduationCap className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-purple-800 font-arabic">نمط التكوين:</span>
                              </div>
                              <p className="text-purple-800 font-arabic">
                                {inscription.offre.modeFormation.designation_ar || inscription.offre.modeFormation.designation_fr}
                              </p>
                              {inscription.offre.modeFormation.designation_fr && inscription.offre.modeFormation.designation_ar && (
                                <p className="text-sm text-purple-600 mt-1">{inscription.offre.modeFormation.designation_fr}</p>
                              )}
                            </div>
                          )}
                          
                          {inscription.offre?.diplome && (
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-orange-800 font-arabic">الدبلوم:</span>
                              </div>
                              <p className="text-orange-800 font-arabic">
                                {inscription.offre.diplome.designation_ar || inscription.offre.diplome.designation_fr}
                              </p>
                              {inscription.offre.diplome.designation_fr && inscription.offre.diplome.designation_ar && (
                                <p className="text-sm text-orange-600 mt-1">{inscription.offre.diplome.designation_fr}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Registration Details */}
                        <div className="grid gap-2 md:grid-cols-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium font-arabic">تاريخ التسجيل:</span>
                            <span>{new Date(inscription.created_at || inscription.date_inscription).toLocaleDateString('ar-DZ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium font-arabic">حالة التسجيل:</span>
                            <Badge variant={inscription.statut === 'acceptee' ? 'default' : 'secondary'} className="font-arabic">
                              {inscription.statut === 'acceptee' ? 'مقبول' : 
                               inscription.statut === 'en_attente' ? 'في الانتظار' :
                               inscription.statut === 'refusee' ? 'مرفوض' : 'ملغى'}
                            </Badge>
                          </div>
                          {inscription.numero_inscription && (
                            <div className="flex items-center gap-2">
                              <IdCard className="w-4 h-4" />
                              <span className="font-medium font-arabic">رقم التسجيل:</span>
                              <span className="font-mono">{inscription.numero_inscription}</span>
                            </div>
                          )}
                        </div>

                        {/* Training Offer Description */}
                        {inscription.offre?.description && (
                          <div className="bg-gray-50 p-3 rounded-lg mt-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium font-arabic">وصف عرض التكوين:</span> {inscription.offre.description}
                            </p>
                          </div>
                        )}

                        {/* Training Dates */}
                        {(inscription.offre?.date_debut || inscription.offre?.date_fin) && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-yellow-600" />
                              <span className="font-medium text-yellow-800 font-arabic">فترة التكوين:</span>
                            </div>
                            <div className="text-yellow-800 text-sm">
                              {inscription.offre.date_debut && (
                                <span className="font-arabic">من {new Date(inscription.offre.date_debut).toLocaleDateString('ar-DZ')}</span>
                              )}
                              {inscription.offre.date_fin && (
                                <span className="font-arabic"> إلى {new Date(inscription.offre.date_fin).toLocaleDateString('ar-DZ')}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary Statistics */}
                <div className="border-t pt-4">
                  <div className="grid gap-3 md:grid-cols-3 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">{stats.inscriptions.length}</p>
                      <p className="text-sm text-blue-600 font-arabic">عروض تكوين</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">{stats.specializations}</p>
                      <p className="text-sm text-green-600 font-arabic">تخصصات</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-orange-700">
                        {stats.inscriptions.filter((i: any) => i.statut === 'acceptee').length}
                      </p>
                      <p className="text-sm text-orange-600 font-arabic">مقبولة</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      {/* My Memoire Status */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">حالة مذكرتي</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.myMemoire ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {stats.myMemoire.titre_ar || stats.myMemoire.titre_fr || 'مذكرة بدون عنوان'}
                  </h3>
                  <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">الحالة:</span>
                      <Badge variant={stats.myMemoire.status === 'مقبول' ? 'default' : 'secondary'}>
                        {stats.myMemoire.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">تاريخ الإنشاء:</span>
                      {new Date(stats.myMemoire.created_at).toLocaleDateString('ar-DZ')}
                    </div>
                  </div>
                  {stats.myMemoire.observation && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm"><span className="font-medium">الملاحظات:</span> {stats.myMemoire.observation}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => onTabChange('memoire')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    إدارة المذكرة
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد مذكرة مخصصة</h3>
              <p className="text-gray-600 mb-4 font-arabic">
                لم يتم تخصيص مذكرة لك بعد من قبل مؤسسة التكوين. 
                سيتم إشعارك عند تخصيص مذكرة لك وتعيين مشرف.
              </p>
              <Button
                variant="outline"
                onClick={() => onTabChange('memoire')}
              >
                عرض التفاصيل
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StagiaireOverview;