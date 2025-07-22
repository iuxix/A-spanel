import React, { useState, useEffect, useRef } from "react";
import { FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaMoon, FaWhatsapp, FaPlus, FaEllipsisV, FaHistory, FaCogs, FaUserCircle } from "react-icons/fa";

// ------ DEMO DATA -----
const PANEL_NAME = "LuciXFire Panel";

const statsDemo = [
  { icon: <FaUser />, label: "Username", key: "username", color: "#51c6fa" },
  { icon: <FaWallet />, label: "Balance", key: "balance", color: "#7fc16f" },
  { icon: <FaChartLine />, label: "Total Orders", key: "orders", color: "#56a2ff" },
  { icon: <FaMoneyCheckAlt />, label: "Spent Balance", key: "spent", color: "#f9b76f" }
];

const apps = [
  { label: "Instagram", color: "#df468c" }, { label: "Facebook", color: "#3981e4" }, { label: "YouTube", color: "#e12a32" },
  { label: "Twitter", color: "#3ab2e2" }, { label: "Spotify", color: "#32db7b" }, { label: "Tiktok", color: "#111" },
  { label: "Telegram", color: "#289ce6" }, { label: "Linkedin", color: "#4096f6" }, { label: "Discord", color: "#5865F2" },
  { label: "Website Traffic", color: "#3de98d" }, { label: "Others", color: "#ce52d0" }, { label: "Everythings", color: "#aaa" }
];

const categories = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" },
  // add your other categories here
];

const servicesData = {
  "new-ig": [
    {
      id: "1572",
      title: "Instagram Reels Views [ NoN~Drop | Emergency Working Update | 10M/Day | Lifetime ]",
      badge: { text: "1572", color: "#36b6fa" },
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
      title: "Instagram Followers Old Accounts With Posts [365 Days Refill]",
      badge: { text: "10571", color: "#619bf1" },
      desc: "Quality: Old Accounts\nRefill: 365 Days Refill ♻️",
      avgtime: "5 hours",
      min: 100,
      max: 4666000000000,
      price: 121.5
    },
    {
      id: "10572",
      title: "Instagram Followers Old Accounts With Posts [Lifetime Refill]",
      badge: { text: "10572", color: "#619bf1" },
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
      badge: { text: "TG", color: "#54e2f9" },
      desc: "Instant delivery, non drop",
      avgtime: "1 hour",
      min: 100,
      max: 4000000,
      price: 0.02
    }
    // Add your Telegram services here
  ]
  // ...add more category arrays as needed
};

export default function Dashboard() {
  // you will fill these live from your backend or firebase as needed
  const [user] = useState({ username: "ningabaha", orders: 119168, spent: 0.00 });
  const [balance, setBalance] = useState(0.00);

  // State for dropping, picking, etc
  const [cat, setCat] = useState(categories[0].value);
  const [svc, setSvc] = useState(null);
  const [msg, setMsg] = useState("");
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [charge, setCharge] = useState("0.00");
  const [showMenu, setShowMenu] = useState(false);
  const [showFunds, setShowFunds] = useState(false);

  // For category/services dropdown mapping
  const filteredServices = servicesData[cat] || [];

  // Always scroll the summary bar to left when rendering
  const statsRef = useRef(null);
  useEffect(() => {
    if (statsRef.current) statsRef.current.scrollLeft = 0;
  }, [user, cat]);

  // Recaculate charge
  useEffect(() => {
    if (!svc || !qty) setCharge("0.00");
    else {
      let q = parseInt(qty, 10);
      if (isNaN(q) || q < (svc.min || 1) || q > svc.max) setCharge("0.00");
      else setCharge(((svc.price * q) / 1000).toFixed(2));
    }
  }, [svc, qty]);

  // Submit handler (customize if you want to demo actual orders/funds)
  function submitOrder(e) {
    e.preventDefault();
    setMsg("");
    if (!svc || !qty || !link) return setMsg("❌ Please fill all fields.");
    let q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setMsg(`❌ Min: ${svc.min} - Max: ${svc.max}`);
    if (parseFloat(charge) > parseFloat(balance)) return setMsg("❌ Insufficient balance.");
    setMsg("✅ Order placed!");
    setSvc(null); setLink(""); setQty(""); setCharge("0.00");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#181e31", color: "#fafcfd", fontFamily: "Poppins,sans-serif" }}>
      {/* Top Nav */}
      <nav style={{
        background: "#192146", padding: "14px 0", borderBottom: "2px solid #1937a3", boxShadow: "0 2px 13px #1e305a25"
      }}>
        <div style={{
          maxWidth: 430, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ fontWeight: 900, fontSize: "1.33em", color: "#1472fa", letterSpacing: ".6px" }}>
            <img src="/logo.png" alt="logo" style={{ height: 36, borderRadius: 11, marginRight: 10, background: "#fff" }} />
            {PANEL_NAME}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button style={{
              background: "none", border: "none", borderRadius: 18, padding: "7px 12px", fontSize: "1.17em", cursor: "pointer"
            }}><FaMoon color="#ffe144" /></button>
            <img src="/logo.png" alt="avatar" style={{ height: 33, width: 33, borderRadius: "50%", background: "#fff", marginLeft: "0.32rem" }} />
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMenu((x) => !x)} style={{ background: "none", border: "none", color: "#11ecfd", fontSize: "1.29em", marginLeft: 10, cursor: "pointer" }}><FaEllipsisV /></button>
              {showMenu &&
                <div style={{
                  position: "absolute", right: 0, top: 38, zIndex: 101,
                  minWidth: 149, background: "#1F294A", borderRadius: 13,
                  boxShadow: "0 7px 22px #009eeb66", fontSize: "1.04em", padding: "7px 0"
                }}>
                  <DropdownItem icon={<FaUserCircle />} label="Profile" />
                  <DropdownItem icon={<FaWallet />} label="Add Funds" onClick={() => setShowFunds(true)} />
                  <DropdownItem icon={<FaHistory />} label="History" />
                  <DropdownItem icon={<FaCogs />} label="Settings" />
                </div>
              }
            </div>
          </div>
        </div>
      </nav>
      {/* Stats, horizontally scrollable */}
      <div ref={statsRef} style={{
        display: "flex", gap: "10px", overflowX: "auto", maxWidth: 1000, margin: "22px auto 14px", paddingBottom: 7
      }}>
        {statsDemo.map((st, i) =>
          <div key={st.label}
            style={{
              flex: "0 0 176px", background: "#242e54", borderRadius: 14, minWidth: 160, boxShadow: "0 2px 10px #2798ff20", padding: "17px 13px"
            }}>
            <span style={{
              background: "#243766", borderRadius: 7, padding: "7px 10px 7px 10px", fontSize: "1.25em", color: st.color, marginBottom: 10
            }}>
              {st.icon}
            </span>
            <span style={{ fontWeight: 700, color: "#e8edfa", fontSize: ".97em", marginBottom: 0, display: "block" }}>{st.label}</span>
            <span style={{ fontWeight: 800, fontSize: "1.09em", color: st.color, marginTop: 5, display: "block" }}>
              {st.key === "username" ? user.username
                : st.key === "balance" ? `₹${balance.toFixed(2)} INR`
                : st.key === "orders" ? (user.orders || "—")
                : st.key === "spent" ? `₹${user.spent?.toFixed(2) ?? "0.00"}` : ""}
            </span>
          </div>
        )}
      </div>
      {/* Apps row */}
      <div style={{
        display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 10, maxWidth: 650, margin: "8px auto 15px", paddingBottom: 4
      }}>
        {apps.map(app =>
          <button key={app.label}
            style={{
              minWidth: 112, fontWeight: 700, fontSize: ".96em", background: "none", border: `2px solid #185a84`,
              color: app.color, borderRadius: 11, padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap"
            }}>{app.label}</button>
        )}
      </div>
      {/* Order/Funds Tabs / Widget */}
      <form style={{
        background: "#1b2243", borderRadius: 18, maxWidth: 440,
        padding: "19px 11px 16px", margin: "0 auto", boxShadow: "0 7px 21px #2beed139"
      }} onSubmit={submitOrder}>
        <div style={{ display: "flex", gap: 11, marginBottom: 13 }}>
          <button type="button" style={tabBtn(true)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false)} onClick={() => setShowFunds(true)}>💵 AddFunds</button>
        </div>
        <input style={searchInput} placeholder="Search Services..." value="" readOnly />
        {/* Dropdown Category */}
        <div style={{ marginBottom: 12 }}>
          <label style={smallLbl}>Category</label>
          <select style={selectBox} value={cat} onChange={e => { setCat(e.target.value); setSvc(null); setQty(""); setLink(""); }}>
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {/* Dropdown Service */}
        <div style={{ marginBottom: 15 }}>
          <label style={smallLbl}>Service</label>
          <select style={selectBox} value={svc?.id || ""} onChange={e => {
            const match = filteredServices.find(s => String(s.id) === e.target.value);
            setSvc(match || null);
            setQty(""); setLink(""); setMsg("");
          }}>
            <option value="">Select Service</option>
            {filteredServices.map(s =>
              <option key={s.id} value={s.id}>
                {s.badge?.text && `[${s.badge.text}] `}{s.title}
              </option>
            )}
          </select>
        </div>
        {/* Service Details */}
        {svc && (
          <>
            <div style={descCard}>
              <b style={{ color: "#51e7f2", fontSize: ".96em" }}>
                {svc.badge?.text && <span style={{
                  background: svc.badge.color, borderRadius: 6, color: "#fff", padding: "2px 8px", fontSize: ".96em"
                }}>{svc.badge.text}</span>} {svc.title}
              </b>
            </div>
            <div style={descCard}><b>Description</b><br /><pre style={{
              margin: 0, fontSize: ".97em", color: "#d9e9f9", background: "none", border: "none", fontWeight: 600, whiteSpace: "pre-line"
            }}>{svc.desc}</pre></div>
            <div style={descCard}><b>Average Time</b><br />{svc.avgtime}</div>
            <div style={{ marginBottom: 7, color: "#a6d7ee", fontWeight: 700, fontSize: ".98em" }}>
              Min: {svc.min} - Max: {svc.max}
            </div>
          </>
        )}
        <label style={smallLbl}>Link</label>
        <input style={inputBox} placeholder="Paste link" value={link} onChange={e => setLink(e.target.value)} disabled={!svc} />
        <label style={smallLbl}>Quantity</label>
        <input style={inputBox} placeholder="Quantity" type="number" min={svc?.min||""} max={svc?.max||""} value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} disabled={!svc} />
        <div style={descCard}>
          <b>Charge</b><br />
          ₹{charge}
        </div>
        {msg && (<div style={{ color: msg[0] === "✅" ? "#65f96e" : "#ef5767", fontWeight: 700, margin: "11px 0" }}>{msg}</div>)}
        <button style={{
          marginTop: 11,
          width: "100%",
          background: "linear-gradient(90deg,#fbc44d,#39fdad 100%)",
          color: "#1b2142",
          fontWeight: 900,
          border: "none",
          borderRadius: 13,
          padding: "15px 0",
          fontSize: "1.17em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }} type="submit">
          <FaWhatsapp style={{ fontSize: "1.23em" }} /> Place Order
        </button>
      </form>
      {showFunds &&
        <AddFundsModal onClose={() => setShowFunds(false)} />
      }
    </div>
  );
}

function AddFundsModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 199,
      background: "rgba(10,30,80,0.13)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!amount || Number(amount) < 100) return setMsg("❌ Enter at least ₹100.");
          setMsg("✅ Fund request sent for approval!");
          setAmount("");
        }}
        style={{
          background: "#242e54", borderRadius: 17, width: 350, padding: 29, boxShadow: "0 8px 28px #17bfe728", position: "relative", color: "#fff"
        }}>
        <button style={{
          position: "absolute", right: 13, top: 11, border: "none", fontSize: "2.1em",
          background: "none", color: "#ffd54d", cursor: "pointer"
        }} onClick={onClose} type="button">&times;</button>
        <h2 style={{ textAlign: "center", marginBottom: 11, color: "#27fdad" }}>Add Funds</h2>
        <div style={{
          fontWeight: 700, color: "#ffd46b", marginBottom: 6, textAlign: "center"
        }}>
          UPI: <span style={{ color: "#39fdad" }}>boraxdealer@fam</span>
        </div>
        <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{
          width: 160, borderRadius: 15, margin: "14px auto 16px", display: "block", background: "#fff"
        }}/>
        <input
          type="number"
          min={100}
          placeholder="Enter Amount (₹100+)"
          style={{ width: "100%", borderRadius: 9, padding: "13px 11px", border: "1.3px solid #363e5c", margin: "6px 0 13px", color: "#242e54", fontWeight: 700 }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
        />
        <button
          style={{
            width: "100%", borderRadius: 8, background: "linear-gradient(90deg,#ffc62f,#1cec86 100%)",
            color: "#131d33", fontWeight: 900, fontSize: "1.14em", padding: "13px 0", border: "none", marginBottom: 6
          }}
          type="submit"
        >Submit</button>
        {msg && <div style={{ marginTop: 8, color: msg[0] === "✅" ? "#42e587" : "#fd4b82", fontWeight: 700, textAlign: "center" }}>{msg}</div>}
      </form>
    </div>
  );
}

function DropdownItem({ icon, label, onClick }) {
  return (
    <div onClick={onClick}
      style={{
        padding: "10px 18px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", border: "none", outline: "none", background: "none", color: "#def2fa"
      }}>
      {icon} {label}
    </div>
  );
}
// --- STYLE HELPERS ---
const tabBtn = (on) => ({
  flex: 1,
  background: on ? "linear-gradient(90deg,#14faa7,#5deffd 100%)" : "none",
  color: on ? "#222c38" : "#5eedc7",
  border: on ? "none" : "2px solid #203a61",
  borderRadius: 7,
  padding: "12px 0",
  fontWeight: 800,
  fontSize: "1.05em",
  marginRight: 6,
  boxShadow: on ? "0 1px 9px #19ffd329" : "none"
});
const searchInput = {
  width: "100%", borderRadius: 7, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  color: "#a3dbfb", background: "#1d2542", border: "1.3px solid #272d5d", marginBottom: "7px"
};
const selectBox = {
  width: "100%", borderRadius: 8, padding: "12px 10px", fontWeight: 800, background: "#181e37",
  fontSize: ".99em", color: "#e6e8ff", border: "1.5px solid #313d5b", marginBottom: 5
};
const smallLbl = { fontWeight: 700, color: "#6fcffd", margin: "5px 0 6px 2px", display: "block", fontSize: ".97em" };
const descCard = { background: "#202a47", color: "#eaf8ff", borderRadius: 8, padding: "9px 10px", fontWeight: 600, fontSize: ".98em", marginBottom: 7 };
const inputBox = { width: "100%", borderRadius: 8, padding: "13px 11px", fontWeight: 700, fontSize: "1em", background: "#171a2e", color: "#fff", border: "1.3px solid #29325a", marginBottom: 7 };
