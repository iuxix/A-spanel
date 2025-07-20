import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateProfile, updatePassword } from "firebase/auth";
import app from "../firebase";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SettingsModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Grab user profile from Firebase Auth, and WhatsApp from Firestore/user doc
  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(usr);
        setDisplayName(usr.displayName || "");
        // WhatsApp custom field (optional): fetch from users collection
        const userDoc = await getDoc(doc(db, "users", usr.uid));
        if (userDoc.exists() && userDoc.data().whatsapp) {
          setWhatsapp(userDoc.data().whatsapp);
        }
      }
    });
    return () => unsub();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(""); setError("");
    try {
      if (displayName && user.displayName !== displayName)
        await updateProfile(user, { displayName });

      // Save WhatsApp field to Firestore
      if (whatsapp)
        await setDoc(doc(db, "users", user.uid), { whatsapp }, { merge: true });

      // Update password
      if (password) await updatePassword(user, password);

      setSuccess("✅ Profile updated!");
    } catch (e) {
      setError("❌ " + (e.message || "Could not update profile"));
    }
    setSaving(false);
  }

  if (!user)
    return (
      <div className="settings-modal">
        <form className="settings-card">
          <button onClick={onClose} className="close-modal" type="button">&times;</button>
          <h2>Settings</h2>
          <div>Loading...</div>
        </form>
      </div>
    );

  return (
    <div className="settings-modal">
      <form className="settings-card" onSubmit={handleSave}>
        <button onClick={onClose} className="close-modal" type="button">&times;</button>
        <h2 style={{marginBottom:12}}>⚙️ Settings</h2>
        <label>Username</label>
        <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your display name"/>
        <label>WhatsApp</label>
        <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp Number"/>
        <label>New Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="(Leave blank to keep current)"/>
        {success && <div className="order-success">{success}</div>}
        {error && <div className="order-warning">{error}</div>}
        <button className="btn-main" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
