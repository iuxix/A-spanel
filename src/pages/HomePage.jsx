import React from "react";
import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div className="lp-main">
      <div className="lp-content">
        <div className="lp-title">Grow Your Socials with <span style={{color:'#1da4ed'}}>fastsmmpanel</span> 🚀</div>
        <div className="lp-desc">India’s #1 SMM panel: get <b>guaranteed real growth</b> for Instagram, YouTube, Telegram, and all platforms. Pro wallet, API orders, and live tracking.</div>
        <ul className="lp-feature-list">
          <li>🔥 Lightning-fast delivery (10M/day!)</li>
          <li>🛡️ 100% refill guarantee, instant tracking</li>
          <li>📈 Pro dashboard — stats, bonus offers, order history</li>
          <li>💬 24/7 WhatsApp support</li>
        </ul>
        <div className="lp-btns">
          <Link to="/login" className="lp-btn signin">Sign In</Link>
          <Link to="/signup" className="lp-btn signup">Sign Up</Link>
          <Link to="/admin" className="lp-btn admin">Admin</Link>
        </div>
      </div>
      <div className="lp-imgbox">
        <img src="/logo.png" className="lp-img" alt="SMM Panel Logo"/>
      </div>
    </div>
  );
}
