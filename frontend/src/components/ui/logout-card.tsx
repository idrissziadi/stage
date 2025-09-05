import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Shield, User, Settings } from 'lucide-react';

interface LogoutCardProps {
  onLogout: () => void;
  username?: string;
  role?: string;
  className?: string;
}

const LogoutCard: React.FC<LogoutCardProps> = ({ 
  onLogout, 
  username, 
  role, 
  className = "" 
}) => {
  const getRoleInArabic = (role: string) => {
    const roles: { [key: string]: string } = {
      'admin': 'مدير',
      'stagiaire': 'متدرب',
      'enseignant': 'أستاذ',
      'etablissement_formation': 'مؤسسة تكوين',
      'etablissement_regionale': 'مؤسسة جهوية',
      'etablissement_nationale': 'مؤسسة وطنية'
    };
    return roles[role] || role;
  };

  return (
    <Card className={`bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-950/20 dark:via-pink-950/10 dark:to-red-950/20 border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <LogOut className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground dark:text-white font-arabic">
          تسجيل الخروج
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground font-arabic">
          إغلاق جلسة العمل الخاصة بك
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations utilisateur */}
        {username && (
          <div className="theme-transition-colors bg-card/50 dark:bg-gray-800/50 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-sm text-foreground dark:text-gray-300">
              <User className="w-4 h-4 text-red-500" />
              <span className="font-medium font-arabic">المستخدم:</span>
              <span className="font-semibold">{username}</span>
            </div>
            {role && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                <Shield className="w-4 h-4 text-pink-500" />
                <span className="font-medium font-arabic">الدور:</span>
                <span className="font-semibold">{getRoleInArabic(role)}</span>
              </div>
            )}
          </div>
        )}

        {/* Bouton de déconnexion */}
        <Button 
          onClick={onLogout}
          variant="destructive"
          size="lg"
          className="w-full font-arabic bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <LogOut className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
          تسجيل الخروج
        </Button>

        {/* Message d'avertissement */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground dark:text-muted-foreground font-arabic">
            ⚠️ سيتم إغلاق جميع الجلسات المفتوحة
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoutCard;
