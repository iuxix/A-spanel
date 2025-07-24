import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, query, where } from "firebase/firestore";
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

// Theme Colors & Accents
const primaryColor = "#1b365d";      // Deep Blue
const secondaryColor = "#2b539f";    // Soft Blue
const accentColor = "#54c7ec";       // Light Cyan
const textLight = "#f0f8ff";
const textDark = "#12243a";

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
  const [loadingFundsSubmit, setLoadingFundsSubmit] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, usr => {
      setUser(usr);
      if (usr) {
        // Wallet Balance
        onSnapshot(doc(db, "users", usr.uid), d => {
          setBalance(d.exists() && d.data().balance ? d.data().balance : 0);
        });
        // Funds
        onSnapshot(query(collection(db, "deposits"), where("user", "==", usr.uid)), snap =>
          setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.created?.toMillis?.() - a.created?.toMillis?.()))
        );
        // Orders
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
    if (!svc || !qty || !link) return setOrderMsg("❌ Please fill in all required fields.");
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
      setOrderMsg("✅ Order placed successfully! Track orders in My Orders menu.");
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
      setInfoMsg("✅ Profile updated successfully!");
    } catch (err) {
      setInfoMsg("❌ " + err.message);
    }
  }

  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  // AddFundsModal submission handler for fixed "Add Funds" modal with QR & steps
  async function handleAddFundsSubmit(amount, setMsg, resetInput) {
    setMsg("");
    if (!amount || Number(amount) < 30) return setMsg("❌ Please enter at least ₹30.");
    setLoadingFundsSubmit(true);
    try {
      await addDoc(collection(db, "deposits"), {
        user: user.uid,
        username: user.displayName || user.email || "Unknown",
        amount: Number(amount),
        status: "pending",
        created: new Date()
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
      background: theme === "dark" ? primaryColor : "#fefefe",
      color: theme === "dark" ? textLight : textDark,
      fontFamily: "'Poppins', sans-serif",
      transition: "background-color 0.3s ease, color 0.3s ease",
      position: "relative",
      paddingBottom: 60
    }}>
      {/* NAVBAR */}
      <nav style={{
        background: theme === "dark" ? secondaryColor : "#fff",
        borderBottom: `2px solid ${accentColor}`,
        boxShadow: "0 3px 12px rgba(43,83,159,0.15)",
        padding: "16px 0"
      }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            color: accentColor,
            fontWeight: 900,
            fontSize: "1.42em",
            letterSpacing: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 14
          }}>
            <img src="/logo.png" alt="LucixFire Logo" style={{ height: 38, borderRadius: "50%", background: "transparent" }} />
            LucixFire Panel
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title="Toggle Theme"
              style={{
                color: theme === "dark" ? "#ffeb3b" : "#0c4fcc",
                fontSize: "1.4em",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                userSelect: "none"
              }}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <img src="/logo.png" alt="User Avatar" style={{ height: 36, width: 36, borderRadius: "50%" }} />

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowMenu(m => !m)}
                aria-label="Open menu"
                title="Menu"
                style={{
                  background: "none",
                  border: "none",
                  color: theme === "dark" ? "#a9dfff" : "#064f91",
                  fontSize: "1.6em",
                  padding: "6px 14px",
                  borderRadius: 18,
                  cursor: "pointer",
                  outline: showMenu ? `2px solid ${accentColor}` : "none",
                  userSelect: "none",
                  transition: "color 0.3s"
                }}
              ><FaEllipsisV /></button>

              {showMenu && (
                <div
                  role="menu"
                  style={{
                    background: theme === "dark" ? "#164073" : "#f9fcff",
                    borderRadius: 14,
                    position: "absolute",
                    top: 40,
                    right: 0,
                    boxShadow: "0 8px 23px rgba(34,97,151,0.25)",
                    minWidth: 180,
                    zIndex: 30
                  }}
                >
                  <DropdownItem icon={<FaUserCircle />} label="Profile" onClick={() => { setShowProfile(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaWallet />} label="Add Funds" onClick={() => { setShowFunds(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaHistory />} label="My Orders" onClick={() => { setShowHistory(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaCogs />} label="Settings" onClick={() => { setShowSettings(true); setShowMenu(false); }} />
                  <DropdownItem icon={<FaPowerOff />} color="#d32f3e" label="Logout" onClick={handleLogout} />
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
        gap: 20,
        overflowX: "auto",
        padding: "0 12px"
      }}>
        <StatCard theme={theme} icon={<FaUser />} label="Username" value={user?.displayName || user?.email || "Guest"} />
        <StatCard theme={theme} icon={<FaWallet />} label="Balance" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard theme={theme} icon={<FaChartLine />} label="Total Orders" value={orders.length} />
        <StatCard theme={theme} icon={<FaMoneyCheckAlt />} label="Spent Balance" value={`₹0.00`} />
      </section>

      {/* Banner with professional text and subtle emojis */}
      <section style={{
        maxWidth: 720,
        margin: "0 auto 36px",
        padding: "0 14px",
        textAlign: "center",
        fontWeight: 600,
        fontSize: "1.16em",
        lineHeight: 1.48,
        color: theme === "dark" ? accentColor : primaryColor,
        userSelect: "none"
      }}>
        🚀 <strong>LuciXFire Panel</strong> is your all-in-one Social Media Marketing platform — delivering secure payments, instant order processing, and comprehensive campaign management. Elevate your brand effortlessly with scalable services trusted by professionals worldwide. Support is just a message away to ensure your success.
      </section>

      {/* Main Order Form */}
      <form
        onSubmit={submitOrder}
        style={{
          maxWidth: 530,
          margin: "0 auto 48px",
          background: theme === "dark" ? secondaryColor : "#fdfefe",
          borderRadius: 22,
          padding: "28px 22px",
          boxShadow: theme === "dark" ? "0 10px 32px rgba(32,48,85,0.55)" : "0 7px 28px rgba(39,71,114,0.12)",
          color: theme === "dark" ? textLight : textDark,
          userSelect: "none"
        }}
        noValidate
      >
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
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
          spellCheck={false}
          aria-label="Search services"
        />

        <label style={smallLbl}>Category</label>
        <select
          aria-label="Category"
          value={cat}
          onChange={e => { setCat(e.target.value); setSvc(null); setQty(""); setLink(""); }}
          style={selectBox(theme)}
        >
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <label style={smallLbl}>Services</label>
        <select
          aria-label="Services"
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
                    padding: "5px 12px",
                    marginRight: 10,
                    fontWeight: 700,
                    fontSize: ".9em",
                    userSelect: "none"
                  }}>
                    {svc.badge}
                  </span>
                )}
                {svc.title}
              </strong>
              <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "#94c0ed", fontSize: "0.95em" }}>{svc.desc}</pre>
            </div>
            <div style={descCard(theme)}>
              <b>Average Time</b><br />{svc.avgtime}
            </div>
            <div style={{ marginBottom: 10, fontWeight: 700, fontSize: ".95em", color: "#9bbfff" }}>
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
          autoComplete="off"
          spellCheck={false}
          required={!!svc}
          aria-describedby="link-desc"
        />
        <small id="link-desc" style={{ color: accentColor, marginBottom: 6, display: "block", fontSize: "0.82em", userSelect: "none" }}>
          Please paste the correct post/profile link for accurate service delivery.
        </small>

        <label style={smallLbl}>Quantity</label>
        <input
          type="number"
          placeholder="Quantity"
          min={svc?.min || 1}
          max={svc?.max || 1000000}
          value={qty}
          onChange={e => setQty(e.target.value.replace(/^0+/, ""))}
          style={inputBox(theme)}
          disabled={!svc}
          required={!!svc}
          autoComplete="off"
          aria-label="Quantity"
        />

        <div style={descCard(theme)}>
          <b>Charge</b><br />₹{charge}
        </div>

        {orderMsg && (
          <div style={{
            fontWeight: 700,
            marginTop: 14,
            textAlign: "center",
            color: orderMsg.startsWith("✅") ? "#4ed964" : "#ff6060",
            userSelect: "none"
          }}>
            {orderMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={!svc || !qty || !link || charge === "0.00"}
          style={{
            marginTop: 18,
            width: "100%",
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
            color: "#fff",
            fontWeight: 900,
            fontSize: "1.15em",
            padding: "16px 0",
            borderRadius: 16,
            border: "none",
            cursor: (!svc || !qty || !link || charge === "0.00") ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            userSelect: "none",
            transition: "background-color 0.3s ease"
          }}
          aria-disabled={!svc || !qty || !link || charge === "0.00"}
        >
          <FaWhatsapp style={{ fontSize: "1.3em" }} /> Place Order
        </button>
      </form>

      {/* MODALS */}
      {showFunds && <AddFundsModal user={user} theme={theme} onClose={() => setShowFunds(false)} loading={loadingFundsSubmit} onSubmit={handleAddFundsSubmit} />}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      {showHistory && <HistoryModal orders={orders} onClose={() => setShowHistory(false)} />}
      {showSettings && <SettingsModal user={user} onSave={handleProfileSave} onClose={() => setShowSettings(false)} />}

      {/* FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: "18px 10px",
        fontSize: "0.9em",
        color: theme === "dark" ? "#87a6d9" : "#3a4a6f",
        borderTop: `1px solid ${accentColor}`,
        userSelect: "none",
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: theme === "dark" ? primaryColor : "#fefefe"
      }}>
        © {new Date().getFullYear()} LucixFire Panel. All rights reserved.
      </footer>
    </div>
  );
}

// AddFundsModal restored with QR & steps, fixed submit button
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
        marginBottom: 10,
        textAlign: "center",
        fontSize: "1.05em",
        backgroundColor: "#e8fff3",
        padding: "10px 14px",
        borderRadius: 9,
        lineHeight: 1.3,
        userSelect: "none"
      }}>
        🎁 <span style={{ color: "#1981f7" }}>Limited Offer:</span> Deposit over <b>₹100</b> to receive an instant <b>10% bonus credit</b>! 🎉
      </div>

      <div style={{
        fontWeight: 600,
        color: theme === "dark" ? "#40e19f" : "#222",
        marginBottom: 12,
        textAlign: "center",
        fontSize: "0.95em",
        userSelect: "none"
      }}>
        <b>UPI:</b> <span style={{ color: "#2884f6", fontWeight: "900" }}>boraxdealer@fam</span>
      </div>

      <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR Code" style={{ width: 150, borderRadius: 14, margin: "10px auto 18px", display: "block", background: "#fff" }} />

      <ol style={{ color: "#577ea1", fontSize: "0.95em", margin: "0 0 14px 12px", userSelect: "none" }}>
        <li>Pay via UPI using the ID above or scan the QR code.</li>
        <li>Take a screenshot of your payment confirmation.</li>
        <li>Submit the amount you've paid below (minimum ₹30).</li>
        <li>Admin will verify and approve your deposit shortly.</li>
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="number"
          min={30}
          placeholder="Enter Amount (₹30+)"
          style={{
            width: "100%",
            borderRadius: 8,
            padding: "14px 12px",
            border: "1.7px solid #b1d7f9",
            fontWeight: 700,
            fontSize: "1em",
            marginBottom: 18,
            color: "#222"
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
            padding: "16px 0",
            fontWeight: 900,
            borderRadius: 10,
            border: "none",
            userSelect: "none",
            cursor: loading ? "wait" : "pointer",
            background: loading ? "#90caf9" : "linear-gradient(90deg, #42a5f5, #1e88e5)",
            color: "#fff",
            fontSize: "1.12em",
            transition: "background-color 0.3s ease"
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {msg && (
          <div style={{
            marginTop: 14,
            fontWeight: 700,
            textAlign: "center",
            color: msg.startsWith("✅") ? "#43a047" : "#d32f2f"
          }}>
            {msg}
          </div>
        )}
      </form>
    </Modal>
  );
}

// Other modals...

function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" onClose={onClose}>
      <div style={{ textAlign: "center", padding: 20, userSelect: "none" }}>
        <img src="/logo.png" alt="User avatar" style={{ height: 68, width: 68, borderRadius: 20, background: "transparent", marginBottom: 14 }} />
        <div style={{ fontWeight: 700, fontSize: "1.24em", marginBottom: 8, color: primaryColor }}>
          {user?.displayName || user?.email || "Guest"}
        </div>
        <div style={{ color: secondaryColor, fontWeight: 600 }}>LuciXFire User</div>
      </div>
    </Modal>
  );
}

function HistoryModal({ orders, onClose }) {
  return (
    <Modal title="My Orders" onClose={onClose}>
      {orders.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic", textAlign: "center", marginTop: 28 }}>
          You have not placed any orders yet.
        </p>
      ) : (
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 6 }}>
          {orders.map(o => (
            <div key={o.id} style={{
              border: `2px solid ${accentColor}`,
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
              backgroundColor: "#e9f5fb",
              color: primaryColor,
              fontSize: "0.95em",
              boxShadow: "0 6px 18px rgba(26, 91, 132, 0.1)",
              userSelect: "text"
            }}>
              <div><b>Order ID:</b> {o.id}</div>
              <div><b>Service:</b> {o.serviceTitle || o.service_id}</div>
              <div><b>Quantity:</b> {o.qty}</div>
              <div><b>Link:</b> <a href={o.link} target="_blank" rel="noreferrer" style={{ color: accentColor, wordBreak: "break-word" }}>{o.link}</a></div>
              <div><b>Price:</b> ₹{o.charge.toFixed(2)}</div>
              <div><b>Status:</b> <span style={{ color: o.status === "pending" ? "#f0ad4e" : o.status === "completed" ? "#43a047" : "#d32f2f", fontWeight: 700 }}>{o.status}</span></div>
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
      <form onSubmit={e => { e.preventDefault(); onSave(name, mail, pass, setInfo); }} noValidate style={{ userSelect: "none" }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 700 }}>Username</label>
          <input style={inputBox("light")} value={name} onChange={e => setName(e.target.value)} autoComplete="username" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 700 }}>Email</label>
          <input style={inputBox("light")} value={mail} onChange={e => setMail(e.target.value)} autoComplete="email" />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontWeight: 700 }}>Password</label>
          <input style={inputBox("light")} type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="new-password" />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px 0",
            fontWeight: 900,
            borderRadius: 14,
            border: "none",
            background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
            color: "#fff",
            fontSize: "1.14em",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          Change Info
        </button>
        {info && (
          <div style={{ marginTop: 14, fontWeight: 700, color: info.startsWith("✅") ? "#2e7d32" : "#d32f2f" }}>
            {info}
          </div>
        )}
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
      background: "rgba(27, 54, 93, 0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 160,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 22,
        maxWidth: "95vw",
        width: 380,
        maxHeight: "85vh",
        overflowY: "auto",
        padding: 28,
        boxShadow: "0 14px 38px rgba(27, 54, 93, 0.3)",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            border: "none",
            background: "none",
            fontSize: 28,
            color: primaryColor,
            cursor: "pointer",
            userSelect: "none",
            lineHeight: 1
          }}
        >
          &times;
        </button>
        <h3 style={{ color: primaryColor, fontWeight: 900, marginBottom: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, theme }) {
  return (
    <div style={{
      flex: "0 0 170px",
      background: theme === "dark" ? "#294a81" : "#e9f1fc",
      borderRadius: 18,
      minWidth: 160,
      boxShadow: "0 6px 18px rgba(15, 75, 130, 0.1)",
      padding: "24px 18px",
      userSelect: "none",
      color: theme === "dark" ? textLight : textDark,
      transition: "background-color 0.25s ease, color 0.25s ease"
    }}>
      <span style={{
        background: theme === "dark" ? "#1e3562" : "#d6e7fc",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: "1.35em",
        marginBottom: 10,
        display: "inline-block",
        color: accentColor
      }}>{icon}</span>
      <div style={{ fontWeight: 700, fontSize: "1.05em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: "1.3em" }}>{value}</div>
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
        padding: "14px 22px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        color: color || primaryColor,
        fontWeight: 700,
        fontSize: "1em",
        userSelect: "none",
        transition: "background-color 0.2s ease",
        outline: "none"
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = "#d6e8ff"}
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
  padding: "14px 0",
  borderRadius: 14,
  fontWeight: 900,
  fontSize: "1.18em",
  cursor: "default",
  userSelect: "none",
  boxShadow: active ? `0 2px 12px ${accentColor}` : "none",
  transition: "background-color 0.3s, color 0.3s"
});

const selectBox = theme => ({
  width: "100%",
  borderRadius: 14,
  padding: "14px 14px",
  fontWeight: 700,
  background: theme === "dark" ? secondaryColor : "#fcfeff",
  fontSize: "1.02em",
  color: theme === "dark" ? textLight : primaryColor,
  border: `1.6px solid ${accentColor}`,
  marginBottom: 14,
  userSelect: "none",
  outline: "none",
  transition: "border-color 0.3s"
});

const inputBox = theme => ({
  width: "100%",
  borderRadius: 14,
  padding: "14px 14px",
  fontWeight: 700,
  fontSize: "1.02em",
  background: theme === "dark" ? "#284781" : "#fcfcfc",
  color: theme === "dark" ? textLight : primaryColor,
  border: `1.6px solid ${accentColor}`,
  marginBottom: 14,
  userSelect: "text",
  outline: "none",
  transition: "border-color 0.3s"
});

const smallLbl = {
  fontWeight: 700,
  color: accentColor,
  marginBottom: 8,
  display: "block",
  fontSize: "1.02em",
  userSelect: "none"
};

const descCard = theme => ({
  background: theme === "dark" ? "#2d4e8a" : "#e7f2fc",
  color: theme === "dark" ? accentColor : primaryColor,
  borderRadius: 18,
  padding: "18px 16px",
  fontWeight: 600,
  fontSize: "0.98em",
  marginBottom: 14,
  userSelect: "text",
  whiteSpace: "pre-wrap"
});

const searchInput = theme => ({
  width: "100%",
  borderRadius: 14,
  padding: "14px 14px",
  fontWeight: 700,
  fontSize: "1.08em",
  color: accentColor,
  background: theme === "dark" ? secondaryColor : "#e9f0fa",
  border: `1.6px solid ${accentColor}`,
  marginBottom: 18,
  outline: "none",
  userSelect: "text"
});
