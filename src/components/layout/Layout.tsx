import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <Sidebar isMobile />
      
      <main className="flex-1 overflow-auto bg-white dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <div className="p-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout