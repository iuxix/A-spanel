import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

const primaryColor = "#1b365d";
const secondaryColor = "#2b539f";
const accentColor = "#54c7ec";

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
    setActionMsg("");
    setLoading(true);
    try {
      const depRef = doc(db, "deposits", dep.id);
      await updateDoc(depRef, { status: "accepted" });

      const userRef = doc(db, "users", dep.user);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0;
        await updateDoc(userRef, { balance: currentBalance + dep.amount });
      }
      setActionMsg(`✅ Accepted deposit of ₹${dep.amount} by user: ${dep.username || dep.user}`);
    } catch (error) {
      setActionMsg(`❌ Error approving deposit: ${error.message}`);
    }
    setLoading(false);
  }

  async function rejectDeposit(dep) {
    setActionMsg("");
    setLoading(true);
    try {
      const depRef = doc(db, "deposits", dep.id);
      await updateDoc(depRef, { status: "rejected" });
      setActionMsg(`❌ Rejected deposit of ₹${dep.amount} by user: ${dep.username || dep.user}`);
    } catch (error) {
      setActionMsg(`❌ Error rejecting deposit: ${error.message}`);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 780, margin: "auto", padding: 32, fontFamily: "Poppins, sans-serif", color: primaryColor }}>
      <h2 style={{ fontWeight: 900, fontSize: "1.7em", marginBottom: 24, borderBottom: `3px solid ${primaryColor}` }}>
        Admin Panel - Deposit Requests
      </h2>

      {actionMsg && (
        <div style={{
          marginBottom: 24,
          fontWeight: 700,
          color: actionMsg.startsWith("✅") ? "#2e7d32" : "#d32f2f",
          backgroundColor: actionMsg.startsWith("✅") ? "#d0f0c0" : "#ffd7d7",
          padding: 14,
          borderRadius: 10,
          userSelect: "none"
        }}>
          {actionMsg}
        </div>
      )}

      {deposits.length === 0 ? (
        <p style={{ fontSize: "1.2em", color: "#555" }}>No pending deposit requests.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: secondaryColor, color: "#fff" }}>
            <tr>
              <th style={headerCellStyle}>User</th>
              <th style={headerCellStyle}>Amount (₹)</th>
              <th style={headerCellStyle}>Request Date</th>
              <th style={headerCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(dep => (
              <tr key={dep.id} style={{ borderBottom: "1px solid #cfd8dc" }}>
                <td style={cellStyle}>{dep.username || dep.user}</td>
                <td style={cellStyle}>{dep.amount.toFixed(2)}</td>
                <td style={cellStyle}>{dep.created?.toDate ? dep.created.toDate().toLocaleString() : new Date(dep.created).toLocaleString()}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => approveDeposit(dep)}
                    disabled={loading}
                    style={approveBtnStyle}
                    aria-label={`Accept deposit from ${dep.username || dep.user}`}
                    type="button"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectDeposit(dep)}
                    disabled={loading}
                    style={rejectBtnStyle}
                    aria-label={`Reject deposit from ${dep.username || dep.user}`}
                    type="button"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const headerCellStyle = {
  padding: "12px 14px",
  fontWeight: "700",
  fontSize: "1em",
  textAlign: "left",
  userSelect: "none"
};

const cellStyle = {
  padding: "12px 14px",
  fontSize: "0.95em",
  color: primaryColor,
  userSelect: "text",
  verticalAlign: "middle"
};

const approveBtnStyle = {
  backgroundColor: "#388e3c",
  border: "none",
  color: "#fff",
  fontWeight: 700,
  padding: "8px 16px",
  borderRadius: 8,
  marginRight: 12,
  cursor: "pointer",
  userSelect: "none"
};

const rejectBtnStyle = {
  backgroundColor: "#d32f2f",
  border: "none",
  color: "#fff",
  fontWeight: 700,
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  userSelect: "none"
};
