import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Determine the page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/orders')) return 'Orders';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/customers')) return 'Customers';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/accounting')) return 'Accounting';
    if (path.startsWith('/allocation')) return 'Allocation';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/help')) return 'Help';
    
    return 'Dashboard';
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-200">
      <div className="px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getPageTitle()}
        </h1>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="button" size="sm" showLabel={false} />
        </div>
      </div>
    </header>
  );
};

export default Header;