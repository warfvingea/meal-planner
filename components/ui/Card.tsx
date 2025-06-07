import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'green';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const baseClasses = 'rounded-lg shadow-lg p-6';
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    green: 'bg-green-50 dark:bg-green-900'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;