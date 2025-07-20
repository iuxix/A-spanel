import React from "react";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <div className="auth-bg">
      <Navbar />
      <div className="auth-container">
        <div style={{marginBottom: 18}}>
          <h1 className="login-title" style={{fontSize: '1.7em'}}>Welcome to fastsmmpanel</h1>
          <div className="lp-desc" style={{fontSize:'1.09em'}}>
            India's #1 trusted SMM panel.<br/>
            <b>Fast orders, instant support, real analytics, and wallet system.</b><br/>
            Get started—100% secured, pro-level UI, every service under one roof!
          </div>
        </div>
        <LoginForm />
        <div style={{marginTop: 30, color: "#79c3f9", textAlign:"center"}}>
          <b>Why choose us?</b>
          <ul style={{margin:"7px 0 0 12px",padding:"0",fontSize:"1em",color:"#2087f7"}}>
            <li>⚡ Lightning-fast order processing &amp; full refund guarantee</li>
            <li>💸 Lowest base price (just ₹100 to start!)</li>
            <li>🛡️ Wallet safety &amp; real admin support, 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
