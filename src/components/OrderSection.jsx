import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const CATEGORIES = [
  "⭐ New IG Services 🌟⭐",
  "IG Followers",
  "YouTube Likes",
  "Telegram Inline"
];
const SERVICES = [
  {
    id: 11572,
    title: "Instagram Reels Views [ NoN – Drop ] Emergency Working Update",
    cat: "⭐ New IG Services 🌟⭐",
    desc: "Start : Instant\nSpeed : 10M/Day\nDrop : No\nREFILL : Lifetime",
    avgtime:"3 hours", min:100, max:466000000000, charge:0.13
  },
  {
    id: 22891,
    title: "IG Followers [ Working New 🌟 ]",
    cat: "IG Followers",
    desc: "Real, stable", avgtime:"4 hours", min:20,max:50000,charge:10
  },
  // Add more...
];

export default function OrderSection() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const filtered = SERVICES.filter(s => s.cat === cat);

  function handleOrder(e) {
    e.preventDefault();
    if (!selected || !qty || !link) { setMsg("❌ Please fill all fields."); return; }
    if (parseInt(qty) < selected.min || parseInt(qty) > selected.max) {
      setMsg(`❌ Quantity must be in Min:${selected.min} - Max:${selected.max}`); return;
    }
    setMsg(`✅ Order placed for ${qty} ${selected.title}! ₹${(selected.charge * qty / 1000).toFixed(2)}`);
    setQty(""); setLink("");
  }

  return (
    <div className="order-sec-box" style={{ position:"relative" }}>
      <div className="order-category">
        <label>Category</label>
        <select value={cat} onChange={e=>{setCat(e.target.value); setSelected(null)}} >
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <label>Services</label>
      <div className="order-service-list">
        {filtered.map(s=>(
          <div key={s.id}
            className={`order-service-card${selected && s.id===selected.id ? " active":""}`}
            tabIndex={0}
            onClick={()=>setSelected(s)} >
            <span className="order-service-id-label">{s.id}</span>
            <span className="order-service-title">{s.title}</span>
          </div>
        ))}
      </div>
      {selected && (
        <form onSubmit={handleOrder} className="order-details-sec" style={{position:"relative"}}>
          <label>Description</label>
          <textarea className="order-desc-box" value={selected.desc} readOnly />
          <div className="order-link-qty">
            <div>
              <label>Average Time</label>
              <input value={selected.avgtime} className="order-input-short" readOnly/>
            </div>
            <div>
              <label>Min/Max</label>
              <input value={`Min:${selected.min} - Max:${selected.max}`} className="order-input-short" readOnly/>
            </div>
          </div>
          <label>Link</label>
          <input className="order-input-full" value={link} onChange={e=>setLink(e.target.value)} placeholder="Paste link" />
          <label>Quantity</label>
          <input className="order-input-full" value={qty} onChange={e=>setQty(e.target.value)} type="number" placeholder="Quantity" />
          <div className="order-info-row">
            <span>Charge</span>
            <b>₹{qty ? ((selected.charge * qty / 1000).toFixed(2)) : "0.00"}</b>
          </div>
          {msg && <div className={msg.startsWith("✅") ? "order-success":"order-warning"}>{msg}</div>}
          <button className="btn-main" type="submit">Place Order 🚀</button>
          <a href={`https://wa.me/?text=I%20want%20this:%20${selected.title}`}
            target="_blank" rel="noreferrer"
            className="order-whatsapp-btn"><FaWhatsapp size={26}/></a>
        </form>
      )}
    </div>
  );
}
