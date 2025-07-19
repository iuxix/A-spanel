import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

// Example DATA (Replace with DB/Firebase for production)
const CATEGORIES = [
  "⭐ New IG Services 🌟⭐",
  "IG Followers",
  "YouTube Likes",
  "Telegram Inline"
];
const SERVICES = [
  {
    id: 11572, title: "Instagram Reels Views [ NoN – Drop ] Emergency Working Update",
    cat: "⭐ New IG Services 🌟⭐",
    desc: "Start : Instant\nSpeed : 10M/Day\nDrop : No\nREFILL : Lifetime",
    avgtime:"3 hours", min:100, max:100000, charge:0.13
  },
  {
    id: 11586, title: "Instagram Followers 100% Old Accounts With 15 Posts | Stable", cat: "⭐ New IG Services 🌟⭐",
    desc:"Start : Instant\nSpeed : 10K/Day\nDrop: No\nRefill : Lifetime",
    avgtime:"6 hours", min:10, max:1000000, charge:17.00
  },
];

export default function OrderSection() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [selected, setSelected] = useState(SERVICES[0]);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");

  const filtered = SERVICES.filter(s => s.cat === cat);

  const handleOrder = (e) => {
    e.preventDefault();
    if (!selected || !qty || !link) {
      setMsg("❌ Please fill all fields.");
      return;
    }
    if (parseInt(qty) < selected.min || parseInt(qty) > selected.max) {
      setMsg(`❌ Quantity must be in Min:${selected.min} - Max:${selected.max}`);
      return;
    }
    setMsg(`✅ Order placed for ${qty} ${selected.title}! ₹${(parseFloat(selected.charge) * qty / 1000).toFixed(2)}`);
    setQty(""); setLink("");
  };

  return (
    <div className="order-sec-box">
      <div className="order-category">
        <label>Category</label>
        <select value={cat} onChange={e=>{setCat(e.target.value); setSelected(SERVICES.find(s=>s.cat===e.target.value)||null)}} >
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <label>Services</label>
      <div className="order-service-list">
        {filtered.map(s=>(
          <div key={s.id}
            className={`order-service-card${selected&&s.id===selected.id?' active':''}`}
            onClick={()=>setSelected(s)}>
            <span className="order-service-id-label">{s.id}</span>
            {s.title}
            <span style={{
              background:"#eee",marginLeft:7,
              color:"#049004",fontWeight:600,
              fontSize:".98em",padding:"2px 8px",borderRadius:"8px"}}
            >₹{s.charge}/1000</span>
          </div>
        ))}
      </div>
      {selected && (
        <form onSubmit={handleOrder} className="order-details-sec">
          <label>Description</label>
          <textarea className="order-desc-box" value={selected.desc} readOnly />
          <div style={{display:'flex',gap:12,marginBottom:6}}>
            <div>
              <label>Average Time</label>
              <input value={selected.avgtime} className="order-input-short" readOnly/>
            </div>
            <div>
              <label style={{marginLeft:6}}>Min/Max</label>
              <input value={`Min:${selected.min} - Max:${selected.max}`} className="order-input-short" readOnly/>
            </div>
          </div>
          <div>
            <label>Link</label>
            <input className="order-input-full" value={link} onChange={e=>setLink(e.target.value)} placeholder="Paste link" />
          </div>
          <div>
            <label>Quantity</label>
            <input className="order-input-full" value={qty} onChange={e=>setQty(e.target.value)} type="number" placeholder="Quantity" />
          </div>
          <div className="order-info-row">
            <span>Charge</span>
            <b style={{fontWeight:"700"}}>₹
              {qty ? ((parseFloat(selected.charge) * qty / 1000).toFixed(2)) : "0.00"}
            </b>
            <a href={`https://wa.me/?text=I%20want%20this:%20${selected.title}`} target="_blank" rel="noreferrer" className="order-whatsapp-btn"><FaWhatsapp size={28}/></a>
          </div>
          {msg && <div className={msg.startsWith("✅") ? "order-success" : "order-warning"}>{msg}</div>}
          <button className="btn-main" type="submit">Place Order 🚀</button>
        </form>
      )}
    </div>
  );
}
