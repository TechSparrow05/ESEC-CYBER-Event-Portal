import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'technical' | 'nonTechnical' | 'indigo' | 'cyan' | 'success' | 'warning' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className = '' 
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };

  const variantStyles = {
    technical: 'bg-brand-indigo/15 text-indigo-300 border-brand-indigo/40',
    nonTechnical: 'bg-brand-cyan/15 text-cyan-300 border-brand-cyan/40',
    indigo: 'bg-brand-indigo/20 text-brand-indigoLight border-brand-indigo/50',
    cyan: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/50',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    neutral: 'bg-brand-surface text-brand-muted border-brand-border'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
