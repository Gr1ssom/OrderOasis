import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { Order } from '../types/apex';
import { 
  ArrowLeft, Calendar, MapPin, Phone, Mail, Download, 
  Truck, DollarSign, Tag, Clipboard, Users 
} from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import PickSheet from '../components/orders/PickSheet';
import CopyOrderButton from '../components/orders/CopyOrderButton';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderById(Number(id));
        if (response.orders.length > 0) {
          setOrder(response.orders[0]);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-full p-6 transition-colors duration-200">
        <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error || 'Order not found'}</p>
          <Link to="/orders" className="mt-4 inline-block text-red-700 dark:text-red-300 hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <Link 
              to="/orders"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              Order {order.invoice_number}
              <StatusBadge 
                status={order.cancelled ? 'Cancelled' : order.order_status.name} 
                className="ml-3"
              />
            </h1>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3">
            <CopyOrderButton order={order} />
            <PickSheet orders={[order]} />
            <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none transition-colors duration-200">
              Process Order
            </button>
          </div>
        </div>
        
        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Order Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
              <Clipboard className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              Order Details
            </h2>
            <dl className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  {formatDate(order.order_date)}
                </dd>
              </div>
              
              {order.delivery_date && (
                <div className="grid grid-cols-2 gap-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Date</dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    {formatDate(order.delivery_date)}
                  </dd>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{order.created_by}</dd>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">
                  <StatusBadge 
                    status={order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  />
                </dd>
              </div>
              
              {order.term && (
                <div className="grid grid-cols-2 gap-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Terms</dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100">{order.term.name}</dd>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{formatDateTime(order.updated_at)}</dd>
              </div>
            </dl>
          </div>
          
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
              <Users className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              Customer
            </h2>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{order.buyer.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">License: {order.buyer_state_license}</p>
              {order.buyer_contact_name && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{order.buyer_contact_name}</p>
              )}
              {order.buyer_contact_phone && (
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  {order.buyer_contact_phone}
                </p>
              )}
              {order.buyer_contact_email && (
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  {order.buyer_contact_email}
                </p>
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-4">Sales Representative</h3>
            {order.sales_reps.map((rep, index) => (
              <div key={index} className="mt-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{rep.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  {rep.phone}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  {rep.email}
                </p>
              </div>
            ))}
          </div>
          
          {/* Shipping Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
              <Truck className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
              Shipping
            </h2>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Ship To</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_name}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_line_one}</p>
              {order.ship_line_two && <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_line_two}</p>}
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {order.ship_city}, {order.ship_state} {order.ship_zip}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_country}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Ship From</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_from_name}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_from_line_one}</p>
              {order.ship_from_line_two && <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_from_line_two}</p>}
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {order.ship_from_city}, {order.ship_from_state} {order.ship_from_zip}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{order.ship_from_country}</p>
            </div>
            
            {order.shipping_method && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Method: {order.shipping_method}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      No items in this order
                    </td>
                  </tr>
                ) : (
                  order.items.map((item) => {
                    const itemTotal = parseFloat(item.order_price) * item.order_quantity;
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-start">
                            {item.images && item.images.length > 0 && (
                              <img 
                                src={item.images[0].link} 
                                alt={item.product_name}
                                className="h-10 w-10 mr-3 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{item.product_name}</p>
                              <p className="text-gray-500 dark:text-gray-400">
                                <span className="flex items-center mt-0.5">
                                  <Tag className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                                  {item.brand.name}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.product_sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.order_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                          {formatCurrency(item.order_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                          {formatCurrency(itemTotal.toString())}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Subtotal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{formatCurrency(order.subtotal)}</td>
                </tr>
                {parseFloat(order.additional_discount) > 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Discount</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">-{formatCurrency(order.additional_discount)}</td>
                  </tr>
                )}
                {parseFloat(order.excise_tax) > 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Excise Tax</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{formatCurrency(order.excise_tax)}</td>
                  </tr>
                )}
                {parseFloat(order.delivery_cost) > 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Delivery</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{formatCurrency(order.delivery_cost)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100 text-right">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-blue-600 dark:text-blue-400 text-right">{formatCurrency(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;