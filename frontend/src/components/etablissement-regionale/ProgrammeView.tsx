import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GraduationCap, 
  BookOpen, 
  Building, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatSafeDate } from '@/utils/dateHelpers';

interface Programme {
  id_programme: number;
  code_programme: string;
  titre_fr: string;
  titre_ar: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  module?: {
    designation_fr: string;
    designation_ar: string;
    code_module: string;
    specialite?: {
      designation_fr: string;
      designation_ar: string;
      branche?: {
        designation_fr: string;
        designation_ar: string;
      };
    };
  };
  enseignant?: {
    nom_fr: string;
    prenom_fr: string;
  };
}

interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
  id_specialite: number;
}

interface Specialite {
  id_specialite: number;
  code_specialite: string;
  designation_fr: string;
  designation_ar: string;
  id_branche: number;
}

interface Branche {
  id_branche: number;
  code_branche: string;
  designation_fr: string;
  designation_ar: string;
}

const ProgrammeView = () => {
  const { userProfile } = useAuthApi();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [branches, setBranches] = useState<Branche[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [specialiteFilter, setSpecialiteFilter] = useState('all');
  const [brancheFilter, setBrancheFilter] = useState('all');

  useEffect(() => {
    if (userProfile?.id_etab_regionale) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch programmes for this regional establishment
      const programmesResponse = await apiService.getProgrammesByEtablissementRegionale(userProfile.id_etab_regionale);
      setProgrammes(programmesResponse.data || []);
      
      // Fetch modules
      const modulesResponse = await apiService.getModules();
      setModules(modulesResponse.data || []);
      
      // Fetch specialites
      const specialitesResponse = await apiService.getAllSpecialites();
      console.log('Specialites response:', specialitesResponse);
      
      if (specialitesResponse.data && specialitesResponse.data.data) {
        setSpecialites(specialitesResponse.data.data);
      } else if (specialitesResponse.data && Array.isArray(specialitesResponse.data)) {
        setSpecialites(specialitesResponse.data);
      } else {
        console.error('Unexpected specialites response structure:', specialitesResponse);
        setSpecialites([]);
      }
      
      // Fetch branches
      const branchesResponse = await apiService.getBranches();
      setBranches(branchesResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching programmes data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleSpecialiteBranche = (programme: Programme) => {
    const module = modules.find(m => m.id_module === programme.module?.id_module);
    if (!module) return null;

    const specialite = specialites.find(s => s.id_specialite === module.id_specialite);
    if (!specialite) return null;

    const branche = branches.find(b => b.id_branche === specialite.id_branche);
    if (!branche) return null;

    return { module, specialite, branche };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مقبول':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'مرفوض':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'في_الانتظار':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مقبول':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'مرفوض':
        return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'في_الانتظار':
        return <Clock className="w-4 h-4 mr-1" />;
      default:
        return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'مقبول':
        return 'مقبول';
      case 'مرفوض':
        return 'مرفوض';
      case 'في_الانتظار':
        return 'في الانتظار';
      default:
        return status;
    }
  };

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.code_programme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.enseignant?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.enseignant?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || programme.status === statusFilter;
    const matchesModule = moduleFilter === 'all' || programme.module?.id_module?.toString() === moduleFilter;
    
    const programmeInfo = getModuleSpecialiteBranche(programme);
    const matchesSpecialite = specialiteFilter === 'all' || 
      (programmeInfo && programmeInfo.specialite.id_specialite.toString() === specialiteFilter);
    const matchesBranche = brancheFilter === 'all' || 
      (programmeInfo && programmeInfo.branche.id_branche.toString() === brancheFilter);
    
    return matchesSearch && matchesStatus && matchesModule && matchesSpecialite && matchesBranche;
  });

  const getStats = () => {
    const totalProgrammes = programmes.length;
    const acceptedProgrammes = programmes.filter(p => p.status === 'مقبول').length;
    const rejectedProgrammes = programmes.filter(p => p.status === 'مرفوض').length;
    const pendingProgrammes = programmes.filter(p => p.status === 'في_الانتظار').length;
    
    const uniqueModules = [...new Set(programmes.map(p => p.module?.id_module).filter(Boolean))].length;
    const uniqueSpecialites = [...new Set(
      programmes.map(p => getModuleSpecialiteBranche(p)?.specialite?.id_specialite).filter(Boolean)
    )].length;
    const uniqueBranches = [...new Set(
      programmes.map(p => getModuleSpecialiteBranche(p)?.branche?.id_branche).filter(Boolean)
    )].length;

    return {
      totalProgrammes,
      acceptedProgrammes,
      rejectedProgrammes,
      pendingProgrammes,
      uniqueModules,
      uniqueSpecialites,
      uniqueBranches
    };
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل البرامج...</p>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">البرامج التعليمية</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                استعرض وإدارة البرامج التعليمية في مؤسستك الإقليمية
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي البرامج</p>
                <p className="text-2xl font-bold text-purple-700">{stats.totalProgrammes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">البرامج المقبولة</p>
                <p className="text-2xl font-bold text-green-700">{stats.acceptedProgrammes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingProgrammes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">المواد</p>
                <p className="text-2xl font-bold text-blue-700">{stats.uniqueModules}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ابحث في البرامج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 pl-4 py-3"
                dir="rtl"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مقبول">مقبول</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
                <SelectItem value="في_الانتظار">في الانتظار</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={brancheFilter} onValueChange={setBrancheFilter}>
              <SelectTrigger className="w-[150px]">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue placeholder="الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                {branches.map(branche => (
                  <SelectItem key={branche.id_branche} value={branche.id_branche.toString()}>
                    {branche.designation_ar || branche.designation_fr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={specialiteFilter} onValueChange={setSpecialiteFilter}>
              <SelectTrigger className="w-[150px]">
                <GraduationCap className="w-4 h-4 mr-2" />
                <SelectValue placeholder="التخصص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التخصصات</SelectItem>
                {specialites
                  .filter(s => brancheFilter === 'all' || s.id_branche.toString() === brancheFilter)
                  .map(specialite => (
                    <SelectItem key={specialite.id_specialite} value={specialite.id_specialite.toString()}>
                      {specialite.designation_ar || specialite.designation_fr}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[150px]">
                <BookOpen className="w-4 h-4 mr-2" />
                <SelectValue placeholder="المادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواد</SelectItem>
                {modules
                  .filter(m => {
                    if (specialiteFilter === 'all') return true;
                    return m.id_specialite.toString() === specialiteFilter;
                  })
                  .map(module => (
                    <SelectItem key={module.id_module} value={module.id_module.toString()}>
                      {module.designation_ar || module.designation_fr}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Programmes List */}
      <Card>
        <CardHeader>
          <CardTitle>البرامج ({filteredProgrammes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProgrammes.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد برامج</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || moduleFilter !== 'all' || specialiteFilter !== 'all' || brancheFilter !== 'all'
                  ? 'لا توجد برامج تطابق معايير البحث'
                  : 'لم يتم إنشاء أي برامج بعد'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProgrammes.map((programme) => {
                const programmeInfo = getModuleSpecialiteBranche(programme);
                return (
                  <div key={programme.id_programme} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {programme.titre_ar || programme.titre_fr || 'بدون عنوان'}
                          </h3>
                          <Badge className={getStatusColor(programme.status)}>
                            {getStatusIcon(programme.status)}
                            <span className="mr-1">{getStatusText(programme.status)}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">كود البرنامج:</span> {programme.code_programme}</p>
                          
                          {programmeInfo && (
                            <>
                              <p><span className="font-medium">المادة:</span> {programmeInfo.module.designation_ar || programmeInfo.module.designation_fr}</p>
                              <p><span className="font-medium">التخصص:</span> {programmeInfo.specialite.designation_ar || programmeInfo.specialite.designation_fr}</p>
                              <p><span className="font-medium">الفرع:</span> {programmeInfo.branche.designation_ar || programmeInfo.branche.designation_fr}</p>
                            </>
                          )}
                          
                          <p><span className="font-medium">تاريخ الإنشاء:</span> {formatSafeDate(programme.created_at)}</p>
                          {programme.enseignant && (
                            <p><span className="font-medium">الأستاذ:</span> {programme.enseignant.prenom_fr} {programme.enseignant.nom_fr}</p>
                          )}
                          {programme.titre_fr && programme.titre_ar && (
                            <p><span className="font-medium">بالفرنسية:</span> {programme.titre_fr}</p>
                          )}
                        </div>
                        
                        {programme.description && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-arabic leading-relaxed">
                              {programme.description}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          title="عرض التفاصيل"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          title="تحميل"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgrammeView;
