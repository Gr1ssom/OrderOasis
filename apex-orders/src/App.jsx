import React, { useState } from "react";
import OrdersList from "./components/OrdersList";
import OrderDetails from "./components/OrderDetails";

export default function App() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", padding: 32 }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)"
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 18, color: "#1e293b" }}>
          Apex Shipping Orders
        </h1>
        {!selectedOrder
          ? <OrdersList onSelect={setSelectedOrder} />
          : <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        }
      </div>
    </div>
  );
}
