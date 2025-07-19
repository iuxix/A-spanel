import React, { useState } from "react";

export default function AdminPanel() {
  const [services, setServices] = useState([
    { name: "Instagram Followers", type: "Instagram", price: 31 },
    { name: "YouTube Views", type: "YouTube", price: 4 },
    { name: "Telegram Members", type: "Telegram", price: 40 }
  ]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [qr, setQr] = useState("https://chart.googleapis.com/chart?cht=upi&chs=300x300&chl=upi://pay?pa=boraxdealer@fam");

  function addService() {
    if (!newName || !newType || !newPrice) return;
    setServices([
      ...services,
      { name: newName, type: newType, price: parseFloat(newPrice) }
    ]);
    setNewName(""); setNewType(""); setNewPrice("");
  }
  function deleteService(idx) {
    setServices(services.filter((_, i) => i !== idx));
  }
  function renameService(idx, value) {
    const updated = [...services];
    updated[idx].name = value;
    setServices(updated);
  }
  function editType(idx, value) {
    const updated = [...services];
    updated[idx].type = value;
    setServices(updated);
  }
  function editPrice(idx, value) {
    const updated = [...services];
    updated[idx].price = parseFloat(value);
    setServices(updated);
  }

  return (
    <div className="admin-panel">
      <h1>Welcome Admin <span role="img" aria-label="crown">👑</span></h1>
      <h3>Services List</h3>
      <table style={{width:"100%",borderSpacing:"0 8px",marginBottom:12}}>
        <thead><tr style={{background:"#fffaf4"}}>
          <th>Name</th><th>Type</th><th>Price</th><th>❌</th>
        </tr></thead>
        <tbody>
        {services.map((sv, i) => (
          <tr key={i} style={{background:"#f8fdff"}}>
            <td>
              <input value={sv.name} onChange={e=>renameService(i, e.target.value)} />
            </td>
            <td>
              <input value={sv.type} onChange={e=>editType(i, e.target.value)} />
            </td>
            <td>
              <input type="number" value={sv.price} onChange={e=>editPrice(i, e.target.value)} />
            </td>
            <td>
              <button onClick={()=>deleteService(i)} style={{color:"#f84a64",border:"none",background:"none",fontSize:"1.13em"}}>🗑️</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <h4>Add New Service</h4>
      <input placeholder="Service name" value={newName} onChange={e=>setNewName(e.target.value)} />
      <input placeholder="Type" value={newType} onChange={e=>setNewType(e.target.value)} />
      <input placeholder="Price" value={newPrice} onChange={e=>setNewPrice(e.target.value)} type="number" min="0" />
      <button className="btn-main" onClick={addService}>Add 🚀</button>
      <h4 style={{marginTop:18}}>UPI QR Image (for <b>boraxdealer@fam</b>):</h4>
      <input placeholder="Paste new QR URL" value={qr} onChange={e=>setQr(e.target.value)} style={{width:"70%"}} />
      {qr && <img src={qr} alt="upi qr" style={{height:80,margin:"12px 0",borderRadius:"8px"}} />}
    </div>
  );
}
