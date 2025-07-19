import React, { useState } from "react";
export default function AddFunds({ onClose }) {
  const [amt, setAmt] = useState("");
  const [ss, setSS] = useState(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (amt < 100 || !ss) return;
    setDone(true);
  }

  return (
    <div className="addfunds-modal">
      <div className="af-box">
        <button onClick={onClose} className="af-close">&times;</button>
        <h3>💸 Add Funds</h3>
        <div className="upi-line">
          Pay <span style={{color:"#f9a403"}}>₹100+</span> to UPI: <span style={{letterSpacing: "1px", color:"#1822b4"}}>boraxdealer@fam</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="number" placeholder="Amount (₹100+)" min={100} value={amt} onChange={e=>setAmt(e.target.value)} className="order-inp" />
          <input type="file" accept="image/*" onChange={e=>setSS(e.target.files[0])} className="order-inp" />
          <button className="btn-main" type="submit" disabled={done}>{done ? "✓ Submitted" : "Upload & Submit"}</button>
        </form>
        {done && <div className="success-msg">📩 Awaiting admin approval!</div>}
      </div>
    </div>
  );
}
