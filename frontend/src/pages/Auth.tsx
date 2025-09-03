import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, EyeOff, User, Lock, Building2, GraduationCap, 
  BookOpen, Award, TrendingUp, Rocket, Shield, Star, 
  Heart, Globe, Cpu, Database, ArrowLeft
} from 'lucide-react';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signIn, signUp, user } = useAuthApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Calculate password strength
  useEffect(() => {
    if (signupPassword) {
      let strength = 0;
      if (signupPassword.length >= 8) strength += 1;
      if (/[a-z]/.test(signupPassword)) strength += 1;
      if (/[A-Z]/.test(signupPassword)) strength += 1;
      if (/[0-9]/.test(signupPassword)) strength += 1;
      if (/[^A-Za-z0-9]/.test(signupPassword)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [signupPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'text-destructive';
    if (passwordStrength <= 3) return 'text-warning';
    return 'text-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'ضعيف';
    if (passwordStrength <= 3) return 'متوسط';
    return 'قوي';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!username || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    setIsLoading(true);
    const { error } = await signIn(username, password);
    setIsLoading(false);
    
    if (error) {
      setError(error.message || 'خطأ في تسجيل الدخول');
    } else {
      setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!signupUsername || !signupPassword || !role) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    if (signupPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    
    if (!acceptTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }
    
    setIsLoading(true);
    const { error } = await signUp(signupUsername, signupPassword, role);
    setIsLoading(false);
    
    if (error) {
      setError(error.message || 'خطأ في إنشاء الحساب');
    } else {
      setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      // Clear form after successful signup
      setSignupUsername('');
      setSignupPassword('');
      setConfirmPassword('');
      setRole('');
      setAcceptTerms(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return <GraduationCap className="w-4 h-4" />;
      case 'Enseignant':
        return <User className="w-4 h-4" />;
      case 'EtablissementFormation':
      case 'EtablissementRegionale':
      case 'EtablissementNationale':
        return <Building2 className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'Stagiaire':
        return 'متدرب';
      case 'Enseignant':
        return 'أستاذ';
      case 'EtablissementFormation':
        return 'مؤسسة تكوين';
      case 'EtablissementRegionale':
        return 'مؤسسة جهوية';
      case 'EtablissementNationale':
        return 'مؤسسة وطنية';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 overflow-hidden" dir="rtl">
      {/* Back to Landing Page Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة للصفحة الرئيسية
        </Button>
      </div>
      
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full"></div>
        <div className="absolute top-40 right-40 w-16 h-16 border border-secondary/20 rounded-full"></div>
        <div className="absolute bottom-40 left-60 w-24 h-24 border border-warning/20 rounded-full"></div>
        <div className="absolute top-60 left-10 w-20 h-20 border border-primary/20 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-secondary/20 rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-success/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Dots pattern */}
        <div className="absolute top-32 right-32 w-2 h-2 bg-primary rounded-full"></div>
        <div className="absolute top-48 left-48 w-1 h-1 bg-secondary rounded-full"></div>
        <div className="absolute bottom-48 right-48 w-1.5 h-1.5 bg-warning rounded-full"></div>
        <div className="absolute top-80 left-80 w-1 h-1 bg-success rounded-full"></div>
        <div className="absolute bottom-80 right-80 w-2 h-2 bg-info rounded-full"></div>
        
        {/* Lines */}
        <div className="absolute top-24 left-32 w-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute bottom-32 right-24 w-16 h-px bg-gradient-to-l from-transparent via-secondary/30 to-transparent"></div>
        <div className="absolute top-1/3 left-1/4 w-12 h-px bg-gradient-to-r from-transparent via-warning/30 to-transparent"></div>
      </div>

      {/* Left side - Features */}
      <div className="flex-1 flex flex-col justify-center px-16 py-12 relative z-10">
        <div className="max-w-lg">
          <h1 className="text-6xl font-bold text-primary mb-6">منصة إدارة البرامج التعليمية</h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            النظام الشامل لإدارة البرامج والدروس والمذكرات في المؤسسات التعليمية
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">إدارة البرامج</h3>
                  <p className="text-sm text-gray-600">إنشاء وإدارة البرامج التعليمية</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">إدارة الدروس</h3>
                  <p className="text-sm text-gray-600">رفع وإدارة الدروس والمذكرات</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">إدارة المستخدمين</h3>
                  <p className="text-sm text-gray-600">إدارة الأساتذة والطلاب والمؤسسات</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">إدارة المذكرات</h3>
                  <p className="text-sm text-gray-600">متابعة وتقييم مذكرات التخرج</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-info" />
              </div>
              <p className="text-sm text-gray-600">واجهة عربية</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Cpu className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600">نظام متكامل</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database className="w-6 h-6 text-teal-500" />
              </div>
              <p className="text-sm text-gray-600">أمان عالي</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-16 py-12 relative z-10">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">انضم إلى النظام</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-lg">
              ابدأ رحلة إدارة البرامج والدروس اليوم
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg border border-gray-200 mb-6">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 font-medium"
                >
                  <User className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-gray-600 font-medium"
                >
                  <Star className="w-4 h-4 ml-2" />
                  حساب جديد
                </TabsTrigger>
              </TabsList>
              
              {error && (
                <Alert className="mt-4 border-destructive/20 bg-destructive/10">
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mt-4 border-success/20 bg-success/10">
                  <AlertDescription className="text-success">{success}</AlertDescription>
                </Alert>
              )}
              
              <TabsContent value="signin" className="space-y-6 mt-6">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      اسم المستخدم
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        className="pr-12 pl-4 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 h-12 text-lg"
                        required
                      />
                      <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="pr-12 pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 h-12 text-lg"
                        required
                      />
                      <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600">تذكرني</Label>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                      نسيت كلمة المرور؟
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 rounded-lg transition-colors shadow-lg text-lg h-14" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        جارٍ تسجيل الدخول...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        تسجيل الدخول
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-6 mt-6">
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">
                      اسم المستخدم
                    </Label>
                    <Input
                      id="signup-username"
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="أدخل اسم المستخدم"
                      className="h-12"
                      required
                    />
                  </div>
                  
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      الدور
                    </Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stagiaire">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            متدرب
                          </div>
                        </SelectItem>
                        <SelectItem value="Enseignant">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            أستاذ
                          </div>
                        </SelectItem>
                        <SelectItem value="EtablissementFormation">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            مؤسسة تكوين
                          </div>
                        </SelectItem>
                        <SelectItem value="EtablissementRegionale">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            مؤسسة جهوية
                          </div>
                        </SelectItem>
                        <SelectItem value="EtablissementNationale">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            مؤسسة وطنية
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                        className="pr-12 pl-4 h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {signupPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-600">قوة كلمة المرور:</span>
                          <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded ${
                                level <= passwordStrength
                                  ? passwordStrength <= 2
                                    ? 'bg-destructive'
                                    : passwordStrength <= 3
                                    ? 'bg-warning'
                                    : 'bg-success'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="أعد إدخال كلمة المرور"
                        className="pr-12 pl-4 h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      أوافق على <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">الشروط والأحكام</Button>
                    </Label>
                  </div>
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-success hover:bg-success/90 text-white h-14 text-lg" 
                    disabled={isLoading || !acceptTerms}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جارٍ إنشاء الحساب...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        إنشاء حساب
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;