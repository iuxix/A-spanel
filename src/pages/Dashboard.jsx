import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, doc, query, where
} from "firebase/firestore";
import {
  FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV,
  FaCogs, FaUserCircle, FaPlus, FaHistory, FaWhatsapp, FaMoon, FaSun, FaPowerOff, FaSearch
} from "react-icons/fa";

// Demo categories/services (expand as needed)
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
// Professional color/gradient for themes
const accent = "#0e58e9";

// -- Helper --
const getUserInitial = user =>
  user?.displayName ? user.displayName[0].toUpperCase() : (
    user?.email ? user.email[0].toUpperCase() : "U"
  );

export default function Dashboard() {
  // Live user state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState("");
  const [balance, setBalance] = useState(0.00);
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
  const [showTrackOrder, setShowTrackOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [funds, setFunds] = useState([]);
  const [search, setSearch] = useState("");
  const [orderTrackId, setOrderTrackId] = useState("");
  const [orderTrackInfo, setOrderTrackInfo] = useState(null);

  // Sync real user
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, usr => {
      setUser(usr);
      setProfile(usr?.displayName || "");
      if (usr) {
        // Wallet balance
        onSnapshot(doc(db, "users", usr.uid), d =>
          setBalance(d.exists() && d.data().balance ? d.data().balance : 0));
        // Funds
        onSnapshot(query(collection(db, "deposits"), where("user", "==", usr.uid)), snap =>
          setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.created?.toMillis?.() - a.created?.toMillis?.())));
        // Orders
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap =>
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.timestamp - a.timestamp)));
      }
    });
    return unsub;
  }, []);

  // Live charge calculation
  useEffect(() => {
    if (!svc || !qty) setCharge("0.00");
    else {
      let q = parseInt(qty, 10);
      if (isNaN(q) || q < (svc.min || 1) || q > svc.max) setCharge("0.00");
      else setCharge(((svc.price * q) / 1000).toFixed(2));
    }
  }, [svc, qty]);

  // Search and filter services by keyword
  const filteredServices = (services[cat] || []).filter(
    s => search.length < 2 || s.title.toLowerCase().includes(search.toLowerCase())
  );

  async function submitOrder(e) {
    e.preventDefault();
    setOrderMsg("");
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill in all fields.");
    let q = parseInt(qty, 10);
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

  // Settings Modal: real-time username/email/pass change
  async function handleProfileSave(newName, newMail, newPass, setInfoMsg) {
    try {
      if (newName) await updateProfile(getAuth().currentUser, { displayName: newName });
      if (newMail) await getAuth().currentUser.updateEmail(newMail);
      if (newPass) await getAuth().currentUser.updatePassword(newPass);
      setInfoMsg("✅ Profile updated.");
      setProfile(newName);
    } catch (err) {
      setInfoMsg("❌ " + err.message);
    }
  }

  // Track Order Modal logic update
  function handleTrackClose() {
    setOrderTrackId("");
    setOrderTrackInfo(null);
    setShowTrackOrder(false);
  }

  // Track Order Modal submit
  function handleTrackOrder(e) {
    e.preventDefault();
    setOrderTrackInfo(null);
    if (!orderTrackId || orders.length === 0) {
      setOrderTrackInfo("No orders placed yet.");
      return;
    }
    // Search order by ID (partial or full match)
    const found = orders.find(o => o.id === orderTrackId.trim());
    if (!found) {
      setOrderTrackInfo("Order not found!");
      return;
    }
    // Detailed info box string
    setOrderTrackInfo({
      id: found.id,
      service: found.serviceTitle || found.service_id,
      quantity: found.qty,
      link: found.link,
      status: found.status,
      charge: found.charge,
      date: new Date(found.timestamp).toLocaleString()
    });
  }

  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  /* Main dashboard markup */
  return (
    <div style={{
      minHeight: "100vh", background: theme === "dark" ? "#101634" : "#f1f7fb", color: theme === "dark" ? "#fff" : "#222", fontFamily: "Poppins,sans-serif"
    }}>
      {/* NAVBAR */}
      <nav style={{ background: theme === "dark" ? "#151d38" : "#fff", borderBottom: "2px solid #c2e6ff", boxShadow: "0 2px 8px #1e488210", padding: "13px 0" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 900, fontSize: "1.34em", letterSpacing: ".7px", color: accent, display: "flex", alignItems: "center" }}>
            {/* Fixed outline to be actual border */}
            <div style={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
              border: "2.5px solid #00e3a3",
              boxSizing: "border-box"
            }}>
              <img src="/logo.png" alt="Logo" style={{ height: 34, borderRadius: "50%" }} />
            </div>
            LucixFire Panel
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ background: "none", border: "none", borderRadius: 19, padding: "7px 12px", fontSize: "1.15em" }} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <FaSun color="#ffec5e" /> : <FaMoon color="#0c6bf6" />}
            </button>

            {/* Fixed logo outline in navbar right */}
            <div style={{
              display: "inline-block",
              border: "2.5px solid #00e3a3",
              borderRadius: "50%",
              padding: 2,
              boxSizing: "content-box"
            }}>
              <img src="/logo.png" alt="Logo" style={{ height: 32, width: 32, borderRadius: "50%", background: "#fff" }} />
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMenu(m => !m)} style={{
                background: "none", border: "none", fontSize: "1.23em",
                color: theme === "dark" ? "#14f3e3" : "#0d5690", padding: "5px 12px", borderRadius: 14,
                outline: showMenu ? "2px solid #1ec8fd" : "none"
              }}><FaEllipsisV /></button>
              {showMenu && (
                <div style={{
                  minWidth: 155, position: "absolute", top: 33, right: 0, zIndex: 11,
                  background: theme === "dark" ? "#162050" : "#eaf7fb", boxShadow: "0 5px 26px #31d7e422", borderRadius: 12
                }}>
                  <DropdownItem icon={<FaUserCircle />} label="Profile" onClick={() => { setShowProfile(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaWallet />} label="Add Funds" onClick={() => { setShowFunds(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaHistory />} label="History" onClick={() => { setShowHistory(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaCogs />} label="Settings" onClick={() => { setShowSettings(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaSearch />} label="Track Order" onClick={() => { setShowTrackOrder(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaPowerOff />} color="#e22762" label="Logout" onClick={handleLogout} />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <div style={{
        display: "flex", gap: "13px", overflowX: "auto", maxWidth: 1100, margin: "25px auto 12px", paddingBottom: 7
      }}>
        <StatCard theme={theme} icon={<FaUser />} label="Username" value={user?.displayName || user?.email || "Guest"} />
        <StatCard theme={theme} icon={<FaWallet />} label="Balance" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard theme={theme} icon={<FaChartLine />} label="Total Orders" value={orders.length} />
        <StatCard theme={theme} icon={<FaMoneyCheckAlt />} label="Spent Balance" value={`₹0.00`} />
      </div>

      {/* Banner */}
      <div style={{
        margin: "0 auto 20px", textAlign: "center", fontSize: "1.09em", color: theme === "dark" ? "#33eee6" : "#2a55b3", fontWeight: 700
      }}>
        Power up your brand with <strong>LuciXFire Panel</strong>! Pay securely, get instant orders, and <span style={{ color: "#11e463" }}>manage all SMM services in one place.</span>
      </div>

      {/* Main order/funds tabs */}
      <form style={{
        background: theme === "dark" ? "#1c2343" : "#f9fdff", borderRadius: 17, maxWidth: 510, padding: "21px 12px 15px", margin: "0 auto", boxShadow: "0 6px 31px #bbeeef33"
      }} onSubmit={submitOrder}>
        <div style={{ display: "flex", gap: 10, marginBottom: 13 }}>
          <button type="button" style={tabBtn(true, theme)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false, theme)} onClick={() => setShowFunds(true)}>💵 AddFunds</button>
        </div>
        <input style={searchInput(theme)} placeholder="Search Services..." value={search} onChange={e => setSearch(e.target.value)} />
        <label style={smallLbl}>Category</label>
        <select style={selectBox(theme)} value={cat} onChange={e => { setCat(e.target.value); setSvc(null); setQty(""); setLink(""); }}>
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <label style={smallLbl}>Services</label>
        <select style={selectBox(theme)} value={svc?.id || ""} onChange={e => {
          const found = (services[cat] || []).find(x => x.id === e.target.value);
          setSvc(found || null); setCharge("0.00"); setQty(""); setLink("");
        }}>
          <option value="">Select Service</option>
          {filteredServices.map(s =>
            <option key={s.id} value={s.id}>{s.badge ? `[${s.badge}] ` : ""}{s.title}</option>
          )}
        </select>
        {svc && (
          <>
            <div style={descCard(theme)}>
              <b style={{ color: accent, fontSize: ".97em" }}>
                {svc.badge && <span style={{
                  background: svc.badgeColor, borderRadius: 7, color: "#fff", padding: "2px 8px", marginRight: 7
                }}>{svc.badge}</span>}{svc.title}
              </b>
              <div style={{ margin: "10px 0 0" }}>
                <pre style={{ fontFamily: "inherit", margin: 0, color: "#609eb6", fontSize: ".96em" }}>{svc.desc}</pre>
              </div>
            </div>
            <div style={descCard(theme)}><b>Average Time</b><br />{svc.avgtime}</div>
            <div style={{ marginBottom: 7, color: "#6e9ba5", fontWeight: 700, fontSize: ".97em" }}>Min: {svc.min} - Max: {svc.max}</div>
          </>
        )}
        <label style={smallLbl}>Link</label>
        <input style={inputBox(theme)} placeholder="Paste link" value={link} onChange={e => setLink(e.target.value)} disabled={!svc} />
        <label style={smallLbl}>Quantity</label>
        <input style={inputBox(theme)} placeholder="Quantity" type="number" min={svc?.min || ""} max={svc?.max || ""} value={qty} onChange={e => setQty(e.target.value.replace(/^0+/, ""))} disabled={!svc} />
        <div style={descCard(theme)}><b>Charge</b><br />₹{charge}</div>
        {orderMsg && <div style={{ color: orderMsg[0] === "✅" ? "#2edc5c" : "#ef5767", fontWeight: 700, margin: "11px 0" }}>{orderMsg}</div>}
        <button style={{
          marginTop: 13, width: "100%", background: "linear-gradient(90deg,#47e8b1,#2d61ef 94%)", color: "#fff",
          fontWeight: 900, border: "none", borderRadius: 13, padding: "16px 0", fontSize: "1.14em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: ".2s box-shadow"
        }} type="submit"><FaWhatsapp style={{ fontSize: "1.19em" }} /> Place Order</button>
      </form>

      {/* Offers and AddFunds Modal */}
      {showFunds && <AddFundsModal user={user} theme={theme} onClose={() => setShowFunds(false)} />}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showHistory && <HistoryModal orders={orders} funds={funds} onClose={() => setShowHistory(false)} />}
      {showSettings && <SettingsModal user={user} onSave={handleProfileSave} onClose={() => setShowSettings(false)} />}
      {showTrackOrder && <TrackOrderModal
        info={orderTrackInfo}
        orderId={orderTrackId}
        setId={setOrderTrackId}
        onTrack={handleTrackOrder}
        onClose={handleTrackClose}
        orders={orders}
      />}
    </div>
  );
}

/* --- MODALS and STYLES --- */
function AddFundsModal({ user, theme, onClose }) {
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!amount || Number(amount) < 30) return setMsg("❌ Enter at least ₹30.");
    if (!proof) return setMsg("❌ Attach payment screenshot proof.");
    setLoading(true);
    try {
      await addDoc(collection(db, "deposits"), {
        user: user.uid,
        amount: Number(amount),
        proofName: proof.name,
        proofType: proof.type,
        status: "pending",
        created: new Date()
      });
      setMsg("✅ Fund request sent! When admin accepts your payment, balance updates.");
      setAmount(""); setProof(null);
    } catch {
      setMsg("❌ Submission failed, try again.");
    }
    setLoading(false);
  }
  return (
    <Modal title="Add Funds" onClose={onClose}>
      <div style={{
        fontWeight: 700, color: "#18c332", marginBottom: 6, textAlign: "center", fontSize: "1em",
        boxShadow: "0 3px 12px #fff8d340", padding: "7px 2px", background: "#fffbe6", borderRadius: 9
      }}>
        🎁 <span style={{ color: "#1981f7" }}>Limited Offer:</span> Deposit more than <b>₹100</b> and get <b>10% bonus credits</b> instantly!
      </div>
      <div style={{ fontWeight: 600, color: theme === "dark" ? "#40e19f" : "#222", marginBottom: 7 }}>UPI: <span style={{ color: "#2884f6", fontWeight: 900 }}>boraxdealer@fam</span></div>
      <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{ width: 145, borderRadius: 13, margin: "12px auto 16px", display: "block", background: "#fff" }} />
      <ol style={{ color: "#577ea1", fontSize: ".99em", margin: "0 0 8px 6px" }}>
        <li>Pay using UPI above or scan the QR code.</li>
        <li>Take a screenshot of your payment confirmation.</li>
        <li>Upload the screenshot and enter the amount paid (min ₹30).</li>
        <li>Wait for admin to accept your deposit. Once accepted, your balance will be updated and order power unlocked.</li>
      </ol>
      <form onSubmit={handleSubmit}>
        <input type="number" min={30}
          placeholder="Enter Amount (₹30+)"
          style={{ width: "100%", borderRadius: 8, padding: "13px 11px", border: "1.3px solid #b1daea", margin: "6px 0 11px", color: "#444", fontWeight: 700 }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
          disabled={loading}
        />
        <input type="file" accept="image/*" style={{
          width: "100%", marginBottom: 13
        }} onChange={e => setProof(e.target.files[0])} disabled={loading} />
        <button
          style={{
            width: "100%", borderRadius: 7, background: "linear-gradient(90deg,#ffc62f,#1cec86 100%)",
            color: "#131d33", fontWeight: 900, fontSize: "1.12em", padding: "13px 0", border: "none", marginBottom: 8, cursor: loading ? "not-allowed" : "pointer"
          }}
          type="submit"
          disabled={loading}
        >{loading ? "Submitting..." : "Submit"}</button>
        {msg && <div style={{ marginTop: 8, color: msg[0] === "✅" ? "#2ada70" : "#e84f7b", fontWeight: 700, textAlign: "center" }}>{msg}</div>}
      </form>
    </Modal>
  );
}

function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" onClose={onClose}>
      <div style={{ textAlign: "center", padding: 14 }}>
        <img src="/logo.png" alt="" style={{ height: 65, width: 65, borderRadius: 23, background: "#f2fffa", margin: "0 auto 10px" }} />
        <div><b style={{ fontWeight: 900 }}>{user?.displayName || user?.email || "Guest"}</b></div>
        <div style={{ color: "#369eeb" }}>LuciXFire User</div>
      </div>
    </Modal>
  );
}

function HistoryModal({ orders, funds, onClose }) {
  return (
    <Modal title="Order & Payment History" onClose={onClose}>
      <b>Orders:</b>
      <ul style={{ paddingLeft: 20, marginBottom: 13 }}>
        {orders.length === 0 ? <li style={{ color: "#bbb" }}>No orders placed yet.</li>
          : orders.slice(0, 10).map(o => <li key={o.id}>{o.serviceTitle} ({o.qty}) - <b>{o.status}</b></li>)}
      </ul>
      <b>Funds Added:</b>
      <ul style={{ paddingLeft: 20 }}>
        {funds.length === 0 ? <li style={{ color: "#bbb" }}>No funds added.</li>
          : funds.slice(0, 10).map(f =>
            <li key={f.id}>₹{f.amount} - <b style={{ color: f.status === "accepted" ? "#21ea81" : f.status === "rejected" ? "#e73f5c" : "#edd12f" }}>{f.status}</b></li>
          )}
      </ul>
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
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontWeight: 700 }}>Username</label>
          <input style={{ width: "100%", padding: "11px", margin: "3px 0 6px", borderRadius: 7 }} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontWeight: 700 }}>Email</label>
          <input style={{ width: "100%", padding: "11px", margin: "3px 0 8px", borderRadius: 7 }} value={mail} onChange={e => setMail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 700 }}>Password</label>
          <input style={{ width: "100%", padding: "11px", margin: "3px 0 8px", borderRadius: 7 }} type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button style={{
          width: "100%", padding: "12px 0", fontWeight: 800, borderRadius: 7, border: "none", background: "linear-gradient(90deg,#32d28e,#1c77db)",
          color: "#fff", fontSize: "1.08em"
        }}
        >Change Info</button>
        {info && <div style={{ marginTop: 8, fontWeight: 700, color: info[0] === "✅" ? "#09bd87" : "#d44329" }}>{info}</div>}
      </form>
    </Modal>
  );
}

function TrackOrderModal({ info, orderId, setId, onTrack, onClose, orders }) {
  // info is either string or detailed order object per fix above
  return (
    <Modal title="Track Order" onClose={onClose}>
      <form onSubmit={onTrack}>
        {/* If no orders, blocking text below will show */}
        <input style={{ width: "100%", padding: "12px", marginBottom: 13, borderRadius: 7 }} value={orderId} onChange={e => setId(e.target.value)} placeholder="Enter Order ID" />
        <button style={{ width: "100%", padding: "12px 0", fontWeight: 800, borderRadius: 7, border: "none", background: "linear-gradient(90deg,#43aecb,#55fa84)", color: "#fff", fontSize: "1.07em" }}>Track</button>
      </form>
      <div style={{ marginTop: 13, fontWeight: 700 }}>
        {typeof info === "string" ?
          <div style={{ color: info === "Order not found!" ? "#ca4261" : "#2bd77e", whiteSpace: "pre-wrap" }}>{info}</div>
          : info ? (
            <div style={{
              border: "2px solid #27d77e",
              borderRadius: 10,
              padding: 12,
              background: "#e6fff3",
              color: "#1a6b3a",
              whiteSpace: "pre-wrap",
              fontSize: "0.95em",
              lineHeight: "1.3em"
            }}>
              <div><b>Order ID:</b> {info.id}</div>
              <div><b>Service:</b> {info.service}</div>
              <div><b>Quantity:</b> {info.quantity}</div>
              <div><b>Link:</b> <a href={info.link} target="_blank" rel="noreferrer" style={{ color: "#1483e8" }}>{info.link}</a></div>
              <div><b>Status:</b> {info.status}</div>
              <div><b>Charge:</b> ₹{info.charge}</div>
              <div><b>Date:</b> {info.date}</div>
            </div>
          ) : <div style={{ color: "#999", fontStyle: "italic" }}>Enter order ID and click Track.</div>
        }
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 121, background: "rgba(32,38,67,0.18)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, minWidth: 310, maxWidth: "99vw", color: "#12243a",
        boxShadow: "0 10px 36px #24deff45", padding: "26px 16px 14px", position: "relative"
      }}>
        <button type="button" onClick={onClose} style={{
          position: "absolute", right: 12, top: 10, border: "none", fontSize: "2em", background: "none", color: "#38dbad", cursor: "pointer"
        }}>&times;</button>
        <div style={{ fontWeight: 900, fontSize: "1.11em", marginBottom: 11, color: "#136cae" }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, theme }) {
  return (
    <div style={{
      flex: "0 0 170px", background: theme === "dark" ? "#1d2750" : "#e3f5ff", borderRadius: 13, minWidth: 150, boxShadow: "0 2px 10px #0ab8ed13", padding: "18px 13px"
    }}>
      <span style={{
        background: theme === "dark" ? "#243766" : "#bbebfb", borderRadius: 6, padding: "7px 10px", fontSize: "1.2em", marginBottom: 7, display: "inline-block"
      }}>{icon}</span>
      <span style={{ fontWeight: 700, color: "#2d6697", fontSize: ".99em", display: "block" }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: "1.13em", marginTop: 4, display: "block" }}>{value}</span>
    </div>
  );
}

function DropdownItem({ icon, label, onClick, color }) {
  return (
    <div onClick={onClick} style={{
      padding: "10px 18px", display: "flex", alignItems: "center", gap: 8,
      cursor: "pointer", background: "none", color: color || "#1273ad"
    }}>
      {icon} {label}
    </div>
  );
}

const tabBtn = (on, theme) => ({
  flex: 1,
  background: on ? "linear-gradient(90deg,#2cbc9b,#2185df 100%)" : "none",
  color: on ? "#fff" : "#2094bc",
  border: on ? "none" : "2px solid #b8dafc",
  borderRadius: 8,
  padding: "12px 0",
  fontWeight: 800,
  fontSize: "1.12em",
  marginRight: 8,
  boxShadow: on ? "0 1px 8px #a9eeb9" : "none",
  transition: ".18s box-shadow"
});
const selectBox = theme => ({
  width: "100%", borderRadius: 7, padding: "12px 10px", fontWeight: 800, background: theme === "dark" ? "#162040" : "#eef8fd",
  fontSize: ".99em", color: "#2468c7", border: "1.5px solid #bfd8fa", marginBottom: 7
});
const inputBox = theme => ({
  width: "100%", borderRadius: 8, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  background: theme === "dark" ? "#151933" : "#f4f9ff", color: "#244", border: "1.3px solid #c7e4fa", marginBottom: 7
});
const smallLbl = { fontWeight: 700, color: "#137de6", margin: "6px 0 6px 2px", display: "block", fontSize: ".97em" };
const descCard = theme => ({
  background: theme === "dark" ? "#252a4a" : "#f3f8fc", color: theme === "dark" ? "#e1f4ff" : "#49789c",
  borderRadius: 8, padding: "10px 10px", fontWeight: 600, fontSize: ".99em", marginBottom: 7
});
const searchInput = theme => ({
  width: "100%", borderRadius: 7, padding: "13px 11px", fontWeight: 700, fontSize: "1em",
  color: "#2d7be3", background: theme === "dark" ? "#232e4b" : "#e3f1fa", border: "1.3px solid #c0dcfc", marginBottom: "11px"
});
