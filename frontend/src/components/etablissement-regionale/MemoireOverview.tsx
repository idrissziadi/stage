import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  GraduationCap, 
  Eye, 
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

interface Memoire {
  id_memoire: number;
  titre_fr: string;
  titre_ar: string;
  statut: string;
  createdAt: string;
  enseignant: {
    id_enseignant: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
    etablissementformation: {
      nom_fr: string;
      nom_ar: string;
    };
  };
  stagiaire: {
    id_stagiaire: number;
    nom_fr: string;
    prenom_fr: string;
    nom_ar: string;
    prenom_ar: string;
  };
}

const MemoireOverview = () => {
  const [memoires, setMemoires] = useState<Memoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemoire, setSelectedMemoire] = useState<Memoire | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    limit: 10,
    offset: 0
  });
  const [total, setTotal] = useState(0);
  const { request } = useAuthApi();

  useEffect(() => {
    fetchMemoires();
  }, [filters]);

  const fetchMemoires = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        limit: filters.limit.toString(),
        offset: filters.offset.toString()
      });

      const response = await request(`/api/etablissement-regionale/memoires?${params}`);
      setMemoires(response.data.memoires);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des mémoires');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_preparation':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><FileText className="w-3 h-3 mr-1" />En préparation</Badge>;
      case 'en_attente':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'accepte':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepté</Badge>;
      case 'refuse':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Refusé</Badge>;
      case 'soutenu':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><GraduationCap className="w-3 h-3 mr-1" />Soutenu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_preparation':
        return 'border-l-blue-500';
      case 'en_attente':
        return 'border-l-yellow-500';
      case 'accepte':
        return 'border-l-green-500';
      case 'refuse':
        return 'border-l-red-500';
      case 'soutenu':
        return 'border-l-purple-500';
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
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble des Mémoires</h1>
          <p className="text-gray-600">Consultez les mémoires supervisés par vos enseignants</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {total} mémoires
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
                  placeholder="Titre du mémoire..."
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
                  <SelectItem value="en_preparation">En préparation</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="accepte">Accepté</SelectItem>
                  <SelectItem value="refuse">Refusé</SelectItem>
                  <SelectItem value="soutenu">Soutenu</SelectItem>
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

      {/* Memoires List */}
      <div className="space-y-4">
        {memoires.map((memoire) => (
          <Card key={memoire.id_memoire} className={`hover:shadow-md transition-shadow border-l-4 ${getStatusColor(memoire.statut)}`}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{memoire.titre_fr}</h3>
                    {getStatusBadge(memoire.statut)}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{memoire.titre_ar}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        Stagiaire: {memoire.stagiaire.prenom_fr} {memoire.stagiaire.nom_fr}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le: {new Date(memoire.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        Superviseur: {memoire.enseignant.prenom_fr} {memoire.enseignant.nom_fr}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{memoire.enseignant.etablissementformation.nom_fr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedMemoire(memoire)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Détails du mémoire</DialogTitle>
                      </DialogHeader>
                      {selectedMemoire && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Informations générales</h3>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                              <div><strong>Titre FR:</strong> {selectedMemoire.titre_fr}</div>
                              <div><strong>Titre AR:</strong> {selectedMemoire.titre_ar}</div>
                              <div><strong>Statut:</strong> {getStatusBadge(selectedMemoire.statut)}</div>
                              <div><strong>Date de création:</strong> {new Date(selectedMemoire.createdAt).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Stagiaire</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><strong>Nom FR:</strong> {selectedMemoire.stagiaire.prenom_fr} {selectedMemoire.stagiaire.nom_fr}</div>
                              <div><strong>Nom AR:</strong> {selectedMemoire.stagiaire.prenom_ar} {selectedMemoire.stagiaire.nom_ar}</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Enseignant superviseur</h3>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                              <div><strong>Nom FR:</strong> {selectedMemoire.enseignant.prenom_fr} {selectedMemoire.enseignant.nom_fr}</div>
                              <div><strong>Nom AR:</strong> {selectedMemoire.enseignant.prenom_ar} {selectedMemoire.enseignant.nom_ar}</div>
                              <div><strong>Établissement:</strong> {selectedMemoire.enseignant.etablissementformation.nom_fr}</div>
                            </div>
                          </div>
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

      {memoires.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun mémoire trouvé</h3>
            <p className="text-gray-600">
              {filters.search || filters.status !== 'all' 
                ? 'Aucun mémoire ne correspond à vos critères de recherche.'
                : 'Aucun mémoire n\'est supervisé pour le moment.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemoireOverview;
