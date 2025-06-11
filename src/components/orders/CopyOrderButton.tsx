import React from 'react';
import { Copy } from 'lucide-react';
import { Order } from '../../types/apex';

interface CopyOrderButtonProps {
  order: Order;
  className?: string;
}

const CopyOrderButton: React.FC<CopyOrderButtonProps> = ({ order, className = '' }) => {
  const copyOrderDetails = () => {
    const itemRows = order.items.map((item, index) => [
      (index + 1).toString(),
      item.batch_name,
      item.product_name,
      item.order_quantity.toString(),
      '',
      item.order_price,
      '',  // Weight placeholder
      item.product_sku
    ].join('\t'));

    const content = itemRows.join('\n');
    
    navigator.clipboard.writeText(content).then(() => {
      alert('Order details copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy order details');
    });
  };

  return (
    <button
      onClick={copyOrderDetails}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 ${className}`}
    >
      <Copy className="h-4 w-4 mr-2" />
      Copy Order
    </button>
  );
};

export default CopyOrderButton;