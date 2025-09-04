import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyledSnackbarProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const StyledSnackbar: React.FC<StyledSnackbarProps> = ({
  open,
  onClose,
  title,
  description,
  type,
  duration = 5000,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full mx-4 transition-all duration-300 ease-in-out',
        getPositionClasses(),
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}
    >
      <div
        className={cn(
          'relative p-4 rounded-xl shadow-lg border backdrop-blur-sm',
          getBackgroundColor()
        )}
      >
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 font-arabic">
              {title}
            </h4>
            {description && (
              <p className="mt-1 text-sm text-gray-600 font-arabic leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300 ease-linear',
              type === 'success' && 'bg-gradient-to-r from-green-400 to-emerald-500',
              type === 'error' && 'bg-gradient-to-r from-red-400 to-rose-500',
              type === 'warning' && 'bg-gradient-to-r from-yellow-400 to-amber-500',
              type === 'info' && 'bg-gradient-to-r from-blue-400 to-indigo-500'
            )}
            style={{
              width: isVisible ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StyledSnackbar;
