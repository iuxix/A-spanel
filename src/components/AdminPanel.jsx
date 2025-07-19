import React, { useState } from "react";
export default function AdminPanel() {
  const [services, setServices] = useState([
    { name: "Instagram Followers (Non Drop)", price: 31 },
    { name: "Instagram Likes (1K)", price: 4 },
    { name: "Telegram Members (India)", price: 40 },
    { name: "Instagram Reels Views", price: 0.25 },
  ]);
  const [qr, setQr] = useState("");
  const handlePrice = (idx, val) => {
    const newSv = [...services]; newSv[idx].price = val; setServices(newSv);
  };
  return (
    <div className="admin-panel">
      <h1>Welcome, Super Admin 👑</h1>
      <h3>Change Prices</h3>
      {services.map((sv, i) => (
        <div key={i} className="service-edit-row">
          <b>{sv.name}</b>
          ₹<input type="number" value={sv.price} onChange={e=>handlePrice(i, e.target.value)} />
        </div>
      ))}
      <h3>Change UPI QR (paste image URL):</h3>
      <input value={qr} onChange={e=>setQr(e.target.value)} placeholder="Paste QR URL" />
      <h3>Panel Stats/Users/Deposits will be here (extend as you code backend)</h3>
    </div>
  );
}
