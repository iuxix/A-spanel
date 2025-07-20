import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, addDoc,
  updateDoc, deleteDoc, doc, orderBy, query
} from "firebase/firestore";

export default function AdminPanel() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newItem, setNewItem] = useState({ title:"", cat:"", desc:"", avgtime:"", min:"", max:"", price:"" });

  async function fetchData() {
    const snap = await getDocs(query(collection(db, "services"), orderBy("cat")));
    setServices(snap.docs.map(d => ({id: d.id, ...d.data()})));
  }
  useEffect(()=>{ fetchData(); }, []);

  async function handleEdit(id, field, e) {
    const val = e.target.value;
    setServices(svs => svs.map(s=>s.id===id ? {...s, [field]: val} : s));
    await updateDoc(doc(db,"services",id), {
      [field]: field==="price"?parseFloat(val):field==="min"||field==="max"?parseInt(val):val
    });
  }
  async function handleDelete(id) {
    await deleteDoc(doc(db, "services", id));
    setServices(svs=>svs.filter(s=>s.id!==id));
  }
  async function addService(e) {
    e.preventDefault();
    if (!newItem.title || !newItem.cat) return;
    const ref = await addDoc(collection(db, "services"),
      {...newItem, price:parseFloat(newItem.price), min:parseInt(newItem.min), max:parseInt(newItem.max)});
    setServices([...services, {id:ref.id, ...newItem}]);
    setNewItem({ title:"", cat:"", desc:"", avgtime:"", min:"", max:"", price:"" });
  }

  return (
    <div className="admin-panel" style={{marginTop:24}}>
      <h1 style={{fontSize:"1.36em",fontWeight:800}}>Admin Panel <span role="img" aria-label="dash">🛠️</span></h1>
      <table style={{margin:"17px 0 19px", width:"100%"}}>
        <thead>
          <tr style={{background:"#f3f7ff"}}>
            <th>Title</th><th>Category</th><th>Desc</th>
            <th>Avg</th><th>Min</th><th>Max</th><th>Price</th><th>Del</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s=>
            <tr key={s.id}>
              <td><input value={s.title} onChange={e=>handleEdit(s.id,"title",e)} /></td>
              <td><input value={s.cat} onChange={e=>handleEdit(s.id,"cat",e)} /></td>
              <td><input value={s.desc} onChange={e=>handleEdit(s.id,"desc",e)} /></td>
              <td><input value={s.avgtime} onChange={e=>handleEdit(s.id,"avgtime",e)} /></td>
              <td><input value={s.min} onChange={e=>handleEdit(s.id,"min",e)} type="number" /></td>
              <td><input value={s.max} onChange={e=>handleEdit(s.id,"max",e)} type="number" /></td>
              <td><input value={s.price} onChange={e=>handleEdit(s.id,"price",e)} type="number" /></td>
              <td><button style={{color:"#f23",fontWeight:800,border:"none",background:"none",fontSize:"1.2em",cursor:"pointer"}} onClick={()=>handleDelete(s.id)}>🗑️</button></td>
            </tr>
          )}
        </tbody>
      </table>
      <form onSubmit={addService}><h4>Add Service</h4>
        <input placeholder="Title" value={newItem.title} onChange={e=>setNewItem(i=>({...i,title:e.target.value}))}/>
        <input placeholder="Category" value={newItem.cat} onChange={e=>setNewItem(i=>({...i,cat:e.target.value}))}/>
        <input placeholder="Desc" value={newItem.desc} onChange={e=>setNewItem(i=>({...i,desc:e.target.value}))}/>
        <input placeholder="AvgTime" value={newItem.avgtime} onChange={e=>setNewItem(i=>({...i,avgtime:e.target.value}))}/>
        <input placeholder="Min" type="number" value={newItem.min} onChange={e=>setNewItem(i=>({...i,min:e.target.value}))}/>
        <input placeholder="Max" type="number" value={newItem.max} onChange={e=>setNewItem(i=>({...i,max:e.target.value}))}/>
        <input placeholder="Price" type="number" value={newItem.price} onChange={e=>setNewItem(i=>({...i,price:e.target.value}))}/>
        <button className="btn-main" style={{marginTop:8}} type="submit">Add Service</button>
      </form>
    </div>
  );
}
