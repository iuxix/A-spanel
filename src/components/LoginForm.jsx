import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setErr("❌ Wrong credentials or network error.");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="login-title">Sign in to Your Account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="📧 Email"
          className="login-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔑 Password"
          className="login-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {err && <div className="form-error">{err}</div>}
        <button className="login-btn-green" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="login-links">
        <span>Do not have an account? <a href="/signup" className="signup-link">Sign up</a></span>
        <a href="/forgot" className="forgot-link">Forgot Password?</a>
      </div>
    </>
  );
}
