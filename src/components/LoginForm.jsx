import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

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
    } catch (e) {
      setErr("❌ Incorrect email or password.");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="login-title" style={{ fontSize: "1.3em", textAlign: "center" }}>
        Sign In to <span style={{ color: "#07b9ef" }}>fastsmmpanel</span> <span role="img" aria-label="lock">🔒</span>
      </div>
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="email"
          className="login-input"
          placeholder="📧 Email"
          value={email}
          autoFocus
          onChange={e => setEmail(e.target.value)}
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="login-links" style={{ marginTop: 16, textAlign: "center" }}>
        <span>
          Don’t have an account? <a href="/signup">Sign up</a>
        </span>
        <span> · <a href="/forgot" className="forgot-link">Forgot password?</a></span>
      </div>
    </div>
  );
}
