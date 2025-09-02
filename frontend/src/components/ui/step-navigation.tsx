import React from 'react';
import { Building, GraduationCap, BookOpen, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StepNavigationProps {
  currentStep: 'branch' | 'speciality' | 'module' | null;
  selectedBranch?: any;
  selectedSpeciality?: any;
  onStepClick: (step: 'branch' | 'speciality' | 'module') => void;
  onHomeClick: () => void;
  className?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  selectedBranch,
  selectedSpeciality,
  onStepClick,
  onHomeClick,
  className
}) => {
  const getStepIcon = (step: string) => {
    switch (step) {
      case 'branch': return <Building className="w-4 h-4" />;
      case 'speciality': return <GraduationCap className="w-4 h-4" />;
      case 'module': return <BookOpen className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const getStepLabel = (step: string) => {
    switch (step) {
      case 'branch': return 'الفروع';
      case 'speciality': return 'التخصصات';
      case 'module': return 'المواد';
      default: return 'الرئيسية';
    }
  };

  const getStepColor = (step: string) => {
    switch (step) {
      case 'branch': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'speciality': return 'text-green-600 bg-green-50 border-green-200';
      case 'module': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
        {/* Bouton Accueil */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onHomeClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Home className="w-4 h-4" />
          <span className="font-arabic">الرئيسية</span>
        </Button>

        <ChevronRight className="w-4 h-4 text-gray-400" />

        {/* Navigation par étapes */}
        <div className="flex items-center gap-2">
          {/* Étape 1: Branches */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStepClick('branch')}
            className={`flex items-center gap-2 border rounded-lg px-3 py-1 transition-all ${
              currentStep === 'branch' || selectedBranch
                ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="font-arabic">الفروع</span>
            {selectedBranch && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {selectedBranch.designation_ar || selectedBranch.label}
              </Badge>
            )}
          </Button>

          {/* Flèche conditionnelle */}
          {selectedBranch && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {/* Étape 2: Spécialités */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStepClick('speciality')}
                className={`flex items-center gap-2 border rounded-lg px-3 py-1 transition-all ${
                  currentStep === 'speciality' || selectedSpeciality
                    ? 'bg-green-100 text-green-700 border-green-300 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="font-arabic">التخصصات</span>
                {selectedSpeciality && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {selectedSpeciality.designation_ar || selectedSpeciality.label}
                  </Badge>
                )}
              </Button>
            </>
          )}

          {/* Flèche conditionnelle */}
          {selectedSpeciality && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {/* Étape 3: Modules */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStepClick('module')}
                className={`flex items-center gap-2 border rounded-lg px-3 py-1 transition-all ${
                  currentStep === 'module'
                    ? 'bg-orange-100 text-orange-700 border-orange-300 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-arabic">المواد</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Indicateur de progression */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-500 font-arabic">
          <span>التقدم:</span>
          <span>
            {!selectedBranch && '0%'}
            {selectedBranch && !selectedSpeciality && '33%'}
            {selectedBranch && selectedSpeciality && !currentStep && '66%'}
            {selectedBranch && selectedSpeciality && currentStep === 'module' && '100%'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: !selectedBranch ? '0%' :
                     !selectedSpeciality ? '33%' :
                     !currentStep ? '66%' : '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
