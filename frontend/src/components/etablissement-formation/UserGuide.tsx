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
  LifeBuoy,
  School,
  UserCheck,
  FileCheck
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Principal */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 font-arabic">المساعدة و الدعم</h1>
          <p className="text-xl opacity-90 font-arabic">
            دليل شامل لاستخدام نظام إدارة التدريب - مؤسسة التكوين
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span className="font-arabic">دليل الاستخدام</span>
            </div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              <span className="font-arabic">الدعم الفني</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-arabic">اتصل بنا</span>
            </div>
          </div>
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
              className="w-full bg-white hover:bg-gray-50 font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span>نظرة عامة</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-white hover:bg-gray-50 font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <GraduationCap className="w-6 h-6 text-green-600" />
              <span>إدارة البرامج</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-white hover:bg-gray-50 font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('teachers')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Users className="w-6 h-6 text-purple-600" />
              <span>إدارة الأساتذة</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-white hover:bg-gray-50 font-arabic h-auto py-4 flex flex-col gap-2"
              onClick={() => document.getElementById('students')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <School className="w-6 h-6 text-orange-600" />
              <span>إدارة المتدربين</span>
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
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              نظرة عامة - الصفحة الرئيسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">لوحة المعلومات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    عرض سريع لإحصائيات البرامج والأساتذة والمتدربين
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">معلومات المؤسسة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    عرض تفاصيل مؤسستك ومعلومات الاتصال
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">الأنشطة الأخيرة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    تتبع آخر العمليات والإجراءات والإحصائيات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Management Section */}
        <Card id="programs">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              إدارة البرامج
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">إنشاء البرامج</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    إنشاء برامج تدريبية جديدة مع تحديد التخصصات والمدة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Edit className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">تعديل البرامج</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    تعديل البرامج الموجودة وتحديث المعلومات
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">متابعة الحالة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    متابعة حالة البرامج والمعتمدة والمرفوضة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Management Section */}
        <Card id="teachers">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              إدارة الأساتذة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">إضافة الأساتذة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    إضافة أساتذة جدد مع تحديد التخصصات والصلاحيات
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Settings className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">إدارة الصلاحيات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    تحديد صلاحيات الأساتذة والمواد المسموح لهم بتدريسها
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">متابعة الأداء</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    متابعة أداء الأساتذة وإحصائياتهم
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Management Section */}
        <Card id="students">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <School className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              إدارة المتدربين
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">تسجيل المتدربين</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    تسجيل متدربين جدد في البرامج التدريبية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">متابعة التقدم</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    متابعة تقدم المتدربين في البرامج المسجلة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white font-arabic">إدارة الملفات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    إدارة ملفات المتدربين والمستندات المطلوبة
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
              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            نصائح سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">💡 نصيحة البرامج</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                تأكد من أن البرامج تتوافق مع المعايير الوطنية
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">📝 نصيحة الأساتذة</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                اختار الأساتذة المؤهلين للتخصصات المطلوبة
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">⏰ نصيحة المتابعة</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                تابع تقدم المتدربين بانتظام
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 font-arabic">🔄 نصيحة التحديث</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                حدث البرامج حسب التطورات الجديدة
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
            <span>معلومات الدعم</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white font-arabic">الدعم التقني</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                للاستفسارات التقنية أو المشاكل في النظام، يرجى التواصل مع فريق الدعم التقني
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Mail className="w-4 h-4" />
                  <span className="font-arabic">البريد الإلكتروني:</span>
                  <span>support@formation.gov.dz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Phone className="w-4 h-4" />
                  <span className="font-arabic">الهاتف:</span>
                  <span>+213 21 71 23 45</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white font-arabic">الموارد الإضافية</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                يمكنك الوصول إلى موارد إضافية لمساعدتك في استخدام النظام
              </p>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-blue-600 font-arabic flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4" />
                  دليل النظام الإلكتروني →
                </Button>
                <Button variant="link" className="p-0 h-auto text-green-600 font-arabic flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  فيديوهات تعليمية →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4 font-arabic">هل تحتاج إلى مساعدة إضافية؟</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-arabic">
            لا تتردد في التواصل مع فريق الدعم التقني أو إدارة المؤسسة
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" className="font-arabic">
              <Bell className="w-4 h-4 ml-2" />
              اتصل بالدعم
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <FileText className="w-4 h-4 ml-2" />
              دليل شامل
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <MessageCircle className="w-4 h-4 ml-2" />
              راسلنا
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;
