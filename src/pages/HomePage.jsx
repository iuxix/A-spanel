import React from "react";
import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div className="lp-main">
      <div className="lp-content">
        <div className="lp-title">Grow Faster with <span style={{color:'#0da4e1'}}>fastsmmpanel</span> 🚀</div>
        <div className="lp-desc">
          The #1 SMM panel.<br/>
          Real followers, fast views, full analytics, secure wallet, instant orders.<br/>
          <b style={{color:'#18a850'}}>Start now. Make your growth unstoppable!</b>
        </div>
        <div className="lp-btns">
          <Link to="/login" className="lp-btn signin">Sign In</Link>
          <Link to="/signup" className="lp-btn signup">Sign Up</Link>
          <Link to="/admin" className="lp-btn admin">Admin</Link>
        </div>
      </div>
      <div className="lp-imgbox">
        <img src="/logo.png" className="lp-img" alt="Panel Logo" />
      </div>
    </div>
  );
}
