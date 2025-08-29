import React, { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap, 
  Users, 
  Mail, 
  Phone,
  Calendar,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';

interface Enseignant {
  id_enseignant: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
  email: string;
  telephone: string;
  date_naissance: string;
  grade?: {
    id_grade: number;
    designation_fr: string;
    designation_ar: string;
    code_grade: string;
  };
  Compte?: {
    id_compte: number;
    username: string;
    role: string;
    createdAt: string;
  };
  modules?: any[]; // Modules will be added if needed
  specialites?: any[]; // Specialties will be added if needed
}

interface Stagiaire {
  id_stagiaire: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
  email: string;
  telephone: string;
  date_naissance: string;
  Compte?: {
    id_compte: number;
    username: string;
    role: string;
    createdAt: string;
  };
  inscriptions?: Array<{
    id_inscription: number;
    statut: string;
    createdAt: string;
    offre: {
      id_offre: number;
      description: string;
      specialite?: {
        designation_fr: string;
        designation_ar: string;
      };
      diplome?: {
        designation_fr: string;
        designation_ar: string;
      };
      etablissementFormation?: {
        nom_fr: string;
        nom_ar: string;
      };
    };
  }>;
}

interface Grade {
  id_grade: number;
  designation_fr: string;
  designation_ar: string;
  code_grade: string;
}

const UserManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('enseignants');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [accountForm, setAccountForm] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    if (userProfile?.id_etab_formation) {
      fetchAllUsers();
      fetchGrades();
    }
  }, [userProfile, activeTab]);

  const fetchGrades = async () => {
    try {
      const response = await apiService.getAllGrades();
      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors du chargement des grades');
      }
      setGrades(response.data?.grades || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الدرجات العلمية',
        variant: 'destructive'
      });
    }
  };

  const fetchAllUsers = async () => {
    if (!userProfile?.id_etab_formation) return;
    
    try {
      setLoading(true);
      
      if (activeTab === 'enseignants') {
        const response = await apiService.getAllExistingEnseignants(
          searchTerm,
          50,
          0
        );
        
        if (response.error) {
          throw new Error(response.error.message || 'Erreur lors du chargement des enseignants');
        }
        
        setEnseignants(response.data?.enseignants || []);
      } else {
        const response = await apiService.getAllExistingStagiaires(
          searchTerm,
          50,
          0
        );
        
        if (response.error) {
          console.error('Error response:', response.error);
          throw new Error(response.error.message || 'Erreur serveur lors de la récupération des stagiaires');
        }
        
        setStagiaires(response.data?.stagiaires || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تحميل بيانات المستخدمين',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAccountForm = () => {
    setAccountForm({
      username: '',
      password: ''
    });
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      
      if (!accountForm.username || !accountForm.password) {
        toast({
          title: 'خطأ',
          description: 'جميع الحقول المطلوبة يجب ملؤها',
          variant: 'destructive'
        });
        return;
      }

      let response;
      if (activeTab === 'enseignants') {
        response = await apiService.createAccountForEnseignant(
          selectedUser.id_enseignant,
          accountForm.username,
          accountForm.password
        );
      } else {
        response = await apiService.createAccountForStagiaire(
          selectedUser.id_stagiaire,
          accountForm.username,
          accountForm.password
        );
      }
      
      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors de la création du compte');
      }

      toast({
        title: 'نجح',
        description: `تم إنشاء الحساب بنجاح`,
      });

      setIsCreateAccountOpen(false);
      resetAccountForm();
      setSelectedUser(null);
      // Refresh the user list
      await fetchAllUsers();
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في إنشاء الحساب',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateAccount = (user: any) => {
    setSelectedUser(user);
    resetAccountForm();
    setIsCreateAccountOpen(true);
  };

  const toggleRowExpansion = (userId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  const currentUsers = activeTab === 'enseignants' ? enseignants : stagiaires;
  const filteredUsers = currentUsers.filter(user => {
    const nomFr = user.nom_fr || '';
    const prenomFr = user.prenom_fr || '';
    const email = user.email || '';
    const searchLower = searchTerm.toLowerCase();
    
    return nomFr.toLowerCase().includes(searchLower) ||
           prenomFr.toLowerCase().includes(searchLower) ||
           email.toLowerCase().includes(searchLower);
  });

  return (
    <div className="space-y-6 rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">إدارة المستخدمين</h2>
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            عرض المستخدمين الموجودين وإنشاء الحسابات لهم
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enseignants" className="font-arabic">
            <GraduationCap className="w-4 h-4 ml-2" />
            الأساتذة ({enseignants.length})
          </TabsTrigger>
          <TabsTrigger value="stagiaires" className="font-arabic">
            <Users className="w-4 h-4 ml-2" />
            المتدربين ({stagiaires.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">
                قائمة {activeTab === 'enseignants' ? 'الأساتذة' : 'المتدربين'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا يوجد مستخدمين</h3>
                  <p className="text-gray-600 font-arabic">لم يتم العثور على أي مستخدمين</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">الاسم</TableHead>
                      <TableHead className="font-arabic">البريد</TableHead>
                      <TableHead className="font-arabic">الهاتف</TableHead>
                      {activeTab === 'enseignants' ? (
                        <TableHead className="font-arabic">الدرجة</TableHead>
                      ) : (
                        <TableHead className="font-arabic">عدد التسجيلات</TableHead>
                      )}
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: any) => {
                      const userId = user.id_enseignant || user.id_stagiaire;
                      const isExpanded = expandedRows.has(userId);
                      
                      return (
                        <React.Fragment key={userId}>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {activeTab === 'stagiaires' && user.inscriptions && user.inscriptions.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleRowExpansion(userId)}
                                    className="p-1"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}
                                <div>
                                  <p className="font-semibold">{(user.prenom_fr || '') + ' ' + (user.nom_fr || '')}</p>
                                  <p className="text-sm text-gray-600 font-arabic">{(user.prenom_ar || '') + ' ' + (user.nom_ar || '')}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email || 'غير محدد'}</TableCell>
                            <TableCell>{user.telephone || 'غير محدد'}</TableCell>
                            <TableCell>
                              {activeTab === 'enseignants' ? (
                                <Badge variant="secondary" className="font-arabic">
                                  {user.grade?.designation_ar || user.grade?.designation_fr || 'غير محدد'}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="font-arabic">
                                  {user.inscriptions?.length || 0} تسجيل
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.Compte ? (
                                <Badge variant="default" className="font-arabic">
                                  لديه حساب
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="font-arabic">
                                  بدون حساب
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {!user.Compte && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenCreateAccount(user)}
                                    className="font-arabic"
                                  >
                                    <UserPlus className="w-4 h-4 ml-1" />
                                    إنشاء حساب
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded row for trainee inscriptions */}
                          {activeTab === 'stagiaires' && isExpanded && user.inscriptions && user.inscriptions.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-gray-50 dark:bg-gray-800 p-0">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-3 font-arabic text-right">تسجيلات المتدرب:</h4>
                                  <div className="grid gap-3">
                                    {user.inscriptions.map((inscription: any) => (
                                      <div key={inscription.id_inscription} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                          {/* Row 1: Basic Info */}
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">التخصص:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.specialite?.designation_ar || inscription.offre?.specialite?.designation_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">الشهادة:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.diplome?.designation_ar || inscription.offre?.diplome?.designation_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">طريقة التكوين:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.modeFormation?.designation_ar || inscription.offre?.modeFormation?.designation_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          
                                          {/* Row 2: Dates and Institution */}
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">تاريخ البداية:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.date_debut ? new Date(inscription.offre.date_debut).toLocaleDateString('ar-DZ') : 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">تاريخ النهاية:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.date_fin ? new Date(inscription.offre.date_fin).toLocaleDateString('ar-DZ') : 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">المؤسسة:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.etablissementFormation?.nom_ar || inscription.offre?.etablissementFormation?.nom_fr || 'غير محدد'}
                                            </p>
                                          </div>
                                          
                                          {/* Row 3: Registration Info */}
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">تاريخ التسجيل:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {new Date(inscription.createdAt).toLocaleDateString('ar-DZ')}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">رقم العرض:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.offre?.id_offre || 'غير محدد'}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 font-arabic">رقم التسجيل:</span>
                                            <p className="text-gray-900 dark:text-gray-100 font-arabic">
                                              {inscription.id_inscription || 'غير محدد'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Account Dialog */}
      <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">
              إنشاء حساب لـ {selectedUser?.prenom_fr} {selectedUser?.nom_fr}
            </DialogTitle>
            <DialogDescription className="font-arabic">
              إنشاء اسم مستخدم وكلمة مرور للمستخدم
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label className="font-arabic">اسم المستخدم *</Label>
              <Input
                value={accountForm.username}
                onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                dir="ltr"
                placeholder="اسم المستخدم"
              />
            </div>
            <div>
              <Label className="font-arabic">كلمة المرور *</Label>
              <Input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm(prev => ({ ...prev, password: e.target.value }))}
                dir="ltr"
                placeholder="كلمة المرور"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateAccountOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateAccount}
              disabled={loading}
              className="font-arabic"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;