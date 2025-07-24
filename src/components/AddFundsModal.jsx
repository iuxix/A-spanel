import React, { useState } from "react";

// The generic Modal component used by AddFundsModal
function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 160,
      background: "rgba(32,50,74,0.18)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, width: 370, maxWidth: "97vw", maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 10px 36px #24deff45", padding: "29px 16px 17px", position: "relative"
      }}>
        <button type="button" onClick={onClose} style={{
          position: "absolute", right: 17, top: 9, border: "none", fontSize: "2em", background: "none", color: "#217dbb", cursor: "pointer"
        }}>&times;</button>
        <div style={{ fontWeight: 900, fontSize: "1.12em", marginBottom: 13, color: "#237ecb" }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

// The AddFundsModal component
export default function AddFundsModal({ onClose, loading, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  function resetInput() {
    setAmount("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    // This calls the handleAddFundsSubmit function from Dashboard.jsx
    await onSubmit(amount, setMsg, resetInput);
  }

  return (
    <Modal title="Add Funds" onClose={onClose}>
      <div style={{
        fontWeight: 700,
        color: "#18c332",
        marginBottom: 8,
        textAlign: "center",
        backgroundColor: "#e8fff3",
        borderRadius: 8,
        padding: "9px",
        userSelect: "none"
      }}>
        🎁 Deposit above <b>₹100</b> gets you instant <b>10% bonus</b>!
      </div>
      <div style={{
        fontWeight: 600,
        color: "#228edc",
        textAlign: "center",
        marginBottom: 8,
        userSelect: "none"
      }}>UPI: <span style={{ color: "#2884f6", fontWeight: 900 }}>boraxdealer@fam</span></div>
      <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{ width: 140, borderRadius: 13, display: "block", margin: "12px auto 14px", background: "#fff" }} />
      <ol style={{ color: "#5993b2", marginBottom: 10, paddingLeft: 17, fontSize: "0.91em", userSelect: "none" }}>
        <li>Pay with above UPI or QR code.</li>
        <li>Submit the paid amount (min ₹30).</li>
        <li>Admin will accept your request soon.</li>
      </ol>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min={30}
          placeholder="Enter Amount (₹30+)"
          style={{
            width: "100%",
            padding: "13px 10px",
            marginBottom: 11,
            borderRadius: 8,
            border: "1.3px solid #c2eafc",
            fontWeight: 700,
            userSelect: "text"
          }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
          disabled={loading}
          required
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 0",
            margin: "6px 0 2px",
            borderRadius: 8,
            fontWeight: 900,
            border: "none",
            background: loading ? "#badfff" : "linear-gradient(90deg,#34b992,#1e78e8)",
            color: "#fff",
            fontSize: "1.09em",
            cursor: loading ? "progress" : "pointer",
            userSelect: "none"
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {msg && (
          <div style={{
            marginTop: 10,
            fontWeight: 700,
            textAlign: "center",
            color: msg.startsWith("✅") ? "#1fb963" : "#e75d74"
          }}>
            {msg}
          </div>
        )}
      </form>
    </Modal>
  );
}
