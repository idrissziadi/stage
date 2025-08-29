import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  FileText, 
  LogOut, 
  BarChart3,
  Plus,
  Search,
  Edit,
  GraduationCap,
  Building,
  School
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EtablissementRegionaleDashboard = () => {
  const { userProfile, signOut } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [cours, setCours] = useState([]);
  const [coursLoading, setCoursLoading] = useState(false);
  const [coursFilters, setCoursFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    if (userProfile?.id_etab_regionale) {
      fetchDashboardData();
    }
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === 'cours') {
      fetchCours();
    }
  }, [activeTab, coursFilters]);

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const response = await fetch('/api/etablissement-regionale/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات لوحة التحكم',
        variant: 'destructive'
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchCours = async () => {
    try {
      setCoursLoading(true);
      const params = new URLSearchParams({
        status: coursFilters.status,
        search: coursFilters.search,
        limit: '10',
        offset: '0'
      });

      const response = await fetch(`/api/etablissement-regionale/cours?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCours(data.cours);
      }
    } catch (error) {
      console.error('Error fetching cours:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الدورات',
        variant: 'destructive'
      });
    } finally {
      setCoursLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'في_الانتظار':
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'مقبول':
      case 'valide':
        return 'bg-green-100 text-green-800';
      case 'مرفوض':
      case 'rejete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'في_الانتظار':
      case 'en_attente':
        return 'في الانتظار';
      case 'مقبول':
      case 'valide':
        return 'مقبول';
      case 'مرفوض':
      case 'rejete':
        return 'مرفوض';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <School className="h-8 w-8 text-blue-600" />
                <span className="mr-2 text-xl font-bold text-gray-900">الإدارة الجهوية</span>
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {userProfile?.nom_fr?.[0]}{userProfile?.nom_ar?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userProfile?.nom_fr && (
                        <p className="font-medium">{userProfile.nom_fr}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {userProfile?.code}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2 space-x-reverse">
              <BarChart3 className="w-4 h-4" />
              <span>نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="cours" className="flex items-center space-x-2 space-x-reverse">
              <BookOpen className="w-4 h-4" />
              <span>الدورات</span>
            </TabsTrigger>
            <TabsTrigger value="programmes" className="flex items-center space-x-2 space-x-reverse">
              <GraduationCap className="w-4 h-4" />
              <span>البرامج</span>
            </TabsTrigger>
            <TabsTrigger value="memoires" className="flex items-center space-x-2 space-x-reverse">
              <FileText className="w-4 h-4" />
              <span>المذكرات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">نظرة عامة - الإدارة الجهوية</h2>
                {stats && (
                  <p className="text-blue-100">
                    {stats.etablissement.nom_fr} ({stats.etablissement.code})
                  </p>
                )}
              </div>

              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">الدورات</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.cours.total}</div>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-xs">
                          <span>في الانتظار:</span>
                          <span className="text-yellow-600">{stats.cours.en_attente}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>مقبولة:</span>
                          <span className="text-green-600">{stats.cours.valides}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">البرامج المقترحة</CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.programmes.total}</div>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-xs">
                          <span>في الانتظار:</span>
                          <span className="text-yellow-600">{stats.programmes.en_attente}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">المذكرات</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.memoires.total}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">الإحصائيات العامة</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">مؤسسات التكوين:</span>
                          <span className="font-bold">{stats.etablissements_formation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">الأساتذة:</span>
                          <span className="font-bold">{stats.enseignants}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>الإجراءات السريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab('cours')}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>استعراض الدورات</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('programmes')}
                      variant="outline"
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <Plus className="h-4 w-4" />
                      <span>إنشاء برنامج جديد</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('memoires')}
                      variant="outline"
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <FileText className="h-4 w-4" />
                      <span>استعراض المذكرات</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cours">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl font-bold">إدارة الدورات</h2>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="البحث في الدورات..."
                      value={coursFilters.search}
                      onChange={(e) => setCoursFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-64"
                    />
                  </div>
                  <Select
                    value={coursFilters.status}
                    onValueChange={(value) => setCoursFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="تصفية بالحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="en_attente">في الانتظار</SelectItem>
                      <SelectItem value="valide">مقبول</SelectItem>
                      <SelectItem value="rejete">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {coursLoading ? (
                <div className="text-center py-8">جارِ التحميل...</div>
              ) : (
                <div className="grid gap-4">
                  {cours.map((coursItem) => (
                    <Card key={coursItem.id_cours}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{coursItem.titre_fr}</h3>
                            <p className="text-gray-600">{coursItem.titre_ar}</p>
                            <p className="text-sm text-gray-500">الكود: {coursItem.code_cours}</p>
                          </div>
                          <Badge className={getStatusColor(coursItem.status)}>
                            {getStatusText(coursItem.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">الأستاذ:</p>
                            <p>{coursItem.enseignant?.nom_fr} {coursItem.enseignant?.prenom_fr}</p>
                          </div>
                          <div>
                            <p className="font-medium">المؤسسة:</p>
                            <p>{coursItem.enseignant?.etablissementformation?.nom_fr}</p>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Handle status change
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            تغيير الحالة
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {cours.length === 0 && !coursLoading && (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد دورات متاحة
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="programmes">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">إدارة البرامج</h2>
                <Button className="flex items-center space-x-2 space-x-reverse">
                  <Plus className="h-4 w-4" />
                  <span>إنشاء برنامج جديد</span>
                </Button>
              </div>
              <div className="text-center py-8 text-gray-500">
                قريباً - إدارة البرامج
              </div>
            </div>
          </TabsContent>

          <TabsContent value="memoires">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">استعراض المذكرات</h2>
              <div className="text-center py-8 text-gray-500">
                قريباً - استعراض المذكرات
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EtablissementRegionaleDashboard;