'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary:
    'bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black ' +
    'shadow-[0_0_12px_rgba(0,229,255,0.5)] hover:shadow-[0_0_24px_rgba(0,229,255,0.9)]',
  secondary:
    'bg-transparent border-2 border-fuchsia-400 text-fuchsia-400 hover:bg-fuchsia-400 hover:text-black ' +
    'shadow-[0_0_12px_rgba(232,121,249,0.4)] hover:shadow-[0_0_24px_rgba(232,121,249,0.8)]',
  danger:
    'bg-transparent border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-black ' +
    'shadow-[0_0_12px_rgba(255,45,85,0.4)] hover:shadow-[0_0_24px_rgba(255,45,85,0.8)]',
  ghost:
    'bg-transparent border border-white/20 text-white/70 hover:border-white/50 hover:text-white',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'font-orbitron font-bold tracking-widest uppercase rounded',
        'transition-all duration-200 active:scale-95 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
