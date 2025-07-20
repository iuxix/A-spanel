import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase";

export default function ProfileModal({ onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return () => unsub();
  }, []);

  function handleLogout() {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      window.location.href = "/login";
    });
  }

  if (!user) {
    return (
      <div className="profile-modal">
        <div className="profile-card">
          <button onClick={onClose} className="close-modal">&times;</button>
          <h2>Profile</h2>
          <div>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-modal">
      <div className="profile-card">
        <button onClick={onClose} className="close-modal">&times;</button>
        <h2>👤 Profile</h2>
        <div style={{ fontWeight: 600, marginBottom: "6px" }}>
          {user.displayName || "Unnamed"}
        </div>
        <div>Email: {user.email}</div>
        <div style={{ marginTop: 18 }}>
          <button className="btn-main" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
