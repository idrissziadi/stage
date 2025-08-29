import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Save, 
  X, 
  CheckCircle,
  AlertCircle,
  FileCode,
  User,
  Calendar
} from 'lucide-react';

interface Module {
  id_module: number;
  designation_fr: string;
  designation_ar: string;
  code_module: string;
}

interface CoursUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CoursUploadForm = ({ onSuccess, onCancel }: CoursUploadFormProps) => {
  const [formData, setFormData] = useState({
    code_cours: '',
    titre_fr: '',
    titre_ar: '',
    id_module: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { userProfile } = useAuthApi();
  const { toast } = useToast();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      // Récupérer les modules enseignés par l'enseignant
      const { data, error } = await apiService.getModulesByEnseignant(userProfile.id_enseignant);
      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل المقاييس",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (file.type !== 'application/pdf') {
        toast({
          title: "خطأ",
          description: "يرجى اختيار ملف PDF فقط",
          variant: "destructive",
        });
        return;
      }
      
      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "خطأ",
          description: "حجم الملف يجب أن يكون أقل من 10 ميجابايت",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, fichierpdf: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.code_cours.trim()) {
      newErrors.code_cours = 'كود الدرس مطلوب';
    }

    if (!formData.titre_fr.trim()) {
      newErrors.titre_fr = 'العنوان بالفرنسية مطلوب';
    }

    if (!formData.titre_ar.trim()) {
      newErrors.titre_ar = 'العنوان بالعربية مطلوب';
    }

    if (!formData.id_module) {
      newErrors.id_module = 'المقياس مطلوب';
    }

    if (!selectedFile) {
      newErrors.fichierpdf = 'ملف PDF مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('code_cours', formData.code_cours);
      formDataToSend.append('titre_fr', formData.titre_fr);
      formDataToSend.append('titre_ar', formData.titre_ar);
      formDataToSend.append('id_module', formData.id_module);
      
      if (selectedFile) {
        formDataToSend.append('fichierpdf', selectedFile);
      }

      const { error } = await apiService.createCoursWithFile(formDataToSend);
      
      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم إنشاء الدرس بنجاح",
      });

      // Réinitialiser le formulaire
      setFormData({
        code_cours: '',
        titre_fr: '',
        titre_ar: '',
        id_module: ''
      });
      setSelectedFile(null);
      
      // Appeler le callback de succès
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الدرس",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          إضافة درس جديد
        </CardTitle>
        <CardDescription>
          قم بملء النموذج أدناه لإنشاء درس جديد مع ملف PDF
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code_cours" className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                كود الدرس *
              </Label>
              <Input
                id="code_cours"
                value={formData.code_cours}
                onChange={(e) => handleInputChange('code_cours', e.target.value)}
                placeholder="مثال: CS101"
                className={errors.code_cours ? 'border-red-500' : ''}
              />
              {errors.code_cours && (
                <p className="text-sm text-red-500">{errors.code_cours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_module" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                المقياس *
              </Label>
              <Select
                value={formData.id_module}
                onValueChange={(value) => handleInputChange('id_module', value)}
              >
                <SelectTrigger className={errors.id_module ? 'border-red-500' : ''}>
                  <SelectValue placeholder="اختر المقياس" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id_module} value={module.id_module.toString()}>
                      {module.designation_ar || module.designation_fr} ({module.code_module})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_module && (
                <p className="text-sm text-red-500">{errors.id_module}</p>
              )}
            </div>
          </div>

          {/* Titres */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titre_fr" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                العنوان بالفرنسية *
              </Label>
              <Input
                id="titre_fr"
                value={formData.titre_fr}
                onChange={(e) => handleInputChange('titre_fr', e.target.value)}
                placeholder="Titre du cours en français"
                className={errors.titre_fr ? 'border-red-500' : ''}
              />
              {errors.titre_fr && (
                <p className="text-sm text-red-500">{errors.titre_fr}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="titre_ar" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                العنوان بالعربية *
              </Label>
              <Input
                id="titre_ar"
                value={formData.titre_ar}
                onChange={(e) => handleInputChange('titre_ar', e.target.value)}
                placeholder="عنوان الدرس بالعربية"
                className={errors.titre_ar ? 'border-red-500' : ''}
              />
              {errors.titre_ar && (
                <p className="text-sm text-red-500">{errors.titre_ar}</p>
              )}
            </div>
          </div>

          {/* Fichier PDF */}
          <div className="space-y-2">
            <Label htmlFor="fichierpdf" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              ملف PDF *
            </Label>
            <Input
              id="fichierpdf"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className={errors.fichierpdf ? 'border-red-500' : ''}
            />
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">{selectedFile.name}</span>
              </div>
            )}
            {errors.fichierpdf && (
              <p className="text-sm text-red-500">{errors.fichierpdf}</p>
            )}
            <p className="text-xs text-muted-foreground">
              الحد الأقصى لحجم الملف: 10 ميجابايت. نوع الملف المسموح: PDF فقط.
            </p>
          </div>

          {/* Informations sur le statut */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>ملاحظة:</strong> سيتم إنشاء الدرس بحالة "في الانتظار" تلقائياً. 
              يمكنك تصديره للاعتماد لاحقاً من صفحة إدارة الدروس.
            </AlertDescription>
          </Alert>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  إنشاء الدرس
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoursUploadForm;

