import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

// Simple admin panel: Manage deposits approval
export default function AdminPanel() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    // Listen to all deposits with status 'pending'
    const q = query(collection(db, "deposits"), where("status", "==", "pending"));
    const unsub = onSnapshot(q, snapshot => {
      setDeposits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Approve deposit: update deposit status and increment user balance
  async function approveDeposit(dep) {
    setActionMsg("");
    setLoading(true);
    try {
      // Update deposit status to accepted
      const depRef = doc(db, "deposits", dep.id);
      await updateDoc(depRef, { status: "accepted" });

      // Increment user's balance
      const userRef = doc(db, "users", dep.user);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0;
        await updateDoc(userRef, {
          balance: parseFloat(currentBalance) + parseFloat(dep.amount)
        });
      } else {
        // User doc not found, create new with balance = amount (optional)
        // await setDoc(userRef, { balance: dep.amount });
      }
      setActionMsg(`✅ Deposit by user ${dep.user} approved and balance updated.`);
    } catch (error) {
      setActionMsg("❌ Error approving deposit: " + error.message);
    }
    setLoading(false);
  }

  // Reject deposit: update deposit status to rejected
  async function rejectDeposit(dep) {
    setActionMsg("");
    setLoading(true);
    try {
      const depRef = doc(db, "deposits", dep.id);
      await updateDoc(depRef, { status: "rejected" });
      setActionMsg(`❌ Deposit by user ${dep.user} rejected.`);
    } catch (error) {
      setActionMsg("❌ Error rejecting deposit: " + error.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 780, margin: "auto", padding: 20, fontFamily: "Poppins,sans-serif" }}>
      <h2 style={{ color: "#136cae" }}>Admin Panel - Manage Deposit Requests</h2>
      {actionMsg && <div style={{ marginBottom: 15, fontWeight: "700", color: actionMsg.startsWith("✅") ? "#2eda7e" : "#e8274d" }}>{actionMsg}</div>}
      {deposits.length === 0 ? (
        <div style={{ fontSize: "1.1em", color: "#555", fontWeight: 600 }}>No pending deposit requests.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#0e58e9", color: "#fff" }}>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Amount (₹)</th>
              <th style={thStyle}>Proof File</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(dep => (
              <tr key={dep.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{dep.user}</td>
                <td style={tdStyle}>{dep.amount.toFixed(2)}</td>
                <td style={tdStyle}>
                  {dep.proofName ?
                    <a href={`https://your-storage-url/${dep.proofName}`} target="_blank" rel="noreferrer" style={{ color: "#0e58e9" }}>
                      {dep.proofName}
                    </a> :
                    "No proof"
                  }
                </td>
                <td style={tdStyle}>{dep.created?.toDate ? dep.created.toDate().toLocaleString() : new Date(dep.created).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button disabled={loading} onClick={() => approveDeposit(dep)} style={btnApproveStyle}>Accept</button>
                  <button disabled={loading} onClick={() => rejectDeposit(dep)} style={btnRejectStyle}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles
const thStyle = {
  padding: "12px 10px",
  fontWeight: "700",
  fontSize: "0.95em",
  textAlign: "left"
};
const tdStyle = {
  padding: "10px 10px",
  fontSize: "0.9em"
};
const btnApproveStyle = {
  background: "#2eda7e",
  border: "none",
  color: "white",
  padding: "7px 13px",
  marginRight: 7,
  borderRadius: 6,
  fontWeight: 700,
  cursor: "pointer"
};
const btnRejectStyle = {
  background: "#e8274d",
  border: "none",
  color: "white",
  padding: "7px 13px",
  borderRadius: 6,
  fontWeight: 700,
  cursor: "pointer"
};
