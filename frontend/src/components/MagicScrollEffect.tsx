import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface MagicScrollEffectProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'parallax' | 'fade' | 'scale' | 'rotate' | 'morph';
}

const MagicScrollEffect: React.FC<MagicScrollEffectProps> = ({
  children,
  className = '',
  effect = 'parallax'
}) => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const effects = {
    parallax: { y, opacity, scale },
    fade: { opacity, scale },
    scale: { scale, opacity },
    rotate: { rotate, opacity, scale },
    morph: { 
      y: useTransform(scrollYProgress, [0, 1], [0, -50]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 0.9]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 1, 0.6])
    }
  };

  return (
    <motion.div
      style={effects[effect]}
      className={className}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default MagicScrollEffect;
