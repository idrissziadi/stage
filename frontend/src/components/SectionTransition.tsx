import React from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  variant?: 'slide' | 'fade' | 'scale' | 'rotate' | 'morph' | 'glitch';
  className?: string;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({ 
  variant = 'slide',
  className = ''
}) => {
  const variants = {
    slide: (
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"
          animate={{
            x: [-100, 100, -100],
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 opacity-70"
          animate={{
            x: [100, -100, 100],
            scale: [1, 0.8, 1],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="w-32 h-1 bg-white/30 rounded-full"
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    ),
    fade: (
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 0.5, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="w-16 h-16 border-2 border-white/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    ),
    scale: (
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-indigo-400/30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20"
          animate={{
            scale: [2, 1, 2],
            opacity: [0.8, 0.3, 0.8]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="w-20 h-20 bg-white/20 rounded-full"
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    ),
    rotate: (
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-purple-600 to-blue-700">
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/40 rounded-full" />
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
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="w-8 h-8 bg-white/40 rounded-full"
            animate={{
              rotate: [0, -360],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    ),
    morph: (
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <motion.div
          className="absolute inset-0"
          animate={{
            clipPath: [
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)',
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-indigo-400/50 via-purple-400/50 to-blue-400/50" />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{
            clipPath: [
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              'polygon(40% 0, 60% 0, 100% 40%, 100% 60%, 60% 100%, 40% 100%, 0 60%, 0 40%)',
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-purple-400/30 via-blue-400/30 to-indigo-400/30" />
        </motion.div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="w-24 h-24 border-2 border-white/40 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    ),
    glitch: (
      <div className="relative h-24 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-blue-400/20"
          animate={{
            x: [0, 10, -10, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-purple-400/20"
          animate={{
            x: [0, -10, 10, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "linear",
            delay: 0.1
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20"
          animate={{
            x: [0, 15, -15, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            ease: "linear",
            delay: 0.05
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="w-20 h-20 bg-white/20 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    )
  };

  return (
    <div className={className}>
      {variants[variant]}
    </div>
  );
};

export default SectionTransition;
