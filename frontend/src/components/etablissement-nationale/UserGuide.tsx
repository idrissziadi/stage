import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye,
  Settings,
  Users,
  Award,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 font-arabic">دليل استخدام لوحة تحكم المؤسسة الوطنية</h1>
          <p className="text-lg opacity-90 font-arabic">
            مرحباً بك في دليل الاستخدام الشامل لنظام إدارة التدريب - قسم المؤسسة الوطنية
          </p>
        </CardContent>
      </Card>

      {/* Guide Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overview Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardTitle className="flex items-center gap-3 font-arabic">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Building className="w-5 h-5 text-secondary dark:text-purple-400" />
              </div>
              <span className="font-arabic">نظرة عامة - الصفحة الرئيسية</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">الإحصائيات الشاملة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض إحصائيات البرامج والمؤسسات والمواد التدريبية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إدارة البرامج</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    مراجعة واعتماد أو رفض البرامج المقدمة من المؤسسات الإقليمية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">المراقبة المستمرة</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    متابعة حالة البرامج والأنشطة في جميع المؤسسات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programme Management Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <FileText className="w-5 h-5 text-success dark:text-green-400" />
              </div>
              <span className="font-arabic">إدارة البرامج</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">مراجعة البرامج</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض تفاصيل البرامج المقدمة وفحص محتواها
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">اعتماد البرامج</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    اعتماد البرامج التي تلبي المعايير المطلوبة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded">
                  <AlertTriangle className="w-4 h-4 text-error" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">رفض البرامج</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    رفض البرامج التي لا تلبي المعايير مع إضافة ملاحظات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary dark:text-blue-400" />
              </div>
              <span className="font-arabic">الإحصائيات والتحليلات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <FileText className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إحصائيات البرامج</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    عرض عدد البرامج المعتمدة والمرفوضة والمعلقة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-indigo-100 dark:bg-indigo-900/50 rounded">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إحصائيات المؤسسات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    متابعة أداء المؤسسات الإقليمية وعدد البرامج المقدمة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/50 rounded">
                  <Award className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">تقارير الأداء</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تقارير مفصلة عن أداء النظام والمؤسسات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Management Section */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-arabic">إدارة النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إدارة المستخدمين</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    إدارة حسابات المستخدمين والصلاحيات
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
                  <Building className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إدارة المؤسسات</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    إضافة وتعديل وحذف المؤسسات الإقليمية
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded">
                  <Settings className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white font-arabic">إعدادات النظام</h4>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                    تكوين إعدادات النظام والمعايير
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            <span className="font-arabic">الإجراءات السريعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-medium font-arabic">مراجعة البرامج الجديدة</span>
              <span className="text-sm text-muted-foreground font-arabic">فحص البرامج المقدمة حديثاً</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6 text-success" />
              <span className="font-medium font-arabic">عرض الإحصائيات</span>
              <span className="text-sm text-muted-foreground font-arabic">متابعة أداء النظام</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-secondary" />
              <span className="font-medium font-arabic">إدارة المؤسسات</span>
              <span className="text-sm text-muted-foreground font-arabic">إدارة المؤسسات الإقليمية</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-arabic">معلومات الدعم</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground font-arabic">الدعم التقني</h4>
              <p className="text-sm text-muted-foreground font-arabic">
                للاستفسارات التقنية أو المشاكل في النظام، يرجى التواصل مع فريق الدعم التقني
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="font-arabic">البريد الإلكتروني:</span>
                <span>support@formation.gov.dz</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground font-arabic">الدليل الإلكتروني</h4>
              <p className="text-sm text-muted-foreground font-arabic">
                يمكنك الوصول إلى الدليل الإلكتروني الكامل للنظام عبر الرابط التالي
              </p>
              <Button variant="link" className="p-0 h-auto text-primary font-arabic">
                دليل النظام الإلكتروني →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;
