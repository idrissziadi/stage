import React from 'react';
import { motion } from 'framer-motion';

interface MagicParticlesProps {
  count?: number;
  className?: string;
}

const MagicParticles: React.FC<MagicParticlesProps> = ({ 
  count = 50, 
  className = '' 
}) => {
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    color: [
      'from-blue-400 to-indigo-400',
      'from-indigo-400 to-purple-400',
      'from-purple-400 to-blue-400',
      'from-blue-300 to-indigo-300',
      'from-indigo-300 to-purple-300'
    ][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-${Math.ceil(particle.size)} h-${Math.ceil(particle.size)} bg-gradient-to-r ${particle.color} rounded-full opacity-60`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 0.8, 1],
          x: [0, -40, 0],
          y: [0, 25, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/2 w-40 h-40 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default MagicParticles;
