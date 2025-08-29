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
  Download
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">دليل استخدام لوحة تحكم الأستاذ</h1>
          <p className="text-lg opacity-90">
            مرحباً بك في دليل الاستخدام الشامل لنظام إدارة التدريب - قسم الأساتذة
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
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                  <h4 className="font-medium text-gray-900 dark:text-white">الإحصائيات السريعة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    عرض سريع لعدد الدروس المرفوعة والمعتمدة والمودیولات
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">معلومات الملف الشخصي</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    عرض تفاصيل حسابك ومعلوماتك الشخصية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">الأنشطة الأخيرة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              إدارة الدروس
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">رفع الدروس</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    رفع ملفات PDF للدروس مع تحديد المودیول والعنوان
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/50 rounded">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">حالات الدروس</h4>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">في الانتظار</Badge>
                    <Badge className="bg-green-100 text-green-800 text-xs">معتمد</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">عرض وتحميل الدروس</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              إدارة المودیولات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">عرض المودیولات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    استعراض جميع المودیولات المُكلف بتدريسها
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">الدروس المرتبطة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    عرض جميع الدروس المرتبطة بكل مودیول
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">إحصائيات المودیول</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">القائمة الشخصية</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    الوصول إلى الملف الشخصي والإعدادات من أيقونة المستخدم
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded">
                  <Bell className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">الإشعارات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تلقي إشعارات عند اعتماد أو رفض الدروس
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <HelpCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">المساعدة والدعم</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
              <HelpCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            نصائح سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 نصيحة الرفع</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تأكد من أن ملف PDF لا يتجاوز 10 ميجابايت وأن المحتوى واضح ومقروء
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 نصيحة التسمية</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                اختر عناوين واضحة ومفهومة للدروس لتسهيل عملية البحث والتنظيم
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">⏰ نصيحة المتابعة</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تابع حالة دروسك بانتظام وتواصل مع الإدارة في حالة التأخير
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🔄 نصيحة التحديث</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                يمكن إعادة رفع الدرس في حالة الرفض مع مراعاة ملاحظات المراجع
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">هل تحتاج إلى مساعدة إضافية؟</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            لا تتردد في التواصل مع فريق الدعم التقني أو إدارة المؤسسة
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              اتصل بالدعم
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              دليل شامل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;