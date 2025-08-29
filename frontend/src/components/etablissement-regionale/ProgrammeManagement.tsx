import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Eye, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Calendar,
  Hash,
  Target,
  Building
} from 'lucide-react';

interface Programme {
  id_programme: number;
  titre_fr: string;
  titre_ar: string;
  description_fr?: string;
  description_ar?: string;
  objectifs_fr?: string;
  objectifs_ar?: string;
  duree_heures?: number;
  coefficient?: number;
  statut: string;
  date_creation: string;
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
  etablissementregionale: {
    id_etab_regionale: number;
    nom_fr: string;
    nom_ar: string;
    code: string;
  };
}

const ProgrammeManagement = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    limit: 10,
    offset: 0
  });
  const [total, setTotal] = useState(0);
  const { request } = useAuthApi();

  useEffect(() => {
    fetchProgrammes();
  }, [filters]);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        limit: filters.limit.toString(),
        offset: filters.offset.toString()
      });

      const response = await request(`/api/etablissement-regionale/programmes?${params}`);
      setProgrammes(response.data.programmes);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des programmes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'valide':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
      case 'rejete':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'border-l-yellow-500';
      case 'valide':
        return 'border-l-green-500';
      case 'rejete':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, offset: 0 }));
  };

  const handlePageChange = (newOffset: number) => {
    setFilters(prev => ({ ...prev, offset: newOffset }));
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Programmes</h1>
          <p className="text-gray-600">Consultez vos programmes pédagogiques proposés</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {total} programmes
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
                  placeholder="Titre du programme..."
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

      {/* Programmes List */}
      <div className="space-y-4">
        {programmes.map((programme) => (
          <Card key={programme.id_programme} className={`hover:shadow-md transition-shadow border-l-4 ${getStatusColor(programme.statut)}`}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{programme.titre_fr}</h3>
                    {getStatusBadge(programme.statut)}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{programme.titre_ar}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Module: {programme.module.designation_fr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le: {new Date(programme.date_creation).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {programme.duree_heures && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Durée: {programme.duree_heures}h</span>
                      </div>
                    )}
                    {programme.coefficient && (
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span>Coefficient: {programme.coefficient}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <strong>Module:</strong> {programme.module.designation_fr} ({programme.module.code_module})
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Spécialité:</strong> {programme.module.specialite.designation_fr}
                    </div>
                  </div>

                  {programme.description_fr && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm">
                        <strong>Description:</strong> {programme.description_fr}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedProgramme(programme)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Détails du programme</DialogTitle>
                      </DialogHeader>
                      {selectedProgramme && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* General Information */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Informations générales</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <strong>Titre FR:</strong> {selectedProgramme.titre_fr}
                                </div>
                                <div>
                                  <strong>Titre AR:</strong> {selectedProgramme.titre_ar}
                                </div>
                                <div>
                                  <strong>Statut:</strong> {getStatusBadge(selectedProgramme.statut)}
                                </div>
                                <div>
                                  <strong>Date de création:</strong> {new Date(selectedProgramme.date_creation).toLocaleDateString('fr-FR')}
                                </div>
                                {selectedProgramme.duree_heures && (
                                  <div>
                                    <strong>Durée:</strong> {selectedProgramme.duree_heures} heures
                                  </div>
                                )}
                                {selectedProgramme.coefficient && (
                                  <div>
                                    <strong>Coefficient:</strong> {selectedProgramme.coefficient}
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Module Information */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Module</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <strong>Désignation FR:</strong> {selectedProgramme.module.designation_fr}
                                </div>
                                <div>
                                  <strong>Désignation AR:</strong> {selectedProgramme.module.designation_ar}
                                </div>
                                <div>
                                  <strong>Code:</strong> {selectedProgramme.module.code_module}
                                </div>
                                <div>
                                  <strong>Spécialité:</strong> {selectedProgramme.module.specialite.designation_fr}
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Descriptions */}
                          {(selectedProgramme.description_fr || selectedProgramme.description_ar) && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Descriptions</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {selectedProgramme.description_fr && (
                                  <div>
                                    <strong>Description (Français):</strong>
                                    <p className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                      {selectedProgramme.description_fr}
                                    </p>
                                  </div>
                                )}
                                {selectedProgramme.description_ar && (
                                  <div>
                                    <strong>Description (Arabe):</strong>
                                    <p className="mt-2 p-3 bg-gray-50 rounded-lg text-sm" dir="rtl">
                                      {selectedProgramme.description_ar}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Objectives */}
                          {(selectedProgramme.objectifs_fr || selectedProgramme.objectifs_ar) && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Target className="h-5 w-5" />
                                  Objectifs
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {selectedProgramme.objectifs_fr && (
                                  <div>
                                    <strong>Objectifs (Français):</strong>
                                    <p className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                                      {selectedProgramme.objectifs_fr}
                                    </p>
                                  </div>
                                )}
                                {selectedProgramme.objectifs_ar && (
                                  <div>
                                    <strong>Objectifs (Arabe):</strong>
                                    <p className="mt-2 p-3 bg-blue-50 rounded-lg text-sm" dir="rtl">
                                      {selectedProgramme.objectifs_ar}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
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

      {programmes.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme trouvé</h3>
            <p className="text-gray-600">
              {filters.search || filters.status !== 'all' 
                ? 'Aucun programme ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore créé de programmes.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgrammeManagement;
