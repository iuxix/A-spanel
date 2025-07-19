import React, { useState } from "react";

export default function AdminPanel() {
  const [services, setServices] = useState([
    { name: "Instagram Reels Views", type: "⭐ New IG Services 🌟⭐", desc: "Start : Instant\nSpeed : 10M/Day\nDrop : No\nREFILL : Lifetime", price: 0.13, min: 100, max: 100000 },
    { name: "Instagram Followers 100% Old Accounts With 15 Posts | Stable", type: "⭐ New IG Services 🌟⭐", desc: "Start : Instant\nSpeed : 10K/Day\nDrop: No\nRefill : Lifetime", price: 17.00, min: 10, max: 1000000 }
  ]);
  const [deposits, setDeposits] = useState([
    { user: "user1@email.com", amount: 150, ss: "", status:"pending" }
  ]);
  const [editing, setEditing] = useState({ idx: null, field: "", value: "" });
  const [newService, setNewService] = useState({ name: "", type: "", desc: "", price: "", min: "", max: "" });
  const [qr, setQr] = useState("https://chart.googleapis.com/chart?cht=upi&chs=250x250&chl=upi://pay?pa=boraxdealer@fam");

  function approveDeposit(i) { setDeposits(ds=>ds.map((d,di)=>di===i?{...d,status:"approved"}:d)); }
  function rejectDeposit(i) { setDeposits(ds=>ds.map((d,di)=>di===i?{...d,status:"rejected"}:d)); }
  function startEdit(i, field, value) { setEditing({ idx:i, field, value }); }
  function saveEdit() {
    const newList = [...services];
    newList[editing.idx][editing.field] = editing.field === "price" ? parseFloat(editing.value) : editing.field === "min" || editing.field === "max" ? parseInt(editing.value) : editing.value;
    setServices(newList); setEditing({ idx: null, field: "", value: "" });
  }

  function addService() {
    if (!newService.name || !newService.type || !newService.desc || !newService.price || !newService.min || !newService.max) return;
    setServices([...services, { ...newService, price: parseFloat(newService.price), min: parseInt(newService.min), max: parseInt(newService.max) }]);
    setNewService({ name: "", type: "", desc: "", price: "", min: "", max: "" });
  }
  function deleteService(idx) { setServices(services.filter((_, i) => i !== idx)); }

  return (
    <div className="admin-panel">
      <h1>Admin Panel 👑</h1>
      <h3>Pending Deposits</h3>
      {deposits.length === 0 && <div>No deposits pending.</div>}
      {deposits.map((dep, i) =>
        <div key={i} className="adm-pend-box">
          <b>{dep.user}</b> | ₹<b>{dep.amount}</b> – Status: {dep.status}
          {dep.ss && <div>Screenshot: <a href={dep.ss} target="_blank" rel="noreferrer">View</a></div>}
          {dep.status === "pending" && (
            <>
              <button onClick={()=>approveDeposit(i)} className="adm-pend-btn-approve">Approve</button>
              <button onClick={()=>rejectDeposit(i)} className="adm-pend-btn-reject">Reject</button>
            </>
          )}
        </div>
      )}
      <h3>Services</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Type</th><th>Desc</th><th>Min</th><th>Max</th><th>Price (₹/1K)</th><th>Del</th></tr>
        </thead>
        <tbody>
        {services.map((sv, i) => (
          <tr key={i}>
            <td onClick={()=>startEdit(i,"name",sv.name)}>{editing.idx===i&&editing.field==="name"?<input value={editing.value} onChange={e=>setEditing({...editing,value:e.target.value})} onBlur={saveEdit} autoFocus onKeyDown={e=>e.key==="Enter"&&saveEdit()}/> : sv.name}</td>
            <td onClick={()=>startEdit(i,"type",sv.type)}>{editing.idx===i&&editing.field==="type"?<input value={editing.value} onChange={e=>setEditing({...editing,value:e.target.value})} onBlur={saveEdit} autoFocus onKeyDown={e=>e.key==="Enter"&&saveEdit()}/> : sv.type}</td>
            <td onClick={()=>startEdit(i,"desc",sv.desc)}>{editing.idx===i&&editing.field==="desc"?<textarea value={editing.value} onChange={e=>setEditing({...editing,value:e.target.value})} onBlur={saveEdit} autoFocus rows={3}/> : <span title={sv.desc} style={{display:'inline-block',maxWidth:120,whiteSpace:"nowrap",overflow:"hidden",textOverflow:'ellipsis'}}>{sv.desc}</span>}</td>
            <td onClick={()=>startEdit(i,"min",sv.min)}>{editing.idx===i&&editing.field==="min"?<input value={editing.value} onChange={e=>setEditing({...editing,value:e.target.value})} onBlur={saveEdit} autoFocus type="number"/> : sv.min}</td>
            <td onClick={()=>startEdit(i,"max",sv.max)}>{editing.idx===i&&editing.field==="max"?<input value={editing.value} onChange={e=>setEditing({...editing,value:e.target.value})} onBlur={saveEdit} autoFocus type="number"/> : sv.max}</td>
            <td onClick={()=>startEdit(i,"price",sv.price)}>{editing.idx===i&&editing.field==="price"?<input value={editing.value} onChange={e=>setEditing({...editing,value:e.target.value})} onBlur={saveEdit} autoFocus type="number"/> : sv.price}</td>
            <td><button onClick={()=>deleteService(i)} style={{color:"#f84a64",border:"none",background:"none"}}>🗑️</button></td>
          </tr>
        ))}
        </tbody>
      </table>
      <h4>Add New Service</h4>
      <input placeholder="Name" value={newService.name} onChange={e=>setNewService(s=>({...s,name:e.target.value}))}/>
      <input placeholder="Type" value={newService.type} onChange={e=>setNewService(s=>({...s,type:e.target.value}))}/>
      <textarea placeholder="Description" value={newService.desc} onChange={e=>setNewService(s=>({...s,desc:e.target.value}))}/>
      <input placeholder="Min" type="number" value={newService.min} onChange={e=>setNewService(s=>({...s,min:e.target.value}))}/>
      <input placeholder="Max" type="number" value={newService.max} onChange={e=>setNewService(s=>({...s,max:e.target.value}))}/>
      <input placeholder="Price" type="number" value={newService.price} onChange={e=>setNewService(s=>({...s,price:e.target.value}))}/>
      <button className="btn-main" onClick={addService}>Add 🚀</button>
      <h4 style={{marginTop:18}}>UPI QR (for <b>boraxdealer@fam</b>):</h4>
      <input placeholder="Paste new QR URL" value={qr} onChange={e=>setQr(e.target.value)} style={{width:"67%"}} />
      {qr && <img src={qr} alt="upi qr" style={{height:80,margin:"12px 0",borderRadius:"8px"}} />}
    </div>
  );
}
