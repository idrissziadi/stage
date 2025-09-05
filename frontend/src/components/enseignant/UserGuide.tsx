import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Upload, 
  BookOpen, 
  Bell, 
  Settings, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Eye,
  FileText,
  Download,
  AlertTriangle,
  Mail,
  Phone
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 font-arabic">👨‍🏫 المساعدة و الدعم - الأستاذ</h1>
          <p className="text-lg opacity-90 font-arabic">
            دليل شامل مخصص للأساتذة في نظام إدارة التدريب المهني
          </p>
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <p className="text-sm font-arabic">✅ هذا الدليل مخصص للأساتذة فقط</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-arabic">دليل الأستاذ</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span className="font-arabic">الدعم المخصص</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <span className="font-arabic">تواصل معنا</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice Important */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 font-arabic">دليل الأستاذ</h2>
          </div>
          <p className="text-blue-700 dark:text-blue-300 font-arabic">
            هذا الدليل مخصص للأساتذة في نظام إدارة التدريب المهني. يحتوي على جميع المعلومات والخطوات اللازمة لرفع وإدارة الدروس والموديولات.
          </p>
        </CardContent>
      </Card>

      {/* Guide Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overview Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <User className="w-5 h-5 text-primary dark:text-blue-400" />
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
                  <h4 className="font-medium text-foreground dark:text-white">الإحصائيات السريعة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    عرض سريع لعدد الدروس المرفوعة والمعتمدة والمودیولات
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">معلومات الملف الشخصي</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    عرض تفاصيل حسابك ومعلوماتك الشخصية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">الأنشطة الأخيرة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    تتبع آخر العمليات والإجراءات التي قمت بها
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Management Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Upload className="w-5 h-5 text-success dark:text-green-400" />
              </div>
              إدارة الدروس
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">رفع الدروس</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    رفع ملفات PDF للدروس مع تحديد المودیول والعنوان
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/50 rounded">
                  <Clock className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">حالات الدروس</h4>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">في الانتظار</Badge>
                    <Badge className="bg-green-100 text-green-800 text-xs">معتمد</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Eye className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">عرض وتحميل الدروس</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    معاينة وتحميل الدروس المرفوعة والمعتمدة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Management Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <BookOpen className="w-5 h-5 text-secondary dark:text-purple-400" />
              </div>
              إدارة المودیولات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">عرض المودیولات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    استعراض جميع المودیولات المُكلف بتدريسها
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <FileText className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">الدروس المرتبطة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    عرض جميع الدروس المرتبطة بكل مودیول
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">إحصائيات المودیول</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    عدد الدروس المعتمدة والمعلقة لكل مودیول
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation & Settings Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              التنقل والإعدادات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">القائمة الشخصية</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    الوصول إلى الملف الشخصي والإعدادات من أيقونة المستخدم
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded">
                  <Bell className="w-4 h-4 text-error" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">الإشعارات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    تلقي إشعارات عند اعتماد أو رفض الدروس
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <HelpCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">المساعدة والدعم</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    الوصول إلى دليل الاستخدام والحصول على المساعدة
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-warning dark:text-yellow-400" />
            </div>
            نصائح سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 نصيحة الرفع</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                تأكد من أن ملف PDF لا يتجاوز 10 ميجابايت وأن المحتوى واضح ومقروء
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 نصيحة التسمية</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                اختر عناوين واضحة ومفهومة للدروس لتسهيل عملية البحث والتنظيم
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">⏰ نصيحة المتابعة</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                تابع حالة دروسك بانتظام وتواصل مع الإدارة في حالة التأخير
              </p>
            </div>
            <div className="theme-transition-colors bg-card dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🔄 نصيحة التحديث</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                يمكن إعادة رفع الدرس في حالة الرفض مع مراعاة ملاحظات المراجع
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
            <span>دعم الأساتذة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground dark:text-white font-arabic">الدعم المخصص للأساتذة</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                فريق دعم مخصص للأساتذة - متاح من الأحد إلى الخميس من 8:00 إلى 17:00
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Mail className="w-4 h-4" />
                  <span className="font-arabic">البريد الإلكتروني:</span>
                  <span>enseignants@formation.gov.dz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Phone className="w-4 h-4" />
                  <span className="font-arabic">الهاتف:</span>
                  <span>+213 21 71 23 47</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Clock className="w-4 h-4" />
                  <span className="font-arabic">ساعات العمل:</span>
                  <span>8:00 - 17:00</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground dark:text-white font-arabic">الموارد التعليمية للأساتذة</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                موارد مخصصة لمساعدة الأساتذة في إدارة الدروس والموديولات
              </p>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-primary font-arabic flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  دليل الأستاذ الشامل →
                </Button>
                <Button variant="link" className="p-0 h-auto text-success font-arabic flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  دليل رفع الدروس →
                </Button>
                <Button variant="link" className="p-0 h-auto text-secondary font-arabic flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  دليل إدارة الموديولات →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4 font-arabic">هل تحتاج إلى مساعدة إضافية كأستاذ؟</h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4 font-arabic">
            فريق الدعم المخصص للأساتذة جاهز لمساعدتك في أي وقت
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" className="font-arabic">
              <Bell className="w-4 h-4 ml-2" />
              دعم الأساتذة
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <FileText className="w-4 h-4 ml-2" />
              دليل الأستاذ
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <HelpCircle className="w-4 h-4 ml-2" />
              تواصل معنا
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;