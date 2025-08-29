import { useState } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  Shield
} from 'lucide-react';

interface PasswordRecoveryProps {
  onBackToLogin?: () => void;
}

const PasswordRecovery = ({ onBackToLogin }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'email' | 'reset' | 'success'>('email');
  const [loading, setLoading] = useState(false);
  
  const [emailForm, setEmailForm] = useState({
    email: ''
  });
  
  const [resetForm, setResetForm] = useState({
    resetToken: '',
    newPassword: '',
    confirmPassword: '',
    accountId: ''
  });

  const [resetData, setResetData] = useState<{
    resetToken?: string;
    accountId?: number;
  }>({});

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.email) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال البريد الإلكتروني',
        variant: 'destructive'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.email)) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال بريد إلكتروني صحيح',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.initiatePasswordReset(emailForm.email);
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في إرسال رابط استعادة كلمة المرور');
      }

      // Store development data if available
      if (response.data.resetToken && response.data.accountId) {
        setResetData({
          resetToken: response.data.resetToken,
          accountId: response.data.accountId
        });
        setResetForm(prev => ({
          ...prev,
          resetToken: response.data.resetToken,
          accountId: response.data.accountId.toString()
        }));
      }

      toast({
        title: 'تم الإرسال',
        description: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
      });

      setCurrentStep('reset');
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في إرسال رابط استعادة كلمة المرور',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetForm.resetToken || !resetForm.newPassword || !resetForm.confirmPassword || !resetForm.accountId) {
      toast({
        title: 'خطأ',
        description: 'جميع الحقول مطلوبة',
        variant: 'destructive'
      });
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور الجديدة غير متطابقة',
        variant: 'destructive'
      });
      return;
    }

    if (resetForm.newPassword.length < 6) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.confirmPasswordReset(
        resetForm.resetToken,
        resetForm.newPassword,
        parseInt(resetForm.accountId)
      );
      
      if (response.error) {
        throw new Error(response.error.message || 'فشل في إعادة تعيين كلمة المرور');
      }

      toast({
        title: 'نجح',
        description: 'تم إعادة تعيين كلمة المرور بنجاح',
      });

      setCurrentStep('success');
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل في إعادة تعيين كلمة المرور',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 font-arabic">استعادة كلمة المرور</CardTitle>
        <p className="text-gray-600 mt-2 font-arabic">
          أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-arabic">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ email: e.target.value })}
                placeholder="أدخل بريدك الإلكتروني"
                className="pl-10 text-right"
                dir="rtl"
                required
              />
            </div>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="font-arabic text-blue-800">
              سنرسل رابط آمن لاستعادة كلمة المرور إلى بريدك الإلكتروني المسجل
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full font-arabic"
            disabled={loading}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={onBackToLogin}
            className="font-arabic text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى تسجيل الدخول
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResetStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 font-arabic">إعادة تعيين كلمة المرور</CardTitle>
        <p className="text-gray-600 mt-2 font-arabic">
          أدخل الرمز المرسل إلى بريدك الإلكتروني وكلمة المرور الجديدة
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resetToken" className="font-arabic">رمز الاستعادة</Label>
            <Input
              id="resetToken"
              type="text"
              value={resetForm.resetToken}
              onChange={(e) => setResetForm(prev => ({ ...prev, resetToken: e.target.value }))}
              placeholder="أدخل رمز الاستعادة المرسل إلى بريدك"
              className="text-right"
              dir="rtl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId" className="font-arabic">رقم الحساب</Label>
            <Input
              id="accountId"
              type="number"
              value={resetForm.accountId}
              onChange={(e) => setResetForm(prev => ({ ...prev, accountId: e.target.value }))}
              placeholder="رقم الحساب"
              className="text-right"
              dir="rtl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-arabic">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="أدخل كلمة المرور الجديدة"
              className="text-right"
              dir="rtl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-arabic">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={resetForm.confirmPassword}
              onChange={(e) => setResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="أكد كلمة المرور الجديدة"
              className="text-right"
              dir="rtl"
              required
            />
          </div>

          {process.env.NODE_ENV === 'development' && resetData.resetToken && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="font-arabic text-yellow-800">
                <strong>وضع التطوير:</strong> الرمز والحساب مملوءان تلقائياً
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full font-arabic"
            disabled={loading}
          >
            {loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => setCurrentStep('email')}
            className="font-arabic text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى إدخال البريد الإلكتروني
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 font-arabic">تم بنجاح!</CardTitle>
        <p className="text-gray-600 mt-2 font-arabic">
          تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
        </p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onBackToLogin}
          className="w-full font-arabic"
        >
          تسجيل الدخول
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'reset' && renderResetStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default PasswordRecovery;