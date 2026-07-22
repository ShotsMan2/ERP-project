import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  ...rest 
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" } : {}}
      transition={{ duration: 0.3 }}
      className={`
        bg-white/70 dark:bg-gray-800/60 
        backdrop-blur-xl border border-white/20 dark:border-gray-700/50
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
        rounded-2xl overflow-hidden
        ${className}
      `}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
