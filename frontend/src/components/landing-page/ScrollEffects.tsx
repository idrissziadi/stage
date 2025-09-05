import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollEffectsProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  speed?: number;
}

const ScrollEffects: React.FC<ScrollEffectsProps> = ({
  children,
  className = '',
  offset = 0,
  direction = 'up',
  speed = 0.5
}) => {
  const { scrollYProgress } = useScroll();
  
  const getTransform = () => {
    const baseOffset = offset * 100;
    const scrollOffset = scrollYProgress.get() * 100 * speed;
    
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [baseOffset, baseOffset - 100 * speed]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [baseOffset, baseOffset + 100 * speed]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [baseOffset, baseOffset - 100 * speed]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [baseOffset, baseOffset + 100 * speed]);
      default:
        return useTransform(scrollYProgress, [0, 1], [baseOffset, baseOffset]);
    }
  };

  const transform = getTransform();

  return (
    <motion.div
      className={className}
      style={{
        y: direction === 'up' || direction === 'down' ? transform : undefined,
        x: direction === 'left' || direction === 'right' ? transform : undefined
      }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Section Component
export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  speed?: number;
}> = ({ children, className = '', speed = 0.5 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Reveal on Scroll Component
export const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 50, opacity: 0 };
      case 'down':
        return { y: -50, opacity: 0 };
      case 'left':
        return { x: 50, opacity: 0 };
      case 'right':
        return { x: -50, opacity: 0 };
      default:
        return { y: 50, opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up':
        return { y: 0, opacity: 1 };
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
        return { x: 0, opacity: 1 };
      case 'right':
        return { x: 0, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialPosition()}
      whileInView={getAnimatePosition()}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollEffects;
