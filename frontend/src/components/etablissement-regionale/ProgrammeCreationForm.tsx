import React, { useState, useEffect, useRef } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const ProgrammeCreationForm = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  
  // Data states
  const [branches, setBranches] = useState<Branche[]>([]);
  const [specialites, setSpecialites] = useState<Specialite[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  
  // Form states
  const [selectedBranche, setSelectedBranche] = useState<string>('');
  const [selectedSpecialite, setSelectedSpecialite] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  
  // Programme form - seulement les champs existants dans la base
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
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.log('Branches response:', branchesResponse);
      
      if (branchesResponse.data && branchesResponse.data.data) {
        setBranches(branchesResponse.data.data);
      } else if (branchesResponse.data && Array.isArray(branchesResponse.data)) {
        setBranches(branchesResponse.data);
      } else {
        console.error('Unexpected branches response structure:', branchesResponse);
        setBranches([]);
      }
      
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الفروع',
        variant: 'destructive'
      });
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialites = async (brancheId: number) => {
    try {
      console.log('Fetching specialites for branche:', brancheId);
      // Fetch specialites for this branche
      const specialitesResponse = await apiService.getSpecialitesByBranche(brancheId);
      console.log('Specialites response:', specialitesResponse);
      
      if (specialitesResponse.data && specialitesResponse.data.data) {
        setSpecialites(specialitesResponse.data.data);
      } else if (specialitesResponse.data && Array.isArray(specialitesResponse.data)) {
        setSpecialites(specialitesResponse.data);
      } else {
        console.error('Unexpected specialites response structure:', specialitesResponse);
        setSpecialites([]);
      }
    } catch (error) {
      console.error('Error fetching specialites:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل التخصصات',
        variant: 'destructive'
      });
      setSpecialites([]);
    }
  };

  const fetchModules = async (specialiteId: number) => {
    try {
      console.log('Fetching modules for specialite:', specialiteId);
      // Fetch modules for this specialite
      const modulesResponse = await apiService.getModulesBySpecialite(specialiteId);
      console.log('Modules response:', modulesResponse);
      
      if (modulesResponse.data && modulesResponse.data.data) {
        setModules(modulesResponse.data.data);
      } else if (modulesResponse.data && Array.isArray(modulesResponse.data)) {
        setModules(modulesResponse.data);
      } else {
        console.error('Unexpected modules response structure:', modulesResponse);
        setModules([]);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المواد',
        variant: 'destructive'
      });
      setModules([]);
    }
  };

  const handleInputChange = (field: keyof Programme, value: string | number) => {
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

    if (!programme.titre_ar.trim() && !programme.titre_fr.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان البرنامج (عربي أو فرنسي)',
        variant: 'destructive'
      });
      return false;
    }

    if (!selectedBranche) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار الفرع',
        variant: 'destructive'
      });
      return false;
    }

    if (!selectedSpecialite) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار التخصص',
        variant: 'destructive'
      });
      return false;
    }

    if (!selectedModule) {
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
    setSpecialites([]);
    setModules([]);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Plus className="w-6 h-6 text-secondary dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground dark:text-white font-arabic">إنشاء برنامج جديد</h2>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                إنشاء برنامج تدريبي جديد مع تحديد الفرع والتخصص والمادة
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            معلومات البرنامج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code_programme" className="font-arabic">كود البرنامج *</Label>
                  <Input
                    id="code_programme"
                    value={programme.code_programme}
                    onChange={(e) => handleInputChange('code_programme', e.target.value)}
                    placeholder="مثال: PRG-2024-001"
                    className="mt-2 font-arabic"
                    dir="rtl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="titre_ar" className="font-arabic">العنوان بالعربية</Label>
                  <Input
                    id="titre_ar"
                    value={programme.titre_ar}
                    onChange={(e) => handleInputChange('titre_ar', e.target.value)}
                    placeholder="عنوان البرنامج باللغة العربية"
                    className="mt-2 font-arabic"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="titre_fr" className="font-arabic">العنوان بالفرنسية</Label>
                  <Input
                    id="titre_fr"
                    value={programme.titre_fr}
                    onChange={(e) => handleInputChange('titre_fr', e.target.value)}
                    placeholder="Titre du programme en français"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Branch and Speciality Selection */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="font-arabic">الفرع *</Label>
                <Select value={selectedBranche} onValueChange={setSelectedBranche}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(branches) && branches.map(branche => (
                      <SelectItem key={branche.id_branche} value={branche.id_branche.toString()}>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-blue-500" />
                          <span>{branche.designation_ar || branche.designation_fr}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-arabic">التخصص *</Label>
                <Select value={selectedSpecialite} onValueChange={setSelectedSpecialite} disabled={!selectedBranche}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={selectedBranche ? "اختر التخصص" : "اختر الفرع أولاً"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(specialites) && specialites.map(specialite => (
                      <SelectItem key={specialite.id_specialite} value={specialite.id_specialite.toString()}>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-green-500" />
                          <span>{specialite.designation_ar || specialite.designation_fr}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Module Selection */}
            <div>
              <Label className="font-arabic">المادة *</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule} disabled={!selectedSpecialite}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={selectedSpecialite ? "اختر المادة" : "اختر التخصص أولاً"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(modules) && modules.map(module => (
                    <SelectItem key={module.id_module} value={module.id_module.toString()}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-5 text-purple-500" />
                        <span>{module.designation_ar || module.designation_fr}</span>
                        <span className="text-xs text-muted-foreground">({module.code_module})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedModule && (
                <p className="mt-2 text-sm text-muted-foreground">
                  تم اختيار المادة: {modules.find(m => m.id_module.toString() === selectedModule)?.designation_ar || modules.find(m => m.id_module.toString() === selectedModule)?.designation_fr}
                </p>
              )}
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-foreground dark:text-white font-arabic">
                ملف البرنامج PDF *
              </Label>
              
              <div className="border-2 border-dashed border-border-medium dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="theme-transition-colors hidden"
                />
                
                {!selectedFile ? (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium text-foreground dark:text-white font-arabic">
                        انقر لاختيار ملف PDF أو اسحبه هنا
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground font-arabic">
                        الحد الأقصى: 50 ميجابايت
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-background-secondary hover:bg-blue-100 border-blue-200 text-blue-700"
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
                        <p className="font-medium text-foreground dark:text-white">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
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
                        className="bg-background-secondary hover:bg-blue-100 border-blue-200 text-blue-700"
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



            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="px-6"
              >
                <X className="w-4 h-4 mr-2" />
                إعادة تعيين
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgrammeCreationForm;
