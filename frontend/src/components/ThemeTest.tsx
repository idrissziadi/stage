import React from 'react';
import { useTheme } from './theme-provider';
import { ThemeToggle } from './ui/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function ThemeTest() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header avec toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">اختبار المظهر</h1>
          <ThemeToggle />
        </div>

        {/* Informations sur le thème */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground">معلومات المظهر الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              المظهر الحالي: <span className="font-semibold text-foreground">{theme}</span>
            </p>
          </CardContent>
        </Card>

        {/* Test des couleurs de base */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Background */}
          <Card className="bg-background border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">هذا هو لون الخلفية</p>
            </CardContent>
          </Card>

          {/* Card */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">هذا هو لون البطاقة</p>
            </CardContent>
          </Card>

          {/* Muted */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Muted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">هذا هو لون العناصر الثانوية</p>
            </CardContent>
          </Card>
        </div>

        {/* Test des couleurs primaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary">
            <CardHeader>
              <CardTitle className="text-primary-foreground">Primary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground">هذا هو اللون الأساسي</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="text-secondary-foreground">Secondary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-foreground">هذا هو اللون الثانوي</p>
            </CardContent>
          </Card>

          <Card className="bg-accent">
            <CardHeader>
              <CardTitle className="text-accent-foreground">Accent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-accent-foreground">هذا هو لون التمييز</p>
            </CardContent>
          </Card>
        </div>

        {/* Test des couleurs de statut */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-success">
            <CardHeader>
              <CardTitle className="text-white">Success</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">نجح</p>
            </CardContent>
          </Card>

          <Card className="bg-warning">
            <CardHeader>
              <CardTitle className="text-white">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">تحذير</p>
            </CardContent>
          </Card>

          <Card className="bg-destructive">
            <CardHeader>
              <CardTitle className="text-destructive-foreground">Destructive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground">خطير</p>
            </CardContent>
          </Card>

          <Card className="bg-info">
            <CardHeader>
              <CardTitle className="text-white">Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">معلومات</p>
            </CardContent>
          </Card>
        </div>

        {/* Test des couleurs grises */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-gray-900">Gray 50</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">خلفية فاتحة</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-900">Gray 100</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">خلفية متوسطة</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Gray 200</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">خلفية داكنة</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-300">
            <CardHeader>
              <CardTitle className="text-gray-900">Gray 300</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">خلفية أغمق</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-400">
            <CardHeader>
              <CardTitle className="text-white">Gray 400</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">خلفية غامقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Test des couleurs bleues */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Blue 50</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900">أزرق فاتح</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Blue 100</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900">أزرق متوسط</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Blue 200</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900">أزرق داكن</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-300">
            <CardHeader>
              <CardTitle className="text-blue-900">Blue 300</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900">أزرق أغمق</p>
            </CardContent>
          </Card>
        </div>

        {/* Test des couleurs vertes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Green 50</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-900">أخضر فاتح</p>
            </CardContent>
          </Card>

          <Card className="bg-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">Green 100</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-900">أخضر متوسط</p>
            </CardContent>
          </Card>

          <Card className="bg-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Green 200</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-900">أخضر داكن</p>
            </CardContent>
          </Card>

          <Card className="bg-green-300">
            <CardHeader>
              <CardTitle className="text-green-900">Green 300</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-900">أخضر أغمق</p>
            </CardContent>
          </Card>
        </div>

        {/* Test des badges */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">اختبار البادجات</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">افتراضي</Badge>
            <Badge variant="secondary">ثانوي</Badge>
            <Badge variant="outline">إطار</Badge>
            <Badge variant="destructive">خطير</Badge>
            <Badge className="bg-success text-white">نجح</Badge>
            <Badge className="bg-warning text-white">تحذير</Badge>
            <Badge className="bg-info text-white">معلومات</Badge>
          </div>
        </div>

        {/* Test des bordures */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">اختبار الحدود</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-foreground">حدود عادية</p>
            </div>
            <div className="p-4 border-2 border-primary rounded-lg">
              <p className="text-foreground">حدود أساسية</p>
            </div>
            <div className="p-4 border-2 border-secondary rounded-lg">
              <p className="text-foreground">حدود ثانوية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
