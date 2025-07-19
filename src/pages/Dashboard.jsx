import React, { useState } from "react";
import StatsCards from "../components/StatsCards";
import ServiceIcons from "../components/ServiceIcons";
import OrderForm from "../components/OrderForm";
import AddFunds from "../components/AddFunds";
import { FaEllipsisV, FaUserCircle, FaWallet, FaCog } from "react-icons/fa";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFunds, setShowFunds] = useState(false);

  function toggleMenu() { setMenuOpen(!menuOpen); }
  function handleAddFunds() {
    setMenuOpen(false); setShowFunds(true);
  }
  function handleCloseFunds() { setShowFunds(false); }

  return (
    <div className="dashboard-bg">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <h1>Welcome to your SMM Dashboard <span role="img" aria-label="wave">👋</span></h1>
        <div style={{ position: "relative" }}>
          <button className="menu-btn" onClick={toggleMenu}>
            <FaEllipsisV size={25} color="#aaa" />
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <div onClick={()=>alert("Profile not yet implemented")}><FaUserCircle /> Profile</div>
              <div onClick={handleAddFunds}><FaWallet /> Add Funds</div>
              <div onClick={()=>alert("Settings coming soon!")}><FaCog /> Settings</div>
            </div>
          )}
        </div>
      </div>
      <StatsCards />
      <ServiceIcons />
      <OrderForm />
      {showFunds && <AddFunds onClose={handleCloseFunds} />}
    </div>
  );
}
