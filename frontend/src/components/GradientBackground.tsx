import React from 'react';
import { motion } from 'framer-motion';

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'section' | 'card';
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const variants = {
    default: "bg-gradient-to-br from-blue-50 via-white to-green-50",
    hero: "bg-gradient-to-br from-blue-600 via-purple-600 to-green-600",
    section: "bg-gradient-to-br from-blue-100 via-white to-green-100",
    card: "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"
  };

  const baseClasses = variants[variant];

  return (
    <div className={`relative overflow-hidden ${baseClasses} ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute top-40 right-32 w-24 h-24 bg-green-400/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
          className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-400/20 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Wave Effect */}
        <motion.div
          animate={{
            y: [0, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/10 to-transparent"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 50%)'
          }}
        />
        
        <motion.div
          animate={{
            y: [0, -15, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-500/10 to-transparent"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 0 60%)'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Specialized Hero Background
export const HeroGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GradientBackground variant="hero" className="min-h-screen">
      {/* Additional Hero Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/10 rounded-full"
        />
        
        <motion.div
          animate={{
            rotate: [360, 0]
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/4 w-64 h-64 border border-white/10 rounded-full"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-card rounded-full"
        />
      </div>
      
      {children}
    </GradientBackground>
  );
};

export default GradientBackground;
