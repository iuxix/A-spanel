import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [services, setServices] = useState([]);
  const [newItem, setNewItem] = useState({
    title:"", cat:"", desc:"", avgtime:"", min:"", max:"", price:""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all services on mount
  useEffect(() => {
    getDocs(collection(db, "services")).then(svs => {
      setServices(svs.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });
  }, []);

  // Inline editing and delete
  async function handleEdit(id, field, e) {
    const value = e.target.value;
    setServices(svcs => svcs.map(svc => svc.id === id ? {...svc, [field]: value} : svc));
    await updateDoc(doc(db, "services", id), {
      [field]: ["price", "min", "max"].includes(field)
        ? (field === "price" ? parseFloat(value) : parseInt(value) || 0)
        : value
    });
  }
  async function handleDelete(id) {
    await deleteDoc(doc(db,"services",id));
    setServices(svs => svs.filter(s => s.id !== id));
  }

  // Add new service (with validation)
  async function addService(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    for (const k of ["title","cat","desc","avgtime","min","max","price"]) {
      if (!newItem[k] && newItem[k] !== 0) {
        setErr(`Please fill "${k.charAt(0).toUpperCase()+k.slice(1)}"`);
        setLoading(false);
        return;
      }
    }
    if (isNaN(Number(newItem.min)) || isNaN(Number(newItem.max)) || isNaN(Number(newItem.price))) {
      setErr("Min, Max, and Price must be numbers.");
      setLoading(false);
      return;
    }
    try {
      const added = await addDoc(collection(db,"services"),{
        ...newItem,
        min: parseInt(newItem.min,10),
        max: parseInt(newItem.max,10),
        price: parseFloat(newItem.price)
      });
      setServices([...services, {id: added.id, ...newItem}]);
      setNewItem({title:"", cat:"", desc:"", avgtime:"", min:"", max:"", price:""});
    } catch (e) {
      setErr("Failed to add: "+(e.message||"unknown error"));
    }
    setLoading(false);
  }

  return (
    <div style={{
      maxWidth: 1060, margin: "36px auto", background: "#fff",
      borderRadius: 18, boxShadow: "0 6px 24px #cdf6ff26", padding: "35px 16px"
    }}>
      <h2 style={{
        fontWeight: 800, fontSize: "1.37em",
        margin: "0 0 22px 0", color: "#213046", letterSpacing: "-.5px"
      }}>
        <span role="img" aria-label="settings" style={{marginRight:7}}>⚙️</span>
        Service Management
      </h2>

      <table style={{width: "100%", borderSpacing: 0, marginBottom: "18px"}}>
        <thead>
          <tr style={{background: "#f3f6fb", fontWeight: 700}}>
            <th style={th}>Title</th>
            <th style={th}>Category</th>
            <th style={th}>Description</th>
            <th style={th}>Avg Time</th>
            <th style={th}>Min</th>
            <th style={th}>Max</th>
            <th style={th}>Price</th>
            <th style={th}>Del</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s =>
            <tr key={s.id}>
              <td style={td}>
                <input value={s.title} onChange={e=>handleEdit(s.id,"title",e)} style={input}/>
              </td>
              <td style={td}>
                <input value={s.cat} onChange={e=>handleEdit(s.id,"cat",e)} style={input}/>
              </td>
              <td style={td}>
                <input value={s.desc} onChange={e=>handleEdit(s.id,"desc",e)} style={input}/>
              </td>
              <td style={td}>
                <input value={s.avgtime} onChange={e=>handleEdit(s.id,"avgtime",e)} style={input}/>
              </td>
              <td style={td}>
                <input type="number" value={s.min} onChange={e=>handleEdit(s.id,"min",e)} style={input}/>
              </td>
              <td style={td}>
                <input type="number" value={s.max} onChange={e=>handleEdit(s.id,"max",e)} style={input}/>
              </td>
              <td style={td}>
                <input type="number" value={s.price} onChange={e=>handleEdit(s.id,"price",e)} style={input}/>
              </td>
              <td style={td}>
                <button
                  onClick={()=>handleDelete(s.id)}
                  style={{color:"#e34a15",background:"none",border:"none",fontWeight:700,fontSize:"1.2em",cursor:"pointer",padding:0}}
                  title="Delete"
                >✕</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={addService} style={{
        display: "flex", flexWrap: "wrap", gap: 9, alignItems: "flex-end", marginBottom: 5
      }}>
        <input placeholder="Title" value={newItem.title} onChange={e=>setNewItem(i=>({...i,title:e.target.value}))} style={input}/>
        <input placeholder="Category" value={newItem.cat} onChange={e=>setNewItem(i=>({...i,cat:e.target.value}))} style={input}/>
        <input placeholder="Description" value={newItem.desc} onChange={e=>setNewItem(i=>({...i,desc:e.target.value}))} style={input}/>
        <input placeholder="Avg Time" value={newItem.avgtime} onChange={e=>setNewItem(i=>({...i,avgtime:e.target.value}))} style={input}/>
        <input placeholder="Min" type="number" value={newItem.min} onChange={e=>setNewItem(i=>({...i,min:e.target.value}))} style={input}/>
        <input placeholder="Max" type="number" value={newItem.max} onChange={e=>setNewItem(i=>({...i,max:e.target.value}))} style={input}/>
        <input placeholder="Price" type="number" value={newItem.price} onChange={e=>setNewItem(i=>({...i,price:e.target.value}))} style={input}/>
        <button
          className="btn-main"
          type="submit"
          disabled={loading}
          style={{
            padding: "13px 38px", fontWeight: 700, fontSize: "1.11em", borderRadius: 12,
            background: "linear-gradient(90deg,#21e073,#fbaf09 97%)", color: "#fff", border: "none",
            marginLeft:5, minWidth:120, cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
      {err && <div style={{color:"#e84a5b",fontWeight:700,margin:"7px 0 0 4px"}}>{err}</div>}
    </div>
  );
}

// Inline style helpers
const input = {
  fontWeight: 500, fontSize: ".99em", borderRadius: 7, border: "1.1px solid #eaeaea",
  background: "#f8fcff", padding: "7px 11px", marginBottom: 3, minWidth: 67, maxWidth: 120
};
const td = {padding: "6px 7px"};
const th = {padding: "8px 10px", textAlign: "left", fontSize: "1em", background:"#f6fafd"};
