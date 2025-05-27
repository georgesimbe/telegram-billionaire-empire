import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const PageHeader = ({
  title,
  subtitle,
  description,
  rightContent,
  showCash = false,
  cash = 0,
  icon: Icon,
  className = ""
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-8 w-8 text-blue-400" />}
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showCash && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Cash</p>
              <p className="text-xl font-bold text-green-400">
                ${cash.toLocaleString()}
              </p>
            </div>
          )}
          {rightContent}
        </div>
      </div>

      {description && (
        <p className="text-gray-300 text-sm max-w-2xl">{description}</p>
      )}
    </div>
  );
};

export default PageHeader; 