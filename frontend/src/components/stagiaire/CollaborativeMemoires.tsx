import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService, getFileUrl } from '@/services/api';
import { formatDateToArabic, formatRelativeDateToArabic } from '@/utils/arabicDateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import CourseMemoirePDFViewer from '@/components/ui/course-memoire-pdf-viewer';
import { 
  Users, 
  FileText, 
  Eye, 
  Download, 
  Search,
  Filter,
  User,
  Calendar,
  CheckCircle,
  Star,
  Share2,
  BookOpen,
  GraduationCap,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Clock
} from 'lucide-react';

interface Memoire {
  id_memoire: number;
  titre_fr?: string;
  titre_ar?: string;
  fichierpdf?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  observation?: string;
  stagiaire?: {
    nom_fr: string;
    prenom_fr: string;
  };
  enseignant?: {
    nom_fr: string;
    prenom_fr: string;
  };
}

interface Inscription {
  id_inscription: number;
  id_offre: number;
  offre?: {
    designation_fr?: string;
    designation_ar?: string;
    specialite?: {
      designation_fr: string;
      designation_ar: string;
    };
  };
}

const CollaborativeMemoires = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialiteFilter, setSpecialiteFilter] = useState('all');
  const [selectedMemoire, setSelectedMemoire] = useState<Memoire | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.id_stagiaire) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Use the new detailed workflow API to get accepted memoires from colleagues
      const memoiresResponse = await apiService.getAcceptedMemoiresByOffers(userProfile.id_stagiaire);
      
      if (memoiresResponse.error) {
        if (memoiresResponse.error.status !== 404) {
          throw new Error(memoiresResponse.error.message || 'فشل في تحميل مذكرات الزملاء');
        }
        // 404 means no accepted memoires, which is fine
        setMemoires([]);
      } else {
        // Transform the data to match our interface
        const transformedMemoires = (memoiresResponse.data as any[] || []).map((memoire: any) => ({
          id_memoire: memoire.id_memoire,
          titre_fr: memoire.titre_fr,
          titre_ar: memoire.titre_ar,
          fichierpdf: memoire.fichierpdf,
          status: memoire.status,
          observation: memoire.observation,
          createdAt: memoire.createdAt || memoire.created_at,
          updatedAt: memoire.updatedAt || memoire.updated_at,
          stagiaire: memoire.stagiaire,
          enseignant: memoire.enseignant
        }));
        // Debug: Log the date format
        if (transformedMemoires.length > 0) {
          console.log('Collaborative memoires date format:', {
            createdAt: transformedMemoires[0].createdAt,
            updatedAt: transformedMemoires[0].updatedAt,
            type: typeof transformedMemoires[0].createdAt
          });
        }
        setMemoires(transformedMemoires);
      }
      
      // Get stagiaire's inscriptions to display specializations
      const inscriptionsResponse = await apiService.getInscriptionsByStagiaire(userProfile.id_stagiaire.toString());
      setInscriptions(inscriptionsResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching collaborative memoires:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في تحميل مذكرات الزملاء',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (memoire: Memoire) => {
    setSelectedMemoire(memoire);
    setIsPdfViewerOpen(true);
  };

  const handleDownloadPDF = async (memoire: Memoire) => {
    if (!memoire.fichierpdf) {
      toast({
        title: 'خطأ',
        description: 'لا يوجد ملف PDF لهذه المذكرة',
        variant: 'destructive'
      });
      return;
    }

    try {
      const pdfUrl = getFileUrl(memoire.fichierpdf, 'memoires');
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${memoire.titre_ar || memoire.titre_fr || 'memoire'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'نجح',
        description: 'تم تحميل الملف بنجاح',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الملف',
        variant: 'destructive'
      });
    }
  };

  const handleClosePDF = () => {
    setIsPdfViewerOpen(false);
    setSelectedMemoire(null);
  };

  const getSpecialiteStats = () => {
    // Get unique specializations from inscriptions
    const specialites = inscriptions.reduce((acc: any[], inscription) => {
      if (inscription.offre?.specialite) {
        const existing = acc.find(s => s.designation_ar === inscription.offre!.specialite!.designation_ar);
        if (!existing) {
          acc.push({
            designation_ar: inscription.offre.specialite.designation_ar,
            designation_fr: inscription.offre.specialite.designation_fr,
            memoireCount: 0
          });
        }
      }
      return acc;
    }, []);

    // We can't directly count memoires by specialite since the relationship is indirect
    // But we can show the specializations the student is enrolled in
    return specialites;
  };

  // Helper function to generate user initials for avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'MT';
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || 'MT';
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString: string) => {
    return formatRelativeDateToArabic(dateString);
  };

  // Helper function to safely format approval date with better handling
  const formatApprovalDate = (memoire: Memoire) => {
    // Try updatedAt first (approval date), then createdAt as fallback
    const dateToUse = memoire.updatedAt || memoire.createdAt;
    
    // Additional validation for date strings
    if (!dateToUse || 
        dateToUse === 'null' || 
        dateToUse === 'undefined' || 
        dateToUse === 'Invalid Date' ||
        dateToUse === '') {
      return 'غير محدد';
    }
    
    // Check if it's a valid date string
    const testDate = new Date(dateToUse);
    if (isNaN(testDate.getTime())) {
      console.warn('Invalid date format in memoire:', {
        id: memoire.id_memoire,
        dateToUse,
        createdAt: memoire.createdAt,
        updatedAt: memoire.updatedAt
      });
      return 'غير محدد';
    }
    
    return formatDateToArabic(dateToUse);
  };

  const filteredMemoires = memoires.filter(memoire => {
    const matchesSearch = memoire.titre_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.titre_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.stagiaire?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.enseignant?.nom_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memoire.enseignant?.prenom_fr?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For specialite filter, we would need more complex logic to match memoire to specialite
    // For now, we'll just use the search filter
    
    return matchesSearch;
  });

  const specialiteStats = getSpecialiteStats();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل مذكرات الزملاء...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">مذكرات الزملاء</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                استعرض المذكرات المعتمدة من زملائك في نفس عروض التكوين
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">التخصصات المسجل بها</p>
                <p className="text-2xl font-bold text-purple-700">{specialiteStats.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-pink-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">مذكرات الزملاء</p>
                <p className="text-2xl font-bold text-pink-700">{memoires.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 font-arabic">الزملاء المشاركون</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {[...new Set(memoires.map(m => `${m.stagiaire?.prenom_fr} ${m.stagiaire?.nom_fr}`))].length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specializations Info */}
      {specialiteStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">التخصصات المسجل بها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {specialiteStats.map((specialite, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 font-arabic">
                        {specialite.designation_ar || specialite.designation_fr}
                      </h3>
                      {specialite.designation_fr && specialite.designation_ar && (
                        <p className="text-sm text-gray-600">{specialite.designation_fr}</p>
                      )}
                    </div>
                    <Badge variant="secondary">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      تخصصك
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modern Search Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ابحث في مذكرات الزملاء... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 pl-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-right font-arabic focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                dir="rtl"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="font-arabic">البحث في العناوين، الأسماء، والمشرفين</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Style Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">
            مذكرات الزملاء ({filteredMemoires.length})
          </h2>
        </div>
        
        {filteredMemoires.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد مذكرات متاحة</h3>
              <p className="text-gray-600 font-arabic">
                {searchTerm 
                  ? 'لا توجد مذكرات تطابق معايير البحث'
                  : 'لا توجد مذكرات معتمدة من زملائك في نفس عروض التكوين حالياً'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredMemoires.map((memoire) => (
              <Card key={memoire.id_memoire} className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  {/* Post Header - Facebook Style */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* User Avatar */}
                        <Avatar className="w-12 h-12 border-2 border-gradient-to-r from-blue-400 to-purple-500">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                            {getUserInitials(memoire.stagiaire?.prenom_fr, memoire.stagiaire?.nom_fr)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                              {memoire.stagiaire?.prenom_fr} {memoire.stagiaire?.nom_fr}
                            </h3>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                              زميل
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="font-arabic">{getTimeAgo(memoire.createdAt)}</span>
                            <span className="mx-1">•</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              معتمد
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Post Options */}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-4">
                    {/* Memoire Title */}
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-arabic leading-relaxed">
                        {memoire.titre_ar || memoire.titre_fr || 'بدون عنوان'}
                      </h2>
                      
                      {/* French Title if different */}
                      {memoire.titre_fr && memoire.titre_ar && memoire.titre_fr !== memoire.titre_ar && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          {memoire.titre_fr}
                        </p>
                      )}
                    </div>
                    
                    {/* Memoire Description/Observation */}
                    {memoire.observation && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-arabic leading-relaxed">
                          {memoire.observation}
                        </p>
                      </div>
                    )}
                    
                    {/* Memoire Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      {memoire.enseignant && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">المشرف:</span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {memoire.enseignant.prenom_fr} {memoire.enseignant.nom_fr}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 bg-green-100 dark:bg-green-800 rounded-full">
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400 font-arabic">تاريخ الاعتماد:</span>
                          <p className="text-gray-900 dark:text-white font-medium font-arabic">
                            {formatApprovalDate(memoire)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Actions - Facebook Style */}
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between p-2">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        {memoire.fichierpdf && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPDF(memoire)}
                              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="font-arabic text-sm">عرض</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadPDF(memoire)}
                              className="flex items-center gap-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span className="font-arabic text-sm">تحميل</span>
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="font-arabic text-sm">مشاركة</span>
                        </Button>
                      </div>
                      
                      {/* Reading Status */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <BookOpen className="w-3 h-3" />
                        <span className="font-arabic">متاح للقراءة</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Educational Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1 font-arabic">ملاحظة تعليمية</h4>
              <p className="text-sm text-blue-800 font-arabic">
                هذه المذكرات متاحة للاطلاع والاستفادة من زملائك في نفس عروض التكوين. 
                يمكنك الاستفادة منها كمرجع أو لفهم أفضل لمتطلبات وشكل المذكرات المطلوبة في تخصصك.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      {selectedMemoire && (
        <CourseMemoirePDFViewer
          isOpen={isPdfViewerOpen}
          onClose={handleClosePDF}
          item={{
            ...selectedMemoire,
            titre_fr: selectedMemoire.titre_fr || '',
            created_at: selectedMemoire.createdAt
          }}
          type="memoire"
          userRole="Stagiaire"
        />
      )}
    </div>
  );
};

export default CollaborativeMemoires;