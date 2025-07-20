import React, { useState } from "react";

export default function AddFundsModal({ onClose, upi, qr }) {
  const [amt, setAmt] = useState("");
  const [ss, setSS] = useState(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!ss || amt < 100) return;
    setDone(true);
    // Real: upload proof and save to Firestore "deposits" with "pending"
  }

  return (
    <div className="funds-modal">
      <form className="funds-card" onSubmit={handleSubmit}>
        <button type="button" className="close-modal" onClick={onClose}>&times;</button>
        <h2>💳 Add Funds</h2>
        <div style={{fontWeight:700, color:"#17b17e",marginBottom:6}}>Pay <span style={{color:"#efae34"}}>₹100+</span> to UPI ID: <span style={{color:"#1586fa"}}>{upi}</span></div>
        <img src={qr || "https://chart.googleapis.com/chart?cht=upi&chs=250x250&chl=upi://pay?pa=" + upi} alt="UPI QR" style={{width:110,borderRadius:11,margin:"7px auto 15px"}}/>
        <div style={{marginBottom:7,color:"#576"}}>(Amount, UPI, and QR must match. Only deposits of ₹100 or above will be accepted!)</div>
        <input type="number" placeholder="Amount (₹100+)" min={100} value={amt} onChange={e=>setAmt(e.target.value)} />
        <input type="file" accept="image/*" onChange={e=>setSS(e.target.files[0])} />
        <button className="btn-main" type="submit" disabled={done || !amt || !ss || amt<100 }>
          {done ? "✓ Submitted" : "Upload & Submit"}
        </button>
        {done && <div className="order-success" style={{marginTop:13}}>📩 Awaiting admin approval!</div>}
      </form>
    </div>
  );
}
