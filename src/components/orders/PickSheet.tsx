import React from 'react';
import { Order } from '../../types/apex';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface PickSheetProps {
  orders: Order[];
}

const PickSheet: React.FC<PickSheetProps> = ({ orders }) => {
  const generatePickSheet = () => {
    const content = orders.map(order => {
      // Calculate total full cases (only items with "case" or "full case" in the name)
      const totalFullCases = order.items.reduce((sum, item) => {
        const productName = item.product_name.toLowerCase();
        if (productName.includes('case') || productName.includes('full case')) {
          return sum + item.order_quantity;
        }
        return sum;
      }, 0);
      
      // Calculate sample units (only items with "sample" in the name)
      const totalSampleUnits = order.items.reduce((sum, item) => {
        const productName = item.product_name.toLowerCase();
        if (productName.includes('sample')) {
          return sum + item.order_quantity;
        }
        return sum;
      }, 0);
      
      return `
      <div class="pick-sheet" style="page-break-after: always; padding: 20px; max-width: 8.5in; margin: 0 auto; font-size: 10pt;">
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <h1 style="font-size: 24px; margin: 0 0 15px 0;">Pick Sheet</h1>
          </div>
          <div style="text-align: right;">
            <img src="/robust_logo_horizontal-BLK.jpg" style="height: 50px; margin-bottom: 10px;" alt="Robust Logo" onerror="this.style.display='none'">
          </div>
        </div>

        <div style="border-bottom: 1px solid #000; padding-bottom: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <div style="margin-top: 10px;">
                <p style="margin: 0 0 5px 0;"><strong>Order #:</strong> ${order.invoice_number}</p>
                <p style="margin: 0 0 5px 0;"><strong>Date:</strong> ${formatDate(order.order_date)}</p>
                <p style="margin: 0 0 5px 0;"><strong>Total Items:</strong> ${order.items.reduce((sum, item) => sum + item.order_quantity, 0)}</p>
                <p style="margin: 0 0 5px 0;"><strong>Total SKUs:</strong> ${order.items.length}</p>
                <p style="margin: 0 0 5px 0; font-size: 12pt; font-weight: bold; color: #2563eb;"><strong>Total Full Cases:</strong> ${totalFullCases}</p>
                <p style="margin: 0; font-size: 12pt; font-weight: bold; color: #059669;"><strong>Sample Units:</strong> ${totalSampleUnits}</p>
              </div>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0 0 8px 0; font-size: 14pt; font-weight: bold;"><strong>Customer:</strong> ${order.buyer.name}</p>
              <p style="margin: 0 0 8px 0; font-size: 12pt;"><strong>License:</strong> ${order.buyer_state_license}</p>
              ${order.buyer_contact_name ? `<p style="margin: 0 0 8px 0; font-size: 12pt;"><strong>Contact:</strong> ${order.buyer_contact_name}</p>` : ''}
              ${order.buyer_contact_phone ? `<p style="margin: 0; font-size: 12pt;"><strong>Phone:</strong> ${order.buyer_contact_phone}</p>` : ''}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="border: 1px solid #000; border-radius: 4px; padding: 15px;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px;">Manifest Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="border: 1px solid #000; padding: 10px;">
                <h4 style="margin: 0 0 8px 0; font-size: 12px;">Origin</h4>
                <p style="margin: 0 0 5px 0;"><strong>Facility:</strong> ${order.ship_from_name}</p>
                <p style="margin: 0 0 2px 0;">${order.ship_from_line_one}</p>
                ${order.ship_from_line_two ? `<p style="margin: 0 0 2px 0;">${order.ship_from_line_two}</p>` : ''}
                <p style="margin: 0;">${order.ship_from_city}, ${order.ship_from_state} ${order.ship_from_zip}</p>
              </div>
              <div style="border: 1px solid #000; padding: 10px;">
                <h4 style="margin: 0 0 8px 0; font-size: 12px;">Destination</h4>
                <p style="margin: 0 0 5px 0;"><strong>Facility:</strong> ${order.ship_name}</p>
                <p style="margin: 0 0 2px 0;">${order.ship_line_one}</p>
                ${order.ship_line_two ? `<p style="margin: 0 0 2px 0;">${order.ship_line_two}</p>` : ''}
                <p style="margin: 0;">${order.ship_city}, ${order.ship_state} ${order.ship_zip}</p>
              </div>
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt;">
          <thead>
            <tr>
              <th style="width: 30px; padding: 8px; border: 1px solid #000; background-color: #f3f4f6; font-weight: bold; text-align: center;">#</th>
              <th style="padding: 8px; border: 1px solid #000; background-color: #f3f4f6; font-weight: bold; text-align: left;">Item Details</th>
              <th style="width: 60px; padding: 8px; border: 1px solid #000; background-color: #f3f4f6; font-weight: bold; text-align: center;">Qty</th>
              <th style="width: 80px; padding: 8px; border: 1px solid #000; background-color: #f3f4f6; font-weight: bold; text-align: center;">Price</th>
              <th style="width: 60px; padding: 8px; border: 1px solid #000; background-color: #f3f4f6; font-weight: bold; text-align: center;">Picked</th>
              <th style="width: 80px; padding: 8px; border: 1px solid #000; background-color: #f3f4f6; font-weight: bold; text-align: center;">Manifested</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item, index) => {
              const unitPrice = parseFloat(item.order_price);
              const totalPrice = unitPrice * item.order_quantity;
              
              return `
              <tr>
                <td style="text-align: center; padding: 8px; border: 1px solid #000; font-weight: bold;">
                  ${index + 1}
                </td>
                <td style="padding: 8px; border: 1px solid #000;">
                  <div style="display: flex; gap: 10px;">
                    ${item.images && item.images.length > 0 ? `
                      <img src="${item.images[0].link}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" alt="${item.product_name}">
                    ` : ''}
                    <div>
                      <div style="font-weight: bold;">${item.product_name}</div>
                      <div style="margin: 4px 0;">
                        <strong>Batch:</strong> ${item.batch_name}
                      </div>
                      <div style="font-size: 9pt;">
                        <div>SKU: ${item.product_sku}</div>
                        <div>License: ${item.operation_license}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td style="text-align: center; padding: 8px; border: 1px solid #000; font-size: 14px; font-weight: bold;">
                  ${item.order_quantity}
                </td>
                <td style="text-align: center; padding: 8px; border: 1px solid #000; font-size: 9pt;">
                  <div style="font-weight: bold;">${formatCurrency(unitPrice.toString())}</div>
                  <div style="color: #666; margin-top: 2px;">each</div>
                  <div style="font-weight: bold; margin-top: 4px; padding-top: 4px; border-top: 1px solid #ddd;">${formatCurrency(totalPrice.toString())}</div>
                  <div style="color: #666; font-size: 8pt;">total</div>
                </td>
                <td style="text-align: center; padding: 8px; border: 1px solid #000;">
                  <div style="width: 20px; height: 20px; border: 1px solid #000; margin: 0 auto;"></div>
                </td>
                <td style="text-align: center; padding: 8px; border: 1px solid #000;">
                  <div style="width: 20px; height: 20px; border: 1px solid #000; margin: 0 auto;"></div>
                </td>
              </tr>
            `;
            }).join('')}
          </tbody>
        </table>

        <div style="border-top: 1px solid #000; padding-top: 15px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 12px;">Picked By:</h4>
              <div style="border-bottom: 1px solid #000; height: 25px;"></div>
              <p style="font-size: 9pt; margin-top: 5px;">Date: ________________</p>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 12px;">Manifested By:</h4>
              <div style="border-bottom: 1px solid #000; height: 25px;"></div>
              <p style="font-size: 9pt; margin-top: 5px;">Date: ________________</p>
            </div>
          </div>

          <div style="margin-top: 15px;">
            <h4 style="margin: 0 0 8px 0; font-size: 12px;">Notes:</h4>
            <div style="border: 1px solid #000; padding: 10px; min-height: 60px;"></div>
          </div>
        </div>
      </div>
    `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pick Sheet</title>
          <style>
            @page {
              size: letter;
              margin: 0.25in;
            }
            @media print {
              body { margin: 0; }
              .pick-sheet { page-break-after: always; }
              .pick-sheet:last-child { page-break-after: avoid; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.4;
              color: #111827;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    win?.print();
  };

  return (
    <button
      onClick={generatePickSheet}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
    >
      Generate Pick Sheet
    </button>
  );
};

export default PickSheet;