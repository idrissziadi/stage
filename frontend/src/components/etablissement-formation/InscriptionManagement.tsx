import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/api';
import { 
  BookOpen, 
  UserPlus, 
  Users, 
  Save, 
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Stagiaire {
  id_stagiaire: number;
  nom_fr: string;
  prenom_fr: string;
  nom_ar?: string;
  prenom_ar?: string;
  email?: string;
  telephone?: string;
  Compte?: {
    username: string;
    role: string;
  };
}

interface Offre {
  id_offre: number;
  designation_fr: string;
  specialite?: {
    designation_fr: string;
  };
  diplome?: {
    designation_fr: string;
  };
}

interface Inscription {
  id_inscription: number;
  date_inscription: string;
  statut: string;
  stagiaire: Stagiaire;
  offre: Offre;
}

const InscriptionManagement: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState<number | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('');

  // États pour l'inscription en masse
  const [massInscriptionMode, setMassInscriptionMode] = useState(false);
  const [selectedStagiaires, setSelectedStagiaires] = useState<number[]>([]);
  const [massOffre, setMassOffre] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les stagiaires
      const stagiairesResponse = await apiService.get('/etablissement/stagiaires');
      setStagiaires(stagiairesResponse.data.stagiaires || []);
      
      // Charger les offres
      const offresResponse = await apiService.get('/etablissement/offres');
      setOffres(offresResponse.data.offres || []);
      
      // Charger les inscriptions
      const inscriptionsResponse = await apiService.get('/etablissement/inscriptions');
      setInscriptions(inscriptionsResponse.data.inscriptions || []);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInscriptionIndividuelle = async () => {
    if (!selectedStagiaire || !selectedOffre) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un stagiaire et une offre",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.post(
        `/etablissement/stagiaires/${selectedStagiaire}/inscrire`,
        { id_offre: selectedOffre }
      );

      toast({
        title: "Succès !",
        description: response.data.message,
      });

      // Recharger les inscriptions
      await loadData();
      
      // Réinitialiser la sélection
      setSelectedStagiaire(null);
      setSelectedOffre(null);

    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInscriptionEnMasse = async () => {
    if (!massOffre || selectedStagiaires.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une offre et au moins un stagiaire",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.post(
        '/etablissement/stagiaires/inscription-masse',
        {
          id_offre: massOffre,
          stagiaire_ids: selectedStagiaires
        }
      );

      toast({
        title: "Succès !",
        description: response.data.message,
      });

      // Recharger les données
      await loadData();
      
      // Réinitialiser l'inscription en masse
      setMassInscriptionMode(false);
      setSelectedStagiaires([]);
      setMassOffre(null);

    } catch (error: any) {
      console.error('Erreur lors de l\'inscription en masse:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de l'inscription en masse",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStagiaireSelection = (stagiaireId: number) => {
    setSelectedStagiaires(prev => 
      prev.includes(stagiaireId)
        ? prev.filter(id => id !== stagiaireId)
        : [...prev, stagiaireId]
    );
  };

  const getStatutBadge = (statut: string) => {
    const statutConfig = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'acceptee': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'refusee': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'annulee': { color: 'bg-muted text-foreground', icon: XCircle }
    };

    const config = statutConfig[statut as keyof typeof statutConfig] || statutConfig['en_attente'];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {statut.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredInscriptions = inscriptions.filter(inscription => {
    const matchesSearch = 
      inscription.stagiaire.nom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.stagiaire.prenom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.offre.designation_fr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterStatut || inscription.statut === filterStatut;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Inscription individuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inscription Individuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stagiaire">Sélectionner un stagiaire</Label>
              <select
                id="stagiaire"
                className="w-full p-2 border border-border-medium rounded-md"
                value={selectedStagiaire || ''}
                onChange={(e) => setSelectedStagiaire(parseInt(e.target.value) || null)}
              >
                <option value="">Choisir un stagiaire</option>
                {stagiaires.map((stagiaire) => (
                  <option key={stagiaire.id_stagiaire} value={stagiaire.id_stagiaire}>
                    {stagiaire.nom_fr} {stagiaire.prenom_fr}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offre">Sélectionner une offre</Label>
              <select
                id="offre"
                className="w-full p-2 border border-border-medium rounded-md"
                value={selectedOffre || ''}
                onChange={(e) => setSelectedOffre(parseInt(e.target.value) || null)}
              >
                <option value="">Choisir une offre</option>
                {offres.map((offre) => (
                  <option key={offre.id_offre} value={offre.id_offre}>
                    {offre.designation_fr}
                    {offre.specialite && ` - ${offre.specialite.designation_fr}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleInscriptionIndividuelle}
                disabled={!selectedStagiaire || !selectedOffre || loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Inscription...' : 'Inscrire'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inscription en masse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Inscription en Masse
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!massInscriptionMode ? (
            <Button
              onClick={() => setMassInscriptionMode(true)}
              variant="outline"
            >
              <Users className="h-4 w-4 mr-2" />
              Activer l'inscription en masse
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mass-offre">Sélectionner une offre</Label>
                  <select
                    id="mass-offre"
                    className="w-full p-2 border border-border-medium rounded-md"
                    value={massOffre || ''}
                    onChange={(e) => setMassOffre(parseInt(e.target.value) || null)}
                  >
                    <option value="">Choisir une offre</option>
                    {offres.map((offre) => (
                      <option key={offre.id_offre} value={offre.id_offre}>
                        {offre.designation_fr}
                        {offre.specialite && ` - ${offre.specialite.designation_fr}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button
                    onClick={handleInscriptionEnMasse}
                    disabled={!massOffre || selectedStagiaires.length === 0 || loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Inscription...' : `Inscrire ${selectedStagiaires.length} stagiaire(s)`}
                  </Button>
                  <Button
                    onClick={() => {
                      setMassInscriptionMode(false);
                      setSelectedStagiaires([]);
                      setMassOffre(null);
                    }}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sélectionner les stagiaires</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {stagiaires.map((stagiaire) => (
                    <label key={stagiaire.id_stagiaire} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStagiaires.includes(stagiaire.id_stagiaire)}
                        onChange={() => toggleStagiaireSelection(stagiaire.id_stagiaire)}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {stagiaire.nom_fr} {stagiaire.prenom_fr}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des inscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Liste des Inscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par nom, prénom ou offre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-statut">Filtrer par statut</Label>
              <select
                id="filter-statut"
                className="w-full p-2 border border-border-medium rounded-md"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="acceptee">Acceptée</option>
                <option value="refusee">Refusée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
          </div>

          {/* Tableau des inscriptions */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border-medium">
              <thead>
                <tr className="bg-background-secondary">
                  <th className="border border-border-medium px-4 py-2 text-left">Stagiaire</th>
                  <th className="border border-border-medium px-4 py-2 text-left">Offre</th>
                  <th className="border border-border-medium px-4 py-2 text-left">Date d'inscription</th>
                  <th className="border border-border-medium px-4 py-2 text-left">Statut</th>
                  <th className="border border-border-medium px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-border-medium px-4 py-2 text-center text-muted-foreground">
                      Aucune inscription trouvée
                    </td>
                  </tr>
                ) : (
                  filteredInscriptions.map((inscription) => (
                    <tr key={inscription.id_inscription} className="hover:bg-background-secondary">
                      <td className="border border-border-medium px-4 py-2">
                        <div>
                          <div className="font-medium">
                            {inscription.stagiaire.nom_fr} {inscription.stagiaire.prenom_fr}
                          </div>
                          {inscription.stagiaire.email && (
                            <div className="text-sm text-muted-foreground">{inscription.stagiaire.email}</div>
                          )}
                        </div>
                      </td>
                      <td className="border border-border-medium px-4 py-2">
                        <div>
                          <div className="font-medium">{inscription.offre.designation_fr}</div>
                          {inscription.offre.specialite && (
                            <div className="text-sm text-muted-foreground">
                              {inscription.offre.specialite.designation_fr}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border border-border-medium px-4 py-2">
                        {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="border border-border-medium px-4 py-2">
                        {getStatutBadge(inscription.statut)}
                      </td>
                      <td className="border border-border-medium px-4 py-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Statistiques */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="theme-transition-colors text-center p-3 bg-background-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {inscriptions.length}
              </div>
              <div className="text-sm text-primary">Total inscriptions</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {inscriptions.filter(i => i.statut === 'en_attente').length}
              </div>
              <div className="text-sm text-warning">En attente</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {inscriptions.filter(i => i.statut === 'acceptee').length}
              </div>
              <div className="text-sm text-success">Acceptées</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-error">
                {inscriptions.filter(i => i.statut === 'refusee').length}
              </div>
              <div className="text-sm text-error">Refusées</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InscriptionManagement;
