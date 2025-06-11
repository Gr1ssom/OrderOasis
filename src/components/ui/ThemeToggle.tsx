import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'switch' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'switch', 
  size = 'md',
  showLabel = true 
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          ${size === 'sm' ? 'p-2' : size === 'lg' ? 'p-3' : 'p-2.5'}
        `}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}`} />
        ) : (
          <Sun className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}`} />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
          className="
            appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 pr-8
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
          "
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          {theme === 'light' ? (
            <Sun className="h-4 w-4 text-gray-400" />
          ) : (
            <Moon className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
    );
  }

  // Default switch variant
  return (
    <div className="flex items-center space-x-3">
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme
        </span>
      )}
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        <button
          onClick={toggleTheme}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
            ${theme === 'dark' 
              ? 'bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700'
            }
          `}
          role="switch"
          aria-checked={theme === 'dark'}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
              ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        <Moon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
};

export default ThemeToggle;