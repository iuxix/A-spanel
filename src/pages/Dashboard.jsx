import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEllipsisV, FaWallet, FaHistory, FaCog, FaMoneyBillWave, FaSignOutAlt } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";
import { Link } from "react-router-dom";

// Inline demo categories/services. Edit as needed.
const categories = [
  { name: "Instagram", color: "#e9fffa" },
  { name: "YouTube", color: "#fcf8ef" },
  { name: "Telegram", color: "#f7fbff" },
  { name: "Facebook", color: "#f3f7ff" },
  { name: "TikTok", color: "#f8faf8" },
  { name: "Twitter", color: "#f6fcff" },
  { name: "Other", color: "#f7fff7" }
];

const allServices = [
  { cat: "Instagram", title: "IG Followers Refill 🚀", desc: "Fast, 0% Drop, Lifetime", price: 15, min: 100, max: 200000 },
  { cat: "Instagram", title: "IG Likes [Non Drop]", desc: "Real users, Ultra-fast", price: 6, min: 50, max: 30000 },
  { cat: "Instagram", title: "IG Reels Views", desc: "Instant, Dripfeed, 10M/Day", price: 0.10, min: 100, max: 1000000 },
  { cat: "YouTube", title: "YT Subscribers", desc: "Premium, 0% Drop, 1K-500K", price: 49, min: 20, max: 100000 },
  { cat: "YouTube", title: "YT Views", desc: "High Retention, Safe, 5M/Day", price: 0.07, min: 100, max: 2500000 },
  { cat: "Telegram", title: "TG Members", desc: "Real, 1M/Day, Low Drop", price: 32, min: 50, max: 50000 },
  { cat: "Facebook", title: "FB Page Likes", desc: "Lifetime, Refill", price: 17, min: 50, max: 100000 },
  { cat: "TikTok", title: "TikTok Followers", desc: "Best price, No drop", price: 19, min: 100, max: 100000 },
  { cat: "Twitter", title: "Twitter Followers", desc: "Stable, High Quality", price: 13, min: 50, max: 100000 },
  { cat: "Other", title: "Website Traffic", desc: "Geo, fast, 10M/Day", price: 0.20, min: 1000, max: 10000000 }
];

export default function Dashboard() {
  // Live user/balance/auth
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState("--");
  // Menu/modal controls
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(categories[0].name);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(""); const [link, setLink] = useState(""); const [msg, setMsg] = useState("");
  const [fundModal, setFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundMsg, setFundMsg] = useState("");

  // Watch for auth/user and load balance
  useEffect(() => {
    const auth = getAuth();
    const unregister = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);
        setBalance(snap.exists() && snap.data().balance ? snap.data().balance : 0);
      } else {
        setUser(null);
        setBalance("--");
      }
    });
    return unregister;
  }, []);

  // Order placement (deduct from balance)
  async function handleOrder(e) {
    e.preventDefault();
    if (!selected || !link || !qty) return setMsg("❌ Fill all fields.");
    if (qty < selected.min || qty > selected.max) return setMsg(`❌ Quantity: Min ${selected.min} - Max ${selected.max}`);
    const orderCost = ((selected.price * qty) / 1000).toFixed(2);
    if (Number(balance) < Number(orderCost)) return setMsg("❌ Insufficient balance.");
    try {
      // Deduct order cost from balance
      await updateDoc(doc(db, "users", user.uid), { balance: increment(-Number(orderCost)) });
      setBalance(b => (Number(b) - Number(orderCost)).toFixed(2));
      setMsg(`✅ Order Placed! `);
      setQty(""); setLink(""); setSelected(null);
    } catch {
      setMsg("❌ Order failed.");
    }
  }

  // Add Funds modal – Demo: just increases local balance, write your real payment flow!
  async function handleAddFunds(e) {
    e.preventDefault();
    if (!fundAmount || isNaN(fundAmount) || Number(fundAmount) < 10)
      return setFundMsg("❌ Enter amount ≥ ₹10");
    await updateDoc(doc(db, "users", user.uid), { balance: increment(Number(fundAmount)) });
    setBalance(b => (Number(b) + Number(fundAmount)).toFixed(2));
    setFundMsg("✅ Funds added!");
    setTimeout(() => { setFundModal(false); setFundAmount(""); setFundMsg(""); }, 1200);
  }

  // UI
  return (
    <div style={{minHeight:"100vh",background:"#f7fcfb",paddingBottom:18}}>
      {/* Header */}
      <div style={{
        background:"#fff", boxShadow:"0 2px 14px #2ae7b820",
        padding:"25px 0 12px 0", display:"flex", alignItems:"center",
        justifyContent:"space-between", maxWidth:1080, margin:"0 auto"
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12,paddingLeft:12}}>
          <img src="/logo.png" alt="LuciXFire" style={{
            width:46,height:46,borderRadius:15,background:"#fff",boxShadow:"0 2px 10px #21ea2d08"
          }}/>
          <div>
            <span style={{fontSize:"1.40em",fontWeight:900,color:"#159d6c"}}>LuciXFire Panel</span>
            <div style={{fontSize:".97em",fontWeight:500,color:"#375975",marginTop:2}}>Wallet Balance
              <b style={{marginLeft:12, color:"#11c05c",fontSize:"1.12em"}}>₹{balance}</b>
            </div>
          </div>
        </div>
        <div style={{position:"relative",marginRight:24}}>
          <button
            aria-label="Menu"
            onClick={()=>setMenuOpen(o=>!o)}
            style={{
              background:"none", border:"none", fontSize:"2em", color:"#1a376b", cursor:"pointer", padding:"8px 13px"
            }}>
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div style={{
              position:"absolute",right:0,top:44,background:"#fff",boxShadow:"0 4px 24px #ddfae219",
              borderRadius:13,minWidth:183,zIndex:15,padding:8
            }}>
              <button style={menuBtn} onClick={()=>{setMenuOpen(false);}}><FaUserCircle /> Profile</button>
              <button style={menuBtn} onClick={()=>{setMenuOpen(false);}}><FaHistory /> History</button>
              <button style={menuBtn} onClick={()=>{setFundModal(true);setMenuOpen(false);}}><FaWallet /> Add Funds</button>
              <button style={menuBtn} onClick={()=>{setMenuOpen(false);}}><FaCog /> Settings</button>
              <button style={menuBtn} onClick={()=>{
                const auth = getAuth(); signOut(auth); window.location.href="/login";
              }}><FaSignOutAlt /> Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Category selector */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent:"center", gap:13,
        maxWidth:910, margin:"32px auto 0"
      }}>
        {categories.map((cat) =>
          <button key={cat.name}
            style={{
              background:selectedCat===cat.name?"#fff1d9":cat.color, fontWeight:800,
              fontSize:"1.09em",padding:"14px 21px",border:"none",borderRadius:17,
              boxShadow:"0 1.5px 12px #22f2f30d",color:"#163b22",cursor:"pointer",
              outline:selectedCat===cat.name?"3px solid #ffe560":"none"
            }}
            onClick={()=>{setSelectedCat(cat.name);setSelected(null);setMsg("");}}
          >{cat.name}</button>
        )}
      </div>

      {/* Services */}
      <div style={{
        maxWidth:705, margin:"36px auto 0", background:"#fff",
        borderRadius:19, boxShadow:"0 5px 33px #05e7b93e", padding:"31px 19px"
      }}>
        <div style={{
          fontWeight:900, fontSize:"1.32em", marginBottom:17, color:"#13af58"
        }}>{selectedCat} Services</div>
        <div style={{
          display:"flex", flexDirection:"column",gap:17, marginBottom:10
        }}>
          {allServices.filter(s=>s.cat===selectedCat).map(s =>
            <div key={s.title} onClick={()=>{setSelected(s);setMsg("");}}
              style={{
                background:selected&&selected.title===s.title?"#ebfff4":"#fafffd",
                border:selected&&selected.title===s.title?"2.3px solid #24e991":"1.7px solid #eafcef",
                borderRadius:10,padding:"17px 13px 13px 13px",fontWeight:700,fontSize:"1.09em",
                display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",
                boxShadow:"0 1.5px 7px #22e7c609"
              }}>
              <div>
                <div style={{fontWeight:800, color:"#14bb47"}}>{s.title}</div>
                <div style={{color:"#153556",fontWeight:500,fontSize:".97em",margin:"4px 0 0 0"}}>{s.desc}</div>
                <div style={{fontWeight:500,fontSize:".96em",color:"#0eb97f",marginTop:5}}>
                  ₹{s.price} per 1K • Min {s.min} • Max {s.max}
                </div>
              </div>
              <div style={{
                background:"#1ae7a6",borderRadius:"50%",color:"#fff",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.19em"
              }}>
                {s.cat.slice(0,2)}
              </div>
            </div>
          )}
        </div>
        {selected &&
          <form onSubmit={handleOrder} style={{
            background:"#f6fbf4",borderRadius:12,boxShadow:"0 2px 12px #24d96614",padding:"16px 11px",marginTop:10
          }}>
            <div style={{fontWeight:700,marginBottom:8,color:"#0e7e53"}}>{selected.title}</div>
            <div style={{display:"flex",gap:13,marginBottom:13}}>
              <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Paste link" style={{
                flex:2,padding:"11px 7px",borderRadius:9,border:"1.2px solid #cdfce3",fontSize:"1em"
              }}/>
              <input type="number" value={qty} onChange={e=>setQty(e.target.value.replace(/^0+/, ""))} placeholder="Quantity" style={{
                flex:1, padding:"11px 7px",borderRadius:9,border:"1.2px solid #cdfce3",fontSize:"1em"
              }}/>
            </div>
            <div style={{fontWeight:600,color:"#16b355"}}>Total: ₹{selected.price && qty ? ((selected.price * qty) / 1000).toFixed(2) : "0.00"}</div>
            {msg && <div style={{marginTop:6,color:msg.startsWith("✅")?"#13c66a":"#e23a34", fontWeight:700}}>{msg}</div>}
            <button style={{
              marginTop:13, width:"100%",
              background:"linear-gradient(90deg,#13eb7e,#fbc931 98%)", color: "#222", border: "none",
              borderRadius: 9, fontWeight: 800, fontSize: "1.17em", padding:"12px 0",cursor:"pointer"
            }}>Place Order</button>
          </form>
        }
      </div>

      {/* Add Funds Modal */}
      {fundModal && (
        <div style={{
          position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"#19314444",
          zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"
        }}>
          <form onSubmit={handleAddFunds}
            style={{
              background:"#fff",borderRadius:19,padding:"36px 25px",maxWidth:360,width:"92vw",boxShadow:"0 8px 32px #01afe82d",position:"relative"
            }}>
            <button type="button" onClick={()=>setFundModal(false)} style={{
              border:"none",background: "none",color:"#fa556c", fontWeight:900, position:"absolute", top:15, right:23, fontSize:"1.7em",cursor:"pointer"
            }}>&times;</button>
            <div style={{fontWeight:800,fontSize:"1.19em",marginBottom:11,color:"#10a97b"}}>Add Funds</div>
            <input
              min={10}
              type="number"
              placeholder="Amount to add (₹)"
              value={fundAmount}
              onChange={e=>setFundAmount(e.target.value)}
              style={{
                fontWeight:600,fontSize:"1.08em",borderRadius:"10px",border:"1.4px solid #d5f5e8",background:"#fafdff",padding:"15px 13px",marginBottom:16
              }}
            />
            {fundMsg && (
              <div style={{marginBottom:8, color:fundMsg.startsWith("✅")?"#14b771":"#e63939",fontWeight:700}}>{fundMsg}</div>
            )}
            <button type="submit" style={{
              background:"linear-gradient(90deg,#20e178,#f9d032 101%)", color:"#fff",borderRadius:11,fontWeight:800,fontSize:"1.12em",padding:"14px 0",width:"100%",marginTop:4,border:"none"
            }}>Add Funds</button>
          </form>
        </div>
      )}
    </div>
  );
}
