import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [qr, setQr] = useState("");
  const [upi, setUpi] = useState("boraxdealer@fam"); // Your UPI
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    (async () => {
      // Fetch categories
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      // Fetch services
      const svcSnap = await getDocs(collection(db, "services"));
      setServices(svcSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      // Fetch deposits
      const depSnap = await getDocs(collection(db, "deposits"));
      setDeposits(depSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      // Fetch UPI QR (put in categories or separate Firestore doc as needed)
    })();
  }, []);

  // CATEGORY CONTROLS
  async function addCategory(e) {
    e.preventDefault();
    if (!catName.trim()) return;
    await addDoc(collection(db, "categories"), { name: catName });
    setCategories([...categories, { name: catName }]);
    setCatName("");
  }
  async function deleteCategory(id) {
    await deleteDoc(doc(db, "categories", id));
    setCategories(c => c.filter(cat => cat.id !== id));
  }

  // SERVICES
  async function addService() {/* similar: addDoc to "services" */}
  async function deleteService(id) {
    await deleteDoc(doc(db, "services", id));
    setServices(s => s.filter(x => x.id !== id));
  }
  async function updateService(id, field, value) {
    await updateDoc(doc(db, "services", id), { [field]: value });
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  // DEPOSITS
  async function setDepositStatus(id, status) {
    await updateDoc(doc(db, "deposits", id), { status });
    setDeposits(ds => ds.map(d => d.id === id ? { ...d, status } : d));
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel 👑</h1>
      <h3>Categories</h3>
      <form onSubmit={addCategory}>
        <input value={catName} onChange={e=>setCatName(e.target.value)} placeholder="Add new category" />
        <button className="btn-main" type="submit">Add</button>
      </form>
      <ul>
        {categories.map(cat =>
          <li key={cat.id}>
            {cat.name} <button onClick={()=>deleteCategory(cat.id)} style={{color:"red"}}>Del</button>
          </li>
        )}
      </ul>

      <h3>Services</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Cat</th><th>Desc</th><th>Avg</th><th>Min</th><th>Max</th><th>Price</th><th>Del</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s=>
            <tr key={s.id}>
              <td><input value={s.title} onChange={e=>updateService(s.id,"title",e.target.value)} /></td>
              <td><input value={s.cat} onChange={e=>updateService(s.id,"cat",e.target.value)} /></td>
              <td><input value={s.desc} onChange={e=>updateService(s.id,"desc",e.target.value)} /></td>
              <td><input value={s.avgtime} onChange={e=>updateService(s.id,"avgtime",e.target.value)} /></td>
              <td><input type="number" value={s.min} onChange={e=>updateService(s.id,"min",e.target.value)} /></td>
              <td><input type="number" value={s.max} onChange={e=>updateService(s.id,"max",e.target.value)} /></td>
              <td><input type="number" value={s.price} onChange={e=>updateService(s.id,"price",e.target.value)} /></td>
              <td><button onClick={()=>deleteService(s.id)} style={{color:"red"}}>X</button></td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Deposits (Real-time)</h3>
      {deposits.map((dep,i) =>
        <div key={i} className="adm-pend-box">
          <b>{dep.user}</b> - ₹{dep.amount} <span>Status: {dep.status}</span>
          {dep.ss && <div>SS: <a href={dep.ss} target="_blank" rel="noreferrer">View</a></div>}
          {dep.status === "pending" &&
            (<>
              <button className="adm-pend-btn-approve" onClick={()=>setDepositStatus(dep.id,"approved")}>Approve</button>
              <button className="adm-pend-btn-reject" onClick={()=>setDepositStatus(dep.id,"rejected")}>Reject</button>
            </>)
          }
        </div>
      )}
      <h4>Add/Edit UPI QR</h4>
      <input placeholder="Paste QR image URL" value={qr} onChange={e=>setQr(e.target.value)} style={{width:"80%"}} />
      {qr && <img src={qr} alt="upi qr" style={{height:80,margin:"18px 0",borderRadius:"8px"}} />}
    </div>
  );
}
