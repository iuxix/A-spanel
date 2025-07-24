import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

const primaryColor = "#1b365d";
const secondaryColor = "#2474df";
const accentColor = "#36c2ff";

export default function AdminPanel() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const q = query(collection(db, "deposits"), where("status", "==", "pending"));
    const unsub = onSnapshot(q, snapshot => {
      setDeposits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  async function approveDeposit(dep) {
    setActionMsg(""); setLoading(true);
    try {
      await updateDoc(doc(db, "deposits", dep.id), { status: "accepted" });
      const userRef = doc(db, "users", dep.user);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0;
        await updateDoc(userRef, { balance: currentBalance + dep.amount });
      }
      setActionMsg(`✅ Accepted deposit of ₹${dep.amount} by ${dep.username || dep.user}`);
    } catch (e) {
      setActionMsg("❌ Error approving deposit: "+e.message);
    }
    setLoading(false);
  }

  async function rejectDeposit(dep) {
    setActionMsg(""); setLoading(true);
    try {
      await updateDoc(doc(db, "deposits", dep.id), { status: "rejected" });
      setActionMsg(`❌ Rejected deposit of ₹${dep.amount} by ${dep.username || dep.user}`);
    } catch (e) {
      setActionMsg("❌ Error rejecting deposit: "+e.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 32, fontFamily: "Poppins,sans-serif", color: primaryColor }}>
      <h2 style={{ fontWeight: 900, fontSize: "1.55em", marginBottom: 24, borderBottom: `3px solid ${primaryColor}`, paddingBottom: 7 }}>
        Admin Panel – Pending Deposits
      </h2>
      {actionMsg && (
        <div style={{
          marginBottom: 22,
          fontWeight: 700,
          color: actionMsg.startsWith("✅") ? "#2e7d32" : "#d32f2f",
          background: actionMsg.startsWith("✅") ? "#dbf8e3" : "#ffe6ed",
          padding: 12,
          borderRadius: 9
        }}>
          {actionMsg}
        </div>
      )}
      {deposits.length === 0 ? (
        <div style={{ fontSize: "1.08em", color: "#789" }}>No pending requests.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: secondaryColor, color: "#fff" }}>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Amount (₹)</th>
              <th style={thStyle}>Request Date</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(dep => (
              <tr key={dep.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{dep.username || dep.user}</td>
                <td style={tdStyle}>{dep.amount.toFixed(2)}</td>
                <td style={tdStyle}>{dep.created?.toDate ? dep.created.toDate().toLocaleString() : new Date(dep.created).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button onClick={() => approveDeposit(dep)} disabled={loading} style={btnApprove}>Accept</button>
                  <button onClick={() => rejectDeposit(dep)} disabled={loading} style={btnReject}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
const thStyle = {
  padding: "11px 8px",
  fontWeight: "700",
  textAlign: "left",
  fontSize: "0.97em"
};
const tdStyle = {
  padding: "11px 8px",
  fontSize: "0.97em",
  verticalAlign: "middle"
};
const btnApprove = {
  background: "#33c480",
  border: "none",
  color: "#fff",
  fontWeight: 800,
  padding: "6px 16px",
  borderRadius: 7,
  marginRight: 7,
  cursor: "pointer"
};
const btnReject = {
  background: "#e53857",
  border: "none",
  color: "#fff",
  fontWeight: 800,
  padding: "6px 16px",
  borderRadius: 7,
  cursor: "pointer"
};
