import React from 'react';

type ButtonVariant = 'solid' | 'outline' | 'icon';
type ButtonColor = 'green' | 'red' | 'blue' | 'orange' | 'gray';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

interface IconButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {
  icon: React.ReactNode;
  title: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-base',
  lg: 'h-10 px-4 text-base'
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2'
};

const colorClasses: Record<ButtonColor, Record<ButtonVariant, string>> = {
  green: {
    solid: 'bg-green-500 text-white hover:bg-green-400 focus:ring-green-400 border border-green-400',
    outline: 'bg-transparent text-green-600 border border-green-600 hover:bg-green-50 focus:ring-green-500',
    icon: 'text-green-400 hover:bg-green-100'
  },
  red: {
    solid: 'bg-red-500 text-white hover:bg-red-400 focus:ring-red-400 border border-red-400',
    outline: 'bg-transparent text-red-600 border border-red-600 hover:bg-red-50 focus:ring-red-500',
    icon: 'text-red-400 hover:bg-red-100'
  },
  blue: {
    solid: 'bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-400 border border-blue-400',
    outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    icon: 'text-blue-400 hover:bg-blue-100'
  },
  orange: {
    solid: 'bg-amber-500 text-white hover:bg-amber-400 focus:ring-amber-500 border border-amber-400',
    outline: 'bg-transparent text-amber-600 border border-amber-600 hover:bg-amber-50 focus:ring-amber-500',
    icon: 'text-amber-400 hover:bg-amber-100'
  },
  gray: {
    solid: 'bg-gray-500 text-white hover:bg-gray-400 focus:ring-gray-400 border border-gray-400',
    outline: 'bg-transparent text-gray-600 border border-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    icon: 'text-gray-400 hover:bg-gray-100'
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  color = 'blue',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const isIcon = variant === 'icon';
  const sizeClass = isIcon ? iconSizeClasses[size] : sizeClasses[size];
  
  const combinedClasses = `
    ${baseClasses}
    ${sizeClass}
    ${colorClasses[color][variant]}
    ${className}
  `.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && variant !== 'icon' && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  title,
  color = 'gray',
  size = 'md',
  ...props
}) => {
  return (
    <Button
      variant="icon"
      color={color}
      size={size}
      title={title}
      {...props}
    >
      {icon}
    </Button>
  );
};
