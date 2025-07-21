import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../firebase";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!name || !email || !password) {
      setErr("❌ Fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth(app);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      window.location.href = "/dashboard";
    } catch (e) {
      setErr("❌ " + (e.message || "Signup failed"));
    }
    setLoading(false);
  }

  return (
    <>
      <div className="login-title" style={{fontSize:"1.35em", textAlign:"center"}}>
        Sign Up for <span style={{color:"#12b954"}}>LucixFirexPanel</span> <span role="img" aria-label="rocket">🚀</span>
      </div>
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <input type="text" className="login-input" placeholder="👤 Full Name" value={name} onChange={e=>setName(e.target.value)} />
        <input type="email" className="login-input" placeholder="📧 Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="login-input" placeholder="🔑 Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="form-error">{err}</div>}
        <button className="login-btn-green" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="login-links">
        <span>Already have an account? <a href="/login">Sign in</a></span>
      </div>
    </>
  );
}
