import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading } = useAuthApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="theme-transition-colors min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="theme-transition-colors min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">نظام إدارة التدريب</h1>
          <p className="text-xl text-muted-foreground">منصة شاملة لإدارة التدريب والتكوين</p>
        </div>
        
        <div className="space-y-4">
          <Button onClick={() => navigate('/auth')} size="lg" className="px-8">
            تسجيل الدخول
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>مرحباً بك في نظام إدارة التدريب</p>
            <p>قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
