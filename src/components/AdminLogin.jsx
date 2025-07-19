import React, { useState } from "react";
export default function AdminLogin({ onSuccess }) {
  const [user, setUser] = useState(""), [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const handleLogin = e => {
    e.preventDefault();
    if(user === "DebaxLucixFire" && pass === "Jaan") onSuccess();
    else setErr("❌ Invalid admin credentials.");
  };
  return (
    <form className="admin-login-form" onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      {err && <div className="form-error">{err}</div>}
      <input placeholder="Username" value={user} onChange={e=>setUser(e.target.value)} />
      <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
      <button className="btn-main" type="submit">Login</button>
    </form>
  );
}
