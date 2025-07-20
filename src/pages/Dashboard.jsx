import React, { useState } from "react";
import Navbar from "../components/Navbar";
import OrderSection from "../components/OrderSection";
import { FaUserCircle, FaCog, FaWallet, FaHistory, FaEllipsisV } from "react-icons/fa";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
import HistoryModal from "../components/HistoryModal";
import AddFundsModal from "../components/AddFundsModal";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [settings, setSettings] = useState(false);
  const [history, setHistory] = useState(false);
  const [funds, setFunds] = useState(false);

  function show(n) {
    setMenuOpen(false);
    setProfile(false); setSettings(false); setHistory(false); setFunds(false);
    if(n==="profile") setProfile(true);
    if(n==="settings") setSettings(true);
    if(n==="history") setHistory(true);
    if(n==="funds") setFunds(true);
    if(n==="logout") window.location.href="/login";
  }

  return (
    <div className="dashboard-bg">
      <Navbar />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:500,margin:"24px auto 0 auto",position:"relative"}}>
        <h1 style={{fontSize:"1.35em"}}>My SMM Dashboard <span role="img" aria-label="panel">🌐</span></h1>
        <div style={{position:"relative"}}>
          <button className="menu-btn" onClick={()=>setMenuOpen(o=>!o)}><FaEllipsisV size={25} color="#aaa" /></button>
          {menuOpen && (
            <div className="menu-dropdown">
              <div onClick={()=>show("profile")}><FaUserCircle/> Profile</div>
              <div onClick={()=>show("funds")}><FaWallet/> Add Funds</div>
              <div onClick={()=>show("history")}><FaHistory/> History</div>
              <div onClick={()=>show("settings")}><FaCog/> Settings</div>
              <div className="separator"/>
              <div onClick={()=>show("logout")}>Logout</div>
            </div>
          )}
        </div>
      </div>
      <OrderSection />
      {profile && <ProfileModal onClose={()=>setProfile(false)} />}
      {settings && <SettingsModal onClose={()=>setSettings(false)} />}
      {history && <HistoryModal onClose={()=>setHistory(false)} />}
      {funds && <AddFundsModal onClose={()=>setFunds(false)} />}
    </div>
  );
}
