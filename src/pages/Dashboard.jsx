import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";
import {
  FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV,
  FaCogs, FaUserCircle, FaPlus, FaHistory, FaWhatsapp, FaMoon, FaSun
} from "react-icons/fa";

// ---- Categories/Services Example ----
const categories = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" }
];
const services = {
  "new-ig": [
    {
      id: "1572",
      title: "Instagram Reels Views [ NoN~Drop | Emergency Working Update | 10M/Day | Lifetime ]",
      badge: "1572", badgeColor: "#0cb2ed",
      desc: "Start: Instant\nSpeed: 10M/Day\nDrop: No\nREFILL: Lifetime",
      avgtime: "3 hours", min: 100, max: 1000000, price: 0.13
    }
  ],
  "ig-followers-new": [
    {
      id: "10571",
      title: "Instagram Followers Old Accounts | Max 1M | 365 Days Refill",
      badge: "10571", badgeColor: "#619bf1",
      desc: "Quality: Old Accounts\nRefill: 365 Days Refill ♻️",
      avgtime: "5 hours", min: 100, max: 1000000, price: 121.5
    },
    {
      id: "10572",
      title: "Instagram Followers Old Accounts | Max 1M | Lifetime Refill",
      badge: "10572", badgeColor: "#619bf1",
      desc: "Quality: Old Accounts\nRefill: Lifetime Refill ♻️",
      avgtime: "7 hours", min: 100, max: 1000000, price: 121.5
    }
  ],
  "telegram": [
    {
      id: "3011",
      title: "Telegram Post Views Auto",
      badge: "TG", badgeColor: "#15b6f1",
      desc: "Instant delivery, non drop",
      avgtime: "1 hour", min: 100, max: 4000000, price: 0.02
    }
  ]
};
// --- END DATA DEMO ---

function classAn({ dark, light }, theme) {
  return theme === "dark" ? dark : light;
}
const SMM_PANEL = "LucixFire Panel";

export default function Dashboard() {
  // Auth integration & real user
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.00);
  const [theme, setTheme] = useState("light");
  const [cat, setCat] = useState(categories[0].value);
  const [svc, setSvc] = useState(null);
  const [qty, setQty] = useState("");
  const [charge, setCharge] = useState("0.00");
  const [link, setLink] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [funds, setFunds] = useState([]);
  const [orders, setOrders] = useState([]);
  // History/Settings/Profile state
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, usr => {
      setUser(usr);
      if (usr) {
        // Sync balance
        onSnapshot(doc(db, "users", usr.uid), d =>
          setBalance(d.exists() && d.data().balance ? d.data().balance : 0)
        );
        // User funds
        onSnapshot(query(collection(db, "deposits"), where("user", "==", usr.uid)), snap =>
          setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.created?.toMillis?.() - a.created?.toMillis?.()))
        );
        // Order history
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap =>
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.timestamp - a.timestamp))
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!svc || !qty) setCharge("0.00");
    else {
      let q = parseInt(qty, 10);
      if (isNaN(q) || q < (svc.min || 1) || q > svc.max) setCharge("0.00");
      else setCharge(((svc.price * q) / 1000).toFixed(2));
    }
  }, [svc, qty]);

  async function submitOrder(e) {
    e.preventDefault();
    setOrderMsg("");
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill all fields.");
    let q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setOrderMsg(`❌ Min: ${svc.min} - Max: ${svc.max}`);
    if (parseFloat(charge) > parseFloat(balance)) return setOrderMsg("❌ Insufficient balance.");
    if (!user) return setOrderMsg("❌ Login to order.");
    // Add order to Firestore
    await addDoc(collection(db, "orders"), {
      user: user.uid, service_id: svc.id, link, qty: q, charge: parseFloat(charge),
      timestamp: Date.now(), status: "pending", cat, serviceTitle: svc.title
    });
    await updateDoc(doc(db, "users", user.uid), { balance: balance - parseFloat(charge) });
    setOrderMsg("✅ Order placed! Track it in your history.");
    setSvc(null); setLink(""); setQty(""); setCharge("0.00");
  }

  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  // --- Professional text and banner
  const accent = theme === "light" ? "#1472fa" : "#18e896";
  const statsRef = useRef(null);

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"} style={{
      minHeight: "100vh", background: classAn({ dark: "#171d33", light: "#f8fafd" }, theme), color: classAn({ dark: "#fafcff", light: "#181A2E" }, theme)
    }}>
      {/* HEADER */}
      <nav style={{
        background: classAn({ dark: "#161c33", light: "#fff" }, theme),
        padding: "17px 0 10px",
        borderBottom: classAn({ dark: "2px solid #1a3664", light: "2px solid #eaeaea" }, theme),
        boxShadow: "0 2px 13px #1e325a11"
      }}>
        <div style={{
          maxWidth: 500, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ fontWeight: 900, fontSize: "1.3em", color: accent, letterSpacing: ".6px" }}>
            <img src="/logo.png" alt="" style={{ height: 36, borderRadius: 10, marginRight: 10, background: "#fff" }} />
            {SMM_PANEL}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{
              background: "none", border: "none", borderRadius: 19, padding: "7px 12px", fontSize: "1.17em", cursor: "pointer"
            }} aria-label="Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <FaSun color="#ffe144" /> : <FaMoon color="#415e90" />}
            </button>
            <img src="/logo.png" alt="pfp" style={{ height: 33, width: 33, borderRadius: "50%", background: "#fff" }} />
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMenu((x) => !x)} aria-label="Menu" style={{ background: "none", border: "none", color: "#11ecfd", fontSize: "1.3em", marginLeft: 11, cursor: "pointer" }}><FaEllipsisV /></button>
              {showMenu &&
                <div style={{
                  position: "absolute", right: 0, top: 35, zIndex: 101,
                  minWidth: 149, background: classAn({ dark: "#222c4a", light: "#fff" }, theme),
                  borderRadius: 13, boxShadow: "0 7px 22px #38bebe19", fontSize: "1.08em", padding: "6px 0"
                }}>
                  <DropdownItem icon={<FaUserCircle />} label="Profile" onClick={() => setShowProfile(true)} />
                  <DropdownItem icon={<FaWallet />} label="Add Funds" onClick={() => setShowFunds(true)} />
                  <DropdownItem icon={<FaHistory />} label="History" onClick={() => setShowHistory(true)} />
                  <DropdownItem icon={<FaCogs />} label="Settings" onClick={() => setShowSettings(true)} />
                  <DropdownItem icon={<FaUser />} label="Logout" onClick={handleLogout} color="#ef1b51" />
                </div>
              }
            </div>
          </div>
        </div>
      </nav>
      <div style={{
        textAlign: "center", margin: "18px 0 12px 0",
        color: accent, fontWeight: 800, fontSize: "1.15em"
      }}>
        🚀 Welcome to <span style={{ color: theme === "light" ? "#172d6f" : "#5fffbe" }}>LuciXFire Panel</span> — Fast, Secure, and Smart SMM Platform.  
        <div style={{color:"#787e98", fontWeight:600, marginTop:5}}>Manage your orders, funds, and services—all tracked and refillable with one tap.</div>
      </div>
      {/* Stats Row, Apps */}
      <div ref={statsRef} style={{
        display: "flex", gap: "14px", overflowX: "auto", maxWidth: 1100, margin: "0 auto 13px", paddingBottom: 8
      }}>
        {[
          { icon: <FaUser />, label: "Username", value: user?.displayName || user?.email || "Not logged in", color: "#51c6fa" },
          { icon: <FaWallet />, label: "Balance", value: `₹${balance.toFixed(2)} INR`, color: "#11e28a" },
          { icon: <FaChartLine />, label: "Total Orders", value: orders.length, color: "#56a2ff" },
          { icon: <FaMoneyCheckAlt />, label: "Spent Balance", value: "₹0.00", color: "#f9b76f" },
        ].map((st, i) =>
          <div key={st.label}
            style={{
              flex: "0 0 180px", background: classAn({ dark: "#232a45", light: "#f8fbff" }, theme), borderRadius: 13,
              minWidth: 158, boxShadow: "0 2px 10px #29b7ff13", padding: "17px 13px"
            }}>
            <span style={{
              background: classAn({ dark: "#243766", light: "#e3f3ff" }, theme),
              borderRadius: 6, padding: "7px 10px", fontSize: "1.2em", color: st.color, marginBottom: 9
            }}>{st.icon}</span>
            <span style={{ fontWeight: 700, color: "#2179a3", fontSize: ".98em", marginBottom: 0, display: "block" }}>{st.label}</span>
            <span style={{ fontWeight: 800, fontSize: "1.13em", color: st.color, marginTop: 4, display: "block" }}>{st.value}</span>
          </div>
        )}
      </div>
      {/* Tabs */}
      <form style={{
        background: classAn({ dark: "#1b2243", light: "#fff" }, theme), borderRadius: 17, maxWidth: 550,
        padding: "19px 14px 17px", margin: "0 auto", boxShadow: "0 7px 21px #afe9ff20"
      }} onSubmit={submitOrder}>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <button type="button" style={tabBtn(true, theme)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false, theme)} onClick={() => setShowFunds(true)}>💵 AddFunds</button>
        </div>
        {/* Category dropdown */}
        <div>
          <label style={smallLbl}>Category</label>
          <select style={selectBox(theme)} value={cat} onChange={e => { setCat(e.target.value); setSvc(null); setQty(""); setLink(""); setCharge("0.00"); }}>
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {/* Service dropdown */}
        <div style={{ marginTop: 8 }}>
          <label style={smallLbl}>Service</label>
          <select style={selectBox(theme)} value={svc?.id || ""} onChange={e => {
            const found = (services[cat] || []).find(x => x.id === e.target.value);
            setSvc(found || null); setCharge("0.00"); setQty(""); setLink("");
          }}>
            <option value="">Select Service</option>
            {(services[cat] || []).map(s =>
              <option key={s.id} value={s.id}>{s.badge && `[${s.badge}] `}{s.title}</option>
            )}
          </select>
        </div>
        {svc && (
          <>
            <div style={descCard(theme)}>
              <b style={{ color: accent, fontSize: ".97em" }}>
                {svc.badge && <span style={{
                  background: svc.badgeColor, borderRadius: 7, color: "#fff", padding: "2px 7px", marginRight: 7
                }}>{svc.badge}</span>}
                {svc.title}
              </b>
              <div style={{ margin: "10px 0 0" }}><pre style={{
                fontFamily: "inherit", margin: 0, color: "#609eb6", fontSize: ".96em"
              }}>{svc.desc}</pre></div>
            </div>
            <div style={descCard(theme)}><b>Average Time</b><br />{svc.avgtime}</div>
            <div style={{ marginBottom: 7, color: "#6e9ba5", fontWeight: 700, fontSize: ".97em" }}>
              Min: {svc.min} - Max: {svc.max}
            </div>
          </>
        )}
        {/* Order inputs */}
        <label style={smallLbl}>Link</label>
        <input style={inputBox(theme)} placeholder="Paste link" value={link} onChange={e => setLink(e.target.value)} disabled={!svc} />
        <label style={smallLbl}>Quantity</label>
        <input style={inputBox(theme)} placeholder="Quantity" type="number" min={svc?.min || ""} max={svc?.max || ""} value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} disabled={!svc} />
        <div style={descCard(theme)}><b>Charge</b><br />₹{charge}</div>
        {orderMsg && (<div style={{ color: orderMsg[0] === "✅" ? "#2edc5c" : "#ef5767", fontWeight: 700, margin: "11px 0" }}>{orderMsg}</div>)}
        <button style={{
          marginTop: 13, width: "100%", background: "linear-gradient(90deg,#54c6f8,#46f29b 100%)",
          color: "#fff", fontWeight: 900, border: "none", borderRadius: 13, padding: "15px 0",
          fontSize: "1.13em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: ".2s box-shadow"
        }} type="submit" className="hvr-bounce-to-right" >
          <FaWhatsapp style={{ fontSize: "1.22em" }} /> Place Order
        </button>
      </form>
      {/* AddFunds Modal */}
      {showFunds &&
        <AddFundsModal user={user} theme={theme} onClose={() => setShowFunds(false)} />
      }
      {/* Modals (Profile/History/Settings) */}
      {showProfile && <InfoModal title="Profile" onClose={() => setShowProfile(false)}>
        <div style={{ textAlign: "center", padding: 8 }}>
          <img src="/logo.png" alt="" style={{ height: 61, width: 61, borderRadius: 20, background: "#f7fffa", margin: "0 auto 11px" }} /><br />
          <b style={{ fontWeight: 900 }}>{user?.displayName || user?.email}</b>
          <div style={{ color: "#1272f4", marginTop: 7 }}>LucixFire Panel User</div>
        </div>
      </InfoModal>}
      {showSettings && <InfoModal title="Settings" onClose={() => setShowSettings(false)}>
        <div>
          <b>Theme:</b>
          <button className="settings-toggle-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          {/* Add more user setting controls here */}
        </div>
      </InfoModal>}
      {showHistory && <InfoModal title="History" onClose={() => setShowHistory(false)}>
        <b>Orders:</b>
        <ul style={{ paddingLeft: 20 }}>
          {orders.slice(0, 10).map(o => <li key={o.id}>{o.serviceTitle} ({o.qty}) - {o.status}</li>)}
        </ul>
        <b>Funds:</b>
        <ul style={{ paddingLeft: 20 }}>
          {funds.slice(0, 10).map(f => <li key={f.id}>₹{f.amount} - {f.status}</li>)}
        </ul>
      </InfoModal>}
    </div>
  );
}


function AddFundsModal({ user, theme, onClose }) {
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [msg, setMsg] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) < 100) return setMsg("❌ Please enter at least ₹100.");
    if (!proof) return setMsg("❌ Attach payment screenshot proof.");
    try {
      await addDoc(collection(db, "deposits"), {
        user: user.uid,
        amount: Number(amount),
        proof: proof.name,
        status: "pending",
        created: new Date()
      });
      setMsg("✅ Fund request sent! When admin accepts your proof, balance will update.");
      setAmount(""); setProof(null);
    } catch {
      setMsg("❌ Submission failed, try again.");
    }
  }
  return (
    <InfoModal title="Add Funds" onClose={onClose}>
      <div style={{ fontWeight: 600, color: theme === "dark" ? "#40f19f" : "#227a5c", marginBottom: 7 }}>UPI: <span style={{ fontWeight: 900 }}>boraxdealer@fam</span></div>
      <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{
        width: 145, borderRadius: 13, margin: "12px auto 17px", display: "block", background: "#fff"
      }}/>
      <ol style={{color:"#68a1b6",fontSize:".98em",marginLeft:6,marginBottom:7}}>
        <li>Open your UPI/Bank app and pay to the UPI ID above or scan QR.</li>
        <li>After successful payment, take a clear screenshot of your payment receipt.</li>
        <li>Upload the screenshot below and enter the exact paid amount.</li>
        <li>Your balance will update after admin accepts your payment proof.</li>
      </ol>
      <form onSubmit={handleSubmit}>
        <input type="number" min={100} placeholder="Enter Amount (₹100+)" style={{
          width: "100%", borderRadius: 8, padding: "13px 11px", border: "1.3px solid #b1daea", margin: "6px 0 11px", color: "#444", fontWeight: 700
        }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
        />
        <input type="file" accept="image/*" style={{
          width: "100%", marginBottom: 13
        }} onChange={e => setProof(e.target.files[0])} />
        <button
          style={{
            width: "100%", borderRadius: 7, background: "linear-gradient(90deg,#ffc62f,#1cec86 100%)",
            color: "#131d33", fontWeight: 900, fontSize: "1.14em", padding: "13px 0", border: "none", marginBottom: 6
          }}
          type="submit"
        >Submit</button>
        {msg && <div style={{ marginTop: 8, color: msg[0] === "✅" ? "#2ada70" : "#e84f7b", fontWeight: 700, textAlign: "center" }}>{msg}</div>}
      </form>
    </InfoModal>
  );
}

function InfoModal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 221,
      background: "rgba(16,32,60,0.16)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, minWidth: 320, maxWidth: "93vw", color: "#192a3d",
        boxShadow: "0 12px 48px #24affc39", padding: "28px 16px 16px", position: "relative"
      }}>
        <button type="button" onClick={onClose} style={{
          position: "absolute", right: 12, top: 9, border: "none",
          fontSize: "2.0em", background: "none", color: "#48e8a2", cursor: "pointer"
        }}>&times;</button>
        <div style={{ fontWeight: 900, fontSize: "1.14em", marginBottom: 5, color: "#146496" }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function DropdownItem({ icon, label, onClick, color }) {
  return (
    <div onClick={onClick}
      style={{
        padding: "10px 18px", display: "flex", alignItems: "center", gap: 8,
        cursor: "pointer", border: "none", outline: "none", background: "none", color: color || "#184c69"
      }}>
      {icon} {label}
    </div>
  );
}
const tabBtn = (on, theme) => ({
  flex: 1,
  background: on ? "linear-gradient(90deg,#43b8f8,#9cf8ba 100%)" : "none",
  color: on ? "#192a3d" : "#888",
  border: on ? "none" : "2px solid #e1eafc",
  borderRadius: 7,
  padding: "12px 0",
  fontWeight: 800,
  fontSize: "1.09em",
  marginRight: 7,
  boxShadow: on ? "0 1px 6px #29efd239" : "none",
  transition: ".17s all"
});
const selectBox = (theme) => ({
  width: "100%", borderRadius: 8, padding: "12px 10px", fontWeight: 800, background: theme === "dark" ? "#181e37" : "#f8fbff",
  fontSize: ".99em", color: "#2363b7", border: "1.5px solid #cdd8f6", marginBottom: 7
});
const inputBox = (theme) => ({
  width: "100%", borderRadius: 8, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  background: theme === "dark" ? "#191e33" : "#f9fcfd", color: "#323f51", border: "1.3px solid #cce4fe", marginBottom: 8
});
const smallLbl = { fontWeight: 700, color: "#5098f3", margin: "6px 0 6px 2px", display: "block", fontSize: ".97em" };
const descCard = (theme) => ({
  background: theme === "dark" ? "#202a47" : "#f4f8fa", color: theme === "dark" ? "#eaf8ff" : "#245888",
  borderRadius: 8, padding: "10px 10px", fontWeight: 600, fontSize: ".99em", marginBottom: 7
});
