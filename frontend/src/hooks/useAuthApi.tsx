import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id_compte: number;
  username: string;
  role: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: any;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signUp: (username: string, password: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  validateSession: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
  request: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthApi = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
      setLoading(true);
      const { data, error } = await apiService.login(username, password);
      
      if (error) throw error;
      
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        apiService.setToken(data.token);
        
        // Fetch user profile after successful login
        await fetchUserProfile();
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في النظام",
        });
        
        return { error: null };
      } else {
        throw new Error('Token not received');
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "فشل في تسجيل الدخول",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
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
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "تم إغلاق جلسة العمل الخاصة بك",
        variant: "default",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج، سيتم إغلاق الجلسة تلقائياً",
        variant: "destructive",
      });
    } finally {
      localStorage.removeItem('auth_token');
      apiService.clearToken();
      setUser(null);
      setUserProfile(null);
      
      // Attendre un peu avant la redirection pour que l'utilisateur voie le toast
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1000);
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

  const refreshToken = async () => {
    try {
      const { data, error } = await apiService.refreshToken();
      if (error) throw error;
      
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        apiService.setToken(data.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid session
      localStorage.removeItem('auth_token');
      apiService.clearToken();
      setUser(null);
      setUserProfile(null);
    }
  };

  const request = async (endpoint: string, options?: RequestInit) => {
    try {
      const response = await apiService.request(endpoint, options);
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    validateSession,
    refreshToken,
    request
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
