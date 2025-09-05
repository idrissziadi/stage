import React from 'react';
import { motion } from 'framer-motion';

interface MagicTransitionProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'wave' | 'particles' | 'geometric' | 'aurora';
}

const MagicTransition: React.FC<MagicTransitionProps> = ({
  children,
  className = '',
  variant = 'wave'
}) => {
  const variants = {
    wave: (
      <div className="relative h-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 50%)'
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-70"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 0 60%)'
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 opacity-50"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 0 80%)'
          }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
    ),
    particles: (
      <div className="relative h-32 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-card rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    geometric: (
      <div className="relative h-32 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/40 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: [360, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/25 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/35 rounded-full" />
        </motion.div>
      </div>
    ),
    aurora: (
      <div className="relative h-32 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30"
          animate={{
            x: [-100, 100, -100],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-blue-400/20"
          animate={{
            x: [100, -100, 100],
            y: [0, 20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/25 via-blue-400/25 to-indigo-400/25"
          animate={{
            x: [-50, 50, -50],
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
      </div>
    )
  };

  return (
    <div className={className}>
      {variants[variant]}
      {children}
    </div>
  );
};

export default MagicTransition;
