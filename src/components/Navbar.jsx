import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="brand">LuciXFire Panel</span>
      <div className="nav-links">
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}
