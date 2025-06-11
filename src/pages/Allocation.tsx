import React, { useState, useMemo } from 'react';
import { useOrders } from '../context/OrdersContext';
import { Search, MapPin, Package, FileText, TrendingUp, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

interface StoreAllocation {
  storeName: string;
  storeAddress: string;
  invoiceNumber: string;
  orderId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: number;
  orderDate: string;
}

interface ProductAllocation {
  productId: number;
  productName: string;
  productSku: string;
  brand: string;
  category: string;
  totalQuantity: number;
  totalValue: number;
  totalStores: number;
  totalInvoices: number;
  storeAllocations: StoreAllocation[];
}

function Allocation() {
  const { orders, loading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'product' | 'value' | 'quantity' | 'stores'>('product');
  const [viewMode, setViewMode] = useState<'product' | 'store'>('product');

  // Process orders to create product-centric allocation data
  const productAllocationData = useMemo(() => {
    const productMap = new Map<number, ProductAllocation>();
    
    orders.forEach(order => {
      if (order.cancelled) return; // Skip cancelled orders
      
      const storeAddress = `${order.ship_line_one || ''}${order.ship_line_two ? ', ' + order.ship_line_two : ''}, ${order.ship_city || ''}, ${order.ship_state || ''} ${order.ship_zip || ''}`;
      
      order.items.forEach(item => {
        const itemTotal = parseFloat(item.order_price || '0') * (item.order_quantity || 0);
        
        if (!productMap.has(item.product_id)) {
          productMap.set(item.product_id, {
            productId: item.product_id,
            productName: item.product_name || '',
            productSku: item.product_sku || '',
            brand: item.brand?.name || '',
            category: item.product_category?.name || '',
            totalQuantity: 0,
            totalValue: 0,
            totalStores: 0,
            totalInvoices: 0,
            storeAllocations: []
          });
        }
        
        const product = productMap.get(item.product_id)!;
        
        product.storeAllocations.push({
          storeName: order.ship_name || '',
          storeAddress: storeAddress,
          invoiceNumber: order.invoice_number || '',
          orderId: order.id,
          quantity: item.order_quantity || 0,
          unitPrice: item.order_price || '0',
          totalPrice: itemTotal,
          orderDate: order.order_date || ''
        });
        
        product.totalQuantity += (item.order_quantity || 0);
        product.totalValue += itemTotal;
      });
    });
    
    // Calculate unique stores and invoices for each product
    productMap.forEach(product => {
      const uniqueStores = new Set(product.storeAllocations.map(a => a.storeName));
      const uniqueInvoices = new Set(product.storeAllocations.map(a => a.invoiceNumber));
      product.totalStores = uniqueStores.size;
      product.totalInvoices = uniqueInvoices.size;
      
      // Sort allocations by store name, then by date
      product.storeAllocations.sort((a, b) => {
        const storeCompare = (a.storeName || '').localeCompare(b.storeName || '');
        if (storeCompare !== 0) return storeCompare;
        return new Date(b.orderDate || '').getTime() - new Date(a.orderDate || '').getTime();
      });
    });
    
    return Array.from(productMap.values());
  }, [orders]);

  // Store-centric data (existing logic)
  const storeAllocationData = useMemo(() => {
    const storeMap = new Map<string, any>();
    
    orders.forEach(order => {
      if (order.cancelled) return;
      
      const storeKey = `${order.ship_name || ''}|${order.ship_city || ''}, ${order.ship_state || ''}`;
      const storeAddress = `${order.ship_line_one || ''}${order.ship_line_two ? ', ' + order.ship_line_two : ''}, ${order.ship_city || ''}, ${order.ship_state || ''} ${order.ship_zip || ''}`;
      
      if (!storeMap.has(storeKey)) {
        storeMap.set(storeKey, {
          storeName: order.ship_name || '',
          storeAddress: storeAddress,
          totalInvoices: 0,
          totalProducts: 0,
          totalQuantity: 0,
          totalValue: 0,
          products: []
        });
      }
      
      const store = storeMap.get(storeKey)!;
      store.totalInvoices++;
      
      order.items.forEach(item => {
        const itemTotal = parseFloat(item.order_price || '0') * (item.order_quantity || 0);
        
        let productAllocation = store.products.find((p: any) => p.productId === item.product_id);
        if (!productAllocation) {
          productAllocation = {
            productId: item.product_id,
            productName: item.product_name || '',
            productSku: item.product_sku || '',
            brand: item.brand?.name || '',
            category: item.product_category?.name || '',
            totalQuantity: 0,
            totalValue: 0,
            allocations: []
          };
          store.products.push(productAllocation);
        }
        
        productAllocation.allocations.push({
          storeLocation: order.ship_name || '',
          invoiceNumber: order.invoice_number || '',
          orderId: order.id,
          quantity: item.order_quantity || 0,
          unitPrice: item.order_price || '0',
          totalPrice: itemTotal,
          orderDate: order.order_date || ''
        });
        
        productAllocation.totalQuantity += (item.order_quantity || 0);
        productAllocation.totalValue += itemTotal;
        
        store.totalQuantity += (item.order_quantity || 0);
        store.totalValue += itemTotal;
      });
      
      store.totalProducts = store.products.length;
    });
    
    return Array.from(storeMap.values());
  }, [orders]);

  // Filter and sort product data
  const filteredProductData = useMemo(() => {
    let filtered = productAllocationData.filter(product =>
      (product.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.productSku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.storeAllocations.some(allocation =>
        (allocation.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (allocation.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.totalValue - a.totalValue;
        case 'quantity':
          return b.totalQuantity - a.totalQuantity;
        case 'stores':
          return b.totalStores - a.totalStores;
        default:
          return (a.productName || '').localeCompare(b.productName || '');
      }
    });
  }, [productAllocationData, searchTerm, sortBy]);

  // Filter store data (for store view)
  const filteredStoreData = useMemo(() => {
    let filtered = storeAllocationData.filter((store: any) =>
      (store.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.storeAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.products.some((product: any) =>
        (product.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.productSku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'value':
          return b.totalValue - a.totalValue;
        case 'quantity':
          return b.totalQuantity - a.totalQuantity;
        default:
          return (a.storeName || '').localeCompare(b.storeName || '');
      }
    });
  }, [storeAllocationData, searchTerm, sortBy]);

  const toggleProductExpansion = (productId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  // Calculate summary statistics
  const totalStores = new Set(orders.flatMap(order => order.ship_name || '')).size;
  const totalInvoices = orders.filter(order => !order.cancelled).length;
  const totalProducts = productAllocationData.length;
  const totalValue = productAllocationData.reduce((sum, product) => sum + product.totalValue, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalProducts}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full">
              <Package className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stores</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalStores}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full">
              <MapPin className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalInvoices}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full">
              <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalValue.toString())}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full">
              <TrendingUp className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Product Allocation Analysis</h2>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('product')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'product'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                By Product
              </button>
              <button
                onClick={() => setViewMode('store')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'store'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                By Store
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder={viewMode === 'product' ? "Search products, SKUs, brands..." : "Search stores, products, SKUs..."}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm w-full sm:w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              {viewMode === 'product' ? (
                <>
                  <option value="product">Sort by Product</option>
                  <option value="value">Sort by Value</option>
                  <option value="quantity">Sort by Quantity</option>
                  <option value="stores">Sort by Store Count</option>
                </>
              ) : (
                <>
                  <option value="store">Sort by Store</option>
                  <option value="value">Sort by Value</option>
                  <option value="quantity">Sort by Quantity</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Product-Centric View */}
      {viewMode === 'product' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProductData.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No products found matching your search criteria.
              </div>
            ) : (
              filteredProductData.map((product) => (
                <div key={product.productId} className="border-b border-gray-200 dark:border-gray-700">
                  {/* Product Header */}
                  <div 
                    className="p-6 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => toggleProductExpansion(product.productId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {expandedProducts.has(product.productId) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{product.productName}</h3>
                          <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span>SKU: {product.productSku}</span>
                            <span>Brand: {product.brand}</span>
                            <span>Category: {product.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex space-x-6 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Stores: </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{product.totalStores}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Invoices: </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{product.totalInvoices}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Total Qty: </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{product.totalQuantity.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Total Value: </span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{formatCurrency(product.totalValue.toString())}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store Allocations */}
                  {expandedProducts.has(product.productId) && (
                    <div className="bg-white dark:bg-gray-800">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Price</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {product.storeAllocations.map((allocation, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{allocation.storeName}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{allocation.storeAddress}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {allocation.invoiceNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(allocation.orderDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                                  {allocation.quantity.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                                  {formatCurrency(allocation.unitPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                                  {formatCurrency(allocation.totalPrice.toString())}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <Link 
                                    to={`/orders/${allocation.orderId}`}
                                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                                  >
                                    View Order
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Store-Centric View (existing implementation) */}
      {viewMode === 'store' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStoreData.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No stores found matching your search criteria.
              </div>
            ) : (
              filteredStoreData.map((store: any) => (
                <div key={store.storeName} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.storeName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{store.storeAddress}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-6 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Products: </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{store.totalProducts}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Value: </span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{formatCurrency(store.totalValue.toString())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Store-centric view shows products ordered by this store...
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Allocation;