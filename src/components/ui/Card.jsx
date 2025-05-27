import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  padding = 'default',
  hover = false,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `bg-gray-800 rounded-lg border border-gray-700 ${paddingClasses[padding]} ${className}`;
  const hoverClasses = hover ? 'hover:bg-gray-750 transition-colors duration-200 cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses}`} {...props}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

// Specialized card components
export const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  className = ''
}) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400'
  };

  return (
    <Card className={className} padding="default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? '↗' : '↘'} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <Icon className={`h-8 w-8 ${colorClasses[color]} opacity-60`} />
        )}
      </div>
    </Card>
  );
};

export default Card; 