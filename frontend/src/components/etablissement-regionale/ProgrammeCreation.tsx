import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Save, 
  X, 
  BookOpen,
  FileText,
  Target,
  Clock,
  Hash
} from 'lucide-react';

interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
  specialite: {
    id_specialite: number;
    designation_fr: string;
    designation_ar: string;
    code_specialite: string;
  };
}

interface ProgrammeForm {
  id_module: string;
  titre_fr: string;
  titre_ar: string;
  description_fr: string;
  description_ar: string;
  objectifs_fr: string;
  objectifs_ar: string;
  duree_heures: string;
  coefficient: string;
}

const ProgrammeCreation = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProgrammeForm>({
    id_module: '',
    titre_fr: '',
    titre_ar: '',
    description_fr: '',
    description_ar: '',
    objectifs_fr: '',
    objectifs_ar: '',
    duree_heures: '',
    coefficient: ''
  });
  const [errors, setErrors] = useState<Partial<ProgrammeForm>>({});
  const { request } = useAuthApi();
  const { toast } = useToast();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await request('/api/etablissement-regionale/modules');
      setModules(response.data);
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || 'Erreur lors du chargement des modules',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProgrammeForm> = {};

    if (!form.id_module) newErrors.id_module = 'Le module est requis';
    if (!form.titre_fr.trim()) newErrors.titre_fr = 'Le titre en français est requis';
    if (!form.titre_ar.trim()) newErrors.titre_ar = 'Le titre en arabe est requis';
    if (form.duree_heures && isNaN(Number(form.duree_heures))) {
      newErrors.duree_heures = 'La durée doit être un nombre';
    }
    if (form.coefficient && isNaN(Number(form.coefficient))) {
      newErrors.coefficient = 'Le coefficient doit être un nombre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      const submitData = {
        id_module: parseInt(form.id_module),
        titre_fr: form.titre_fr.trim(),
        titre_ar: form.titre_ar.trim(),
        description_fr: form.description_fr.trim() || undefined,
        description_ar: form.description_ar.trim() || undefined,
        objectifs_fr: form.objectifs_fr.trim() || undefined,
        objectifs_ar: form.objectifs_ar.trim() || undefined,
        duree_heures: form.duree_heures ? parseInt(form.duree_heures) : undefined,
        coefficient: form.coefficient ? parseFloat(form.coefficient) : undefined
      };

      await request('/api/etablissement-regionale/programmes', {
        method: 'POST',
        data: submitData
      });

      toast({
        title: "Succès",
        description: "Le programme a été créé avec succès et est en attente de validation",
      });

      // Reset form
      setForm({
        id_module: '',
        titre_fr: '',
        titre_ar: '',
        description_fr: '',
        description_ar: '',
        objectifs_fr: '',
        objectifs_ar: '',
        duree_heures: '',
        coefficient: ''
      });
      setErrors({});

    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Erreur lors de la création du programme",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProgrammeForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setForm({
      id_module: '',
      titre_fr: '',
      titre_ar: '',
      description_fr: '',
      description_ar: '',
      objectifs_fr: '',
      objectifs_ar: '',
      duree_heures: '',
      coefficient: ''
    });
    setErrors({});
  };

  const selectedModule = modules.find(m => m.id_module.toString() === form.id_module);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Créer un Programme Pédagogique</h1>
        <p className="text-gray-600">Proposez un nouveau programme qui sera validé par l'Établissement National</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Module Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Sélection du Module
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="module">Module *</Label>
              <Select value={form.id_module} onValueChange={(value) => handleInputChange('id_module', value)}>
                <SelectTrigger className={errors.id_module ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez un module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id_module} value={module.id_module.toString()}>
                      <div>
                        <div className="font-medium">{module.designation_fr}</div>
                        <div className="text-sm text-gray-500">
                          {module.code_module} - {module.specialite.designation_fr}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_module && <p className="text-red-500 text-sm mt-1">{errors.id_module}</p>}
            </div>

            {selectedModule && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Module sélectionné:</h3>
                <div className="text-sm text-blue-800">
                  <div><strong>Désignation FR:</strong> {selectedModule.designation_fr}</div>
                  <div><strong>Désignation AR:</strong> {selectedModule.designation_ar}</div>
                  <div><strong>Code:</strong> {selectedModule.code_module}</div>
                  <div><strong>Spécialité:</strong> {selectedModule.specialite.designation_fr}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Programme Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations du Programme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titre_fr">Titre en Français *</Label>
                <Input
                  id="titre_fr"
                  value={form.titre_fr}
                  onChange={(e) => handleInputChange('titre_fr', e.target.value)}
                  placeholder="Titre du programme en français"
                  className={errors.titre_fr ? 'border-red-500' : ''}
                />
                {errors.titre_fr && <p className="text-red-500 text-sm mt-1">{errors.titre_fr}</p>}
              </div>

              <div>
                <Label htmlFor="titre_ar">Titre en Arabe *</Label>
                <Input
                  id="titre_ar"
                  value={form.titre_ar}
                  onChange={(e) => handleInputChange('titre_ar', e.target.value)}
                  placeholder="عنوان البرنامج بالعربية"
                  className={errors.titre_ar ? 'border-red-500' : ''}
                  dir="rtl"
                />
                {errors.titre_ar && <p className="text-red-500 text-sm mt-1">{errors.titre_ar}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_fr">Description en Français</Label>
                <Textarea
                  id="description_fr"
                  value={form.description_fr}
                  onChange={(e) => handleInputChange('description_fr', e.target.value)}
                  placeholder="Description détaillée du programme..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="description_ar">Description en Arabe</Label>
                <Textarea
                  id="description_ar"
                  value={form.description_ar}
                  onChange={(e) => handleInputChange('description_ar', e.target.value)}
                  placeholder="وصف مفصل للبرنامج..."
                  rows={4}
                  dir="rtl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs du Programme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="objectifs_fr">Objectifs en Français</Label>
                <Textarea
                  id="objectifs_fr"
                  value={form.objectifs_fr}
                  onChange={(e) => handleInputChange('objectifs_fr', e.target.value)}
                  placeholder="Objectifs pédagogiques du programme..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="objectifs_ar">Objectifs en Arabe</Label>
                <Textarea
                  id="objectifs_ar"
                  value={form.objectifs_ar}
                  onChange={(e) => handleInputChange('objectifs_ar', e.target.value)}
                  placeholder="الأهداف التعليمية للبرنامج..."
                  rows={4}
                  dir="rtl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Détails Supplémentaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duree_heures">Durée (heures)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="duree_heures"
                    type="number"
                    value={form.duree_heures}
                    onChange={(e) => handleInputChange('duree_heures', e.target.value)}
                    placeholder="Ex: 40"
                    className={`pl-10 ${errors.duree_heures ? 'border-red-500' : ''}`}
                    min="1"
                  />
                </div>
                {errors.duree_heures && <p className="text-red-500 text-sm mt-1">{errors.duree_heures}</p>}
              </div>

              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="coefficient"
                    type="number"
                    step="0.1"
                    value={form.coefficient}
                    onChange={(e) => handleInputChange('coefficient', e.target.value)}
                    placeholder="Ex: 2.5"
                    className={`pl-10 ${errors.coefficient ? 'border-red-500' : ''}`}
                    min="0.1"
                  />
                </div>
                {errors.coefficient && <p className="text-red-500 text-sm mt-1">{errors.coefficient}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 md:flex-none"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Créer le Programme
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={submitting}
          >
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </form>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              i
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Information importante</h3>
              <p className="text-blue-800 text-sm">
                Une fois créé, votre programme sera soumis à l'Établissement National pour validation. 
                Vous recevrez une notification une fois le statut mis à jour.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgrammeCreation;
