import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  BarChart3, 
  BookOpen, 
  GraduationCap,
  Bell, 
  Settings, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Eye,
  FileText,
  Download,
  Users,
  Target,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  Database,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Upload,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Home,
  Info,
  Lightbulb,
  BookOpen as BookOpenIcon,
  Video,
  Headphones,
  MessageCircle,
  LifeBuoy
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Principal */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 font-arabic">🌍 المساعدة و الدعم - المؤسسة الإقليمية</h1>
          <p className="text-xl opacity-90 font-arabic">
            دليل شامل مخصص للمؤسسات الإقليمية في نظام إدارة التدريب المهني
          </p>
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <p className="text-sm font-arabic">✅ هذا الدليل مخصص للمؤسسات الإقليمية فقط</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span className="font-arabic">دليل المؤسسة الإقليمية</span>
            </div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              <span className="font-arabic">الدعم المخصص</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-arabic">تواصل معنا</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice Important */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-2 border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
              <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 font-arabic">دليل المؤسسة الإقليمية</h2>
          </div>
          <p className="text-indigo-700 dark:text-indigo-300 font-arabic">
            هذا الدليل مخصص للمؤسسات الإقليمية في نظام إدارة التدريب المهني. يحتوي على جميع المعلومات والخطوات اللازمة لإدارة البنية التحتية والبرامج في منطقتك.
          </p>
        </CardContent>
      </Card>

      {/* Navigation Rapide */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <CardTitle className="text-center font-arabic flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            التنقل السريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-background-secondary font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BarChart3 className="w-6 h-6 text-primary" />
              <span>نظرة عامة</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-background-secondary font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('infrastructure')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Building className="w-6 h-6 text-success" />
              <span>البنية التحتية</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-background-secondary font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="w-6 h-6 text-secondary" />
              <span>إدارة الدروس</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-background-secondary font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <GraduationCap className="w-6 h-6 text-orange-600" />
              <span>إدارة البرامج</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guide Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overview Section */}
        <Card id="overview">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary dark:text-blue-400" />
              </div>
              نظرة عامة - الصفحة الرئيسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">لوحة المعلومات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض سريع لإحصائيات البنية التحتية والفروع والتخصصات في منطقتك
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Building className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">معلومات المؤسسة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض تفاصيل مؤسستك ومعلومات الاتصال والموقع الجغرافي
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">الأنشطة الأخيرة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تتبع آخر العمليات والإجراءات والإحصائيات في منطقتك
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Section */}
        <Card id="infrastructure">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Building className="w-5 h-5 text-success dark:text-green-400" />
              </div>
              البنية التحتية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Building className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">استكشاف الفروع</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تصفح الفروع والتخصصات والمواد في منطقتك مع إمكانية البحث والتصفية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Eye className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">عرض التفاصيل</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    استعراض معلومات مفصلة عن كل فرع وتخصص مع الإحصائيات
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Target className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">التنقل السهل</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    استخدام نظام التنقل بالخطوات للوصول السريع للمعلومات المطلوبة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Management Section */}
        <Card id="courses">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <BookOpen className="w-5 h-5 text-secondary dark:text-purple-400" />
              </div>
              إدارة الدروس
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">عرض الدروس</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    استعراض جميع الدروس المتاحة في منطقتك مع إمكانية البحث والتصفية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">متابعة الحالة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    متابعة حالة الدروس والمعتمدة والمرفوضة مع التفاصيل الكاملة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إدارة المتدربين</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    متابعة المتدربين المسجلين في منطقتك وإحصائياتهم
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Management Section */}
        <Card id="programs">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              إدارة البرامج
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إنشاء البرامج</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    إنشاء برامج تدريبية جديدة مع رفع ملفات PDF والتفاصيل الكاملة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">متابعة الاعتماد</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    متابعة حالة اعتماد البرامج من الإدارة الوطنية مع التفاصيل
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Download className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">رفع الملفات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    رفع ملفات PDF للبرامج التدريبية مع إمكانية المعاينة والتحميل
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Management Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Settings className="w-5 h-5 text-primary dark:text-indigo-400" />
              </div>
              إدارة الملف الشخصي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">تعديل المعلومات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تحديث معلومات المؤسسة وبيانات الاتصال والعنوان
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Bell className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إعدادات الإشعارات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تخصيص إعدادات الإشعارات حسب احتياجاتك
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Download className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">تصدير البيانات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تحميل بيانات المؤسسة والبرامج والإحصائيات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help and Support Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <HelpCircle className="w-5 h-5 text-error dark:text-red-400" />
              </div>
              المساعدة والدعم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded">
                  <HelpCircle className="w-4 h-4 text-error" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">الدليل الشامل</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    دليل مفصل لجميع الميزات والوظائف مع أمثلة عملية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">مركز الإشعارات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض جميع الإشعارات والتنبيهات المهمة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Users className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">الدعم الفني</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    التواصل مع فريق الدعم الفني للمساعدة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conseils Rapides */}
      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-arabic">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-warning dark:text-yellow-400" />
            </div>
            نصائح سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">💡 نصيحة البرامج</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                تأكد من أن ملفات PDF لا تتجاوز 10 ميجابايت وأن المحتوى واضح ومقروء
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">📝 نصيحة التنظيم</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                نظم البرامج حسب التخصصات والفروع لتسهيل عملية البحث والتنظيم
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">⏰ نصيحة المتابعة</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                تابع حالة البرامج بانتظام وتواصل مع الإدارة الوطنية في حالة التأخير
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">🔄 نصيحة التحديث</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                يمكن إعادة رفع البرنامج في حالة الرفض مع مراعاة ملاحظات المراجع
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>دعم المؤسسات الإقليمية</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground dark:text-white font-arabic">الدعم المخصص للمؤسسات الإقليمية</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                فريق دعم مخصص للمؤسسات الإقليمية - متاح من الأحد إلى الخميس من 8:00 إلى 17:30
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Mail className="w-4 h-4" />
                  <span className="font-arabic">البريد الإلكتروني:</span>
                  <span>regionale@formation.gov.dz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Phone className="w-4 h-4" />
                  <span className="font-arabic">الهاتف:</span>
                  <span>+213 21 71 23 49</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Clock className="w-4 h-4" />
                  <span className="font-arabic">ساعات العمل:</span>
                  <span>8:00 - 17:30</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground dark:text-white font-arabic">الموارد الإدارية للمؤسسات الإقليمية</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                موارد مخصصة لمساعدة المؤسسات الإقليمية في إدارة البنية التحتية والبرامج
              </p>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-primary font-arabic flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4" />
                  دليل المؤسسة الإقليمية الشامل →
                </Button>
                <Button variant="link" className="p-0 h-auto text-success font-arabic flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  فيديوهات إدارية للمؤسسات الإقليمية →
                </Button>
                <Button variant="link" className="p-0 h-auto text-secondary font-arabic flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  دعم إقليمي مباشر →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4 font-arabic">هل تحتاج إلى مساعدة إضافية كمؤسسة إقليمية؟</h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4 font-arabic">
            فريق الدعم المخصص للمؤسسات الإقليمية جاهز لمساعدتك في أي وقت
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" className="font-arabic">
              <Bell className="w-4 h-4 ml-2" />
              دعم المؤسسات الإقليمية
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <FileText className="w-4 h-4 ml-2" />
              دليل المؤسسة الإقليمية
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <MessageCircle className="w-4 h-4 ml-2" />
              تواصل معنا
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer avec Informations Utiles */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div>
              <h4 className="font-medium mb-2 font-arabic">ساعات العمل</h4>
              <p className="text-sm opacity-80 font-arabic">
                الأحد - الخميس: 8:00 - 16:00<br />
                الجمعة - السبت: مغلق
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 font-arabic">وقت الاستجابة</h4>
              <p className="text-sm opacity-80 font-arabic">
                البريد الإلكتروني: خلال 24 ساعة<br />
                الهاتف: فوري
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 font-arabic">الطوارئ</h4>
              <p className="text-sm opacity-80 font-arabic">
                للمشاكل العاجلة<br />
                اتصل: +213 21 71 23 45
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;
