import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  Target, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Eye,
  Calendar,
  Users,
  GraduationCap,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';

interface Offre {
  id_offre: number;
  date_debut: string;
  date_fin: string;
  statut: 'brouillon' | 'active' | 'archivee';
  specialite?: {
    id_specialite: number;
    designation_fr: string;
    designation_ar: string;
  };
  diplome?: {
    id_diplome: number;
    designation_fr: string;
    designation_ar: string;
  };
  modeFormation?: {
    id_mode: number;
    designation_fr: string;
    designation_ar: string;
  };
  created_at: string;
  updated_at: string;
  inscriptions_count?: number; // Made optional since backend might not always provide this
}

const OffreManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [offres, setOffres] = useState<Offre[]>([]);
  const [specialites, setSpecialites] = useState<any[]>([]);
  const [diplomes, setDiplomes] = useState<any[]>([]);
  const [modesFormation, setModesFormation] = useState<any[]>([]);
  
  const [isCreateOffreOpen, setIsCreateOffreOpen] = useState(false);
  const [isEditOffreOpen, setIsEditOffreOpen] = useState(false);
  const [isDeleteOffreOpen, setIsDeleteOffreOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  
  const [offreForm, setOffreForm] = useState({
    date_debut: '',
    date_fin: '',
    id_specialite: '',
    id_diplome: '',
    id_mode: '',
    statut: 'brouillon' as 'brouillon' | 'active' | 'archivee'
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
      
      // Fetch all required data in parallel
      const [offresResponse, specialitesResponse, diplomesResponse, modesFormationResponse] = await Promise.all([
        apiService.getOffresByEtablissement(userProfile.id_etab_formation),
        apiService.getAllSpecialites(),
        apiService.getAllDiplomes(),
        apiService.getAllModeFormations()
      ]);
      
      // Handle specialites
      if (specialitesResponse.error) {
        console.error('Error fetching specialites:', specialitesResponse.error);
        toast({
          title: 'خطأ في التحميل',
          description: 'تعذر تحميل التخصصات. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
        setSpecialites([]);
      } else {
        // Handle response structure - could be { specialites: [] } or direct array
        const specialitesData = specialitesResponse.data?.specialites || specialitesResponse.data || [];
        setSpecialites(specialitesData);
      }
      
      // Handle diplomes
      if (diplomesResponse.error) {
        console.error('Error fetching diplomes:', diplomesResponse.error);
        toast({
          title: 'خطأ في التحميل',
          description: 'تعذر تحميل الشهادات. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
        setDiplomes([]);
      } else {
        // Handle response structure - could be { diplomes: [] } or direct array
        const diplomesData = diplomesResponse.data?.diplomes || diplomesResponse.data || [];
        setDiplomes(diplomesData);
      }
      
      // Handle modesFormation
      if (modesFormationResponse.error) {
        console.error('Error fetching modesFormation:', modesFormationResponse.error);
        toast({
          title: 'خطأ في التحميل',
          description: 'تعذر تحميل طرق التكوين. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
        setModesFormation([]);
      } else {
        // Handle response structure - could be { modeFormations: [] } or direct array
        const modesFormationData = modesFormationResponse.data?.modeFormations || modesFormationResponse.data || [];
        setModesFormation(modesFormationData);
      }
      
      // Handle offres
      if (offresResponse.error) {
        console.error('Error fetching offres:', offresResponse.error);
        toast({
          title: 'خطأ في التحميل',
          description: 'تعذر تحميل العروض. يرجى التحقق من الاتصال و المحاولة مرة أخرى.',
          variant: 'destructive',
        });
        setOffres([]);
      } else {
        // Handle backend response structure - could be { offres: [] } or direct array
        let offresData = [];
        if (offresResponse.data) {
          if (Array.isArray(offresResponse.data)) {
            offresData = offresResponse.data;
          } else if (offresResponse.data.offres && Array.isArray(offresResponse.data.offres)) {
            offresData = offresResponse.data.offres;
          } else {
            console.warn('Unexpected offres response structure:', offresResponse.data);
            offresData = [];
          }
        }
        setOffres(offresData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'خطأ في النظام',
        description: 'حدث خطأ غير متوقع في تحميل البيانات. يرجى إعادة تحميل الصفحة.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffre = async () => {
    if (!userProfile?.id_etab_formation) return;

    try {
      setLoading(true);

      const response = await apiService.createOffre({
        ...offreForm,
        id_etab_formation: userProfile.id_etab_formation,
      });

      if (response.error) {
        console.error('Error creating offre:', response.error);
        toast({
          title: 'خطأ في الإنشاء',
          description: 'فشل في إنشاء العرض. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '✅ تم إنشاء العرض بنجاح',
          description: 'تم إنشاء عرض التكوين الجديد بنجاح ويمكنك الآن إدارته.',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating offre:', error);
      toast({
        title: 'خطأ في الإنشاء',
        description: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsCreateOffreOpen(false);
      setOffreForm({
        date_debut: '',
        date_fin: '',
        id_specialite: '',
        id_diplome: '',
        id_mode: '',
        statut: 'brouillon'
      });
      setLoading(false);
    }
  };

  const handleEditOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setOffreForm({
      date_debut: offre.date_debut || '',
      date_fin: offre.date_fin || '',
      id_specialite: offre.specialite?.id_specialite?.toString() || '',
      id_diplome: offre.diplome?.id_diplome?.toString() || '',
      id_mode: offre.modeFormation?.id_mode?.toString() || '',
      statut: offre.statut
    });
    setIsEditOffreOpen(true);
  };

  const handleUpdateOffre = async () => {
    if (!selectedOffre) return;

    try {
      setLoading(true);

      const response = await apiService.updateOffre(selectedOffre.id_offre, offreForm);

      if (response.error) {
        console.error('Error updating offre:', response.error);
        toast({
          title: 'خطأ في التعديل',
          description: 'فشل في تعديل العرض. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '✅ تم تعديل العرض بنجاح',
          description: 'تم تحديث بيانات عرض التكوين بنجاح.',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating offre:', error);
      toast({
        title: 'خطأ في التعديل',
        description: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsEditOffreOpen(false);
      setSelectedOffre(null);
      setOffreForm({
        date_debut: '',
        date_fin: '',
        id_specialite: '',
        id_diplome: '',
        id_mode: '',
        statut: 'brouillon'
      });
      setLoading(false);
    }
  };

  const handleDeleteOffre = async () => {
    if (!selectedOffre) return;

    try {
      setLoading(true);

      const response = await apiService.deleteOffre(selectedOffre.id_offre);

      if (response.error) {
        console.error('Error deleting offre:', response.error);
        toast({
          title: 'خطأ في الحذف',
          description: 'فشل في حذف العرض. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '✅ تم حذف العرض بنجاح',
          description: 'تم حذف عرض التكوين نهائياً من النظام.',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting offre:', error);
      toast({
        title: 'خطأ في الحذف',
        description: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteOffreOpen(false);
      setLoading(false);
    }
  };

  const handleDuplicateOffre = (offre: Offre) => {
    setOffreForm({
      date_debut: '',
      date_fin: '',
      id_specialite: offre.specialite?.id_specialite?.toString() || '',
      id_diplome: offre.diplome?.id_diplome?.toString() || '',
      id_mode: offre.modeFormation?.id_mode?.toString() || '',
      statut: 'brouillon'
    });
    setIsCreateOffreOpen(true);
  };

  const handleSelectOffre = (offre: Offre) => {
    setSelectedOffre(offre);
    setOffreForm({
      date_debut: offre.date_debut,
      date_fin: offre.date_fin,
      id_specialite: offre?.specialite?.id_specialite?.toString() || '',
      id_diplome: offre?.diplome?.id_diplome?.toString() || '',
      id_mode: offre?.modeFormation?.id_mode?.toString() || '',
      statut: offre.statut,
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredOffres = offres.filter((offre) => {
    const matchesSearch = (offre.specialite?.designation_fr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.diplome?.designation_fr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.modeFormation?.designation_fr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offre.statut || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (offre.statut || '') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 rtl" dir="rtl">
      <div className="flex justify-between items-center mb-4 rtl-flex-reverse">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded text-right"
            dir="rtl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="font-arabic">الحالة:</Label>
          <Select
            value={statusFilter}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع</SelectItem>
              <SelectItem value="brouillon">مسودة</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="archivee">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateOffreOpen} onOpenChange={setIsCreateOffreOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="font-arabic">
                <Plus className="ml-2" />
                إنشاء عرض تكوين جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
              <DialogHeader>
                <DialogTitle className="font-arabic text-right">إنشاء عرض تكوين جديد</DialogTitle>
                <DialogDescription className="font-arabic text-right">
                  أدخل تفاصيل عرض التكوين الذي تريد إنشاءه.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date_debut" className="text-right font-arabic">
                    تاريخ البداية
                  </Label>
                  <Input
                    id="date_debut"
                    type="date"
                    value={offreForm.date_debut}
                    onChange={(e) => setOffreForm({ ...offreForm, date_debut: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date_fin" className="text-right font-arabic">
                    تاريخ النهاية
                  </Label>
                  <Input
                    id="date_fin"
                    type="date"
                    value={offreForm.date_fin}
                    onChange={(e) => setOffreForm({ ...offreForm, date_fin: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialite" className="text-right font-arabic">
                    التخصص
                  </Label>
                  <Select
                    value={offreForm.id_specialite}
                    onValueChange={(value) => setOffreForm({ ...offreForm, id_specialite: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialites.map((specialite) => (
                        <SelectItem key={specialite.id_specialite} value={specialite.id_specialite.toString()}>
                          {specialite.designation_ar || specialite.designation_fr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diplome" className="text-right font-arabic">
                    الشهادة
                  </Label>
                  <Select
                    value={offreForm.id_diplome}
                    onValueChange={(value) => setOffreForm({ ...offreForm, id_diplome: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر الشهادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {diplomes.map((diplome) => (
                        <SelectItem key={diplome.id_diplome} value={diplome.id_diplome.toString()}>
                          {diplome.designation_ar || diplome.designation_fr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mode" className="text-right font-arabic">
                    طريقة التكوين
                  </Label>
                  <Select
                    value={offreForm.id_mode}
                    onValueChange={(value) => setOffreForm({ ...offreForm, id_mode: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر طريقة التكوين" />
                    </SelectTrigger>
                    <SelectContent>
                      {modesFormation.map((mode) => (
                        <SelectItem key={mode.id_mode} value={mode.id_mode.toString()}>
                          {mode.designation_ar || mode.designation_fr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="statut" className="text-right font-arabic">
                    الحالة
                  </Label>
                  <Select
                    value={offreForm.statut}
                    onValueChange={(value) =>
                      setOffreForm({ ...offreForm, statut: value as 'brouillon' | 'active' | 'archivee' })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brouillon">مسودة</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="archivee">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateOffre} disabled={loading} className="font-arabic">
                  {loading ? 'جارٍ الإنشاء...' : 'إنشاء العرض'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-arabic">التخصص</TableHead>
            <TableHead className="font-arabic">الشهادة</TableHead>
            <TableHead className="font-arabic">طريقة التكوين</TableHead>
            <TableHead className="font-arabic">تاريخ البداية</TableHead>
            <TableHead className="font-arabic">تاريخ النهاية</TableHead>
            <TableHead className="font-arabic">الحالة</TableHead>
            <TableHead className="font-arabic">عدد التسجيلات</TableHead>
            <TableHead className="font-arabic">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center font-arabic">
                جارٍ التحميل...
              </TableCell>
            </TableRow>
          ) : filteredOffres.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center font-arabic">
                لم يتم العثور على عروض
              </TableCell>
            </TableRow>
          ) : (
            filteredOffres.map((offre) => (
              <TableRow key={offre.id_offre}>
                <TableCell>
                  {offre.specialite?.designation_ar || offre.specialite?.designation_fr || 'غير محدد'}
                </TableCell>
                <TableCell>
                  {offre.diplome?.designation_ar || offre.diplome?.designation_fr || 'غير محدد'}
                </TableCell>
                <TableCell>
                  {offre.modeFormation?.designation_ar || offre.modeFormation?.designation_fr || 'غير محدد'}
                </TableCell>
                <TableCell className="font-arabic">{offre.date_debut || 'غير محدد'}</TableCell>
                <TableCell className="font-arabic">{offre.date_fin || 'غير محدد'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      (offre.statut || '') === 'brouillon'
                        ? 'secondary'
                        : (offre.statut || '') === 'active'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {offre.statut === 'brouillon' ? 'مسودة' : 
                     offre.statut === 'active' ? 'نشط' : 
                     offre.statut === 'archivee' ? 'مؤرشف' : 
                     'غير محدد'}
                  </Badge>
                </TableCell>
                <TableCell>{offre.inscriptions_count || 0}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog open={isEditOffreOpen} onOpenChange={setIsEditOffreOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOffre(offre)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="font-arabic text-right">تعديل عرض</DialogTitle>
                        <DialogDescription className="font-arabic text-right">
                          أدخل تفاصيل العرض الذي تريد تعديله.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date_debut" className="text-right font-arabic">
                            تاريخ البداية
                          </Label>
                          <Input
                            id="date_debut"
                            type="date"
                            value={offreForm.date_debut}
                            onChange={(e) => setOffreForm({ ...offreForm, date_debut: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date_fin" className="text-right font-arabic">
                            تاريخ النهاية
                          </Label>
                          <Input
                            id="date_fin"
                            type="date"
                            value={offreForm.date_fin}
                            onChange={(e) => setOffreForm({ ...offreForm, date_fin: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="specialite" className="text-right font-arabic">
                            التخصص
                          </Label>
                          <Select
                            value={offreForm.id_specialite}
                            onValueChange={(value) => setOffreForm({ ...offreForm, id_specialite: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="اختر التخصص" />
                            </SelectTrigger>
                            <SelectContent>
                              {specialites.map((specialite) => (
                                <SelectItem key={specialite.id_specialite} value={specialite.id_specialite.toString()}>
                                  {specialite.designation_ar || specialite.designation_fr}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="diplome" className="text-right font-arabic">
                            الشهادة
                          </Label>
                          <Select
                            value={offreForm.id_diplome}
                            onValueChange={(value) => setOffreForm({ ...offreForm, id_diplome: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="اختر الشهادة" />
                            </SelectTrigger>
                            <SelectContent>
                              {diplomes.map((diplome) => (
                                <SelectItem key={diplome.id_diplome} value={diplome.id_diplome.toString()}>
                                  {diplome.designation_ar || diplome.designation_fr}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="mode" className="text-right font-arabic">
                            طريقة التكوين
                          </Label>
                          <Select
                            value={offreForm.id_mode}
                            onValueChange={(value) => setOffreForm({ ...offreForm, id_mode: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="اختر طريقة التكوين" />
                            </SelectTrigger>
                            <SelectContent>
                              {modesFormation.map((mode) => (
                                <SelectItem key={mode.id_mode} value={mode.id_mode.toString()}>
                                  {mode.designation_ar || mode.designation_fr}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="statut" className="text-right font-arabic">
                            الحالة
                          </Label>
                          <Select
                            value={offreForm.statut}
                            onValueChange={(value) =>
                              setOffreForm({ ...offreForm, statut: value as 'brouillon' | 'active' | 'archivee' })
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="brouillon">مسودة</SelectItem>
                              <SelectItem value="active">نشط</SelectItem>
                              <SelectItem value="archivee">مؤرشف</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => handleUpdateOffre()} disabled={loading} className="font-arabic">
                          {loading ? 'جارٍ التعديل...' : 'حفظ التعديلات'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog open={isDeleteOffreOpen} onOpenChange={setIsDeleteOffreOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOffre(offre);
                          setIsDeleteOffreOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-arabic text-right">هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription className="font-arabic text-right">
                          هذا الإجراء غير قابل للتراجع. سيتم حذف هذا العرض نهائياً.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOffre} disabled={loading} className="font-arabic bg-red-600 hover:bg-red-700">
                          {loading ? 'جارٍ الحذف...' : 'حذف نهائياً'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OffreManagement;
