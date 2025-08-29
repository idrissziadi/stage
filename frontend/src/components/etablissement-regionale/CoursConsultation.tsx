import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { getFileUrl } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building,
  Calendar,
  FileText
} from 'lucide-react';

interface Course {
  id_cours: number;
  code_cours: string;
  titre_fr: string;
  titre_ar: string;
  status: string;
  createdAt: string;
  fichierpdf?: string;
  observation?: string;
  enseignant: {
    id_enseignant: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
    email: string;
    grade: {
      designation_fr: string;
      designation_ar: string;
    };
    etablissementformation: {
      nom_fr: string;
      nom_ar: string;
    };
  };
  module: {
    id_module: number;
    designation_fr: string;
    designation_ar: string;
    code_module: string;
    specialite: {
      designation_fr: string;
      designation_ar: string;
    };
  };
}

const CoursConsultation = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    limit: 10,
    offset: 0
  });
  const [total, setTotal] = useState(0);
  const { request } = useAuthApi();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        limit: filters.limit.toString(),
        offset: filters.offset.toString()
      });

      const response = await request(`/api/etablissement-regionale/cours?${params}`);
      setCourses(response.data.cours);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'في_الانتظار':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'مقبول':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
      case 'مرفوض':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, offset: 0 }));
  };

  const handlePageChange = (newOffset: number) => {
    setFilters(prev => ({ ...prev, offset: newOffset }));
  };

  const downloadFile = async (filename: string, courseTitle: string) => {
    try {
      const fileUrl = getFileUrl(filename);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${courseTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation des Cours</h1>
          <p className="text-gray-600">Consultez et gérez les cours déposés par vos enseignants</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {total} cours
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Titre du cours, code..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, offset: 0 }))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="rejete">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id_cours} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{course.titre_fr}</h3>
                    {getStatusBadge(course.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{course.titre_ar}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Code: {course.code_cours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le: {new Date(course.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {course.enseignant.prenom_fr} {course.enseignant.nom_fr}
                        {course.enseignant.grade && ` (${course.enseignant.grade.designation_fr})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{course.enseignant.etablissementformation.nom_fr}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <strong>Module:</strong> {course.module.designation_fr} ({course.module.code_module})
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Spécialité:</strong> {course.module.specialite.designation_fr}
                    </div>
                  </div>

                  {course.observation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm">
                        <strong>Observation:</strong> {course.observation}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Détails du cours</DialogTitle>
                      </DialogHeader>
                      {selectedCourse && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Informations générales</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><strong>Titre FR:</strong> {selectedCourse.titre_fr}</div>
                              <div><strong>Titre AR:</strong> {selectedCourse.titre_ar}</div>
                              <div><strong>Code:</strong> {selectedCourse.code_cours}</div>
                              <div><strong>Statut:</strong> {getStatusBadge(selectedCourse.status)}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Enseignant</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><strong>Nom:</strong> {selectedCourse.enseignant.prenom_fr} {selectedCourse.enseignant.nom_fr}</div>
                              <div><strong>Email:</strong> {selectedCourse.enseignant.email}</div>
                              <div><strong>Grade:</strong> {selectedCourse.enseignant.grade?.designation_fr}</div>
                              <div><strong>Établissement:</strong> {selectedCourse.enseignant.etablissementformation.nom_fr}</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Module</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><strong>Désignation:</strong> {selectedCourse.module.designation_fr}</div>
                              <div><strong>Code:</strong> {selectedCourse.module.code_module}</div>
                              <div><strong>Spécialité:</strong> {selectedCourse.module.specialite.designation_fr}</div>
                            </div>
                          </div>

                          {selectedCourse.fichierpdf && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => downloadFile(selectedCourse.fichierpdf!, selectedCourse.titre_fr)}
                                className="flex-1"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger le fichier PDF
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {course.fichierpdf && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(course.fichierpdf!, course.titre_fr)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {total > filters.limit && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            disabled={filters.offset === 0}
            onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            {filters.offset + 1} - {Math.min(filters.offset + filters.limit, total)} sur {total}
          </span>
          <Button
            variant="outline"
            disabled={filters.offset + filters.limit >= total}
            onClick={() => handlePageChange(filters.offset + filters.limit)}
          >
            Suivant
          </Button>
        </div>
      )}

      {courses.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-600">
              {filters.search || filters.status !== 'all' 
                ? 'Aucun cours ne correspond à vos critères de recherche.'
                : 'Aucun cours n\'a été déposé pour le moment.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursConsultation;
