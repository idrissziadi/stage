import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
    period?: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
    accent: 'bg-blue-100 dark:bg-blue-900'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    accent: 'bg-green-100 dark:bg-green-900'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
    accent: 'bg-yellow-100 dark:bg-yellow-900'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
    accent: 'bg-red-100 dark:bg-red-900'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
    accent: 'bg-purple-100 dark:bg-purple-900'
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-950',
    border: 'border-gray-200 dark:border-gray-800',
    icon: 'text-gray-600 dark:text-gray-400',
    text: 'text-gray-900 dark:text-gray-100',
    accent: 'bg-gray-100 dark:bg-gray-900'
  }
};

const sizeVariants = {
  sm: {
    card: 'p-4',
    icon: 'h-8 w-8',
    value: 'text-2xl',
    title: 'text-sm',
    subtitle: 'text-xs'
  },
  md: {
    card: 'p-6',
    icon: 'h-10 w-10',
    value: 'text-3xl',
    title: 'text-base',
    subtitle: 'text-sm'
  },
  lg: {
    card: 'p-8',
    icon: 'h-12 w-12',
    value: 'text-4xl',
    title: 'text-lg',
    subtitle: 'text-base'
  }
};

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  size = 'md',
  className,
  onClick
}: KPICardProps) {
  const colorClasses = colorVariants[color];
  const sizeClasses = sizeVariants[size];

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) {
      return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
    } else if (trend.value < 0) {
      return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
    } else {
      return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('ar-EG');
    }
    return val;
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-lg cursor-pointer',
        colorClasses.bg,
        colorClasses.border,
        onClick && 'hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      <CardContent className={sizeClasses.card}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {icon && (
                <div className={cn(
                  'flex items-center justify-center rounded-lg p-2',
                  colorClasses.accent
                )}>
                  <div className={cn(sizeClasses.icon, colorClasses.icon)}>
                    {icon}
                  </div>
                </div>
              )}
              <div>
                <h3 className={cn(
                  'font-medium',
                  sizeClasses.title,
                  colorClasses.text
                )}>
                  {title}
                </h3>
                {subtitle && (
                  <p className={cn(
                    'text-gray-600 dark:text-gray-400',
                    sizeClasses.subtitle
                  )}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className={cn(
                'font-bold',
                sizeClasses.value,
                colorClasses.text
              )}>
                {formatValue(value)}
              </div>
              
              {trend && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      'flex items-center gap-1 px-2 py-1',
                      getTrendColor()
                    )}
                  >
                    {getTrendIcon()}
                    <span className="text-xs font-medium">
                      {Math.abs(trend.value)}%
                    </span>
                  </Badge>
                  {trend.label && (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {trend.label}
                      {trend.period && ` (${trend.period})`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// KPI Grid Component for organizing multiple KPI cards
export interface KPIGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function KPIGrid({ 
  children, 
  columns = 4, 
  gap = 'md',
  className 
}: KPIGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  const gapSizes = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      'grid',
      gridCols[columns],
      gapSizes[gap],
      className
    )}>
      {children}
    </div>
  );
}
