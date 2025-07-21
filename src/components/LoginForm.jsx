import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch {
      setErr("❌ Incorrect email or password.");
    }
    setLoading(false);
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        className="login-input"
        placeholder="📧 Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
      />
      <input
        type="password"
        className="login-input"
        placeholder="🔑 Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {err && <div className="form-error">{err}</div>}
      <button className="login-btn-green" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div className="login-links" style={{marginTop:12,textAlign:"center"}}>
        <span>Don’t have an account? <a href="/signup">Sign up</a></span>
        <span> · <a href="/forgot" className="forgot-link">Forgot password?</a></span>
      </div>
    </form>
  );
}
