import React from "react";
export default function HistoryModal({ onClose }) {
  return (
    <div className="history-modal">
      <div className="history-card">
        <button onClick={onClose} className="close-modal">&times;</button>
        <h2>📜 Order & Payment History</h2>
        <div style={{opacity:.6}}>Demo Only — show user's order/payment logs here.</div>
      </div>
    </div>
  );
}
