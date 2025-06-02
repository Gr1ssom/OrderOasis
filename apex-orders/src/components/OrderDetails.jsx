import React from "react";

export default function OrderDetails({ order, onBack }) {
  if (!order) return null;

  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 24,
      background: "#fff",
      marginTop: 16
    }}>
      <button onClick={onBack} style={{
        color: "#2563eb", marginBottom: 16, border: "none", background: "none", cursor: "pointer"
      }}>
        ← Back to list
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        Order: {order.invoice_number}
      </h2>
      <div><b>Status:</b> {order.order_status?.name}</div>
      <div><b>Order Date:</b> {order.order_date?.split('T')[0]}</div>
      <div><b>Total:</b> ${Number(order.total).toLocaleString()}</div>
      <hr style={{ margin: "18px 0" }} />
      <div><b>Customer:</b> {order.buyer?.name || "-"}</div>
      <div><b>Ship To:</b> {order.ship_name}, {order.ship_line_one}, {order.ship_city}, {order.ship_state} {order.ship_zip}</div>
      <div><b>Contact:</b> {order.buyer_contact_name || "-"}<br />{order.buyer_contact_email || "-"}<br />{order.buyer_contact_phone || "-"}</div>
      <div><b>Payment Status:</b> {order.payment_status}</div>
      <div><b>Sales Rep:</b> {order.sales_reps?.map(rep => (
        <div key={rep.email}>
          {rep.name} ({rep.email}, {rep.phone})
        </div>
      ))}</div>
      <div style={{ marginTop: 16 }}>
        <b>Cancelled:</b> {order.cancelled ? "Yes" : "No"}
      </div>
    </div>
  );
}
