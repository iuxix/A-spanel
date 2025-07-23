import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

// Styling (matches your panel: dark colors, pro cards)
const accent = "#348aff";
const accentBox = "#263360";
const statsBox = "#212641";
const borderClr = "#47e8a8";

export default function AdminPanel() {
  const [funds, setFunds] = useState([]);

  // Live listen for all deposits (fund requests)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "deposits"), (snap) => {
      setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) =>
        b.created?.toMillis?.() - a.created?.toMillis?.()
      ));
    });
    return unsub;
  }, []);

  // Approve handler
  async function handleApprove(f) {
    const userRef = doc(db, "users", f.user);
    const userSnap = await getDoc(userRef);
    let curBal = userSnap.exists() && typeof userSnap.data().balance === "number" ? userSnap.data().balance : 0;
    let bonus = Number(f.amount) >= 100 ? Math.floor(f.amount * 0.10) : 0;
    // Update user balance with bonus (if applicable)
    await updateDoc(userRef, { balance: curBal + Number(f.amount) + bonus });
    await updateDoc(doc(db, "deposits", f.id), { status: "accepted" });
  }

  // Reject handler
  async function handleReject(f) {
    await updateDoc(doc(db, "deposits", f.id), { status: "rejected" });
  }

  return (
    <div style={{
      background: "#171b2d",
      minHeight: "100vh",
      fontFamily: "Poppins,sans-serif",
      color: "#fff",
      padding: "0 0 70px",
    }}>
      <div style={{
        background: "#212852",
        borderBottom: "2px solid #155efc",
        padding: "18px 0 16px",
        fontWeight: 900,
        fontSize: "1.4em",
        color: accent,
        textAlign: "center",
        letterSpacing: ".8px",
      }}>
        LucixFire Panel – <span style={{ color: "#18dfb0" }}>Admin</span> Fund Requests
      </div>
      <div style={{
        maxWidth: 700, margin: "44px auto 0", background: accentBox, borderRadius: 17, boxShadow: "0 7px 21px #32e3ee32", padding: "25px 22px",
      }}>
        {funds.length === 0 ? (
          <div style={{ color: "#83eedd", fontWeight: 700, fontSize: "1.16em", textAlign: "center" }}>
            No new fund requests yet!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
            {funds.map(f =>
              <div key={f.id} style={{
                background: statsBox,
                border: "2px solid #122a47",
                borderRadius: 13,
                padding: "16px 13px",
                boxShadow: "0 1.5px 10px #10e78219",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}>
                <div style={{ flex: 1 }}>
                  <div><b style={{ color: "#75e6ff" }}>User:</b> {f.user}</div>
                  <div><b style={{ color: "#e3ff94" }}>Amount:</b> ₹{f.amount}</div>
                  {Number(f.amount) >= 100 &&
                    <div style={{ color: "#41ee99", fontSize: ".97em" }}>
                      +10% bonus (₹{Math.floor(Number(f.amount) * 0.10)})
                    </div>
                  }
                  <div style={{ marginTop: 7 }}>Status:{" "}
                    <b style={{
                      color:
                        f.status === "accepted"
                          ? "#25e873"
                          : f.status === "rejected"
                            ? "#f94f7a"
                            : "#ffe777"
                    }}>{f.status ? f.status.toUpperCase() : "PENDING"}</b>
                  </div>
                  {f.proof &&
                  <div style={{ marginTop: 7 }}>
                    <a
                      href={`https://firebasestorage.googleapis.com/v0/b/your-firebase-app.appspot.com/o/${encodeURIComponent(f.proof)}?alt=media`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: accent, fontWeight: 700, textDecoration: "underline" }}
                    >
                      View Proof
                    </a>
                  </div>}
                  <div style={{ marginTop: 8, color: "#e3eada", fontSize: ".94em" }}>
                    Request: {f.created ? new Date(f.created.seconds * 1000).toLocaleString() : "—"}
                  </div>
                </div>
                <div style={{
                  display: "flex", flexDirection: "column", gap: 10, alignItems: "end"
                }}>
                  <button
                    disabled={f.status === "accepted"}
                    style={{
                      background: "linear-gradient(90deg,#40f1c8,#53f946)", color: "#1a3b2a", fontWeight: 800,
                      border: "none", borderRadius: 8, padding: "9px 22px", fontSize: "1.04em",
                      marginBottom: 3, opacity: f.status === "accepted" ? 0.6 : 1, cursor: f.status === "accepted" ? "not-allowed" : "pointer"
                    }}
                    onClick={() => handleApprove(f)}
                  >
                    Accept
                  </button>
                  <button
                    disabled={f.status === "accepted" || f.status === "rejected"}
                    style={{
                      background: "linear-gradient(90deg,#f86a83,#fbc36e)", color: "#31211d", fontWeight: 800,
                      border: "none", borderRadius: 8, padding: "8px 22px", fontSize: "1.04em",
                      opacity: (f.status === "accepted" || f.status === "rejected") ? 0.5 : 1,
                      cursor: (f.status === "accepted" || f.status === "rejected") ? "not-allowed" : "pointer"
                    }}
                    onClick={() => handleReject(f)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
