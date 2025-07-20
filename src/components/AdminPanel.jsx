import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [services, setServices] = useState([]);
  const [newItem, setNewItem] = useState({title:"",cat:"",desc:"",avgtime:"",min:"",max:"",price:""});

  useEffect(()=>{
    getDocs(collection(db,"services")).then(svs=>{
      setServices(svs.docs.map(doc=>({id:doc.id, ...doc.data()})));
    });
  },[]);

  async function handleEdit(id, field, e) {
    const value = e.target.value;
    setServices(svcs => svcs.map(svc=>svc.id===id?{...svc,[field]:value}:svc));
    await updateDoc(doc(db,"services",id), {[field]:field==="price"?parseFloat(value):value});
  }
  async function handleDelete(id) {
    await deleteDoc(doc(db,"services",id));
    setServices(svs=>svs.filter(s=>s.id!==id));
  }
  async function addService(e) {
    e.preventDefault();
    const added=await addDoc(collection(db,"services"),{...newItem, price:parseFloat(newItem.price)});
    setServices([...services, {id:added.id, ...newItem}]);
    setNewItem({title:"",cat:"",desc:"",avgtime:"",min:"",max:"",price:""});
  }

  return (
    <div className="admin-panel">
      <h2>🛠️ Admin: Edit Services</h2>
      <table>
        <thead><tr>
          <th>Title</th><th>Cat</th><th>Desc</th><th>Avg</th><th>Min</th><th>Max</th><th>Price</th><th>Del</th>
        </tr></thead>
        <tbody>
        {services.map(s=>
          <tr key={s.id}>
            <td><input value={s.title} onChange={e=>handleEdit(s.id,"title",e)} /></td>
            <td><input value={s.cat} onChange={e=>handleEdit(s.id,"cat",e)} /></td>
            <td><input value={s.desc} onChange={e=>handleEdit(s.id,"desc",e)} /></td>
            <td><input value={s.avgtime} onChange={e=>handleEdit(s.id,"avgtime",e)} /></td>
            <td><input type="number" value={s.min} onChange={e=>handleEdit(s.id,"min",e)} /></td>
            <td><input type="number" value={s.max} onChange={e=>handleEdit(s.id,"max",e)} /></td>
            <td><input type="number" value={s.price} onChange={e=>handleEdit(s.id,"price",e)} /></td>
            <td><button style={{color:"red"}} onClick={()=>handleDelete(s.id)}>✕</button></td>
          </tr>
        )}
        </tbody>
      </table>
      <form onSubmit={addService}><h4>Add Service</h4>
        <input placeholder="Title" value={newItem.title} onChange={e=>setNewItem(i=>({...i,title:e.target.value}))}/>
        <input placeholder="Cat" value={newItem.cat} onChange={e=>setNewItem(i=>({...i,cat:e.target.value}))}/>
        <input placeholder="Desc" value={newItem.desc} onChange={e=>setNewItem(i=>({...i,desc:e.target.value}))}/>
        <input placeholder="AvgTime" value={newItem.avgtime} onChange={e=>setNewItem(i=>({...i,avgtime:e.target.value}))}/>
        <input placeholder="Min" type="number" value={newItem.min} onChange={e=>setNewItem(i=>({...i,min:e.target.value}))}/>
        <input placeholder="Max" type="number" value={newItem.max} onChange={e=>setNewItem(i=>({...i,max:e.target.value}))}/>
        <input placeholder="Price" type="number" value={newItem.price} onChange={e=>setNewItem(i=>({...i,price:e.target.value}))}/>
        <button className="btn-main" type="submit">Add Service</button>
      </form>
    </div>
  );
}
