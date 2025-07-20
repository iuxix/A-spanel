import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function OrderSection() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [cat, setCat] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const catsSnap = await getDocs(collection(db, "categories"));
      const cats = catsSnap.docs.map(doc => doc.data());
      setCategories(cats);
      if (cats.length > 0) setCat(cats[0].name);

      const svcsSnap = await getDocs(query(collection(db, "services"), orderBy("cat")));
      const svcs = svcsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(svcs);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(services.filter(s => s.cat === cat));
    setSelected(null);
    setQty("");
    setLink("");
    setMsg("");
  }, [cat, services]);

  function handleOrder(e) {
    e.preventDefault();
    if (!selected || !qty || !link) {
      setMsg("❌ Please complete all fields.");
      return;
    }
    if (parseInt(qty) < selected.min || parseInt(qty) > selected.max) {
      setMsg(`❌ Quantity: Min ${selected.min} - Max ${selected.max}`);
      return;
    }
    setMsg(`✅ Order placed for ${qty}: ${selected.title}`);
    setQty("");
    setLink("");
  }

  if (loading)
    return <div className="order-sec-box">Loading services...</div>;

  return (
    <div className="order-sec-box" style={{ position: "relative" }}>
      <div className="order-category">
        <label>Category</label>
        <select value={cat} onChange={e => setCat(e.target.value)}>
          {categories.map(c => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <label>Services</label>
      <div className="order-service-list">
        {filtered.map(s => (
          <div
            key={s.id}
            className={`order-service-card${selected && selected.id === s.id ? " active" : ""}`}
            tabIndex={0}
            onClick={() => setSelected(s)}
          >
            <span className="order-service-id-label">{s.id}</span>
            <span className="order-service-title">{s.title}</span>
          </div>
        ))}
      </div>
      {selected && (
        <form onSubmit={handleOrder} className="order-details-sec" style={{ position: "relative" }}>
          <label>Description</label>
          <textarea className="order-desc-box" value={selected.desc} readOnly />
          <div className="order-link-qty">
            <div>
              <label>Average Time</label>
              <input value={selected.avgtime} className="order-input-short" readOnly />
            </div>
            <div>
              <label>Min/Max</label>
              <input value={`Min:${selected.min} - Max:${selected.max}`} className="order-input-short" readOnly />
            </div>
          </div>
          <label>Link</label>
          <input className="order-input-full" value={link} onChange={e => setLink(e.target.value)} placeholder="Paste link" />
          <label>Quantity</label>
          <input className="order-input-full" value={qty} onChange={e => setQty(e.target.value)} type="number" placeholder="Quantity" />
          <div className="order-info-row">
            <span>Charge</span>
            <b>
              ₹
              {qty && selected.price
                ? ((selected.price * qty) / 1000).toFixed(2)
                : "0.00"}
            </b>
          </div>
          {msg && <div className={msg.startsWith("✅") ? "order-success" : "order-warning"}>{msg}</div>}
          <button className="btn-main" type="submit">
            Place Order 🚀
          </button>
          <a
            href={`https://wa.me/?text=I%20want%20this:%20${selected.title}`}
            target="_blank"
            rel="noreferrer"
            className="order-whatsapp-btn"
          >
            <FaWhatsapp size={26} />
          </a>
        </form>
      )}
    </div>
  );
}
