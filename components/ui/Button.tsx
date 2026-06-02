'use client';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({ children, onClick, variant = 'primary', disabled, fullWidth, className }: ButtonProps) {
  const styles = {
    primary: {
      backgroundColor: disabled ? 'var(--color-border)' : 'var(--color-gold)',
      color: disabled ? 'var(--color-text-tertiary)' : '#1C1917',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
      border: 'none',
    },
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={`rounded-full text-sm tracking-widest uppercase ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      style={{
        ...styles[variant],
        minHeight: 56,
        padding: '0 32px',
        fontFamily: 'var(--font-inter)',
        fontWeight: 500,
        letterSpacing: '0.15em',
        fontSize: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </motion.button>
  );
}
