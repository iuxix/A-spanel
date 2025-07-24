import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, doc, query, where
} from "firebase/firestore";
import {
  FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV,
  FaCogs, FaUserCircle, FaHistory, FaWhatsapp, FaMoon, FaSun, FaPowerOff
} from "react-icons/fa";

// Categories & Services
const categories = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" }
];
const services = {
  "new-ig": [
    { id: "1572", title: "Instagram Reels Views [ NoN~Drop | Emergency Working Update | 10M/Day | Lifetime ]", badge: "1572", badgeColor: "#0cb2ed", desc: "Start: Instant\nSpeed: 10M/Day\nDrop: No\nREFILL: Lifetime", avgtime: "3 hours", min: 100, max: 1000000, price: 0.13 }
  ],
  "ig-followers-new": [
    { id: "10571", title: "Instagram Followers Old Accounts With Posts | Max 1M | 365 Days Refill", badge: "10571", badgeColor: "#619bf1", desc: "Quality: Old Accounts\nRefill: 365 Days Refill ♻️", avgtime: "5 hours", min: 100, max: 1000000, price: 121.5 },
    { id: "10572", title: "Instagram Followers Old Accounts With Posts | Max 1M | Lifetime Refill", badge: "10572", badgeColor: "#619bf1", desc: "Quality: Old Accounts\nRefill: Lifetime Refill ♻️", avgtime: "7 hours", min: 100, max: 1000000, price: 121.5 }
  ],
  "telegram": [
    { id: "3011", title: "Telegram Post Views Auto", badge: "TG", badgeColor: "#15b6f1", desc: "Instant delivery, non drop", avgtime: "1 hour", min: 100, max: 4000000, price: 0.02 }
  ]
};

// Theme colors
const primaryColor = "#1b365d"; // Deep Blue Dark
const secondaryColor = "#2b539f"; // Soft Blue
const accentColor = "#54c7ec"; // Light Cyan

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
  const [funds, setFunds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, usr => {
      setUser(usr);
      if (usr) {
        onSnapshot(doc(db, "users", usr.uid), d => {
          setBalance(d.exists() && d.data().balance ? d.data().balance : 0);
        });
        onSnapshot(query(collection(db, "deposits"), where("user", "==", usr.uid)), snap =>
          setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.created?.toMillis?.() - a.created?.toMillis?.()))
        );
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap =>
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.timestamp - a.timestamp))
        );
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
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill in all fields.");
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setOrderMsg(`❌ Min: ${svc.min} - Max: ${svc.max}`);
    if (parseFloat(charge) > parseFloat(balance)) return setOrderMsg("❌ Not enough balance.");
    if (!user) return setOrderMsg("❌ Login to order.");
    await addDoc(collection(db, "orders"), {
      user: user.uid, service_id: svc.id, link, qty: q, charge: parseFloat(charge),
      timestamp: Date.now(), status: "pending", cat, serviceTitle: svc.title
    });
    setOrderMsg("✅ Order placed. Track it in History/Orders.");
    setSvc(null); setLink(""); setQty(""); setCharge("0.00");
  }

  async function handleProfileSave(newName, newMail, newPass, setInfoMsg) {
    try {
      if (newName) await updateProfile(getAuth().currentUser, { displayName: newName });
      if (newMail) await getAuth().currentUser.updateEmail(newMail);
      if (newPass) await getAuth().currentUser.updatePassword(newPass);
      setInfoMsg("✅ Profile updated.");
    } catch (err) {
      setInfoMsg("❌ " + err.message);
    }
  }

  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme === "dark" ? primaryColor : "#faf9f9",
      color: theme === "dark" ? "#eee" : "#222",
      fontFamily: "Poppins, sans-serif",
      transition: "background 0.4s ease, color 0.4s ease"
    }}>
      {/* NAVBAR */}
      <nav style={{
        background: theme === "dark" ? secondaryColor : "#fff",
        borderBottom: `2px solid ${accentColor}`,
        padding: "14px 0",
        boxShadow: "0 2px 8px rgba(43,83,159,0.15)"
      }}>
        <div style={{
          maxWidth: 540,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            fontWeight: 900,
            fontSize: "1.4em",
            letterSpacing: 1,
            color: accentColor,
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <img src="/logo.png" alt="Logo" style={{ height: 36, borderRadius: "50%", backgroundColor: "transparent" }} />
            LucixFire Panel
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <button
              title="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme === "dark" ? "#ffd95a" : "#145eeb",
                fontSize: "1.3em",
                padding: 6
              }}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <img src="/logo.png" alt="User Avatar" style={{ height: 34, width: 34, borderRadius: "50%" }} />
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowMenu(m => !m)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.3em",
                  color: theme === "dark" ? "#72e1f8" : "#0c4199",
                  padding: "5px 12px",
                  borderRadius: 15,
                  cursor: "pointer",
                  outline: showMenu ? `2px solid ${accentColor}` : "none"
                }}
                aria-label="Menu"
              >
                <FaEllipsisV />
              </button>
              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: 36,
                    right: 0,
                    background: theme === "dark" ? "#1f2f59" : "#f8faff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    borderRadius: 12,
                    minWidth: 160,
                    zIndex: 20
                  }}
                  role="menu"
                >
                  <DropdownItem icon={<FaUserCircle />} label="Profile" onClick={() => { setShowProfile(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaWallet />} label="Add Funds" onClick={() => { setShowFunds(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaHistory />} label="My Orders" onClick={() => { setShowHistory(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaCogs />} label="Settings" onClick={() => { setShowSettings(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaPowerOff />} color="#d33854" label="Logout" onClick={handleLogout} />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <section style={{
        display: "flex",
        gap: 16,
        maxWidth: 1080,
        margin: "24px auto 18px",
        paddingBottom: 7,
        overflowX: "auto"
      }}>
        <StatCard theme={theme} icon={<FaUser />} label="Username" value={user?.displayName || user?.email || "Guest"} />
        <StatCard theme={theme} icon={<FaWallet />} label="Balance" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard theme={theme} icon={<FaChartLine />} label="Total Orders" value={orders.length} />
        <StatCard theme={theme} icon={<FaMoneyCheckAlt />} label="Spent Balance" value={`₹0.00`} />
      </section>

      {/* Banner */}
      <section style={{
        maxWidth: 700,
        margin: "0 auto 28px",
        padding: "0 12px",
        textAlign: "center",
        fontSize: "1.14em",
        fontWeight: 600,
        color: theme === "dark" ? "#aad4f8" : "#2f4a70",
        lineHeight: 1.48
      }}>
        Empower your digital footprint with <strong>LuciXFire Panel</strong> — your secure, comprehensive Social Media Marketing platform designed for instant service delivery, seamless payment options, and holistic management of every campaign. Benefit from scalable services, trusted by professionals daily, powered by fast support and a highly polished user experience.
      </section>

      {/* Order form */}
      <form
        onSubmit={submitOrder}
        style={{
          maxWidth: 520,
          margin: "0 auto 48px",
          background: theme === "dark" ? "#21345f" : "#fefefe",
          borderRadius: 18,
          padding: "24px 18px",
          boxShadow: theme === "dark" ? "0 8px 24px rgba(33,52,95,0.35)" : "0 6px 20px rgba(45,61,97,0.1)"
        }}
        noValidate
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <button type="button" style={tabBtn(true, theme)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false, theme)} onClick={() => setShowFunds(true)}>💵 Add Funds</button>
        </div>

        <input
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
            const found = (services[cat] || []).find(s => s.id === e.target.value);
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
              {s.badge ? `[${s.badge}] ` : ""}
              {s.title}
            </option>
          ))}
        </select>

        {svc && (
          <>
            <div style={descCard(theme)}>
              <strong style={{ color: accentColor, fontSize: "1em" }}>
                {svc.badge && (
                  <span style={{
                    background: svc.badgeColor,
                    borderRadius: 8,
                    color: "#fff",
                    padding: "4px 10px",
                    marginRight: 8,
                    fontWeight: 700,
                    fontSize: ".9em",
                    userSelect: "none"
                  }}>
                    {svc.badge}
                  </span>
                )}
                {svc.title}
              </strong>
              <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "#7bb3d7", fontSize: "0.95em" }}>{svc.desc}</pre>
            </div>
            <div style={descCard(theme)}>
              <b>Average Time</b><br />{svc.avgtime}
            </div>
            <div style={{ marginBottom: 8, fontWeight: 700, fontSize: ".95em", color: "#80a8ce" }}>
              Min: {svc.min} - Max: {svc.max}
            </div>
          </>
        )}

        <label style={smallLbl}>Link</label>
        <input
          placeholder="Paste link"
          value={link}
          onChange={e => setLink(e.target.value)}
          style={inputBox(theme)}
          disabled={!svc}
          autoComplete="off"
        />

        <label style={smallLbl}>Quantity</label>
        <input
          placeholder="Quantity"
          type="number"
          min={svc?.min || ""}
          max={svc?.max || ""}
          value={qty}
          onChange={e => setQty(e.target.value.replace(/^0+/, ""))}
          style={inputBox(theme)}
          disabled={!svc}
          autoComplete="off"
        />

        <div style={descCard(theme)}>
          <b>Charge</b><br />₹{charge}
        </div>

        {orderMsg && (
          <div style={{ color: orderMsg.startsWith("✅") ? "#4bd964" : "#f25656", fontWeight: 700, marginTop: 12, textAlign: "center" }}>
            {orderMsg}
          </div>
        )}

        <button
          type="submit"
          style={{
            marginTop: 16,
            width: "100%",
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
            color: "#fff",
            fontWeight: 900,
            fontSize: "1.15em",
            padding: "14px 0",
            border: "none",
            borderRadius: 13,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            userSelect: "none",
            transition: "background-color 0.25s ease"
          }}
          disabled={!svc || !qty || !link || charge === "0.00"}
        >
          <FaWhatsapp style={{ fontSize: "1.25em" }} /> Place Order
        </button>
      </form>

      {/* MODALS */}
      {showFunds && <AddFundsModal user={user} theme={theme} onClose={() => setShowFunds(false)} />}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showHistory && <HistoryModal orders={orders} onClose={() => setShowHistory(false)} />}
      {showSettings && <SettingsModal user={user} onSave={handleProfileSave} onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// AddFundsModal with fixed loading and no URL upload (admin notified by username & amount)
function AddFundsModal({ user, theme, onClose }) {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!amount || Number(amount) < 30) return setMsg("❌ Enter at least ₹30.");
    setLoading(true);
    try {
      await addDoc(collection(db, "deposits"), {
        user: user.uid,
        username: user.displayName || user.email || "Unknown",
        amount: Number(amount),
        status: "pending",
        created: new Date()
      });
      setMsg("✅ Fund request sent! Await admin confirmation.");
      setAmount("");
    } catch (err) {
      setMsg("❌ Submission failed, try again.");
    }
    setLoading(false);
  }

  return (
    <Modal title="Add Funds" onClose={onClose}>
      <div style={{
        fontWeight: 700,
        color: "#1976d2",
        marginBottom: 10,
        textAlign: "center",
        fontSize: "1.05em",
        backgroundColor: "#e3f2fd",
        padding: "10px 14px",
        borderRadius: 8
      }}>
        🎁 <span style={{ color: "#0d47a1" }}>Special Offer:</span> Deposit over <b>₹100</b> to get an instant 10% bonus credit!
      </div>

      <p style={{ color: theme === "dark" ? "#aad4f8" : "#244578", marginBottom: 12, fontSize: "0.95em" }}>
        Please transfer your desired amount via UPI to <b>boraxdealer@fam</b>. After payment, submit your deposit request here.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="number"
          min={30}
          placeholder="Enter Amount (₹30+)"
          style={{
            width: "100%",
            borderRadius: 8,
            padding: "14px 12px",
            border: "1.5px solid #90caf9",
            fontWeight: 700,
            fontSize: "1em",
            marginBottom: 16,
            color: "#222"
          }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
          disabled={loading}
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 0",
            fontWeight: 900,
            borderRadius: 10,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            background: loading ? "#90caf9" : "linear-gradient(90deg, #42a5f5, #1e88e5)",
            color: "#fff",
            fontSize: "1.10em",
            userSelect: "none",
            transition: "background-color 0.3s ease"
          }}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {msg && (
          <div style={{
            marginTop: 14,
            fontWeight: 700,
            textAlign: "center",
            color: msg.startsWith("✅") ? "#43a047" : "#d32f2f",
            userSelect: "none"
          }}>
            {msg}
          </div>
        )}
      </form>
    </Modal>
  );
}

function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" onClose={onClose}>
      <div style={{ textAlign: "center", padding: 20 }}>
        <img src="/logo.png" alt="" style={{ height: 68, width: 68, borderRadius: 20, background: "transparent", marginBottom: 12 }} />
        <div style={{ fontWeight: 700, fontSize: "1.2em", marginBottom: 5 }}>
          {user?.displayName || user?.email || "Guest"}
        </div>
        <div style={{ color: "#4f7ecb", fontWeight: 600 }}>LuciXFire User</div>
      </div>
    </Modal>
  );
}

// HistoryModal renamed as My Orders - shows all user orders in styled boxes
function HistoryModal({ orders, onClose }) {
  return (
    <Modal title="My Orders" onClose={onClose}>
      {orders.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic", textAlign: "center", marginTop: 24 }}>
          You have not placed any orders yet.
        </p>
      ) : (
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 6 }}>
          {orders.map(order => (
            <div key={order.id} style={{
              border: "2px solid #54c7ec",
              borderRadius: 14,
              padding: 14,
              marginBottom: 14,
              backgroundColor: "#e9f5fb",
              color: "#154a72",
              fontSize: "0.95em",
              boxShadow: "0 4px 10px rgba(54,123,174,0.1)",
              userSelect: "none"
            }}>
              <div><b>Order ID:</b> {order.id}</div>
              <div><b>Service:</b> {order.serviceTitle || order.service_id}</div>
              <div><b>Quantity:</b> {order.qty}</div>
              <div><b>Link:</b> <a href={order.link} target="_blank" rel="noreferrer" style={{ color: accentColor }}>{order.link}</a></div>
              <div><b>Price:</b> ₹{order.charge.toFixed(2)}</div>
              <div><b>Status:</b> <span style={{ color: order.status === "pending" ? "#f0ad4e" : order.status === "completed" ? "#43a047" : "#d32f2f" }}>{order.status}</span></div>
            </div>
          ))}
        </div>
      )}
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
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 700 }}>Username</label>
          <input style={inputBox("light")} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 700 }}>Email</label>
          <input style={inputBox("light")} value={mail} onChange={e => setMail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 700 }}>Password</label>
          <input style={inputBox("light")} type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button style={{
          width: "100%", padding: "13px 0", fontWeight: 900, borderRadius: 10, border: "none",
          background: `linear-gradient(90deg, #54c7ec, #2b539f)`,
          color: "#fff",
          fontSize: "1.1em",
          cursor: "pointer",
          userSelect: "none"
        }}
        >Change Info</button>
        {info && <div style={{ marginTop: 10, fontWeight: 700, color: info.startsWith("✅") ? "#388e3c" : "#d32f2f" }}>{info}</div>}
      </form>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(27, 54, 93, 0.20)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 150
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        maxWidth: "96vw",
        width: 360,
        maxHeight: "85vh",
        overflowY: "auto",
        padding: 24,
        boxShadow: "0 14px 32px rgba(27, 54, 93, 0.3)",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            border: "none",
            background: "none",
            fontSize: 26,
            color: primaryColor,
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          &times;
        </button>
        <h3 style={{ color: primaryColor, fontWeight: 900, marginBottom: 18 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, theme }) {
  return (
    <div style={{
      flex: "0 0 170px",
      background: theme === "dark" ? "#293f6c" : "#e5f0fc",
      borderRadius: 14,
      minWidth: 160,
      boxShadow: "0 4px 14px rgba(21, 71, 134, 0.1)",
      padding: "21px 16px",
      userSelect: "none",
      color: theme === "dark" ? "#cfddef" : "#1a2a47"
    }}>
      <span style={{
        background: theme === "dark" ? "#1f2f59" : "#cde1ff",
        borderRadius: 8,
        padding: "9px 12px",
        fontSize: "1.28em",
        marginBottom: 9,
        display: "inline-block",
        color: accentColor
      }}>{icon}</span>
      <div style={{ fontWeight: 700, fontSize: "1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: "1.24em" }}>{value}</div>
    </div>
  );
}

function DropdownItem({ icon, label, onClick, color }) {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter") onClick(); }}
      style={{
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        color: color || primaryColor,
        fontWeight: 700,
        fontSize: "0.98em",
        userSelect: "none",
        transition: "background-color 0.2s ease",
        outline: "none"
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = "#d3e6ff"}
      onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      {icon} {label}
    </div>
  );
}

const tabBtn = (active, theme) => ({
  flex: 1,
  background: active ? accentColor : "transparent",
  color: active ? "#0c1f44" : accentColor,
  border: active ? "none" : `2px solid ${accentColor}`,
  padding: "12px 0",
  borderRadius: 10,
  fontWeight: 900,
  fontSize: "1.14em",
  letterSpacing: 0.4,
  boxShadow: active ? "0 1px 10px rgba(84, 199, 236, 0.7)" : "none",
  cursor: "default",
  userSelect: "none"
});

const selectBox = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "14px 12px",
  fontWeight: 700,
  background: theme === "dark" ? "#21345f" : "#fdfdff",
  fontSize: "1em",
  color: primaryColor,
  border: `1.5px solid ${accentColor}`,
  marginBottom: 12,
  userSelect: "none",
  outline: "none",
  transition: "border-color 0.3s"
});

const inputBox = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "14px 12px",
  fontWeight: 700,
  fontSize: "1em",
  background: theme === "dark" ? "#2b4a8d" : "#fefefe",
  color: primaryColor,
  border: `1.5px solid ${accentColor}`,
  marginBottom: 12,
  userSelect: "none",
  outline: "none",
  transition: "border-color 0.3s"
});

const smallLbl = {
  fontWeight: 700,
  color: accentColor,
  marginBottom: 6,
  display: "block",
  fontSize: "1em",
  userSelect: "none"
};

const descCard = theme => ({
  background: theme === "dark" ? "#2c3e75" : "#e7f0fc",
  color: theme === "dark" ? accentColor : "#1b365d",
  borderRadius: 12,
  padding: "14px 14px",
  fontWeight: 600,
  fontSize: "0.95em",
  marginBottom: 11,
  whiteSpace: "pre-wrap",
  userSelect: "text"
});

const searchInput = theme => ({
  width: "100%",
  borderRadius: 10,
  padding: "14px 12px",
  fontWeight: 700,
  fontSize: "1.02em",
  color: accentColor,
  background: theme === "dark" ? "#21345f" : "#f9faff",
  border: `1.5px solid ${accentColor}`,
  marginBottom: 16,
  outline: "none"
});
