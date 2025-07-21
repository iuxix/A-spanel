import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

export default function OrderSection({ user, balance, refreshBalance }) {
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState("");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  // Load categories and services from Firestore
  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "services"))
    ]).then(([catSnap, svcSnap]) => {
      const cats = catSnap.docs.map(d => d.data().name);
      setCategories(cats);
      if (cats.length > 0) setCat(cats[0]);
      const svcs = svcSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setServices(svcs);
    });
  }, []);

  // Update filtered services and selected on category change
  useEffect(() => {
    const filteredSvcs = services.filter(s => s.cat === cat);
    setFiltered(filteredSvcs);
    setServiceId(""); setSelected(null); setMsg("");
    setQty(""); setLink("");
  }, [cat, services]);

  // Get selected service by dropdown
  useEffect(() => {
    if (serviceId) {
      setSelected(filtered.find(s => s.id === serviceId));
      setMsg("");
    }
  }, [serviceId, filtered]);

  // Handle order placement with balance logic
  async function handleOrder(e) {
    e.preventDefault();
    setMsg(""); setOrderLoading(true);
    if (!selected || !qty || !link) {
      setMsg("❌ Please complete all fields.");
      setOrderLoading(false);
      return;
    }
    if (parseInt(qty) < selected.min || parseInt(qty) > selected.max) {
      setMsg(`❌ Quantity: Min ${selected.min} - Max ${selected.max}`);
      setOrderLoading(false);
      return;
    }
    const charge = (selected.price * qty) / 1000;
    if (charge > balance) {
      setMsg("❌ Not enough balance. Please add funds.");
      setOrderLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, "orders"), {
        uid: user.uid,
        serviceId: selected.id,
        service: selected.title,
        link,
        qty: Number(qty),
        price: selected.price,
        amount: charge,
        time: Timestamp.now(),
        status: "processing"
      });
      setMsg("✅ Order placed!");
      setQty(""); setLink("");
      if (refreshBalance) refreshBalance();
    } catch {
      setMsg("❌ Failed to place order");
    }
    setOrderLoading(false);
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 18, boxShadow: "0 7px 34px #bdf7eb15",
      maxWidth: 550, margin: "26px auto 25px", padding: "26px 18px"
    }}>
      <form onSubmit={handleOrder}>
        <label style={{ fontWeight: 700, marginBottom: 7, display: "block" }}>Category</label>
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          style={{
            width:"100%",padding:"13px",marginBottom:"13px",
            borderRadius:8,border:"1.2px solid #b3e5fd",background:"#f6fdff",fontSize:"1.13em"
          }}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <label style={{ fontWeight: 700, marginBottom: 7, display: "block" }}>Service</label>
        <select
          value={serviceId}
          onChange={e => setServiceId(e.target.value)}
          style={{
            width:"100%",padding:"13px",marginBottom:"12px",
            borderRadius:8,border:"1.2px solid #b3e5fd",background:"#f7fff8",fontSize:"1.13em"
          }}>
          <option value="">Select...</option>
          {filtered.map(s =>
            <option key={s.id} value={s.id}>
              {s.title} (₹{s.price}/1K)
            </option>
          )}
        </select>
        {selected && (
          <>
            <div style={{marginBottom:10}}>
              <div><b>Description:</b> {selected.desc}</div>
              <div>Min: <b>{selected.min}</b>, Max: <b>{selected.max}</b>, Avg: <b>{selected.avgtime}</b></div>
            </div>
            <input className="order-input-full" value={link} onChange={e => setLink(e.target.value)} placeholder="Paste link" style={{marginBottom:10}} />
            <input className="order-input-full" value={qty} onChange={e => setQty(e.target.value)} placeholder="Quantity" type="number" min={selected.min} max={selected.max} />
            <div style={{fontWeight:600,marginTop:7,marginBottom:12}}>
              Charge: <span style={{color:"#1bbf82"}}>₹{qty?((selected.price*qty)/1000).toFixed(2):"0.00"}</span>
            </div>
          </>
        )}
        {msg && <div style={{fontWeight:700,color:msg[0]==="✅"?"#15ae6d":"#e4294c",marginBottom:10}}>{msg}</div>}
        <button type="submit" disabled={orderLoading} style={{
          width:"100%", background: "linear-gradient(90deg,#23e883,#fee715)", color:"#173a1f",
          fontWeight:800,padding:"14px 0", borderRadius:11,marginTop:4, border:"none",fontSize:"1.07em"
        }}>
          {orderLoading ? "Ordering..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
