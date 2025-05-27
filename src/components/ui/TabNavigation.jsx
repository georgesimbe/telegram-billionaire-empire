import React from 'react';

const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default'
}) => {
  const variants = {
    default: {
      container: 'flex space-x-1 bg-gray-800 p-1 rounded-lg',
      tab: 'flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
      active: 'bg-blue-600 text-white shadow-sm',
      inactive: 'text-gray-400 hover:text-white hover:bg-gray-700'
    },
    pills: {
      container: 'flex space-x-2',
      tab: 'flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
      active: 'bg-blue-600 text-white',
      inactive: 'text-gray-400 hover:text-white hover:bg-gray-700'
    },
    underline: {
      container: 'flex space-x-8 border-b border-gray-700',
      tab: 'flex items-center space-x-2 px-1 py-3 text-sm font-medium transition-all duration-200 border-b-2 border-transparent',
      active: 'text-blue-400 border-blue-400',
      inactive: 'text-gray-400 hover:text-white hover:border-gray-600'
    }
  };

  const currentVariant = variants[variant];

  const renderIcon = (icon) => {
    if (!icon) return null;

    // Check if icon is a string (emoji or text)
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }

    // Check if icon is a React component
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className="h-4 w-4" />;
    }

    return null;
  };

  return (
    <nav className={`${currentVariant.container} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${currentVariant.tab} ${isActive ? currentVariant.active : currentVariant.inactive
              }`}
          >
            {renderIcon(tab.icon)}
            <span>{tab.label || tab.name}</span>
            {tab.badge && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default TabNavigation; 