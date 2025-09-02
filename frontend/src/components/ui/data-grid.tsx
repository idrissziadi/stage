import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Calendar,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { label: string; value: string }[];
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: FilterConfig[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowAction?: (action: string, record: T) => void;
  actions?: { key: string; label: string; icon?: React.ReactNode }[];
  searchPlaceholder?: string;
  className?: string;
}

export function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  loading = false,
  pagination,
  onRowAction,
  actions = [],
  searchPlaceholder = "البحث...",
  className = ""
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(item => {
          const itemValue = String(item[key]).toLowerCase();
          const filterValue = String(value).toLowerCase();
          return itemValue.includes(filterValue);
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, activeFilters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilter = (key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== '').length + (searchTerm ? 1 : 0);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                فلترة
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500"
                >
                  <X className="h-4 w-4 ml-1" />
                  مسح الكل
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && filters.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <Select
                      value={activeFilters[filter.key] || ''}
                      onValueChange={(value) => handleFilterChange(filter.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">الكل</SelectItem>
                        {filter.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : filter.type === 'date' ? (
                    <Input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      placeholder={`البحث في ${filter.label}...`}
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    />
                  )}
                  {activeFilters[filter.key] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter(filter.key)}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  البحث: {searchTerm}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || value === '') return null;
                const filter = filters.find(f => f.key === key);
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {filter?.label}: {value}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => clearFilter(key)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.key)} 
                    className={`${column.width || ''} ${column.sortable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <SortAsc 
                            className={`h-3 w-3 ${
                              sortConfig?.key === column.key && sortConfig.direction === 'asc' 
                                ? 'text-blue-600' 
                                : 'text-gray-400'
                            }`} 
                          />
                          <SortDesc 
                            className={`h-3 w-3 -mt-1 ${
                              sortConfig?.key === column.key && sortConfig.direction === 'desc' 
                                ? 'text-blue-600' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-[100px]">الإجراءات</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="mr-2">جاري التحميل...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : processedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-gray-500">
                    لا توجد بيانات للعرض
                  </TableCell>
                </TableRow>
              ) : (
                processedData.map((record, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render 
                          ? column.render(record[column.key as keyof T], record)
                          : String(record[column.key as keyof T] || '')
                        }
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action) => (
                              <DropdownMenuItem
                                key={action.key}
                                onClick={() => onRowAction?.(action.key, record)}
                                className="flex items-center gap-2"
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              عرض {((pagination.current - 1) * pagination.pageSize) + 1} إلى{' '}
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} من{' '}
              {pagination.total} نتيجة
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current <= 1}
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === Math.ceil(pagination.total / pagination.pageSize) ||
                    Math.abs(page - pagination.current) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        variant={page === pagination.current ? "default" : "outline"}
                        size="sm"
                        onClick={() => pagination.onChange(page, pagination.pageSize)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))
                }
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
