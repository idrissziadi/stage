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
import { Eye, EyeOff, User, Lock, Building2, GraduationCap } from 'lucide-react';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, user } = useAuthApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    setIsLoading(true);
    const { error } = await signIn(username, password);
    setIsLoading(false);
    
    if (error) {
      setError(error.message || 'خطأ في تسجيل الدخول');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!signupUsername || !signupPassword || !role) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    setIsLoading(true);
    const { error } = await signUp(signupUsername, signupPassword, role);
    setIsLoading(false);
    
    if (error) {
      setError(error.message || 'خطأ في إنشاء الحساب');
    } else {
      // Clear form after successful signup
      setSignupUsername('');
      setSignupPassword('');
      setRole('');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة التدريب</h1>
          <p className="text-gray-600">وزارة التكوين والتعليم المهني</p>
        </div>

        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900">مرحباً بك</CardTitle>
            <CardDescription className="text-gray-600">
              قم بتسجيل الدخول أو إنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  حساب جديد
                </TabsTrigger>
              </TabsList>
              
              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username" className="text-sm font-medium text-gray-700">
                      اسم المستخدم
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signin-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </form>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">حسابات تجريبية:</h4>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p><strong>مدير:</strong> admin / password123</p>
                    <p><strong>متدرب:</strong> stagiaire / password123</p>
                    <p><strong>أستاذ:</strong> enseignant / password123</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">
                      اسم المستخدم
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-username"
                        type="text"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      الدور
                    </Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
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