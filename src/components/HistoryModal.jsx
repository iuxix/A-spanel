import React from "react";
export default function HistoryModal({ onClose }) {
  return (
    <div className="history-modal">
      <div className="history-card">
        <button onClick={onClose} className="close-modal">&times;</button>
        <h2>📜 Order & Payment History</h2>
        <div style={{opacity:.7}}>No data yet (implement real history pulling here).</div>
      </div>
    </div>
  );
}
