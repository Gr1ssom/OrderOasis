import React, { useEffect, useState } from "react";
import api from "../api";

// Helper to get today’s UTC ISO string
function getTodayUTCISO() {
  return new Date().toISOString().split('.')[0] + 'Z';
}

export default function OrdersList({ onSelect }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updated_at_from = "1970-01-01T00:00:00Z";
    const updated_at_to = getTodayUTCISO();
    const url = `/shipping-orders?updated_at_from=${encodeURIComponent(updated_at_from)}&updated_at_to=${encodeURIComponent(updated_at_to)}`;
    api
      .get(url)
      .then((res) => {
        console.log("RAW API RESPONSE:", res.data); // <--- Debug log
        // This assumes res.data.orders. Adjust as needed based on the log output.
        setOrders(res.data.orders);
      })
      .catch((err) => {
        alert("Error loading orders");
        console.error("API ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (!orders || !orders.length) return <div>No shipping orders found.</div>;

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Shipping Orders</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th style={th}>Invoice #</th>
            <th style={th}>Customer</th>
            <th style={th}>Ship To</th>
            <th style={th}>Total</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderTop: "1px solid #eee" }}>
              <td style={td}>{order.invoice_number}</td>
              <td style={td}>{order.buyer?.name || "-"}</td>
              <td style={td}>
                {order.ship_name}<br />
                {order.ship_line_one}, {order.ship_city}, {order.ship_state} {order.ship_zip}
              </td>
              <td style={td}>${Number(order.total).toLocaleString()}</td>
              <td style={td}>{order.order_status?.name}</td>
              <td style={td}>
                <button onClick={() => onSelect(order)} style={button}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px 8px", textAlign: "left", borderBottom: "1px solid #ddd" };
const td = { padding: "8px", verticalAlign: "top" };
const button = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  padding: "6px 14px",
  cursor: "pointer"
};
