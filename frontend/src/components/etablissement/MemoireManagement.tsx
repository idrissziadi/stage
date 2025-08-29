import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  FileText, 
  Search, 
  Plus, 
  Eye, 
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Download,
  Users,
  UserCheck,
  Edit,
  RefreshCw
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Memoire {
  id_memoire: number;
  titre_fr?: string;
  titre_ar?: string;
  fichierpdf?: string;
  status: 'مقدم' | 'مقبول' | 'مرفوض';
  observation?: string;
  description?: string;
  stagiaire: {
    id_stagiaire: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
    email?: string;
  };
  enseignant?: {
    id_enseignant: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Enseignant {
  id_enseignant: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
}

interface Stagiaire {
  id_stagiaire: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
  email?: string;
}

const MemoireManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [enseignants, setEnseignants] = useState<any[]>([]);
  const [stagiaires, setStagiaires] = useState<any[]>([]);
  
  const [isCreateMemoireOpen, setIsCreateMemoireOpen] = useState(false);
  const [isEditMemoireOpen, setIsEditMemoireOpen] = useState(false);
  const [selectedMemoire, setSelectedMemoire] = useState<Memoire | null>(null);
  
  const [memoireForm, setMemoireForm] = useState({
    id_stagiaire: '',
    id_enseignant: ''
  });

  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
    completed: 0
  });

  useEffect(() => {
    if (userProfile?.id_etab_formation) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    if (!userProfile?.id_etab_formation) return;
    
    try {
      setLoading(true);
      
      // Fetch memoires, enseignants, and stagiaires in parallel
      const [memoiresResponse, enseignantsResponse, stagiairesResponse] = await Promise.all([
        apiService.getMemoiresByEtablissement(searchTerm, 100, 0),
        apiService.getEnseignantsByEtablissement(userProfile.id_etab_formation, undefined, 100, 0),
        apiService.getStagiairesByEtablissement(userProfile.id_etab_formation, undefined, 100, 0)
      ]);
      
      // Handle memoires
      if (!memoiresResponse.error && memoiresResponse.data) {
        const transformedMemoires = (memoiresResponse.data.memoires || []).map((mem: any) => ({
          id_memoire: mem.id_memoire,
          titre_fr: mem.titre_fr || 'Sans titre',
          titre_ar: mem.titre_ar || 'بدون عنوان',
          description: mem.description || '',
          status: mem.status || 'مقدم',
          observation: mem.observation,
          fichierpdf: mem.fichierpdf,
          stagiaire: {
            id_stagiaire: mem.stagiaire?.id_stagiaire || 0,
            nom_fr: mem.stagiaire?.nom_fr || '',
            prenom_fr: mem.stagiaire?.prenom_fr || '',
            nom_ar: mem.stagiaire?.nom_ar || '',
            prenom_ar: mem.stagiaire?.prenom_ar || ''
          },
          enseignant: mem.enseignant ? {
            id_enseignant: mem.enseignant.id_enseignant,
            nom_fr: mem.enseignant.nom_fr,
            prenom_fr: mem.enseignant.prenom_fr,
            nom_ar: mem.enseignant.nom_ar,
            prenom_ar: mem.enseignant.prenom_ar
          } : null,
          createdAt: mem.createdAt || new Date().toISOString(),
          updatedAt: mem.updatedAt || new Date().toISOString()
        }));
        setMemoires(transformedMemoires);
        
        // Calculate stats
        const totalMemoires = transformedMemoires.length;
        const assignedMemoires = transformedMemoires.filter((m: any) => m.enseignant).length;
        const completedMemoires = transformedMemoires.filter((m: any) => m.status === 'مقبول').length;
        
        setStats({
          total: totalMemoires,
          assigned: assignedMemoires,
          unassigned: totalMemoires - assignedMemoires,
          completed: completedMemoires
        });
      } else {
        console.error('Error fetching memoires:', memoiresResponse.error);
        setMemoires([]);
      }
      
      // Handle enseignants
      if (!enseignantsResponse.error && enseignantsResponse.data) {
        const transformedEnseignants = (enseignantsResponse.data.enseignants || []).map((ens: any) => ({
          id_enseignant: ens.id_enseignant,
          nom_fr: ens.nom_fr,
          prenom_fr: ens.prenom_fr,
          nom_ar: ens.nom_ar,
          prenom_ar: ens.prenom_ar
        }));
        setEnseignants(transformedEnseignants);
      } else {
        console.error('Error fetching enseignants:', enseignantsResponse.error);
        setEnseignants([]);
      }
      
      // Handle stagiaires
      if (!stagiairesResponse.error && stagiairesResponse.data) {
        const transformedStagiaires = (stagiairesResponse.data.stagiaires || []).map((stg: any) => ({
          id_stagiaire: stg.id_stagiaire,
          nom_fr: stg.nom_fr,
          prenom_fr: stg.prenom_fr,
          nom_ar: stg.nom_ar,
          prenom_ar: stg.prenom_ar
        }));
        setStagiaires(transformedStagiaires);
      } else {
        console.error('Error fetching stagiaires:', stagiairesResponse.error);
        setStagiaires([]);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل البيانات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMemoireForm({
      id_stagiaire: '',
      id_enseignant: ''
    });
  };

  const handleAssignStagiaire = async () => {
    try {
      setLoading(true);
      
      if (!memoireForm.id_stagiaire || !memoireForm.id_enseignant) {
        toast({
          title: 'خطأ',
          description: 'يجب اختيار متدرب ومشرف',
          variant: 'destructive'
        });
        return;
      }

      const response = await apiService.assignStagiaireToEnseignant({
        id_stagiaire: parseInt(memoireForm.id_stagiaire),
        id_enseignant: parseInt(memoireForm.id_enseignant)
      });

      if (response.error) {
        toast({
          title: 'خطأ',
          description: response.error,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'نجح',
        description: 'تم تخصيص المذكرة بنجاح',
      });

      setIsCreateMemoireOpen(false);
      resetForm();
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Assignment error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تخصيص المذكرة',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول':
        return 'bg-green-100 text-green-800';
      case 'مقدم':
        return 'bg-blue-100 text-blue-800';
      case 'مرفوض':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مقبول':
        return <CheckCircle className="w-4 h-4" />;
      case 'مقدم':
        return <Clock className="w-4 h-4" />;
      case 'مرفوض':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Get unassigned stagiaires (those who don't have a memoire yet)
  const getUnassignedStagiaires = () => {
    const assignedStagiaireIds = memoires.map(m => m.stagiaire.id_stagiaire);
    return stagiaires.filter(s => !assignedStagiaireIds.includes(s.id_stagiaire));
  };

  const filteredMemoires = memoires.filter(memoire => {
    const matchesSearch = (memoire.titre_fr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (memoire.titre_ar || '').includes(searchTerm) ||
                         memoire.stagiaire.nom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire.prenom_fr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || memoire.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">إدارة المذكرات</h2>
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            تخصيص ومتابعة مذكرات التخرج للمتدربين
          </p>
        </div>
        
        <Dialog open={isCreateMemoireOpen} onOpenChange={setIsCreateMemoireOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="font-arabic">تخصيص مذكرة جديدة</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-arabic">تخصيص متدرب لمشرف</DialogTitle>
              <DialogDescription className="font-arabic">
                اختر متدرب ومشرف لإنشاء مذكرة جديدة
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="stagiaire" className="font-arabic">المتدرب</Label>
                <Select 
                  value={memoireForm.id_stagiaire} 
                  onValueChange={(value) => setMemoireForm(prev => ({ ...prev, id_stagiaire: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر متدرب" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUnassignedStagiaires().map(stagiaire => (
                      <SelectItem key={stagiaire.id_stagiaire} value={stagiaire.id_stagiaire.toString()}>
                        {stagiaire.nom_fr} {stagiaire.prenom_fr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="enseignant" className="font-arabic">المشرف</Label>
                <Select 
                  value={memoireForm.id_enseignant} 
                  onValueChange={(value) => setMemoireForm(prev => ({ ...prev, id_enseignant: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مشرف" />
                  </SelectTrigger>
                  <SelectContent>
                    {enseignants.map(enseignant => (
                      <SelectItem key={enseignant.id_enseignant} value={enseignant.id_enseignant.toString()}>
                        {enseignant.nom_fr} {enseignant.prenom_fr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAssignStagiaire}
                disabled={loading}
                className="font-arabic"
              >
                تخصيص المذكرة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600 font-arabic">إجمالي المذكرات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
                <p className="text-sm text-gray-600 font-arabic">مخصصة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.unassigned}</p>
                <p className="text-sm text-gray-600 font-arabic">غير مخصصة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600 font-arabic">مكتملة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="البحث بعنوان المذكرة أو اسم المتدرب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-right"
                dir="rtl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مقدم">مقدم</SelectItem>
                <SelectItem value="مقبول">مقبول</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={fetchData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-arabic">تحديث</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Memoires List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">قائمة المذكرات ({filteredMemoires.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredMemoires.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد مذكرات</h3>
              <p className="text-gray-600 font-arabic">لم يتم العثور على أي مذكرات</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-arabic">العنوان</TableHead>
                  <TableHead className="font-arabic">المتدرب</TableHead>
                  <TableHead className="font-arabic">المشرف</TableHead>
                  <TableHead className="font-arabic">الحالة</TableHead>
                  <TableHead className="font-arabic">تاريخ الإنشاء</TableHead>
                  <TableHead className="font-arabic">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemoires.map((memoire) => (
                  <TableRow key={memoire.id_memoire}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{memoire.titre_ar || memoire.titre_fr || 'بدون عنوان'}</p>
                        {memoire.titre_fr && memoire.titre_ar && (
                          <p className="text-sm text-gray-600">{memoire.titre_fr}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{memoire.stagiaire.prenom_fr} {memoire.stagiaire.nom_fr}</p>
                          <p className="text-sm text-gray-600 font-arabic">{memoire.stagiaire.prenom_ar} {memoire.stagiaire.nom_ar}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {memoire.enseignant ? (
                        <div>
                          <p className="font-medium">{memoire.enseignant.prenom_fr} {memoire.enseignant.nom_fr}</p>
                          <p className="text-sm text-gray-600 font-arabic">{memoire.enseignant.prenom_ar} {memoire.enseignant.nom_ar}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-arabic">غير مخصص</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(memoire.status)} gap-1 font-arabic`}>
                        {getStatusIcon(memoire.status)}
                        {memoire.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {new Date(memoire.createdAt).toLocaleDateString('ar-DZ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Handle edit - could open assignment dialog
                            console.log('Edit memoire:', memoire.id_memoire);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {memoire.fichierpdf && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Handle PDF view
                              const fileUrl = `${import.meta.env.VITE_API_URL}/${memoire.fichierpdf}`;
                              window.open(fileUrl, '_blank');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default MemoireManagement;