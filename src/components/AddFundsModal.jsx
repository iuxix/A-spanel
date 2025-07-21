import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddFundsModal({ user, onClose, onDepositApproved }) {
  const [amt, setAmt] = useState("");
  const [ss, setSS] = useState(null);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!amt || amt < 100) {
      setMsg("Amount must be ₹100+.");
      return;
    }
    if (!ss) {
      setMsg("Please upload UPI/transaction screenshot.");
      return;
    }
    // Save deposit for admin
    try {
      await addDoc(collection(db, "deposits"), {
        uid: user.uid, user: user.email || user.displayName, amount: Number(amt),
        status: "pending", created: Timestamp.now()
        // Optionally: handle screenshot file upload to storage
      });
      setMsg("Deposit submitted! Awaiting admin approval.");
      setAmt(""); setSS(null);
      if (onDepositApproved) onDepositApproved();
    } catch {
      setMsg("Error submitting deposit.");
    }
  }

  return (
    <div style={{
      position:"fixed",left:0,top:0,width:"100vw",height:"100vh",zIndex:99,
      background:"rgba(0,220,180,0.07)",
      display:"flex",alignItems:"center",justifyContent:"center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 15, width: 330, padding: 29, boxShadow: "0 8px 28px #27f7a328", position: "relative"
        }}>
        <button
          style={{
            position: "absolute", right: 15, top: 10, border: "none", fontSize: "1.77em",
            background: "none", color: "#fe466e", cursor: "pointer"
          }}
          onClick={onClose}
          type="button"
        >&times;</button>
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Add Funds</h2>
        <div style={{
          fontWeight: 700, color: "#19c32e",
          marginBottom: 9, textAlign: "center"
        }}>
          Send only ₹100+ to UPI: <span style={{ color:"#0690c3" }}>boraxdealer@fam</span>
        </div>
        <img src="/qr.png" alt="UPI QR" style={{width:110,borderRadius:11,margin:"8px auto 19px",display:"block"}}/>
        <input
          type="number"
          min={100}
          placeholder="Enter Amount (₹100+)"
          style={{width:"100%",borderRadius:7,padding:"11px 10px",margin:"13px 0 8px"}}
          value={amt}
          onChange={e=>setAmt(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          style={{width:"100%",marginBottom:10}}
          onChange={e=>setSS(e.target.files[0])}
        />
        <button
          style={{
            width:"100%", borderRadius:10, background:"linear-gradient(90deg,#23ff87,#efba3e)",
            color:"#204b2d", fontWeight:900, fontSize:"1.12em", padding:"13px 0", border:"none", marginBottom:6, marginTop:6
          }}
          type="submit"
        >Send Deposit</button>
        <div style={{color:"#f3304a",fontWeight:700,textAlign:"center"}}>{msg}</div>
      </form>
    </div>
  );
}
