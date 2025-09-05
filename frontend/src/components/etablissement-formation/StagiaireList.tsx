import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/api';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  UserPlus,
  Key,
  Mail,
  Phone,
  Calendar,
  Globe
} from 'lucide-react';

interface Stagiaire {
  id_stagiaire: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar?: string;
  prenom_ar?: string;
  email?: string;
  telephone?: string;
  date_naissance?: string;
  Compte?: {
    id_compte: number;
    username: string;
    role: string;
    createdAt: string;
  };
}

const StagiaireList: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHasAccount, setFilterHasAccount] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('nom_fr');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadStagiaires();
  }, []);

  const loadStagiaires = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/etablissement/stagiaires');
      setStagiaires(response.data.stagiaires || []);
    } catch (error) {
      console.error('Erreur lors du chargement des stagiaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des stagiaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (stagiaireId: number) => {
    try {
      const username = `stagiaire_${stagiaireId}`;
      const password = `password_${Math.random().toString(36).substr(2, 8)}`;
      
      const response = await apiService.post(
        `/etablissement/stagiaires/${stagiaireId}/create-account`,
        { username, password }
      );

      toast({
        title: "Succès !",
        description: `Compte créé pour ${response.data.stagiaire.nom_fr} ${response.data.stagiaire.prenom_fr}`,
      });

      // Recharger la liste
      await loadStagiaires();

    } catch (error: any) {
      console.error('Erreur lors de la création du compte:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la création du compte",
        variant: "destructive"
      });
    }
  };

  const getAccountStatus = (stagiaire: Stagiaire) => {
    if (stagiaire.Compte) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <Key className="h-3 w-3 mr-1" />
          Compte actif
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-muted text-muted-foreground">
          <Key className="h-3 w-3 mr-1" />
          Pas de compte
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const sortStagiaires = (stagiaires: Stagiaire[]) => {
    return [...stagiaires].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'nom_fr':
          aValue = a.nom_fr.toLowerCase();
          bValue = b.nom_fr.toLowerCase();
          break;
        case 'prenom_fr':
          aValue = a.prenom_fr.toLowerCase();
          bValue = b.prenom_fr.toLowerCase();
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'date_naissance':
          aValue = a.date_naissance || '';
          bValue = b.date_naissance || '';
          break;
        default:
          aValue = a.nom_fr.toLowerCase();
          bValue = b.nom_fr.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredAndSortedStagiaires = sortStagiaires(
    stagiaires.filter(stagiaire => {
      const matchesSearch = 
        stagiaire.nom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.prenom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.telephone?.includes(searchTerm);
      
      const matchesFilter = 
        filterHasAccount === '' ||
        (filterHasAccount === 'with_account' && stagiaire.Compte) ||
        (filterHasAccount === 'without_account' && !stagiaire.Compte);
      
      return matchesSearch && matchesFilter;
    })
  );

  const exportStagiaires = () => {
    const csvContent = [
      ['ID', 'Nom', 'Prénom', 'Nom (AR)', 'Prénom (AR)', 'Email', 'Téléphone', 'Date de naissance', 'Compte', 'Username'],
      ...filteredAndSortedStagiaires.map(s => [
        s.id_stagiaire.toString(),
        s.nom_fr,
        s.prenom_fr,
        s.nom_ar || '',
        s.prenom_ar || '',
        s.email || '',
        s.telephone || '',
        s.date_naissance || '',
        s.Compte ? 'Oui' : 'Non',
        s.Compte?.username || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stagiaires_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Liste des Stagiaires ({filteredAndSortedStagiaires.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Rechercher</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Rechercher par nom, prénom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filter-account">Filtrer par compte</Label>
            <select
              id="filter-account"
              className="w-full p-2 border border-border-medium rounded-md"
              value={filterHasAccount}
              onChange={(e) => setFilterHasAccount(e.target.value)}
            >
              <option value="">Tous les stagiaires</option>
              <option value="with_account">Avec compte</option>
              <option value="without_account">Sans compte</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sort-by">Trier par</Label>
            <select
              id="sort-by"
              className="w-full p-2 border border-border-medium rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nom_fr">Nom</option>
              <option value="prenom_fr">Prénom</option>
              <option value="email">Email</option>
              <option value="date_naissance">Date de naissance</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sort-order">Ordre</Label>
            <select
              id="sort-order"
              className="w-full p-2 border border-border-medium rounded-md"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={exportStagiaires} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* Tableau des stagiaires */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border-medium">
            <thead>
              <tr className="bg-background-secondary">
                <th className="border border-border-medium px-4 py-2 text-left">Informations</th>
                <th className="border border-border-medium px-4 py-2 text-left">Contact</th>
                <th className="border border-border-medium px-4 py-2 text-left">Compte</th>
                <th className="border border-border-medium px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStagiaires.length === 0 ? (
                <tr>
                  <td colSpan={4} className="border border-border-medium px-4 py-2 text-center text-muted-foreground">
                    {loading ? 'Chargement...' : 'Aucun stagiaire trouvé'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedStagiaires.map((stagiaire) => (
                  <tr key={stagiaire.id_stagiaire} className="hover:bg-background-secondary">
                    <td className="border border-border-medium px-4 py-2">
                      <div className="space-y-1">
                        <div className="font-medium text-lg">
                          {stagiaire.nom_fr} {stagiaire.prenom_fr}
                        </div>
                        {(stagiaire.nom_ar || stagiaire.prenom_ar) && (
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {stagiaire.nom_ar} {stagiaire.prenom_ar}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          ID: {stagiaire.id_stagiaire}
                        </div>
                        {stagiaire.date_naissance && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(stagiaire.date_naissance)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="border border-border-medium px-4 py-2">
                      <div className="space-y-2">
                        {stagiaire.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                            {stagiaire.email}
                          </div>
                        )}
                        {stagiaire.telephone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {stagiaire.telephone}
                          </div>
                        )}
                        {!stagiaire.email && !stagiaire.telephone && (
                          <div className="text-xs text-muted-foreground">
                            Aucun contact
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="border border-border-medium px-4 py-2">
                      <div className="space-y-2">
                        {getAccountStatus(stagiaire)}
                        {stagiaire.Compte && (
                          <div className="text-xs text-muted-foreground">
                            <div>Username: {stagiaire.Compte.username}</div>
                            <div>Créé le: {formatDate(stagiaire.Compte.createdAt)}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="border border-border-medium px-4 py-2">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="Voir les détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {!stagiaire.Compte && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCreateAccount(stagiaire.id_stagiaire)}
                            title="Créer un compte"
                            className="text-primary hover:text-blue-800"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Statistiques */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="theme-transition-colors text-center p-3 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {stagiaires.length}
            </div>
            <div className="text-sm text-primary">Total stagiaires</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-success">
              {stagiaires.filter(s => s.Compte).length}
            </div>
            <div className="text-sm text-success">Avec compte</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-warning">
              {stagiaires.filter(s => !s.Compte).length}
            </div>
            <div className="text-sm text-warning">Sans compte</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary">
              {stagiaires.filter(s => s.email).length}
            </div>
            <div className="text-sm text-secondary">Avec email</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StagiaireList;
