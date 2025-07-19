import React, { useState } from "react";
export default function OrderForm() {
  const [service, setService] = useState("Instagram Followers");
  const [quantity, setQuantity] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");

  const priceMap = {
    "Instagram Followers": 31,
    "YouTube Views": 4,
    "Telegram Members": 40,
    "TikTok Likes": 6
  };
  const services = Object.keys(priceMap);

  function submitOrder(e) {
    e.preventDefault();
    if (!quantity || !link) {
      setMsg("❌ Please fill all fields.");
      return;
    }
    setMsg(`✅ Order placed for ${quantity} ${service}! Price: ₹${(priceMap[service]*quantity/1000).toFixed(2)} (demo only)`);
    setQuantity(""); setLink("");
  }

  return (
    <div className="order-form-box">
      <h3 style={{marginBottom:6}}>📝 Place New Order</h3>
      <form onSubmit={submitOrder} style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <select value={service} onChange={e=>setService(e.target.value)} className="order-picker">
          {services.map(s=><option key={s}>{s}</option>)}
        </select>
        <input type="text" placeholder="Order link" value={link} onChange={e=>setLink(e.target.value)} className="order-inp" />
        <input type="number" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)} min={10} className="order-inp" />
        <button className="btn-main" type="submit">Order Now</button>
      </form>
      {msg && <div style={{marginTop:7,color:msg.startsWith('✅')?'#08b841':'crimson',fontWeight:600}}>{msg}</div>}
    </div>
  );
}
