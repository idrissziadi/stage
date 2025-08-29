import React, { createContext, useContext, useEffect } from 'react';

interface RTLContextType {
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  setDirection: (dir: 'rtl' | 'ltr') => void;
}

const RTLContext = createContext<RTLContextType>({
  isRTL: true,
  direction: 'rtl',
  setDirection: () => {},
});

export const useRTL = () => useContext(RTLContext);

interface RTLProviderProps {
  children: React.ReactNode;
  defaultDirection?: 'rtl' | 'ltr';
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ 
  children, 
  defaultDirection = 'rtl' 
}) => {
  const [direction, setDirectionState] = React.useState<'rtl' | 'ltr'>(defaultDirection);

  const setDirection = (dir: 'rtl' | 'ltr') => {
    setDirectionState(dir);
    // Update document direction
    document.documentElement.dir = dir;
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
  };

  useEffect(() => {
    // Set initial direction
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
  }, [direction]);

  const value: RTLContextType = {
    isRTL: direction === 'rtl',
    direction,
    setDirection,
  };

  return (
    <RTLContext.Provider value={value}>
      <div dir={direction} className={direction === 'rtl' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </RTLContext.Provider>
  );
};

// RTL-aware layout components
export const RTLBox: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => {
  const { isRTL } = useRTL();
  
  return (
    <div className={`${isRTL ? 'text-right' : 'text-left'} ${className}`}>
      {children}
    </div>
  );
};

export const RTLFlex: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  reverse?: boolean;
}> = ({ children, className = '', reverse = false }) => {
  const { isRTL } = useRTL();
  
  const flexDirection = reverse 
    ? (isRTL ? 'flex-row' : 'flex-row-reverse')
    : (isRTL ? 'flex-row-reverse' : 'flex-row');
  
  return (
    <div className={`flex ${flexDirection} ${className}`}>
      {children}
    </div>
  );
};

export const RTLGrid: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => {
  const { isRTL } = useRTL();
  
  return (
    <div className={`grid ${isRTL ? 'grid-rtl' : ''} ${className}`}>
      {children}
    </div>
  );
};

// RTL-aware spacing utilities
export const getRTLSpacing = (isRTL: boolean) => ({
  marginStart: isRTL ? 'mr' : 'ml',
  marginEnd: isRTL ? 'ml' : 'mr',
  paddingStart: isRTL ? 'pr' : 'pl',
  paddingEnd: isRTL ? 'pl' : 'pr',
  borderStart: isRTL ? 'border-r' : 'border-l',
  borderEnd: isRTL ? 'border-l' : 'border-r',
  roundedStart: isRTL ? 'rounded-r' : 'rounded-l',
  roundedEnd: isRTL ? 'rounded-l' : 'rounded-r',
});

// RTL-aware icon positioning
export const RTLIcon: React.FC<{
  children: React.ReactNode;
  position?: 'start' | 'end';
  className?: string;
}> = ({ children, position = 'start', className = '' }) => {
  const { isRTL } = useRTL();
  
  const positionClass = position === 'start'
    ? (isRTL ? 'mr-2' : 'ml-2')
    : (isRTL ? 'ml-2' : 'mr-2');
  
  return (
    <span className={`${positionClass} ${className}`}>
      {children}
    </span>
  );
};

// RTL-aware text alignment
export const RTLText: React.FC<{
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
}> = ({ children, align = 'start', className = '' }) => {
  const { isRTL } = useRTL();
  
  let alignClass = '';
  switch (align) {
    case 'start':
      alignClass = isRTL ? 'text-right' : 'text-left';
      break;
    case 'end':
      alignClass = isRTL ? 'text-left' : 'text-right';
      break;
    case 'center':
      alignClass = 'text-center';
      break;
  }
  
  return (
    <div className={`${alignClass} ${className}`}>
      {children}
    </div>
  );
};

export default RTLProvider;