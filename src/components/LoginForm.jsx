import React, { useState } from "react";
export default function LoginForm() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) setErr("Please enter both fields.");
    // Connect to Firebase Auth here
  };
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      {err && <div className="form-error">{err}</div>}
      <input placeholder="📧 Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="🔑 Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn-main">Sign In</button>
      <div className="switch-link">New user? <a href="/signup">Sign up</a></div>
    </form>
  );
}
