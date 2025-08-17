'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function StaggerContainer({ 
  children, 
  className = '', 
  delay = 0 
}: StaggerContainerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem = ({ 
  children, 
  className = '',
  fromY = 30,
  fromX = 0 
}: { 
  children: ReactNode; 
  className?: string;
  fromY?: number;
  fromX?: number;
}) => {
  const item = {
    hidden: { 
      opacity: 0, 
      y: fromY, 
      x: fromX,
      scale: 0.95 
    },
    show: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};