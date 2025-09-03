import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'colored';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  icon: Icon,
  title,
  subtitle,
  onClick,
  variant = 'default'
}) => {
  const baseClasses = "relative overflow-hidden backdrop-blur-sm border border-white/20 transition-all duration-500";
  
  const variants = {
    default: "bg-white/10 hover:bg-white/20",
    elevated: "bg-white/20 hover:bg-white/30 shadow-2xl",
    colored: "bg-gradient-to-br from-blue-500/20 to-green-500/20 hover:from-blue-500/30 hover:to-green-500/30"
  };

  const cardClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <motion.div
      className={cardClasses}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      {/* Content */}
      <div className="relative p-6">
        {(Icon || title) && (
          <div className="mb-4">
            {Icon && (
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3"
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
            )}
            {title && (
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            )}
            {subtitle && (
              <p className="text-white/80 text-sm">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className="text-white/90">
          {children}
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <motion.div
        className="absolute inset-0 border-2 border-white/20 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-2xl opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Specialized Glass Card Variants
export const InfoGlassCard: React.FC<{
  icon: LucideIcon;
  title: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}> = ({ icon: Icon, title, value, description, trend, trendValue }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <GlassCard variant="elevated" className="text-center">
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        <p className="text-white/70 text-sm mb-3">{description}</p>
        
        {trend && trendValue && (
          <div className={`flex items-center space-x-2 space-x-reverse ${getTrendColor()}`}>
            <span className="text-lg">{getTrendIcon()}</span>
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default GlassCard;
