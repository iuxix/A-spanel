import React, { useState, useEffect, useRef } from "react";
import { FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaMoon, FaWhatsapp, FaPlus, FaEllipsisV, FaHistory, FaCogs, FaUserCircle } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const PANEL_NAME = "fastsmmpanel";

// --- Sample categories and services, add or edit as you need ---
const categories = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" }
];

const categoryServices = {
  "new-ig": [
    {
      id: "1572",
      title: "Instagram Reels Views [ NoN~Drop | Emergency Working Update | 10M/Day | Lifetime ]",
      badge: "1572",
      badgeColor: "#3caaff",
      desc: "Start: Instant\nSpeed: 10M/Day\nDrop: No\nREFILL: Lifetime",
      avgtime: "3 hours",
      min: 100,
      max: 4666000000000,
      price: 0.13
    }
  ],
  "ig-followers-new": [
    {
      id: "10571",
      title: "Instagram Followers Old Accounts With Posts | Max 1M | ... | 365 Days Refill",
      badge: "10571",
      badgeColor: "#3e6ad6",
      desc: "Quality: Old Accounts\nRefill: 365 Days Refill ♻️",
      avgtime: "5 hours",
      min: 100,
      max: 4666000000000,
      price: 121.5
    },
    {
      id: "10572",
      title: "Instagram Followers Old Accounts With Posts | Max 1M | Lifetime Refill",
      badge: "10572",
      badgeColor: "#3e6ad6",
      desc: "Quality: Old Accounts\nRefill: Lifetime Refill ♻️",
      avgtime: "7 hours",
      min: 100,
      max: 4666000000000,
      price: 121.5
    }
  ],
  "telegram": [
    {
      id: "3011",
      title: "Telegram Post Views Auto",
      badge: "TG",
      badgeColor: "#54e2f9",
      desc: "Instant delivery, non drop",
      avgtime: "1 hour",
      min: 100,
      max: 4000000,
      price: 0.02
    }
  ]
};

const STATS = [
  { icon: <FaUser />, label: "Username", key: "username", color: "#fd9919" },
  { icon: <FaWallet />, label: "Balance", key: "balance", color: "#19bf7f" },
  { icon: <FaChartLine />, label: "Total Orders", key: "orders", color: "#56a2ff" },
  { icon: <FaMoneyCheckAlt />, label: "Spent Balance", key: "spent", color: "#b48bf9" }
];

const APPS = [
  { label: "Instagram", color: "#e94057" }, { label: "Facebook", color: "#4267B2" },
  { label: "YouTube", color: "#ff2222" }, { label: "Twitter", color: "#1da1f2" },
  { label: "Spotify", color: "#1ed760" }, { label: "Tiktok", color: "#000" },
  { label: "Telegram", color: "#259cf7" }, { label: "Linkedin", color: "#0A66C2" },
  { label: "Discord", color: "#7289da" }, { label: "Website Traffic", color: "#1ba97a" },
  { label: "Others", color: "#ea4cff" }, { label: "Everythings", color: "#aaa" }
];

export default function Dashboard() {
  const [user, setUser] = useState({ username: "ningabaha", orders: 119168, spent: 0.0 });
  const [balance, setBalance] = useState(0.00);
  const [cat, setCat] = useState(categories[0].value);
  const [svc, setSvc] = useState(null);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [charge, setCharge] = useState("0.00");
  const [msg, setMsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(u => ({ ...u, username: usr.displayName || u.username }));
        const ud = await getDoc(doc(db, "users", usr.uid));
        setBalance(ud.exists() && ud.data().balance !== undefined ? ud.data().balance : 0.0);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (svc && qty) {
      let c = ((svc.price * parseInt(qty||0)) / 1000).toFixed(2);
      setCharge(isNaN(c) ? "0.00" : c);
    } else {
      setCharge("0.00");
    }
  }, [svc, qty]);

  const activeServices = categoryServices[cat] || [];

  const handleCategory = (v) => {
    setCat(v);
    setSvc(null); setLink(""); setQty(""); setCharge("0.00"); setMsg("");
  };

  return (
    <div style={{background:"#151A2E",minHeight:"100vh",paddingBottom:24,fontFamily:"Poppins,sans-serif"}}>
      {/* Header */}
      <nav style={{
        background: "#191e3d", padding: "10px 0 10px", borderBottom: "2px solid #1a3664", boxShadow: "0 2px 13px #1e325b22"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 430, margin: "0 auto"
        }}>
          <div style={{ fontWeight: 900, fontSize: "1.39em", color: "#2264f4", letterSpacing: ".5px" }}>
            <img src="/logo.png" alt="logo" style={{ height: 36, borderRadius: 12, marginRight: 10, background: "#fff" }}/>
            {PANEL_NAME}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button style={{ background: "none", border: "none", borderRadius: 19, padding: "7px 11px", fontSize: "1.12em", cursor: "pointer" }}>
              <FaMoon color="#ffd24d"/>
            </button>
            <button style={{ background: "none", border: "none", borderRadius: "50%", padding: 0, marginLeft: 8 }}>
              <img src="/logo.png" alt="profile" style={{ height: 35, width: 35, borderRadius: "50%", background: "#fff" }}/>
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMenu((x) => !x)} style={{ background: "none", border: "none", color: "#41f6f2", fontSize: "1.35em", marginLeft: 9, cursor: "pointer" }}><FaEllipsisV /></button>
              {showMenu &&
                <div style={{
                  position: "absolute", right: -12, top: 38, zIndex: 999,
                  minWidth: 148, background: "#1F2846", borderRadius: 12,
                  boxShadow: "0 6px 19px #20a7b955", fontSize: "1.04em",
                  padding: "7px 0"
                }}>
                  <DropdownItem icon={<FaUserCircle />} label="Profile"/>
                  <DropdownItem icon={<FaWallet />} label="Add Funds"/>
                  <DropdownItem icon={<FaHistory />} label="History"/>
                  <DropdownItem icon={<FaCogs />} label="Settings"/>
                </div>
              }
            </div>
          </div>
        </div>
      </nav>
      {/* Scrollable summary (stats) row */}
      <div ref={statsRef} style={{
        display:"flex",gap:"11px",overflowX:"auto",WebkitOverflowScrolling:"touch",
        maxWidth:900,margin:"18px auto 12px auto",paddingBottom:7
      }}>
        {STATS.map((stat,i) =>
          <div key={stat.label}
            style={{
              flex:"0 0 185px",background:"#232a45",borderRadius:14,
              minWidth:175,boxShadow:"0 2px 8px #3189f213",padding:"16px 13px",
              alignItems:"start",display:"flex",flexDirection:"column"
            }}>
            <span style={{
              background:"#29375c",borderRadius:8,padding:"8px 10px 7px",fontSize:"1.23em",color:stat.color,marginBottom:10
            }}>{stat.icon}</span>
            <span style={{fontWeight:700,color:"#b2dcfc",fontSize:".98em",marginBottom:0}}>{stat.label}</span>
            <span style={{fontWeight:800,fontSize:"1.14em",color:stat.color,marginTop:5}}>
              {stat.key === "username" ? user.username :
                stat.key === "balance" ? `₹${balance.toFixed(2)} INR` :
                  stat.key === "orders" ? (user.orders || "—") :
                    stat.key === "spent" ? `₹0.00` : ""}
            </span>
          </div>
        )}
      </div>
      {/* App links */}
      <div style={{
        display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 10, maxWidth: 500, margin: "8px auto 10px", paddingBottom: 2
      }}>
        {APPS.map(app =>
          <button key={app.label}
            style={{
              minWidth: 100, fontWeight: 700, fontSize: ".97em", background: "none", border: `2.5px solid #255eb6`,
              color: app.color, borderRadius: 11, padding: "8px 13px",
              cursor: "pointer", whiteSpace: "nowrap"
            }}>{app.label}</button>
        )}
      </div>
      {/* New Order/AddFunds */}
      <form style={{
        background: "#202850", borderRadius: 21, maxWidth: 440,
        padding: "18px 12px 15px", margin: "0 auto", boxShadow: "0 6px 21px #3beeb213"
      }} onSubmit={e => { e.preventDefault(); }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 13, alignItems: "center" }}>
          <button type="button" style={tabBtn(true)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false)}>💵 AddFunds</button>
        </div>
        <input style={searchInput} placeholder="Search Services..." value="" readOnly />
        {/* Category */}
        <div style={{ marginBottom: 12 }}>
          <label style={smallLbl}>Category</label>
          <select style={selectBox} value={cat} onChange={e => handleCategory(e.target.value)}>
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {/* Services */}
        <div style={{
          maxHeight: 180, overflowY: "auto", marginBottom: 10,
          display: "flex", flexDirection: "column", gap: 9
        }}>
          {activeServices.map(s =>
            <div key={s.id}
              style={{
                border: svc?.id === s.id ? "2.5px solid #40fae7" : "1.7px solid #28354c",
                background: svc?.id === s.id ? "#293d85" : "#232d52",
                color: svc?.id === s.id ? "#4de2e9" : "#dbeafc",
                fontWeight: 800, borderRadius: 9, padding: "8px 12px", fontSize: ".97em",
                cursor: "pointer", display: "flex", alignItems: "center"
              }}
              onClick={() => setSvc(s)}
            >
              {s.badge &&
                <span style={{
                  background: s.badgeColor || "#2897ff", color: "#fff", fontWeight: 900,
                  fontSize: ".92em", borderRadius: 7, padding: "2px 12px", marginRight: 15, letterSpacing: ".03em"
                }}>{s.badge}</span>
              }
              <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} title={s.title}>
                {s.title}
              </span>
            </div>
          )}
        </div>
        {/* Service Details */}
        {svc && (
          <>
            <div style={descCard}>
              <b style={{ display: "block", marginBottom: 10, color: "#31c3eb", fontSize: ".97em" }}>Description</b>
              <pre style={{ margin: 0, fontSize: ".95em", color: "#baddff", background: "none", border: "none", fontWeight: 600, whiteSpace: "pre-wrap" }}>{svc.desc}</pre>
            </div>
            <div style={descCard}><b>Average Time</b><br />{svc.avgtime}</div>
            <label style={smallLbl}>Link</label>
            <input style={inputBox} placeholder="Paste link" value={link} onChange={e => setLink(e.target.value)} />
            <label style={smallLbl}>Quantity</label>
            <input style={inputBox} placeholder="Quantity" type="number" value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} />
            <div style={{ fontWeight: 600, fontSize: ".96em", color: "#e5cbfa", margin: "8px 0" }}>
              Min: {svc.min} - Max: {svc.max}
            </div>
            <div style={descCard}>
              <b>Charge</b><br />
              ₹{charge}
            </div>
          </>
        )}
        {msg && (<div style={{ color: msg[0] === "✅" ? "#34fa7f" : "#ef5767", fontWeight: 700, margin: "11px 0" }}>{msg}</div>)}
        <button style={{
          marginTop:12,
          width: "100%",
          background: "linear-gradient(90deg,#ffb524,#21e07e 100%)",
          color: "#1a253e",
          fontWeight: 900,
          border: "none",
          borderRadius: 12,
          padding: "15px 0",
          fontSize: "1.15em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }} onClick={placeOrder}>
          <FaWhatsapp style={{ fontSize: "1.24em" }} /> Place Order
        </button>
      </form>
    </div>
  );
}

function DropdownItem({ icon, label }) {
  return (
    <div style={{
      padding: "10px 18px", display: "flex", alignItems: "center", gap: 9,
      cursor: "pointer", border: "none", outline: "none", background: "none", color: "#c6e5fa"
    }}>
      {icon} {label}
    </div>
  );
}
const tabBtn = (on) => ({
  flex: 1, background: on ? "linear-gradient(90deg,#23fd7e,#13edcb 100%)" : "none",
  color: on ? "#181f2f" : "#54c8ea",
  border: on ? "none" : "2px solid #213e77",
  borderRadius: 7, padding: "12px 0",
  fontWeight: 800, fontSize: "1.05em", marginRight: 6, boxShadow: on ? "0 1px 9px #04ffc329" : "none"
});
const searchInput = {
  width: "100%", borderRadius: 7, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  color: "#b2bcfa", background: "#191e33", border: "1.3px solid #132242", marginBottom: "9px"
};
const selectBox = {
  width: "100%", borderRadius: 7, padding: "12px 10px", fontWeight: 800, background: "#151f3b",
  fontSize: ".99em", color: "#e6e8ff", border: "1.5px solid #28355c", marginBottom: 2
};
const smallLbl = { fontWeight: 700, color: "#48d8fa", margin: "4px 0 6px 2px", display: "block", fontSize: ".97em" };
const descCard = { background: "#181f33", color: "#e0eaff", borderRadius: 9, padding: "11px 12px", fontWeight: 700, fontSize: ".97em", marginBottom: 7 };
const inputBox = { width: "100%", borderRadius: 7, padding: "13px 11px", fontWeight: 700, fontSize: "1em", background: "#191e33", color: "#fff", border: "1.3px solid #25324c", marginBottom: 7 };
