import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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

interface SimpleTreeViewProps {
  data: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  selectedNode?: TreeNode | null;
  className?: string;
}

const SimpleTreeView: React.FC<SimpleTreeViewProps> = ({ 
  data, 
  onNodeSelect, 
  selectedNode, 
  className 
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(new Set());

  const toggleNode = (nodeId: string | number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const isExpanded = (nodeId: string | number) => expandedNodes.has(nodeId);
  const isSelected = (node: TreeNode) => selectedNode?.id === node.id;

  const getNodeIcon = (node: TreeNode, isExpanded: boolean) => {
    switch (node.type) {
      case 'branch':
        return isExpanded ? (
          <FolderOpen className="w-5 h-5 text-blue-600" />
        ) : (
          <Folder className="w-5 h-5 text-blue-600" />
        );
      case 'speciality':
        return isExpanded ? (
          <FolderOpen className="w-5 h-5 text-green-600" />
        ) : (
          <Folder className="w-5 h-5 text-green-600" />
        );
      case 'module':
        return <FileText className="w-5 h-5 text-orange-600" />;
      default:
        return <Folder className="w-5 h-5 text-gray-600" />;
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
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = isExpanded(node.id);
    const selected = isSelected(node);

    return (
      <div key={node.id} className="w-full">
        <div
          className={cn(
            'group relative p-3 rounded-lg border transition-all duration-200',
            'hover:shadow-md cursor-pointer',
            selected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50',
            level > 0 && 'ml-6'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            onNodeSelect?.(node);
          }}
        >
          {/* Header du nœud */}
          <div className="flex items-center gap-3">
            {/* Chevron et Icône */}
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(node.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}
              {getNodeIcon(node, expanded)}
            </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {node.labelAr || node.label}
                </h4>
                <Badge variant="secondary" className={cn('text-xs', getTypeColor(node.type))}>
                  {getTypeLabel(node.type)}
                </Badge>
              </div>
              
              {node.labelFr && (
                <p className="text-sm text-gray-600 truncate">
                  {node.labelFr}
                </p>
              )}
              
              {node.code && (
                <p className="text-xs text-gray-500 font-mono">
                  الكود: {node.code}
                </p>
              )}
            </div>

            {/* Compteur et actions */}
            <div className="flex items-center gap-2">
              {node.count !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {node.count}
                </Badge>
              )}
              
                             {/* Bouton de visualisation uniquement */}
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button
                   size="sm"
                   variant="ghost"
                   className="h-7 w-7 p-0"
                   onClick={(e) => {
                     e.stopPropagation();
                     onNodeSelect?.(node);
                   }}
                   title="عرض التفاصيل"
                 >
                   <Eye className="w-3 h-3" />
                 </Button>
               </div>
            </div>
          </div>

          {/* Description ou informations supplémentaires */}
          {node.type === 'branch' && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {hasChildren ? `${node.children?.length} تخصص متاح` : 'لا توجد تخصصات'}
              </p>
            </div>
          )}
          
          {node.type === 'speciality' && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {hasChildren ? `${node.children?.length} مادة متاحة` : 'لا توجد مواد'}
              </p>
            </div>
          )}
        </div>

        {/* Enfants du nœud */}
        {hasChildren && expanded && (
          <div className="mt-2 space-y-2">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Folder className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-arabic">لا توجد بيانات متاحة</p>
        </div>
      ) : (
        data.map(node => renderNode(node))
      )}
    </div>
  );
};

export default SimpleTreeView;
