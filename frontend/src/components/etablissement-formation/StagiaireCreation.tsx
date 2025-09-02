import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/api';
import { 
  UserPlus, 
  User, 
  BookOpen, 
  Save, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface StagiaireFormData {
  nom_fr: string;
  prenom_fr: string;
  nom_ar: string;
  prenom_ar: string;
  email: string;
  telephone: string;
  date_naissance: string;
  username: string;
  password: string;
  id_offre?: number;
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

const StagiaireCreation: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [activeTab, setActiveTab] = useState('simple');

  const [formData, setFormData] = useState<StagiaireFormData>({
    nom_fr: '',
    prenom_fr: '',
    nom_ar: '',
    prenom_ar: '',
    email: '',
    telephone: '',
    date_naissance: '',
    username: '',
    password: ''
  });

  const [createAccount, setCreateAccount] = useState(false);
  const [autoInscription, setAutoInscription] = useState(false);

  // Charger les offres disponibles
  useEffect(() => {
    loadOffres();
  }, []);

  const loadOffres = async () => {
    try {
      const response = await apiService.get('/etablissement/offres');
      setOffres(response.data.offres || []);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    }
  };

  const handleInputChange = (field: keyof StagiaireFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nom_fr.trim() || !formData.prenom_fr.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom et prénom en français sont obligatoires",
        variant: "destructive"
      });
      return false;
    }

    if (createAccount && (!formData.username.trim() || !formData.password.trim())) {
      toast({
        title: "Erreur de validation",
        description: "Le nom d'utilisateur et mot de passe sont obligatoires pour créer un compte",
        variant: "destructive"
      });
      return false;
    }

    if (autoInscription && !formData.id_offre) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner une offre pour l'inscription automatique",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        nom_fr: formData.nom_fr,
        prenom_fr: formData.prenom_fr,
        nom_ar: formData.nom_ar || undefined,
        prenom_ar: formData.prenom_ar || undefined,
        email: formData.email || undefined,
        telephone: formData.telephone || undefined,
        date_naissance: formData.date_naissance || undefined,
        ...(createAccount && {
          username: formData.username,
          password: formData.password
        }),
        ...(autoInscription && formData.id_offre && {
          id_offre: formData.id_offre
        })
      };

      const response = await apiService.post('/etablissement/stagiaires', payload);

      toast({
        title: "Succès !",
        description: response.data.message,
      });

      // Réinitialiser le formulaire
      setFormData({
        nom_fr: '',
        prenom_fr: '',
        nom_ar: '',
        prenom_ar: '',
        email: '',
        telephone: '',
        date_naissance: '',
        username: '',
        password: ''
      });
      setCreateAccount(false);
      setAutoInscription(false);

      // Afficher les détails de la création
      if (response.data.stagiaire) {
        console.log('Stagiaire créé:', response.data.stagiaire);
        if (response.data.compte) {
          console.log('Compte créé:', response.data.compte);
        }
        if (response.data.inscription) {
          console.log('Inscription créée:', response.data.inscription);
        }
      }

    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la création du stagiaire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom_fr: '',
      prenom_fr: '',
      nom_ar: '',
      prenom_ar: '',
      email: '',
      telephone: '',
      date_naissance: '',
      username: '',
      password: ''
    });
    setCreateAccount(false);
    setAutoInscription(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Création de Stagiaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simple">Création Simple</TabsTrigger>
            <TabsTrigger value="compte">Avec Compte</TabsTrigger>
            <TabsTrigger value="complet">Création Complète</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_fr">Nom en français *</Label>
                <Input
                  id="nom_fr"
                  value={formData.nom_fr}
                  onChange={(e) => handleInputChange('nom_fr', e.target.value)}
                  placeholder="Nom du stagiaire"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom_fr">Prénom en français *</Label>
                <Input
                  id="prenom_fr"
                  value={formData.prenom_fr}
                  onChange={(e) => handleInputChange('prenom_fr', e.target.value)}
                  placeholder="Prénom du stagiaire"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+212-6-1234-5678"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compte" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_fr_compte">Nom en français *</Label>
                <Input
                  id="nom_fr_compte"
                  value={formData.nom_fr}
                  onChange={(e) => handleInputChange('nom_fr', e.target.value)}
                  placeholder="Nom du stagiaire"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom_fr_compte">Prénom en français *</Label>
                <Input
                  id="prenom_fr_compte"
                  value={formData.prenom_fr}
                  onChange={(e) => handleInputChange('prenom_fr', e.target.value)}
                  placeholder="Prénom du stagiaire"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="nom.prenom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mot de passe sécurisé"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_compte">Email</Label>
                <Input
                  id="email_compte"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone_compte">Téléphone</Label>
                <Input
                  id="telephone_compte"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+212-6-1234-5678"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="complet" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_fr_complet">Nom en français *</Label>
                <Input
                  id="nom_fr_complet"
                  value={formData.nom_fr}
                  onChange={(e) => handleInputChange('nom_fr', e.target.value)}
                  placeholder="Nom du stagiaire"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom_fr_complet">Prénom en français *</Label>
                <Input
                  id="prenom_fr_complet"
                  value={formData.prenom_fr}
                  onChange={(e) => handleInputChange('prenom_fr', e.target.value)}
                  placeholder="Prénom du stagiaire"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom_ar">Nom en arabe</Label>
                <Input
                  id="nom_ar"
                  value={formData.nom_ar}
                  onChange={(e) => handleInputChange('nom_ar', e.target.value)}
                  placeholder="اسم العائلة"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom_ar">Prénom en arabe</Label>
                <Input
                  id="prenom_ar"
                  value={formData.prenom_ar}
                  onChange={(e) => handleInputChange('prenom_ar', e.target.value)}
                  placeholder="الاسم الأول"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_naissance">Date de naissance</Label>
                <Input
                  id="date_naissance"
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_complet">Email</Label>
                <Input
                  id="email_complet"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone_complet">Téléphone</Label>
                <Input
                  id="telephone_complet"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+212-6-1234-5678"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch
                  id="create-account"
                  checked={createAccount}
                  onCheckedChange={setCreateAccount}
                />
                <Label htmlFor="create-account">Créer un compte utilisateur</Label>
              </div>

              {createAccount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="username_complet">Nom d'utilisateur *</Label>
                    <Input
                      id="username_complet"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="nom.prenom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_complet">Mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password_complet"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Mot de passe sécurisé"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-inscription"
                  checked={autoInscription}
                  onCheckedChange={setAutoInscription}
                />
                <Label htmlFor="auto-inscription">Inscription automatique à une offre</Label>
              </div>

              {autoInscription && (
                <div className="pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="offre">Sélectionner une offre</Label>
                    <select
                      id="offre"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.id_offre || ''}
                      onChange={(e) => handleInputChange('id_offre', parseInt(e.target.value) || 0)}
                    >
                      <option value="">Sélectionner une offre</option>
                      {offres.map((offre) => (
                        <option key={offre.id_offre} value={offre.id_offre}>
                          {offre.designation_fr}
                          {offre.specialite && ` - ${offre.specialite.designation_fr}`}
                          {offre.diplome && ` (${offre.diplome.designation_fr})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Création...' : 'Créer le stagiaire'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StagiaireCreation;
