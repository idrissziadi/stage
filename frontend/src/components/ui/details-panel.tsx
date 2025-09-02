import React from 'react';
import { Building, GraduationCap, BookOpen, FileText, Code, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface DetailsPanelProps {
  selectedNode: TreeNode | null;
  className?: string;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedNode, className }) => {
  if (!selectedNode) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic">
            <FileText className="w-5 h-5 text-gray-500" />
            Aucun élément sélectionné
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 font-arabic text-center py-8">
            Sélectionnez un élément dans l'arborescence pour voir ses détails
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'branch':
        return <Building className="w-6 h-6 text-teal-600" />;
      case 'speciality':
        return <GraduationCap className="w-6 h-6 text-cyan-600" />;
      case 'module':
        return <BookOpen className="w-6 h-6 text-amber-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'branch':
        return 'فرع';
      case 'speciality':
        return 'تخصص';
      case 'module':
        return 'مادة';
      default:
        return 'عنصر';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'branch':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      case 'speciality':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'module':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {getTypeIcon(selectedNode.type)}
          <div className="flex-1">
            <CardTitle className="text-xl font-arabic">
              {selectedNode.labelAr || selectedNode.label}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={getTypeColor(selectedNode.type)}>
                {getTypeLabel(selectedNode.type)}
              </Badge>
              {selectedNode.count !== undefined && (
                <Badge variant="outline">
                  {selectedNode.count} élément{selectedNode.count > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">
            المعلومات الأساسية
          </h4>
          
          <div className="grid gap-3">
            {selectedNode.labelFr && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">
                  الاسم بالفرنسية:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {selectedNode.labelFr}
                </span>
              </div>
            )}
            
            {selectedNode.code && (
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">
                  الكود:
                </span>
                <span className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {selectedNode.code}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-arabic">
                المعرف:
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {selectedNode.id}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {selectedNode.children && selectedNode.children.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">
              المحتويات
            </h4>
            
            <div className="grid gap-2">
              {selectedNode.children.map((child) => (
                <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(child.type)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {child.labelAr || child.label}
                    </span>
                  </div>
                  {child.count !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      {child.count}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white font-arabic border-b pb-2">
            الإجراءات
          </h4>
          
          <div className="flex gap-2">
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-arabic">
              عرض التفاصيل
            </button>
            <button className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-arabic">
              تعديل
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsPanel;
