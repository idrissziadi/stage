import React, { useState, useEffect, useRef } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Save, 
  X, 
  BookOpen, 
  GraduationCap, 
  Building, 
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface Branche {
  id_branche: number;
  code_branche: string;
  designation_fr: string;
  designation_ar: string;
}

interface Specialite {
  id_specialite: number;
  code_specialite: string;
  designation_fr: string;
  designation_ar: string;
  id_branche: number;
}

interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
  id_specialite: number;
}

interface Programme {
  id_programme?: number;
  code_programme: string;
  titre_fr: string;
  titre_ar: string;
  id_module: number;
  id_etab_regionale: number;
  status?: string;
  observation?: string;
  fichierpdf?: string;
}

const ProgrammeCreationFormWithUpload = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Data states
  const [branches, setBranches] = useState<Branche[]>([]);
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  
  // Form states
  const [selectedBranche, setSelectedBranche] = useState<string>('');
  const [selectedSpecialite, setSelectedSpecialite] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  
  // Programme form
  const [programme, setProgramme] = useState<Programme>({
    code_programme: '',
    titre_fr: '',
    titre_ar: '',
    id_module: 0,
    id_etab_regionale: userProfile?.id_etab_regionale || 0
  });

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedBranche) {
      fetchSpecialites(parseInt(selectedBranche));
      setSelectedSpecialite('');
      setSelectedModule('');
    }
  }, [selectedBranche]);

  useEffect(() => {
    if (selectedSpecialite) {
      fetchModules(parseInt(selectedSpecialite));
      setSelectedModule('');
    }
  }, [selectedSpecialite]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch branches
      const branchesResponse = await apiService.getBranches();
      if (branchesResponse.data) {
        setBranches(branchesResponse.data);
      }
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل البيانات الأولية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialites = async (idBranche: number) => {
    try {
      const specialitesResponse = await apiService.getSpecialitesByBranche(idBranche);
      if (specialitesResponse.data) {
        setSpecialites(specialitesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching specialites:', error);
    }
  };

  const fetchModules = async (idSpecialite: number) => {
    try {
      const modulesResponse = await apiService.getModulesBySpecialite(idSpecialite);
      if (modulesResponse.data) {
        setModules(modulesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleInputChange = (field: keyof Programme, value: string) => {
    setProgramme(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (file.type !== 'application/pdf') {
        toast({
          title: 'خطأ',
          description: 'يرجى اختيار ملف PDF فقط',
          variant: 'destructive'
        });
        return;
      }
      
      // Vérifier la taille (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'خطأ',
          description: 'حجم الملف يجب أن يكون أقل من 50 ميجابايت',
          variant: 'destructive'
        });
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: 'نجح',
        description: `تم اختيار الملف: ${file.name}`,
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('code_programme', programme.code_programme);
      formData.append('titre_fr', programme.titre_fr);
      formData.append('titre_ar', programme.titre_ar);
      formData.append('id_module', selectedModule);
      formData.append('observation', programme.observation || '');
      
      if (selectedFile) {
        formData.append('fichierpdf', selectedFile);
      }

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Créer le programme avec upload
      const response = await apiService.createProgrammeWithUpload(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في إنشاء البرنامج');
      }

      toast({
        title: 'نجح',
        description: 'تم إنشاء البرنامج بنجاح مع رفع الملف PDF',
      });

      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error creating programme:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء البرنامج',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const validateForm = (): boolean => {
    if (!programme.code_programme.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود البرنامج',
        variant: 'destructive'
      });
      return false;
    }

    if (!programme.titre_fr.trim() && !programme.titre_ar.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان البرنامج بالفرنسية أو العربية',
        variant: 'destructive'
      });
      return false;
    }

    if (!selectedModule || selectedModule === '0') {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المادة',
        variant: 'destructive'
      });
      return false;
    }

    if (!selectedFile) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار ملف PDF للبرنامج',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setProgramme({
      code_programme: '',
      titre_fr: '',
      titre_ar: '',
      id_module: 0,
      id_etab_regionale: userProfile?.id_etab_regionale || 0
    });
    setSelectedBranche('');
    setSelectedSpecialite('');
    setSelectedModule('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic">إنشاء برنامج جديد</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              قم بإنشاء برنامج تعليمي جديد مع رفع ملف PDF
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900 dark:text-white font-arabic">
              ملف البرنامج PDF *
            </Label>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!selectedFile ? (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white font-arabic">
                      انقر لاختيار ملف PDF أو اسحبه هنا
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      الحد الأقصى: 50 ميجابايت
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    اختيار ملف PDF
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      تغيير الملف
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      إزالة
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-arabic">جاري رفع الملف...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>

          {/* Programme Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Code Programme */}
            <div className="space-y-2">
              <Label htmlFor="code_programme" className="font-arabic">كود البرنامج *</Label>
              <Input
                id="code_programme"
                value={programme.code_programme}
                onChange={(e) => handleInputChange('code_programme', e.target.value)}
                placeholder="مثال: PROG-2024-001"
                className="font-arabic"
                dir="rtl"
              />
            </div>

            {/* Module Selection */}
            <div className="space-y-2">
              <Label className="font-arabic">المادة *</Label>
              <div className="space-y-3">
                {/* Branche Selection */}
                <Select value={selectedBranche} onValueChange={setSelectedBranche}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branche => (
                      <SelectItem key={branche.id_branche} value={branche.id_branche.toString()}>
                        {branche.designation_ar || branche.designation_fr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Specialite Selection */}
                {selectedBranche && (
                  <Select value={selectedSpecialite} onValueChange={setSelectedSpecialite}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialites.map(specialite => (
                        <SelectItem key={specialite.id_specialite} value={specialite.id_specialite.toString()}>
                          {specialite.designation_ar || specialite.designation_fr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Module Selection */}
                {selectedSpecialite && (
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map(module => (
                        <SelectItem key={module.id_module} value={module.id_module.toString()}>
                          {module.designation_ar || module.designation_fr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Titles */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titre_fr" className="font-arabic">العنوان بالفرنسية</Label>
              <Input
                id="titre_fr"
                value={programme.titre_fr}
                onChange={(e) => handleInputChange('titre_fr', e.target.value)}
                placeholder="Titre du programme en français"
                className="font-arabic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titre_ar" className="font-arabic">العنوان بالعربية</Label>
              <Input
                id="titre_ar"
                value={programme.titre_ar}
                onChange={(e) => handleInputChange('titre_ar', e.target.value)}
                placeholder="عنوان البرنامج بالعربية"
                className="font-arabic"
                dir="rtl"
              />
            </div>
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <Label htmlFor="observation" className="font-arabic">ملاحظات (اختياري)</Label>
            <Textarea
              id="observation"
              value={programme.observation || ''}
              onChange={(e) => handleInputChange('observation', e.target.value)}
              placeholder="أضف ملاحظات حول البرنامج..."
              className="min-h-[100px] font-arabic"
              dir="rtl"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-arabic flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  إنشاء البرنامج
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting || isUploading}
              className="font-arabic"
            >
              <X className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProgrammeCreationFormWithUpload;
