import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [funds, setFunds] = useState([]);
  useEffect(() => {
    getDocs(collection(db, "deposits")).then(qSnap => {
      setFunds(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);
  async function handleAction(f, status) {
    await updateDoc(doc(db, "deposits", f.id), { status });
    if (status === "accepted") {
      // Update user balance
      const userDoc = doc(db, "users", f.user);
      const snap = await getDocs(collection(db, "users"));
      const found = snap.docs.find(d => d.id === f.user);
      if (found) {
        const newBal = (found.data().balance || 0) + Number(f.amount);
        await updateDoc(userDoc, { balance: newBal });
      }
    }
    setFunds((lst) => lst.map(x => x.id === f.id ? { ...x, status } : x));
  }
  return (
    <div style={{ maxWidth: 670, margin: "35px auto", background: "#252e4a", borderRadius: 18, padding: "28px 20px", color: "#fff" }}>
      <h2 style={{ fontWeight: 900, fontSize: "1.18em", letterSpacing: "-.5px", marginBottom: 18, color: "#16e287" }}>Manage Add Fund Requests</h2>
      {funds.map(f =>
        <div key={f.id} style={{ background: "#192b44", borderRadius: 14, boxShadow: "0 2px 14px #11f4b841", padding: "17px 14px", marginBottom: 11, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.10em", marginBottom: 5 }}>User: {f.user}</div>
            <div style={{ color: "#a0f3cb" }}>Amount: <b>₹{f.amount}</b></div>
            <div>Status: <b style={{ color: f.status === "accepted" ? "#27fd90" : f.status === "rejected" ? "#fc5d70" : "#ffed82" }}>{f.status}</b></div>
            {f.proof && <a href={f.proof} target="_blank" style={{ color: "#51e7ff", textDecoration: "underline", fontWeight: 700 }}>View Proof</a>}
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <button onClick={() => handleAction(f, "accepted")} style={{ background: "#2cfdaa", color: "#133e1a", fontWeight: 800, border: "none", borderRadius: 7, padding: "12px 28px", fontSize: "1.07em", cursor: "pointer" }}>Accept</button>
            <button onClick={() => handleAction(f, "rejected")} style={{ background: "#fd3f4b", color: "#fff", fontWeight: 800, border: "none", borderRadius: 7, padding: "12px 18px", fontSize: "1.07em", cursor: "pointer" }}>Reject</button>
          </div>
        </div>)}
    </div>
  );
}
