import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../firebase"; // Make sure you already have /src/firebase.js as described earlier

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !password) {
      setError("🚫 Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth(app);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      setError("❌ " + (err.message || "Signup failed"));
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="login-title">Sign up for LuciXFire Panel</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="👤 Full Name"
          className="login-input"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="📧 Email"
          className="login-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="🔑 Password"
          className="login-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="form-error">{error}</div>}
        {success && <div style={{ color: "#20c997", margin: "12px 0", fontWeight: 600 }}>🎉 Registration successful!</div>}
        <button className="login-btn-green" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
      <div className="login-links">
        <span>
          Already have an account?
          <a href="/login" className="signup-link"> Sign in</a>
        </span>
      </div>
    </>
  );
}
