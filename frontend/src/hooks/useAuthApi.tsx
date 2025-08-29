import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id_compte: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signUp: (username: string, password: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userProfile: any;
  validateSession: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthApi = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthApi must be used within AuthApiProvider');
  }
  return context;
};

export const AuthApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setToken(token);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await apiService.getUserProfile();
      if (error) {
        throw error;
      }
      
      if (data) {
        setUser({
          id_compte: data.user_id,
          username: data.username,
          role: data.role
        });
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      apiService.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await apiService.login(username, password);
      
      if (error) throw error;
      
      if (data) {
        const { token, role } = data;
        localStorage.setItem('auth_token', token);
        apiService.setToken(token);
        
        setUser({
          id_compte: 0, // Will be updated when profile is fetched
          username,
          role
        });
        
        // Fetch complete user profile
        await fetchUserProfile();
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في النظام",
        });
        
        // Force navigation to dashboard after profile is loaded
        window.location.href = '/dashboard';
      }
      
      return { error: null };
    } catch (error: any) {
      let message = "خطأ في تسجيل الدخول";
      
      if (error.message?.includes("Identifiants invalides")) {
        message = "بيانات الدخول غير صحيحة";
      }
      
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      });
      
      return { error };
    }
  };

  const signUp = async (username: string, password: string, role: string) => {
    try {
      // Validation: username and password are required
      if (!username || !password || username.length < 3 || password.length < 6) {
        throw new Error("اسم المستخدم يجب أن يكون أكثر من 3 أحرف وكلمة المرور أكثر من 6 أحرف");
      }

      const { data, error } = await apiService.signup(username, password, role);
      
      if (error) throw error;
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء الحساب",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      apiService.clearToken();
      setUser(null);
      setUserProfile(null);
      window.location.href = '/auth';
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const { data, error } = await apiService.validateSession();
      if (error) {
        throw error;
      }
      return data?.valid || false;
    } catch (error) {
      console.error('Session validation failed:', error);
      // Clear invalid session
      localStorage.removeItem('auth_token');
      apiService.clearToken();
      setUser(null);
      setUserProfile(null);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const { data, error } = await apiService.refreshToken();
      if (error) {
        throw error;
      }
      
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        apiService.setToken(data.token);
        
        toast({
          title: "تم تجديد الجلسة",
          description: "تم تجديد جلسة العمل بنجاح",
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      toast({
        title: "انتهت الجلسة",
        description: "يرجى تسجيل الدخول مرة أخرى",
        variant: "destructive",
      });
      await signOut();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      userProfile,
      validateSession,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

