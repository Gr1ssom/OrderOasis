import React, { useState, useMemo } from 'react';
import { Search, Users, ArrowUpDown, Building2, Phone, Mail } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { formatCurrency } from '../utils/formatters';

interface Customer {
  id: number;
  name: string;
  license: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  totalOrders: number;
  totalRevenue: number;
}

function Customers() {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Customer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const customers = useMemo(() => {
    const customerMap = new Map<number, Customer>();
    
    orders.forEach(order => {
      if (customerMap.has(order.buyer_id)) {
        const customer = customerMap.get(order.buyer_id)!;
        customerMap.set(order.buyer_id, {
          ...customer,
          totalOrders: customer.totalOrders + 1,
          totalRevenue: customer.totalRevenue + parseFloat(order.total)
        });
      } else {
        customerMap.set(order.buyer_id, {
          id: order.buyer_id,
          name: order.buyer.name,
          license: order.buyer_state_license,
          contactName: order.buyer_contact_name,
          contactPhone: order.buyer_contact_phone,
          contactEmail: order.buyer_contact_email,
          totalOrders: 1,
          totalRevenue: parseFloat(order.total)
        });
      }
    });
    
    return Array.from(customerMap.values());
  }, [orders]);

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    return [...customers]
      .filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.contactName && customer.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.contactEmail && customer.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
  }, [customers, searchTerm, sortField, sortDirection]);

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              Customers
            </h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200">
                Add Customer
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Customer
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('license')}
                >
                  <div className="flex items-center">
                    License
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('contactName')}
                >
                  <div className="flex items-center">
                    Contact
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalOrders')}
                >
                  <div className="flex items-center">
                    Orders
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalRevenue')}
                >
                  <div className="flex items-center">
                    Revenue
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{customer.license}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {customer.contactName && (
                        <div className="font-medium text-gray-900 dark:text-gray-100">{customer.contactName}</div>
                      )}
                      {customer.contactPhone && (
                        <div className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          {customer.contactPhone}
                        </div>
                      )}
                      {customer.contactEmail && (
                        <div className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          {customer.contactEmail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{customer.totalOrders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(customer.totalRevenue.toString())}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;