import React from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface SectionAnimationProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate' | 'parallax' | 'magnetic';
  delay?: number;
  duration?: number;
}

const SectionAnimation: React.FC<SectionAnimationProps> = ({
  children,
  className = '',
  variant = 'fade',
  delay = 0,
  duration = 0.8
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const variants = {
    fade: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slide: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotateY: -90 },
      visible: { opacity: 1, rotateY: 0 }
    },
    parallax: {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 }
    },
    magnetic: {
      hidden: { opacity: 0, y: 50, rotateX: -15 },
      visible: { opacity: 1, y: 0, rotateX: 0 }
    }
  };

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const renderVariant = () => {
    switch (variant) {
      case 'parallax':
        return (
          <motion.div
            ref={ref}
            style={{ y, opacity, scale }}
            className={className}
          >
            {children}
          </motion.div>
        );
      case 'magnetic':
        return (
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants.magnetic}
            transition={{ duration, delay, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              rotateY: 2,
              transition: { duration: 0.3 }
            }}
            className={className}
          >
            {children}
          </motion.div>
        );
      default:
        return (
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants[variant]}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
          >
            {children}
          </motion.div>
        );
    }
  };

  return renderVariant();
};

export default SectionAnimation;
