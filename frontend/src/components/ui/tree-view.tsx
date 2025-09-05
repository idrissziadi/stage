import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
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

interface TreeViewProps {
  data: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  selectedNode?: TreeNode | null;
  className?: string;
}

const TreeView: React.FC<TreeViewProps> = ({ 
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
          <FolderOpen className="w-4 h-4 text-teal-600" />
        ) : (
          <Folder className="w-4 h-4 text-teal-600" />
        );
      case 'speciality':
        return isExpanded ? (
          <FolderOpen className="w-4 h-4 text-cyan-600" />
        ) : (
          <Folder className="w-4 h-4 text-cyan-600" />
        );
      case 'module':
        return <FileText className="w-4 h-4 text-amber-600" />;
      default:
        return <Folder className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getNodeColor = (node: TreeNode) => {
    switch (node.type) {
      case 'branch':
        return 'hover:bg-teal-50 dark:hover:bg-teal-900/20';
      case 'speciality':
        return 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20';
      case 'module':
        return 'hover:bg-amber-50 dark:hover:bg-amber-900/20';
      default:
        return 'hover:bg-background-secondary dark:hover:bg-gray-800';
    }
  };

  const getSelectedColor = (node: TreeNode) => {
    switch (node.type) {
      case 'branch':
        return 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700';
      case 'speciality':
        return 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-700';
      case 'module':
        return 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700';
      default:
        return 'bg-muted dark:bg-gray-800';
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
            'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border',
            'select-none',
            getNodeColor(node),
            selected && getSelectedColor(node),
            selected && 'border-2',
            level > 0 && 'ml-6'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            onNodeSelect?.(node);
          }}
        >
          {/* Chevron pour les nœuds avec enfants */}
          {hasChildren ? (
            <div className="w-4 h-4 flex items-center justify-center">
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ) : (
            <div className="w-4 h-4" />
          )}

          {/* Icône du nœud */}
          {getNodeIcon(node, expanded)}

          {/* Contenu du nœud */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground dark:text-white truncate">
                {node.labelAr || node.label}
              </span>
              {node.labelFr && (
                <span className="text-sm text-muted-foreground dark:text-muted-foreground truncate">
                  ({node.labelFr})
                </span>
              )}
            </div>
            {node.code && (
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {node.code}
              </div>
            )}
            {node.count !== undefined && (
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                {node.count} élément{node.count > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Enfants du nœud */}
        {hasChildren && expanded && (
          <div className="mt-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('w-full space-y-1', className)}>
      {data.map(node => renderNode(node))}
    </div>
  );
};

export default TreeView;
