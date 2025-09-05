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
          <h1 className="text-3xl font-bold mb-4 font-arabic">🏛️ المساعدة و الدعم - المؤسسة الوطنية</h1>
          <p className="text-lg opacity-90 font-arabic">
            دليل شامل مخصص للمؤسسة الوطنية في نظام إدارة التدريب المهني
          </p>
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <p className="text-sm font-arabic">✅ هذا الدليل مخصص للمؤسسة الوطنية فقط</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span className="font-arabic">دليل المؤسسة الوطنية</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-arabic">الدعم المخصص</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span className="font-arabic">تواصل معنا</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice Important */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 font-arabic">دليل المؤسسة الوطنية</h2>
          </div>
          <p className="text-purple-700 dark:text-purple-300 font-arabic">
            هذا الدليل مخصص للمؤسسة الوطنية في نظام إدارة التدريب المهني. يحتوي على جميع المعلومات والخطوات اللازمة لإدارة النظام ومراجعة البرامج.
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
            <span className="font-arabic">دعم المؤسسة الوطنية</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground font-arabic">الدعم المخصص للمؤسسة الوطنية</h4>
              <p className="text-sm text-muted-foreground font-arabic">
                فريق دعم مخصص للمؤسسة الوطنية - متاح على مدار الساعة للمشاكل العاجلة
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <span className="font-arabic">البريد الإلكتروني:</span>
                  <span>nationale@formation.gov.dz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <span className="font-arabic">الهاتف:</span>
                  <span>+213 21 71 23 50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <span className="font-arabic">ساعات العمل:</span>
                  <span>24/7 للمشاكل العاجلة</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground font-arabic">الموارد الإدارية للمؤسسة الوطنية</h4>
              <p className="text-sm text-muted-foreground font-arabic">
                موارد مخصصة لمساعدة المؤسسة الوطنية في إدارة النظام والبرامج
              </p>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-primary font-arabic">
                  دليل المؤسسة الوطنية الشامل →
                </Button>
                <Button variant="link" className="p-0 h-auto text-success font-arabic">
                  دليل إدارة البرامج →
                </Button>
                <Button variant="link" className="p-0 h-auto text-secondary font-arabic">
                  دعم إداري مباشر →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4 font-arabic">هل تحتاج إلى مساعدة إضافية كمؤسسة وطنية؟</h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4 font-arabic">
            فريق الدعم المخصص للمؤسسة الوطنية جاهز لمساعدتك في أي وقت
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" className="font-arabic">
              <AlertTriangle className="w-4 h-4 ml-2" />
              دعم المؤسسة الوطنية
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <FileText className="w-4 h-4 ml-2" />
              دليل المؤسسة الوطنية
            </Button>
            <Button variant="outline" size="sm" className="font-arabic">
              <Settings className="w-4 h-4 ml-2" />
              تواصل معنا
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;
