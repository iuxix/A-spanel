import React, { useState, useRef, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, doc, getDocs, updateDoc, query, where,
} from "firebase/firestore";
import {
  FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV,
  FaCogs, FaUserCircle, FaPlus, FaHistory, FaWhatsapp, FaMoon, FaSun,
} from "react-icons/fa";

// --- AVAILABLE CATEGORIES/SERVICES ---
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
      title: "Instagram Followers Old Accounts With Posts [365 Days Refill]",
      badge: "10571", badgeColor: "#618bf1",
      desc: "Quality: Old Accounts\nRefill: 365 Days Refill ♻️",
      avgtime: "5 hours", min: 100, max: 1000000, price: 121.5
    },
    {
      id: "10572",
      title: "Instagram Followers Old Accounts With Posts [Lifetime Refill]",
      badge: "10572", badgeColor: "#618bf1",
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
  ],
};

// --- Main Dashboard Component ---
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.00);
  const [cat, setCat] = useState(categories[0].value);
  const [svc, setSvc] = useState(null);
  const [qty, setQty] = useState("");
  const [charge, setCharge] = useState("0.00");
  const [link, setLink] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [theme, setTheme] = useState("dark"); // dark or light
  const [showMenu, setShowMenu] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [funds, setFunds] = useState([]); // user's fund history
  const [orders, setOrders] = useState([]); // user's order history

  // Live user and wallet
  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, async usr => {
      setUser(usr);
      if (usr) {
        // Listen to user balance changes
        onSnapshot(doc(db, "users", usr.uid), d =>
          setBalance(d.exists() && d.data().balance ? d.data().balance : 0)
        );
        // Fund/topup history
        onSnapshot(query(collection(db, "deposits"), where("user", "==", usr.uid)), snap =>
          setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.created.toMillis() - a.created.toMillis()))
        );
        // Orders history
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap =>
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.timestamp - a.timestamp))
        );
      }
    });
  }, []);

  // Charge calculation
  useEffect(() => {
    if (!svc || !qty) setCharge("0.00");
    else {
      let q = parseInt(qty, 10);
      if (isNaN(q) || q < (svc.min || 1) || q > svc.max) setCharge("0.00");
      else setCharge(((svc.price * q) / 1000).toFixed(2));
    }
  }, [svc, qty]);

  // --- Order placement ---
  async function submitOrder(e) {
    e.preventDefault();
    setOrderMsg("");
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill all fields.");
    let q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setOrderMsg(`❌ Min: ${svc.min} - Max: ${svc.max}`);
    if (parseFloat(charge) > parseFloat(balance)) return setOrderMsg("❌ Insufficient balance.");
    if (!user) return setOrderMsg("❌ Login to order.");
    // Order record (handled in 'orders' collection)
    await addDoc(collection(db, "orders"), {
      user: user.uid,
      service_id: svc.id,
      link, qty: q, charge: parseFloat(charge),
      timestamp: Date.now(), status: "pending", cat, serviceTitle: svc.title
    });
    // Deduct balance only if order accepted instantly, else manage in admin workflow
    await updateDoc(doc(db, "users", user.uid), { balance: balance - parseFloat(charge) });
    setOrderMsg("✅ Order placed! Track progress in your history.");
    setSvc(null); setLink(""); setQty(""); setCharge("0.00");
  }

  // --- UI ---
  const themed = t => theme === "dark" ? t : t.replace("#1b2243", "#fff").replace("#232a45", "#eaf4fb");
  const statBarColor = theme === "dark" ? "#232a45" : "#c9eaff";
  const statTitle = theme === "dark" ? "#b2dcfa" : "#115";

  return (
    <div style={{
      minHeight: "100vh", background: theme === "dark" ? "#171d33" : "#f5fdff", color: theme === "dark" ? "#fafcff" : "#1d2b22"
    }}>
      {/* Top Nav */}
      <nav style={{
        background: theme === "dark" ? "#161c33" : "#fbfdff", padding: "16px 0 10px", borderBottom: theme === "dark" ? "2px solid #1a3664" : "2px solid #c9e3f9",
        boxShadow: "0 2px 13px #1e325a12"
      }}>
        <div style={{
          maxWidth: 500, margin: "0 auto 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ fontWeight: 900, fontSize: "1.33em", color: "#1784fa", letterSpacing: ".7px" }}>
            <img src="/logo.png" alt="logo" style={{ height: 36, borderRadius: 10, marginRight: 10, background: "#fff" }} />
            fastsmmpanel
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button style={{
              background: "none", border: "none", borderRadius: 19, padding: "7px 12px", fontSize: "1.17em", cursor: "pointer"
            }} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <FaSun color="#ffe144" /> : <FaMoon color="#415e90" />}
            </button>
            <img src="/logo.png" alt="avatar" style={{ height: 33, width: 33, borderRadius: "50%", background: "#fff", marginLeft: "2px" }} />
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMenu((x) => !x)} style={{ background: "none", border: "none", color: "#11ecfd", fontSize: "1.30em", marginLeft: 11, cursor: "pointer" }}><FaEllipsisV /></button>
              {showMenu &&
                <div style={{
                  position: "absolute", right: 0, top: 38, zIndex: 101, minWidth: 149, background: themed("#1F294A"),
                  borderRadius: 13, boxShadow: "0 7px 22px #38bebe39", fontSize: "1.06em", padding: "8px 0"
                }}>
                  <MenuItem icon={<FaUserCircle />} label="Profile" />
                  <MenuItem icon={<FaWallet />} label="Add Funds" onClick={() => setShowFunds(true)} />
                  <MenuItem icon={<FaHistory />} label="History" />
                  <MenuItem icon={<FaCogs />} label="Settings" />
                </div>
              }
            </div>
          </div>
        </div>
      </nav>
      {/* Stats row */}
      <div style={{
        display: "flex", gap: "14px", overflowX: "auto", maxWidth: 1100, margin: "22px auto 14px", paddingBottom: 8
      }}>
        {[
          { icon: <FaUser />, label: "Username", value: user?.displayName || user?.email || "Not logged in", color: "#51c6fa" },
          { icon: <FaWallet />, label: "Balance", value: `₹${balance.toFixed(2)} INR`, color: "#11e28a" },
          { icon: <FaChartLine />, label: "Total Orders", value: orders.length, color: "#56a2ff" },
          { icon: <FaMoneyCheckAlt />, label: "Spent Balance", value: `₹${user?.spent?.toFixed(2) ?? "0.00"}`, color: "#f9b76f" }
        ].map((st, i) =>
          <div key={st.label}
            style={{
              flex: "0 0 183px", background: statBarColor, borderRadius: 14, minWidth: 166, boxShadow: "0 2px 10px #33b8ff13", padding: "18px 15px"
            }}>
            <span style={{
              background: "#243766", borderRadius: 7, padding: "7px 10px 7px 10px", fontSize: "1.23em", color: st.color, marginBottom: 9
            }}>
              {st.icon}
            </span>
            <span style={{ fontWeight: 700, color: statTitle, fontSize: ".98em", marginBottom: 0, display: "block" }}>{st.label}</span>
            <span style={{ fontWeight: 800, fontSize: "1.13em", color: st.color, marginTop: 4, display: "block" }}>{st.value}</span>
          </div>
        )}
      </div>
      {/* Welcome & note */}
      <div style={{
        textAlign: "center", margin: "0 0 18px 0", color: "#50bcff",
        fontWeight: 700, fontSize: "1.12em"
      }}>
        <span>⚡ Welcome, {user?.displayName || user?.email || "User"} — fastest panel for all SMM needs.</span>
      </div>
      {/* App "shortcut" row */}
      <div style={{
        display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 10, maxWidth: 700, margin: "8px auto 16px", paddingBottom: 4, justifyContent: "center"
      }}>
        {["Instagram", "Facebook", "YouTube", "Twitter", "Telegram", "Others"].map(app =>
          <button key={app} style={{
            minWidth: 122, fontWeight: 700, fontSize: ".97em", background: "none", border: `2.5px solid #325eb6`,
            color: "#71b8ff", borderRadius: 12, padding: "10px 13px", cursor: "pointer", whiteSpace: "nowrap"
          }}>{app}</button>
        )}
      </div>
      {/* Main Order/Fund interface block */}
      <form style={{
        background: themed("#1b2243"), borderRadius: 19, maxWidth: 500,
        padding: "22px 15px 21px", margin: "0 auto", boxShadow: "0 7px 21px #74dff420"
      }} onSubmit={submitOrder}>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <button type="button" style={tabBtn(true)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false)} onClick={() => setShowFunds(true)}>💵 AddFunds</button>
        </div>
        {/* -- dropdowns -- */}
        <div style={{ marginBottom: 15 }}>
          <label style={smallLbl}>Category</label>
          <select style={selectBox} value={cat} onChange={e => {
            setCat(e.target.value);
            setSvc(null); setQty(""); setLink(""); setCharge("0.00");
          }}>
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={smallLbl}>Service</label>
          <select style={selectBox} value={svc?.id || ""} onChange={e => {
            const found = (services[cat] || []).find(x => x.id === e.target.value);
            setSvc(found || null); setCharge("0.00"); setQty(""); setLink("");
          }}>
            <option value="">Select Service</option>
            {(services[cat] || []).map(s =>
              <option key={s.id} value={s.id}>{s.badge && `[${s.badge}] `}{s.title}</option>
            )}
          </select>
        </div>
        {/* -- Only show if there's a service -- */}
        {svc && (
          <>
            <div style={descCard}>
              <b style={{ color: "#1ac2f2", fontSize: ".97em" }}>
                {svc.badge && <span style={{
                  background: svc.badgeColor, borderRadius: 7, color: "#fff", padding: "2px 7px 3px", marginRight: 7
                }}>{svc.badge}</span>}
                {svc.title}
              </b>
              <div style={{ margin: "10px 0 0" }}><pre style={{ fontFamily: "inherit", margin: 0, color: "#a8e8ff", fontSize: ".97em" }}>{svc.desc}</pre></div>
            </div>
            <div style={descCard}><b>Average Time</b><br />{svc.avgtime}</div>
            <div style={{ marginBottom: 7, color: "#7dd5ee", fontWeight: 700, fontSize: ".97em" }}>
              Min: {svc.min} - Max: {svc.max}
            </div>
          </>
        )}
        {/* -- Order Inputs -- */}
        <label style={smallLbl}>Link</label>
        <input style={inputBox} placeholder="Paste link" value={link} onChange={e => setLink(e.target.value)} disabled={!svc} />
        <label style={smallLbl}>Quantity</label>
        <input style={inputBox} placeholder="Quantity" type="number" min={svc?.min || ""} max={svc?.max || ""} value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} disabled={!svc} />
        <div style={descCard}><b>Charge</b><br />₹{charge}</div>
        {orderMsg && (<div style={{ color: orderMsg[0] === "✅" ? "#65f96e" : "#ef5767", fontWeight: 700, margin: "11px 0" }}>{orderMsg}</div>)}
        <button style={{
          marginTop: 12, width: "100%", background: "linear-gradient(90deg,#ffbe41,#16ed70 100%)",
          color: "#2a3348", fontWeight: 900, border: "none", borderRadius: 12, padding: "15px 0",
          fontSize: "1.15em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7
        }} type="submit"><FaWhatsapp style={{ fontSize: "1.23em" }} /> Place Order</button>
      </form>
      {showFunds &&
        <AddFundsModal
          user={user}
          onClose={() => setShowFunds(false)}
        />
      }
    </div>
  );
}

function AddFundsModal({ user, onClose }) {
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [msg, setMsg] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) < 100) return setMsg("❌ Enter at least ₹100.");
    if (!proof) return setMsg("❌ Attach payment screenshot.");
    // Here: actually upload screenshot, then add deposit
    await addDoc(collection(db, "deposits"), {
      user: user.uid,
      amount: Number(amount),
      proof: proof.name, // In real use, upload to storage and use the URL
      status: "pending",
      created: new Date()
    });
    setMsg("✅ Fund request sent! Await admin approval.");
    setAmount(""); setProof(null);
  }
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 400,
      background: "rgba(10,30,80,0.13)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit}
        style={{
          background: "#242e54", borderRadius: 18, width: 340, padding: 29, boxShadow: "0 8px 28px #149fe728",
          position: "relative", color: "#fff"
        }}>
        <button type="button" onClick={onClose}
          style={{
            position: "absolute", right: 11, top: 11, border: "none",
            fontSize: "2.1em", background: "none", color: "#ffe144", cursor: "pointer"
          }}>&times;</button>
        <h2 style={{ textAlign: "center", marginBottom: 13, color: "#20fdad" }}>Add Funds</h2>
        <div style={{ fontWeight: 700, color: "#ffd46b", marginBottom: 6, textAlign: "center" }}>
          UPI: <span style={{ color: "#1ce9a7" }}>boraxdealer@fam</span>
        </div>
        <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{
          width: 140, borderRadius: 13, margin: "13px auto 17px", display: "block", background: "#fff"
        }}/>
        <input type="number" min={100}
          placeholder="Enter Amount (₹100+)"
          style={{ width: "100%", borderRadius: 8, padding: "13px 11px", border: "1.3px solid #363e5c", margin: "5px 0 11px", color: "#242e54", fontWeight: 700 }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
        />
        <input type="file" accept="image/*" style={{
          width: "100%", marginBottom: 13
        }} onChange={e => setProof(e.target.files[0])} />
        <button type="submit"
          style={{
            width: "100%", borderRadius: 8, background: "linear-gradient(90deg,#ffc62f,#1cec86 100%)",
            color: "#131d33", fontWeight: 900, fontSize: "1.14em", padding: "13px 0", border: "none", marginBottom: 6
          }}>Submit</button>
        {msg && <div style={{ marginTop: 8, color: msg[0] === "✅" ? "#1ded6a" : "#fd4b82", fontWeight: 700, textAlign: "center" }}>{msg}</div>}
      </form>
    </div>
  );
}
function MenuItem({ icon, label, onClick }) {
  return (
    <div onClick={onClick}
      style={{
        padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", border: "none", outline: "none", background: "none", color: "#c4fafd"
      }}>
      {icon} {label}
    </div>
  );
}
const tabBtn = (on) => ({
  flex: 1,
  background: on ? "linear-gradient(90deg,#18ed7e,#27ebed 100%)" : "none",
  color: on ? "#222c38" : "#93f0d7",
  border: on ? "none" : "2px solid #233b67",
  borderRadius: 7,
  padding: "12px 0",
  fontWeight: 800,
  fontSize: "1.10em",
  marginRight: 7,
  boxShadow: on ? "0 1px 9px #1affd329" : "none"
});
const selectBox = {
  width: "100%", borderRadius: 8, padding: "12px 10px", fontWeight: 800, background: "#181e37",
  fontSize: ".99em", color: "#e6e8ff", border: "1.5px solid #313d5b", marginBottom: 7
};
const inputBox = {
  width: "100%", borderRadius: 8, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  background: "#171a2e", color: "#fff", border: "1.3px solid #29325a", marginBottom: 7
};
const smallLbl = { fontWeight: 700, color: "#6fcffd", margin: "5px 0 6px 2px", display: "block", fontSize: ".97em" };
const descCard = { background: "#202a47", color: "#e2f6ff", borderRadius: 8, padding: "10px 10px", fontWeight: 600, fontSize: ".99em", marginBottom: 7 };
