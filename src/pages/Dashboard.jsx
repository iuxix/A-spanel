import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";
import { FaWallet, FaUser, FaChartLine, FaMoneyCheckAlt, FaEllipsisV, FaCogs, FaUserCircle, FaPlus, FaHistory, FaWhatsapp, FaMoon, FaSun, FaPowerOff, FaSearch } from "react-icons/fa";

// --- Categories & Services ---

const categories = [
  { value: "new-ig", label: "⭐ New IG Services 😎⭐" },
  { value: "ig-followers-new", label: "IG Followers New" },
  { value: "telegram", label: "Telegram" },
];
// Sample strong SMM structure; add more as needed
const services = {
  "new-ig": [
    { id: "1572", title: "Instagram Reels Views [NoN~Drop | Emergency Working Update | 10M/Day | Lifetime]", badge: "1572", badgeColor: "#0587f1", desc: "Start: Instant\nSpeed: 10M/Day\nDrop: No\nREFILL: Lifetime", avgtime: "3 hours", min: 100, max: 1000000, price: 0.13 }
  ],
  "ig-followers-new": [
    { id: "10571", title: "Instagram Followers Old Accounts | 365 Days Refill", badge: "10571", badgeColor: "#5f9efc", desc: "Quality: Old Accounts\nRefill: 365 Days Refill ♻️", avgtime: "5 hours", min: 100, max: 1000000, price: 121.5 }
  ],
  "telegram": [
    { id: "3011", title: "Telegram Post Views Auto", badge: "TG", badgeColor: "#15b6f1", desc: "Instant delivery, non drop", avgtime: "1 hour", min: 100, max: 4000000, price: 0.02 }
  ]
};

const accent = "#348aff";
const accentBox = "#263360";
const surface = "#171b2d";
const statsBox = "#212641";
const borderClr = "#47e8a8";

export default function Dashboard() {
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

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, usr => {
      setUser(usr);
      setProfile(usr?.displayName || (usr?.email ? usr.email.split("@")[0] : ""));
      if (usr) {
        onSnapshot(doc(db, "users", usr.uid), d =>
          setBalance(d.exists() && typeof d.data().balance === "number" ? d.data().balance : 0));
        onSnapshot(query(collection(db, "deposits"), where("user", "==", usr.uid)), snap =>
          setFunds(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.created?.toMillis?.() - a.created?.toMillis?.())));
        onSnapshot(query(collection(db, "orders"), where("user", "==", usr.uid)), snap =>
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.timestamp - a.timestamp)));
      }
    });
  }, []);

  useEffect(() => {
    if (!svc || !qty) setCharge("0.00");
    else setCharge(((svc.price * Math.max(Number(qty) || 0, 0)) / 1000).toFixed(2));
  }, [svc, qty]);

  const filteredServices = (services[cat] || []).filter(
    s => !search || s.title.toLowerCase().includes(search.toLowerCase())
  );

  async function submitOrder(e) {
    e.preventDefault();
    setOrderMsg("");
    if (!svc || !qty || !link) return setOrderMsg("❌ Fill in all fields.");
    const q = parseInt(qty, 10);
    if (isNaN(q) || q < svc.min || q > svc.max) return setOrderMsg(`❌ Min: ${svc.min} - Max: ${svc.max}`);
    if (parseFloat(charge) > parseFloat(balance)) return setOrderMsg("❌ Not enough balance.");
    if (!user) return setOrderMsg("❌ Login to order.");
    // Place order + get the Firestore-generated order ID
    const docRef = await addDoc(collection(db, "orders"), {
      user: user.uid, service_id: svc.id, link, qty: q, charge: parseFloat(charge),
      timestamp: Date.now(), status: "pending", cat, serviceTitle: svc.title
    });
    setOrderMsg(`✅ Order placed! Order ID: ${docRef.id}`);
    setSvc(null); setLink(""); setQty(""); setCharge("0.00");
  }

  // Track order: show ORDER INFO boxes if found
  async function handleTrackOrder(e) {
    e.preventDefault();
    setOrderTrackInfo(null);
    if (!orderTrackId) return;
    const found = orders.find(o => o.id === orderTrackId);
    setOrderTrackInfo(found && typeof found === "object" ? found : "No orders yet.");
  }
  function handleLogout() {
    signOut(getAuth()).then(() => { window.location = "/"; });
  }

  // --- UI ---
  return (
    <div style={{
      minHeight: "100vh",
      background: surface,
      color: "#fff",
      fontFamily: "Poppins,sans-serif"
    }}>
      {/* NAVBAR */}
      <nav style={{
        background: "#212852",
        borderBottom: "2px solid #155efc",
        boxShadow: "0 2px 7px #0b254d49",
        padding: "15px 0"
      }}>
        <div style={{maxWidth:550,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontWeight:800,fontSize:"1.22em",letterSpacing:".8px",color:"#229afd",display:"flex",alignItems:"center"}}>
            <img src="/logo.png" alt="" style={{
              height:34,width:34,borderRadius:"50%",background:statsBox,border:`2.5px solid ${borderClr}`,marginRight:10
            }}/>
            LucixFire Panel
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button style={{
              background:"none",border:"none",borderRadius:19,padding:"7px 11px",fontSize:"1.15em",color:"#ffee55"
            }} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
              {theme==="dark"?<FaSun/>:<FaMoon/>}
            </button>
            <span style={{
              border:`2px solid ${borderClr}`,borderRadius:"50%",
              background:statsBox,width:32,height:32,display:"grid",placeItems:"center"
            }}>
              <img src="/logo.png" alt="" style={{height:28,width:28,borderRadius:"50%"}}/>
            </span>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowMenu(m=>!m)} style={{
                background:"none",border:"none",fontSize:"1.23em",
                color:"#44f9e3",padding:"5px 13px",borderRadius:14,
                outline:showMenu?"2px solid #65eefd":"none"
              }}><FaEllipsisV/></button>
              {showMenu && (
                <div style={{
                  minWidth:163,position:"absolute",top:35,right:0,zIndex:11,background:statsBox,
                  boxShadow:"0 5px 26px #219fff49",borderRadius:12
                }}>
                  <DropdownItem icon={<FaUserCircle />} label="Profile" onClick={()=>{setShowProfile(true);setShowMenu(false);}}/>
                  <DropdownItem icon={<FaWallet />} label="Add Funds" onClick={()=>{setShowFunds(true);setShowMenu(false);}}/>
                  <DropdownItem icon={<FaHistory />} label="History" onClick={()=>{setShowHistory(true);setShowMenu(false);}}/>
                  <DropdownItem icon={<FaCogs />} label="Settings" onClick={()=>{setShowSettings(true);setShowMenu(false);}}/>
                  <DropdownItem icon={<FaSearch/>} label="Track Order" onClick={()=>{setShowTrackOrder(true);setShowMenu(false);}}/>
                  <DropdownItem icon={<FaPowerOff/>} color="#ef2e6b" label="Logout" onClick={handleLogout}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Stats */}
      <div style={{
        display:"flex",gap:"13px",overflowX:"auto",maxWidth:1100,margin:"25px auto 15px",paddingBottom:7
      }}>
        <StatCard icon={<FaUser/>} label="Username" value={profile||user?.displayName||user?.email}/>
        <StatCard icon={<FaWallet/>} label="Balance" value={`₹${balance.toFixed(2)} INR`} />
        <StatCard icon={<FaChartLine/>} label="Total Orders" value={orders.length} />
        <StatCard icon={<FaMoneyCheckAlt/>} label="Spent Balance" value={`₹0.00`} />
      </div>
      {/* Main Order/Funds Tabs, matches your screenshot */}
      <form style={{
        background: accentBox,borderRadius:17,maxWidth:510,padding:"21px 12px 15px",
        margin:"0 auto",boxShadow:"0 8px 25px #32e3ee32"
      }} onSubmit={submitOrder}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <button type="button" style={tabBtn(true)}>🛒 New Order</button>
          <button type="button" style={tabBtn(false)} onClick={()=>setShowFunds(true)}>💵 AddFunds</button>
        </div>
        <input style={searchInput} placeholder="Search Services..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <label style={smallLbl}>Category</label>
        <select style={selectBox} value={cat} onChange={e=>{
          setCat(e.target.value);setSvc(null);setQty("");setLink("");}}>
          {categories.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <label style={smallLbl}>Services</label>
        <select style={selectBox} value={svc?.id || ""} onChange={e=>{
          const found = (services[cat]||[]).find(x=>x.id===e.target.value);
          setSvc(found||null);setCharge("0.00");setQty("");setLink("");
        }}>
          <option value="">Select Service</option>
          {filteredServices.map(s=>
            <option key={s.id} value={s.id}>{s.badge ? `[${s.badge}] ` : ""}{s.title}</option>
          )}
        </select>
        {svc && (
          <>
            <div style={descCard}>
              <b style={{color:"#27b3f7",fontSize:".97em"}}>
                {svc.badge && <span style={{
                  background:svc.badgeColor,borderRadius:7,color:"#fff",padding:"2px 8px",marginRight:7
                }}>{svc.badge}</span>}{svc.title}
              </b>
              <div style={{margin:"10px 0 0"}}>
                <pre style={{fontFamily:"inherit",margin:0,color:"#6bbfec",fontSize:".96em"}}>{svc.desc}</pre>
              </div>
            </div>
            <div style={descCard}><b>Average Time</b><br/>{svc.avgtime}</div>
            <div style={{marginBottom:7,color:"#8bade1",fontWeight:700,fontSize:".97em"}}>Min: {svc.min} - Max: {svc.max}</div>
          </>
        )} 
        <label style={smallLbl}>Link</label>
        <input style={inputBox} placeholder="Paste link" value={link} onChange={e=>setLink(e.target.value)} disabled={!svc}/>
        <label style={smallLbl}>Quantity</label>
        <input style={inputBox} placeholder="Quantity" type="number" min={svc?.min||""} max={svc?.max||""} value={qty} onChange={e=>setQty(e.target.value.replace(/^0+/, ""))} disabled={!svc}/>
        <div style={descCard}><b>Charge</b><br/>₹{charge}</div>
        {orderMsg && <div style={msgBox(orderMsg)}>{orderMsg}</div>}
        <button style={{
          marginTop:13,width:"100%",background:"linear-gradient(90deg,#41f7e1,#61e855 94%)",color:"#222",
          fontWeight:900,border:"none",borderRadius:13,padding:"16px 0",fontSize:"1.15em",display:"flex",alignItems:"center",justifyContent:"center",gap:10
        }} type="submit"><FaWhatsapp style={{fontSize:"1.19em"}}/> Place Order</button>
      </form>
      {showFunds && <AddFundsModal user={user} onClose={()=>setShowFunds(false)}/>}
      {showProfile && <ProfileModal user={user} onClose={()=>setShowProfile(false)} />}
      {showHistory && <HistoryModal orders={orders} funds={funds} onClose={()=>setShowHistory(false)} />}
      {showSettings && <SettingsModal user={user} onClose={()=>setShowSettings(false)}/>}
      {showTrackOrder && <TrackOrderModal
        order={orderTrackInfo}
        orderId={orderTrackId}
        setId={setOrderTrackId}
        onTrack={handleTrackOrder}
        onClose={()=>setShowTrackOrder(false)}
      />}
    </div>
  );
}

function AddFundsModal({ user, onClose }) {
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [msg, setMsg] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) < 30) return setMsg("❌ Enter at least ₹30.");
    if (!proof) return setMsg("❌ Screenshot proof required.");
    try {
      await addDoc(collection(db, "deposits"), {
        user: user.uid, amount: Number(amount), proof: proof.name, status: "pending", created: new Date()
      });
      setMsg("✅ Fund request sent! Wait for admin approval.");
      setAmount(""); setProof(null);
    } catch {
      setMsg("❌ Submission failed, try again.");
    }
  }
  return (
    <Modal title="Add Funds" onClose={onClose}>
      <div style={{fontWeight:700,color:"#33fa7a",marginBottom:5,textAlign:"center",fontSize:"1.03em",background:"#222f4c",borderRadius:9,padding:"8px"}}>🎁 Deposit over ₹100 and get 10% bonus credits!</div>
      <div style={{ fontWeight: 600, color: "#13adea", marginBottom: 7 }}>UPI: <span style={{ color: "#289cf7", fontWeight: 900 }}>boraxdealer@fam</span></div>
      <img src="https://files.catbox.moe/xva1pb.jpg" alt="UPI QR" style={{ width: 145, borderRadius: 13, margin: "12px auto 14px", display: "block", background: "#fff" }}/>
      <ol style={{ color: "#b2d4fc", fontSize: ".98em", margin: "0 0 10px 6px" }}>
        <li>Pay using UPI above or scan QR code.</li>
        <li>Take a screenshot of payment confirmation.</li>
        <li>Upload screenshot and enter exact amount (min ₹30).</li>
        <li>Wait for admin's approval for balance update/bonus.</li>
      </ol>
      <form onSubmit={handleSubmit}>
        <input type="number" min={30}
          placeholder="Enter Amount (₹30+)"
          style={{ width: "100%", borderRadius: 8, padding: "13px 11px", border: "1.3px solid #5dc3f9", margin: "6px 0 11px", color: "#111", fontWeight: 700 }}
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/^0+/, ""))}
        />
        <input type="file" accept="image/*" style={{
          width: "100%", marginBottom: 13
        }} onChange={e => setProof(e.target.files[0])} />
        <button
  style={{
    width: "100%",
    borderRadius: 8,
    background: "linear-gradient(90deg,#ffc62f,#1cec86 100%)",
    color: "#131d33",
    fontWeight: 900,
    fontSize: "1.12em",
    padding: "13px 0",
    border: "none",
    marginBottom: 8
  }}
  type="submit"
>
  Submit
</button>
