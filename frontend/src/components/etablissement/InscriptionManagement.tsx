import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { formatDate } from '@/utils/formatDate';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UserCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Ban,
  Calendar,
  User,
  GraduationCap,
  Mail,
  Phone,
  FileText,
  Download,
  Filter
} from 'lucide-react';

interface Inscription {
  id_inscription: number;
  statut: string;
  date_inscription: string;
  date_decision?: string;
  observation?: string;
  stagiaire: {
    id_stagiaire: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
    email: string;
    telephone?: string;
    Compte: {
      username: string;
    };
  };
  offre: {
    id_offre: number;
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
}

const InscriptionManagement = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [selectedInscriptions, setSelectedInscriptions] = useState<number[]>([]);
  const [totalInscriptions, setTotalInscriptions] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(20);
  
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const [isBulkDecisionDialogOpen, setIsBulkDecisionDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  
  const [decisionForm, setDecisionForm] = useState({
    statut: '',
    observation: ''
  });

  useEffect(() => {
    if (userProfile?.id_etab_formation) {
      fetchInscriptions();
    }
  }, [userProfile, statusFilter, searchTerm, currentPage]);

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getInscriptionsByEtablissement(
        statusFilter,
        searchTerm,
        limit,
        currentPage * limit
      );
      
      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors du chargement');
      }

      setInscriptions(response.data.inscriptions || []);
      setTotalInscriptions(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل طلبات التسجيل',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionSubmit = async (single = true) => {
    try {
      setLoading(true);
      
      if (!decisionForm.statut) {
        toast({
          title: 'خطأ',
          description: 'يرجى اختيار قرار',
          variant: 'destructive'
        });
        return;
      }

      if (single && selectedInscription) {
        const response = await apiService.updateInscriptionStatusByEtablissement(
          selectedInscription.id_inscription,
          decisionForm.statut,
          decisionForm.observation
        );
        
        if (response.error) {
          throw new Error(response.error.message || 'خطأ في تحديث القرار');
        }

        toast({
          title: 'نجح',
          description: 'تم تحديث قرار التسجيل بنجاح',
        });
      } else if (!single && selectedInscriptions.length > 0) {
        const response = await apiService.bulkUpdateInscriptionsStatus(
          selectedInscriptions,
          decisionForm.statut,
          decisionForm.observation
        );
        
        if (response.error) {
          throw new Error(response.error.message || 'خطأ في تحديث القرارات');
        }

        toast({
          title: 'نجح',
          description: `تم تحديث ${selectedInscriptions.length} طلبات تسجيل بنجاح`,
        });
        
        setSelectedInscriptions([]);
      }

      setIsDecisionDialogOpen(false);
      setIsBulkDecisionDialogOpen(false);
      setSelectedInscription(null);
      setDecisionForm({ statut: '', observation: '' });
      fetchInscriptions();
      
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تحديث القرار',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSingleDecision = (inscription: Inscription, statut: string) => {
    setSelectedInscription(inscription);
    setDecisionForm({ statut, observation: '' });
    setIsDecisionDialogOpen(true);
  };

  const handleBulkDecision = (statut: string) => {
    if (selectedInscriptions.length === 0) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار طلبات التسجيل أولاً',
        variant: 'destructive'
      });
      return;
    }
    
    setDecisionForm({ statut, observation: '' });
    setIsBulkDecisionDialogOpen(true);
  };

  const handleSelectInscription = (id_inscription: number) => {
    setSelectedInscriptions(prev => 
      prev.includes(id_inscription)
        ? prev.filter(id => id !== id_inscription)
        : [...prev, id_inscription]
    );
  };

  const handleSelectAll = () => {
    if (selectedInscriptions.length === inscriptions.length) {
      setSelectedInscriptions([]);
    } else {
      setSelectedInscriptions(inscriptions.map(i => i.id_inscription));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acceptee':
        return 'bg-green-100 text-green-800';
      case 'refusee':
        return 'bg-red-100 text-red-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'annulee':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'acceptee':
        return <CheckCircle className="w-4 h-4" />;
      case 'refusee':
        return <XCircle className="w-4 h-4" />;
      case 'en_attente':
        return <Clock className="w-4 h-4" />;
      case 'annulee':
        return <Ban className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'acceptee':
        return 'مقبول';
      case 'refusee':
        return 'مرفوض';
      case 'en_attente':
        return 'في الانتظار';
      case 'annulee':
        return 'ملغى';
      default:
        return status;
    }
  };

  const filteredInscriptions = inscriptions.filter(inscription => {
    // Compute designation from related entities for search instead of using non-existent fields
    const offreDesignation_fr = inscription.offre.specialite && inscription.offre.diplome 
      ? `${inscription.offre.specialite.designation_fr} - ${inscription.offre.diplome.designation_fr}`
      : inscription.offre.specialite 
        ? inscription.offre.specialite.designation_fr 
        : 'Formation';
        
    const offreDesignation_ar = inscription.offre.specialite && inscription.offre.diplome 
      ? `${inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr} - ${inscription.offre.diplome.designation_ar || inscription.offre.diplome.designation_fr}`
      : inscription.offre.specialite 
        ? (inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr)
        : 'تكوين';

    return (
      inscription.stagiaire.nom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.stagiaire.prenom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offreDesignation_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offreDesignation_ar && offreDesignation_ar.includes(searchTerm))
    );
  });

  return (
    <div className="space-y-6 rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">إدارة التسجيلات</h2>
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            مراجعة وإدارة طلبات التسجيل في عروض التكوين
          </p>
        </div>
        
        {selectedInscriptions.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleBulkDecision('acceptee')}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="font-arabic">قبول المحدد ({selectedInscriptions.length})</span>
            </Button>
            <Button
              onClick={() => handleBulkDecision('refusee')}
              variant="destructive"
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span className="font-arabic">رفض المحدد ({selectedInscriptions.length})</span>
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="البحث بالاسم أو البريد الإلكتروني أو عرض التكوين..."
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
                <SelectItem value="en_attente">في الانتظار</SelectItem>
                <SelectItem value="acceptee">مقبول</SelectItem>
                <SelectItem value="refusee">مرفوض</SelectItem>
                <SelectItem value="annulee">ملغى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">
            طلبات التسجيل ({totalInscriptions})
            {selectedInscriptions.length > 0 && (
              <span className="text-blue-600"> - محدد: {selectedInscriptions.length}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredInscriptions.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد طلبات تسجيل</h3>
              <p className="text-gray-600 font-arabic">لم يتم العثور على أي طلبات تسجيل</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedInscriptions.length === filteredInscriptions.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-arabic">المتدرب</TableHead>
                    <TableHead className="font-arabic">عرض التكوين</TableHead>
                    <TableHead className="font-arabic">تاريخ التسجيل</TableHead>
                    <TableHead className="font-arabic">الحالة</TableHead>
                    <TableHead className="font-arabic">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInscriptions.map((inscription) => {
                    // Compute designation from related entities instead of using non-existent fields
                    const offreDesignation_fr = inscription.offre.specialite && inscription.offre.diplome 
                      ? `${inscription.offre.specialite.designation_fr} - ${inscription.offre.diplome.designation_fr}`
                      : inscription.offre.specialite 
                        ? inscription.offre.specialite.designation_fr 
                        : 'Formation';
                        
                    const offreDesignation_ar = inscription.offre.specialite && inscription.offre.diplome 
                      ? `${inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr} - ${inscription.offre.diplome.designation_ar || inscription.offre.diplome.designation_fr}`
                      : inscription.offre.specialite 
                        ? (inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr)
                        : 'تكوين';

                    return (
                      <TableRow key={inscription.id_inscription}>
                        <TableCell>
                          <Checkbox
                            checked={selectedInscriptions.includes(inscription.id_inscription)}
                            onCheckedChange={() => handleSelectInscription(inscription.id_inscription)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {inscription.stagiaire.prenom_fr} {inscription.stagiaire.nom_fr}
                              </p>
                              <p className="text-sm text-gray-600 font-arabic">
                                {inscription.stagiaire.prenom_ar} {inscription.stagiaire.nom_ar}
                              </p>
                              <p className="text-sm text-gray-500">{inscription.stagiaire.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{offreDesignation_fr}</p>
                            <p className="text-sm text-gray-600 font-arabic">{offreDesignation_ar}</p>
                            {inscription.offre.specialite && (
                              <div className="flex items-center gap-1 mt-1">
                                <GraduationCap className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500 font-arabic">
                                  {inscription.offre.specialite.designation_ar || inscription.offre.specialite.designation_fr}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {formatDate(inscription.date_inscription)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(inscription.statut)} gap-1 font-arabic`}>
                            {getStatusIcon(inscription.statut)}
                            {getStatusLabel(inscription.statut)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {inscription.statut === 'en_attente' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSingleDecision(inscription, 'acceptee')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleSingleDecision(inscription, 'refusee')}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInscription(inscription);
                                setIsViewDetailsOpen(true);
                              }}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalInscriptions > limit && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600 font-arabic">
                    عرض {currentPage * limit + 1} إلى {Math.min((currentPage + 1) * limit, totalInscriptions)} من {totalInscriptions}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      السابق
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={(currentPage + 1) * limit >= totalInscriptions}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Decision Dialog */}
      <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">
              {decisionForm.statut === 'acceptee' ? 'قبول التسجيل' : 'رفض التسجيل'}
            </DialogTitle>
            <DialogDescription className="font-arabic">
              هل أنت متأكد من {decisionForm.statut === 'acceptee' ? 'قبول' : 'رفض'} طلب التسجيل لـ{' '}
              {selectedInscription?.stagiaire.prenom_fr} {selectedInscription?.stagiaire.nom_fr}؟
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium font-arabic">ملاحظات (اختيارية)</label>
              <Textarea
                value={decisionForm.observation}
                onChange={(e) => setDecisionForm(prev => ({ ...prev, observation: e.target.value }))}
                placeholder="أدخل أي ملاحظات إضافية..."
                rows={3}
                dir="rtl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDecisionDialogOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={() => handleDecisionSubmit(true)}
              disabled={loading}
              className={decisionForm.statut === 'acceptee' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={decisionForm.statut === 'refusee' ? 'destructive' : 'default'}
            >
              {loading ? 'جاري المعالجة...' : (decisionForm.statut === 'acceptee' ? 'قبول' : 'رفض')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Decision Dialog */}
      <Dialog open={isBulkDecisionDialogOpen} onOpenChange={setIsBulkDecisionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">
              {decisionForm.statut === 'acceptee' ? 'قبول التسجيلات المحددة' : 'رفض التسجيلات المحددة'}
            </DialogTitle>
            <DialogDescription className="font-arabic">
              هل أنت متأكد من {decisionForm.statut === 'acceptee' ? 'قبول' : 'رفض'} {selectedInscriptions.length} طلبات تسجيل محددة؟
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium font-arabic">ملاحظات (اختيارية)</label>
              <Textarea
                value={decisionForm.observation}
                onChange={(e) => setDecisionForm(prev => ({ ...prev, observation: e.target.value }))}
                placeholder="أدخل أي ملاحظات إضافية..."
                rows={3}
                dir="rtl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDecisionDialogOpen(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
            <Button
              onClick={() => handleDecisionSubmit(false)}
              disabled={loading}
              className={decisionForm.statut === 'acceptee' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={decisionForm.statut === 'refusee' ? 'destructive' : 'default'}
            >
              {loading ? 'جاري المعالجة...' : (decisionForm.statut === 'acceptee' ? 'قبول الكل' : 'رفض الكل')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-arabic">تفاصيل طلب التسجيل</DialogTitle>
          </DialogHeader>
          
          {selectedInscription && (
            <div className="space-y-6">
              {/* Stagiaire Details */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 font-arabic">معلومات المتدرب</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">الاسم الكامل</label>
                    <p className="font-medium">
                      {selectedInscription.stagiaire.prenom_fr} {selectedInscription.stagiaire.nom_fr}
                    </p>
                    <p className="text-sm text-gray-600 font-arabic">
                      {selectedInscription.stagiaire.prenom_ar} {selectedInscription.stagiaire.nom_ar}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">البريد الإلكتروني</label>
                    <p className="font-medium">{selectedInscription.stagiaire.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">اسم المستخدم</label>
                    <p className="font-medium">{selectedInscription.stagiaire.Compte.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">رقم الهاتف</label>
                    <p className="font-medium">{selectedInscription.stagiaire.telephone || 'غير محدد'}</p>
                  </div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 font-arabic">معلومات عرض التكوين</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">عنوان العرض</label>
                    <p className="font-medium">
                      {selectedInscription.offre.specialite && selectedInscription.offre.diplome 
                        ? `${selectedInscription.offre.specialite.designation_fr} - ${selectedInscription.offre.diplome.designation_fr}`
                        : selectedInscription.offre.specialite 
                          ? selectedInscription.offre.specialite.designation_fr 
                          : 'Formation'}
                    </p>
                    {selectedInscription.offre.specialite && (
                      <p className="text-sm text-gray-600 font-arabic">
                        {selectedInscription.offre.specialite.designation_ar || selectedInscription.offre.specialite.designation_fr}
                      </p>
                    )}
                  </div>
                  {selectedInscription.offre.specialite && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 font-arabic">التخصص</label>
                      <p className="font-medium font-arabic">
                        {selectedInscription.offre.specialite.designation_ar || selectedInscription.offre.specialite.designation_fr}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Details */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 font-arabic">معلومات التسجيل</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">تاريخ التسجيل</label>
                    <p className="font-medium">
                      {formatDate(selectedInscription.date_inscription)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">الحالة الحالية</label>
                    <Badge className={`${getStatusColor(selectedInscription.statut)} gap-1 font-arabic`}>
                      {getStatusIcon(selectedInscription.statut)}
                      {getStatusLabel(selectedInscription.statut)}
                    </Badge>
                  </div>
                  {selectedInscription.date_decision && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 font-arabic">تاريخ القرار</label>
                      <p className="font-medium">
                        {formatDate(selectedInscription.date_decision)}
                      </p>
                    </div>
                  )}
                  {selectedInscription.observation && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600 font-arabic">ملاحظات</label>
                      <p className="font-medium font-arabic">{selectedInscription.observation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDetailsOpen(false)}
              className="font-arabic"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InscriptionManagement;