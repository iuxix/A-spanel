import React, { useState } from "react";
import { FaUserCircle, FaEllipsisV, FaWallet, FaHistory, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

// Dummy OrderSection (replace with your real OrderSection component as needed)
function OrderSection() {
  const [selected, setSelected] = useState(null);
  const services = [
    { id: "IG01", title: "Instagram Reels Views 🚀", desc: "Fast, no-drop, refill", avgtime: "3h", min: 100, max: 1000000, price: 0.12 },
    { id: "IG02", title: "Instagram Followers 🌟", desc: "High quality, instant", avgtime: "2h", min: 50, max: 50000, price: 1.23 },
    { id: "YT01", title: "YouTube Likes 👍", desc: "Organic, top quality", avgtime: "1h", min: 20, max: 20000, price: 0.34 },
    { id: "TG01", title: "Telegram Members 🚀", desc: "Real, fast join", avgtime: "2h", min: 100, max: 50000, price: 1.01 },
    { id: "TW01", title: "Twitter Followers ⚡", desc: "Stable, no drop", avgtime: "4h", min: 50, max: 25000, price: 1.08 },
    { id: "SP01", title: "Spotify Plays 🎼", desc: "Global, refill, fast", avgtime: "30m", min: 200, max: 100000, price: 0.67 }
  ];
  const [qty, setQty] = useState(""); const [link, setLink] = useState(""); const [msg, setMsg] = useState("");
  function handleOrder(e) {
    e.preventDefault();
    if (!selected || !qty || !link) return setMsg("❌ Please fill all fields.");
    if (parseInt(qty) < selected.min || parseInt(qty) > selected.max)
      return setMsg(`❌ Min ${selected.min} - Max ${selected.max}`);
    setMsg(`✅ Order placed for ${qty} ${selected.title}!`);
    setQty(""); setLink("");
  }
  return (
    <div style={{
      margin: "35px auto", maxWidth: 520, background: "#fff", borderRadius: 23,
      boxShadow: "0 2px 21px #21f4e213", padding: 24, border: "1.3px solid #e0f2fe"
    }}>
      <h3 style={{ fontWeight: 900, fontSize: "1.18em", marginBottom: 14, color: "#144b3d" }}>Place New Order</h3>
      <div>
        <label style={{ fontWeight: 700, marginBottom: 7, display: "block" }}>Select Service</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          {services.map((s) => (
            <button key={s.id}
              onClick={() => { setSelected(s); setMsg(""); }}
              style={{
                padding: "11px 17px", borderRadius: 8, border: "none", cursor: "pointer",
                fontWeight: 600, background: selected && selected.id === s.id ? "linear-gradient(93deg,#1eea8e,#3ac7f3)" : "#f7f7fa",
                color: selected && selected.id === s.id ? "#fff" : "#19423e", boxShadow: "0 1px 5px #1ae7d015"
              }}>{s.title}</button>
          ))}
        </div>
      </div>
      {selected && (
        <form onSubmit={handleOrder} style={{ marginTop: 3 }}>
          <div style={{ fontWeight: 700, color: "#19869c" }}>Description: <span style={{ fontWeight: 400 }}>{selected.desc}</span></div>
          <div style={{ display: "flex", gap: 13, margin: "14px 0" }}>
            <span style={{ fontSize: ".95em" }}>⏰ {selected.avgtime} avg</span>
            <span style={{ fontSize: ".95em" }}>Min: {selected.min} - Max: {selected.max}</span>
            <span style={{ fontSize: ".95em" }}>₹{selected.price} per 1K</span>
          </div>
          <input type="text" placeholder="Paste Link" style={inputStyle} value={link} onChange={e => setLink(e.target.value)} />
          <input type="number" placeholder="Quantity" style={inputStyle} value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} />
          <div style={{ fontWeight: 600, marginBottom: 7, marginTop: 4 }}>
            Charge: <span style={{ color: "#1db37e" }}>₹{qty && selected.price ? ((selected.price * qty) / 1000).toFixed(2) : "0.00"}</span>
          </div>
          {msg && <div style={{ color: msg.startsWith("✅") ? "#1bc375" : "#ea344a", fontWeight: 700, marginBottom: 8 }}>{msg}</div>}
          <button type="submit" style={orderBtn}>Place Order 🚀</button>
        </form>
      )}
    </div>
  );
}
const inputStyle = {
  width: "100%", margin: "6px 0",
  padding: "13px 12px", borderRadius: 10, border: "1.3px solid #e6f7ff", fontSize: "1.08em"
};
const orderBtn = {
  background: "linear-gradient(90deg,#24fa92,#fce161 97%)", color: "#144b3d",
  borderRadius: 11, fontWeight: 800, fontSize: "1.13em", padding: "14px 0", marginTop: 8, border: "none", width: "100%"
};

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [settings, setSettings] = useState(false);
  const [history, setHistory] = useState(false);
  const [funds, setFunds] = useState(false);

  function showMenu(panel) {
    setMenuOpen(false);
    setProfile(false); setSettings(false); setHistory(false); setFunds(false);
    if (panel === "profile") setProfile(true);
    if (panel === "settings") setSettings(true);
    if (panel === "history") setHistory(true);
    if (panel === "funds") setFunds(true);
    if (panel === "logout") window.location.href = "/login";
  }

  return (
    <div style={{ background: "#f7fcfb", minHeight: "100vh", padding: "0 0 90px" }}>
      {/* Custom Navbar */}
      <div style={{
        background: "#fff", padding: "19px 7vw 17px 7vw",
        fontWeight: 900, fontSize: "1.17em", color: "#15e98e",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1.1px solid #e8f8ff", boxShadow: "0 2px 15px #00edff12"
      }}>
        <span style={{ fontWeight: 900, fontSize: "1.12em", letterSpacing: ".5px" }}>LuciXFire Panel</span>
        <div style={{ position: "relative" }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: 6
          }} title="Menu" onClick={() => setMenuOpen(o => !o)}>
            <FaEllipsisV size={28} color="#1ab288" />
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", right: 0, top: 34, zIndex: 10, minWidth: 180,
              background: "#fff", borderRadius: 14, boxShadow: "0 7px 33px #11e7e022", fontSize: "1.09em", fontWeight: 500
            }}>
              <div style={menuItem} onClick={() => showMenu("profile")}><FaUserCircle /> Profile</div>
              <div style={menuItem} onClick={() => showMenu("funds")}><FaWallet /> Add Funds</div>
              <div style={menuItem} onClick={() => showMenu("history")}><FaHistory /> History</div>
              <div style={menuItem} onClick={() => showMenu("settings")}><FaCog /> Settings</div>
              <div style={{ borderTop: "1px solid #eee", margin: "6px 0" }} />
              <div style={{ ...menuItem, color: "#f44b5b", fontWeight: 700 }} onClick={() => showMenu("logout")}>Logout</div>
            </div>
          )}
        </div>
      </div>

      {/* Main content: Order Section */}
      <OrderSection />

      {/* Modals (render as needed; dummy placeholders here) */}
      {profile && <Modal title="Profile" onClose={() => setProfile(false)}><div>Your user details here.</div></Modal>}
      {settings && <Modal title="Settings" onClose={() => setSettings(false)}><div>Settings coming soon.</div></Modal>}
      {history && <Modal title="History" onClose={() => setHistory(false)}><div>Your orders and funds will display here.</div></Modal>}
      {funds && <Modal title="Add Funds" onClose={() => setFunds(false)}><div>Deposit via UPI, upload payment slip, see live admin status.</div></Modal>}
    </div>
  );
}

// Generic Modal component for all dashboard panels
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "#21ffe024", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", padding: "34px 28px 24px 28px", borderRadius: 17,
        minWidth: 330, maxWidth: "92vw", boxShadow: "0 10px 40px #29e7e818", position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", right: 17, top: 14, background: "none", border: "none", fontSize: "2.11em", color: "#ff33af", cursor: "pointer"
          }}
        >&times;</button>
        <h2 style={{fontWeight:900,marginBottom:13,marginTop:0,fontSize:"1.19em", letterSpacing:"-1.1px", color:"#17aa68"}}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const menuItem = {
  padding: "13px 23px 13px 19px",
  display: "flex", alignItems: "center", gap: 10,
  cursor: "pointer",
  border: "none", outline: "none", background: "none"
};
