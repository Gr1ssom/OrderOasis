import React from 'react';
import { Calculator, DollarSign, CreditCard, FileText, TrendingUp } from 'lucide-react';

function Accounting() {
  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              Accounting Dashboard
            </h2>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">$0.00</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Payments Received</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">$0.00</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-lg border border-amber-200 dark:border-amber-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Outstanding</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">$0.00</p>
                </div>
                <FileText className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">0%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          {/* Coming Soon Message */}
          <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors duration-200">
            <Calculator className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Accounting Features Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We're building comprehensive accounting features including payment tracking, 
              invoice management, financial reporting, and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Payment Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor all incoming and outgoing payments with detailed transaction history.</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Invoice Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate, send, and track invoices with automated payment reminders.</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Financial Reports</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive financial reporting with profit & loss, cash flow, and more.</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Tax Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track tax obligations and generate tax reports for compliance.</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Expense Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor business expenses and categorize costs for better insights.</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Bank Reconciliation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically reconcile bank transactions with your accounting records.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounting;