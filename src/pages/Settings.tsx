import React, { useState } from 'react';
import { Settings2, User, Bell, Shield, Palette, Globe, Save, Check } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

function Settings() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'general', name: 'General', icon: Globe },
  ];

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <Settings2 className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              Settings
            </h2>
            <button
              onClick={handleSave}
              className={`
                inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                dark:focus:ring-offset-gray-800
                ${saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Appearance Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Customize how the application looks and feels.
                </p>
              </div>

              {/* Theme Selection */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Color Theme
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Choose between light and dark mode, or let the system decide.
                    </p>
                  </div>
                  <ThemeToggle variant="switch" showLabel={false} />
                </div>
              </div>

              {/* Theme Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">Current Theme</h5>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${theme === 'light' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }
                    `}>
                      {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Quick Actions
                    </h5>
                    <div className="space-y-2">
                      <ThemeToggle variant="button" size="sm" showLabel={false} />
                      <ThemeToggle variant="dropdown" showLabel={false} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Appearance Options */}
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Display Options
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      defaultChecked
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      Show animations and transitions
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      defaultChecked
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      Compact table rows
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      High contrast mode
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Profile Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Manage your account information and preferences.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'appearance' && activeTab !== 'profile' && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Settings2 className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.name} Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configuration options for {tabs.find(tab => tab.id === activeTab)?.name.toLowerCase()} coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;