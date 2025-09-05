import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  direction = 'up'
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 100 };
      case 'down':
        return { opacity: 0, y: -100 };
      case 'left':
        return { opacity: 0, x: -100 };
      case 'right':
        return { opacity: 0, x: 100 };
      default:
        return { opacity: 0, y: 100 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 1, y: 0 };
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
        return { opacity: 1, x: 0 };
      case 'right':
        return { opacity: 1, x: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.section
      id={id}
      className={className}
      initial={getInitialPosition()}
      whileInView={getFinalPosition()}
      transition={{ 
        duration: 1, 
        ease: "easeOut",
        delay: delay
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
