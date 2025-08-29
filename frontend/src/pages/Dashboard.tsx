import { useAuthApi } from '@/hooks/useAuthApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user, userProfile, signOut } = useAuthApi();

  const getRoleInArabic = (role: string) => {
    const roles: { [key: string]: string } = {
      'admin': 'مدير',
      'stagiaire': 'متدرب',
      'enseignant': 'أستاذ',
      'etablissement_formation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground">
                              مرحباً {userProfile?.username || user?.username}
            </p>
          </div>
          <Button onClick={signOut} variant="outline">
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المستخدم</CardTitle>
              <CardDescription>تفاصيل حسابك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>اسم المستخدم:</strong> {user?.username}
              </div>
              <div>
                <strong>اسم المستخدم:</strong> {userProfile?.username}
              </div>
              <div>
                <strong>الدور:</strong> {userProfile?.role ? getRoleInArabic(userProfile.role) : 'غير محدد'}
              </div>
              <div>
                <strong>تاريخ الإنشاء:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-DZ') : 'غير متاح'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الإحصائيات</CardTitle>
              <CardDescription>ملخص سريع للنظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">مرحباً بك</p>
                <p className="text-muted-foreground">في نظام إدارة التدريب</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {userProfile?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>إدارة النظام</CardTitle>
              <CardDescription>أدوات المدير</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">👥</span>
                  <span>إدارة المستخدمين</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">🏢</span>
                  <span>إدارة المؤسسات</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">📚</span>
                  <span>إدارة التخصصات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {userProfile?.role === 'stagiaire' && (
          <Card>
            <CardHeader>
              <CardTitle>لوحة المتدرب</CardTitle>
              <CardDescription>أدوات المتدرب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">📖</span>
                  <span>الدروس</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">📝</span>
                  <span>الواجبات</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">📊</span>
                  <span>النتائج</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {userProfile?.role === 'enseignant' && (
          <Card>
            <CardHeader>
              <CardTitle>لوحة الأستاذ</CardTitle>
              <CardDescription>أدوات التدريس</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">📚</span>
                  <span>الدروس</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">👥</span>
                  <span>الطلاب</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-lg mb-1">📊</span>
                  <span>التقييمات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;