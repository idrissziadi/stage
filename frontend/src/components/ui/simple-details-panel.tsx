import React from 'react';
import { Building, GraduationCap, BookOpen, FileText, Code, Hash, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string | number;
  label: string;
  labelAr?: string;
  labelFr?: string;
  code?: string;
  count?: number;
  children?: TreeNode[];
  type: 'branch' | 'speciality' | 'module';
}

interface SimpleDetailsPanelProps {
  selectedNode: TreeNode | null;
  className?: string;
}

const SimpleDetailsPanel: React.FC<SimpleDetailsPanelProps> = ({ selectedNode, className }) => {
  if (!selectedNode) {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="theme-transition-colors mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-arabic text-muted-foreground">
            اختر عنصراً لعرض تفاصيله
          </CardTitle>
          <p className="text-muted-foreground font-arabic">
            استخدم الشجرة على اليسار لاختيار فرع أو تخصص أو مادة
          </p>
        </CardHeader>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'branch':
        return <Building className="w-8 h-8 text-primary" />;
      case 'speciality':
        return <GraduationCap className="w-8 h-8 text-success" />;
      case 'module':
        return <BookOpen className="w-8 h-8 text-orange-600" />;
      default:
        return <FileText className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'branch': return 'فرع';
      case 'speciality': return 'تخصص';
      case 'module': return 'مادة';
      default: return 'عنصر';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'branch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'speciality': return 'bg-green-100 text-green-800 border-green-200';
      case 'module': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-muted text-foreground border-border';
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'branch': return 'يمثل التقسيم الرئيسي للمؤسسة التعليمية';
      case 'speciality': return 'يمثل مجال تعليمي محدد داخل الفرع';
      case 'module': return 'يمثل وحدة تعليمية أساسية';
      default: return 'عنصر في النظام التعليمي';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        {/* Header avec icône et informations principales */}
        <div className="flex items-start gap-4">
          <div className="theme-transition-colors p-3 bg-background-secondary rounded-lg">
            {getTypeIcon(selectedNode.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-2xl font-arabic text-foreground">
                {selectedNode.labelAr || selectedNode.label}
              </CardTitle>
              <Badge variant="secondary" className={cn('text-sm', getTypeColor(selectedNode.type))}>
                {getTypeLabel(selectedNode.type)}
              </Badge>
            </div>
            
            {selectedNode.labelFr && (
              <p className="text-lg text-muted-foreground mb-2">
                {selectedNode.labelFr}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground font-arabic">
              {getTypeDescription(selectedNode.type)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informations essentielles */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground font-arabic border-b pb-2">
              المعلومات الأساسية
            </h4>
            
            <div className="space-y-3">
              {selectedNode.code && (
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground font-arabic">الكود:</span>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {selectedNode.code}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground font-arabic">المعرف:</span>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {selectedNode.id}
                </span>
              </div>
              
              {selectedNode.count !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground font-arabic">عدد العناصر:</span>
                  <Badge variant="outline" className="text-sm">
                    {selectedNode.count} عنصر
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques et contenu */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground font-arabic border-b pb-2">
              المحتويات والإحصائيات
            </h4>
            
            {selectedNode.children && selectedNode.children.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-arabic">
                  يحتوي على {selectedNode.children.length} عنصر:
                </p>
                <div className="space-y-1">
                  {selectedNode.children.slice(0, 3).map((child) => (
                    <div key={child.id} className="theme-transition-colors flex items-center gap-2 p-2 bg-background-secondary rounded">
                      {getTypeIcon(child.type)}
                      <span className="text-sm font-medium text-foreground">
                        {child.labelAr || child.label}
                      </span>
                      {child.count !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {child.count}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {selectedNode.children.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      و {selectedNode.children.length - 3} عنصر آخر...
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p className="font-arabic">لا توجد عناصر فرعية</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Informations de consultation uniquement */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground font-arabic border-b pb-2">
            معلومات إضافية للاستشارة
          </h4>
          
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground font-arabic">
              هذه المعلومات متاحة للاستشارة والمراجعة فقط
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground font-arabic border-b pb-2">
            معلومات إضافية
          </h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="theme-transition-colors p-3 bg-background-secondary rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2 font-arabic">الحالة</h5>
              <p className="text-sm text-blue-700 font-arabic">نشط ومتاح للاستخدام</p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2 font-arabic">آخر تحديث</h5>
              <p className="text-sm text-green-700 font-arabic">منذ 2 يوم</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleDetailsPanel;
