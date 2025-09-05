import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  User, 
  Bell, 
  Settings, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Eye,
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
  LifeBuoy,
  GraduationCap,
  BarChart3
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Principal */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 font-arabic">🎓 المساعدة و الدعم - المتدرب</h1>
          <p className="text-xl opacity-90 font-arabic">
            دليل شامل مخصص للمتدربين في نظام إدارة التدريب المهني
          </p>
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <p className="text-sm font-arabic">✅ هذا الدليل مخصص للمتدربين فقط</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span className="font-arabic">دليل المتدرب</span>
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
      <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
              <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 font-arabic">دليل المتدرب</h2>
          </div>
          <p className="text-green-700 dark:text-green-300 font-arabic">
            هذا الدليل مخصص للمتدربين في نظام إدارة التدريب المهني. يحتوي على جميع المعلومات والخطوات اللازمة لاستخدام النظام بكفاءة.
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
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="w-6 h-6 text-success" />
              <span>الدروس</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-background-secondary font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('memoires')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FileText className="w-6 h-6 text-secondary" />
              <span>المذكرات</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-background-secondary font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <User className="w-6 h-6 text-orange-600" />
              <span>الملف الشخصي</span>
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
                    عرض سريع لإحصائيات البرامج المسجلة والتقدم المحرز
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">معلومات المتدرب</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض تفاصيل حسابك ومعلوماتك الشخصية
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
                    تتبع آخر العمليات والإجراءات والإحصائيات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Section */}
        <Card id="courses">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <BookOpen className="w-5 h-5 text-success dark:text-green-400" />
              </div>
              الدروس
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
                    استعراض جميع الدروس المتاحة في تخصصك مع إمكانية البحث والتصفية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">متابعة التقدم</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    متابعة تقدمك في الدروس المسجلة والإنجازات المحققة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Eye className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">عرض المحتوى</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    معاينة وتحميل الدروس والمواد التعليمية
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memoires Section */}
        <Card id="memoires">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <FileText className="w-5 h-5 text-secondary dark:text-purple-400" />
              </div>
              المذكرات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">مذكرتي</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    إدارة مذكرتك الشخصية مع إمكانية الرفع والتعديل
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Users className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">المذكرات التعاونية</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    استعراض مذكرات الزملاء والتعلم من تجاربهم
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                  <Download className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">تحميل المذكرات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تحميل المذكرات المعتمدة والمراجعة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Management Section */}
        <Card id="profile">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
                    تحديث معلوماتك الشخصية وبيانات الاتصال
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
                    تحميل بياناتك الشخصية والبرامج المسجلة
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
              <h4 className="font-medium mb-2 font-arabic">💡 نصيحة التسجيل</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                تأكد من التسجيل في البرامج المناسبة لتخصصك ومستواك
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">📝 نصيحة المتابعة</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                تابع تقدمك بانتظام وتواصل مع الأساتذة عند الحاجة
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">⏰ نصيحة التنظيم</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                نظم وقتك بشكل جيد لاستكمال جميع المهام المطلوبة
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">🔄 نصيحة التعاون</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                شارك في المناقشات التعاونية وتعلم من تجارب الزملاء
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
            <span>دعم المتدربين</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground dark:text-white font-arabic">الدعم المخصص للمتدربين</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                فريق دعم مخصص للمتدربين - متاح من السبت إلى الخميس من 8:00 إلى 16:00
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Mail className="w-4 h-4" />
                  <span className="font-arabic">البريد الإلكتروني:</span>
                  <span>stagiaires@formation.gov.dz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Phone className="w-4 h-4" />
                  <span className="font-arabic">الهاتف:</span>
                  <span>+213 21 71 23 46</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Clock className="w-4 h-4" />
                  <span className="font-arabic">ساعات العمل:</span>
                  <span>8:00 - 16:00</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground dark:text-white font-arabic">الموارد التعليمية للمتدربين</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                موارد مخصصة لمساعدة المتدربين في رحلتهم التعليمية
              </p>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-primary font-arabic flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4" />
                  دليل المتدرب الشامل →
                </Button>
                <Button variant="link" className="p-0 h-auto text-success font-arabic flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  فيديوهات تعليمية للمتدربين →
                </Button>
                <Button variant="link" className="p-0 h-auto text-secondary font-arabic flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  دعم صوتي مباشر →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4 font-arabic">هل تحتاج إلى مساعدة إضافية كمتدرب؟</h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4 font-arabic">
            فريق الدعم المخصص للمتدربين جاهز لمساعدتك في أي وقت
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" className="font-arabic">
              <Bell className="w-4 h-4 ml-2" />
              دعم المتدربين
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <FileText className="w-4 h-4 ml-2" />
              دليل المتدرب
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <MessageCircle className="w-4 h-4 ml-2" />
              تواصل معنا
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;
