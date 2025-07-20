import React, { useState } from "react";
export default function AddFundsModal({ onClose }) {
  const [amt, setAmt] = useState(""); const [ss, setSS] = useState(null); const [done, setDone] = useState(false);
  function handleSubmit(e) { e.preventDefault(); if (amt < 100 || !ss) return; setDone(true); }
  return (
    <div className="funds-modal">
      <form className="funds-card" onSubmit={handleSubmit}>
        <button onClick={onClose} className="close-modal">&times;</button>
        <h2>💳 Add Funds</h2>
        <input type="number" placeholder="Amount (₹100+)" min={100} value={amt} onChange={e=>setAmt(e.target.value)} />
        <input type="file" accept="image/*" onChange={e=>setSS(e.target.files[0])} />
        <button className="btn-main" disabled={done}>{done ? "✓ Submitted" : "Upload & Submit"}</button>
        {done && <div className="order-success" style={{marginTop:13}}>Submitted! Await admin approval.</div>}
        <div className="order-metainfo" style={{marginTop:9}}>Pay to UPI: <b>boraxdealer@fam</b></div>
      </form>
    </div>
  );
}
