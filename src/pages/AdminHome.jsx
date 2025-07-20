import React, { useState } from "react";
import AdminPanel from "../components/AdminPanel";
import Navbar from "../components/Navbar";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (user === "jaan" && pass === "jaan") {
      setLoggedIn(true);
      setErr("");
    } else {
      setErr("❌ Wrong admin credentials");
    }
  }

  if (loggedIn) return (
    <div className="dashboard-bg">
      <Navbar />
      <AdminPanel />
    </div>
  );

  return (
    <div className="auth-bg">
      <Navbar />
      <div className="auth-container">
        <div className="login-title" style={{textAlign:"center"}}>Admin Login <span style={{color:"#FA5B5B"}}>⚙️</span></div>
        <form className="login-form" onSubmit={handleLogin} autoComplete="off">
          <input type="text" className="login-input" placeholder="👤 Admin Username" value={user} onChange={e=>setUser(e.target.value)} />
          <input type="password" className="login-input" placeholder="🔑 Password" value={pass} onChange={e=>setPass(e.target.value)} />
          {err && <div className="form-error">{err}</div>}
          <button type="submit" className="login-btn-green">Log In</button>
        </form>
      </div>
    </div>
  );
}
