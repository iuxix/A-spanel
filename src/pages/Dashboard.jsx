import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, doc, query, where, deleteDoc, serverTimestamp
} from "firebase/firestore";
import {
  FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV, FaCogs,
  FaUserCircle, FaHistory, FaWhatsapp, FaMoon, FaSun, FaPowerOff
} from "react-icons/fa";

const categories = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" }
];
const services = {
  "new-ig": [
    { id: "1572", title: "Instagram Reels Views [NoN~Drop | 10M/Day]", badge: "1572", badgeColor: "#0cb2ed", desc: "Start: Instant\nSpeed: 10M/Day", avgtime: "3 hours", min: 100, max: 1000000, price: 0.13 }
  ],
  "ig-followers-new": [
    { id: "10571", title: "Instagram Followers Old Accounts | 365 Days Refill", badge: "10571", badgeColor: "#619bf1", desc: "Quality: Old Accounts\nRefill: 365 Days", avgtime: "5 hours", min: 100, max: 1000000, price: 121.5 },
    { id: "10572", title: "Instagram Followers Old Accounts | Lifetime Refill", badge: "10572", badgeColor: "#619bf1", desc: "Quality: Old Accounts\nRefill: Lifetime", avgtime: "7 hours", min: 100, max: 1000000, price: 121.5 }
  ],
  "telegram": [
    { id: "3011", title: "Telegram Post Views Auto", badge: "TG", badgeColor: "#15b6f1", desc: "Instant, non drop", avgtime: "1 hour", min: 100, max: 4000000, price: 0.02 }
  ]
};

const primaryColor = "#1b365d";
const secondaryColor = "#2474df";
const accentColor = "#36c2ff";
const menuBg = "#f3f8fb";
const menuBgDark = "#1a355d";
const menuTextColor = "#193357";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [cat, setCat] = useState(categories[0].value);
  const [svc, setSvc] = useState(null);
  const [qty, setQty] = useState("");
  const [charge, setCharge] = useState("0.00");
  const [link, setLink] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingFundsSubmit, setLoadingFundsSubmit] = useState(false);

  // Sync user, balance, orders, payments (fund requests), history
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, usr => {
      setUser(usr);
      if (usr) {
        // Get wallet balance
        onSnapshot(doc(db, "users", usr.uid), snap => {
          setBalance(snap.exists() && snap.data().balance ? snap.data().balance : 0);
        });
        // Listen to orders
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap => {
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
        });
        // Listen to payments (fund requests by this user)
        onSnapshot(query(collection(db, "payments"), where("user", "==", usr.uid)), snap => {
          setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.created?.toMillis?.() - a.created?.toMillis?.()));
        });
        // Listen to user history (actions log)
        onSnapshot(query(collection(db, "userHistory"), where("user", "==", usr.uid)), snap => {
          setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
        });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!svc || !qty) {
      setCharge("0.00");
      return;
    }
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < (svc.min || 1) || q > svc.max) setCharge("0.00");
    else setCharge(((svc.price * q) / 1000).toFixed(2));
  }, [svc, qty]);

  const filteredServices = (services[cat] || []).filter(s =>
    search.length < 2 || s.title.toLowerCase().includes(search.toLowerCase())
  );

  async function submitOrder(e) {
    e.preventDefault();
    setOrderMsg("");
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill every field.");
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setOrderMsg(`❌ Quantity must be between ${svc.min} and ${svc.max}.`);
    if (parseFloat(charge) > parseFloat(balance)) return setOrderMsg("❌ Insufficient balance. Please add funds.");
    if (!user) return setOrderMsg("❌ Please log in to place order.");
    try {
      await addDoc(collection(db, "orders"), {
        user: user.uid,
        service_id: svc.id,
        link,
        qty: q,
        charge: parseFloat(charge),
        timestamp: Date.now(),
        status: "pending",
        cat,
        serviceTitle: svc.title
      });
      // Log to userHistory
      await addDoc(collection(db, "userHistory"), {
        user: user.uid,
        type: "order",
        description: `Placed order for ${svc.title} (Qty: ${q})`,
        timestamp: Date.now()
      });
      setOrderMsg("✅ Order placed successfully! Track under My Orders.");
      setSvc(null);
      setLink("");
      setQty("");
      setCharge("0.00");
    } catch (err) {
      setOrderMsg("❌ Failed to place order. Please try again.");
    }
  }

  async function handleProfileSave(newName, newMail, newPass, setInfoMsg) {
    try {
      if (newName) await updateProfile(getAuth().currentUser, { displayName: newName });
      if (newMail) await getAuth().currentUser.updateEmail(newMail);
      if (newPass) await getAuth().currentUser.updatePassword(newPass);
      // Log profile change to userHistory
      await addDoc(collection(db, "userHistory"), {
        user: user.uid,
        type: "profile",
        description: "Updated profile info",
        timestamp: Date.now()
      });
      setInfoMsg("✅ Profile updated successfully!");
    } catch (err) {
      setInfoMsg("❌ " + err.message);
    }
  }

  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  // Submit Add Funds request 
  async function handleAddFundsSubmit(amount, setMsg, resetInput) {
    setMsg("");
    if (!amount || Number(amount) < 30) return setMsg("❌ Enter at least ₹30.");
    setLoadingFundsSubmit(true);
    try {
      // Save payment request to "payments"
      await addDoc(collection(db, "payments"), {
        user: user.uid,
        username: user.displayName || user.email || "Unknown",
        amount: Number(amount),
        status: "pending",
        created: serverTimestamp()
      });
      // Log payment request to userHistory
      await addDoc(collection(db, "userHistory"), {
        user: user.uid,
        type: "payment_request",
        description: `Requested fund ₹${amount}`,
        timestamp: Date.now()
      });
      setMsg("✅ Fund request sent! Await admin approval.");
      resetInput();
    } catch {
      setMsg("❌ Submission failed. Please try again.");
    }
    setLoadingFundsSubmit(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: 70,
      background: theme === "dark" ? primaryColor : "#f9fbfe",
      color: theme === "dark" ? "#f5faff" : "#22334c",
      fontFamily: "Poppins, sans-serif",
      position: "relative"
    }}>
      {/* NAVBAR */}
      <nav style={{
        background: theme === "dark" ? secondaryColor : "#fff",
        borderBottom: `2px solid ${accentColor}`,
        boxShadow: "0 1px 12px #1a255a0c",
        padding: "16px 0"
      }}>
        <div style={{
          maxWidth: 650,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            color: accentColor,
            fontWeight: 900,
            fontSize: "1.45em",
            display: "flex",
            alignItems: "center",
            gap: 14
          }}>
            <img src="/logo.png" alt="Logo" style={{ height: 38, borderRadius: 22 }} />
            LucixFire Panel
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              title="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                color: theme === "dark" ? "#ffd700" : "#2474df",
                fontSize: "1.3em",
                background: "none",
                border: "none",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <img src="/logo.png" alt="User Avatar" style={{ height: 32, width: 32, borderRadius: "50%" }} />
            <div style={{ position: "relative" }}>
              <button
                aria-label="Menu"
                title="Menu"
                onClick={() => setShowMenu(m => !m)}
                style={{
                  background: theme === "dark" ? menuBgDark : menuBg,
                  border: "1px solid #aecbeb",
                  color: theme === "dark" ? "#fff" : menuTextColor,
                  fontSize: "1.6em",
                  padding: "6px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                  outline: showMenu ? `2px solid ${accentColor}` : "none",
                  userSelect: "none"
                }}
              >
                <FaEllipsisV />
              </button>
              {showMenu && (
                <div
                  style={{
                    background: theme === "dark" ? menuBgDark : menuBg,
                    borderRadius: 16,
                    position: "absolute",
                    top: 40,
                    right: 0,
                    zIndex: 20,
                    minWidth: 190,
                    boxShadow: "0 6px 26px #2474df23",
                  }}
                >
                  <DropdownItem theme={theme} icon={<FaUserCircle />} label="Profile" onClick={() => { setShowProfile(true); setShowMenu(false); }} />
                  <DropdownItem theme={theme} icon={<FaWallet />} label="Add Funds" onClick={() => { setShowFunds(true); setShowMenu(false); }} />
                  <DropdownItem theme={theme} icon={<FaHistory />} label="My Orders" onClick={() => { setShowHistory(true); setShowMenu(false); }} />
                  <DropdownItem theme={theme} icon={<FaHistory />} label="History" onClick={() => { setShowMenu(false); setShowHistory(true); }} />
                  <DropdownItem theme={theme} icon={<FaCogs />} label="Settings" onClick={() => { setShowSettings(true); setShowMenu(false); }} />
                  <DropdownItem theme={theme} icon={<FaPowerOff />} color="#d32f3e" label="Logout" onClick={handleLogout} />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <section style={{
        maxWidth: 1080,
        margin: "28px auto 22px",
        display: "flex",
        gap: 18,
        overflowX: "auto",
        padding: "0 15px"
      }}>
        <StatCard theme={theme} icon={<FaUser />} label="Username" value={user?.displayName || user?.email || "Guest"} />
        <StatCard theme={theme} icon={<FaWallet />} label="Balance" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard theme={theme} icon={<FaChartLine />} label="Total Orders" value={orders.length} />
        <StatCard theme={theme} icon={<FaMoneyCheckAlt />} label="Spent Balance" value={`₹0.00`} />
      </section>

      {/* Short Banner */}
      <section style={{
        maxWidth: 720,
        margin: "0 auto 32px",
        padding: "0 14px",
        textAlign: "center",
        fontWeight: 600,
        fontSize: "1.09em",
        color: secondaryColor,
        userSelect: "none"
      }}>
        🌟 LucixFire Panel: Manage your SMM boosts effortlessly — fast, easy, reliable! 🚀✨
      </section>

      {/* Main Order Form */}
      <form
        onSubmit={submitOrder}
        style={{
          maxWidth: 460,
          margin: "0 auto 28px",
          background: theme === "dark" ? "#183971" : "#f5f8fb",
          borderRadius: 20,
          padding: "25px 16px",
          boxShadow: theme === "dark" ? "0 7px 24px #29499335" : "0 4px 18px #19417c13",
          color: theme === "dark" ? "#e8f5ff" : primaryColor,
          userSelect: "none"
        }}
        noValidate
      >
        <div style={{ display: "flex", gap: 14, marginBottom: 15 }}>
          <button type="button" style={tabBtn(true, theme)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false, theme)} onClick={() => setShowFunds(true)}>💵 Add Funds</button>
        </div>
        <input
          type="search"
          placeholder="Search Services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={searchInput(theme)}
          autoComplete="off"
        />
        <label style={smallLbl}>Category</label>
        <select
          value={cat}
          onChange={e => { setCat(e.target.value); setSvc(null); setQty(""); setLink(""); }}
          style={selectBox(theme)}
        >
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <label style={smallLbl}>Services</label>
        <select
          value={svc?.id || ""}
          onChange={e => {
            const found = (services[cat] || []).find(x => x.id === e.target.value);
            setSvc(found || null);
            setCharge("0.00");
            setQty("");
            setLink("");
          }}
          style={selectBox(theme)}
        >
          <option value="">Select Service</option>
          {filteredServices.map(s => (
            <option key={s.id} value={s.id}>
              {s.badge ? `[${s.badge}] ` : ""}{s.title}
            </option>
          ))}
        </select>
        {svc && (
          <>
            <div style={descCard(theme)}>
              <b style={{ color: accentColor, fontSize: ".98em" }}>
                {svc.badge && (<span style={{
                  background: svc.badgeColor,
                  borderRadius: 7,
                  color: "#fff",
                  padding: "2px 9px",
                  marginRight: 8,
                  fontWeight: 700
                }}>{svc.badge}</span>)}
                {svc.title}
              </b>
              <pre style={{ marginTop: 7, color: "#7abef5", fontSize: ".95em", whiteSpace: "pre-wrap" }}>{svc.desc}</pre>
            </div>
            <div style={descCard(theme)}>
              <b>Average Time</b><br />{svc.avgtime}
            </div>
            <div style={{ marginBottom: 7, fontWeight: 700, fontSize: ".97em", color: "#6e9ba5" }}>
              Min: {svc.min} - Max: {svc.max}
            </div>
          </>
        )}
        <label style={smallLbl}>Link</label>
        <input
          type="url"
          placeholder="Paste link"
          value={link}
          onChange={e => setLink(e.target.value)}
          style={inputBox(theme)}
          disabled={!svc}
          required={!!svc}
        />
        <label style={smallLbl}>Quantity</label>
        <input
          type="number"
          min={svc?.min || ""}
          max={svc?.max || ""}
          value={qty}
          onChange={e => setQty(e.target.value.replace(/^0+/, ""))}
          style={inputBox(theme)}
          disabled={!svc}
          required={!!svc}
        />
        <div style={descCard(theme)}>
          <b>Charge</b><br />₹{charge}
        </div>
        {orderMsg && (
          <div style={{
            fontWeight: 700,
            marginTop: 14,
            textAlign: "center",
            color: orderMsg.startsWith("✅") ? "#3ad97b" : "#f65d5d"
          }}>
            {orderMsg}
          </div>
        )}
        <button
          type="submit"
          disabled={!svc || !qty || !link || charge === "0.00"}
          style={{
            marginTop: 17,
            width: "100%",
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
            color: "#fff",
            fontWeight: 900,
            fontSize: "1.12em",
            padding: "14px 0",
            borderRadius: 15,
            border: "none",
            cursor: (!svc || !qty || !link || charge === "0.00") ? "not-allowed" : "pointer",
            userSelect: "none"
          }}
        >
          <FaWhatsapp style={{ fontSize: "1.21em" }} /> Place Order
        </button>
      </form>

      {/* Modals */}
      {showFunds && <AddFundsModal user={user} theme={theme} onClose={() => setShowFunds(false)} loading={loadingFundsSubmit} onSubmit={handleAddFundsSubmit} />}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showHistory && <HistoryModal orders={orders} payments={payments} history={history} onClose={() => setShowHistory(false)} />}
      {showSettings && <SettingsModal user={user} onSave={handleProfileSave} onClose={() => setShowSettings(false)} />}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "16px 0 6px",
        fontSize: "0.98em",
        color: "#7baad3",
        borderTop: `1px solid ${accentColor}`,
        background: "transparent",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 80,
        userSelect: "none"
      }}>
        © {new Date().getFullYear()} LucixFire Panel. All rights reserved.
      </footer>
    </div>
  );
}

function AddFundsModal({ user, theme, onClose, loading, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  function resetInput() {
    setAmount("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    await onSubmit(amount, setMsg, resetInput);
  }

  return (
    <Modal title="Add Funds" onClose={onClose}>
      <div style={{
        fontWeight: 700,
        color: "#18c332",
        marginBottom: 8,
        textAlign: "center",
        backgroundColor: "#e8fff3",
        borderRadius: 8,
        padding: "9px",
        userSelect: "none"
      }}>
        🎁 Deposit above <b>₹100</b> gets you instant <b>10% bonus</b>!
      </div>
      <div style={{
        fontWeight: 600,
        color: "#228edc",
        textAlign: "center",
        marginBottom: 8,
        userSelect: "none"
      }}>UPI: <span style={{ color: "#2884f6", fontWeight: 900 }}>boraxdealer@fam</span></div>
      <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{ width: 140, borderRadius: 13, display: "block", margin: "12px auto 14px", background: "#fff" }} />
      <ol style={{ color: "#5993b2", marginBottom: 10, paddingLeft: 17, fontSize: "0.91em", userSelect: "none" }}>
        <li>Pay with above UPI or QR code.</li>
        <li>Submit the paid amount (min ₹30).</li>
        <li>Admin accepts or rejects your request soon.</li>
      </ol>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min={30}
          placeholder="Enter Amount (₹30+)"
          style={{
            width: "100%",
            padding: "13px 10px",
            marginBottom: 11,
            borderRadius: 8,
            border: "1.3px solid #c2eafc",
            fontWeight: 700,
            userSelect: "text"
          }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
          disabled={loading}
          required
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 0",
            margin: "6px 0 2px",
            borderRadius: 8,
            fontWeight: 900,
            border: "none",
            background: loading ? "#badfff" : "linear-gradient(90deg,#34b992,#1e78e8)",
            color: "#fff",
            fontSize: "1.09em",
            cursor: loading ? "progress" : "pointer",
            userSelect: "none"
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {msg && (
          <div style={{
            marginTop: 10,
            fontWeight: 700,
            textAlign: "center",
            color: msg.startsWith("✅") ? "#1fb963" : "#e75d74"
          }}>
            {msg}
          </div>
        )}
      </form>
    </Modal>
  );
}

function HistoryModal({ orders, payments, history, onClose }) {
  return (
    <Modal title="History" onClose={onClose}>
      <section style={{ marginBottom: 18 }}>
        <h4>Orders</h4>
        {orders.length === 0 ? <p style={{ color: "#999", fontStyle: "italic" }}>No orders yet.</p> :
          orders.map(o => (
            <div key={o.id} style={historyItemStyle}>
              <b>{o.serviceTitle || o.service_id}</b> - Qty: {o.qty} - ₹{o.charge.toFixed(2)} - Status: <span style={{ fontWeight: "bold", color: statusColor(o.status) }}>{o.status}</span>
            </div>
          ))
        }
      </section>
      <section style={{ marginBottom: 18 }}>
        <h4>Fund Requests</h4>
        {payments.length === 0 ? <p style={{ color: "#999", fontStyle: "italic" }}>No fund requests.</p> :
          payments.map(p => (
            <div key={p.id} style={historyItemStyle}>
              Requested: ₹{p.amount.toFixed(2)} - Status: <span style={{ fontWeight: "bold", color: statusColor(p.status) }}>{p.status}</span>
            </div>
          ))
        }
      </section>
      <section>
        <h4>Other Actions</h4>
        {history.length === 0 ? <p style={{ color: "#999", fontStyle: "italic" }}>No history yet.</p> :
          history.filter(h => h.type !== "order" && h.type !== "payment_request").map(h => (
            <div key={h.id} style={historyItemStyle}>
              {h.description} <small style={{ color: "#555" }}>({new Date(h.timestamp).toLocaleString()})</small>
            </div>
          ))
        }
      </section>
    </Modal>
  );
}

// Helper for status colors in history
function statusColor(status) {
  if(!status) return "#666";
  if(status === "pending") return "#f0ad4e";
  if(status === "completed" || status === "accepted") return "#43a047";
  if(status === "rejected") return "#d32f2f";
  return "#333";
}

const historyItemStyle = {
  padding: "8px 12px",
  backgroundColor: "#e8f0f9",
  borderRadius: 10,
  marginBottom: 8,
  fontSize: "0.95em",
  color: "#1a3a6f"
};

function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" onClose={onClose}>
      <div style={{ textAlign: "center", padding: 14 }}>
        <img src="/logo.png" alt="User Avatar" style={{ height: 62, width: 62, borderRadius: 19, marginBottom: 10 }} />
        <div style={{ fontWeight: 800, fontSize: "1.1em", color: secondaryColor }}>
          {user?.displayName || user?.email || "Guest"}
        </div>
        <div style={{ color: accentColor, fontWeight: 600 }}>LuciXFire User</div>
      </div>
    </Modal>
  );
}

function SettingsModal({ user, onSave, onClose }) {
  const [name, setName] = useState(user?.displayName || "");
  const [mail, setMail] = useState(user?.email || "");
  const [pass, setPass] = useState("");
  const [info, setInfo] = useState("");

  return (
    <Modal title="Settings" onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(name, mail, pass, setInfo); }}>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontWeight: 700 }}>Username</label>
          <input style={inputBox("light")} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 13 }}>
          <label style={{ fontWeight: 700 }}>Email</label>
          <input style={inputBox("light")} value={mail} onChange={e => setMail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 700 }}>Password</label>
          <input style={inputBox("light")} type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button style={{
          width: "100%",
          padding: "14px 0",
          fontWeight: 900,
          borderRadius: 14,
          border: "none",
          background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
          color: "#fff",
          fontSize: "1.13em",
          cursor: "pointer"
        }}>Change Info</button>
        {info && <div style={{ marginTop: 12, fontWeight: 700, color: info.startsWith("✅") ? "#2e7d32" : "#d32f2f" }}>{info}</div>}
      </form>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 160,
      background: "rgba(32,50,74,0.18)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, width: 370, maxWidth: "97vw", maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 10px 36px #24deff45", padding: "29px 16px 17px", position: "relative"
      }}>
        <button type="button" onClick={onClose} style={{
          position: "absolute", right: 17, top: 9, border: "none", fontSize: "2em", background: "none", color: "#217dbb", cursor: "pointer"
        }}>&times;</button>
        <div style={{ fontWeight: 900, fontSize: "1.12em", marginBottom: 13, color: "#237ecb" }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, theme }) {
  return (
    <div style={{
      flex: "0 0 170px",
      background: theme === "dark" ? "#21406c" : "#e8f3fa",
      borderRadius: 13,
      minWidth: 150,
      boxShadow: "0 2px 8px #1786ed13",
      padding: "18px 13px",
      color: theme === "dark" ? "#e9faff" : secondaryColor,
      userSelect: "none"
    }}>
      <span style={{
        background: theme === "dark" ? "#24436c" : "#d7f1ff",
        borderRadius: 7,
        padding: "7px 10px",
        fontSize: "1.2em",
        marginBottom: 7,
        display: "inline-block",
        color: accentColor
      }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: ".99em", display: "block" }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: "1.13em", marginTop: 4, display: "block" }}>{value}</span>
    </div>
  );
}

function DropdownItem({ theme, icon, label, onClick, color }) {
  return (
    <div
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter") onClick(); }}
      style={{
        padding: "13px 21px",
        display: "flex",
        alignItems: "center",
        gap: 11,
        cursor: "pointer",
        color: color || (theme === "dark" ? "#fff" : secondaryColor),
        fontWeight: 700,
        fontSize: "1.04em",
        userSelect: "none",
        transition: "background 0.19s, color 0.19s",
        outline: "none"
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = theme === "dark" ? "#183671" : "#e5f6fe"}
      onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      {icon} {label}
    </div>
  );
}

const tabBtn = (active, theme) => ({
  flex: 1,
  background: active ? accentColor : "transparent",
  color: active ? primaryColor : accentColor,
  border: active ? "none" : `2px solid ${accentColor}`,
  padding: "13px 0",
  borderRadius: 12,
  fontWeight: 900,
  fontSize: "1.13em",
  cursor: "default",
  boxShadow: active ? `0 2px 10px #36e4fd85` : "none"
});
const selectBox = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "12px 11px",
  fontWeight: 700,
  background: theme === "dark" ? "#21345f" : "#f9fcfe",
  fontSize: "1.01em",
  color: theme === "dark" ? "#f2ffff" : secondaryColor,
  border: `1.5px solid ${accentColor}`,
  marginBottom: 9
});
const inputBox = theme => ({
  width: "100%",
  borderRadius: 9,
  padding: "13px 10px",
  fontWeight: 700,
  fontSize: "1.01em",
  background: theme === "dark" ? "#254676" : "#f8fafb",
  color: theme === "dark" ? "#f7fff7" : "#222",
  border: "1.5px solid #b5ebfa",
  marginBottom: 9
});
const smallLbl = { fontWeight: 700, color: accentColor, marginBottom: 6, display: "block", fontSize: "1em" };
const descCard = theme => ({
  background: theme === "dark" ? "#285090" : "#e6f5fd",
  color: theme === "dark" ? "#d5f0ff" : secondaryColor,
  borderRadius: 11, padding: "10px 10px", fontWeight: 600, fontSize: ".98em", marginBottom: 7
});
const searchInput = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "13px 11px",
  fontWeight: 700,
  fontSize: "1.03em",
  color: accentColor,
  background: theme === "dark" ? "#232e4b" : "#e3f1fa",
  border: `1.5px solid ${accentColor}`,
  marginBottom: 13
});
