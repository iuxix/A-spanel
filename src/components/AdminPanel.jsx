import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, addDoc,
  updateDoc, deleteDoc, doc, setDoc, getDoc
} from "firebase/firestore";

// Store the "QR" as a single key in /settings/general doc in Firestore.
export default function AdminPanel() {
  const [services, setServices] = useState([]);
  const [newSvc, setNewSvc] = useState({title: "", cat: "", desc: "", avgtime: "", min: "", max: "", price: ""});
  const [qr, setQr] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [qrSaved, setQrSaved] = useState(false);
  const [err, setErr] = useState("");

  // Load all services and current QR code on mount
  useEffect(() => {
    // Services
    getDocs(collection(db, "services")).then(svs => {
      setServices(svs.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });
    // QR (from /settings/general)
    getDoc(doc(db, "settings", "general")).then(d => {
      setQr(d.exists() && d.data().fundQR ? d.data().fundQR : "");
      setQrInput(d.exists() && d.data().fundQR ? d.data().fundQR : "");
    });
  }, []);

  async function handleEdit(id, field, val) {
    await updateDoc(doc(db, "services", id), {[field]: field === "price" ? parseFloat(val) : val});
    setServices(svcs =>
      svcs.map(svc => svc.id === id ? {...svc, [field]: val} : svc)
    );
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "services", id));
    setServices(svs => svs.filter(s => s.id !== id));
  }

  async function addService(e) {
    e.preventDefault();
    setErr("");
    for (const k of ["title","cat","desc","avgtime","min","max","price"])
      if (!newSvc[k]) return setErr("❌ Fill all fields.");
    try {
      const added = await addDoc(collection(db, "services"), {
        ...newSvc,
        min: parseInt(newSvc.min),
        max: parseInt(newSvc.max),
        price: parseFloat(newSvc.price)
      });
      setServices([...services, { id: added.id, ...newSvc }]);
      setNewSvc({title:"",cat:"",desc:"",avgtime:"",min:"",max:"",price:""});
    } catch (e) {
      setErr("❌ Failed to add: " + (e.message || "unknown error"));
    }
  }

  async function handleQrSave(e) {
    e.preventDefault();
    await setDoc(doc(db, "settings", "general"), { fundQR: qrInput }, { merge: true });
    setQr(qrInput);
    setQrSaved(true);
    setTimeout(() => setQrSaved(false), 1200);
  }

  return (
    <div style={{maxWidth:1150,margin:"30px auto",background:"#181e32",color:"#fff",borderRadius:20,padding:"30px 19px"}}>
      <h2 style={{fontWeight:900,marginBottom:9}}>Service Manager</h2>
      <table style={{width:"100%",marginBottom:15,borderSpacing:"0 10px"}}>
        <thead>
          <tr style={{background:"#232942"}}>
            <th>Title</th><th>Category</th><th>Description</th>
            <th>Avg</th><th>Min</th><th>Max</th><th>Price</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
        {services.map(svc =>
          <tr key={svc.id} style={{background:"#222843"}}>
            <td><input value={svc.title} onChange={e=>handleEdit(svc.id,"title",e.target.value)} style={tdInput}/></td>
            <td><input value={svc.cat} onChange={e=>handleEdit(svc.id,"cat",e.target.value)} style={tdInput}/></td>
            <td><input value={svc.desc} onChange={e=>handleEdit(svc.id,"desc",e.target.value)} style={tdInput}/></td>
            <td><input value={svc.avgtime} onChange={e=>handleEdit(svc.id,"avgtime",e.target.value)} style={tdInput}/></td>
            <td><input type="number" value={svc.min} onChange={e=>handleEdit(svc.id,"min",e.target.value)} style={tdInput}/></td>
            <td><input type="number" value={svc.max} onChange={e=>handleEdit(svc.id,"max",e.target.value)} style={tdInput}/></td>
            <td><input type="number" value={svc.price} onChange={e=>handleEdit(svc.id,"price",e.target.value)} style={tdInput}/></td>
            <td><button style={delBtn} onClick={()=>handleDelete(svc.id)}>✖</button></td>
          </tr>
        )}
        </tbody>
      </table>
      <form onSubmit={addService} style={{display:"flex",flexWrap:"wrap",gap:13,marginBottom:7,alignItems:"flex-end"}}>
        <input placeholder="Title" value={newSvc.title} onChange={e=>setNewSvc(i=>({...i,title:e.target.value}))} style={tdInput}/>
        <input placeholder="Category" value={newSvc.cat} onChange={e=>setNewSvc(i=>({...i,cat:e.target.value}))} style={tdInput}/>
        <input placeholder="Description" value={newSvc.desc} onChange={e=>setNewSvc(i=>({...i,desc:e.target.value}))} style={tdInput}/>
        <input placeholder="AvgTime" value={newSvc.avgtime} onChange={e=>setNewSvc(i=>({...i,avgtime:e.target.value}))} style={tdInput}/>
        <input placeholder="Min" type="number" value={newSvc.min} onChange={e=>setNewSvc(i=>({...i,min:e.target.value}))} style={tdInput}/>
        <input placeholder="Max" type="number" value={newSvc.max} onChange={e=>setNewSvc(i=>({...i,max:e.target.value}))} style={tdInput}/>
        <input placeholder="Price" type="number" value={newSvc.price} onChange={e=>setNewSvc(i=>({...i,price:e.target.value}))} style={tdInput}/>
        <button type="submit" style={{
          background:"linear-gradient(90deg,#32dd78,#f9cc43)",color:"#fff",fontWeight:900,border:"none",borderRadius:8,padding:"13px 32px",fontSize:"1.07em",cursor:"pointer"
        }}>Create Service</button>
      </form>
      {err && <div style={{color:"#f34465",margin:"9px 0",fontWeight:800}}>{err}</div>}

      <h3 style={{marginTop:44,marginBottom:13}}>Add Fund QR UPI Code</h3>
      <form onSubmit={handleQrSave} style={{display:"flex",alignItems:"center",gap:15,marginBottom:15}}>
        <input value={qrInput} onChange={e=>setQrInput(e.target.value)} placeholder="Paste QR image URL" style={{
          borderRadius:8,padding:"12px",border:"1.2px solid #2bb9b8",fontSize:"1.09em",width:330
        }}/>
        <button type="submit" style={{
          background:"linear-gradient(90deg,#fcb14d,#35df75)",color:"#fff",fontWeight:700,border:"none",borderRadius:8,padding:"11px 27px",fontSize:"1.07em",cursor:"pointer"
        }}>
          {qrSaved ? "Saved!" : "Save QR"}
        </button>
      </form>
      {qr && <img src={qr} style={{height:96,marginBottom:12,borderRadius:14,background:"#fff"}} alt="Current UPI QR"/>}
    </div>
  );
}

const tdInput = {
  padding: "7px 7px", fontSize: "1em", borderRadius: 6, border: "1px solid #2c405a", background: "#232942", color: "#fff", fontWeight: 600
};
const delBtn = {
  color:"#ff4a72", background:"none",border:"none",fontWeight:900,fontSize:"1.4em",cursor:"pointer"
};
