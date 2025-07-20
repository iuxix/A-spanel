import React from "react";
export default function ProfileModal({ onClose }) {
  return (
    <div className="profile-modal">
      <div className="profile-card">
        <button onClick={onClose} className="close-modal">&times;</button>
        <h2>👤 Profile</h2>
        <div>Name: Demo User</div>
        <div>Email: demo@email.com</div>
        <div style={{marginTop:18}}><button className="btn-main" onClick={()=>window.location='/login'}>Logout</button></div>
      </div>
    </div>
  );
}
