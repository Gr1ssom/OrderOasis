import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, BarChart3, 
  Settings, HelpCircle, Menu, X, Calculator, MapPin
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Orders', icon: ShoppingCart, path: '/orders' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Accounting', icon: Calculator, path: '/accounting' },
    { name: 'Allocation', icon: MapPin, path: '/allocation' },
    { divider: true },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help', icon: HelpCircle, path: '/help' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`
    : 'hidden md:block min-h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200';
  
  const sidebarContent = (
    <>
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          {/* Light mode logo */}
          <img 
            src="/robust_logo_horizontal-BLK.jpg" 
            alt="Robust Logo" 
            className="h-8 dark:hidden"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
              const textElement = e.currentTarget.parentElement?.querySelector('.fallback-text') as HTMLElement;
              if (textElement) {
                textElement.style.display = 'block';
              }
            }}
          />
          
          {/* Dark mode logo */}
          <img 
            src="/robust_logo_horizontal-WHT.png" 
            alt="Robust Logo" 
            className="h-8 hidden dark:block"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
              const textElement = e.currentTarget.parentElement?.querySelector('.fallback-text') as HTMLElement;
              if (textElement) {
                textElement.style.display = 'block';
              }
            }}
          />
          
          {/* Fallback text */}
          <span className="fallback-text text-xl font-semibold text-gray-900 dark:text-gray-100" style={{ display: 'none' }}>
            Robust Dashboard
          </span>
        </Link>
        {isMobile && (
          <button onClick={toggleSidebar} className="md:hidden text-gray-600 dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <div className="mt-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item, index) => 
            item.divider ? (
              <div key={`divider-${index}`} className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-md group transition-colors duration-200
                  ${isActive(item.path) 
                    ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive(item.path) 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                  }`} 
                />
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <button 
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-30 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      )}
      
      <aside className={sidebarClasses}>
        {sidebarContent}
      </aside>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;