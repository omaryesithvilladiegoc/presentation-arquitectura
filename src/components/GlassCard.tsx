import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
  borderLeft?: string;
}

export function GlassCard({ children, className = '', hoverGlow = false, borderLeft }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card p-6 lg:p-8 ${hoverGlow ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
      style={borderLeft ? { borderLeft: `3px solid ${borderLeft}` } : undefined}
      whileHover={hoverGlow ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
