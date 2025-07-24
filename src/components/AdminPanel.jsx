import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, query, where, onSnapshot, doc, updateDoc, getDoc, deleteDoc, addDoc
} from "firebase/firestore";

const primaryColor = "#1b365d";
const secondaryColor = "#2474df";
const accentColor = "#36c2ff";

export default function AdminPanel() {
  const [payments, setPayments] = useState([]);
  const [adminHistory, setAdminHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const q = query(collection(db, "payments"), where("status", "==", "pending"));
    const unsub = onSnapshot(q, snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "history"));
    const unsub = onSnapshot(q, snap => {
      setAdminHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsub();
  }, []);

  async function acceptPayment(payment) {
    setActionMsg(""); setLoading(true);
    try {
      const userRef = doc(db, "users", payment.user);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0;
        await updateDoc(userRef, { balance: currentBalance + payment.amount });
      }
      await deleteDoc(doc(db, "payments", payment.id));
      await addDoc(collection(db, "history"), {
        type: "payment_accept",
        user: payment.user,
        description: `Accepted fund ₹${payment.amount} from ${payment.username || payment.user}`,
        timestamp: Date.now()
      });
      setActionMsg(`✅ Accepted ₹${payment.amount} from ${payment.username || payment.user}`);
    } catch (err) {
      setActionMsg("❌ Error accepting payment: " + err.message);
    }
    setLoading(false);
  }

  async function deletePayment(payment) {
    setActionMsg(""); setLoading(true);
    try {
      await deleteDoc(doc(db, "payments", payment.id));
      await addDoc(collection(db, "history"), {
        type: "payment_delete",
        user: payment.user,
        description: `Deleted fund request ₹${payment.amount} from ${payment.username || payment.user}`,
        timestamp: Date.now()
      });
      setActionMsg(`❌ Deleted ₹${payment.amount} fund request from ${payment.username || payment.user}`);
    } catch (err) {
      setActionMsg("❌ Error deleting fund request: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 30, fontFamily: "Poppins, sans-serif", color: primaryColor }}>
      <h1 style={{
        fontWeight: 900, fontSize: "1.8em", marginBottom: 24,
        borderBottom: `3px solid ${primaryColor}`, paddingBottom: 6
      }}>
        Admin Panel — Fund Requests & History
      </h1>

      {actionMsg && (
        <div style={{
          padding: 14, marginBottom: 20, borderRadius: 9, fontWeight: 700,
          color: actionMsg.startsWith("✅") ? "#2e7d32" : "#d32f2f",
          backgroundColor: actionMsg.startsWith("✅") ? "#dbf8e3" : "#ffe6ea",
          userSelect: "none"
        }}>
          {actionMsg}
        </div>
      )}

      <section style={{ marginBottom: 40 }}>
        <h2 style={{
          fontWeight: 800, fontSize: "1.35em", marginBottom: 14,
          borderBottom: `2px solid ${accentColor}`, paddingBottom: 4
        }}>
          Pending Fund Requests
        </h2>
        {payments.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No pending fund requests.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: secondaryColor, color: "#fff" }}>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Amount (₹)</th>
                <th style={thStyle}>Requested At</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>{p.username || p.user}</td>
                  <td style={tdStyle}>{p.amount.toFixed(2)}</td>
                  <td style={tdStyle}>{p.created?.toDate ? p.created.toDate().toLocaleString() : new Date(p.created).toLocaleString()}</td>
                  <td style={tdStyle}>
                    <button onClick={() => acceptPayment(p)} disabled={loading} style={btnAccept}>Accept</button>
                    <button onClick={() => deletePayment(p)} disabled={loading} style={btnReject}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 style={{
          fontWeight: 800, fontSize: "1.35em", marginBottom: 14,
          borderBottom: `2px solid ${accentColor}`, paddingBottom: 4
        }}>
          Action History (Auto-cleared after 24 hours)
        </h2>
        {adminHistory.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No action history available.</p>
        ) : (
          <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
            {adminHistory.map(h => (
              <div key={h.id} style={historyItemStyle}>
                <div><b>{h.type.replace(/_/g, " ").toUpperCase()}</b> — {h.description}</div>
                <div style={{ fontSize: "0.83em", color: "#555" }}>{new Date(h.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
        <p style={{ fontSize: "0.85em", fontStyle: "italic", marginTop: 12, color: "#888" }}>
          Note: History is stored temporarily and automatically cleared after 24 hours.
        </p>
      </section>
    </div>
  );
}

const thStyle = {
  padding: "9px 10px",
  fontWeight: "700",
  fontSize: "1em",
  textAlign: "left",
  userSelect: "none"
};
const tdStyle = {
  padding: "8px 10px",
  fontSize: "0.95em",
  verticalAlign: "middle"
};
const btnAccept = {
  background: "#36c239",
  border: "none",
  color: "#fff",
  padding: "7px 13px",
  borderRadius: 8,
  marginRight: 8,
  fontWeight: "700",
  cursor: "pointer",
  userSelect: "none"
};
const btnReject = {
  background: "#e53d4f",
  border: "none",
  color: "#fff",
  padding: "7px 13px",
  borderRadius: 8,
  fontWeight: "700",
  cursor: "pointer",
  userSelect: "none"
};
const historyItemStyle = {
  backgroundColor: "#f4f7fe",
  borderRadius: 10,
  padding: "12px 15px",
  marginBottom: 10,
  fontSize: "0.95em",
  color: primaryColor
};
