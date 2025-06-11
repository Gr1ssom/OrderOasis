import React from 'react';
import { HelpCircle, Book, MessageCircle, Mail } from 'lucide-react';

function Help() {
  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
            Help Center
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-200">
              <Book className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Documentation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive guides and documentation to help you use the platform effectively.
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Browse Docs →
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-200">
              <MessageCircle className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get instant help from our support team through live chat.
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Start Chat →
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors duration-200">
              <Mail className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Contact Us →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;