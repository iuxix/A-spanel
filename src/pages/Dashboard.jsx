import React, { useState, useEffect, useRef } from "react";
import { FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaMoon, FaWhatsapp } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// ---- CONFIG ----
const PANEL_NAME = "LucixFire Panel";
const PANEL_COLOR = "#2264f4";

const CATEGORIES = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "new-services", label: "New Services ⭐" },
  { value: "cheap-world", label: "World cheap Services ⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" },
  { value: "youtube", label: "YouTube" }
];

// For SMM panel demo, you can expand categories and services as in your screenshots
const CATEGORY_SERVICES = {
  "new-ig": [
    {
      id: "1572",
      title: "Instagram Reels Views [ NoN~Drop | Emergency Working Update | 10M/Day | Lifetime ]",
      badge: "1572",
      badgeColor: "#3caaff",
      desc: `Start: Instant\nSpeed: 10M/Day\nDrop: No\nREFILL: Lifetime`,
      avgtime: "3 hours",
      min: 100, max: 4666000000000, price: 0.13
    }
  ],
  // ...add ALL others shown in your screenshots here
  "ig-followers-new": [
    {
      id: "10571",
      title: "Instagram Followers Old Accounts With Posts | Max 1M | 1 Day 500k | Cancel Enable ❌ | For All Flag ⭐⭐ | 365 Days Refill ♻️ Cancel & Refill Button Active ⭐",
      badge: "10571",
      badgeColor: "#3e6ad6",
      desc: `Quality: Old Accounts\nRefill: 365 Days Refill ♻️`,
      avgtime: "5 hours",
      min: 100, max: 4666000000000, price: 121.5
    },
    {
      id: "10572",
      title: "Instagram Followers Old Accounts With Posts | Max 1M | 1 Day 500k | Cancel Enable ❌ | For All Flag ⭐⭐ | Lifetime Refill ♻️ Cancel & Refill Button Active ⭐",
      badge: "10572",
      badgeColor: "#3e6ad6",
      desc: `Quality: Old Accounts\nRefill: Lifetime Refill ♻️`,
      avgtime: "7 hours",
      min: 100, max: 4666000000000, price: 121.5
    }
  ]
  // ...add every other category with array of services, following your UI's structure/screens
};

const APPS = [
  { label: "Instagram", color: "#e94057" }, { label: "Facebook", color: "#4267B2" },
  { label: "YouTube", color: "#ff2222" }, { label: "Twitter", color: "#1da1f2" },
  { label: "Spotify", color: "#1ed760" }, { label: "Tiktok", color: "#000" },
  { label: "Telegram", color: "#259cf7" }, { label: "Linkedin", color: "#0A66C2" },
  { label: "Discord", color: "#7289da" }, { label: "Website Traffic", color: "#1ba97a" },
  { label: "Others", color: "#ea4cff" }, { label: "Everythings", color: "#aaa" }
];

// ---- MAIN DASHBOARD COMPONENT ----
export default function Dashboard() {
  const [user, setUser] = useState({ username: "ningabaha" });
  const [balance, setBalance] = useState(0.0);
  const [cat, setCat] = useState(CATEGORIES[0].value);
  const [svc, setSvc] = useState(null);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const statsRef = useRef(null);

  // Live auth+balance from Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(u => ({ ...u, username: usr.displayName || u.username }));
        const userDoc = await getDoc(doc(db, "users", usr.uid));
        setBalance(userDoc.exists() ? userDoc.data().balance : 0.0);
      }
    });
    return unsub;
  }, []);

  // Stats horizontal scroll management
  useEffect(() => {
    if (statsRef.current) statsRef.current.scrollLeft = 0;
  }, []);

  // On category change
  function handleCategory(c) {
    setCat(c);
    setSvc(null); setQty(""); setLink(""); setMsg("");
  }
  function handleService(id) {
    const selected = (CATEGORY_SERVICES[cat] || []).find(s => String(s.id) === String(id));
    setSvc(selected); setQty(""); setLink(""); setMsg("");
  }
  function placeOrder(e) {
    e.preventDefault();
    setMsg("");
    if (!svc || !qty || !link) return setMsg("❌ All fields required.");
    if (qty < svc.min || qty > svc.max) return setMsg(`❌ Min: ${svc.min} - Max: ${svc.max}`);
    const charge = ((svc.price * qty) / 1000);
    if (charge > balance) return setMsg("❌ Insufficient balance.");
    setBalance(b => (+b - charge).toFixed(2));
    setMsg("✅ Order placed!");
    setQty(""); setLink("");
  }

  return (
    <div style={{background:"#151a2e",minHeight:"100vh",color:"#fff",fontFamily:"Poppins,sans-serif",paddingBottom:32}}>
      {/* Topbar */}
      <nav style={{
        background: "#191e3d", padding: "10px 0 8px", borderBottom: "2px solid #1a3664", boxShadow: "0 2px 13px #2864a622"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 430, margin: "0 auto"
        }}>
          <div style={{ fontWeight: 900, fontSize: "1.35em", color: PANEL_COLOR, letterSpacing: ".8px" }}>
            <img src="/logo.png" alt="logo" style={{ height: 36, borderRadius: 12, marginRight: 10, background: "#fff" }} />
            {PANEL_NAME}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button style={{
              background: "none", border: "none", borderRadius: 22, padding: "7px 12px", fontSize: "1.22em", cursor: "pointer"
            }}><FaMoon color="#ffd24d" /></button>
            <button style={{ background: "none", border: "none", borderRadius: "50%", padding: "0", marginLeft: 8 }}>
              <img src="/logo.png" alt="avatar" style={{ height: 35, width: 35, borderRadius: "50%", background: "#fff" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Stat widgets: horizontal scroll */}
      <div ref={statsRef} style={{
        display: "flex", gap: "13px", overflowX: "auto", WebkitOverflowScrolling: "touch",
        maxWidth: 900, margin: "19px auto 12px auto", paddingBottom: 7
      }}>
        <StatCard icon={<FaUser />} label="Username" color="#fd9919" value={user.username}/>
        <StatCard icon={<FaWallet />} label="Balance" color="#19bf7f" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard icon={<FaChartLine />} label="Total Orders" color="#f95379" value={119168} />
        <StatCard icon={<FaMoneyCheckAlt />} label="Spent Balance" color="#c48bf7" value={`₹0.00`} />
      </div>

      {/* Apps row */}
      <div style={{
        display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 10, maxWidth: 530, margin: "8px auto 15px", paddingBottom: 4
      }}>
        {APPS.map(app =>
          <button key={app.label}
            style={{
              minWidth: 111, fontWeight: 700, fontSize: ".97em", background: "none", border: `2.5px solid #255eb6`,
              color: app.color, borderRadius: 11, padding: "8px 13px",
              cursor: "pointer", whiteSpace: "nowrap"
            }}>{app.label}</button>
        )}
      </div>

      {/* New Order/AddFunds Tabs */}
      <form onSubmit={placeOrder} style={{
        background: "#202850", borderRadius: 21, maxWidth: 430, padding: "17px 10px 13px", margin: "0 auto", boxShadow: "0 6px 20px #3beeb213"
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 11, alignItems: "center" }}>
          <button type="button" tabIndex="-1" style={tabBtn(true)}>🛒 New Order</button>
          <button type="button" tabIndex="-1" style={tabBtn(false)}>💵 AddFunds</button>
        </div>
        <input style={searchInput} placeholder="Search Services..." value="" readOnly />
        <div style={{ marginBottom: 12 }}>
          <label style={smallLbl}>Category</label>
          <select style={selectBox} value={cat} onChange={e => handleCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {/* Services: scrollable list of cards */}
        <div style={{
          maxHeight: 180, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column", gap: 9
        }}>
          {(CATEGORY_SERVICES[cat] || []).map((s) =>
            <div key={s.id}
              style={{
                border: svc?.id === s.id ? "2.5px solid #40fae7" : "1.7px solid #28354c",
                background: svc?.id === s.id ? "#293d85" : "#232d52",
                color: svc?.id === s.id ? "#4de2e9" : "#dbeafc",
                fontWeight: 800, borderRadius: 9, padding: "9px 12px", fontSize: ".96em",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}
              onClick={() => handleService(s.id)}
            >
              {s.badge &&
                <span style={{
                  background: s.badgeColor || "#2897ff", color: "#fff",
                  fontWeight: 900, fontSize: ".92em", borderRadius: 7, padding: "2px 11px", marginRight: 15, letterSpacing: ".03em"
                }}>{s.badge}</span>
              }
              <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} title={s.title}>
                {s.title}
              </span>
            </div>
          )}
        </div>

        {/* Service Details form */}
        {svc && (
          <>
            <div style={descCard}>
              <b style={{ display: "block", marginBottom: 10, color: "#31c3eb", fontSize: ".97em" }}>Description</b>
              <pre style={{
                margin: 0, fontSize: ".95em", color: "#baddff",
                background: "none", border: "none", fontWeight: 600, whiteSpace: "pre-wrap"
              }}>{svc.desc}</pre>
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
              ₹{qty && svc ? ((svc.price * qty) / 1000).toFixed(2) : svc.price}
            </div>
          </>
        )}
        {msg && (<div style={{ color: msg[0] === "✅" ? "#34fa7f" : "#ef5767", fontWeight: 700, margin: "11px 0" }}>{msg}</div>)}
        <button style={{
          width: "100%", background: "linear-gradient(90deg,#fea517,#18e389 100%)",
          color: "#171e33", fontWeight: 900, border: "none", borderRadius: 11, padding: "14px 0", marginTop: 8, fontSize: "1.09em"
        }}>
          <FaWhatsapp /> Place Order
        </button>
      </form>
    </div>
  );
}

// --- CARD AND CONTROL STYLES ---
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      flex: "0 0 185px", background: "#232a45", borderRadius: 18, minWidth: 180,
      boxShadow: "0 3px 11px #3ae9b123", padding: "20px 18px 12px 15px", display: "flex", flexDirection: "column", alignItems: "start"
    }}>
      <span style={{
        background: "#29375c", borderRadius: 11, padding: "8px 10px 7px", fontSize: "1.4em", color, marginBottom: 10
      }}>
        {icon}
      </span>
      <span style={{ fontWeight: 700, color: "#b2dcfc", fontSize: ".98em" }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: "1.13em", color, marginTop: 5 }}>{value}</span>
    </div>
  );
}
const tabBtn = (on) => ({
  flex: 1, background: on ? "linear-gradient(90deg,#23fd7e,#13edcb 100%)" : "none",
  color: on ? "#181f2f" : "#6eb4fa", border: on ? "none" : "2px solid #263454", borderRadius: 7, padding: "12px 0",
  fontWeight: 800, fontSize: "1.07em", marginRight: 6, boxShadow: on ? "0 1px 9px #04ffc329" : "none"
});
const searchInput = {
  width: "100%", borderRadius: 7, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  color: "#9ad0ff", background: "#17223d", border: "1.3px solid #263554", marginBottom: "7px"
};
const selectBox = {
  width: "100%", borderRadius: 7, padding: "12px 10px", fontWeight: 800, background: "#162448",
  fontSize: ".99em", color: "#e6e8ff", border: "1.5px solid #28355c", marginBottom: 5
};
const smallLbl = { fontWeight: 700, color: "#71bdff", margin: "4px 0 6px 2px", display: "block", fontSize: ".97em" };
const descCard = { background: "#181f33", color: "#e0eaff", borderRadius: 9, padding: "11px 12px", fontWeight: 700, fontSize: ".97em", marginBottom: 9 };
const inputBox = { width: "100%", borderRadius: 7, padding: "13px 11px", fontWeight: 700, fontSize: "1em", background: "#17223d", color: "#fff", border: "1.3px solid #263554", marginBottom: 7 };
