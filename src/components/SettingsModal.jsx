import React, { useState } from "react";
export default function SettingsModal({ onClose }) {
  const [email, setEmail] = useState("demo@email.com");
  return (
    <div className="settings-modal">
      <form className="settings-card" onSubmit={e=>e.preventDefault()}>
        <button onClick={onClose} className="close-modal">&times;</button>
        <h2>⚙️ Settings</h2>
        <label>Email:</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn-main" style={{marginTop:17}}>Save Changes</button>
      </form>
    </div>
  );
}
