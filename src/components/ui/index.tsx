import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'neutral' | 'lime' | 'salmon';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  size = 'md',
}) => {
  const baseClasses = 'inline-flex items-center font-bold rounded-full transition-colors';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  const variantMap = {
    lime: 'bg-[#D2F829] text-[#19202D]',
    salmon: 'bg-[#FEECEC] text-[#FA6B6B] border border-[#FCD2D2]',
    success: 'bg-[#EBF7F0] text-[#20A66A] border border-[#C6ECD7]',
    warning: 'bg-[#FEF9E7] text-[#D9A300] border border-[#FBE9A3]',
    error: 'bg-[#FDF2F2] text-[#E85B63] border border-[#F9CFD2]',
    info: 'bg-[#EAF3FF] text-[#2583E9] border border-[#BEDCFF]',
    default: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    neutral: 'bg-white text-[#6B7280] border border-[#E7EBF0]',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'lime';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  const variantStyles = {
    lime: 'bg-[#D2F829] text-[#19202D] hover:bg-[#C2E820] focus:ring-[#D2F829] shadow-sm',
    primary: 'bg-[#2583E9] text-white hover:bg-[#1768C4] focus:ring-[#2583E9] shadow-sm',
    secondary: 'bg-[#F8FAFC] text-[#19202D] hover:bg-[#EAF3FF] hover:text-[#2583E9] border border-[#E7EBF0] focus:ring-[#2583E9]',
    outline: 'bg-white text-[#19202D] hover:bg-[#F8FAFC] border border-[#E7EBF0] focus:ring-[#2583E9]',
    danger: 'bg-[#E85B63] text-white hover:bg-[#D44049] focus:ring-[#E85B63]',
    ghost: 'bg-transparent text-[#6B7280] hover:text-[#19202D] hover:bg-[#F8FAFC]',
    success: 'bg-[#20A66A] text-white hover:bg-[#198856] focus:ring-[#20A66A]',
  };

  return (
    <button
      className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  noPadding = false,
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-[#E7EBF0] shadow-subtle ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7EBF0]">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-bold text-[#19202D]">{title}</h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-[11px] text-[#6B7280] mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${maxWidth} bg-white rounded-2xl border border-[#E7EBF0] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7EBF0]">
            <div>
              <h3 className="text-base font-bold text-[#19202D]">{title}</h3>
              {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#19202D] hover:bg-[#F8FAFC] p-1.5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 max-h-[78vh] overflow-y-auto">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E7EBF0] bg-[#F8FAFC]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
